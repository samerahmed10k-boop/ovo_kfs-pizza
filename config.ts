/* ===========================================================
   إعدادات مطعم OVO — غيّر القيم دي بس وكل حاجة هتشتغل
   =========================================================== */

export const CONFIG = {
  brand: "OVO",
  tagline: "بيتزا بالفرن الحجري",
  /** رقم واتساب المطعم بالصيغة الدولية بدون + وبدون أصفار */
  whatsapp: "201035215962",
  phoneDisplay: "0103 521 5962",
  hotline: "01035215962",
  taxId: "٥٤٨-٩٣٢-١١٧",
  commercialReg: "١٢٤٥٦٩",
  address: "٢٧ شارع التسعين الشمالي، التجمع الخامس، القاهرة الجديدة",
  hours: "يوميًا من ١٢ ظهرًا حتى ٣ صباحًا",
  mapUrl: "https://maps.google.com/?q=New+Cairo+Pizza",
  currency: "ج.م",
  /** رابط سكربت الـ PHP اللي بيستقبل الفاتورة ويحفظها على السيرفر (اختياري) */
  phpEndpoint: "/api/order.php",
  /** نسبة الخدمة داخل المطعم / التيك أواي */
  serviceRate: 0,
  vatRate: 0.14,
  minDeliveryOrder: 120,
};

export type Area = { name: string; fee: number; time: string };

export const AREAS: Area[] = [
  { name: "التجمع الخامس", fee: 20, time: "٢٥ - ٣٥ دقيقة" },
  { name: "الرحاب", fee: 25, time: "٣٠ - ٤٠ دقيقة" },
  { name: "مدينتي", fee: 30, time: "٣٥ - ٥٠ دقيقة" },
  { name: "مصر الجديدة", fee: 35, time: "٤٠ - ٥٥ دقيقة" },
  { name: "مدينة نصر", fee: 30, time: "٣٥ - ٥٠ دقيقة" },
  { name: "الشروق", fee: 30, time: "٣٥ - ٥٠ دقيقة" },
  { name: "العبور", fee: 35, time: "٤٥ - ٦٠ دقيقة" },
  { name: "المعادي", fee: 40, time: "٤٥ - ٦٠ دقيقة" },
];

export const PAYMENTS = [
  { id: "cash", label: "كاش عند الاستلام" },
  { id: "instapay", label: "انستا باي / محفظة إلكترونية" },
  { id: "card", label: "فيزا عند الاستلام (ماكينة)" },
];
