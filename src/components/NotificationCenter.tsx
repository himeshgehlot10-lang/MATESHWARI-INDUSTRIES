import React, { useState } from 'react';
import { Bell, X, CheckCheck, Trash2, Sparkles, Send, Volume2, ShieldCheck, Clock, ExternalLink } from 'lucide-react';
import { AppNotification } from '../types';
import { requestNotificationPermission, sendBrowserPushNotification, isNotificationSupported } from '../utils/notifications';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onSendTestNotification: () => void;
  isDailySubscribed: boolean;
  onToggleDailySubscription: (enabled: boolean) => void;
  showToast: (msg: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearAll,
  onSendTestNotification,
  isDailySubscribed,
  onToggleDailySubscription,
  showToast,
}) => {
  if (!isOpen) return null;

  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>(
    isNotificationSupported() ? Notification.permission : 'denied'
  );

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission();
    setPermissionStatus(res);
    if (res === 'granted') {
      onToggleDailySubscription(true);
      showToast('🔔 Daily push notifications enabled for Mateshwari Industries!');
      sendBrowserPushNotification(
        '🌿 Mateshwari Industries Notifications Active',
        'You will now receive daily tips, fresh batch alerts, and factory offers!'
      );
    } else {
      showToast('⚠️ Browser notification permission was denied or blocked.');
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getCategoryBadge = (category: AppNotification['category']) => {
    switch (category) {
      case 'daily_deal':
        return {
          label: 'Daily Offer',
          bg: 'bg-amber-100/90 text-amber-900 border-amber-300',
        };
      case 'new_batch':
        return {
          label: 'Fresh Batch',
          bg: 'bg-emerald-100/90 text-emerald-900 border-emerald-300',
        };
      case 'tip':
      default:
        return {
          label: 'Henna Tip',
          bg: 'bg-gradient-to-r from-amber-100 to-emerald-100 text-amber-950 border-amber-300',
        };
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }) + ', ' + d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-md sm:max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300 border-l border-amber-200/60"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Rich Gold & Green Blend */}
        <div className="p-4 sm:p-5 border-b border-amber-100 bg-gradient-to-r from-[#2a1a06] via-[#1a2313] to-[#0d2716] text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-amber-100 tracking-tight flex items-center gap-2">
                <span>Daily Notifications</span>
                {unreadCount > 0 && (
                  <span className="bg-yellow-400 text-stone-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                    {unreadCount} New
                  </span>
                )}
              </h2>
              <p className="text-xs text-amber-200/80 font-medium">
                Mateshwari Industries Daily Henna & Offer Alerts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-amber-200/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Daily Notification Status & Permission Card */}
        <div className="p-4 bg-gradient-to-r from-amber-50 to-emerald-50 border-b border-amber-200/60">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <span className="text-xs font-bold text-amber-950">Daily Notification System</span>
            </div>

            <button
              onClick={() => {
                if (permissionStatus !== 'granted') {
                  handleRequestPermission();
                } else {
                  onToggleDailySubscription(!isDailySubscribed);
                  showToast(
                    !isDailySubscribed
                      ? '✅ Daily notifications activated!'
                      : '⏸️ Daily notifications paused.'
                  );
                }
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all shadow-2xs ${
                isDailySubscribed
                  ? 'bg-gradient-to-r from-amber-600 to-emerald-700 text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {isDailySubscribed ? '✓ Enabled' : 'Enable Daily'}
            </button>
          </div>

          <p className="text-[11px] text-amber-900/80 leading-relaxed">
            Sends you a fresh notification every 24 hours with daily bridal henna stain tips, factory rate updates, and harvest discounts.
          </p>

          {/* Test Notification Button */}
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-amber-200/60">
            <span className="text-[11px] text-slate-500 font-medium">Want to test it now?</span>
            <button
              onClick={onSendTestNotification}
              className="px-3 py-1 rounded-lg bg-white border border-amber-300 hover:border-amber-500 hover:bg-amber-100 text-amber-900 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Send className="w-3 h-3 text-amber-600" />
              <span>Send Test Notification Now</span>
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center mb-3">
                <Bell className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">No notifications yet</h4>
              <p className="text-xs text-slate-500 max-w-xs mt-1 mb-4">
                You'll receive automated daily alerts here every 24 hours with Henna advice and factory discounts!
              </p>
              <button
                onClick={onSendTestNotification}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-emerald-700 text-white font-bold text-xs shadow-md"
              >
                Trigger Today's Notification
              </button>
            </div>
          ) : (
            notifications.map((item) => {
              const badge = getCategoryBadge(item.category);
              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    !item.read
                      ? 'bg-amber-50/50 border-amber-300/80 shadow-xs ring-1 ring-amber-400/20'
                      : 'bg-white border-slate-200 hover:border-amber-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${badge.bg}`}
                    >
                      {badge.label}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-300" />
                      {formatTime(item.date)}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.message}</p>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        {notifications.length > 0 && (
          <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
            <button
              onClick={onMarkAllAsRead}
              className="text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-amber-100/60 transition-colors"
            >
              <CheckCheck className="w-4 h-4 text-emerald-600" />
              <span>Mark all as read</span>
            </button>

            <button
              onClick={onClearAll}
              className="text-slate-500 hover:text-rose-600 font-semibold flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
