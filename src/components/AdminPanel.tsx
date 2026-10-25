import React, { useState, useRef } from 'react';
import { Plus, Upload, Trash2, Edit2, Download, Save, Store, MessageCircle, Scale, Tag, Sparkles, Check, Image as ImageIcon, RotateCcw, AlertTriangle, FileSpreadsheet, Lock, KeyRound, ShieldCheck, FileText, Copy, ExternalLink } from 'lucide-react';
import { Product, StoreSettings } from '../types';
import { cleanPhoneNumber } from '../utils/whatsapp';

interface AdminPanelProps {
  products: Product[];
  settings: StoreSettings;
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onDeleteAllCatalog: () => void;
  onBulkDeleteProducts: (productIds: string[]) => void;
  onBulkImport: (products: Product[]) => void;
  onResetCatalog: () => void;
  onSaveSettings: (settings: StoreSettings) => void;
  showToast: (msg: string) => void;
  onSwitchToCustomerView: () => void;
  onLockAdmin?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  settings,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onDeleteAllCatalog,
  onBulkDeleteProducts,
  onBulkImport,
  onResetCatalog,
  onSaveSettings,
  showToast,
  onSwitchToCustomerView,
  onLockAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'bulk' | 'settings' | 'manage' | 'notepad'>('upload');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  // Settings State
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({ ...settings });

  // Single Product Upload Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Henna Powder');
  const [customCategory, setCustomCategory] = useState('');
  const [price, setPrice] = useState<string>('350');
  const [originalPrice, setOriginalPrice] = useState<string>('480');
  const [weight, setWeight] = useState('1 kg');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState<string[]>([
    '100% Pure Organic Sojat Henna',
    'Triple micro-sifted cloth filter grade',
    'Guaranteed rich, dark stain payoff',
  ]);
  const [badge, setBadge] = useState('Best Seller');
  const [inStock, setInStock] = useState(true);

  // Quick preset weights
  const weightPresets = ['100 g', '250 g', '500 g', '1 kg', '5 kg', '100 ml', '200 ml', '250 ml', '500 ml', '1 Litre', '12 Cones Pack'];

  // Categories list
  const existingCategories = Array.from(new Set(products.map((p) => p.category)));

  // Calculate discount preview
  const numPrice = parseFloat(price) || 0;
  const numOrigPrice = parseFloat(originalPrice) || 0;
  const discountPercent =
    numOrigPrice > numPrice && numOrigPrice > 0
      ? Math.round(((numOrigPrice - numPrice) / numOrigPrice) * 100)
      : 0;

  // Image Upload handler (File -> Base64 dataURL)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      showToast('⚠️ Image too large. Please select an image under 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result as string);
      showToast('📸 Image uploaded successfully!');
    };
    reader.readAsDataURL(file);
  };

  const handleAddFeature = () => {
    setFeatures([...features, '']);
  };

  const handleUpdateFeature = (index: number, val: string) => {
    const updated = [...features];
    updated[index] = val;
    setFeatures(updated);
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  // Submit product
  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('⚠️ Please provide a product name');
      return;
    }

    const finalCategory = category === 'Other' && customCategory ? customCategory : category;
    const finalFeatures = features.filter((f) => f.trim().length > 0);

    const productData: Product = {
      id: editingId || `prod-${Date.now()}`,
      name: name.trim(),
      category: finalCategory,
      price: numPrice,
      originalPrice: numOrigPrice > numPrice ? numOrigPrice : undefined,
      discountPercent: discountPercent > 0 ? discountPercent : undefined,
      weight: weight.trim() || '500 g',
      images: [
        imageUrl.trim() ||
          'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
      ],
      features: finalFeatures.length > 0 ? finalFeatures : ['Premium Fresh Quality'],
      description: description.trim() || `Fresh premium ${name.trim()} carefully packed to retain peak freshness.`,
      inStock,
      badge: badge || undefined,
      createdAt: editingId ? undefined! : new Date().toISOString(),
    };

    if (editingId) {
      onUpdateProduct(productData);
      showToast(`Updated "${productData.name}" in catalog!`);
      setEditingId(null);
    } else {
      onAddProduct(productData);
      showToast(`Added "${productData.name}" to catalog!`);
    }

    // Reset form
    setName('');
    setPrice('499');
    setOriginalPrice('699');
    setImageUrl('');
    setDescription('');
    setEditingId(null);
  };

  const startEditProduct = (prod: Product) => {
    setEditingId(prod.id);
    setName(prod.name);
    setCategory(prod.category);
    setPrice(prod.price.toString());
    setOriginalPrice(prod.originalPrice ? prod.originalPrice.toString() : '');
    setWeight(prod.weight);
    setImageUrl(prod.images?.[0] || '');
    setDescription(prod.description || '');
    setFeatures(prod.features?.length ? [...prod.features] : ['']);
    setBadge(prod.badge || '');
    setInStock(prod.inStock);
    setActiveTab('upload');
    showToast(`Editing "${prod.name}"`);
  };

  // CSV Import Parser
  const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter((l) => l.trim().length > 0);
        if (lines.length <= 1) {
          showToast('⚠️ CSV file is empty or missing headers');
          return;
        }

        const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
        const importedList: Product[] = [];

        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
          if (cols.length < 2) continue;

          const prodName = cols[0] || `Product ${i}`;
          const prodPrice = parseFloat(cols[1]) || 100;
          const prodOrig = parseFloat(cols[2]) || prodPrice;
          const prodWeight = cols[3] || '500 g';
          const prodCategory = cols[4] || 'General';
          const prodImage = cols[5] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80';
          const prodFeatures = cols[6] ? cols[6].split(';').map((f) => f.trim()) : ['Verified Quality'];

          importedList.push({
            id: `prod-csv-${Date.now()}-${i}`,
            name: prodName,
            price: prodPrice,
            originalPrice: prodOrig > prodPrice ? prodOrig : undefined,
            discountPercent: prodOrig > prodPrice ? Math.round(((prodOrig - prodPrice) / prodOrig) * 100) : undefined,
            weight: prodWeight,
            category: prodCategory,
            images: [prodImage],
            features: prodFeatures,
            description: `Imported catalog product: ${prodName}`,
            inStock: true,
            createdAt: new Date().toISOString(),
          });
        }

        if (importedList.length > 0) {
          onBulkImport(importedList);
          showToast(`🎉 Successfully imported ${importedList.length} products from CSV!`);
        }
      } catch {
        showToast('❌ Error parsing CSV file. Please check format.');
      }
    };
    reader.readAsText(file);
  };

  // Export JSON Catalog
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `catalog-export-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('💾 Catalog exported as JSON!');
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white rounded-3xl p-6 mb-6 shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Store className="w-4 h-4" />
            <span>Merchant Control Room</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black">Product Catalog & WhatsApp Setup</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Upload new products, configure your WhatsApp number, set discounts, and manage orders
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onLockAdmin && (
            <button
              type="button"
              onClick={onLockAdmin}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/80 border border-slate-700 hover:border-rose-500 text-rose-300 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5"
              title="Lock Admin and require PIN to enter again"
            >
              <Lock className="w-4 h-4 text-rose-400" />
              <span>Lock & Log Out</span>
            </button>
          )}

          <button
            onClick={onSwitchToCustomerView}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Customer Website</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-slate-200">
        <button
          onClick={() => {
            setEditingId(null);
            setActiveTab('upload');
          }}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'upload'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>{editingId ? 'Edit Product' : 'Upload New Product'}</span>
        </button>

        <button
          onClick={() => setActiveTab('manage')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'manage'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Manage Catalog ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bulk')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'bulk'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Bulk CSV / JSON Import</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp & Store Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('notepad')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'notepad'
              ? 'bg-gradient-to-r from-amber-600 to-emerald-700 text-white shadow-xs'
              : 'text-amber-800 hover:bg-amber-50 border border-amber-300'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Notepad Code (Single File HTML)</span>
        </button>
      </div>

      {/* TAB 1: Upload Product Form */}
      {activeTab === 'upload' && (
        <form onSubmit={handleSubmitProduct} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                {editingId ? 'Edit Product Details' : 'Add Product to Catalog'}
              </h2>
              <p className="text-xs text-slate-500">
                Provide images, price, discounts, net weight, and feature bullets for WhatsApp orders
              </p>
            </div>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setName('');
                }}
                className="text-xs text-slate-500 hover:text-slate-900 font-semibold"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Name, Category, Price, Weight */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., California Jumbo Almonds (Badam Giri)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-emerald-500 outline-none"
                  >
                    {existingCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="Henna Powder">Henna Powder</option>
                    <option value="Henna Essential Oils">Henna Essential Oils</option>
                    <option value="Hair Henna">Hair Henna</option>
                    <option value="Herbal Henna">Herbal Henna</option>
                    <option value="Henna Cones">Henna Cones</option>
                    <option value="Other">Other (Custom)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Badge Tag (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Best Seller, New"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {category === 'Other' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Custom Category Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Fresh Cold-Pressed Oils"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              {/* Pricing & Discounts */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Pricing & Discount
                  </span>
                  {discountPercent > 0 && (
                    <span className="text-xs font-black bg-rose-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                      {discountPercent}% OFF Badge
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Selling Price ({storeSettings.currencySymbol}) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Original Price / MRP ({storeSettings.currencySymbol})
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g., 650"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-700 outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {discountPercent > 0 && (
                  <p className="text-[11px] text-emerald-700 font-semibold">
                    ✓ Customers will see: "Save {storeSettings.currencySymbol}
                    {numOrigPrice - numPrice} ({discountPercent}% OFF)"
                  </p>
                )}
              </div>

              {/* Weight / Pack Specification (Requested by User) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-emerald-600" />
                    <span>Weight / Pack Size *</span>
                  </label>
                  <span className="text-[11px] font-mono text-emerald-700 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                    {weight || 'None'}
                  </span>
                </div>

                <input
                  type="text"
                  required
                  placeholder="e.g., 500 g, 1 kg, 250 ml, 1 Pack"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm outline-none focus:border-emerald-500"
                />

                {/* Quick preset chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-medium">Quick Pick:</span>
                  {weightPresets.map((pw) => (
                    <button
                      key={pw}
                      type="button"
                      onClick={() => setWeight(pw)}
                      className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border transition-all ${
                        weight === pw
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {pw}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Image, Features, Description */}
            <div className="space-y-4">
              {/* Image Upload Area */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Product Image * (Included in WhatsApp Message)
                </label>

                {/* Image Preview Box */}
                <div className="flex gap-4 items-center">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0 relative flex items-center justify-center">
                    {imageUrl ? (
                      <img src={imageUrl} alt="Product Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:border-emerald-600 hover:text-emerald-700 text-xs font-bold text-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Local Photo</span>
                    </button>

                    <div className="relative">
                      <input
                        type="url"
                        placeholder="Or paste direct image URL (https://...)"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bullet Features (User requested: features) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Product Highlights / Features</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="text-[11px] text-emerald-700 font-bold hover:underline"
                  >
                    + Add Bullet
                  </button>
                </div>

                <div className="space-y-2">
                  {features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold text-xs">✓</span>
                      <input
                        type="text"
                        placeholder={`Feature ${idx + 1} (e.g. 100% Non-GMO, No additives)`}
                        value={feat}
                        onChange={(e) => handleUpdateFeature(idx, e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs outline-none focus:border-emerald-500 bg-white"
                      />
                      {features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description / Story
                </label>
                <textarea
                  rows={2}
                  placeholder="Detailed background on origin, taste notes, storage instructions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              {/* In stock toggle */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
                <span className="text-xs font-bold text-slate-800">
                  Product is In-Stock and Ready to Dispatch
                </span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/30 flex items-center gap-2 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{editingId ? 'Save Changes' : 'Publish Product to Catalog'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Manage Existing Catalog Table */}
      {activeTab === 'manage' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Current Catalog ({products.length} Products)
              </h2>
              <p className="text-xs text-slate-500">
                Quickly toggle stock availability, edit prices, or update product features
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* Selected items batch delete */}
              {selectedProductIds.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm(`Delete the ${selectedProductIds.length} selected products?`)) {
                      onBulkDeleteProducts(selectedProductIds);
                      setSelectedProductIds([]);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all animate-in fade-in"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Selected ({selectedProductIds.length})</span>
                </button>
              )}

              {/* DELETE ENTIRE CATALOG BUTTON */}
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={products.length === 0}
                className="px-3 py-1.5 rounded-xl border border-rose-300 hover:border-rose-500 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all disabled:opacity-40 disabled:pointer-events-none"
                title="Wipe and delete all products in catalog"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Delete Entire Catalog</span>
              </button>

              <button
                onClick={handleExportJson}
                disabled={products.length === 0}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export JSON</span>
              </button>

              <button
                onClick={() => {
                  setEditingId(null);
                  setActiveTab('upload');
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-100">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">Catalog is Empty</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                All products have been deleted. You can upload new products individually, import from CSV, or restore the default Mateshwari Industries catalog.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setEditingId(null);
                    setActiveTab('upload');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload Product</span>
                </button>
                <button
                  onClick={() => {
                    onResetCatalog();
                    showToast('🔄 Restored default Mateshwari Industries Henna catalog!');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Restore Default Henna Catalog</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3 w-8">
                      <input
                        type="checkbox"
                        checked={
                          products.length > 0 && selectedProductIds.length === products.length
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProductIds(products.map((p) => p.id));
                          } else {
                            setSelectedProductIds([]);
                          }
                        }}
                        className="w-4 h-4 rounded accent-emerald-600"
                        title="Select All Products"
                      />
                    </th>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-3">Weight</th>
                    <th className="py-3 px-3">Price</th>
                    <th className="py-3 px-3">Discount</th>
                    <th className="py-3 px-3">Stock Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((prod) => {
                    const isSelected = selectedProductIds.includes(prod.id);
                    return (
                      <tr
                        key={prod.id}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isSelected ? 'bg-emerald-50/50' : ''
                        }`}
                      >
                        <td className="py-3 px-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedProductIds((prev) => [...prev, prod.id]);
                              } else {
                                setSelectedProductIds((prev) =>
                                  prev.filter((id) => id !== prod.id)
                                );
                              }
                            }}
                            className="w-4 h-4 rounded accent-emerald-600"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.images?.[0] || ''}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover bg-slate-200 border border-slate-200 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-slate-900 line-clamp-1">{prod.name}</p>
                              <span className="text-[10px] text-emerald-700 font-medium">
                                {prod.category}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-700">{prod.weight}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">
                          {storeSettings.currencySymbol}
                          {prod.price}
                        </td>
                        <td className="py-3 px-3">
                          {prod.discountPercent ? (
                            <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full text-[10px]">
                              {prod.discountPercent}% OFF
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() => {
                              onUpdateProduct({ ...prod, inStock: !prod.inStock });
                              showToast(`Set "${prod.name}" to ${!prod.inStock ? 'In Stock' : 'Out of Stock'}`);
                            }}
                            className={`px-2 py-1 rounded-md text-[10px] font-bold transition-colors ${
                              prod.inStock
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                            }`}
                          >
                            {prod.inStock ? '✓ In Stock' : '✕ Sold Out'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => startEditProduct(prod)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                              title="Edit product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete "${prod.name}"?`)) {
                                  onDeleteProduct(prod.id);
                                  setSelectedProductIds((prev) =>
                                    prev.filter((id) => id !== prod.id)
                                  );
                                  showToast(`Removed "${prod.name}"`);
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Bulk CSV / JSON Import */}
      {activeTab === 'bulk' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900">Bulk Catalog Tools & Management</h2>
            <p className="text-xs text-slate-500">
              Upload spreadsheets, wipe/delete existing catalog, or restore the default Mateshwari Industries Henna catalog.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* CSV File Upload Card */}
            <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 flex flex-col items-center justify-center text-center space-y-3 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Upload Catalog CSV</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Columns: Name, Price, OriginalPrice, Weight, Category, ImageUrl, Features
                </p>
              </div>

              <input
                type="file"
                ref={csvInputRef}
                accept=".csv"
                onChange={handleCsvImport}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => csvInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Select .CSV File</span>
              </button>
            </div>

            {/* DELETE / WIPE CATALOG CARD */}
            <div className="p-6 rounded-2xl border border-rose-200 bg-rose-50/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider mb-1">
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  <span>Danger Zone</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Delete Entire Catalog</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Permanently clear all {products.length} products currently in your catalog. Allows you to start with a blank storefront or upload a brand new catalog.
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  disabled={products.length === 0}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete All {products.length} Products</span>
                </button>
              </div>
            </div>

            {/* Reset to Demo Catalog */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-1">
                  <RotateCcw className="w-4 h-4 text-emerald-600" />
                  <span>Restore Catalog</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Reset to Mateshwari Henna Catalog</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Restores 8 handcrafted Henna products (Pure Sojat Henna Powder, Eucalyptus Darkening Oil, Cajeput Oil, Hair Henna, and Cones) with images, weights, and features.
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Reset catalog back to Mateshwari Industries default Henna products?')) {
                      onResetCatalog();
                      showToast('🔄 Restored default Mateshwari Industries Henna catalog!');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Restore Henna Catalog</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: WhatsApp Number & Store Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              WhatsApp Direct Order & Store Configuration
            </h2>
            <p className="text-xs text-slate-500">
              Configure the WhatsApp phone number where all customer order messages and product pictures will be sent!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* WhatsApp Phone Settings */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                <span>Seller WhatsApp Phone Number (Crucial)</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-1">
                  Your WhatsApp Number *
                </label>
                <div className="flex gap-2">
                  <select
                    value={storeSettings.countryCode}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, countryCode: e.target.value })
                    }
                    className="w-28 bg-white border border-emerald-300 rounded-xl px-2.5 py-2 text-xs font-bold text-emerald-950 outline-none"
                  >
                    <option value="+91">🇮🇳 +91 (IN)</option>
                    <option value="+1">🇺🇸 +1 (US)</option>
                    <option value="+44">🇬🇧 +44 (UK)</option>
                    <option value="+971">🇦🇪 +971 (UAE)</option>
                    <option value="+61">🇦🇺 +61 (AU)</option>
                    <option value="+65">🇸🇬 +65 (SG)</option>
                    <option value="+49">🇩🇪 +49 (DE)</option>
                    <option value="+33">🇫🇷 +33 (FR)</option>
                  </select>

                  <input
                    type="text"
                    required
                    placeholder="e.g., 9876543210"
                    value={storeSettings.sellerWhatsApp}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, sellerWhatsApp: e.target.value })
                    }
                    className="flex-1 bg-white border border-emerald-300 rounded-xl px-3 py-2 text-sm font-bold text-emerald-950 outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <p className="text-[11px] text-emerald-800 mt-1 font-medium">
                  Clean number: {cleanPhoneNumber(storeSettings.sellerWhatsApp, storeSettings.countryCode)}
                </p>
              </div>

              {/* Test link */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${cleanPhoneNumber(
                    storeSettings.sellerWhatsApp,
                    storeSettings.countryCode
                  )}?text=${encodeURIComponent('Hello! Testing WhatsApp direct order link from CatalogCraft.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-white px-3 py-1.5 rounded-lg border border-emerald-300 hover:bg-emerald-100 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Test Opening WhatsApp with this Number ↗</span>
                </a>
              </div>
            </div>

            {/* Store Branding */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Store / Brand Name
                </label>
                <input
                  type="text"
                  value={storeSettings.storeName}
                  onChange={(e) =>
                    setStoreSettings({ ...storeSettings, storeName: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={storeSettings.tagline}
                  onChange={(e) =>
                    setStoreSettings({ ...storeSettings, tagline: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Currency Symbol
                  </label>
                  <input
                    type="text"
                    value={storeSettings.currencySymbol}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, currencySymbol: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Free Delivery Min Order ({storeSettings.currencySymbol})
                  </label>
                  <input
                    type="number"
                    value={storeSettings.freeShippingAbove}
                    onChange={(e) =>
                      setStoreSettings({
                        ...storeSettings,
                        freeShippingAbove: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Announcement Banner Text
                </label>
                <input
                  type="text"
                  value={storeSettings.announcementText}
                  onChange={(e) =>
                    setStoreSettings({ ...storeSettings, announcementText: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Dedicated Owner Access Control & Security Card */}
          <div className="p-6 rounded-2xl bg-amber-50/80 border-2 border-amber-300 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-amber-900" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <span>Owner Security & Admin PIN Lock</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                      Active
                    </span>
                  </h3>
                  <p className="text-xs text-slate-600">
                    Sirf aap hi is Seller Admin ko khol sakein, iske liye apna secret PIN set karein. Koi customer ise bina PIN ke access nahi kar sakta.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Admin Passcode / PIN *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 8899"
                  value={storeSettings.adminPin || '8899'}
                  onChange={(e) =>
                    setStoreSettings({ ...storeSettings, adminPin: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-amber-300 bg-white text-base font-black tracking-widest text-slate-900 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                />
                <p className="text-[10px] text-amber-900 mt-1">
                  Aapka current PIN yahi hai. Ise badal kar "Save Settings" dabayein.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Store Owner Name
                </label>
                <input
                  type="text"
                  placeholder="Himesh Gehlot"
                  value={storeSettings.ownerName || 'Himesh Gehlot'}
                  onChange={(e) =>
                    setStoreSettings({ ...storeSettings, ownerName: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Owner Recovery Email
                </label>
                <input
                  type="email"
                  placeholder="himeshgehlot10@gmail.com"
                  value={storeSettings.ownerEmail || 'himeshgehlot10@gmail.com'}
                  onChange={(e) =>
                    setStoreSettings({ ...storeSettings, ownerEmail: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2 text-xs text-amber-950 font-medium bg-amber-100/60 p-2.5 rounded-xl border border-amber-200">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                Protection Enabled: Koi bhi "Seller Admin" click karega toh pehle yeh PIN manga jayega. Sirf sahi PIN enter karne par hi admin khulega!
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={() => {
                onSaveSettings(storeSettings);
                showToast('✅ Store and WhatsApp settings saved!');
              }}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: Notepad Single-File HTML Export */}
      {activeTab === 'notepad' && (
        <div className="bg-white rounded-3xl border border-amber-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase mb-1">
                <FileText className="w-3.5 h-3.5 text-amber-700" />
                <span>Single-File HTML (Notepad Ready)</span>
              </div>
              <h2 className="text-xl font-black text-slate-900">
                Notepad Code for Mateshwari Industries Website
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pura website 1 single file me chalega bina kisi server, node, ya hosting ke. Windows Notepad me paste karke save karein!
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/mateshwari_notepad.html"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl border border-amber-300 hover:bg-amber-50 text-amber-900 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Test Run File</span>
              </a>

              <a
                href="/mateshwari_notepad.html"
                download="index.html"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-emerald-700 hover:brightness-110 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-900/10 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download index.html</span>
              </a>
            </div>
          </div>

          {/* Quick Copy & Download Action Banner */}
          <div className="bg-gradient-to-r from-amber-50 via-amber-100/50 to-emerald-50 rounded-2xl p-5 border border-amber-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-black text-sm text-stone-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                1-Click Copy or Download
              </h3>
              <p className="text-xs text-stone-600">
                Aap directly "Download index.html" par click karke file apne computer me save kar sakte hain ya neeche diye gaye button se pura code copy kar sakte hain.
              </p>
            </div>

            <button
              type="button"
              onClick={async () => {
                try {
                  const res = await fetch('/mateshwari_notepad.html');
                  const code = await res.text();
                  await navigator.clipboard.writeText(code);
                  showToast('📋 Notepad Code copied to clipboard! Ab Notepad me paste karein.');
                } catch {
                  showToast('⚠️ Could not copy automatically. Please click Download index.html.');
                }
              }}
              className="w-full md:w-auto px-5 py-3 rounded-xl bg-stone-900 hover:bg-black text-amber-300 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 shrink-0"
            >
              <Copy className="w-4 h-4 text-amber-400" />
              <span>Copy Full Code</span>
            </button>
          </div>

          {/* Step-by-Step Instructions (Hindi & English) */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-800">
              Notepad me kaise chalayein? (Step-by-step Guide)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 font-black text-xs flex items-center justify-center">1</span>
                <h4 className="text-xs font-bold text-slate-900">Notepad Kholein</h4>
                <p className="text-[11px] text-slate-500">Apne computer me Windows Start dabakar <strong>Notepad</strong> open karein.</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 font-black text-xs flex items-center justify-center">2</span>
                <h4 className="text-xs font-bold text-slate-900">Code Paste Karein</h4>
                <p className="text-[11px] text-slate-500">Upar <strong>"Copy Full Code"</strong> dabayein aur Notepad me <strong>Ctrl + V</strong> (Paste) karein.</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 font-black text-xs flex items-center justify-center">3</span>
                <h4 className="text-xs font-bold text-slate-900">Save As: index.html</h4>
                <p className="text-[11px] text-slate-500">Notepad me <strong>File → Save As</strong> karein. 'Save as type' me <strong>All Files (*.*)</strong> chun kar naam <strong>index.html</strong> rakhein.</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">4</span>
                <h4 className="text-xs font-bold text-slate-900">Website Ready!</h4>
                <p className="text-[11px] text-slate-500">Ab <strong>index.html</strong> par double-click karein, website Chrome/Edge me khul jayegi!</p>
              </div>
            </div>
          </div>

          {/* Privacy & Admin PIN Notice */}
          <div className="p-4 rounded-2xl bg-stone-900 text-amber-100 flex items-start gap-3 text-xs">
            <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Private Admin PIN Protection Included:</p>
              <p className="text-stone-300 mt-0.5">
                Is file me aapka secret admin PIN (<strong>{storeSettings.adminPin || '8899'}</strong>) protected hai. Koi aur bina PIN ke seller panel open nahi kar sakta. Aap chahein toh offline bhi products aur WhatsApp orders manage kar sakte hain.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE ENTIRE CATALOG MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-rose-100 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-2">
              Delete Entire Catalog?
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              You are about to permanently delete all <strong className="text-rose-700 font-bold">{products.length} products</strong> from your catalog. Customers will not see any products in the storefront until you add new items.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 mb-5 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Tip: You can export a JSON backup first, or easily restore the Mateshwari Henna catalog later with the <strong>"Restore Henna Catalog"</strong> button.
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleExportJson()}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Backup JSON First</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  onDeleteAllCatalog();
                  setSelectedProductIds([]);
                  setIsDeleteModalOpen(false);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete All</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
