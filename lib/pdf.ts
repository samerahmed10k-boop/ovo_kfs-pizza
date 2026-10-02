import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import type { OrderData } from "../types";
import { CONFIG } from "../config";

/** يحوّل عنصر HTML (ورقة الفاتورة) إلى ملف PDF بجودة طباعة */
export async function buildInvoicePdf(el: HTMLElement) {
  // ننسخ الورقة في منطقة مخفية بدون أي تحجيم (transform) علشان الالتقاط يطلع مظبوط
  const stage = document.createElement("div");
  stage.style.cssText =
    "position:fixed;top:0;left:-20000px;z-index:-1;background:#fff;";
  const clone = el.cloneNode(true) as HTMLElement;
  clone.style.transform = "none";
  stage.appendChild(clone);
  document.body.appendChild(stage);

  let canvas: HTMLCanvasElement;
  try {
    canvas = await html2canvas(clone, {
      scale: 2.5,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
      windowWidth: 794,
      width: 794,
    });
  } finally {
    stage.remove();
  }
  const imgData = canvas.toDataURL("image/jpeg", 0.96);
  const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait", compress: true });
  pdf.setProperties({
    title: `OVO PIZZA Invoice`,
    subject: "فاتورة ضريبية مبسطة - OVO PIZZA",
    author: "OVO PIZZA",
    keywords: "invoice, ovo, pizza, فاتورة",
    creator: "ovopizza.com",
  });
  const pw = pdf.internal.pageSize.getWidth();
  const ph = pdf.internal.pageSize.getHeight();
  const imgH = (canvas.height * pw) / canvas.width;

  pdf.addImage(imgData, "JPEG", 0, 0, pw, imgH);
  let remaining = imgH - ph;
  let offset = 0;
  while (remaining > 1) {
    offset -= ph;
    pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, offset, pw, imgH);
    remaining -= ph;
  }
  return pdf.output("blob") as Blob;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/** محاولة رفع الفاتورة على سيرفر PHP (لو متاح) علشان نبعت لينك مباشر في الواتس */
export async function uploadInvoice(
  blob: Blob,
  order: OrderData,
): Promise<string | null> {
  try {
    const fd = new FormData();
    fd.append("invoice", blob, `${order.orderNo}.pdf`);
    fd.append("order", JSON.stringify(order));
    const res = await fetch(CONFIG.phpEndpoint, { method: "POST", body: fd });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.ok && data.url) {
      return data.url.startsWith("http")
        ? data.url
        : new URL(data.url, window.location.origin).href;
    }
    return null;
  } catch {
    return null;
  }
}

const money = (n: number) => `${n.toLocaleString("ar-EG")} ${CONFIG.currency}`;

export function buildWhatsappText(order: OrderData, invoiceUrl: string | null) {
  const L = [
    `*طلب جديد من موقع ${CONFIG.brand} PIZZA* 🍕`,
    `رقم الفاتورة: *INV-${order.serial}*`,
    `رقم الطلب: *${order.orderNo}*`,
    `التاريخ: ${order.placedAt}`,
    "",
    "*بيانات العميل*",
    `الاسم: ${order.name}`,
    `الموبايل: ${order.phone}`,
    order.altPhone ? `رقم احتياطي: ${order.altPhone}` : "",
    `نوع الطلب: ${order.orderType === "delivery" ? "🛵 توصيل للمنزل" : "🏠 استلام من الفرع"}`,
    order.orderType === "delivery"
      ? `المنطقة: ${order.area}\nالعنوان: ${order.address}${order.building ? ` - عمارة ${order.building}` : ""}${order.floor ? ` - الدور ${order.floor}` : ""}${order.apartment ? ` - شقة ${order.apartment}` : ""}${order.landmark ? `\nعلامة مميزة: ${order.landmark}` : ""}`
      : `الاستلام من: ${CONFIG.address}`,
    `الموعد: ${order.when === "now" ? "في أقرب وقت" : `محدد الساعة ${order.timeSlot}`}`,
    `طريقة الدفع: ${order.payment}`,
    order.notes ? `ملاحظات: ${order.notes}` : "",
    "",
    "*تفاصيل الأوردر*",
    ...order.lines.map(
      (l, i) =>
        `${i + 1}) ${l.name}${l.size ? ` (${l.size})` : ""} × ${l.qty} = ${money(l.unitPrice * l.qty)}`,
    ),
    "",
    `الإجمالي الفرعي: ${money(order.subtotal)}`,
    order.orderType === "delivery" ? `التوصيل: ${money(order.deliveryFee)}` : "",
    `ضريبة ${Math.round(CONFIG.vatRate * 100)}%: ${money(order.vat)}`,
    `*الإجمالي النهائي: ${money(order.total)}*`,
    `الوقت المتوقع: ${order.eta}`,
    "",
    invoiceUrl
      ? `📄 فاتورة PDF: ${invoiceUrl}`
      : "📄 الفاتورة PDF اتحمّلت على جهازي وهبعتها هنا في الرسالة الجاية.",
  ];
  return L.filter(Boolean).join("\n");
}

export function openWhatsapp(text: string) {
  const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener");
}
