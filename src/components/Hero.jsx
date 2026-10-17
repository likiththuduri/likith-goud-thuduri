import React from 'react';
import { Camera, MapPin } from 'lucide-react';

export default function Hero({ settings }) {
  return (
    <section className="relative pt-36 pb-16 md:pt-48 md:pb-24 border-b border-[#E7E5E4] overflow-hidden">
      {/* Subtle background ambient gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#F5F3EF] to-transparent pointer-events-none -z-10 opacity-70"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
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
        <p className="text-lg sm:text-xl text-[#57534E] max-w-2xl mx-auto font-normal leading-relaxed">
          {settings?.introText || 'Moments, places, people, and memories — collected one frame at a time.'}
        </p>

      </div>
    </section>
  );
}
