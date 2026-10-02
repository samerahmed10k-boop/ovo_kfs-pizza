import { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MenuSection from "./components/MenuSection";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import InvoicePreview from "./components/InvoicePreview";
import Reveal from "./components/Reveal";
import { About, Contact, Features, Footer, HowItWorks, Reviews } from "./components/Sections";
import type { MenuItem } from "./data/menu";
import type { CartLine, OrderData } from "./types";
import {
  buildInvoicePdf,
  buildWhatsappText,
  downloadBlob,
  openWhatsapp,
  uploadInvoice,
} from "./lib/pdf";
import { invoiceQr } from "./lib/qr";
import { CONFIG } from "./config";

const STORE_KEY = "ovo_cart_v1";

export default function App() {
  const [lines, setLines] = useState<CartLine[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [preview, setPreview] = useState<OrderData | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("جاري التجهيز…");
  const [toast, setToast] = useState<string | null>(null);
  const [done, setDone] = useState<OrderData | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(lines));
  }, [lines]);

  useEffect(() => {
    const lock = cartOpen || checkout || !!preview || !!done;
    document.body.style.overflow = lock ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, checkout, preview, done]);

  const count = lines.reduce((s, l) => s + l.qty, 0);
  const say = (m: string, ms = 1900) => {
    setToast(m);
    setTimeout(() => setToast(null), ms);
  };

  const addItem = (item: MenuItem, sizeIdx: number) => {
    const size = item.sizes ? item.sizes[sizeIdx].label : undefined;
    const unitPrice = item.sizes ? item.sizes[sizeIdx].price : item.price || 0;
    const key = `${item.id}__${size || "std"}`;
    setLines((prev) => {
      const ex = prev.find((l) => l.key === key);
      if (ex) return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l));
      return [...prev, { key, id: item.id, name: item.name, size, unitPrice, qty: 1, img: item.img }];
    });
    say(`تم إضافة ${item.name} للسلة ✓`);
  };

  const changeQty = (key: string, delta: number) =>
    setLines((prev) =>
      prev.map((l) => (l.key === key ? { ...l, qty: l.qty + delta } : l)).filter((l) => l.qty > 0),
    );

  /** بعد ملء الفورم: نولّد الـ QR ونفتح معاينة الفاتورة الحقيقية */
  const toPreview = async (order: OrderData) => {
    setBusy(true);
    setStatus("جاري إنشاء الفاتورة…");
    try {
      const qr = await invoiceQr(order);
      setPreview({ ...order, qr });
      setCheckout(false);
      setCartOpen(false);
    } catch {
      setPreview(order);
      setCheckout(false);
    } finally {
      setBusy(false);
    }
  };

  const makePdf = async () => {
    await new Promise((r) => setTimeout(r, 120));
    if (document.fonts?.ready) await document.fonts.ready;
    const el = invoiceRef.current;
    if (!el) throw new Error("no-invoice");
    return buildInvoicePdf(el);
  };

  const downloadOnly = async () => {
    if (!preview) return;
    setBusy(true);
    setStatus("جاري تجهيز الـ PDF…");
    try {
      const blob = await makePdf();
      downloadBlob(blob, `${preview.orderNo}-OVO-Invoice.pdf`);
      say("تم تحميل الفاتورة PDF ✓");
    } catch {
      say("حصلت مشكلة في توليد الفاتورة — جرب تاني 🙏", 3000);
    } finally {
      setBusy(false);
    }
  };

  const sendOrder = async () => {
    if (!preview) return;
    setBusy(true);
    try {
      setStatus("جاري تجهيز الفاتورة…");
      const blob = await makePdf();
      downloadBlob(blob, `${preview.orderNo}-OVO-Invoice.pdf`);

      setStatus("جاري رفع الفاتورة…");
      const url = await uploadInvoice(blob, preview);

      setStatus("جاري فتح واتساب…");
      openWhatsapp(buildWhatsappText(preview, url));

      setDone(preview);
      setPreview(null);
      setLines([]);
    } catch (e) {
      console.error(e);
      say("حصلت مشكلة في الإرسال — جرب تاني 🙏", 3000);
    } finally {
      setBusy(false);
    }
  };

  const openOrder = () => {
    if (!lines.length) {
      document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
      say("اختار أصنافك الأول من المنيو 🍕", 2200);
      return;
    }
    setCartOpen(true);
  };

  return (
    <>
      <Navbar count={count} onCart={() => setCartOpen(true)} />
      <Hero onOrder={openOrder} />

      <Reveal dir="up"><Features /></Reveal>
      <MenuSection onAdd={addItem} />
      <Reveal dir="up"><HowItWorks onOrder={openOrder} /></Reveal>
      <Reveal dir="up"><About /></Reveal>
      <Reveal dir="zoom"><Reviews /></Reveal>
      <Reveal dir="up"><Contact /></Reveal>
      <Footer />

      <a
        className="wa-fab"
        href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(
          "السلام عليكم، عايز أستفسر عن المنيو 🍕",
        )}`}
        target="_blank"
        rel="noreferrer"
        title={`واتساب المطعم +${CONFIG.whatsapp}`}
      >
        💬
      </a>

      {count > 0 && !cartOpen && !checkout && !preview && (
        <button className="cart-fab" onClick={() => setCartOpen(true)}>
          🛒 <span>السلة</span>
          <span className="cart-count">{count}</span>
        </button>
      )}

      <CartDrawer
        open={cartOpen && !checkout && !preview}
        lines={lines}
        onClose={() => setCartOpen(false)}
        onQty={changeQty}
        onRemove={(k) => setLines((p) => p.filter((l) => l.key !== k))}
        onClear={() => setLines([])}
        onCheckout={() => setCheckout(true)}
      />

      {checkout && (
        <CheckoutModal
          lines={lines}
          busy={busy}
          statusText={status}
          onClose={() => setCheckout(false)}
          onConfirm={toPreview}
        />
      )}

      {preview && (
        <InvoicePreview
          order={preview}
          busy={busy}
          status={status}
          invoiceRef={invoiceRef}
          onClose={() => {
            setPreview(null);
            setCheckout(true);
          }}
          onSend={sendOrder}
          onDownload={downloadOnly}
        />
      )}

      {done && (
        <>
          <div className="backdrop" onClick={() => setDone(null)} />
          <div className="ovo-modal">
            <div className="ovo-modal-card p-4 text-center" style={{ maxWidth: 560 }}>
              <div style={{ fontSize: 60 }}>✅</div>
              <h4 className="fw-bolder">تم إنشاء الفاتورة وإرسال طلبك!</h4>
              <p className="muted mb-2">
                فاتورة رقم <span className="text-gold fw-bolder">INV-{done.serial}</span> —
                طلب <span className="text-gold fw-bolder">{done.orderNo}</span> — الإجمالي{" "}
                {done.total} {CONFIG.currency}
              </p>
              <p className="muted small">
                الفاتورة PDF اتحمّلت على جهازك، والرسالة اتفتحت على واتساب المطعم{" "}
                <b>+{CONFIG.whatsapp}</b>. ارفق الملف واضغط إرسال ✅
              </p>
              <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center mt-3">
                <button
                  className="btn btn-wa px-4 py-2"
                  onClick={() => openWhatsapp(buildWhatsappText(done, null))}
                >
                  💬 فتح واتساب تاني
                </button>
                <button className="btn btn-ghost" onClick={() => setDone(null)}>
                  تمام، إقفل
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {toast && (
        <div
          className="toast-ovo position-fixed start-50 translate-middle-x bg-ovo-card border rounded-pill px-4 py-2 fw-bold"
          style={{ bottom: 90, zIndex: 1070, borderColor: "var(--ovo-line)" }}
        >
          {toast}
        </div>
      )}
    </>
  );
}
