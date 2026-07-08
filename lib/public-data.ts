import {
  Award,
  Cable,
  Flame,
  Gauge,
  HardHat,
  Lightbulb,
  ShieldCheck,
  Store,
  Truck,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type LocalizedText = {
  en: string;
  ur: string;
};

export type PublicProduct = {
  slug: string;
  name: LocalizedText;
  category: LocalizedText;
  summary: LocalizedText;
  description: LocalizedText;
  image: string;
  rating: number;
  specs: { label: LocalizedText; value: LocalizedText }[];
  features: LocalizedText[];
  applications: LocalizedText[];
};

export type PublicBlogPost = {
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  body: LocalizedText[];
  image: string;
  date: string;
  readTime: LocalizedText;
  category: LocalizedText;
};

export const company = {
  name: { en: "Gujranwala Electric Wires", ur: "گوجرانوالہ الیکٹرک وائرز" },
  tagline: { en: "Premium electrical wires, cables, and accessories for wholesale and retail supply.", ur: "ہول سیل اور ریٹیل سپلائی کے لیے پریمیم الیکٹریکل وائرز، کیبلز اور اسیسریز۔" },
  phone: "+92 55 428 1900",
  whatsapp: "+92 300 864 1900",
  email: "sales@gujranwalaelectric.com",
  address: {
    en: "Industrial Estate, Gujranwala, Punjab, Pakistan",
    ur: "انڈسٹریل اسٹیٹ، گوجرانوالہ، پنجاب، پاکستان",
  },
};

export const heroSlides = [
  {
    eyebrow: { en: "Premium electrical supply", ur: "پریمیم الیکٹریکل سپلائی" },
    title: { en: "Premium electrical supply from trusted brands.", ur: "قابل اعتماد برانڈز سے پریمیم الیکٹریکل سپلائی۔" },
    subtitle: {
      en: "Wholesale and retail supply of premium electrical wires, cables, accessories, and project-ready products.",
      ur: "پریمیم الیکٹریکل وائرز، کیبلز، اسیسریز اور پراجیکٹ مصنوعات کی ہول سیل اور ریٹیل سپلائی۔",
    },
    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=2200&q=85",
  },
  {
    eyebrow: { en: "Tested for demanding sites", ur: "مشکل سائٹس کے لیے ٹیسٹ شدہ" },
    title: { en: "Industrial-grade cables for dependable current flow.", ur: "قابل اعتماد کرنٹ فلو کے لیے صنعتی معیار کی کیبلز۔" },
    subtitle: {
      en: "We help customers select reliable branded products with clear specifications, fair dealing, and dependable availability for every site.",
      ur: "ہم ہر سائٹ کے لیے واضح اسپیسفکیشنز، مناسب ڈیلنگ اور قابل اعتماد دستیابی کے ساتھ برانڈڈ مصنوعات منتخب کرنے میں مدد دیتے ہیں۔",
    },
    image:
      "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=2200&q=85",
  },
  {
    eyebrow: { en: "Built for contractors", ur: "کنٹریکٹرز کے لیے تیار" },
    title: { en: "Reliable supply for buildings, plants, and power networks.", ur: "عمارتوں، پلانٹس اور پاور نیٹ ورکس کے لیے قابل اعتماد سپلائی۔" },
    subtitle: {
      en: "A responsive team, practical technical guidance, and a portfolio designed for real installation conditions and fast project delivery.",
      ur: "فوری رسپانس، عملی تکنیکی رہنمائی، اور حقیقی انسٹالیشن حالات اور تیز پراجیکٹ ڈیلیوری کے لیے ڈیزائن کردہ پورٹ فولیو۔",
    },
    image:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=2200&q=85",
  },
] as const;

export const categories = [
  {
    title: { en: "Building Wires", ur: "بلڈنگ وائرز" },
    description: { en: "Flexible PVC insulated wires for residential and commercial circuits.", ur: "رہائشی اور کمرشل سرکٹس کے لیے فلیکسیبل PVC انسولیٹڈ وائرز۔" },
    icon: Cable,
  },
  {
    title: { en: "Power Cables", ur: "پاور کیبلز" },
    description: { en: "Low-voltage and heavy-duty conductors for reliable distribution.", ur: "قابل اعتماد ڈسٹری بیوشن کے لیے لو وولٹیج اور ہیوی ڈیوٹی کنڈکٹرز۔" },
    icon: Zap,
  },
  {
    title: { en: "Fire Resistant", ur: "فائر ریزسٹنٹ" },
    description: { en: "Safer cabling options for critical areas and high-occupancy buildings.", ur: "اہم جگہوں اور بڑی عمارتوں کے لیے محفوظ کیبلنگ آپشنز۔" },
    icon: Flame,
  },
  {
    title: { en: "Lighting & Control", ur: "لائٹنگ اور کنٹرول" },
    description: { en: "Practical wires for panels, controls, fixtures, and daily site work.", ur: "پینلز، کنٹرولز، فکسچرز اور روزمرہ سائٹ ورک کے لیے عملی وائرز۔" },
    icon: Lightbulb,
  },
] satisfies { title: LocalizedText; description: LocalizedText; icon: LucideIcon }[];

export const products: PublicProduct[] = [
  {
    slug: "premium-copper-building-wire",
    name: { en: "Premium Copper Building Wire", ur: "پریمیم کاپر بلڈنگ وائر" },
    category: { en: "Building Wires", ur: "بلڈنگ وائرز" },
    summary: { en: "High-conductivity copper wire for everyday safe wiring.", ur: "روزمرہ محفوظ وائرنگ کے لیے ہائی کنڈکٹیویٹی کاپر وائر۔" },
    description: {
      en: "A dependable building wire range designed for contractors who need clean stripping, steady insulation quality, and predictable current carrying performance.",
      ur: "کنٹریکٹرز کے لیے ایک قابل اعتماد بلڈنگ وائر رینج جس میں صاف اسٹرپنگ، مستقل انسولیشن اور مستحکم کارکردگی شامل ہے۔",
    },
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1400&q=82",
    rating: 4.9,
    specs: [
      { label: { en: "Conductor", ur: "کنڈکٹر" }, value: { en: "Annealed copper", ur: "اینیلڈ کاپر" } },
      { label: { en: "Voltage", ur: "وولٹیج" }, value: { en: "450/750V", ur: "450/750V" } },
      { label: { en: "Insulation", ur: "انسولیشن" }, value: { en: "PVC compound", ur: "PVC کمپاؤنڈ" } },
    ],
    features: [
      { en: "Consistent diameter control", ur: "مستقل قطر کنٹرول" },
      { en: "Smooth installation pull", ur: "آسان انسٹالیشن پل" },
      { en: "Color-coded insulation", ur: "رنگوں والی انسولیشن" },
    ],
    applications: [
      { en: "Residential wiring", ur: "رہائشی وائرنگ" },
      { en: "Commercial interiors", ur: "کمرشل انٹیریئرز" },
      { en: "Distribution boards", ur: "ڈسٹری بیوشن بورڈز" },
    ],
  },
  {
    slug: "industrial-low-voltage-cable",
    name: { en: "Industrial Low Voltage Cable", ur: "انڈسٹریل لو وولٹیج کیبل" },
    category: { en: "Power Cables", ur: "پاور کیبلز" },
    summary: { en: "Durable multi-core cable for factories and commercial plants.", ur: "فیکٹریوں اور کمرشل پلانٹس کے لیے پائیدار ملٹی کور کیبل۔" },
    description: {
      en: "Designed for practical power distribution where mechanical durability, conductor integrity, and predictable supply are essential.",
      ur: "پاور ڈسٹری بیوشن کے لیے ڈیزائن کیا گیا جہاں مکینیکل پائیداری، کنڈکٹر سالمیت اور قابل اعتماد سپلائی ضروری ہیں۔",
    },
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1400&q=82",
    rating: 4.8,
    specs: [
      { label: { en: "Cores", ur: "کورز" }, value: { en: "2C to 4C", ur: "2C سے 4C" } },
      { label: { en: "Voltage", ur: "وولٹیج" }, value: { en: "0.6/1kV", ur: "0.6/1kV" } },
      { label: { en: "Sheath", ur: "شیتھ" }, value: { en: "PVC outer sheath", ur: "PVC آؤٹر شیتھ" } },
    ],
    features: [
      { en: "Heavy-duty outer protection", ur: "ہیوی ڈیوٹی بیرونی تحفظ" },
      { en: "Stable load performance", ur: "مستحکم لوڈ کارکردگی" },
      { en: "Batch-level quality checks", ur: "ہر بیچ کی کوالٹی چیکس" },
    ],
    applications: [
      { en: "Shop and building supply", ur: "دکان اور بلڈنگ سپلائی" },
      { en: "Commercial risers", ur: "کمرشل رائزرز" },
      { en: "Panel connections", ur: "پینل کنیکشنز" },
    ],
  },
  {
    slug: "fire-safe-circuit-cable",
    name: { en: "Fire Safe Circuit Cable", ur: "فائر سیف سرکٹ کیبل" },
    category: { en: "Fire Resistant", ur: "فائر ریزسٹنٹ" },
    summary: { en: "Enhanced protection for emergency and critical circuits.", ur: "ایمرجنسی اور اہم سرکٹس کے لیے بہتر تحفظ۔" },
    description: {
      en: "A safety-forward cable option for buildings where circuit continuity and reduced flame spread are key design requirements.",
      ur: "ایسی عمارتوں کے لیے سیفٹی فوکسڈ کیبل جہاں سرکٹ کنٹینیوٹی اور کم فلیم اسپریڈ اہم تقاضے ہیں۔",
    },
    image:
      "https://images.unsplash.com/photo-1581092919535-7146ff1a590b?auto=format&fit=crop&w=1400&q=82",
    rating: 4.7,
    specs: [
      { label: { en: "Use", ur: "استعمال" }, value: { en: "Critical circuits", ur: "اہم سرکٹس" } },
      { label: { en: "Design", ur: "ڈیزائن" }, value: { en: "Low smoke option", ur: "لو اسموک آپشن" } },
      { label: { en: "Testing", ur: "ٹیسٹنگ" }, value: { en: "Flame spread checks", ur: "فلیم اسپریڈ چیکس" } },
    ],
    features: [
      { en: "Safety-led insulation system", ur: "سیفٹی لیڈ انسولیشن سسٹم" },
      { en: "Emergency circuit readiness", ur: "ایمرجنسی سرکٹ تیاری" },
      { en: "Clear technical markings", ur: "واضح تکنیکی مارکنگ" },
    ],
    applications: [
      { en: "Hospitals", ur: "ہسپتال" },
      { en: "Shopping centers", ur: "شاپنگ سینٹرز" },
      { en: "Emergency lighting", ur: "ایمرجنسی لائٹنگ" },
    ],
  },
];

export const brands = [
  {
    name: "GEW ProLine",
    description: { en: "Premium wires for commercial-grade installation teams.", ur: "کمرشل انسٹالیشن ٹیموں کے لیے پریمیم وائرز۔" },
  },
  {
    name: "GEW PowerCore",
    description: { en: "Heavy-duty power cable portfolio for demanding loads.", ur: "مشکل لوڈز کے لیے ہیوی ڈیوٹی پاور کیبل پورٹ فولیو۔" },
  },
  {
    name: "GEW SafeFlex",
    description: { en: "Safety-focused flexible wiring for critical building zones.", ur: "اہم بلڈنگ زونز کے لیے سیفٹی فوکسڈ فلیکسیبل وائرنگ۔" },
  },
];

export const whyChoose = [
  { icon: ShieldCheck, title: { en: "Quality products", ur: "معیاری مصنوعات" }, text: { en: "We focus on trusted brands, clear specifications, and products customers can buy with confidence.", ur: "ہم قابل اعتماد برانڈز، واضح اسپیسفکیشنز اور اعتماد سے خریدی جانے والی مصنوعات پر فوکس کرتے ہیں۔" } },
  { icon: Store, title: { en: "Wholesale and retail", ur: "ہول سیل اور ریٹیل" }, text: { en: "Practical supply support for shops, contractors, builders, electricians, and home buyers.", ur: "دکانوں، کنٹریکٹرز، بلڈرز، الیکٹریشنز اور گھریلو خریداروں کے لیے عملی سپلائی سپورٹ۔" } },
  { icon: HardHat, title: { en: "Contractor-ready", ur: "کنٹریکٹر کے لیے تیار" }, text: { en: "Clear specifications, reliable availability, and site-friendly product ranges.", ur: "واضح اسپیسفکیشنز، قابل اعتماد دستیابی، اور سائٹ فرینڈلی مصنوعات۔" } },
  { icon: Truck, title: { en: "Responsive supply", ur: "فوری سپلائی" }, text: { en: "Commercial support for dealers, builders, and infrastructure buyers.", ur: "ڈیلرز، بلڈرز اور انفراسٹرکچر خریداروں کے لیے کمرشل سپورٹ۔" } },
];

export const processSteps = [
  { title: { en: "Product selection", ur: "پروڈکٹ انتخاب" }, text: { en: "Our team helps customers choose suitable wire type, size, brand, and quantity.", ur: "ہماری ٹیم صارفین کو مناسب وائر قسم، سائز، برانڈ اور مقدار منتخب کرنے میں مدد دیتی ہے۔" } },
  { title: { en: "Brand and stock check", ur: "برانڈ اور اسٹاک چیک" }, text: { en: "Available products are checked against customer needs before quotation or delivery.", ur: "قیمت یا ڈیلیوری سے پہلے دستیاب مصنوعات کسٹمر ضرورت کے مطابق چیک کی جاتی ہیں۔" } },
  { title: { en: "Quotation and supply", ur: "قیمت اور سپلائی" }, text: { en: "Wholesale and retail orders are prepared with clear product details and responsive support.", ur: "ہول سیل اور ریٹیل آرڈرز واضح پروڈکٹ تفصیل اور فوری سپورٹ کے ساتھ تیار ہوتے ہیں۔" } },
];

export const blogPosts: PublicBlogPost[] = [
  {
    slug: "choosing-cable-size-for-commercial-sites",
    title: { en: "How to choose cable size for commercial sites", ur: "کمرشل سائٹس کے لیے کیبل سائز کیسے منتخب کریں" },
    excerpt: { en: "A practical view of load, voltage drop, routing, and safety margins.", ur: "لوڈ، وولٹیج ڈراپ، روٹنگ اور سیفٹی مارجن کا عملی جائزہ۔" },
    body: [
      { en: "Cable sizing starts with the actual load profile, not only the connected equipment list. Contractors should consider current demand, future expansion, installation method, and ambient temperature.", ur: "کیبل سائزنگ اصل لوڈ پروفائل سے شروع ہوتی ہے، صرف آلات کی فہرست سے نہیں۔ کنٹریکٹرز کو کرنٹ ڈیمانڈ، مستقبل کی توسیع، انسٹالیشن طریقہ اور درجہ حرارت دیکھنا چاہیے۔" },
      { en: "Voltage drop and route length can change the final selection. Good documentation and product markings make installation teams faster and reduce rework on site.", ur: "وولٹیج ڈراپ اور روٹ لمبائی حتمی انتخاب بدل سکتے ہیں۔ اچھی ڈاکیومنٹیشن اور پروڈکٹ مارکنگ ٹیموں کو تیز بناتی ہے اور ری ورک کم کرتی ہے۔" },
    ],
    image:
      "https://images.unsplash.com/photo-1581091014534-8987c1d64718?auto=format&fit=crop&w=1400&q=82",
    date: "2026-06-18",
    readTime: { en: "5 min read", ur: "5 منٹ مطالعہ" },
    category: { en: "Engineering", ur: "انجینئرنگ" },
  },
  {
    slug: "why-insulation-quality-matters",
    title: { en: "Why insulation quality matters in building wires", ur: "بلڈنگ وائرز میں انسولیشن کوالٹی کیوں اہم ہے" },
    excerpt: { en: "Insulation consistency affects safety, handling, and long-term reliability.", ur: "انسولیشن کی مستقل مزاجی حفاظت، ہینڈلنگ اور طویل مدتی اعتماد پر اثر ڈالتی ہے۔" },
    body: [
      { en: "Good insulation is more than a colored outer layer. It supports electrical safety, helps wires survive site handling, and makes everyday installation smoother.", ur: "اچھی انسولیشن صرف رنگین بیرونی لیئر نہیں۔ یہ برقی حفاظت، سائٹ ہینڈلنگ اور روزمرہ انسٹالیشن کو بہتر بناتی ہے۔" },
      { en: "Batch consistency, visible markings, and clean stripping behavior all help contractors deliver cleaner work with fewer delays.", ur: "بیچ مستقل مزاجی، واضح مارکنگ اور صاف اسٹرپنگ کنٹریکٹرز کو کم تاخیر کے ساتھ بہتر کام کرنے میں مدد دیتی ہے۔" },
    ],
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1400&q=82",
    date: "2026-05-27",
    readTime: { en: "4 min read", ur: "4 منٹ مطالعہ" },
    category: { en: "Quality", ur: "کوالٹی" },
  },
  {
    slug: "buying-quality-wires-from-authorized-brands",
    title: { en: "Buying quality wires from authorized brands", ur: "مجاز برانڈز سے معیاری وائرز خریدنا" },
    excerpt: { en: "A practical look at brand trust, specifications, and buying confidence.", ur: "برانڈ اعتماد، اسپیسفکیشنز اور خریداری اعتماد کا عملی جائزہ۔" },
    body: [
      { en: "Buying from trusted electrical brands helps customers compare specifications, understand product use, and avoid low-quality alternatives.", ur: "قابل اعتماد الیکٹریکل برانڈز سے خریداری صارفین کو اسپیسفکیشنز سمجھنے، استعمال جاننے اور کم معیار متبادل سے بچنے میں مدد دیتی ہے۔" },
      { en: "For buyers, a reliable supplier should provide clear product details, responsive service, and suitable options for both retail and wholesale needs.", ur: "خریداروں کے لیے قابل اعتماد سپلائر کو واضح پروڈکٹ تفصیل، فوری سروس اور ریٹیل و ہول سیل ضروریات کے لیے مناسب آپشنز دینے چاہئیں۔" },
    ],
    image:
      "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=1400&q=82",
    date: "2026-04-12",
    readTime: { en: "6 min read", ur: "6 منٹ مطالعہ" },
    category: { en: "Buying Guide", ur: "خریداری گائیڈ" },
  },
];

export const reviews = [
  {
    name: { en: "Bilal Ahmed", ur: "بلال احمد" },
    role: { en: "Electrical Contractor", ur: "الیکٹریکل کنٹریکٹر" },
    quote: { en: "The wire finish and packaging make site work easier. Our teams can identify ratings quickly and installation stays smooth.", ur: "وائر فنش اور پیکنگ سائٹ ورک آسان بناتے ہیں۔ ہماری ٹیمیں ریٹنگز جلدی پہچانتی ہیں اور انسٹالیشن ہموار رہتی ہے۔" },
  },
  {
    name: { en: "Sara Malik", ur: "سارہ ملک" },
    role: { en: "Procurement Lead", ur: "پروکیورمنٹ لیڈ" },
    quote: { en: "Their product guidance is practical and the supply response is dependable for ongoing commercial projects.", ur: "ان کی پروڈکٹ رہنمائی عملی ہے اور جاری کمرشل منصوبوں کے لیے سپلائی رسپانس قابل اعتماد ہے۔" },
  },
  {
    name: { en: "Usman Rauf", ur: "عثمان رؤف" },
    role: { en: "Plant Engineer", ur: "پلانٹ انجینئر" },
    quote: { en: "We value consistent specs and clear communication. It helps our maintenance and expansion work move with confidence.", ur: "ہم مستقل اسپیکس اور واضح کمیونیکیشن کو اہم سمجھتے ہیں۔ اس سے مینٹیننس اور توسیعی کام اعتماد سے آگے بڑھتا ہے۔" },
  },
];

export const faqs = [
  {
    question: { en: "Do you sell both copper and aluminium cables?", ur: "کیا آپ کاپر اور ایلومینیم دونوں کیبلز فروخت کرتے ہیں؟" },
    answer: { en: "Yes. Our catalog includes premium wire and cable ranges for retail, wholesale, and project supply from authorized brands.", ur: "جی ہاں۔ ہماری کیٹلاگ میں مجاز برانڈز سے ریٹیل، ہول سیل اور پراجیکٹ سپلائی کے لیے پریمیم وائر اور کیبل رینجز شامل ہیں۔" },
  },
  {
    question: { en: "Can contractors request technical guidance?", ur: "کیا کنٹریکٹرز تکنیکی رہنمائی لے سکتے ہیں؟" },
    answer: { en: "Yes. Our sales team can help with product selection, quantity planning, and supply timing for active jobs.", ur: "جی ہاں۔ ہماری سیلز ٹیم فعال کاموں کے لیے پروڈکٹ انتخاب، مقدار کی منصوبہ بندی اور سپلائی کا وقت معلوم کرنے میں مدد کر سکتی ہے۔" },
  },
  {
    question: { en: "Do you support wholesale and retail orders?", ur: "کیا آپ ہول سیل اور ریٹیل دونوں آرڈرز کی حمایت کرتے ہیں؟" },
    answer: { en: "Yes. We support both small retail purchases and larger wholesale requirements for dealers, contractors, and project buyers.", ur: "جی ہاں۔ ہم چھوٹے ریٹیل خریداریوں اور ڈیلرز، کنٹریکٹرز اور پراجیکٹ خریداروں کے لیے بڑے ہول سیل تقاضوں کی دونوں طرح مدد کرتے ہیں۔" },
  },
];

export const stats = [
  { value: "25+", label: { en: "Product variants", ur: "پروڈکٹ ویریئنٹس" } },
  { value: "3x", label: { en: "Quality checkpoints", ur: "کوالٹی چیک پوائنٹس" } },
  { value: "24h", label: { en: "Inquiry response target", ur: "انکوائری رسپانس ہدف" } },
  { value: "PK", label: { en: "Local retail supply focus", ur: "لوکل ریٹیل سپلائی فوکس" } },
];

export const certifications = [
  { icon: Award, label: { en: "Standards-led process", ur: "معیار پر مبنی عمل" } },
  { icon: Gauge, label: { en: "Electrical performance checks", ur: "الیکٹریکل کارکردگی چیکس" } },
  { icon: ShieldCheck, label: { en: "Safety-first catalog", ur: "سیفٹی فرسٹ کیٹلاگ" } },
];
