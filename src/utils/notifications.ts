import { AppNotification } from '../types';

export const DAILY_NOTIFICATION_TEMPLATES: Omit<AppNotification, 'id' | 'date' | 'read'>[] = [
  {
    title: '🌿 Daily Henna Tip from Mateshwari Industries',
    message: 'For the darkest bridal stain, mix our Sojat Henna with Nilgiri Eucalyptus Oil and leave the paste for 6-8 hours before washing with mustard oil!',
    category: 'tip',
  },
  {
    title: '✨ Daily Special Factory Offer Active!',
    message: 'Order 1kg Pure Sojat Body Art Grade Henna today & get direct WhatsApp wholesale rates with fast dispatch across India.',
    category: 'daily_deal',
  },
  {
    title: '🌿 Herbal Hair Care Reminder',
    message: 'Nourish your scalp naturally! Mateshwari Ayurvedic Hair Henna with Amla, Shikakai & Bhringraj strengthens roots and controls hair fall.',
    category: 'tip',
  },
  {
    title: '📦 Fresh Batch Alert - Mateshwari Industries',
    message: 'Freshly harvested triple-cloth-sifted microfine Sojat Henna powder is freshly packed and ready for immediate dispatch.',
    category: 'new_batch',
  },
  {
    title: '💧 Essential Oil Stain Darkening Secret',
    message: 'High-cineole Cajeput and Eucalyptus oils release Lawsone pigments faster. Add 25ml per 100g powder for rich maroon stains.',
    category: 'tip',
  },
  {
    title: '🖤 Chemical-Free Grey Coverage',
    message: 'Switch to zero-PPD natural black hair color! Pure Henna + Indigo leaf powder coats every hair strand safely without scalp burning.',
    category: 'daily_deal',
  },
  {
    title: '🎉 Free Express Delivery on ₹799+',
    message: 'Stock up your Henna cones, oils, and powders today. Free dispatch on all orders above ₹799 placed directly on WhatsApp!',
    category: 'daily_deal',
  },
];

/**
 * Checks if browser supports native Notifications
 */
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Requests native browser permission for notifications
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    return 'denied';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch {
    return 'denied';
  }
}

/**
 * Sends a native browser push notification if granted
 */
export function sendBrowserPushNotification(
  title: string,
  body: string,
  icon: string = '/assets/aistudio/image-removebg-preview__23__6939d6b2.png'
): boolean {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  try {
    const notification = new Notification(title, {
      body,
      icon,
      badge: icon,
      tag: 'mateshwari-daily-notification',
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return true;
  } catch {
    return false;
  }
}

/**
 * Check if daily notification should be triggered (once every 24 hours)
 */
export function shouldSendDailyNotification(): boolean {
  try {
    const lastNotified = localStorage.getItem('mateshwari_last_daily_notification');
    if (!lastNotified) return true;

    const lastDate = new Date(lastNotified).getTime();
    const now = Date.now();
    // 24 hours = 24 * 60 * 60 * 1000 = 86,400,000 ms
    return now - lastDate >= 86400000;
  } catch {
    return true;
  }
}

/**
 * Marks today's daily notification as sent
 */
export function recordDailyNotificationSent(): void {
  try {
    localStorage.setItem('mateshwari_last_daily_notification', new Date().toISOString());
  } catch {
    // Ignore storage issues
  }
}

/**
 * Gets the daily notification for today based on day of year
 */
export function getTodayNotificationTemplate() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const index = dayOfYear % DAILY_NOTIFICATION_TEMPLATES.length;
  return DAILY_NOTIFICATION_TEMPLATES[index];
}
