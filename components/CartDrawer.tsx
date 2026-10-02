import type { CartLine } from "../types";
import { CONFIG } from "../config";

export default function CartDrawer({
  open,
  lines,
  onClose,
  onQty,
  onRemove,
  onClear,
  onCheckout,
}: {
  open: boolean;
  lines: CartLine[];
  onClose: () => void;
  onQty: (key: string, delta: number) => void;
  onRemove: (key: string) => void;
  onClear: () => void;
  onCheckout: () => void;
}) {
  if (!open) return null;
  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0);

  return (
    <>
      <div className="backdrop" onClick={onClose} />
      <aside className="drawer">
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom border-secondary-subtle">
          <h5 className="m-0 fw-bolder">🛒 سلة الطلبات</h5>
          <button className="btn btn-ghost btn-sm px-3" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="drawer-body">
          {lines.length === 0 && (
            <div className="text-center py-5 muted">
              <div style={{ fontSize: 48 }}>🍕</div>
              السلة فاضية… ابدأ اختار من المنيو!
            </div>
          )}

          {lines.map((l) => (
            <div
              key={l.key}
              className="d-flex gap-3 align-items-center bg-ovo-card rounded-4 p-2 mb-2"
            >
              {l.img && (
                <img
                  src={l.img}
                  alt={l.name}
                  width={64}
                  height={64}
                  className="rounded-3 object-fit-cover flex-shrink-0"
                  style={{ objectFit: "cover" }}
                />
              )}
              <div className="flex-grow-1 min-w-0">
                <div className="fw-bold small">{l.name}</div>
                {l.size && <div className="muted" style={{ fontSize: 12 }}>{l.size}</div>}
                <div className="text-gold fw-bolder small">
                  {l.unitPrice * l.qty} {CONFIG.currency}
                </div>
              </div>
              <div className="d-flex align-items-center gap-1">
                <button className="qty-btn" onClick={() => onQty(l.key, 1)}>
                  +
                </button>
                <span className="fw-bold px-1">{l.qty}</span>
                <button className="qty-btn" onClick={() => onQty(l.key, -1)}>
                  −
                </button>
                <button
                  className="qty-btn text-danger"
                  onClick={() => onRemove(l.key)}
                  title="حذف"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-top border-secondary-subtle">
          <div className="d-flex justify-content-between mb-1">
            <span className="muted">الإجمالي الفرعي</span>
            <span className="fw-bolder">
              {subtotal} {CONFIG.currency}
            </span>
          </div>
          <div className="muted mb-3" style={{ fontSize: 12 }}>
            * التوصيل والضريبة بيتحسبوا في صفحة إتمام الطلب.
          </div>
          <button
            className="btn btn-ovo w-100 mb-2"
            disabled={!lines.length}
            onClick={onCheckout}
          >
            إتمام الطلب وإرسال الفاتورة 📄
          </button>
          {!!lines.length && (
            <button className="btn btn-ghost w-100 btn-sm" onClick={onClear}>
              تفريغ السلة
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
