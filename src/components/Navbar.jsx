import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Lock, Settings } from 'lucide-react';

export default function Navbar({ settings, onAdminClick, isAdmin, onNavigate }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FAF9F6]/95 backdrop-blur-md border-b border-stone-200/60 py-3.5'
          : 'bg-[#FAF9F6]/80 backdrop-blur-sm py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Minimal Wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (onNavigate) onNavigate('home');
          }}
          className="group inline-flex items-center"
        >
          <span className="font-editorial text-xl sm:text-2xl font-normal tracking-tight text-[#1C1917] lowercase group-hover:opacity-70 transition-opacity">
            likith.
          </span>
        </a>

        {/* Minimal Right Navigation: Subtle Instagram Link & Discreet Admin */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          <a
            href={settings?.instagramUrl || `https://www.instagram.com/${settings?.instagramUsername || 'likith_thuduri'}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm tracking-wide text-stone-500 hover:text-stone-900 transition-colors inline-flex items-center space-x-1"
          >
            <span>instagram</span>
            <ArrowUpRight size={12} className="opacity-60" />
          </a>

          {/* Discreet Admin Studio Access */}
          <button
            onClick={onAdminClick}
            className={`transition-colors p-1 text-xs flex items-center space-x-1 ${
              isAdmin
                ? 'text-emerald-700 hover:text-emerald-900 font-mono'
                : 'text-stone-400 hover:text-stone-700'
            }`}
            title={isAdmin ? "Admin Studio (Active)" : "Admin"}
          >
            {isAdmin ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-[11px] font-mono">studio</span>
              </>
            ) : (
              <Lock size={12} className="opacity-40 hover:opacity-90" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
