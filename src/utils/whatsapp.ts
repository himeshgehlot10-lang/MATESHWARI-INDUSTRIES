import { CartItem, Product, StoreSettings } from '../types';

/**
 * Normalizes phone numbers to WhatsApp international format (digits only, no + or spaces).
 * e.g., "+91 98765 43210" -> "919876543210"
 */
export function cleanPhoneNumber(phone: string, defaultCountryCode: string = '+91'): string {
  if (!phone) return '';
  const digitsOnly = phone.replace(/\D/g, '');
  const cleanCode = defaultCountryCode.replace(/\D/g, '');

  // If already starts with country code and has full length (e.g., 12 digits for India)
  if (digitsOnly.length > 10) {
    return digitsOnly;
  }
  return `${cleanCode}${digitsOnly}`;
}

export interface CustomerOrderDetails {
  name?: string;
  phone?: string;
  address?: string;
  notes?: string;
  quantity?: number;
}

/**
 * Builds the WhatsApp message for a single product as requested:
 * "I want to buy this product" along with image and product specifications.
 */
export function buildSingleProductWhatsAppMessage(
  product: Product,
  settings: StoreSettings,
  customer?: CustomerOrderDetails
): string {
  const qty = customer?.quantity || 1;
  const totalPrice = product.price * qty;
  const originalTotalPrice = (product.originalPrice || product.price) * qty;
  const savings = originalTotalPrice - totalPrice;

  const lines: string[] = [
    `👋 Hello *${settings.storeName}*,`,
    `I want to buy this product from your catalog:`,
    ``,
    `🛍️ *Product:* ${product.name}`,
    `💰 *Price:* ${settings.currencySymbol}${product.price}${
      product.originalPrice && product.originalPrice > product.price
        ? ` ~(${settings.currencySymbol}${product.originalPrice})~`
        : ''
    }${product.discountPercent ? ` [${product.discountPercent}% OFF]` : ''}`,
    `⚖️ *Weight / Pack:* ${product.weight}`,
    `🔢 *Quantity:* ${qty}`,
    `💵 *Total Amount:* ${settings.currencySymbol}${totalPrice}`,
  ];

  if (savings > 0) {
    lines.push(`🎉 *You Save:* ${settings.currencySymbol}${savings}`);
  }

  if (product.features && product.features.length > 0) {
    lines.push(``);
    lines.push(`✨ *Key Features:*`);
    product.features.slice(0, 4).forEach((feat) => {
      lines.push(`• ${feat}`);
    });
  }

  const primaryImage = product.images?.[0];
  if (primaryImage) {
    lines.push(``);
    // If it's a URL (http/https), append direct link so WhatsApp renders rich preview
    if (primaryImage.startsWith('http')) {
      lines.push(`🖼️ *Product Image:* ${primaryImage}`);
    } else {
      lines.push(`🖼️ *Product Image:* [Attached / Shared via Catalog]`);
    }
  }

  if (customer?.name || customer?.address || customer?.notes) {
    lines.push(``);
    lines.push(`📍 *Customer Delivery Details:*`);
    if (customer.name) lines.push(`• Name: ${customer.name}`);
    if (customer.phone) lines.push(`• Contact: ${customer.phone}`);
    if (customer.address) lines.push(`• Address: ${customer.address}`);
    if (customer.notes) lines.push(`• Note: ${customer.notes}`);
  }

  lines.push(``);
  lines.push(`Please confirm product availability and share payment / delivery steps! Thank you.`);

  return lines.join('\n');
}

/**
 * Builds the WhatsApp message for multi-item cart orders.
 */
export function buildCartWhatsAppMessage(
  cartItems: CartItem[],
  settings: StoreSettings,
  customer?: CustomerOrderDetails
): string {
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const originalSubtotal = cartItems.reduce(
    (acc, item) => acc + (item.product.originalPrice || item.product.price) * item.quantity,
    0
  );
  const totalSavings = originalSubtotal - subtotal;
  const isFreeDelivery = subtotal >= (settings.freeShippingAbove || 799);
  const deliveryFee = isFreeDelivery ? 0 : settings.standardDeliveryFee || 50;
  const grandTotal = subtotal + deliveryFee;

  const lines: string[] = [
    `🛒 *NEW ORDER REQUEST - ${settings.storeName}*`,
    `Hello! I would like to place an order for the following items:`,
    ``,
    `----------------------------------------`,
  ];

  cartItems.forEach((item, index) => {
    const itemTotal = item.product.price * item.quantity;
    lines.push(
      `${index + 1}. *${item.product.name}*`,
      `   • Qty: ${item.quantity} × ${settings.currencySymbol}${item.product.price} = ${settings.currencySymbol}${itemTotal}`,
      `   • Weight: ${item.product.weight}`
    );
    if (item.product.images?.[0]?.startsWith('http')) {
      lines.push(`   • Image: ${item.product.images[0]}`);
    }
    lines.push(``);
  });

  lines.push(`----------------------------------------`);
  lines.push(`📦 *Total Items:* ${cartItems.reduce((sum, i) => sum + i.quantity, 0)} items`);
  lines.push(`💰 *Subtotal:* ${settings.currencySymbol}${subtotal}`);
  if (totalSavings > 0) {
    lines.push(`🎉 *Total Savings:* ${settings.currencySymbol}${totalSavings}`);
  }
  lines.push(
    `🚚 *Delivery Fee:* ${
      deliveryFee === 0 ? 'FREE' : `${settings.currencySymbol}${deliveryFee}`
    }`
  );
  lines.push(`🏷️ *GRAND TOTAL:* ${settings.currencySymbol}${grandTotal}`);
  lines.push(`----------------------------------------`);

  if (customer?.name || customer?.address || customer?.notes) {
    lines.push(``);
    lines.push(`📍 *Customer Delivery Details:*`);
    if (customer.name) lines.push(`• Name: ${customer.name}`);
    if (customer.phone) lines.push(`• Phone: ${customer.phone}`);
    if (customer.address) lines.push(`• Address: ${customer.address}`);
    if (customer.notes) lines.push(`• Note: ${customer.notes}`);
  }

  lines.push(``);
  lines.push(`Please confirm this order and provide payment details. Thank you!`);

  return lines.join('\n');
}

/**
 * Creates the complete wa.me link with encoded text message.
 */
export function createWhatsAppUrl(phoneNumber: string, message: string): string {
  const clean = cleanPhoneNumber(phoneNumber);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${clean}?text=${encoded}`;
}

/**
 * Helper to copy image to clipboard if supported by browser.
 */
export async function copyImageToClipboard(imageUrl: string): Promise<boolean> {
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    ctx.drawImage(img, 0, 0);

    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve(false);
          return;
        }
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob,
            }),
          ]);
          resolve(true);
        } catch {
          resolve(false);
        }
      }, 'image/png');
    });
  } catch {
    return false;
  }
}
