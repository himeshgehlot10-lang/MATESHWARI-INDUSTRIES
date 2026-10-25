import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, MessageCircle, ArrowRight, ShieldCheck, Tag, Truck } from 'lucide-react';
import { CartItem, StoreSettings } from '../types';
import { buildCartWhatsAppMessage, createWhatsAppUrl } from '../utils/whatsapp';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  settings: StoreSettings;
  onOrderPlaced: (cartItems: CartItem[], customerDetails: any, grandTotal: number) => void;
  showToast: (msg: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  settings,
  onOrderPlaced,
  showToast,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const originalSubtotal = cartItems.reduce(
    (acc, item) => acc + (item.product.originalPrice || item.product.price) * item.quantity,
    0
  );
  const totalSavings = originalSubtotal - subtotal;
  const isFreeDelivery = subtotal >= (settings.freeShippingAbove || 799);
  const deliveryFee = isFreeDelivery || subtotal === 0 ? 0 : settings.standardDeliveryFee || 50;
  const grandTotal = subtotal + deliveryFee;

  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / (settings.freeShippingAbove || 799)) * 100));
  const amountNeededForFreeShipping = Math.max(0, (settings.freeShippingAbove || 799) - subtotal);

  // WhatsApp Order message & URL
  const whatsAppMessage = buildCartWhatsAppMessage(cartItems, settings, {
    name: customerName,
    phone: customerPhone,
    address: customerAddress,
    notes: customerNotes,
  });

  const whatsAppUrl = createWhatsAppUrl(settings.sellerWhatsApp, whatsAppMessage);

  const handleCheckoutViaWhatsApp = () => {
    if (cartItems.length === 0) return;

    // Record order in Order History
    onOrderPlaced(
      cartItems,
      {
        name: customerName || 'Valued Customer',
        phone: customerPhone || '',
        address: customerAddress || 'Shared via WhatsApp chat',
        notes: customerNotes,
      },
      grandTotal
    );

    // Open WhatsApp
    window.open(whatsAppUrl, '_blank');
    showToast('🚀 Order created! Redirecting to WhatsApp to send message...');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-md sm:max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cart Header */}
        <div className="p-4 sm:p-5 border-b border-amber-100 bg-amber-50/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-amber-600 to-emerald-700 text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base sm:text-lg">Your Shopping Cart</h2>
              <p className="text-xs text-slate-500 font-medium">
                {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} in your basket
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cartItems.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-slate-500 hover:text-rose-600 font-semibold px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free shipping progress indicator - Rich Golden & Green Blend */}
        {cartItems.length > 0 && (
          <div className="px-5 py-2.5 bg-gradient-to-r from-amber-50 to-emerald-50 border-b border-amber-200/60 text-xs">
            <div className="flex items-center justify-between font-bold text-amber-950 mb-1">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-600" />
                {isFreeDelivery ? (
                  <span className="text-emerald-800 font-bold">🎉 You qualify for FREE Delivery!</span>
                ) : (
                  <span>
                    Add {settings.currencySymbol}
                    {amountNeededForFreeShipping} more for FREE delivery!
                  </span>
                )}
              </span>
              <span className="text-amber-800 font-mono text-[11px]">{progressToFreeShipping}%</span>
            </div>
            <div className="w-full bg-amber-200/60 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-1">Your cart is empty</h3>
              <p className="text-xs text-slate-500 max-w-xs mb-6">
                Explore our catalog of dry fruits, organic foods, and artisan spices, and add your favorite items!
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
              >
                Start Browsing Products
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => {
                const itemTotal = item.product.price * item.quantity;
                const hasDiscount = item.product.originalPrice && item.product.originalPrice > item.product.price;
                return (
                  <div
                    key={item.product.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-emerald-200 transition-all flex gap-3.5 items-center"
                  >
                    {/* Thumbnail */}
                    <div className="w-18 h-18 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 shrink-0 relative">
                      <img
                        src={item.product.images?.[0] || ''}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Weight: <span className="text-slate-700 font-semibold">{item.product.weight}</span>
                      </p>

                      <div className="flex items-baseline gap-1.5 mt-1">
                        <span className="font-black text-slate-900 text-xs sm:text-sm">
                          {settings.currencySymbol}
                          {itemTotal}
                        </span>
                        {hasDiscount && (
                          <span className="text-[10px] text-slate-400 line-through">
                            {settings.currencySymbol}
                            {item.product.originalPrice! * item.quantity}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">
                          ({settings.currencySymbol}
                          {item.product.price} each)
                        </span>
                      </div>
                    </div>

                    {/* Quantity Stepper & Remove */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="Remove product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded bg-white text-slate-700 hover:bg-slate-50 flex items-center justify-center font-bold text-xs shadow-2xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded bg-white text-slate-700 hover:bg-slate-50 flex items-center justify-center font-bold text-xs shadow-2xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Delivery Details Section */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>Delivery Information (for WhatsApp note)</span>
                  <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-white px-3 py-1.5 rounded-lg border border-slate-200 outline-none focus:border-emerald-500"
                  />
                  <input
                    type="tel"
                    placeholder="Your Phone / WhatsApp"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-white px-3 py-1.5 rounded-lg border border-slate-200 outline-none focus:border-emerald-500"
                  />
                  <textarea
                    rows={2}
                    placeholder="Delivery Address (Flat / Street / City / Pincode)"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full bg-white px-3 py-1.5 rounded-lg border border-slate-200 outline-none focus:border-emerald-500 resize-none"
                  />
                  <input
                    type="text"
                    placeholder="Special Notes (e.g. Call before delivery)"
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="w-full bg-white px-3 py-1.5 rounded-lg border border-slate-200 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cart Footer: Summary & WhatsApp Checkout */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/90 space-y-3">
            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal ({totalItemCount} items)</span>
                <span className="font-semibold text-slate-900">
                  {settings.currencySymbol}
                  {subtotal}
                </span>
              </div>

              {totalSavings > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    Catalog Discount Savings
                  </span>
                  <span>
                    -{settings.currencySymbol}
                    {totalSavings}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Delivery</span>
                <span className="font-semibold">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    `${settings.currencySymbol}${deliveryFee}`
                  )}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-slate-900">
                <span className="font-bold text-sm sm:text-base">Grand Total</span>
                <div className="text-right">
                  <span className="font-black text-lg sm:text-xl text-amber-950">
                    {settings.currencySymbol}
                    {grandTotal}
                  </span>
                  <p className="text-[10px] text-slate-400">Inclusive of all taxes</p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Order Button - Rich Golden & Green Blend */}
            <button
              onClick={handleCheckoutViaWhatsApp}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-700 hover:from-amber-700 hover:via-amber-800 hover:to-emerald-800 text-white font-black text-sm sm:text-base shadow-lg shadow-amber-700/25 flex items-center justify-center gap-2.5 transition-all active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5 fill-white text-white" />
              <span>Place Order on WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direct communication with seller • No hidden middleman fees</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
