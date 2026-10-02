import { forwardRef } from "react";
import type { OrderData } from "../types";
import { CONFIG } from "../config";
import { barcodeSvg } from "../lib/qr";

const money = (n: number) =>
  `${n.toLocaleString("en-US", { minimumFractionDigits: 2 })} ${CONFIG.currency}`;

/** تحويل الرقم لكلمات بالعربي (للمبلغ المستحق) */
function numToArabicWords(num: number): string {
  const ones = ["", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة"];
  const teens = ["عشرة", "أحد عشر", "اثنا عشر", "ثلاثة عشر", "أربعة عشر", "خمسة عشر", "ستة عشر", "سبعة عشر", "ثمانية عشر", "تسعة عشر"];
  const tens = ["", "", "عشرون", "ثلاثون", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون", "تسعون"];
  const hundreds = ["", "مائة", "مائتان", "ثلاثمائة", "أربعمائة", "خمسمائة", "ستمائة", "سبعمائة", "ثمانمائة", "تسعمائة"];

  const below1000 = (n: number): string => {
    const parts: string[] = [];
    const h = Math.floor(n / 100);
    const r = n % 100;
    if (h) parts.push(hundreds[h]);
    if (r >= 10 && r < 20) parts.push(teens[r - 10]);
    else {
      const t = Math.floor(r / 10);
      const o = r % 10;
      if (o) parts.push(ones[o]);
      if (t) parts.push(tens[t]);
    }
    return parts.join(" و");
  };

  const n = Math.round(num);
  if (n === 0) return "صفر";
  const th = Math.floor(n / 1000);
  const rest = n % 1000;
  const parts: string[] = [];
  if (th === 1) parts.push("ألف");
  else if (th === 2) parts.push("ألفان");
  else if (th > 2) parts.push(`${below1000(th)} آلاف`);
  if (rest) parts.push(below1000(rest));
  return parts.join(" و") + " جنيهًا مصريًا فقط لا غير";
}

const Invoice = forwardRef<HTMLDivElement, { order: OrderData | null }>(
  ({ order }, ref) => {
    if (!order) return <div ref={ref} />;
    const d = order.orderType === "delivery";
    const qty = order.lines.reduce((s, l) => s + l.qty, 0);

    return (
      <div ref={ref} className="invoice-sheet">
        {/* ========== HEADER ========== */}
        <div className="inv-head">
          <div className="inv-head-right">
            <div className="inv-logo">
              <svg width="58" height="58" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="47" fill="#0b0a09" stroke="#f5b301" strokeWidth="3" />
                <path d="M50 22 L74 66 A27 27 0 0 1 26 66 Z" fill="#f5b301" />
                <circle cx="44" cy="56" r="4" fill="#e03131" />
                <circle cx="58" cy="52" r="3.4" fill="#e03131" />
                <circle cx="51" cy="66" r="3.4" fill="#e03131" />
              </svg>
              <div>
                <div className="inv-brand">OVO PIZZA</div>
                <div className="inv-sub">{CONFIG.tagline}</div>
              </div>
            </div>
            <div className="inv-contact">
              <div>📍 {CONFIG.address}</div>
              <div>📞 {CONFIG.phoneDisplay} &nbsp;|&nbsp; 💬 واتساب: +{CONFIG.whatsapp}</div>
              <div>
                س.ت: {CONFIG.commercialReg} &nbsp;|&nbsp; الرقم الضريبي: {CONFIG.taxId}
              </div>
            </div>
          </div>
          <div className="inv-head-left">
            <div className="inv-title">فاتورة ضريبية مبسطة</div>
            <div className="inv-title-en">TAX INVOICE</div>
            {order.qr && <img src={order.qr} alt="QR" className="inv-qr" />}
          </div>
        </div>

        {/* ========== META BAR ========== */}
        <div className="inv-meta">
          <Meta k="رقم الفاتورة" v={`INV-${order.serial}`} />
          <Meta k="رقم الطلب" v={order.orderNo} accent />
          <Meta k="التاريخ والوقت" v={order.placedAtISO} />
          <Meta k="نوع الطلب" v={d ? "توصيل 🛵" : "استلام 🏠"} />
          <Meta k="حالة الدفع" v={order.payment.includes("كاش") ? "غير مدفوعة" : "عند التأكيد"} />
        </div>

        {/* ========== PARTIES ========== */}
        <div className="inv-cols">
          <div className="inv-box">
            <div className="inv-box-t">بيانات العميل / Bill To</div>
            <Kv k="الاسم" v={order.name} />
            <Kv k="رقم الموبايل" v={order.phone} />
            <Kv k="رقم احتياطي" v={order.altPhone || "—"} />
            <Kv k="عدد الأفراد" v={order.people} />
          </div>
          <div className="inv-box">
            <div className="inv-box-t">{d ? "بيانات التوصيل / Delivery" : "بيانات الاستلام / Pickup"}</div>
            {d ? (
              <>
                <Kv k="المنطقة" v={order.area} />
                <Kv
                  k="العنوان"
                  v={`${order.address}${order.building ? ` - عمارة ${order.building}` : ""}${
                    order.floor ? ` - الدور ${order.floor}` : ""
                  }${order.apartment ? ` - شقة ${order.apartment}` : ""}`}
                />
                <Kv k="علامة مميزة" v={order.landmark || "—"} />
                <Kv k="الوقت المتوقع" v={order.eta} />
              </>
            ) : (
              <>
                <Kv k="الفرع" v="فرع التجمع الخامس" />
                <Kv k="العنوان" v={CONFIG.address} />
                <Kv k="مواعيد العمل" v={CONFIG.hours} />
                <Kv k="الجاهزية" v={order.eta} />
              </>
            )}
          </div>
        </div>

        {/* ========== ITEMS ========== */}
        <table className="inv-table">
          <thead>
            <tr>
              <th style={{ width: 34 }}>م</th>
              <th style={{ width: 78 }}>الكود</th>
              <th style={{ textAlign: "right" }}>الصنف / الوصف</th>
              <th style={{ width: 96 }}>الحجم</th>
              <th style={{ width: 52 }}>كمية</th>
              <th style={{ width: 92 }}>سعر الوحدة</th>
              <th style={{ width: 98 }}>الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            {order.lines.map((l, i) => (
              <tr key={l.key}>
                <td className="c">{i + 1}</td>
                <td className="c mono">{l.id.toUpperCase()}</td>
                <td className="b">{l.name}</td>
                <td className="c">{l.size || "—"}</td>
                <td className="c">{l.qty}</td>
                <td className="c">{money(l.unitPrice)}</td>
                <td className="c b">{money(l.unitPrice * l.qty)}</td>
              </tr>
            ))}
            <tr className="inv-sum-row">
              <td colSpan={4} className="b">إجمالي عدد القطع</td>
              <td className="c b">{qty}</td>
              <td className="b">الإجمالي الفرعي</td>
              <td className="c b">{money(order.subtotal)}</td>
            </tr>
          </tbody>
        </table>

        {/* ========== TOTALS ========== */}
        <div className="inv-bottom">
          <div className="inv-notes">
            <div className="inv-box-t">ملاحظات وشروط</div>
            <div className="inv-note-text">
              <b>ملاحظات العميل:</b> {order.notes || "لا توجد ملاحظات"}
            </div>
            <ul className="inv-terms">
              <li>الفاتورة دي إثبات طلب ويتم تأكيدها هاتفيًا/واتساب خلال ٥ دقائق.</li>
              <li>الأسعار بالجنيه المصري وشاملة ضريبة القيمة المضافة {Math.round(CONFIG.vatRate * 100)}%.</li>
              <li>الاسترجاع متاح خلال ١٥ دقيقة من الاستلام في حالة وجود عيب بالمنتج.</li>
              <li>طريقة الدفع المختارة: <b>{order.payment}</b>.</li>
            </ul>
            <div className="inv-barcode">
              <img src={barcodeSvg(order.orderNo)} alt="barcode" />
              <div className="mono">{order.orderNo}</div>
            </div>
          </div>

          <div className="inv-totals">
            <TRow k="الإجمالي الفرعي" v={money(order.subtotal)} />
            {d && <TRow k="رسوم التوصيل" v={money(order.deliveryFee)} />}
            <TRow k={`ض.ق.م (${Math.round(CONFIG.vatRate * 100)}%)`} v={money(order.vat)} />
            <TRow k="الخصم" v={money(0)} />
            <div className="inv-grand">
              <span>الإجمالي المستحق</span>
              <span>{money(order.total)}</span>
            </div>
            <div className="inv-words">فقط: {numToArabicWords(order.total)}</div>
            <div className="inv-stamp">
              <div>OVO PIZZA</div>
              <div className="s">تم الإصدار إلكترونيًا</div>
              <div className="s">{order.placedAtISO}</div>
            </div>
          </div>
        </div>

        {/* ========== FOOTER ========== */}
        <div className="inv-footer">
          شكرًا لاختيارك <b>OVO PIZZA</b> 🍕 — فاتورة رقم INV-{order.serial} صادرة
          إلكترونيًا ولا تحتاج توقيع.
          <br />
          للاستفسار أو الشكاوى: {CONFIG.phoneDisplay} — {CONFIG.hours}
        </div>
      </div>
    );
  },
);

Invoice.displayName = "Invoice";
export default Invoice;

function Meta({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="inv-meta-cell">
      <div className="k">{k}</div>
      <div className={`v ${accent ? "accent" : ""}`}>{v}</div>
    </div>
  );
}

function Kv({ k, v }: { k: string; v: string }) {
  return (
    <div className="inv-kv">
      <span className="k">{k}</span>
      <span className="v">{v}</span>
    </div>
  );
}

function TRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="inv-trow">
      <span>{k}</span>
      <span>{v}</span>
    </div>
  );
}
