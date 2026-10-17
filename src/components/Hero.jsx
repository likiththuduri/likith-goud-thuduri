import React from 'react';
import { Camera, MapPin, Sparkles, SlidersHorizontal, Search, ArrowDown, Heart, Eye } from 'lucide-react';

export default function Hero({
  settings,
  photoCount = 0,
  albumCount = 0,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onScrollTo
}) {
  const categories = [
    { id: 'all', label: 'All Captures' },
    { id: 'Street', label: 'Street & Neon' },
    { id: 'Portraits', label: 'Portraits' },
    { id: 'Monochrome', label: 'Monochrome' },
    { id: 'Travel', label: 'Travel & Nature' },
    { id: 'Architecture', label: 'Architecture' },
    { id: 'Moments', label: 'Fleeting Moments' }
  ];

  return (
    <section className="relative pt-36 pb-16 md:pt-48 md:pb-24 border-b border-[#E7E5E4] overflow-hidden">
      {/* Subtle background ambient gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#F5F3EF] to-transparent pointer-events-none -z-10 opacity-70"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Creator Name & Identity Pill */}
        <div className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full bg-stone-100/90 border border-stone-200 text-stone-700 text-xs font-mono tracking-wider uppercase mb-7 shadow-subtle animate-fadeIn">
          <Camera size={13} className="text-stone-900" />
          <span className="font-bold text-stone-900 tracking-widest">{settings?.fullName || 'THUDURI LIKITH GOUD'}</span>
          <span className="text-stone-300">•</span>
          <span className="flex items-center text-stone-600 font-sans normal-case tracking-normal">
            <MapPin size={11} className="mr-1 text-stone-500" />
            {settings?.location || 'Hyderabad, India'}
          </span>
        </div>

        {/* Hero Main Heading (Editorial Serif) */}
        <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-[#1C1917] max-w-4xl mx-auto leading-[1.08] mb-6">
          {settings?.heroHeading || 'A little corner of my world.'}
        </h1>

        {/* Hero Tagline / Bio Statement */}
        <p className="text-lg sm:text-xl text-[#57534E] max-w-2xl mx-auto font-normal leading-relaxed mb-10">
          {settings?.introText || 'Moments, places, people, and memories — collected one frame at a time.'}
        </p>

        {/* Quick Numbers / Photography Stats */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-[#78716C] font-mono uppercase tracking-wider mb-12">
          <div className="flex items-center space-x-2">
            <span className="text-lg sm:text-xl font-bold font-editorial text-[#1C1917]">{photoCount}</span>
            <span>Frames</span>
          </div>
          <span className="text-[#D6D3D1]">•</span>
          <div className="flex items-center space-x-2">
            <span className="text-lg sm:text-xl font-bold font-editorial text-[#1C1917]">{albumCount}</span>
            <span>Curated Albums</span>
          </div>
          <span className="text-[#D6D3D1]">•</span>
          <div className="flex items-center space-x-2">
            <span className="text-stone-800 font-medium">Visual Diary & Captures</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={17} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search captures by title, place, memory..."
              className="w-full pl-11 pr-4 py-3 rounded-full border border-stone-200 bg-white/90 focus:bg-white text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 bg-stone-100 rounded-full px-2 py-0.5"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Curated Category Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#1C1917] text-[#FAF9F6] shadow-sm'
                  : 'bg-white/80 hover:bg-stone-200/70 text-stone-700 border border-stone-200/80 hover:border-stone-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
