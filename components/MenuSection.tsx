import { useMemo, useState } from "react";
import { MENU, type MenuItem } from "../data/menu";
import { CONFIG } from "../config";
import Reveal from "./Reveal";

type AddFn = (item: MenuItem, sizeIdx: number) => void;

export default function MenuSection({ onAdd }: { onAdd: AddFn }) {
  const [active, setActive] = useState("all");
  const [q, setQ] = useState("");

  const cats = useMemo(() => {
    const term = q.trim().toLowerCase();
    return MENU.map((c) => ({
      ...c,
      items: c.items.filter(
        (i) =>
          !term ||
          i.name.toLowerCase().includes(term) ||
          i.desc.toLowerCase().includes(term),
      ),
    })).filter((c) => c.items.length && (active === "all" || active === c.id));
  }, [active, q]);

  return (
    <section className="section" id="menu">
      <div className="container">
        <div className="text-center mb-4">
          <div className="sec-kicker">OUR MENU</div>
          <h2 className="sec-title">المنيو الكامل 🍕</h2>
          <p className="muted mx-auto" style={{ maxWidth: 620 }}>
            أكتر من ٥٠ صنف… بيتزا، كالزوني، مكرونات، مقبلات، حلويات ومشروبات. كل
            الأسعار شاملة التحضير، والضريبة بتتحسب في الفاتورة.
          </p>
        </div>

        <div className="row justify-content-center mb-2">
          <div className="col-lg-5">
            <input
              className="form-control text-center"
              placeholder="🔎 دوّر على صنف… (بيبروني، باستا، تيراميسو)"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="cat-pills mb-4">
        <div className="container text-center">
          <button
            className={`pill ${active === "all" ? "active" : ""}`}
            onClick={() => setActive("all")}
          >
            🍽️ الكل
          </button>
          {MENU.map((c) => (
            <button
              key={c.id}
              className={`pill ${active === c.id ? "active" : ""}`}
              onClick={() => setActive(c.id)}
            >
              {c.icon} {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="container">
        {cats.length === 0 && (
          <p className="text-center muted py-5">
            مفيش نتائج لبحثك… جرب كلمة تانية 🙂
          </p>
        )}

        {cats.map((c) => (
          <div key={c.id} className="mb-5" id={c.id === "offers" ? "offers" : undefined}>
            <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
              <h3 className="fw-bolder m-0">
                <span className="me-2">{c.icon}</span>
                {c.name}
              </h3>
              <div className="divider-pizza flex-grow-1" />
              {c.note && <span className="muted small">{c.note}</span>}
            </div>

            <div className="row g-3 g-md-4">
              {c.items.map((item, idx) => (
                <div className="col-12 col-sm-6 col-lg-4 col-xxl-3" key={item.id}>
                  <Reveal dir="up" delay={(idx % 4) * 80} className="h-100">
                    <ItemCard item={item} onAdd={onAdd} />
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ItemCard({ item, onAdd }: { item: MenuItem; onAdd: AddFn }) {
  const [size, setSize] = useState(item.sizes ? 1 : 0);
  const price = item.sizes ? item.sizes[size].price : item.price || 0;
  const [added, setAdded] = useState(false);

  const add = () => {
    onAdd(item, size);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="item-card">
      <div className="item-img">
        <img src={item.img} alt={item.name} loading="lazy" />
        {item.badge && <span className="badge-top">{item.badge}</span>}
      </div>
      <div className="p-3 d-flex flex-column flex-grow-1">
        <div className="d-flex align-items-start justify-content-between gap-2">
          <h5 className="fw-bolder mb-1">{item.name}</h5>
          <div className="d-flex gap-1">
            {item.spicy && <span className="tag">🌶️ حار</span>}
            {item.veg && <span className="tag">🌱 نباتي</span>}
          </div>
        </div>
        <p className="muted small mb-3">{item.desc}</p>

        {item.sizes && (
          <div className="d-flex gap-2 mb-3">
            {item.sizes.map((s, i) => (
              <button
                key={s.label}
                className={`size-btn ${i === size ? "active" : ""}`}
                onClick={() => setSize(i)}
              >
                {s.label}
                <br />
                {s.price} ج
              </button>
            ))}
          </div>
        )}

        <div className="mt-auto d-flex align-items-center justify-content-between">
          <span className="price">
            {price} <small className="muted fw-normal">{CONFIG.currency}</small>
          </span>
          <button
            className={`btn ${added ? "btn-wa" : "btn-ovo"} btn-sm px-3`}
            onClick={add}
          >
            {added ? "✓ اتضاف" : "+ أضف للسلة"}
          </button>
        </div>
      </div>
    </div>
  );
}
