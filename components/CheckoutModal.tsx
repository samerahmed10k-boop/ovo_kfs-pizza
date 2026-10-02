import { useMemo, useState } from "react";
import { AREAS, CONFIG, PAYMENTS } from "../config";
import type { CartLine, OrderData, OrderType } from "../types";
import { nextSerial } from "../lib/qr";

type Form = {
  name: string;
  phone: string;
  altPhone: string;
  orderType: OrderType;
  area: string;
  address: string;
  building: string;
  floor: string;
  apartment: string;
  landmark: string;
  when: "now" | "later";
  timeSlot: string;
  payment: string;
  people: string;
  notes: string;
  agree: boolean;
};

const EMPTY: Form = {
  name: "",
  phone: "",
  altPhone: "",
  orderType: "delivery",
  area: AREAS[0].name,
  address: "",
  building: "",
  floor: "",
  apartment: "",
  landmark: "",
  when: "now",
  timeSlot: "",
  payment: PAYMENTS[0].label,
  people: "2",
  notes: "",
  agree: false,
};

const phoneOk = (v: string) => /^01[0125][0-9]{8}$/.test(v.replace(/\s/g, ""));

export default function CheckoutModal({
  lines,
  onClose,
  onConfirm,
  busy,
  statusText,
}: {
  lines: CartLine[];
  onClose: () => void;
  onConfirm: (order: OrderData) => void;
  busy: boolean;
  statusText: string;
}) {
  const [f, setF] = useState<Form>(EMPTY);
  const [touched, setTouched] = useState(false);

  const set = <K extends keyof Form>(k: K, v: Form[K]) =>
    setF((p) => ({ ...p, [k]: v }));

  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0);
  const area = AREAS.find((a) => a.name === f.area) || AREAS[0];
  const deliveryFee = f.orderType === "delivery" ? area.fee : 0;
  const vat = Math.round((subtotal + deliveryFee) * CONFIG.vatRate);
  const total = subtotal + deliveryFee + vat;

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (f.name.trim().length < 3) e.name = "اكتب الاسم بالكامل (٣ حروف على الأقل)";
    if (!phoneOk(f.phone))
      e.phone = "رقم موبايل مصري غير صحيح — مثال: 01012345678";
    if (f.altPhone && !phoneOk(f.altPhone))
      e.altPhone = "الرقم الاحتياطي غير صحيح";
    if (f.orderType === "delivery") {
      if (!f.area) e.area = "اختار المنطقة";
      if (f.address.trim().length < 8)
        e.address = "اكتب العنوان بالتفصيل (الشارع والحي)";
      if (!f.building.trim()) e.building = "رقم العمارة / الفيلا مطلوب";
      if (!f.floor.trim()) e.floor = "رقم الدور مطلوب";
      if (!f.apartment.trim()) e.apartment = "رقم الشقة مطلوب";
      if (subtotal < CONFIG.minDeliveryOrder)
        e.min = `أقل أوردر دليفري ${CONFIG.minDeliveryOrder} ج.م — ضيف أصناف تانية أو اختار الاستلام من الفرع`;
    }
    if (f.when === "later" && !f.timeSlot) e.timeSlot = "حدد معاد الاستلام/التوصيل";
    if (!f.payment) e.payment = "اختار طريقة الدفع";
    if (!f.agree) e.agree = "أكد إن البيانات صحيحة قبل الإرسال";
    if (!lines.length) e.cart = "السلة فاضية";
    return e;
  }, [f, subtotal, lines.length]);

  const valid = Object.keys(errors).length === 0;

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    setTouched(true);
    if (!valid || busy) {
      const first = document.querySelector(".is-invalid") as HTMLElement | null;
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const orderNo = `OVO-${String(now.getFullYear()).slice(2)}${pad(
      now.getMonth() + 1,
    )}${pad(now.getDate())}-${Math.floor(1000 + Math.random() * 9000)}`;

    const order: OrderData = {
      orderNo,
      serial: nextSerial(),
      placedAt: now.toLocaleString("ar-EG", {
        dateStyle: "full",
        timeStyle: "short",
      }),
      placedAtISO: now.toISOString().slice(0, 19).replace("T", " "),
      people: f.people,
      name: f.name.trim(),
      phone: f.phone.trim(),
      altPhone: f.altPhone.trim(),
      orderType: f.orderType,
      area: f.orderType === "delivery" ? f.area : "—",
      address: f.address.trim(),
      landmark: f.landmark.trim(),
      building: f.building.trim(),
      floor: f.floor.trim(),
      apartment: f.apartment.trim(),
      when: f.when,
      timeSlot: f.timeSlot,
      payment: f.payment,
      notes: f.notes.trim(),
      lines,
      subtotal,
      deliveryFee,
      vat,
      total,
      eta:
        f.when === "later"
          ? `حسب الموعد المحدد (${f.timeSlot})`
          : f.orderType === "delivery"
            ? area.time
            : "١٥ - ٢٠ دقيقة للاستلام",
    };
    onConfirm(order);
  };

  const inv = (k: string) => (touched && errors[k] ? "is-invalid" : "");

  return (
    <>
      <div className="backdrop" onClick={busy ? undefined : onClose} />
      <div className="ovo-modal">
        <div className="ovo-modal-card p-3 p-md-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <div className="sec-kicker">CHECKOUT</div>
              <h4 className="fw-bolder m-0">بيانات الأوردر 📄</h4>
              <p className="muted small mb-0">
                املا البيانات كلها صح، وهنولّد لك فاتورة PDF ونبعتها على واتساب
                المطعم.
              </p>
            </div>
            <button className="btn btn-ghost btn-sm px-3" onClick={onClose} disabled={busy}>
              ✕
            </button>
          </div>

          <form onSubmit={submit} noValidate>
            {/* نوع الطلب */}
            <div className="row g-2 mb-4">
              <div className="col-6">
                <div
                  className={`type-card ${f.orderType === "delivery" ? "active" : ""}`}
                  onClick={() => set("orderType", "delivery")}
                >
                  <div className="big">🛵</div>
                  <div className="fw-bolder">توصيل للمنزل</div>
                  <div className="muted" style={{ fontSize: 12 }}>
                    رسوم من {Math.min(...AREAS.map((a) => a.fee))} ج.م
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div
                  className={`type-card ${f.orderType === "pickup" ? "active" : ""}`}
                  onClick={() => set("orderType", "pickup")}
                >
                  <div className="big">🏠</div>
                  <div className="fw-bolder">استلام من المطعم</div>
                  <div className="muted" style={{ fontSize: 12 }}>
                    خصم وقت — جاهز في ١٥ دقيقة
                  </div>
                </div>
              </div>
            </div>

            {/* بيانات شخصية */}
            <h6 className="fw-bolder text-gold mb-2">١. بياناتك الشخصية</h6>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label req">الاسم بالكامل</label>
                <input
                  className={`form-control ${inv("name")}`}
                  value={f.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="مثال: محمد أحمد علي"
                />
                <div className="invalid-feedback">{errors.name}</div>
              </div>
              <div className="col-md-6">
                <label className="form-label req">رقم الموبايل (واتساب)</label>
                <input
                  className={`form-control ${inv("phone")}`}
                  value={f.phone}
                  inputMode="tel"
                  maxLength={11}
                  onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))}
                  placeholder="01xxxxxxxxx"
                />
                <div className="invalid-feedback">{errors.phone}</div>
              </div>
              <div className="col-md-6">
                <label className="form-label">رقم احتياطي (اختياري)</label>
                <input
                  className={`form-control ${inv("altPhone")}`}
                  value={f.altPhone}
                  inputMode="tel"
                  maxLength={11}
                  onChange={(e) => set("altPhone", e.target.value.replace(/\D/g, ""))}
                  placeholder="01xxxxxxxxx"
                />
                <div className="invalid-feedback">{errors.altPhone}</div>
              </div>
              <div className="col-md-6">
                <label className="form-label">عدد الأفراد</label>
                <select
                  className="form-select"
                  value={f.people}
                  onChange={(e) => set("people", e.target.value)}
                >
                  {["1", "2", "3", "4", "5", "6+"].map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* العنوان */}
            {f.orderType === "delivery" ? (
              <>
                <h6 className="fw-bolder text-gold mb-2">٢. عنوان التوصيل</h6>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label req">المنطقة</label>
                    <select
                      className={`form-select ${inv("area")}`}
                      value={f.area}
                      onChange={(e) => set("area", e.target.value)}
                    >
                      {AREAS.map((a) => (
                        <option key={a.name} value={a.name}>
                          {a.name} — توصيل {a.fee} ج.م ({a.time})
                        </option>
                      ))}
                    </select>
                    <div className="invalid-feedback">{errors.area}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label req">الشارع / الحي</label>
                    <input
                      className={`form-control ${inv("address")}`}
                      value={f.address}
                      onChange={(e) => set("address", e.target.value)}
                      placeholder="مثال: شارع التسعين الشمالي، الحي الأول"
                    />
                    <div className="invalid-feedback">{errors.address}</div>
                  </div>
                  <div className="col-4">
                    <label className="form-label req">عمارة / فيلا</label>
                    <input
                      className={`form-control ${inv("building")}`}
                      value={f.building}
                      onChange={(e) => set("building", e.target.value)}
                      placeholder="١٢"
                    />
                    <div className="invalid-feedback">{errors.building}</div>
                  </div>
                  <div className="col-4">
                    <label className="form-label req">الدور</label>
                    <input
                      className={`form-control ${inv("floor")}`}
                      value={f.floor}
                      onChange={(e) => set("floor", e.target.value)}
                      placeholder="٣"
                    />
                    <div className="invalid-feedback">{errors.floor}</div>
                  </div>
                  <div className="col-4">
                    <label className="form-label req">الشقة</label>
                    <input
                      className={`form-control ${inv("apartment")}`}
                      value={f.apartment}
                      onChange={(e) => set("apartment", e.target.value)}
                      placeholder="٧"
                    />
                    <div className="invalid-feedback">{errors.apartment}</div>
                  </div>
                  <div className="col-12">
                    <label className="form-label">علامة مميزة (اختياري)</label>
                    <input
                      className="form-control"
                      value={f.landmark}
                      onChange={(e) => set("landmark", e.target.value)}
                      placeholder="جنب صيدلية… / أمام نادي…"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <h6 className="fw-bolder text-gold mb-2">٢. فرع الاستلام</h6>
                <div className="bg-ovo-card rounded-4 p-3 mb-4">
                  <div className="fw-bolder mb-1">🏠 فرع التجمع الخامس</div>
                  <div className="muted small">{CONFIG.address}</div>
                  <div className="muted small">🕒 {CONFIG.hours}</div>
                  <a
                    className="btn btn-ghost btn-sm mt-2"
                    href={CONFIG.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    📍 افتح الخريطة
                  </a>
                </div>
              </>
            )}

            {/* الموعد والدفع */}
            <h6 className="fw-bolder text-gold mb-2">٣. الموعد وطريقة الدفع</h6>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label req">الموعد</label>
                <select
                  className="form-select"
                  value={f.when}
                  onChange={(e) => set("when", e.target.value as "now" | "later")}
                >
                  <option value="now">في أقرب وقت ⏱️</option>
                  <option value="later">أحدد معاد معين 🕒</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className={`form-label ${f.when === "later" ? "req" : ""}`}>
                  الساعة
                </label>
                <input
                  type="time"
                  className={`form-control ${inv("timeSlot")}`}
                  value={f.timeSlot}
                  disabled={f.when === "now"}
                  onChange={(e) => set("timeSlot", e.target.value)}
                />
                <div className="invalid-feedback">{errors.timeSlot}</div>
              </div>
              <div className="col-12">
                <label className="form-label req">طريقة الدفع</label>
                <div className="d-flex flex-wrap gap-2">
                  {PAYMENTS.map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      className={`pill ${f.payment === p.label ? "active" : ""}`}
                      onClick={() => set("payment", p.label)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="col-12">
                <label className="form-label">ملاحظات للمطبخ (اختياري)</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={f.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="مثال: بدون زيتون، زيادة جبنة، صوص حار على الجنب…"
                />
              </div>
            </div>

            {/* الملخص */}
            <div className="bg-ovo-card rounded-4 p-3 mb-3">
              <h6 className="fw-bolder mb-3">ملخص الطلب ({lines.length} صنف)</h6>
              <div style={{ maxHeight: 160, overflowY: "auto" }}>
                {lines.map((l) => (
                  <div
                    key={l.key}
                    className="d-flex justify-content-between small mb-1"
                  >
                    <span className="muted">
                      {l.name}
                      {l.size ? ` — ${l.size}` : ""} × {l.qty}
                    </span>
                    <span className="fw-bold">
                      {l.unitPrice * l.qty} {CONFIG.currency}
                    </span>
                  </div>
                ))}
              </div>
              <hr className="border-secondary" />
              <Line k="الإجمالي الفرعي" v={subtotal} />
              {f.orderType === "delivery" && <Line k="رسوم التوصيل" v={deliveryFee} />}
              <Line k={`ضريبة ${Math.round(CONFIG.vatRate * 100)}%`} v={vat} />
              <div className="d-flex justify-content-between fw-bolder fs-5 text-gold mt-2">
                <span>الإجمالي</span>
                <span>
                  {total} {CONFIG.currency}
                </span>
              </div>
              {touched && errors.min && (
                <div className="text-danger small mt-2 fw-bold">⚠️ {errors.min}</div>
              )}
            </div>

            <div className="form-check mb-3">
              <input
                className={`form-check-input ${inv("agree")}`}
                type="checkbox"
                id="agree"
                checked={f.agree}
                onChange={(e) => set("agree", e.target.checked)}
              />
              <label className="form-check-label small" htmlFor="agree">
                أقر إن كل البيانات اللي فوق صحيحة، وموافق على إرسال الفاتورة
                للمطعم عبر واتساب.
              </label>
              <div className="invalid-feedback d-block">
                {touched && errors.agree ? errors.agree : ""}
              </div>
            </div>

            {touched && !valid && (
              <div
                className="rounded-3 p-2 mb-3 small"
                style={{ background: "rgba(224,49,49,.12)", color: "#ff8787" }}
              >
                ⚠️ في بيانات ناقصة أو غير صحيحة — راجع الحقول المظللة بالأحمر.
              </div>
            )}

            <div className="d-flex flex-column flex-sm-row gap-2">
              <button className="btn btn-wa flex-grow-1 py-3" type="submit" disabled={busy}>
                {busy ? `⏳ ${statusText}` : "📄 تأكيد الطلب + إرسال الفاتورة على واتساب"}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={onClose}
                disabled={busy}
              >
                رجوع للسلة
              </button>
            </div>
            <p className="muted text-center small mt-3 mb-0">
              هيتم تحميل الفاتورة PDF على جهازك + فتح واتساب المطعم برسالة فيها كل
              تفاصيل الأوردر.
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

function Line({ k, v }: { k: string; v: number }) {
  return (
    <div className="d-flex justify-content-between small mb-1">
      <span className="muted">{k}</span>
      <span className="fw-bold">
        {v} {CONFIG.currency}
      </span>
    </div>
  );
}
