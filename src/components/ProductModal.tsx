import React, { useState } from 'react';
import { X, MessageCircle, ShoppingCart, Scale, Check, Copy, CheckCheck, ExternalLink, ShieldCheck, Sparkles, Plus, Minus } from 'lucide-react';
import { Product, StoreSettings } from '../types';
import { buildSingleProductWhatsAppMessage, createWhatsAppUrl, copyImageToClipboard } from '../utils/whatsapp';

interface ProductModalProps {
  product: Product | null;
  settings: StoreSettings;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onOrderCompleted?: (product: Product, quantity: number, customerDetails: any) => void;
  showToast: (msg: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  settings,
  onClose,
  onAddToCart,
  onOrderCompleted,
  showToast,
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [copiedImage, setCopiedImage] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [customerNote, setCustomerNote] = useState<string>('');
  const [showDetailsForm, setShowDetailsForm] = useState<boolean>(false);

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'];

  const activeImage = images[selectedImageIndex] || images[0];

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent =
    product.discountPercent ||
    (hasDiscount ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) : 0);
  const itemTotal = product.price * quantity;
  const originalTotal = (product.originalPrice || product.price) * quantity;
  const savingsTotal = originalTotal - itemTotal;

  // Generate WhatsApp message preview and URL
  const whatsAppMessage = buildSingleProductWhatsAppMessage(product, settings, {
    quantity,
    name: customerName,
    address: customerAddress,
    notes: customerNote,
  });

  const whatsAppUrl = createWhatsAppUrl(settings.sellerWhatsApp, whatsAppMessage);

  const handleCopyImage = async () => {
    const success = await copyImageToClipboard(activeImage);
    if (success) {
      setCopiedImage(true);
      showToast('📸 Product image copied! Paste directly in WhatsApp (Ctrl+V / Cmd+V)');
      setTimeout(() => setCopiedImage(false), 3000);
    } else {
      // Fallback: copy image link
      navigator.clipboard.writeText(activeImage);
      showToast('🔗 Product image link copied to clipboard!');
    }
  };

  const handleSendWhatsAppOrder = () => {
    if (onOrderCompleted) {
      onOrderCompleted(product, quantity, {
        name: customerName,
        address: customerAddress,
        notes: customerNote,
      });
    }
    window.open(whatsAppUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-100 bg-amber-50/40">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-100 to-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider border border-amber-300/60">
              {product.category}
            </span>
            {product.sku && (
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                SKU: {product.sku}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left: Gallery & Image Controls */}
            <div className="space-y-3">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {discountPercent > 0 && (
                  <div className="absolute top-3 left-3 bg-rose-600 text-white font-black text-xs px-2.5 py-1 rounded-full shadow-md">
                    {discountPercent}% OFF
                  </div>
                )}

                <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{product.weight}</span>
                </div>

                {/* Copy Image Button for WhatsApp */}
                <button
                  onClick={handleCopyImage}
                  title="Copy image to paste into WhatsApp"
                  className="absolute bottom-3 right-3 bg-white/95 hover:bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl shadow-md border border-slate-200 flex items-center gap-1.5 backdrop-blur-xs transition-all active:scale-95"
                >
                  {copiedImage ? (
                    <>
                      <CheckCheck className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-600" />
                      <span>Copy Image for WhatsApp</span>
                    </>
                  )}
                </button>
              </div>

              {/* Thumbnails if multiple images */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        selectedImageIndex === idx
                          ? 'border-emerald-600 ring-2 ring-emerald-600/30'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Clicking WhatsApp order automatically includes this product picture!
              </p>
            </div>

            {/* Right: Details, Pricing, Features, Quantity */}
            <div className="space-y-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {product.name}
                </h2>
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <Scale className="w-3.5 h-3.5 text-emerald-600" />
                    Net Weight: {product.weight}
                  </span>
                  {product.inStock ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                      ✓ In Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Pricing Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-slate-900">
                    {settings.currencySymbol}
                    {product.price}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-base text-slate-400 line-through">
                        {settings.currencySymbol}
                        {product.originalPrice}
                      </span>
                      <span className="text-xs font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                        {discountPercent}% OFF
                      </span>
                    </>
                  )}
                </div>
                {hasDiscount && (
                  <p className="text-xs font-semibold text-emerald-600 mt-1">
                    You save {settings.currencySymbol}
                    {product.originalPrice! - product.price} on this item!
                  </p>
                )}
              </div>

              {/* Key Features */}
              {product.features && product.features.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Key Features & Highlights:
                  </h4>
                  <div className="space-y-1.5">
                    {product.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    About this Product:
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-700">Quantity</span>
                  <p className="text-[11px] text-slate-500">
                    Total: {settings.currencySymbol}
                    {itemTotal}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-700 hover:bg-slate-50 active:scale-95 transition-all font-bold"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-700 hover:bg-slate-50 active:scale-95 transition-all font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Optional: Add Delivery Details for WhatsApp message */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <button
                  type="button"
                  onClick={() => setShowDetailsForm(!showDetailsForm)}
                  className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-slate-700 font-semibold"
                >
                  <span>{showDetailsForm ? 'Hide Delivery Note' : '+ Add Your Name & Delivery Address to WhatsApp Order'}</span>
                  <span className="text-slate-400">{showDetailsForm ? '▲' : '▼'}</span>
                </button>
                {showDetailsForm && (
                  <div className="p-3 space-y-2 bg-white border-t border-slate-200">
                    <input
                      type="text"
                      placeholder="Your Name (e.g., Alex Johnson)"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs outline-none focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="Delivery Address (City, Pincode, Landmark)"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs outline-none focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="Special Instructions / Notes"
                      value={customerNote}
                      onChange={(e) => setCustomerNote(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs outline-none focus:border-emerald-500"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer: Action Buttons */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Opens WhatsApp directly with prefilled message & image link</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                onAddToCart(product, quantity);
                showToast(`Added ${quantity} × ${product.name} to cart!`);
              }}
              className="flex-1 sm:flex-none px-4 py-3 rounded-2xl border border-slate-300 hover:border-amber-500 hover:bg-amber-50/50 hover:text-amber-900 bg-white font-bold text-xs sm:text-sm text-slate-700 shadow-xs flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <ShoppingCart className="w-4 h-4 text-amber-700" />
              <span>Add to Cart</span>
            </button>

            {/* DIRECT WHATSAPP ORDER BUTTON - Rich Golden Half-Blended with Green */}
            <button
              onClick={handleSendWhatsAppOrder}
              className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-700 hover:from-amber-700 hover:via-amber-800 hover:to-emerald-800 text-white font-black text-xs sm:text-sm shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <MessageCircle className="w-5 h-5 fill-white text-white" />
              <span>Order on WhatsApp Now</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
