import { CONFIG, AREAS } from "../config";
import Logo from "./Logo";

const GALLERY = [
  "https://images.pexels.com/photos/13457624/pexels-photo-13457624.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/29021744/pexels-photo-29021744.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/12557604/pexels-photo-12557604.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/5627897/pexels-photo-5627897.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/7142957/pexels-photo-7142957.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4833636/pexels-photo-4833636.jpeg?auto=compress&cs=tinysrgb&w=800",
];

export function Features() {
  const F = [
    { i: "🔥", t: "فرن حجري على حطب", d: "حرارة ٤٥٠°م بتدي القاعدة قرمشة وطعم مدخن مميز." },
    { i: "🧀", t: "موتزاريلا ١٠٠٪", d: "جبنة طازة بتتقطع كل يوم الصبح، من غير بدائل." },
    { i: "⏱️", t: "تخمير ٤٨ ساعة", d: "عجينة خفيفة سهلة الهضم بطعم إيطالي أصيل." },
    { i: "🛵", t: "دليفري سريع", d: "شنط حرارية بتحافظ على البيتزا سخنة لحد باب بيتك." },
  ];
  return (
    <section className="section section-alt">
      <div className="container">
        <div className="row g-3 g-md-4">
          {F.map((f) => (
            <div className="col-6 col-lg-3" key={f.t}>
              <div className="feature">
                <div className="ico mb-2">{f.i}</div>
                <h6 className="fw-bolder">{f.t}</h6>
                <p className="muted small mb-0">{f.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks({ onOrder }: { onOrder: () => void }) {
  const S = [
    { n: "١", t: "اختار أكلك", d: "ضيف البيتزا والأصناف اللي عاجباك من المنيو للسلة." },
    { n: "٢", t: "املا الفورم", d: "اسمك، موبايلك، العنوان، دليفري ولا استلام، والدفع." },
    { n: "٣", t: "فاتورة PDF", d: "الموقع بيولّد فاتورة احترافية فيها كل تفاصيل الأوردر." },
    { n: "٤", t: "إرسال واتساب", d: "الفاتورة بتتحمّل وبنفتح واتساب المطعم برسالة الأوردر." },
  ];
  return (
    <section className="section" id="how">
      <div className="container">
        <div className="text-center mb-5">
          <div className="sec-kicker">HOW IT WORKS</div>
          <h2 className="sec-title">اطلب في ٤ خطوات</h2>
        </div>
        <div className="row g-4">
          {S.map((s) => (
            <div className="col-md-6 col-lg-3" key={s.n}>
              <div className="feature text-center">
                <div className="step-num mx-auto mb-3">{s.n}</div>
                <h6 className="fw-bolder">{s.t}</h6>
                <p className="muted small mb-0">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <button className="btn btn-ovo btn-lg" onClick={onOrder}>
            ابدأ أوردرك دلوقتي 🍕
          </button>
        </div>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section className="section section-alt" id="about">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <div className="sec-kicker">OUR STORY</div>
            <h2 className="sec-title mb-3">
              من فرن صغير… لأشهر بيتزا في <span className="text-gold">القاهرة</span>
            </h2>
            <p className="muted">
              بدأنا سنة ٢٠١٤ بفرن حجري واحد وحلم إننا نقدّم بيتزا نابولية حقيقية
              بسعر يناسب كل الناس. النهارده عندنا ٣ فروع وأكتر من ١.٢ مليون أوردر
              اتسلّم، ولسه بنعجن كل يوم الصبح بالإيد.
            </p>
            <p className="muted">
              كل مكوّن عندنا مختار بعناية: طماطم سان مارزانو، دقيق إيطالي نوع
              00، وزيت زيتون بكر ممتاز. ومفيش حاجة بتتعمل قبل ما تطلبها.
            </p>
            <div className="row text-center mt-4 g-3">
              {[
                ["1.2M+", "أوردر اتسلّم"],
                ["4.9★", "تقييم العملاء"],
                ["48h", "تخمير العجينة"],
                ["3", "فروع"],
              ].map(([a, b]) => (
                <div className="col-6 col-md-3 stat" key={b}>
                  <h3>{a}</h3>
                  <div className="muted small">{b}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-6">
            <div className="row g-3">
              {GALLERY.map((g, i) => (
                <div className={i % 3 === 0 ? "col-12" : "col-6"} key={g}>
                  <img src={g} alt="OVO" className="gallery-img" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Reviews() {
  const R = [
    { n: "أحمد م.", t: "أحسن بيبروني أكلتها في مصر، العجينة خفيفة والدليفري وصل سخن.", s: 5 },
    { n: "سارة ع.", t: "فكرة الفاتورة PDF على الواتس عملية جدًا، كل حاجة واضحة قبل ما أدفع.", s: 5 },
    { n: "محمود ك.", t: "طلبت بوكس الشلة لـ ٦ أفراد، السعر ممتاز والطعم ثابت كل مرة.", s: 5 },
  ];
  return (
    <section className="section">
      <div className="container">
        <div className="text-center mb-5">
          <div className="sec-kicker">REVIEWS</div>
          <h2 className="sec-title">الناس بتقول إيه؟</h2>
        </div>
        <div className="row g-4">
          {R.map((r) => (
            <div className="col-md-4" key={r.n}>
              <div className="review">
                <div className="text-gold mb-2">{"★".repeat(r.s)}</div>
                <p className="mb-3">“{r.t}”</p>
                <div className="fw-bolder small">{r.n}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section className="section section-alt" id="contact">
      <div className="container">
        <div className="row g-4 align-items-stretch">
          <div className="col-lg-5">
            <div className="sec-kicker">CONTACT</div>
            <h2 className="sec-title mb-3">تواصل معانا</h2>
            <ul className="list-unstyled muted lh-lg">
              <li>📍 {CONFIG.address}</li>
              <li>📞 {CONFIG.phoneDisplay}</li>
              <li>☎️ الخط الساخن: {CONFIG.hotline}</li>
              <li>🕒 {CONFIG.hours}</li>
            </ul>
            <a
              className="btn btn-wa mt-2 px-4 py-2"
              href={`https://wa.me/${CONFIG.whatsapp}`}
              target="_blank"
              rel="noreferrer"
            >
              💬 كلمنا على واتساب
            </a>
          </div>
          <div className="col-lg-7">
            <div className="feature h-100">
              <h6 className="fw-bolder mb-3">مناطق التوصيل ورسومها</h6>
              <div className="table-responsive">
                <table className="table table-dark table-borderless align-middle mb-0">
                  <thead>
                    <tr className="text-gold">
                      <th>المنطقة</th>
                      <th>الرسوم</th>
                      <th>الوقت المتوقع</th>
                    </tr>
                  </thead>
                  <tbody>
                    {AREAS.map((a) => (
                      <tr key={a.name}>
                        <td>{a.name}</td>
                        <td>{a.fee} ج.م</td>
                        <td className="muted">{a.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="ovo-footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <Logo size={56} />
            <p className="muted small mt-3">
              {CONFIG.tagline} — بنعمل بيتزا بضمير من ٢٠١٤. اطلب أونلاين واستلم
              فاتورتك PDF على واتساب فورًا.
            </p>
          </div>
          <div className="col-6 col-md-2">
            <h6 className="fw-bolder mb-3">روابط</h6>
            <ul className="list-unstyled muted small lh-lg">
              <li><a className="text-reset text-decoration-none" href="#menu">المنيو</a></li>
              <li><a className="text-reset text-decoration-none" href="#offers">العروض</a></li>
              <li><a className="text-reset text-decoration-none" href="#about">عننا</a></li>
              <li><a className="text-reset text-decoration-none" href="#contact">تواصل</a></li>
            </ul>
          </div>
          <div className="col-6 col-md-3">
            <h6 className="fw-bolder mb-3">مواعيد العمل</h6>
            <p className="muted small">{CONFIG.hours}</p>
            <p className="muted small">أقل أوردر دليفري: {CONFIG.minDeliveryOrder} ج.م</p>
          </div>
          <div className="col-md-3">
            <h6 className="fw-bolder mb-3">تابعنا</h6>
            <div className="d-flex gap-2">
              {["f", "ig", "tt", "X"].map((s) => (
                <span
                  key={s}
                  className="d-inline-grid"
                  style={{
                    width: 40,
                    height: 40,
                    placeItems: "center",
                    borderRadius: "50%",
                    border: "1px solid rgba(245,179,1,.3)",
                    color: "#f5b301",
                    fontWeight: 800,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
        <hr className="border-secondary mt-4" />
        <div className="text-center muted small">
          © {new Date().getFullYear()} OVO Pizza — جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
