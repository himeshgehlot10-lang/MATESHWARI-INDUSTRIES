import React, { useState, useEffect, useMemo } from 'react';
import { Product, StoreSettings, CartItem, Order, OrderStatus, FilterState, ViewMode, AppNotification } from './types';
import { DEFAULT_PRODUCTS, DEFAULT_STORE_SETTINGS, DEFAULT_ORDERS } from './data/defaultCatalog';
import { Header } from './components/Header';
import { Banner } from './components/Banner';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderHistory } from './components/OrderHistory';
import { AdminPanel } from './components/AdminPanel';
import { QuickToast } from './components/QuickToast';
import { NotificationCenter } from './components/NotificationCenter';
import { AdminAuthModal } from './components/AdminAuthModal';
import { 
  AboutSection, 
  QualityStandardsSection, 
  WholesaleSection, 
  ReviewsSection, 
  FAQSection,
  WhatsAppFloatingButton 
} from './components/WebsiteSections';
import { buildSingleProductWhatsAppMessage, createWhatsAppUrl, cleanPhoneNumber } from './utils/whatsapp';
import {
  shouldSendDailyNotification,
  recordDailyNotificationSent,
  getTodayNotificationTemplate,
  sendBrowserPushNotification,
} from './utils/notifications';
import { 
  ShoppingBag, 
  ArrowRight, 
  Store, 
  MapPin, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Heart,
  ChevronRight,
  ExternalLink,
  Lock,
  KeyRound
} from 'lucide-react';

const STORAGE_KEYS = {
  PRODUCTS: 'mateshwari_products_v2',
  SETTINGS: 'mateshwari_settings_v2',
  CART: 'mateshwari_cart_v2',
  ORDERS: 'mateshwari_orders_v2',
  NOTIFICATIONS: 'mateshwari_notifications_v1',
  DAILY_SUB: 'mateshwari_daily_subscribed_v1',
  ADMIN_AUTH: 'mateshwari_admin_auth_session_v1',
};

export default function App() {
  // Store Settings State
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.storeName === "Nature's Harvest Co." || !parsed.storeName) {
          parsed.storeName = "MATESHWARI INDUSTRIES";
          parsed.tagline = parsed.tagline === "Premium Organic Foods, Gourmet Dry Fruits & Artisan Spices"
            ? "Quality Manufacturing, Premium Products & Direct Supply"
            : parsed.tagline;
        }
        if (!parsed.adminPin) {
          parsed.adminPin = "8899";
        }
        if (!parsed.logoUrl || parsed.logoUrl.includes('image-removebg-preview')) {
          parsed.logoUrl = "/assets/aistudio/Untitled_-_August_09__2026_at_10.03.21__1___1__3a8bff4a.png";
        }
        return parsed;
      }
      return DEFAULT_STORE_SETTINGS;
    } catch {
      return DEFAULT_STORE_SETTINGS;
    }
  });

  // Products Catalog State
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  });

  // Shopping Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders History State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : DEFAULT_ORDERS;
    } catch {
      return DEFAULT_ORDERS;
    }
  });

  // Active View Tab: 'catalog' | 'orders' | 'admin'
  const [activeTab, setActiveTab] = useState<'catalog' | 'orders' | 'admin'>('catalog');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Seller Admin Security & Access Control State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);

  // Daily Notifications State
  const [isDailySubscribed, setIsDailySubscribed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DAILY_SUB);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (saved) {
        return JSON.parse(saved);
      }
      const todayTemplate = getTodayNotificationTemplate();
      return [
        {
          id: `notif-${Date.now()}`,
          title: todayTemplate.title,
          message: todayTemplate.message,
          category: todayTemplate.category,
          date: new Date().toISOString(),
          read: false,
        },
        {
          id: `notif-${Date.now() - 86400000}`,
          title: '🌿 Welcome to Mateshwari Industries Official Website',
          message: 'Direct manufacturer of authentic Sojat Henna, pure Henna Essential Oils & Herbal Hair Henna. Browse our full catalog or order on WhatsApp.',
          category: 'new_batch',
          date: new Date(Date.now() - 86400000).toISOString(),
          read: true,
        },
      ];
    } catch {
      return [];
    }
  });

  // Filters State
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedCategory: 'All',
    priceRange: [0, 5000],
    inStockOnly: false,
    sortBy: 'featured',
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DAILY_SUB, JSON.stringify(isDailySubscribed));
  }, [isDailySubscribed]);

  // Automated Daily Notification System Check (Every 24 Hours)
  useEffect(() => {
    if (!isDailySubscribed) return;

    if (shouldSendDailyNotification()) {
      const template = getTodayNotificationTemplate();
      const newDailyNotification: AppNotification = {
        id: `daily-notif-${Date.now()}`,
        title: template.title,
        message: template.message,
        category: template.category,
        date: new Date().toISOString(),
        read: false,
      };

      setNotifications((prev) => [newDailyNotification, ...prev]);
      recordDailyNotificationSent();
      sendBrowserPushNotification(template.title, template.message);
    }
  }, [isDailySubscribed]);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Smooth scroll handler for website navigation
  const handleScrollToSection = (sectionId: string) => {
    if (activeTab !== 'catalog') {
      setActiveTab('catalog');
    }
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Owner Access Control Handlers
  const handleRequestAdminAccess = () => {
    if (isAdminAuthenticated) {
      setActiveTab('admin');
    } else {
      setIsAdminAuthModalOpen(true);
    }
  };

  const handleAdminAuthSuccess = () => {
    setIsAdminAuthenticated(true);
    try {
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
    } catch {}
    setIsAdminAuthModalOpen(false);
    setActiveTab('admin');
  };

  const handleLockAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    } catch {}
    setActiveTab('catalog');
    showToast('🔒 Seller Admin locked successfully. PIN required to access.');
  };

  // Categories & Counts
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Search query
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.weight.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.features?.some((f) => f.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (filters.selectedCategory !== 'All') {
      list = list.filter((p) => p.category === filters.selectedCategory);
    }

    // In-stock only
    if (filters.inStockOnly) {
      list = list.filter((p) => p.inStock);
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price-low':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'discount':
        list.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
        break;
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        list.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
        break;
    }

    return list;
  }, [products, filters]);

  // Cart Handlers
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`🛒 Added "${product.name}" to cart!`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart');
  };

  const handleClearCart = () => {
    setCart([]);
    showToast('Cart cleared');
  };

  // Direct WhatsApp Button action on a product card
  const handleDirectWhatsAppOrder = (product: Product) => {
    const message = buildSingleProductWhatsAppMessage(product, settings, { quantity: 1 });
    const url = createWhatsAppUrl(settings.sellerWhatsApp, message);

    const originalPrice = product.originalPrice || product.price;
    const savings = originalPrice - product.price;

    const newOrder: Order = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      items: [
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          quantity: 1,
          weight: product.weight,
          image: product.images?.[0] || '',
        },
      ],
      subtotal: product.price,
      discountSavings: savings,
      deliveryFee: 0,
      totalCost: product.price,
      status: 'Pending Confirmation',
      customerName: 'Customer',
      customerPhone: '',
      deliveryAddress: 'Shared via WhatsApp chat',
      whatsappUrl: url,
      statusHistory: [
        {
          status: 'Pending Confirmation',
          timestamp: new Date().toISOString(),
          note: 'Direct WhatsApp order initiated with product image and specs',
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    window.open(url, '_blank');
    showToast('🚀 Opening WhatsApp with product photo & details...');
  };

  // Single Product Modal Order Completed
  const handleProductModalOrderCompleted = (
    product: Product,
    quantity: number,
    customerDetails: any
  ) => {
    const itemTotal = product.price * quantity;
    const originalTotal = (product.originalPrice || product.price) * quantity;
    const savings = originalTotal - itemTotal;

    const newOrder: Order = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      items: [
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          quantity,
          weight: product.weight,
          image: product.images?.[0] || '',
        },
      ],
      subtotal: itemTotal,
      discountSavings: savings,
      deliveryFee: 0,
      totalCost: itemTotal,
      status: 'Pending Confirmation',
      customerName: customerDetails.name || 'Customer',
      customerPhone: customerDetails.phone || '',
      deliveryAddress: customerDetails.address || 'Shared via WhatsApp chat',
      customerNotes: customerDetails.notes,
      statusHistory: [
        {
          status: 'Pending Confirmation',
          timestamp: new Date().toISOString(),
          note: 'Order sent via WhatsApp catalog',
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
  };

  // Cart Checkout Order Completed
  const handleCartOrderPlaced = (
    items: CartItem[],
    customerDetails: any,
    grandTotal: number
  ) => {
    const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const originalSubtotal = items.reduce(
      (acc, item) => acc + (item.product.originalPrice || item.product.price) * item.quantity,
      0
    );
    const discountSavings = originalSubtotal - subtotal;
    const deliveryFee = grandTotal - subtotal;

    const newOrder: Order = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      items: items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        price: i.product.price,
        originalPrice: i.product.originalPrice,
        quantity: i.quantity,
        weight: i.product.weight,
        image: i.product.images?.[0] || '',
      })),
      subtotal,
      discountSavings,
      deliveryFee,
      totalCost: grandTotal,
      status: 'Pending Confirmation',
      customerName: customerDetails.name || 'Valued Customer',
      customerPhone: customerDetails.phone || '',
      deliveryAddress: customerDetails.address || 'Shared via WhatsApp chat',
      customerNotes: customerDetails.notes,
      statusHistory: [
        {
          status: 'Pending Confirmation',
          timestamp: new Date().toISOString(),
          note: 'Cart order sent via WhatsApp',
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
  };

  // Re-order Items from Order History
  const handleReorder = (order: Order) => {
    const newItems: CartItem[] = [];

    order.items.forEach((ordItem) => {
      const match = products.find((p) => p.id === ordItem.productId);
      if (match) {
        newItems.push({ product: match, quantity: ordItem.quantity });
      } else {
        newItems.push({
          product: {
            id: ordItem.productId,
            name: ordItem.name,
            price: ordItem.price,
            originalPrice: ordItem.originalPrice,
            weight: ordItem.weight,
            images: [ordItem.image],
            category: 'Catalog Item',
            features: [],
            description: '',
            inStock: true,
            createdAt: new Date().toISOString(),
          },
          quantity: ordItem.quantity,
        });
      }
    });

    setCart(newItems);
    setIsCartOpen(true);
    showToast(`🛒 Added items from order ${order.id} into your cart!`);
  };

  // Seller Admin Handlers
  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleDeleteAllCatalog = () => {
    setProducts([]);
    showToast('🗑️ Entire catalog deleted successfully.');
  };

  const handleBulkDeleteProducts = (productIds: string[]) => {
    setProducts((prev) => prev.filter((p) => !productIds.includes(p.id)));
    showToast(`🗑️ Deleted ${productIds.length} products from catalog.`);
  };

  const handleBulkImport = (newProds: Product[]) => {
    setProducts((prev) => [...newProds, ...prev]);
  };

  const handleResetCatalog = () => {
    setProducts(DEFAULT_PRODUCTS);
  };

  const handleSaveSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const currentHist = o.statusHistory || [];
          return {
            ...o,
            status: newStatus,
            statusHistory: [
              ...currentHist,
              {
                status: newStatus,
                timestamp: new Date().toISOString(),
                note: `Status updated by merchant to ${newStatus}`,
              },
            ],
          };
        }
        return o;
      })
    );
    showToast(`Updated ${orderId} status to ${newStatus}`);
  };

  // Notification Handlers
  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('✓ Marked all notifications as read');
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    showToast('🗑️ Notification history cleared');
  };

  const handleSendTestNotification = () => {
    const templates = [
      {
        title: '🌿 Daily Henna Stain Booster Tip',
        message: 'Steam your freshly applied Henna with cloves or dab lemon-sugar juice for rich mahogany-dark stain!',
        category: 'tip' as const,
      },
      {
        title: '✨ Daily Special Factory Offer Active!',
        message: 'Order 1kg Pure Sojat Body Art Grade Henna today & get direct WhatsApp wholesale rates with fast dispatch across India.',
        category: 'daily_deal' as const,
      },
      {
        title: '📦 Fresh Batch Alert - Mateshwari Industries',
        message: 'Freshly harvested triple-cloth-sifted microfine Sojat Henna powder is freshly packed and ready for immediate dispatch.',
        category: 'new_batch' as const,
      },
      {
        title: '💧 Essential Oil Stain Darkening Secret',
        message: 'High-cineole Cajeput and Eucalyptus oils release Lawsone pigments faster. Add 25ml per 100g powder for rich maroon stains.',
        category: 'tip' as const,
      },
    ];
    const random = templates[Math.floor(Math.random() * templates.length)];
    const newNotif: AppNotification = {
      id: `notif-manual-${Date.now()}`,
      title: random.title,
      message: random.message,
      category: random.category,
      date: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    sendBrowserPushNotification(newNotif.title, newNotif.message);
    showToast(`🔔 Daily Alert sent: "${newNotif.title}"`);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900 scroll-smooth">
      {/* Top Header Navigation for Website */}
      <Header
        settings={settings}
        cartCount={totalCartCount}
        ordersCount={orders.length}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openCart={() => setIsCartOpen(true)}
        searchQuery={filters.searchQuery}
        setSearchQuery={(q) => setFilters((prev) => ({ ...prev, searchQuery: q }))}
        onNavigateSection={handleScrollToSection}
        onRequestAdmin={handleRequestAdminAccess}
        isAdminAuthenticated={isAdminAuthenticated}
      />

      {/* Main Website Content */}
      <main className="flex-1">
        {activeTab === 'catalog' && (
          <div>
            {/* Hero Brand Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Banner
                settings={settings}
                onExploreClick={() => {
                  const el = document.getElementById('catalog-grid');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                onOpenAdmin={handleRequestAdminAccess}
                onOpenWholesale={() => handleScrollToSection('wholesale')}
              />
            </div>

            {/* Products & Catalog Grid Section */}
            <section id="catalog-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Product Catalog & WhatsApp Ordering
                  </h2>
                  <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                    {filteredProducts.length} items available
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500">
                  Tap "Buy on WhatsApp" on any product to send an immediate purchase order with photos directly to our Sojat factory.
                </p>
              </div>

              {/* Category Filter & Controls */}
              <CategoryFilter
                categories={categories}
                productCounts={productCounts}
                filters={filters}
                setFilters={setFilters}
                viewMode={viewMode}
                setViewMode={setViewMode}
                totalProductsCount={products.length}
              />

              {/* Products Display */}
              {products.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center text-slate-500 my-8">
                  <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
                    <ShoppingBag className="w-8 h-8 text-rose-500" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-1">Your Catalog is Currently Empty</h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
                    The catalog has been cleared. You can upload custom Henna products with your own photos and prices, or restore the pre-loaded Mateshwari Industries catalog anytime.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={handleRequestAdminAccess}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-700 hover:from-amber-700 hover:via-amber-800 hover:to-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4 text-amber-200" />
                      <span>Upload New Products (Owner Only)</span>
                    </button>
                    <button
                      onClick={() => {
                        handleResetCatalog();
                        showToast('🔄 Restored default Mateshwari Industries Henna catalog!');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
                    >
                      <span>Restore Mateshwari Henna Catalog</span>
                    </button>
                  </div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500 my-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-50 to-emerald-50 text-amber-800 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">No products match your filter</h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-6">
                    Try clearing your search query or switching to another category.
                  </p>
                  <button
                    onClick={() =>
                      setFilters({
                        searchQuery: '',
                        selectedCategory: 'All',
                        priceRange: [0, 5000],
                        inStockOnly: false,
                        sortBy: 'featured',
                      })
                    }
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-700 hover:from-amber-700 hover:via-amber-800 hover:to-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'
                      : 'space-y-4'
                  }
                >
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      settings={settings}
                      viewMode={viewMode}
                      onAddToCart={(p) => handleAddToCart(p, 1)}
                      onQuickView={(p) => setSelectedProductModal(p)}
                      onDirectWhatsApp={handleDirectWhatsAppOrder}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Comprehensive Website Sections */}
            <AboutSection settings={settings} />
            <QualityStandardsSection />
            <WholesaleSection settings={settings} />
            <ReviewsSection />
            <FAQSection settings={settings} />
          </div>
        )}

        {/* Orders View */}
        {activeTab === 'orders' && (
          <OrderHistory
            orders={orders}
            settings={settings}
            onReorder={handleReorder}
            onBrowseCatalog={() => setActiveTab('catalog')}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            isSellerMode={true}
          />
        )}

        {/* Admin / Catalog Upload View (Protected by Owner Security PIN) */}
        {activeTab === 'admin' && (
          isAdminAuthenticated ? (
            <AdminPanel
              products={products}
              settings={settings}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onDeleteAllCatalog={handleDeleteAllCatalog}
              onBulkDeleteProducts={handleBulkDeleteProducts}
              onBulkImport={handleBulkImport}
              onResetCatalog={handleResetCatalog}
              onSaveSettings={handleSaveSettings}
              showToast={showToast}
              onSwitchToCustomerView={() => setActiveTab('catalog')}
              onLockAdmin={handleLockAdmin}
            />
          ) : (
            <div className="max-w-md mx-auto py-16 px-4">
              <div className="bg-white rounded-3xl border-2 border-amber-300 p-8 text-center shadow-xl space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto border border-amber-300">
                  <Lock className="w-8 h-8 text-amber-800" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black uppercase tracking-wider inline-block">
                  Protected • Owner Only
                </span>
                <h2 className="text-xl font-black text-slate-900">Seller Admin is Locked</h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Yeh section password-protected hai taaki koi bhi unauthorized vyakti ya customer aapke products ko badal ya delete na kar sake.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => setIsAdminAuthModalOpen(true)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-700 hover:from-amber-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2"
                  >
                    <KeyRound className="w-4 h-4 text-amber-200" />
                    <span>Enter Owner PIN to Unlock</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('catalog')}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                  >
                    Back to Storefront
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </main>

      {/* Floating Bottom Quick Cart Bar (Visible on mobile when items in cart) */}
      {cart.length > 0 && activeTab === 'catalog' && (
        <div className="fixed bottom-4 left-4 right-4 sm:hidden z-30 animate-in slide-in-from-bottom duration-200">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-700 hover:from-amber-700 hover:via-amber-800 hover:to-emerald-800 text-white rounded-2xl py-3 px-4 shadow-xl shadow-amber-900/20 flex items-center justify-between font-bold text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="bg-amber-950/40 text-amber-200 px-2 py-0.5 rounded-full text-xs border border-amber-400/20 font-bold">
                {totalCartCount} items
              </span>
              <span>View Shopping Cart</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>
                {settings.currencySymbol}
                {cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)}
              </span>
              <ArrowRight className="w-4 h-4 text-amber-200" />
            </div>
          </button>
        </div>
      )}

      {/* Floating WhatsApp Support Button */}
      <WhatsAppFloatingButton settings={settings} />

      {/* Product Details Modal */}
      <ProductModal
        product={selectedProductModal}
        settings={settings}
        onClose={() => setSelectedProductModal(null)}
        onAddToCart={handleAddToCart}
        onOrderCompleted={handleProductModalOrderCompleted}
        showToast={showToast}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        settings={settings}
        onOrderPlaced={handleCartOrderPlaced}
        showToast={showToast}
      />

      {/* Daily Notification Center Drawer */}
      <NotificationCenter
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onClearAll={handleClearNotifications}
        onSendTestNotification={handleSendTestNotification}
        isDailySubscribed={isDailySubscribed}
        onToggleDailySubscription={(enabled) => setIsDailySubscribed(enabled)}
        showToast={showToast}
      />

      {/* Seller Admin Security PIN Verification Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onSuccess={handleAdminAuthSuccess}
        settings={settings}
        showToast={showToast}
      />

      {/* Quick Action Toast */}
      <QuickToast message={toastMessage} />

      {/* Comprehensive Multi-Column Website Footer */}
      <footer className="bg-gradient-to-b from-stone-900 to-slate-950 text-slate-300 border-t border-amber-500/30 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
            
            {/* Column 1 & 2: Company Profile & Sojat Heritage */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white p-1.5 flex items-center justify-center border border-amber-300 shrink-0">
                  {settings.logoUrl ? (
                    <img
                      src={settings.logoUrl}
                      alt={settings.storeName}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <ShoppingBag className="w-6 h-6 text-amber-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-lg sm:text-xl text-white tracking-tight">
                    {settings.storeName}
                  </h3>
                  <span className="text-xs text-amber-300 font-semibold block">
                    Manufacturing Unit • Sojat City, Rajasthan
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Manufacturer and bulk exporter of 100% natural Sojat Henna powder, pure high-cineole essential oils, chemical-free herbal hair henna, and natural hair care formulations. We supply salons, bridal mehndi artists, and cosmetic brands across India with direct WhatsApp factory pricing.
              </p>

              <div className="flex items-center gap-2 pt-1 text-xs text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified Direct Manufacturer • 100% PPD Free Purity Guarantee</span>
              </div>
            </div>

            {/* Column 3: Quick Website Navigation */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-amber-500/20 pb-2">
                Website Links
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <button
                    onClick={() => handleScrollToSection('catalog-grid')}
                    className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                    <span>Product Catalog</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleScrollToSection('about')}
                    className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                    <span>About Sojat Factory</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleScrollToSection('quality')}
                    className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                    <span>Quality & Lab Standards</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleScrollToSection('wholesale')}
                    className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                    <span>Wholesale & B2B Supply</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleScrollToSection('reviews')}
                    className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                    <span>Artist Reviews</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleScrollToSection('faq')}
                    className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                    <span>FAQ & Support</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Product Specialties */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-amber-500/20 pb-2">
                Specialties
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li className="hover:text-amber-200 transition-colors">Triple Sifted Body Art Henna</li>
                <li className="hover:text-amber-200 transition-colors">Pure Cajeput Essential Oil</li>
                <li className="hover:text-amber-200 transition-colors">Pure Nilgiri (Eucalyptus) Oil</li>
                <li className="hover:text-amber-200 transition-colors">100% Chemical-Free Hair Henna</li>
                <li className="hover:text-amber-200 transition-colors">Ayurvedic Herbal Hair Care Packs</li>
                <li className="hover:text-amber-200 transition-colors">Bulk 25kg & 50kg Bags</li>
              </ul>
            </div>

            {/* Column 5: Factory Address & Contact */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-amber-500/20 pb-2">
                Factory Contact
              </h4>
              <div className="space-y-3 text-xs text-slate-400">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Sojat City, Pali District, Rajasthan - 306104, India</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <a
                    href={`tel:${settings.sellerWhatsApp}`}
                    className="hover:text-white transition-colors"
                  >
                    +91 {settings.sellerWhatsApp}
                  </a>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{settings.supportHours} (Dispatch within 24h)</span>
                </div>
                <div className="pt-2">
                  <a
                    href={`https://wa.me/${cleanPhoneNumber(settings.sellerWhatsApp, settings.countryCode)}?text=${encodeURIComponent(
                      `Hello ${settings.storeName}! I am contacting you from your website.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-900 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold transition-colors"
                  >
                    <span>Instant WhatsApp Chat</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span>© {new Date().getFullYear()} {settings.storeName}. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <button
                onClick={handleRequestAdminAccess}
                className="hover:text-amber-400 transition-colors flex items-center gap-1 font-semibold text-xs"
              >
                {isAdminAuthenticated ? (
                  <>
                    <Store className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Seller Portal (Unlocked)</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Seller Portal (Owner PIN)</span>
                  </>
                )}
              </button>
              <span>•</span>
              <button
                onClick={() => setActiveTab('orders')}
                className="hover:text-amber-400 transition-colors"
              >
                Track Orders
              </button>
              <span>•</span>
              <button
                onClick={() => handleScrollToSection('faq')}
                className="hover:text-amber-400 transition-colors"
              >
                Privacy & Terms
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
