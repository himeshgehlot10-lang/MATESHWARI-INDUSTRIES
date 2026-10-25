export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number; // Calculated or custom percentage
  weight: string; // e.g., "500 g", "1 kg", "250 ml", "1 Pack (12 pcs)"
  images: string[]; // Primary image is images[0]
  features: string[]; // Bullet points e.g. ["100% Organic certified", "Rich in Omega-3"]
  description: string;
  inStock: boolean;
  sku?: string;
  badge?: string; // e.g. "Best Seller", "New", "Limited Stock", "Artisanal"
  rating?: number; // e.g. 4.9
  reviewCount?: number;
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  sellerWhatsApp: string; // E.g., "+91 98765 43210" or "919876543210"
  countryCode: string; // E.g., "+91", "+1", "+44"
  currencySymbol: string; // E.g., "₹", "$", "€", "£", "AED"
  currencyCode: string; // E.g., "INR", "USD", "EUR"
  announcementText: string;
  freeShippingAbove: number;
  standardDeliveryFee: number;
  logoUrl?: string;
  supportHours?: string;
  storeAddress?: string;
  adminPin?: string;
  ownerName?: string;
  ownerEmail?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | 'Pending Confirmation'
  | 'Processing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  weight: string;
  image: string;
}

export interface Order {
  id: string;
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
  discountSavings: number;
  deliveryFee: number;
  totalCost: number;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  customerNotes?: string;
  whatsappUrl?: string;
  statusHistory?: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
}

export type ViewMode = 'grid' | 'list';

export interface FilterState {
  searchQuery: string;
  selectedCategory: string;
  priceRange: [number, number];
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'discount' | 'name';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  category: 'daily_deal' | 'tip' | 'order_update' | 'new_batch';
  read: boolean;
  actionUrl?: string;
}
