import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Award, 
  Leaf, 
  FlaskConical, 
  Truck, 
  CheckCircle2, 
  MessageCircle, 
  ChevronDown, 
  ChevronUp, 
  Building2, 
  Users, 
  Scale, 
  HeartHandshake,
  Clock,
  ArrowRight,
  Star
} from 'lucide-react';
import { StoreSettings } from '../types';
import { cleanPhoneNumber } from '../utils/whatsapp';

interface WebsiteSectionsProps {
  settings: StoreSettings;
  onExploreProducts: () => void;
}

// 1. ABOUT MATESHWARI INDUSTRIES SECTION
export const AboutSection: React.FC<{ settings: StoreSettings }> = ({ settings }) => {
  return (
    <section id="about" className="py-16 sm:py-20 bg-white border-y border-amber-200/50 relative overflow-hidden">
      {/* Subtle Henna Leaf & Gold Motif Glows */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Visual Heritage Showcase */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-br from-amber-950 via-stone-900 to-emerald-950 p-6 sm:p-8 text-white shadow-2xl shadow-amber-950/20">
              <div className="flex items-center justify-between gap-4 mb-6">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  Sojat City, Rajasthan
                </span>
                <span className="text-[11px] text-emerald-300 font-semibold bg-emerald-900/40 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Est. Heritage
                </span>
              </div>

              {settings.logoUrl && (
                <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto bg-white rounded-2xl p-3 border border-amber-300 shadow-xl mb-6 flex items-center justify-center">
                  <img
                    src={settings.logoUrl}
                    alt={settings.storeName}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              <h3 className="text-xl sm:text-2xl font-black text-center text-white mb-2 tracking-tight">
                Mateshwari Industries
              </h3>
              <p className="text-xs sm:text-sm text-center text-amber-200/80 mb-6 font-medium">
                Pioneering Pure Rajasthani Henna & Botanical Essential Oils
              </p>

              {/* Manufacturing Milestones / Facts */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-amber-500/20 text-center">
                <div className="bg-amber-950/40 rounded-xl p-3 border border-amber-500/20">
                  <div className="text-lg sm:text-xl font-black text-amber-300">100%</div>
                  <div className="text-[11px] text-amber-100/70 font-medium">Organic Sojat Leaves</div>
                </div>
                <div className="bg-emerald-950/40 rounded-xl p-3 border border-emerald-500/20">
                  <div className="text-lg sm:text-xl font-black text-emerald-300">Triple</div>
                  <div className="text-[11px] text-emerald-100/70 font-medium">Cloth Sifted Microfine</div>
                </div>
                <div className="bg-emerald-950/40 rounded-xl p-3 border border-emerald-500/20">
                  <div className="text-lg sm:text-xl font-black text-emerald-300">0%</div>
                  <div className="text-[11px] text-emerald-100/70 font-medium">Chemicals & PPD</div>
                </div>
                <div className="bg-amber-950/40 rounded-xl p-3 border border-amber-500/20">
                  <div className="text-lg sm:text-xl font-black text-amber-300">Direct</div>
                  <div className="text-[11px] text-amber-100/70 font-medium">Factory WhatsApp Supply</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Brand Story Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-amber-600/15 to-emerald-600/15 text-amber-900 border border-amber-300/80 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              About Our Manufacturing Unit
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Crafting Pure Henna & Herbal Oils From The Heart of{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-800 to-emerald-700">
                Sojat City, Rajasthan
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Located in <strong>Sojat City (Pali District, Rajasthan)</strong>—globally celebrated as the "Henna Capital of the World"—<strong>Mateshwari Industries</strong> specializes in the manufacturing, microfine processing, and direct bulk supply of export-grade Body Art Henna, chemical-free Hair Henna, and pure botanical essential oils.
            </p>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Unlike commercial brands that adulterate henna powder with chemical dyes, sodium picramate, or synthetic colorants, our processing facility uses only prime-harvested Rajasthani henna leaves. Every batch undergoes rigorous shade-drying, stone pulverization, and <strong>triple-cloth microfine sifting</strong> to deliver a silky smooth, stringy paste with maximum natural Lawsone pigment content.
            </p>

            {/* 3 Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                <Leaf className="w-5 h-5 text-amber-800 mb-2" />
                <h4 className="font-bold text-slate-900 text-sm mb-1">Authentic Sourcing</h4>
                <p className="text-xs text-slate-600 leading-snug">
                  Direct harvest from Rajasthan's prime rain-fed fertile soils for intense natural dye release.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                <FlaskConical className="w-5 h-5 text-emerald-800 mb-2" />
                <h4 className="font-bold text-slate-900 text-sm mb-1">Pure Steam Distillation</h4>
                <p className="text-xs text-slate-600 leading-snug">
                  High-cineole Cajeput, Nilgiri (Eucalyptus), and Tea Tree oils distilled for deep stain activation.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-emerald-50 border border-amber-200/80">
                <Truck className="w-5 h-5 text-amber-800 mb-2" />
                <h4 className="font-bold text-slate-900 text-sm mb-1">Factory Direct Supply</h4>
                <p className="text-xs text-slate-600 leading-snug">
                  Eliminating distributor markups to provide wholesale rates directly on WhatsApp.
                </p>
              </div>
            </div>

            {/* Direct Contact Button */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={`https://wa.me/${cleanPhoneNumber(settings.sellerWhatsApp, settings.countryCode)}?text=${encodeURIComponent(
                  `Hello Mateshwari Industries! I visited your website and would like to learn more about your factory manufacturing process.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-700 hover:from-amber-700 hover:via-amber-800 hover:to-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-amber-200" />
                <span>Chat With Factory Representative</span>
              </a>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                Dispatch ready within 24 hours
              </span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

// 2. QUALITY STANDARDS & LABORATORY SPECIFICATIONS
export const QualityStandardsSection: React.FC = () => {
  const standards = [
    {
      title: '100% Pure Organic Sojat Leaves',
      desc: 'Sourced strictly from the fertile agricultural fields of Sojat, Rajasthan during optimal October harvest.',
      badge: 'Certified Origin',
    },
    {
      title: 'Triple-Cloth Microfine Sifted',
      desc: 'Filtered through surgical-grade micro meshes. Zero twigs, zero fibers—ensures unclogged cones and smooth flow.',
      badge: 'Stringy Texture',
    },
    {
      title: 'High Lawsone Pigment (>2.8%)',
      desc: 'Naturally abundant dye molecule creates deep reddish-brown to rich mahogany stains lasting 10-15 days.',
      badge: 'Natural Dark Stain',
    },
    {
      title: 'Zero PPD, Ammonia & Metallic Salts',
      desc: 'Free from synthetic chemical dyes that cause burns or allergic reactions. 100% skin and scalp safe.',
      badge: 'Toxin Free',
    },
    {
      title: 'Pure Terpene-Rich Essential Oils',
      desc: 'High cineole & terpene content in our Cajeput and Eucalyptus oils naturally oxidizes Lawsone for dark stain.',
      badge: 'Steam Distilled',
    },
    {
      title: 'Moisture-Locked Fresh Packaging',
      desc: 'Multi-layer vacuum-grade zip pouch packing shields delicate plant pigments against sunlight, heat, and moisture.',
      badge: '18-Month Shelf Life',
    },
  ];

  return (
    <section id="quality" className="py-16 sm:py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 to-emerald-600/15 text-amber-900 border border-amber-300/80 text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            Quality Assurance & Lab Standards
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            The Mateshwari Purity Guarantee
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Every batch formulated at our Sojat plant adheres to the highest purity criteria for professional bridal artists, salons, and international export.
          </p>
        </div>

        {/* Quality Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {standards.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-amber-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-emerald-100 border border-amber-200 text-amber-900 flex items-center justify-center font-black text-sm group-hover:scale-110 transition-transform">
                    {idx + 1}
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-50 to-emerald-50 text-amber-900 border border-amber-200">
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-2 group-hover:text-amber-800 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verified Quality Batch</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

// 3. WHOLESALE & B2B MANUFACTURER INQUIRY SECTION
export const WholesaleSection: React.FC<{ settings: StoreSettings }> = ({ settings }) => {
  const [inquiryType, setInquiryType] = useState('Bulk Henna Powder (10kg - 1000kg)');
  const [destinationCity, setDestinationCity] = useState('');
  const [estimatedQuantity, setEstimatedQuantity] = useState('50 kg');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const handleWholesaleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `*WHOLESALE B2B INQUIRY - MATESHWARI INDUSTRIES*
----------------------------------------
• *Product / Category:* ${inquiryType}
• *Quantity Required:* ${estimatedQuantity || 'To be discussed'}
• *Delivery Destination:* ${destinationCity || 'India'}
• *Inquirer Name:* ${contactName || 'Valued Business Partner'}
• *Contact Phone:* ${contactPhone || 'Available on WhatsApp'}
----------------------------------------
Hello Mateshwari Industries! I am looking for factory-direct wholesale pricing and supply terms for the above requirements. Please provide your rate card and bulk shipping options.`;

    const url = `https://wa.me/${cleanPhoneNumber(settings.sellerWhatsApp, settings.countryCode)}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <section id="wholesale" className="py-16 sm:py-20 bg-gradient-to-br from-[#201507] via-[#161f10] to-[#0c2415] text-white relative overflow-hidden">
      {/* Decorative background lights */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Wholesale Information */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/25 to-emerald-500/25 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5 text-amber-300" />
              Direct Manufacturer Supply • B2B & Bulk
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Direct Factory Supply for Salons, Bridal Artists & Distributors
            </h2>

            <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed font-normal">
              Whether you are a professional mehndi artist needing 5kg of microfine sifted body art powder every month, a bridal salon network, or a distributor looking for bulk 25kg & 50kg gunny bags with customized private labeling, Mateshwari Industries offers guaranteed factory prices.
            </p>

            {/* Wholesale benefits */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Tiered Bulk Volume Discounts</h4>
                  <p className="text-xs text-amber-200/70">Attractive wholesale pricing for orders above 10kg, 50kg, and metric ton consignments.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Custom Private Labeling & Packaging</h4>
                  <p className="text-xs text-amber-200/70">Packaging in custom pouches, silver foil bags, 100g, 250g, 500g, or bulk barrels with your brand logo.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Pan-India Transport & Export Freight</h4>
                  <p className="text-xs text-amber-200/70">Tied up with dependable freight carriers, V-Trans, TCI, and express couriers for on-time delivery.</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-4 text-xs text-amber-200 font-medium">
              <span className="flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-amber-400" />
                Digital Tare Weight Certified
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-emerald-400" />
                Long-Term Merchant Contracts
              </span>
            </div>
          </div>

          {/* Right Wholesale Quote Form */}
          <div className="lg:col-span-6">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 text-slate-800 border border-amber-300 shadow-2xl shadow-black/40">
              <div className="mb-6">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
                  Instant WhatsApp Quotation
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Request Factory Rate Card
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Fill in your details to generate a customized bulk quotation message sent directly to Mateshwari Industries.
                </p>
              </div>

              <form onSubmit={handleWholesaleWhatsAppSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Requirement Type *
                  </label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                  >
                    <option value="Bulk Henna Powder (10kg - 1000kg)">Bulk Henna Powder (10kg - 1000kg)</option>
                    <option value="Pure Henna Essential Oils (Nilgiri / Cajeput 1L - 25L)">Pure Henna Essential Oils (Nilgiri / Cajeput 1L - 25L)</option>
                    <option value="Herbal Hair Henna & Natural Colors (Salon Packs)">Herbal Hair Henna & Natural Colors (Salon Packs)</option>
                    <option value="Ready-to-Use Fresh Henna Cones (Bulk Artist Packs)">Ready-to-Use Fresh Henna Cones (Bulk Artist Packs)</option>
                    <option value="Private Label & Custom Brand Packaging">Private Label & Custom Brand Packaging</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Estimated Quantity *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 25 kg, 50 kg, 100 kg"
                      value={estimatedQuantity}
                      onChange={(e) => setEstimatedQuantity(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Delivery Destination City *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai, Delhi, Jaipur, Dubai"
                      value={destinationCity}
                      onChange={(e) => setDestinationCity(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Business / Artist Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your Name or Salon Name"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      placeholder="Your 10-digit number"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-700 hover:from-amber-700 hover:via-amber-800 hover:to-emerald-800 text-white font-black text-sm shadow-lg shadow-amber-900/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-amber-200" />
                  <span>Send WhatsApp Wholesale Inquiry</span>
                </button>

                <p className="text-[11px] text-center text-slate-500 pt-1">
                  Direct connection with factory management. We typically respond within 15–30 minutes during business hours.
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

// 4. TESTIMONIALS & ARTIST REVIEWS SECTION
export const ReviewsSection: React.FC = () => {
  const reviews = [
    {
      name: 'Pooja Verma',
      role: 'Celebrity Bridal Mehndi Artist, Mumbai',
      rating: 5,
      comment: 'Mateshwari Industries Henna powder is simply outstanding! The triple cloth sifting means absolutely no pin clog when executing ultra-fine bridal figures. The stain turns deep mahogany black within 36 hours. Sourcing directly from Sojat makes a noticeable difference.',
      product: 'Triple Cloth Sifted Body Art Henna',
    },
    {
      name: 'Rajesh Sharma',
      role: 'Owner, Royal Looks Salon Chain, Jaipur',
      rating: 5,
      comment: 'We switched all our 6 salons to Mateshwari herbal hair henna and Cajeput essential oil. Our clients love that it has zero chemical smell, conditions the scalp naturally, and covers stubborn greys with a rich auburn tint. Prompt WhatsApp dispatch every time.',
      product: 'Herbal Hair Henna & Cajeput Oil',
    },
    {
      name: 'Farhana Sheikh',
      role: 'Organic Cosmetics Retailer, Ahmedabad',
      rating: 5,
      comment: 'Their wholesale service is transparent and genuine. Net weights are accurate, vacuum pouches preserve freshness, and the color release test always exceeds 2.8% Lawsone. Ordering via WhatsApp is incredibly quick and hassle-free.',
      product: 'Wholesale Sojat Henna 50kg Consignment',
    },
  ];

  return (
    <section id="reviews" className="py-16 sm:py-20 bg-white border-b border-amber-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 to-emerald-600/15 text-amber-900 border border-amber-300/80 text-xs font-bold uppercase tracking-wider mb-3">
            <Star className="w-4 h-4 text-amber-600 fill-amber-500" />
            Artist & Client Testimonials
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Trusted by 5,000+ Mehndi Artists & Salons
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Read firsthand experiences from professional henna artists, cosmetic brands, and salon chains across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, idx) => (
            <div
              key={idx}
              className="bg-slate-50/70 rounded-3xl p-6 sm:p-7 border border-slate-200 flex flex-col justify-between hover:border-amber-300 hover:bg-white hover:shadow-xl transition-all duration-300"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-500" />
                  ))}
                </div>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic mb-6">
                  "{r.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/80">
                <div className="font-bold text-slate-900 text-sm">{r.name}</div>
                <div className="text-[11px] text-slate-500 font-medium mb-1.5">{r.role}</div>
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                  {r.product}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

// 5. FREQUENTLY ASKED QUESTIONS (FAQ) SECTION
export const FAQSection: React.FC<{ settings: StoreSettings }> = ({ settings }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does 1-Tap WhatsApp Ordering work on this website?',
      a: 'Simply click "Buy on WhatsApp" on any product or click "Place Order via WhatsApp" in your cart. The system instantly compiles your selected items, prices, weights, and high-resolution photo links into a formatted message and opens WhatsApp with our official business number. No passwords or complicated checkout accounts required!',
    },
    {
      q: 'Why is Sojat Henna considered the finest in the world?',
      a: 'Sojat City in Pali, Rajasthan possesses a distinctive arid microclimate, rocky soil, and seasonal rainfall that naturally stresses the Lawsonia inermis plant. This botanical stress causes the leaves to generate the world\'s highest concentration of Lawsone dye molecules (>2.8%), yielding deeper, longer-lasting stains.',
    },
    {
      q: 'Are Mateshwari Industries products 100% chemical and PPD free?',
      a: 'Yes, absolutely. We guarantee zero PPD (paraphenylenediamine), zero ammonia, zero metallic salts, and zero sodium picramate. Our powders are 100% pure dried leaves and our essential oils are 100% steam-distilled pure botanical essences.',
    },
    {
      q: 'What is the shelf life and storage recommendation?',
      a: 'Unopened vacuum-sealed pouches last up to 18-24 months when stored in a cool, dark, dry place away from direct sunlight. Once opened, seal the zip lock securely or transfer into an airtight container. Essential oils maintain potency for 3 years.',
    },
    {
      q: 'Do you offer bulk wholesale and private label services?',
      a: 'Yes! We supply bulk gunny bags (25kg & 50kg), 1kg silver foil bags, and custom private label packaging with your brand artwork for salons, bridal academies, and export partners. Submit an inquiry through our Wholesale section or chat directly on WhatsApp.',
    },
    {
      q: 'How long does dispatch and shipping take across India?',
      a: 'Orders are dispatched from our Sojat City manufacturing facility within 24 hours of confirmation. Standard courier delivery takes 2–4 business days for North and Western India, and 3–6 business days for Southern, Eastern, and North-Eastern regions.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 sm:py-20 bg-slate-50 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 to-emerald-600/15 text-amber-900 border border-amber-300/80 text-xs font-bold uppercase tracking-wider mb-3">
            <Award className="w-4 h-4 text-amber-700" />
            Frequently Asked Questions
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Got Questions? We Have Answers
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Learn more about our products, manufacturing, stain science, and order fulfillment.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-200 shadow-xs"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left px-5 sm:px-6 py-4 sm:py-4.5 flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:text-amber-800 transition-colors"
                >
                  <span>{faq.q}</span>
                  <div className={`p-1 rounded-lg ${isOpen ? 'bg-amber-100 text-amber-900' : 'text-slate-400'} shrink-0`}>
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-amber-50/20">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-300/80 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-extrabold text-slate-900 text-base">Still have questions about our Henna?</h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Chat directly with our Sojat factory technical team on WhatsApp.
            </p>
          </div>
          <a
            href={`https://wa.me/${cleanPhoneNumber(settings.sellerWhatsApp, settings.countryCode)}?text=${encodeURIComponent(
              `Hello Mateshwari Industries! I have a question regarding your Henna products.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-700 hover:from-amber-700 hover:via-amber-800 hover:to-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md shrink-0 flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-amber-200" />
            <span>Ask on WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};

// 6. FLOATING WHATSAPP BUTTON FOR WEBSITE
export const WhatsAppFloatingButton: React.FC<{ settings: StoreSettings }> = ({ settings }) => {
  const whatsappUrl = `https://wa.me/${cleanPhoneNumber(settings.sellerWhatsApp, settings.countryCode)}?text=${encodeURIComponent(
    `Hello ${settings.storeName}! I am browsing your website and want to ask a question.`
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      title="Direct WhatsApp Support"
      className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white p-3.5 sm:px-4 sm:py-3.5 rounded-full shadow-2xl shadow-emerald-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 border-2 border-emerald-400/50 group"
    >
      <div className="relative">
        <MessageCircle className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-300 rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-300 rounded-full" />
      </div>
      <span className="hidden sm:inline font-black text-xs sm:text-sm tracking-wide">
        WhatsApp Order & Support
      </span>
    </a>
  );
};
