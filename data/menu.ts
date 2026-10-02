export type Size = { label: string; price: number };

export type MenuItem = {
  id: string;
  name: string;
  desc: string;
  img: string;
  badge?: string;
  spicy?: boolean;
  veg?: boolean;
  /** لو الصنف بأحجام */
  sizes?: Size[];
  /** لو الصنف بسعر واحد */
  price?: number;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  note?: string;
  items: MenuItem[];
};

const IMG = {
  margherita:
    "https://images.pexels.com/photos/28945103/pexels-photo-28945103.jpeg?auto=compress&cs=tinysrgb&w=700",
  oven: "https://images.pexels.com/photos/29021744/pexels-photo-29021744.jpeg?auto=compress&cs=tinysrgb&w=700",
  pepperoni:
    "https://images.pexels.com/photos/28866020/pexels-photo-28866020.jpeg?auto=compress&cs=tinysrgb&w=700",
  neapolitan:
    "https://images.pexels.com/photos/29021738/pexels-photo-29021738.jpeg?auto=compress&cs=tinysrgb&w=700",
  olives:
    "https://images.pexels.com/photos/29021734/pexels-photo-29021734.jpeg?auto=compress&cs=tinysrgb&w=700",
  mushroom:
    "https://images.pexels.com/photos/29021737/pexels-photo-29021737.jpeg?auto=compress&cs=tinysrgb&w=700",
  margheritaOlive:
    "https://images.pexels.com/photos/29021747/pexels-photo-29021747.jpeg?auto=compress&cs=tinysrgb&w=700",
  classic:
    "https://images.pexels.com/photos/29021741/pexels-photo-29021741.jpeg?auto=compress&cs=tinysrgb&w=700",
  mix: "https://images.pexels.com/photos/13457624/pexels-photo-13457624.jpeg?auto=compress&cs=tinysrgb&w=700",
  duo: "https://images.pexels.com/photos/5903173/pexels-photo-5903173.jpeg?auto=compress&cs=tinysrgb&w=700",
  cream:
    "https://images.pexels.com/photos/3915855/pexels-photo-3915855.jpeg?auto=compress&cs=tinysrgb&w=700",
  boxes:
    "https://images.pexels.com/photos/7142957/pexels-photo-7142957.jpeg?auto=compress&cs=tinysrgb&w=700",
  sharing:
    "https://images.pexels.com/photos/12557604/pexels-photo-12557604.jpeg?auto=compress&cs=tinysrgb&w=700",
  slice:
    "https://images.pexels.com/photos/4833636/pexels-photo-4833636.jpeg?auto=compress&cs=tinysrgb&w=700",
  ingredients:
    "https://images.pexels.com/photos/5627897/pexels-photo-5627897.jpeg?auto=compress&cs=tinysrgb&w=700",
  mac: "https://images.pexels.com/photos/37284048/pexels-photo-37284048.jpeg?auto=compress&cs=tinysrgb&w=700",
  creamyPasta:
    "https://images.pexels.com/photos/34363091/pexels-photo-34363091.jpeg?auto=compress&cs=tinysrgb&w=700",
  fettuccine:
    "https://images.pexels.com/photos/4161714/pexels-photo-4161714.jpeg?auto=compress&cs=tinysrgb&w=700",
  fries:
    "https://images.pexels.com/photos/37284045/pexels-photo-37284045.jpeg?auto=compress&cs=tinysrgb&w=700",
  rigatoni:
    "https://images.pexels.com/photos/29039086/pexels-photo-29039086.jpeg?auto=compress&cs=tinysrgb&w=700",
  pastaTypes:
    "https://images.pexels.com/photos/15597774/pexels-photo-15597774.jpeg?auto=compress&cs=tinysrgb&w=700",
  mezze:
    "https://images.pexels.com/photos/15029824/pexels-photo-15029824.jpeg?auto=compress&cs=tinysrgb&w=700",
  salad:
    "https://images.pexels.com/photos/8743926/pexels-photo-8743926.jpeg?auto=compress&cs=tinysrgb&w=700",
  tiramisu:
    "https://images.pexels.com/photos/10170054/pexels-photo-10170054.jpeg?auto=compress&cs=tinysrgb&w=700",
  pannacotta:
    "https://images.pexels.com/photos/6373441/pexels-photo-6373441.jpeg?auto=compress&cs=tinysrgb&w=700",
  brownie:
    "https://images.pexels.com/photos/34623626/pexels-photo-34623626.jpeg?auto=compress&cs=tinysrgb&w=700",
  lemonDrink:
    "https://images.pexels.com/photos/15823325/pexels-photo-15823325.jpeg?auto=compress&cs=tinysrgb&w=700",
  icedTea:
    "https://images.pexels.com/photos/28944484/pexels-photo-28944484.jpeg?auto=compress&cs=tinysrgb&w=700",
  lemonade:
    "https://images.pexels.com/photos/3651045/pexels-photo-3651045.jpeg?auto=compress&cs=tinysrgb&w=700",
  sandwich:
    "https://images.pexels.com/photos/5713766/pexels-photo-5713766.jpeg?auto=compress&cs=tinysrgb&w=700",
};

const S = (s: number, m: number, l: number): Size[] => [
  { label: "صغير ٢٥سم", price: s },
  { label: "وسط ٣٠سم", price: m },
  { label: "لارج ٤٠سم", price: l },
];

export const MENU: Category[] = [
  {
    id: "offers",
    name: "عروض وكومبو",
    icon: "🔥",
    note: "عروض محدودة… متفوتهاش!",
    items: [
      {
        id: "of1",
        name: "كومبو العيلة",
        desc: "٢ بيتزا لارج + بطاطس كبير + ٤ مشروبات غازية + صوص اختيارك",
        img: IMG.boxes,
        badge: "الأكثر طلبًا",
        price: 520,
      },
      {
        id: "of2",
        name: "ديو OVO",
        desc: "٢ بيتزا وسط من اختيارك + خبز بالثوم والموتزاريلا",
        img: IMG.duo,
        badge: "وفر ٨٠ ج",
        price: 365,
      },
      {
        id: "of3",
        name: "بوكس الشلة",
        desc: "٣ بيتزا لارج + ١٢ قطعة ويدجز + ٦ مشروبات",
        img: IMG.sharing,
        badge: "لـ ٦ أشخاص",
        price: 780,
      },
      {
        id: "of4",
        name: "لانش بوكس الشغل",
        desc: "بيتزا صغير + سلطة سيزر + مشروب — متاح من ١٢ لـ ٤ العصر",
        img: IMG.slice,
        price: 165,
      },
      {
        id: "of5",
        name: "عرض الطالب",
        desc: "٢ سلايس + بطاطس صغير + مشروب (بالكارنيه)",
        img: IMG.mix,
        price: 95,
      },
    ],
  },
  {
    id: "classic",
    name: "البيتزا الكلاسيك",
    icon: "🍕",
    note: "عجينة تخمير ٤٨ ساعة، صوص طماطم إيطالي، موتزاريلا ١٠٠٪",
    items: [
      {
        id: "c1",
        name: "مارجريتا",
        desc: "صوص طماطم سان مارزانو، موتزاريلا طازة، ريحان، زيت زيتون بكر",
        img: IMG.margherita,
        veg: true,
        sizes: S(95, 135, 185),
      },
      {
        id: "c2",
        name: "بيبروني كلاسيك",
        desc: "بيبروني بقري مدخن، موتزاريلا، أوريجانو",
        img: IMG.pepperoni,
        badge: "بيست سيلر",
        sizes: S(115, 165, 225),
      },
      {
        id: "c3",
        name: "نابوليتانا",
        desc: "طماطم، موتزاريلا، زيتون أسود، كابر، ريحان",
        img: IMG.neapolitan,
        sizes: S(110, 155, 210),
      },
      {
        id: "c4",
        name: "فور تشيز",
        desc: "موتزاريلا، شيدر، بارميزان، جبنة رومي مع لمسة كريمة",
        img: IMG.cream,
        veg: true,
        sizes: S(125, 175, 240),
      },
      {
        id: "c5",
        name: "فنجي (مشروم)",
        desc: "مشروم طازة، موتزاريلا، زعتر بري، ثوم محمر",
        img: IMG.mushroom,
        veg: true,
        sizes: S(115, 160, 215),
      },
      {
        id: "c6",
        name: "فيجيتريان",
        desc: "فلفل ألوان، زيتون، بصل، مشروم، ذرة، طماطم كرزية",
        img: IMG.olives,
        veg: true,
        sizes: S(110, 155, 210),
      },
      {
        id: "c7",
        name: "هاواي",
        desc: "دجاج مدخن، أناناس، موتزاريلا، صوص خاص",
        img: IMG.margheritaOlive,
        sizes: S(120, 170, 230),
      },
      {
        id: "c8",
        name: "مارينارا",
        desc: "طماطم، ثوم، أوريجانو، زيت زيتون — بدون جبنة",
        img: IMG.classic,
        veg: true,
        sizes: S(85, 120, 165),
      },
    ],
  },
  {
    id: "signature",
    name: "سيجنتشر OVO",
    icon: "⭐",
    note: "وصفات الشيف الخاصة… مش هتلاقيها في مكان تاني",
    items: [
      {
        id: "s1",
        name: "OVO سوبريم",
        desc: "بيبروني، سجق إيطالي، لحمة مفرومة، فلفل، مشروم، زيتون",
        img: IMG.mix,
        badge: "سيجنتشر",
        sizes: S(150, 205, 275),
      },
      {
        id: "s2",
        name: "تشيكن رانش",
        desc: "دجاج مشوي، صوص رانش، بصل أحمر، موتزاريلا، بقدونس",
        img: IMG.duo,
        sizes: S(140, 190, 255),
      },
      {
        id: "s3",
        name: "بافلو سبايسي",
        desc: "دجاج بافلو حار، جلابينو، شيدر، صوص بلو تشيز",
        img: IMG.ingredients,
        spicy: true,
        sizes: S(145, 195, 265),
      },
      {
        id: "s4",
        name: "ترافل مشروم",
        desc: "كريمة ترافل، مشروم بورتوبيللو، بارميزان، روكا",
        img: IMG.mushroom,
        badge: "جديد",
        sizes: S(165, 225, 300),
      },
      {
        id: "s5",
        name: "بيف بستروما",
        desc: "بسطرمة مصرية، موتزاريلا، فلفل أخضر، طماطم",
        img: IMG.pepperoni,
        sizes: S(150, 205, 280),
      },
      {
        id: "s6",
        name: "فور سيزون",
        desc: "٤ أرباع مختلفة: لحمة، دجاج، خضار، جبن",
        img: IMG.sharing,
        sizes: S(155, 210, 285),
      },
      {
        id: "s7",
        name: "كرست سوسيدج",
        desc: "أطراف محشية سجق وجبنة + بيبروني وشيدر",
        img: IMG.slice,
        badge: "أطراف محشية",
        sizes: S(165, 220, 295),
      },
      {
        id: "s8",
        name: "شاورما بيتزا",
        desc: "شاورما فراخ، صوص طحينة، مخلل، بصل، موتزاريلا",
        img: IMG.boxes,
        sizes: S(145, 195, 265),
      },
      {
        id: "s9",
        name: "هوت هوني بيبروني",
        desc: "بيبروني كرسبي، عسل حار، فلفل أحمر مجروش",
        img: IMG.neapolitan,
        spicy: true,
        badge: "ترند",
        sizes: S(155, 210, 285),
      },
    ],
  },
  {
    id: "calzone",
    name: "كالزوني ورولز",
    icon: "🥟",
    items: [
      {
        id: "k1",
        name: "كالزوني لحمة",
        desc: "عجينة مطوية محشية لحمة مفرومة، جبنة، مشروم",
        img: IMG.sandwich,
        price: 155,
      },
      {
        id: "k2",
        name: "كالزوني فراخ",
        desc: "دجاج بالكريمة، موتزاريلا، فلفل ألوان",
        img: IMG.slice,
        price: 145,
      },
      {
        id: "k3",
        name: "كالزوني ٤ أجبان",
        desc: "موتزاريلا، شيدر، كريم تشيز، بارميزان",
        img: IMG.cream,
        veg: true,
        price: 140,
      },
      {
        id: "k4",
        name: "بيتزا رول (٦ قطع)",
        desc: "رولات عجينة بالبيبروني والجبنة مع صوص مارينارا",
        img: IMG.ingredients,
        price: 110,
      },
      {
        id: "k5",
        name: "ستريبس عجينة بالنوتيلا",
        desc: "عجينة طازة بالنوتيلا والبندق",
        img: IMG.brownie,
        price: 95,
      },
    ],
  },
  {
    id: "pasta",
    name: "مكرونات إيطالي",
    icon: "🍝",
    items: [
      {
        id: "p1",
        name: "بيني آلفريدو بالفراخ",
        desc: "صوص كريمي، دجاج مشوي، بارميزان",
        img: IMG.creamyPasta,
        price: 165,
      },
      {
        id: "p2",
        name: "سباجيتي بولونيز",
        desc: "لحمة مفرومة، صوص طماطم بطيء الطهي، ريحان",
        img: IMG.fettuccine,
        price: 175,
      },
      {
        id: "p3",
        name: "ريجاتوني أراببياتا",
        desc: "صوص طماطم حار، ثوم، فلفل تشيلي",
        img: IMG.rigatoni,
        spicy: true,
        veg: true,
        price: 140,
      },
      {
        id: "p4",
        name: "ماك آند تشيز",
        desc: "جبن شيدر وموتزاريلا بالفرن مع بيكون بقري",
        img: IMG.mac,
        price: 155,
      },
      {
        id: "p5",
        name: "لازانيا بالفرن",
        desc: "طبقات لازانيا باللحمة والبشاميل",
        img: IMG.pastaTypes,
        price: 185,
      },
    ],
  },
  {
    id: "sides",
    name: "مقبلات وجوانب",
    icon: "🍟",
    items: [
      {
        id: "d1",
        name: "جارليك بريد بالموتزاريلا",
        desc: "خبز طازة بزبدة الثوم والجبنة",
        img: IMG.mezze,
        price: 75,
      },
      { id: "d2", name: "بطاطس ويدجز", desc: "مقرمشة بالتوابل مع صوص الثوم", img: IMG.fries, price: 65 },
      { id: "d3", name: "بطاطس بالشيدر والبيكون", desc: "صوص شيدر سايح + بيكون بقري", img: IMG.fries, price: 95 },
      { id: "d4", name: "موتزاريلا ستيكس (٦)", desc: "جبنة مقرمشة مع صوص مارينارا", img: IMG.mezze, price: 90 },
      { id: "d5", name: "أجنحة بافلو (٨)", desc: "حار / باربيكيو / عسل وثوم", img: IMG.fries, spicy: true, price: 130 },
      { id: "d6", name: "تشيكن ناجتس (٩)", desc: "قطع دجاج مقرمشة مع صوصين", img: IMG.mezze, price: 110 },
      { id: "d7", name: "صوصات إضافية", desc: "رانش / باربيكيو / تشيز / ثوم / هوت صوص", img: IMG.ingredients, price: 15 },
    ],
  },
  {
    id: "salads",
    name: "سلطات",
    icon: "🥗",
    items: [
      { id: "l1", name: "سيزر بالفراخ", desc: "خس روماني، دجاج مشوي، بارميزان، كروتون", img: IMG.salad, price: 125 },
      { id: "l2", name: "سلطة كابريزي", desc: "طماطم، موتزاريلا طازة، ريحان، بلسمك", img: IMG.salad, veg: true, price: 115 },
      { id: "l3", name: "جرين جاردن", desc: "خضار موسمي، جرجير، ذرة، دريسنج ليمون", img: IMG.salad, veg: true, price: 85 },
      { id: "l4", name: "كول سلو", desc: "كرنب وجزر بصوص كريمي", img: IMG.salad, veg: true, price: 45 },
    ],
  },
  {
    id: "dessert",
    name: "حلويات",
    icon: "🍰",
    items: [
      { id: "ds1", name: "تيراميسو إيطالي", desc: "طبقات مسكربوني وقهوة وكاكاو", img: IMG.tiramisu, badge: "مفضل", price: 95 },
      { id: "ds2", name: "بانا كوتا", desc: "كريمة فانيليا مع صوص فواكه", img: IMG.pannacotta, price: 85 },
      { id: "ds3", name: "براوني بالشوكولاتة", desc: "ساخن مع آيس كريم فانيليا", img: IMG.brownie, price: 90 },
      { id: "ds4", name: "بيتزا نوتيلا", desc: "عجينة حلوة بالنوتيلا والفراولة والبندق", img: IMG.brownie, price: 140 },
      { id: "ds5", name: "تشيز كيك التوت", desc: "قطعة تشيز كيك بصوص التوت", img: IMG.tiramisu, price: 95 },
    ],
  },
  {
    id: "drinks",
    name: "مشروبات",
    icon: "🥤",
    items: [
      { id: "b1", name: "مشروب غازي (علبة)", desc: "بيبسي / سفن أب / ميرندا", img: IMG.icedTea, price: 25 },
      { id: "b2", name: "ليموناضة بالنعناع", desc: "فريش ومثلجة", img: IMG.lemonade, price: 45 },
      { id: "b3", name: "آيس تي خوخ", desc: "شاي مثلج منعش", img: IMG.icedTea, price: 45 },
      { id: "b4", name: "عصير برتقال فريش", desc: "معصور في اللحظة", img: IMG.lemonDrink, price: 55 },
      { id: "b5", name: "مياه معدنية", desc: "٦٠٠ مل", img: IMG.lemonade, price: 15 },
      { id: "b6", name: "إسبريسو إيطالي", desc: "حبوب محمصة طازة", img: IMG.brownie, price: 40 },
    ],
  },
];

export const ALL_ITEMS = MENU.flatMap((c) =>
  c.items.map((i) => ({ ...i, catId: c.id, catName: c.name })),
);
