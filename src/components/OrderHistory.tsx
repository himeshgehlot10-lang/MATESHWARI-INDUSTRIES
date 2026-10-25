import React, { useState } from 'react';
import { Package, Clock, CheckCircle2, Truck, AlertCircle, ShoppingBag, MessageCircle, RotateCcw, ChevronRight, Scale, MapPin } from 'lucide-react';
import { Order, OrderStatus, Product, StoreSettings } from '../types';
import { cleanPhoneNumber } from '../utils/whatsapp';

interface OrderHistoryProps {
  orders: Order[];
  settings: StoreSettings;
  onReorder: (order: Order) => void;
  onBrowseCatalog: () => void;
  onUpdateOrderStatus?: (orderId: string, newStatus: OrderStatus) => void;
  isSellerMode?: boolean;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({
  orders,
  settings,
  onReorder,
  onBrowseCatalog,
  onUpdateOrderStatus,
  isSellerMode = false,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const filterOptions = ['All', 'Processing', 'Shipped', 'Delivered', 'Pending Confirmation'];

  const filteredOrders = orders.filter((order) => {
    if (selectedFilter === 'All') return true;
    return order.status.toLowerCase().includes(selectedFilter.toLowerCase());
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
          icon: CheckCircle2,
          step: 4,
        };
      case 'Shipped':
      case 'Out for Delivery':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          dot: 'bg-blue-500',
          icon: Truck,
          step: 3,
        };
      case 'Processing':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          icon: Clock,
          step: 2,
        };
      case 'Pending Confirmation':
      default:
        return {
          bg: 'bg-purple-50 text-purple-800 border-purple-200',
          dot: 'bg-purple-500',
          icon: AlertCircle,
          step: 1,
        };
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const getWhatsAppInquiryUrl = (order: Order) => {
    const message = `Hello ${settings.storeName}! I am inquiring about my Order *${order.id}* placed on ${formatDate(order.createdAt)} for total ${settings.currencySymbol}${order.totalCost}. Could you please update me on the current delivery status? Thank you!`;
    return `https://wa.me/${cleanPhoneNumber(settings.sellerWhatsApp, settings.countryCode)}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6">
      {/* Title & Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Package className="w-7 h-7 text-emerald-600" />
            <span>Order History & Tracking</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your previous purchases, view itemized receipts, and check live delivery status
          </p>
        </div>

        <button
          onClick={onBrowseCatalog}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs sm:text-sm border border-emerald-200 transition-colors flex items-center gap-1.5"
        >
          <ShoppingBag className="w-4 h-4 text-emerald-700" />
          <span>Browse Catalog</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {filterOptions.map((filter) => {
          const count =
            filter === 'All'
              ? orders.length
              : orders.filter((o) => o.status.toLowerCase().includes(filter.toLowerCase())).length;
          return (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedFilter === filter
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              <span>{filter}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  selectedFilter === filter ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center text-slate-500">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No Orders Found</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
            You haven't placed any orders matching "{selectedFilter}". When you place an order via WhatsApp or cart, it will show up here with live status tracking!
          </p>
          <button
            onClick={onBrowseCatalog}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
          >
            Explore Product Catalog
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusInfo = getStatusBadge(order.status);
            const StatusIcon = statusInfo.icon;
            const isExpanded = expandedOrderId === order.id;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-2xs hover:border-emerald-300 hover:shadow-md transition-all"
              >
                {/* Order Summary Header */}
                <div className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-sm sm:text-base">
                          {order.id}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusInfo.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                          <StatusIcon className="w-3.5 h-3.5" />
                          <span>{order.status}</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Placed on {formatDate(order.createdAt)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-[11px] text-slate-500">Total Cost</p>
                      <p className="font-black text-slate-900 text-base sm:text-lg">
                        {settings.currencySymbol}
                        {order.totalCost}
                      </p>
                    </div>

                    <button
                      onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
                      title={isExpanded ? 'Collapse details' : 'Expand details'}
                    >
                      <ChevronRight
                        className={`w-5 h-5 transition-transform duration-200 ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Visual Status Progress Tracker */}
                <div className="px-5 py-3 bg-white border-b border-slate-100">
                  <div className="max-w-2xl mx-auto py-2">
                    <div className="grid grid-cols-4 relative text-center">
                      {/* Connection bar */}
                      <div className="absolute top-3 left-[12%] right-[12%] h-1 bg-slate-200 -z-0 rounded-full">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 transition-all duration-500 rounded-full"
                          style={{
                            width:
                              order.status === 'Delivered'
                                ? '100%'
                                : order.status === 'Shipped' || order.status === 'Out for Delivery'
                                ? '66%'
                                : order.status === 'Processing'
                                ? '33%'
                                : '5%',
                          }}
                        />
                      </div>

                      {/* Step 1: Placed */}
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-600 to-emerald-700 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                          ✓
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 mt-1">Placed</span>
                      </div>

                      {/* Step 2: Processing */}
                      <div className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs ${
                            statusInfo.step >= 2
                              ? 'bg-gradient-to-r from-amber-600 to-emerald-700 text-white'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {statusInfo.step >= 2 ? '✓' : '2'}
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 mt-1">Processing</span>
                      </div>

                      {/* Step 3: Shipped */}
                      <div className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs ${
                            statusInfo.step >= 3
                              ? 'bg-gradient-to-r from-amber-600 to-emerald-700 text-white'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {statusInfo.step >= 3 ? '✓' : '3'}
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 mt-1">Shipped</span>
                      </div>

                      {/* Step 4: Delivered */}
                      <div className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs ${
                            statusInfo.step >= 4
                              ? 'bg-gradient-to-r from-amber-600 to-emerald-700 text-white'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {statusInfo.step >= 4 ? '✓' : '4'}
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 mt-1">Delivered</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items Purchased List */}
                <div className="p-4 sm:p-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Items in this Order ({order.items.length})
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                      >
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 text-xs truncate">{item.name}</p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span className="inline-flex items-center gap-1">
                              <Scale className="w-3 h-3 text-slate-400" />
                              {item.weight}
                            </span>
                            <span>•</span>
                            <span className="font-semibold text-slate-700">Qty: {item.quantity}</span>
                          </div>
                          <p className="text-xs font-black text-slate-900 mt-0.5">
                            {settings.currencySymbol}
                            {item.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Customer Delivery Details if expanded or present */}
                  {order.deliveryAddress && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-50 text-xs text-slate-600 border border-slate-100 flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-800">
                          Delivery to {order.customerName}:
                        </span>{' '}
                        <span>{order.deliveryAddress}</span>
                        {order.customerNotes && (
                          <p className="text-slate-500 italic mt-0.5">Note: "{order.customerNotes}"</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Order Status History if available */}
                  {order.statusHistory && order.statusHistory.length > 0 && isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Tracking Activity Log:
                      </h5>
                      <div className="space-y-1.5">
                        {order.statusHistory.map((hist, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                            <div>
                              <span className="font-semibold text-slate-800">{hist.status}</span>
                              <span className="text-slate-400 text-[10px] ml-2">
                                {formatDate(hist.timestamp)}
                              </span>
                              {hist.note && (
                                <p className="text-slate-500 text-[11px]">{hist.note}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Controls & WhatsApp Status Inquiry */}
                <div className="p-3.5 sm:p-4 bg-slate-50/90 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  {/* Status management if merchant testing */}
                  {isSellerMode && onUpdateOrderStatus ? (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-slate-700">Update Status:</span>
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-semibold"
                      >
                        <option value="Pending Confirmation">Pending Confirmation</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500">
                      Savings in this order: {settings.currencySymbol}
                      {order.discountSavings}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    {/* Re-order items button */}
                    <button
                      onClick={() => onReorder(order)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-600 hover:text-emerald-700 bg-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Re-order Items</span>
                    </button>

                    {/* WhatsApp Inquiry Button - Rich Golden & Green Blend */}
                    <a
                      href={getWhatsAppInquiryUrl(order)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-700 hover:from-amber-700 hover:via-amber-800 hover:to-emerald-800 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white text-white" />
                      <span>Inquire on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
