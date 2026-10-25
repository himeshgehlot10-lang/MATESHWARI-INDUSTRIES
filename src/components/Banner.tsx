import React from 'react';
import { MessageCircle, ShieldCheck, Tag, Scale, Sparkles, ArrowRight, Zap, Users } from 'lucide-react';
import { StoreSettings } from '../types';
import { cleanPhoneNumber } from '../utils/whatsapp';

interface BannerProps {
  settings: StoreSettings;
  onExploreClick: () => void;
  onOpenAdmin: () => void;
  onOpenWholesale?: () => void;
}

export const Banner: React.FC<BannerProps> = ({ 
  settings, 
  onExploreClick, 
  onOpenAdmin,
  onOpenWholesale,
}) => {
  const whatsappUrl = `https://wa.me/${cleanPhoneNumber(settings.sellerWhatsApp, settings.countryCode)}?text=${encodeURIComponent(
    `Hello ${settings.storeName}! I am visiting your official website and would like to buy pure Henna products.`
  )}`;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#2a1b05] via-[#1c2415] to-[#0f2d19] text-white rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl shadow-amber-950/25 my-4 sm:my-6 border border-amber-500/30">
      {/* Decorative background glows - Rich Golden & Henna Green blend */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/25 to-emerald-500/25 text-amber-200 border border-amber-400/40 text-xs font-bold uppercase tracking-wider mb-3.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Official Manufacturer Website • Sojat City, Rajasthan
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black tracking-tight text-white leading-tight mb-3.5">
              Pure Sojat Henna, Herbal Colors & Essential Oils on{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-emerald-300 underline decoration-amber-400/50 underline-offset-8">
                WhatsApp
              </span>
            </h1>

            <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed mb-6 font-normal">
              Direct from our factory in Sojat City (Rajasthan). We supply 100% natural, triple-cloth microfine sifted Body Art Henna, chemical-free Hair Henna, and therapeutic Cajeput & Eucalyptus essential oils with verified weights and instant 1-tap WhatsApp ordering.
            </p>

            {/* Quick Website CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onExploreClick}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-stone-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/30 hover:brightness-105 active:scale-95 transition-all flex items-center gap-2"
              >
                Browse Product Catalog
                <ArrowRight className="w-4 h-4 text-stone-950" />
              </button>

              <button
                onClick={onOpenWholesale || (() => {
                  const el = document.getElementById('wholesale');
                  el?.scrollIntoView({ behavior: 'smooth' });
                })}
                className="px-4 py-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 font-bold text-xs sm:text-sm border border-emerald-500/40 transition-all flex items-center gap-2 shadow-xs"
              >
                <Users className="w-4 h-4 text-emerald-300" />
                Wholesale / B2B Supply
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-amber-900/70 via-stone-900/80 to-emerald-900/70 hover:from-amber-900 hover:to-emerald-900 text-amber-200 font-bold text-xs sm:text-sm border border-amber-500/40 transition-all flex items-center gap-2 shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-amber-300" />
                Chat Direct on WhatsApp
              </a>
            </div>
          </div>

          {/* Brand Logo Showcase Card */}
          {settings.logoUrl && (
            <div className="hidden md:flex flex-col items-center justify-center p-5 rounded-3xl bg-gradient-to-b from-amber-950/40 to-emerald-950/40 backdrop-blur-md border border-amber-500/30 shrink-0 shadow-2xl">
              <div className="w-28 h-28 rounded-2xl bg-white p-2.5 flex items-center justify-center shadow-lg border border-amber-300">
                <img
                  src={settings.logoUrl}
                  alt={settings.storeName}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-sm font-black text-amber-200 tracking-wider uppercase mt-3">
                {settings.storeName}
              </span>
              <span className="text-xs text-emerald-300 font-bold">100% Certified Sojat Henna</span>
              <span className="text-[11px] text-amber-100/70 mt-1">Rajasthan, India</span>
            </div>
          )}
        </div>

        {/* Feature Badges Row - Half Rich Golden, Half Green Blend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-amber-500/20 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-900/80 to-emerald-950/80 border border-amber-500/40 flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <p className="font-bold text-white">1-Tap WhatsApp</p>
              <p className="text-amber-200/80 text-[11px]">Instant order with photos</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-900/80 to-emerald-950/80 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Scale className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <p className="font-bold text-white">Tare-Weight Certified</p>
              <p className="text-amber-200/80 text-[11px]">Guaranteed net weight</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-900/80 to-emerald-950/80 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <Tag className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <p className="font-bold text-white">Factory Direct</p>
              <p className="text-emerald-200/80 text-[11px]">Wholesale & retail rates</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-900/80 to-emerald-950/80 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <p className="font-bold text-white">100% PPD Free</p>
              <p className="text-emerald-200/80 text-[11px]">Skin & hair safe formula</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
