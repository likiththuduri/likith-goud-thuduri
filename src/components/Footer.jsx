import React from 'react';
import { ArrowUp, Camera, Lock, Heart } from 'lucide-react';
import InstagramIcon from './InstagramIcon';

export default function Footer({ settings, onAdminClick }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-stone-200 bg-[#FAF9F6] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between pb-10 border-b border-stone-200/80 gap-6">
          
          {/* Logo & Tagline */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <span className="font-editorial text-2xl font-semibold text-stone-900">
                {settings?.brandName || 'likith.'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-stone-900 opacity-60"></span>
            </div>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-stone-500 mt-0.5">
              {settings?.tagline || 'into my captures'}
            </p>
          </div>

          {/* Quick Instagram Pill */}
          <div className="flex items-center space-x-4">
            <a
              href={settings?.instagramUrl || 'https://www.instagram.com/likith_thuduri/'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-xs font-mono px-4 py-2 rounded-full border border-stone-300 hover:border-stone-900 bg-white text-stone-800 hover:text-stone-900 transition-all shadow-subtle"
            >
              <InstagramIcon size={14} className="text-[#E1306C]" />
              <span>Follow @{settings?.instagramUsername || 'likith_thuduri'} on Instagram</span>
            </a>

            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-full border border-stone-300 hover:border-stone-900 bg-white text-stone-600 hover:text-stone-900 transition-colors shadow-subtle"
              title="Return to top of page"
            >
              <ArrowUp size={15} />
            </button>
          </div>

        </div>

        {/* Bottom copyright & admin access */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 font-mono gap-4">
          <p className="text-center sm:text-left">
            {settings?.footerText || `Captured through the lens of ${settings?.fullName || 'Thuduri Likith Goud'}. All photographs and rights reserved.`}
          </p>

          <div className="flex items-center space-x-4">
            <span className="flex items-center text-stone-400">
              Handcrafted with <Heart size={10} className="mx-1 text-rose-500 fill-current" /> for visual storytelling
            </span>
            <span className="text-stone-300">•</span>
            <button
              onClick={onAdminClick}
              className="hover:text-stone-900 transition-colors flex items-center space-x-1"
            >
              <Lock size={11} />
              <span>Admin Studio</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
