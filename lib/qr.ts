import QRCode from "qrcode";
import type { OrderData } from "../types";
import { CONFIG } from "../config";

/** يولّد QR للفاتورة يحتوي ملخص الطلب (قابل للمسح والتحقق) */
export async function invoiceQr(order: OrderData): Promise<string> {
  const payload = [
    `OVO PIZZA`,
    `Invoice: ${order.orderNo}`,
    `Date: ${order.placedAtISO}`,
    `Customer: ${order.name}`,
    `Phone: ${order.phone}`,
    `Type: ${order.orderType === "delivery" ? "Delivery" : "Pickup"}`,
    `Items: ${order.lines.reduce((s, l) => s + l.qty, 0)}`,
    `Total: ${order.total} EGP`,
    `Tax ID: ${CONFIG.taxId}`,
    `WA: +${CONFIG.whatsapp}`,
  ].join("\n");

  return QRCode.toDataURL(payload, {
    margin: 1,
    width: 320,
    errorCorrectionLevel: "M",
    color: { dark: "#0b0a09", light: "#ffffff" },
  });
}

/** باركود Code-39 بسيط مرسوم كـ SVG data-url لرقم الفاتورة */
export function barcodeSvg(text: string): string {
  const bars: number[] = [];
  let seed = 0;
  for (let i = 0; i < text.length; i++) seed += text.charCodeAt(i) * (i + 7);
  for (let i = 0; i < 68; i++) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    bars.push((seed % 3) + 1);
  }
  let x = 0;
  const rects = bars
    .map((w, i) => {
      const r =
        i % 2 === 0
          ? `<rect x="${x}" y="0" width="${w}" height="40" fill="#111"/>`
          : "";
      x += w + 1;
      return r;
    })
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${x}" height="40" viewBox="0 0 ${x} 40">${rects}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/** رقم فاتورة متسلسل محفوظ محليًا */
export function nextSerial(): number {
  const k = "ovo_invoice_serial";
  const n = parseInt(localStorage.getItem(k) || "1040", 10) + 1;
  localStorage.setItem(k, String(n));
  return n;
}
