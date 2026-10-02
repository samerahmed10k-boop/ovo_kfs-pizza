<?php
/**
 * ===========================================================
 *  OVO PIZZA — Backend لاستقبال الأوردرات وحفظ فاتورة الـ PDF
 * ===========================================================
 *  الاستخدام:
 *   - ارفع مجلد dist كامل على استضافة بتدعم PHP (cPanel / Hostinger ...).
 *   - اعمل مجلد invoices جنب الملف ده وخليه قابل للكتابة (chmod 755/775).
 *   - الموقع بيبعت POST (multipart/form-data) فيه:
 *        invoice -> ملف PDF
 *        order   -> JSON بكل بيانات الطلب
 *   - السكربت بيرجع: { ok: true, url: "رابط الفاتورة", orderNo: "..." }
 *     والرابط ده بيتحط جوه رسالة الواتساب أوتوماتيك.
 * ===========================================================
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed'], JSON_UNESCAPED_UNICODE);
    exit;
}

/* ---------- 1) قراءة بيانات الطلب ---------- */
$raw   = $_POST['order'] ?? '{}';
$order = json_decode($raw, true);

if (!is_array($order) || empty($order['orderNo']) || empty($order['phone'])) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'بيانات الطلب ناقصة'], JSON_UNESCAPED_UNICODE);
    exit;
}

/* ---------- 2) تحقق إضافي من البيانات (Server side validation) ---------- */
$errors = [];
if (mb_strlen(trim($order['name'] ?? '')) < 3)                 $errors[] = 'الاسم غير صحيح';
if (!preg_match('/^01[0125][0-9]{8}$/', $order['phone']))      $errors[] = 'رقم الموبايل غير صحيح';
if (($order['orderType'] ?? '') === 'delivery' && mb_strlen(trim($order['address'] ?? '')) < 8) {
    $errors[] = 'عنوان التوصيل ناقص';
}
if (empty($order['lines']) || !is_array($order['lines']))      $errors[] = 'لا توجد أصناف في الطلب';

if ($errors) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'errors' => $errors], JSON_UNESCAPED_UNICODE);
    exit;
}

/* ---------- 3) حفظ ملف الفاتورة ---------- */
$dir = __DIR__ . '/invoices';
if (!is_dir($dir)) { @mkdir($dir, 0775, true); }

$orderNo  = preg_replace('/[^A-Za-z0-9\-_]/', '', $order['orderNo']);
$filename = $orderNo . '.pdf';
$target   = $dir . '/' . $filename;
$publicUrl = null;

if (!empty($_FILES['invoice']['tmp_name']) && is_uploaded_file($_FILES['invoice']['tmp_name'])) {
    if ($_FILES['invoice']['size'] > 8 * 1024 * 1024) {
        http_response_code(413);
        echo json_encode(['ok' => false, 'error' => 'حجم الملف كبير'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    if (move_uploaded_file($_FILES['invoice']['tmp_name'], $target)) {
        $base = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' ? 'https' : 'http')
              . '://' . $_SERVER['HTTP_HOST'] . rtrim(dirname($_SERVER['REQUEST_URI']), '/');
        $publicUrl = $base . '/invoices/' . $filename;
    }
}

/* ---------- 4) تسجيل الأوردر في ملف JSON (ممكن تستبدله بقاعدة بيانات) ---------- */
$logFile = __DIR__ . '/orders.json';
$all = file_exists($logFile) ? json_decode(file_get_contents($logFile), true) : [];
if (!is_array($all)) $all = [];
$order['invoiceUrl'] = $publicUrl;
$order['serverTime'] = date('Y-m-d H:i:s');
$order['ip']         = $_SERVER['REMOTE_ADDR'] ?? '';
$all[] = $order;
file_put_contents($logFile, json_encode($all, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);

/* ---------- 5) (اختياري) إرسال إيميل للمطعم بالفاتورة ---------- */
/*
$to = 'orders@ovopizza.com';
$subject = 'أوردر جديد ' . $orderNo;
$body = 'عميل: ' . $order['name'] . ' - موبايل: ' . $order['phone'] . ' - إجمالي: ' . $order['total'];
@mail($to, $subject, $body, "Content-Type: text/plain; charset=UTF-8");
*/

/* ---------- 6) (اختياري) إرسال تلقائي عبر WhatsApp Cloud API ----------
   محتاج TOKEN و PHONE_NUMBER_ID من Meta، وبعدها الفاتورة بتتبعت كـ Document.
$WA_TOKEN = 'EAAG...';
$WA_PHONE_ID = '1234567890';
$payload = [
  'messaging_product' => 'whatsapp',
  'to' => '2' . ltrim($order['phone'], '0'),
  'type' => 'document',
  'document' => ['link' => $publicUrl, 'filename' => $filename, 'caption' => 'فاتورة طلبك من OVO']
];
$ch = curl_init("https://graph.facebook.com/v20.0/$WA_PHONE_ID/messages");
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POST => true,
  CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $WA_TOKEN, 'Content-Type: application/json'],
  CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
]);
curl_exec($ch); curl_close($ch);
--------------------------------------------------------------------- */

echo json_encode([
    'ok'      => true,
    'orderNo' => $orderNo,
    'url'     => $publicUrl,
    'message' => 'تم استلام الطلب بنجاح',
], JSON_UNESCAPED_UNICODE);
