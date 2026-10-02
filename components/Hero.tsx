import { CONFIG } from "../config";

const VIDEO =
  "https://videos.pexels.com/video-files/7090945/7090945-hd_1920_1080_25fps.mp4";
const POSTER =
  "https://images.pexels.com/videos/7090945/firin-pizza-7090945.jpeg?auto=compress&cs=tinysrgb&w=1600";

export default function Hero({ onOrder }: { onOrder: () => void }) {
  return (
    <header className="hero" id="home">
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={POSTER}
        preload="metadata"
        aria-hidden
      >
        <source src={VIDEO} type="video/mp4" />
      </video>

      <div className="container py-5">
        <div className="row">
          <div className="col-lg-8">
            <span className="chip mb-3">🔥 فرن حجري على حطب • عجينة تخمير ٤٨ ساعة</span>
            <h1 className="mb-3">
              بيتزا <span className="text-gold">OVO</span>
              <br />
              طعم إيطالي… بروح مصرية
            </h1>
            <p className="lead muted mb-4" style={{ maxWidth: 620 }}>
              من ٢٠١٤ وإحنا بنعجن كل يوم بالإيد، جبنة موتزاريلا ١٠٠٪، وصوص طماطم
              إيطالي أصلي. اطلب دلوقتي وفاتورتك PDF هتوصلك على الواتساب فورًا.
            </p>

            <div className="d-flex flex-wrap gap-3 mb-4">
              <button className="btn btn-ovo btn-lg" onClick={onOrder}>
                🍕 اطلب دلوقتي
              </button>
              <a href="#menu" className="btn btn-ghost btn-lg">
                شوف المنيو كامل
              </a>
            </div>

            <div className="d-flex flex-wrap gap-4 muted small">
              <span>⏱️ توصيل في ٣٠ دقيقة</span>
              <span>⭐ ٤.٩ من ٣٢٠٠ تقييم</span>
              <span>🛵 أقل أوردر دليفري {CONFIG.minDeliveryOrder} ج.م</span>
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-hint small">⌄ انزل تحت واختار أكلك</div>
    </header>
  );
}
