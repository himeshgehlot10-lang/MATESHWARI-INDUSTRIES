import React from 'react';
import { MessageCircle, ShoppingCart, Scale, Check, Star, Eye } from 'lucide-react';
import { Product, StoreSettings, ViewMode } from '../types';
import { buildSingleProductWhatsAppMessage, createWhatsAppUrl } from '../utils/whatsapp';

interface ProductCardProps {
  product: Product;
  settings: StoreSettings;
  viewMode: ViewMode;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onDirectWhatsApp: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  settings,
  viewMode,
  onAddToCart,
  onQuickView,
  onDirectWhatsApp,
}) => {
  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent =
    product.discountPercent ||
    (hasDiscount ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) : 0);
  const savings = hasDiscount ? product.originalPrice! - product.price : 0;

  // Direct fast WhatsApp link
  const directWhatsAppLink = createWhatsAppUrl(
    settings.sellerWhatsApp,
    buildSingleProductWhatsAppMessage(product, settings, { quantity: 1 })
  );

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-emerald-300 hover:shadow-lg transition-all p-3 sm:p-4 flex flex-col md:flex-row gap-4 group">
        {/* Thumbnail Image */}
        <div
          onClick={() => onQuickView(product)}
          className="relative w-full md:w-56 h-48 sm:h-52 md:h-auto rounded-xl overflow-hidden bg-slate-100 shrink-0 cursor-pointer"
        >
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {discountPercent > 0 && (
            <div className="absolute top-2.5 left-2.5 bg-rose-600 text-white font-bold text-[11px] px-2 py-0.5 rounded-full shadow-md tracking-wider">
              {discountPercent}% OFF
            </div>
          )}
          {product.badge && (
            <div className="absolute top-2.5 right-2.5 bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full shadow-md">
              {product.badge}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1">
              <span className="font-bold text-amber-900 bg-gradient-to-r from-amber-50 to-emerald-50 px-2 py-0.5 rounded-md border border-amber-200">
                {product.category}
              </span>
              <div className="flex items-center gap-1.5 font-bold text-amber-950 bg-amber-50/80 px-2.5 py-0.5 rounded-md border border-amber-200/60">
                <Scale className="w-3.5 h-3.5 text-amber-700" />
                <span>{product.weight}</span>
              </div>
            </div>

            <h3
              onClick={() => onQuickView(product)}
              className="font-bold text-slate-900 text-base sm:text-lg hover:text-amber-700 cursor-pointer transition-colors leading-snug line-clamp-2"
            >
              {product.name}
            </h3>

            {/* Features bullet list */}
            {product.features && product.features.length > 0 && (
              <div className="mt-2.5 space-y-1">
                {product.features.slice(0, 3).map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                    <span className="line-clamp-1">{feat}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Order Actions */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-slate-900">
                {settings.currencySymbol}
                {product.price}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xs sm:text-sm text-slate-400 line-through">
                    {settings.currencySymbol}
                    {product.originalPrice}
                  </span>
                  <span className="text-xs font-bold text-amber-900 bg-amber-100/80 px-1.5 py-0.5 rounded border border-amber-300/60">
                    Save {settings.currencySymbol}
                    {savings}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onAddToCart(product)}
                disabled={!product.inStock}
                className="px-3 py-2 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 hover:text-amber-800 font-semibold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <ShoppingCart className="w-4 h-4 text-amber-700" />
                <span>Add to Cart</span>
              </button>

              {/* Direct WhatsApp Order Button - Rich Golden & Green Blend */}
              <a
                href={directWhatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-700 hover:from-amber-700 hover:via-amber-800 hover:to-emerald-800 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-600/20 transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-white text-white" />
                <span>Order on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View Card
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-emerald-300 hover:shadow-xl transition-all duration-300 flex flex-col group relative">
      {/* Product Image Area */}
      <div className="relative aspect-square overflow-hidden bg-slate-50 cursor-pointer" onClick={() => onQuickView(product)}>
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-rose-600 text-white font-black text-[11px] px-2.5 py-1 rounded-full shadow-md tracking-wider flex items-center gap-1">
            <span>{discountPercent}% OFF</span>
          </div>
        )}

        {/* Custom Badge or Stock Status */}
        <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1.5">
          {product.badge && (
            <span className="bg-amber-400 text-slate-950 font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-md">
              {product.badge}
            </span>
          )}
          {!product.inStock && (
            <span className="bg-slate-900/90 text-white font-semibold text-[10px] px-2 py-0.5 rounded-full">
              Sold Out
            </span>
          )}
        </div>

        {/* Quick View Hover Overlay Button */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-white/95 text-slate-900 text-xs font-bold shadow-lg hover:bg-white flex items-center gap-1.5 backdrop-blur-xs scale-90 group-hover:scale-100 transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-600" />
            Quick Preview
          </button>
        </div>

        {/* Weight Tag on bottom of image - Rich Golden & Green */}
        <div className="absolute bottom-2.5 left-2.5 bg-gradient-to-r from-[#281907]/90 to-[#0e2717]/90 backdrop-blur-md text-amber-200 border border-amber-500/30 font-bold text-[11px] px-2.5 py-0.5 rounded-lg flex items-center gap-1.5 shadow-xs">
          <Scale className="w-3 h-3 text-amber-300" />
          <span>{product.weight}</span>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase tracking-wider text-[10px]">
              {product.category}
            </span>
            {product.rating && (
              <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-500">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                {product.reviewCount && (
                  <span className="text-slate-400 text-[10px]">({product.reviewCount})</span>
                )}
              </div>
            )}
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 hover:text-amber-700 cursor-pointer transition-colors mb-2"
          >
            {product.name}
          </h3>

          {/* Key Features Bullets */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-1 mb-3">
              {product.features.slice(0, 2).map((feat, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                  <span className="line-clamp-1 text-[11px]">{feat}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & Actions */}
        <div>
          {/* Price Row */}
          <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between gap-1 mb-3">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  {settings.currencySymbol}
                  {product.price}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-slate-400 line-through">
                    {settings.currencySymbol}
                    {product.originalPrice}
                  </span>
                )}
              </div>
              {hasDiscount && (
                <p className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1 rounded inline-block mt-0.5">
                  Save {settings.currencySymbol}
                  {savings}
                </p>
              )}
            </div>

            {/* Quick Add to Cart Button */}
            <button
              onClick={() => onAddToCart(product)}
              disabled={!product.inStock}
              title="Add to Shopping Cart"
              className="p-2 rounded-xl bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-700 border border-slate-200 hover:border-amber-300 transition-colors disabled:opacity-40 active:scale-95"
            >
              <ShoppingCart className="w-4 h-4 text-amber-700" />
            </button>
          </div>

          {/* DIRECT WHATSAPP BUTTON - Rich Golden Half-Blended with Green */}
          <button
            onClick={() => onDirectWhatsApp(product)}
            disabled={!product.inStock}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-700 hover:from-amber-700 hover:via-amber-800 hover:to-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            <MessageCircle className="w-4 h-4 fill-white text-white" />
            <span>Order on WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
