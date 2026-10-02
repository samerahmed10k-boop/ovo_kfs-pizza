import { useEffect, useState } from "react";
import Logo from "./Logo";

const LINKS = [
  { href: "#home", label: "الرئيسية" },
  { href: "#menu", label: "المنيو" },
  { href: "#offers", label: "العروض" },
  { href: "#how", label: "إزاي تطلب" },
  { href: "#about", label: "عننا" },
  { href: "#contact", label: "تواصل" },
];

export default function Navbar({
  count,
  onCart,
}: {
  count: number;
  onCart: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    h();
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav className={`ovo-nav ${scrolled ? "scrolled" : ""}`}>
      <div className="container d-flex align-items-center justify-content-between">
        <a href="#home" className="text-decoration-none">
          <Logo size={scrolled ? 40 : 48} />
        </a>

        <div className="d-none d-lg-flex align-items-center gap-1">
          {LINKS.map((l) => (
            <a key={l.href} className="nav-link" href={l.href}>
              {l.label}
            </a>
          ))}
        </div>

        <div className="d-flex align-items-center gap-2">
          <a href="#menu" className="btn btn-ghost d-none d-md-inline-flex align-items-center gap-2 py-2">
            🍕 المنيو
          </a>
          <button className="btn btn-ovo d-flex align-items-center gap-2" onClick={onCart}>
            🛒 <span className="d-none d-sm-inline">السلة</span>
            {count > 0 && <span className="cart-count">{count}</span>}
          </button>
          <button
            className="btn btn-ghost d-lg-none px-3"
            onClick={() => setOpen((o) => !o)}
            aria-label="القائمة"
          >
            ☰
          </button>
        </div>
      </div>

      {open && (
        <div className="mobile-menu d-lg-none mt-2 py-2">
          <div className="container d-flex flex-column">
            {LINKS.map((l) => (
              <a
                key={l.href}
                className="nav-link py-2"
                href={l.href}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
