import { Product, StoreSettings, Order } from '../types';

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: "MATESHWARI INDUSTRIES",
  tagline: "Authentic Sojat Henna, Herbal Hair Henna & Pure Essential Oils",
  sellerWhatsApp: "+91 98765 43210",
  countryCode: "+91",
  currencySymbol: "₹",
  currencyCode: "INR",
  announcementText: "🌿 Pure Organic Sojat Henna & Henna Essential Oils • Factory Direct Pricing • Fast WhatsApp Dispatch",
  freeShippingAbove: 799,
  standardDeliveryFee: 50,
  logoUrl: "/assets/aistudio/Untitled_-_August_09__2026_at_10.03.21__1___1__3a8bff4a.png",
  supportHours: "9:00 AM - 8:00 PM (Mon-Sat)",
  storeAddress: "Industrial Area, Sojat City, Rajasthan - 306104",
  adminPin: "8899",
  ownerName: "Himesh Gehlot",
  ownerEmail: "himeshgehlot10@gmail.com"
};

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "henna-1",
    name: "Pure Sojat Body Art Grade Henna Powder (Triple Cloth Sifted)",
    category: "Henna Powder",
    price: 320,
    originalPrice: 450,
    discountPercent: 29,
    weight: "1 kg",
    images: [
      "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
    ],
    features: [
      "100% Pure Lawsonia Inermis harvested from renowned Sojat farms",
      "Micro-fine triple cloth filter sift (zero clogging in cone nozzles)",
      "High natural Lawsone pigment content for intense dark maroon stain",
      "Fresh green crop aroma, free from PPD, picramic acid, or synthetic dyes"
    ],
    description: "Our signature export-grade Henna powder sourced directly from the fields of Sojat, Rajasthan. Freshly harvested, sun-dried, and finely pulverized to create silky-smooth paste for professional bridal mehandi and festive body art.",
    inStock: true,
    sku: "MI-HEN-01KG",
    badge: "Best Seller",
    rating: 4.9,
    reviewCount: 318,
    createdAt: "2026-02-01T10:00:00.000Z"
  },
  {
    id: "henna-2",
    name: "Pure Nilgiri Eucalyptus Henna Essential Oil (High Cineole)",
    category: "Henna Essential Oils",
    price: 380,
    originalPrice: 520,
    discountPercent: 27,
    weight: "250 ml (Glass Bottle)",
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80"
    ],
    features: [
      "100% Pure Steam-Distilled Nilgiri Eucalyptus Oil",
      "Rich in monoterpenes (>85% Cineole) to accelerate dark henna oxidation",
      "Produces rich, lasting mahogany-black stain within 24-48 hours",
      "Therapeutic grade, skin-friendly, and soothing aroma"
    ],
    description: "Essential darkening oil trusted by professional bridal henna artists across India and abroad. Mixing 25-30ml per 100g of henna powder releases the deepest dye molecules and gives long-lasting stains.",
    inStock: true,
    sku: "MI-OIL-EUC250",
    badge: "Artist Choice",
    rating: 5.0,
    reviewCount: 245,
    createdAt: "2026-02-03T10:00:00.000Z"
  },
  {
    id: "henna-3",
    name: "Herbal Hair Henna Powder (Nourishing Ayurvedic Blend)",
    category: "Herbal Henna",
    price: 240,
    originalPrice: 320,
    discountPercent: 25,
    weight: "500 g",
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80"
    ],
    features: [
      "Fortified with Amla, Shikakai, Bhringraj, Brahmi & Reetha",
      "Restores natural scalp pH, controls dandruff and promotes hair growth",
      "Deep natural reddish-copper tint without damaging hair cuticles",
      "100% chemical-free hair conditioner and scalp revitalizer"
    ],
    description: "An ancient Ayurvedic hair treatment crafted with pure Rajasthani henna leaves and 9 potent herbs. Strengthens hair roots, adds brilliant bounce, volume, and conditions dry and frizzy strands naturally.",
    inStock: true,
    sku: "MI-HRB-500",
    badge: "100% Herbal",
    rating: 4.8,
    reviewCount: 182,
    createdAt: "2026-02-05T10:00:00.000Z"
  },
  {
    id: "henna-4",
    name: "Natural Black Hair Henna (Chemical-Free Grey Coverage)",
    category: "Hair Henna",
    price: 280,
    originalPrice: 390,
    discountPercent: 28,
    weight: "500 g",
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80"
    ],
    features: [
      "Perfect balanced blend of Pure Sojat Henna and Indigofera Leaf",
      "0% Ammonia, 0% PPD, 0% Resorcinol, 0% Peroxide",
      "Provides natural soft black shade with healthy mirror-like shine",
      "Safe for regular scalp touch-ups, sensitive skin & beard grooming"
    ],
    description: "Ditch chemical dyes! Mateshwari Industries Natural Black Henna gives rich black tones using purely plant-based ingredients. Coats every hair strand safely without burning or scalp irritation.",
    inStock: true,
    sku: "MI-BLK-500",
    badge: "PPD Free",
    rating: 4.9,
    reviewCount: 164,
    createdAt: "2026-02-08T10:00:00.000Z"
  },
  {
    id: "henna-5",
    name: "Cajeput & Tea Tree Henna Darkening Essential Oil Mix",
    category: "Henna Essential Oils",
    price: 450,
    originalPrice: 600,
    discountPercent: 25,
    weight: "200 ml",
    images: [
      "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80"
    ],
    features: [
      "Synergistic blend of Cajeput, Australian Tea Tree and Clove Bud Oil",
      "Ultra-high terpene concentration for the darkest bridal stains",
      "Pleasant refreshing herbal fragrance that masks raw henna smell",
      "UV-protected amber glass bottle with precision dropper"
    ],
    description: "Specially formulated by Mateshwari Industries for bridal mehendi masters seeking maximum color payoff. Cajeput terpenes bond with the henna lawsone molecules for an intense reddish-black hue.",
    inStock: true,
    sku: "MI-OIL-CAJ200",
    badge: "Top Rated",
    rating: 5.0,
    reviewCount: 97,
    createdAt: "2026-02-10T10:00:00.000Z"
  },
  {
    id: "henna-6",
    name: "Fresh Hand-Rolled Bridal Henna Cones (Pack of 12)",
    category: "Henna Powder",
    price: 360,
    originalPrice: 480,
    discountPercent: 25,
    weight: "12 Cones (approx 360 g)",
    images: [
      "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80"
    ],
    features: [
      "Handmade with fresh batch Sojat henna and pure essential oils",
      "0.38mm precision pin opening for intricate fine line detailing",
      "Smooth, stringy paste flow with zero bubbling or nozzle blockage",
      "Prepared fresh on order; vacuum packed for freshness"
    ],
    description: "Ready-to-use organic henna cones crafted daily. Filled with smooth, thoroughly strained Sojat henna paste infused with our signature essential oil mix for peak color payoff.",
    inStock: true,
    sku: "MI-CONE-12PK",
    badge: "Fresh Batch",
    rating: 4.9,
    reviewCount: 220,
    createdAt: "2026-02-12T10:00:00.000Z"
  },
  {
    id: "henna-7",
    name: "Pure Organic Indigo Powder (Neel Patta) for Hair",
    category: "Herbal Henna",
    price: 299,
    originalPrice: 400,
    discountPercent: 25,
    weight: "500 g",
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
    ],
    features: [
      "100% Pure Indigofera Tinctoria dried leaf powder",
      "Used with or after Henna for rich dark brown to jet black hair",
      "Free from additives, preservatives, or artificial blue dyes",
      "Triple pulverized for quick and easy clump-free mixing"
    ],
    description: "Pure green indigo powder harvested at peak potency. When combined in the 2-step henna-indigo method, it yields permanent deep black shades and full gray coverage naturally.",
    inStock: true,
    sku: "MI-IND-500",
    rating: 4.8,
    reviewCount: 140,
    createdAt: "2026-02-14T10:00:00.000Z"
  },
  {
    id: "henna-8",
    name: "Natural Burgundy Herbal Hair Henna (With Hibiscus & Manjistha)",
    category: "Hair Henna",
    price: 260,
    originalPrice: 350,
    discountPercent: 26,
    weight: "500 g",
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"
    ],
    features: [
      "Enriched with Hibiscus flower petals, Beetroot, and Manjistha",
      "Imparts elegant wine red / burgundy reflections in sunlight",
      "Deeply hydrates dry hair shafts and seals split ends",
      "Chemical-free conditioning pack for lustrous silky hair"
    ],
    description: "A botanical formulation blending Sojat henna with natural pigment herbs like Hibiscus and Manjistha root. Imparts gorgeous burgundy tones and leaves your hair glossy and manageable.",
    inStock: true,
    sku: "MI-BUR-500",
    badge: "Customer Favorite",
    rating: 4.9,
    reviewCount: 115,
    createdAt: "2026-02-16T10:00:00.000Z"
  }
];

export const DEFAULT_ORDERS: Order[] = [
  {
    id: "ORD-MI-9421",
    createdAt: "2026-02-20T11:20:00.000Z",
    items: [
      {
        productId: "henna-1",
        name: "Pure Sojat Body Art Grade Henna Powder (Triple Cloth Sifted)",
        price: 320,
        originalPrice: 450,
        quantity: 3,
        weight: "1 kg",
        image: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80"
      },
      {
        productId: "henna-2",
        name: "Pure Nilgiri Eucalyptus Henna Essential Oil (High Cineole)",
        price: 380,
        originalPrice: 520,
        quantity: 2,
        weight: "250 ml (Glass Bottle)",
        image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80"
      }
    ],
    subtotal: 1720,
    discountSavings: 670,
    deliveryFee: 0,
    totalCost: 1720,
    status: "Delivered",
    customerName: "Ananya Mehendi Arts",
    customerPhone: "+91 98234 11223",
    deliveryAddress: "Shop 14, Heritage Market, Jodhpur, Rajasthan - 342001",
    customerNotes: "Bulk order for wedding season. Packed very securely in moisture-proof cartons.",
    statusHistory: [
      { status: "Pending Confirmation", timestamp: "2026-02-20T11:20:00.000Z", note: "Order placed via WhatsApp catalog" },
      { status: "Processing", timestamp: "2026-02-20T12:00:00.000Z", note: "Fresh batch packed and batch tested" },
      { status: "Shipped", timestamp: "2026-02-21T09:30:00.000Z", note: "Dispatched via Express Courier AWB #MI-88192" },
      { status: "Delivered", timestamp: "2026-02-22T14:15:00.000Z", note: "Delivered to buyer" }
    ]
  },
  {
    id: "ORD-MI-8830",
    createdAt: "2026-02-22T16:45:00.000Z",
    items: [
      {
        productId: "henna-3",
        name: "Herbal Hair Henna Powder (Nourishing Ayurvedic Blend)",
        price: 240,
        originalPrice: 320,
        quantity: 2,
        weight: "500 g",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
      },
      {
        productId: "henna-4",
        name: "Natural Black Hair Henna (Chemical-Free Grey Coverage)",
        price: 280,
        originalPrice: 390,
        quantity: 2,
        weight: "500 g",
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"
      }
    ],
    subtotal: 1040,
    discountSavings: 380,
    deliveryFee: 0,
    totalCost: 1040,
    status: "Shipped",
    customerName: "Sunita Rathore",
    customerPhone: "+91 94140 77890",
    deliveryAddress: "C-42, Malviya Nagar, Jaipur, Rajasthan - 302017",
    customerNotes: "Please deliver between 10am - 2pm.",
    statusHistory: [
      { status: "Pending Confirmation", timestamp: "2026-02-22T16:45:00.000Z" },
      { status: "Processing", timestamp: "2026-02-23T08:30:00.000Z" },
      { status: "Shipped", timestamp: "2026-02-23T15:00:00.000Z", note: "Tracking: DTDC-774910" }
    ]
  }
];
