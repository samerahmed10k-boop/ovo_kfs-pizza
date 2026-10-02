import { useEffect, useRef, useState } from "react";
import Invoice from "./Invoice";
import type { OrderData } from "../types";
import { CONFIG } from "../config";

export default function InvoicePreview({
  order,
  busy,
  status,
  onClose,
  onSend,
  onDownload,
  invoiceRef,
}: {
  order: OrderData;
  busy: boolean;
  status: string;
  onClose: () => void;
  onSend: () => void;
  onDownload: () => void;
  invoiceRef: React.RefObject<HTMLDivElement | null>;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.8);

  useEffect(() => {
    const fit = () => {
      const w = wrapRef.current?.clientWidth || 700;
      setScale(Math.min(1, (w - 28) / 794));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <>
      <div className="backdrop" onClick={busy ? undefined : onClose} />
      <div className="ovo-modal">
        <div className="ovo-modal-card p-3 p-md-4" style={{ maxWidth: 900 }}>
          <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
            <div>
              <div className="sec-kicker">INVOICE PREVIEW</div>
              <h4 className="fw-bolder m-0">معاينة الفاتورة قبل الإرسال 🧾</h4>
              <p className="muted small mb-0">
                فاتورة ضريبية مبسطة رقم <b className="text-gold">INV-{order.serial}</b> —
                راجع البيانات، وبعدين ابعتها على واتساب المطعم{" "}
                <span className="pulse-dot" /> <b>+{CONFIG.whatsapp}</b>
              </p>
            </div>
            <button className="btn btn-ghost btn-sm px-3" onClick={onClose} disabled={busy}>
              ✕
            </button>
          </div>

          <div className="inv-preview-wrap" ref={wrapRef}>
            <div
              className="inv-scaler"
              style={{
                transform: `scale(${scale})`,
                width: 794,
                height: 1123 * scale,
              }}
            >
              <Invoice ref={invoiceRef} order={order} />
            </div>
          </div>

          <div className="d-flex flex-column flex-sm-row gap-2 mt-3">
            <button className="btn btn-wa flex-grow-1 py-3" onClick={onSend} disabled={busy}>
              {busy ? (
                <>
                  <span className="spin me-2" /> {status}
                </>
              ) : (
                "📲 إنشاء الفاتورة وإرسالها على واتساب"
              )}
            </button>
            <button className="btn btn-ovo px-4" onClick={onDownload} disabled={busy}>
              ⬇️ تحميل PDF
            </button>
            <button className="btn btn-ghost" onClick={onClose} disabled={busy}>
              تعديل البيانات
            </button>
          </div>
          <p className="muted small text-center mt-3 mb-0">
            هيتم تحميل ملف PDF على جهازك وفتح محادثة واتساب المطعم برسالة فيها كل
            تفاصيل الأوردر — ارفق الملف واضغط إرسال ✅
          </p>
        </div>
      </div>
    </>
  );
}
