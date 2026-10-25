import React from 'react';
import { LayoutGrid, List, SlidersHorizontal, Check } from 'lucide-react';
import { FilterState, ViewMode } from '../types';

interface CategoryFilterProps {
  categories: string[];
  productCounts: Record<string, number>;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  totalProductsCount: number;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  productCounts,
  filters,
  setFilters,
  viewMode,
  setViewMode,
  totalProductsCount,
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        <button
          onClick={() => setFilters((prev) => ({ ...prev, selectedCategory: 'All' }))}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            filters.selectedCategory === 'All'
              ? 'bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-700 text-white shadow-sm shadow-amber-600/30 ring-2 ring-amber-500/40'
              : 'bg-white hover:bg-amber-50/60 text-slate-700 border border-slate-200 hover:border-amber-200'
          }`}
        >
          <span>All Items</span>
          <span
            className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
              filters.selectedCategory === 'All'
                ? 'bg-amber-950/40 text-amber-100'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {totalProductsCount}
          </span>
        </button>

        {categories.map((category) => {
          const count = productCounts[category] || 0;
          const isSelected = filters.selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setFilters((prev) => ({ ...prev, selectedCategory: category }))}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-700 text-white shadow-sm shadow-amber-600/30 ring-2 ring-amber-500/40'
                  : 'bg-white hover:bg-amber-50/60 text-slate-700 border border-slate-200 hover:border-amber-200'
              }`}
            >
              <span>{category}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-amber-950/40 text-amber-100' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sorting, Filter Controls & View Toggle Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-amber-200/60 shadow-2xs text-xs sm:text-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
            <span>Sort By:</span>
          </div>

          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                sortBy: e.target.value as FilterState['sortBy'],
              }))
            }
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-amber-500"
          >
            <option value="featured">Featured / Best Selling</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="discount">Highest Discount %</option>
            <option value="name">Name (A - Z)</option>
          </select>

          {/* In Stock only toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer select-none text-xs text-slate-700 font-medium pl-2 border-l border-slate-200">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))}
              className="sr-only"
            />
            <div
              className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                filters.inStockOnly
                  ? 'bg-gradient-to-r from-amber-600 to-emerald-600 border-amber-600 text-white'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {filters.inStockOnly && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span>In-Stock Only</span>
          </label>
        </div>

        {/* View Mode Toggle: Grid vs List */}
        <div className="flex items-center gap-1 bg-amber-50/70 p-1 rounded-xl border border-amber-200/50">
          <button
            onClick={() => setViewMode('grid')}
            title="Grid View"
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-white text-amber-800 shadow-2xs font-bold border border-amber-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            title="List View"
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-amber-800 shadow-2xs font-bold border border-amber-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
