import React, { useState } from 'react';
import { 
  ShoppingBag, 
  ShoppingCart, 
  Clock, 
  Store, 
  MessageCircle, 
  Search, 
  ShieldCheck, 
  Bell, 
  Menu, 
  X, 
  Sparkles, 
  Info, 
  Users, 
  HelpCircle,
  Award,
  Lock,
  Unlock
} from 'lucide-react';
import { StoreSettings } from '../types';
import { cleanPhoneNumber } from '../utils/whatsapp';

interface HeaderProps {
  settings: StoreSettings;
  cartCount: number;
  ordersCount: number;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  activeTab: 'catalog' | 'orders' | 'admin';
  setActiveTab: (tab: 'catalog' | 'orders' | 'admin') => void;
  openCart: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onNavigateSection?: (sectionId: string) => void;
  onRequestAdmin?: () => void;
  isAdminAuthenticated?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  cartCount,
  ordersCount,
  unreadNotificationsCount,
  onOpenNotifications,
  activeTab,
  setActiveTab,
  openCart,
  searchQuery,
  setSearchQuery,
  onNavigateSection,
  onRequestAdmin,
  isAdminAuthenticated = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const whatsappUrl = `https://wa.me/${cleanPhoneNumber(settings.sellerWhatsApp, settings.countryCode)}?text=${encodeURIComponent(
    `Hello ${settings.storeName}! I am viewing your website and would like to inquire about your Henna products.`
  )}`;

  const handleNavClick = (sectionId?: string) => {
    setMobileMenuOpen(false);
    if (activeTab !== 'catalog') {
      setActiveTab('catalog');
    }
    if (sectionId) {
      setTimeout(() => {
        if (onNavigateSection) {
          onNavigateSection(sectionId);
        } else {
          const el = document.getElementById(sectionId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 50);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/60 shadow-xs">
      {/* Top Announcement Bar with Rich Gold & Green Blend */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-emerald-900 text-white text-xs py-2 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium tracking-wide">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
            </span>
            <span className="text-amber-100">{settings.announcementText}</span>
          </div>
          <div className="flex items-center gap-4 text-amber-100 text-[11px]">
            <span className="hidden sm:inline-flex items-center gap-1 font-semibold text-amber-200">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              Sojat City Direct Manufacturer
            </span>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-amber-950/60 hover:bg-amber-950 text-amber-200 hover:text-white px-2.5 py-0.5 rounded-full border border-amber-500/30 transition-colors font-medium"
            >
              <MessageCircle className="w-3 h-3 text-amber-300" />
              WhatsApp: {settings.sellerWhatsApp}
            </a>
          </div>
        </div>
      </div>

      {/* Main Website Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Store Branding */}
          <div
            onClick={() => handleNavClick()}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border border-amber-200/80 p-1 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform overflow-hidden shrink-0">
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
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-xl text-slate-900 tracking-tight group-hover:text-amber-700 transition-colors">
                  {settings.storeName}
                </span>
                <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-amber-50 to-emerald-50 text-amber-900 border border-amber-200">
                  Official Website
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium hidden sm:block truncate max-w-xs">
                Sojat Henna, Essential Oils & Herbal Products
              </p>
            </div>
          </div>

          {/* Desktop Website Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => handleNavClick('catalog-grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'catalog'
                  ? 'text-amber-900 bg-amber-50 border border-amber-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Catalog & Products
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              About Factory
            </button>

            <button
              onClick={() => handleNavClick('quality')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Quality Standards
            </button>

            <button
              onClick={() => handleNavClick('wholesale')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50/80 border border-emerald-200/80 hover:bg-emerald-100 transition-colors flex items-center gap-1"
            >
              <Users className="w-3.5 h-3.5 text-emerald-700" />
              Wholesale B2B
            </button>

            <button
              onClick={() => handleNavClick('reviews')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Reviews
            </button>

            <button
              onClick={() => handleNavClick('faq')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              FAQ
            </button>

            <button
              onClick={() => {
                setActiveTab('orders');
                setMobileMenuOpen(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors relative flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'text-amber-900 bg-amber-100 border border-amber-300'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>Orders</span>
              {ordersCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-amber-200 text-amber-950">
                  {ordersCount}
                </span>
              )}
            </button>
          </nav>

          {/* Action Buttons: Search, Daily Tips, Cart, Admin & Mobile Hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Desktop Search input shortcut */}
            <div className="relative hidden md:block w-36 xl:w-44">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Henna..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Daily Notifications Button */}
            <button
              onClick={onOpenNotifications}
              title="Daily Notifications & Henna Tips"
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium transition-all relative flex items-center gap-1.5 text-slate-700 hover:text-amber-950 hover:bg-amber-50 border border-slate-200 hover:border-amber-300"
            >
              <div className="relative flex items-center">
                <Bell className="w-4 h-4 text-amber-700" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-amber-500 to-emerald-600 text-white font-black text-[9px] rounded-full h-3.5 min-w-3.5 px-1 flex items-center justify-center shadow-xs animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-slate-700 font-bold text-xs">Daily Tips</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-700 hover:from-amber-700 hover:via-amber-800 hover:to-emerald-800 text-white shadow-xs hover:shadow-amber-600/30 transition-all flex items-center gap-2 group active:scale-95"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-slate-950 font-black text-[10px] rounded-full h-4 min-w-4 px-1 flex items-center justify-center border-2 border-amber-700 animate-pulse">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="font-bold">Cart</span>
            </button>

            {/* Seller Catalog Manager Button with Lock Protection */}
            <button
              onClick={() => {
                if (onRequestAdmin) {
                  onRequestAdmin();
                } else {
                  setActiveTab('admin');
                }
                setMobileMenuOpen(false);
              }}
              title={isAdminAuthenticated ? "Seller Admin Control Room (Unlocked)" : "Seller Admin (Owner PIN Protected)"}
              className={`hidden sm:flex px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold transition-all border items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/20'
                  : isAdminAuthenticated
                  ? 'text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border-emerald-300 shadow-xs'
                  : 'text-slate-800 bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900 shadow-xs'
              }`}
            >
              {isAdminAuthenticated ? (
                <>
                  <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Seller Admin</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  <span>Seller Admin</span>
                  <span className="text-[10px] text-amber-700/80 font-normal">PIN</span>
                </>
              )}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl lg:hidden text-slate-700 hover:bg-slate-100 border border-slate-200"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-slate-800" /> : <Menu className="w-5 h-5 text-slate-800" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2.5 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Henna powder, oils, weights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Mobile Slide-down Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-200 space-y-1.5 animate-in slide-in-from-top-2 duration-200">
            <button
              onClick={() => handleNavClick('catalog-grid')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-amber-50 flex items-center gap-2.5"
            >
              <ShoppingBag className="w-4 h-4 text-amber-700" />
              <span>Browse Products & Catalog</span>
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-amber-50 flex items-center gap-2.5"
            >
              <Info className="w-4 h-4 text-amber-700" />
              <span>About Sojat Factory</span>
            </button>

            <button
              onClick={() => handleNavClick('quality')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-amber-50 flex items-center gap-2.5"
            >
              <Award className="w-4 h-4 text-emerald-700" />
              <span>Quality & Lab Standards</span>
            </button>

            <button
              onClick={() => handleNavClick('wholesale')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50/70 border border-emerald-200 flex items-center gap-2.5"
            >
              <Users className="w-4 h-4 text-emerald-700" />
              <span>Wholesale & Bulk Supply (B2B)</span>
            </button>

            <button
              onClick={() => handleNavClick('reviews')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-amber-50 flex items-center gap-2.5"
            >
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Artist & Salon Reviews</span>
            </button>

            <button
              onClick={() => handleNavClick('faq')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-amber-50 flex items-center gap-2.5"
            >
              <HelpCircle className="w-4 h-4 text-amber-700" />
              <span>Frequently Asked Questions</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('orders');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-amber-50 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-700" />
                <span>Track My Orders</span>
              </div>
              {ordersCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                  {ordersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                if (onRequestAdmin) {
                  onRequestAdmin();
                } else {
                  setActiveTab('admin');
                }
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 flex items-center justify-between mt-2"
            >
              <div className="flex items-center gap-2.5">
                {isAdminAuthenticated ? (
                  <Unlock className="w-4 h-4 text-emerald-700" />
                ) : (
                  <Lock className="w-4 h-4 text-amber-700" />
                )}
                <span>Seller Portal (Catalog & Store Manager)</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                isAdminAuthenticated ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}>
                {isAdminAuthenticated ? 'Unlocked' : 'PIN Required'}
              </span>
            </button>
          </div>
        )}

      </div>
    </header>
  );
};
