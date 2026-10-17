import React, { useState, useEffect } from 'react';
import { Camera, Lock, Menu, X, ArrowUpRight, Compass, Settings } from 'lucide-react';
import InstagramIcon from './InstagramIcon';

export default function Navbar({ settings, onAdminClick, activeSection, onNavigate, isAdmin, onOpenAdminTab }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Albums', href: '#albums', id: 'albums', icon: Compass },
    { name: 'Captures', href: '#gallery', id: 'gallery', icon: Camera }
  ];

  const handleLinkClick = (e, item) => {
    if (onNavigate) {
      onNavigate(item.id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      
      {/* Top Editorial Banner Bar with THUDURI LIKITH GOUD */}
      <div className="bg-[#1C1917] text-[#FAF9F6] text-[10px] sm:text-[11px] font-mono py-1.5 px-4 text-center tracking-[0.25em] uppercase border-b border-stone-800 flex items-center justify-between">
        <div className="hidden sm:flex items-center space-x-2 text-stone-400">
          <span>PORTFOLIO DIARY</span>
          <span>•</span>
          <span>EST. 2026</span>
        </div>

        <div className="mx-auto flex items-center space-x-2">
          <span className="font-bold tracking-[0.3em] text-white">
            {settings?.fullName?.toUpperCase() || 'THUDURI LIKITH GOUD'}
          </span>
          <span className="text-stone-500">•</span>
          <span className="text-stone-300 hidden md:inline">
            {settings?.tagline?.toUpperCase() || 'INTO MY CAPTURES'}
          </span>
        </div>

        <div className="hidden sm:flex items-center space-x-3 text-stone-300">
          {isAdmin && (
            <span className="inline-flex items-center space-x-1 text-emerald-400 text-[10px] font-mono font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>ADMIN MODE</span>
            </span>
          )}
          <span className="text-stone-400">{settings?.location || 'HYDERABAD, INDIA'}</span>
        </div>
      </div>

      {/* Main Glass Navigation Bar */}
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? 'bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E7E5E4] py-3 shadow-sm'
            : 'bg-[#FAF9F6]/85 backdrop-blur-sm py-4 border-b border-[#E7E5E4]/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Prominent Brand Logo & Full Name */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                if (onNavigate) onNavigate('home');
              }}
              className="group flex flex-col"
            >
              <div className="flex items-center space-x-2">
                <span className="font-editorial text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#1C1917] group-hover:opacity-80 transition-opacity">
                  {settings?.fullName || 'THUDURI LIKITH GOUD'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#1C1917] opacity-60"></span>
              </div>
              <div className="flex items-center space-x-2 -mt-0.5">
                <span className="font-editorial italic text-xs sm:text-sm font-semibold text-stone-700">
                  {settings?.brandName || 'likith.'}
                </span>
                <span className="text-stone-300">•</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#78716C] font-mono group-hover:text-[#1C1917] transition-colors">
                  {settings?.tagline || 'into my captures'}
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-7 text-sm font-medium text-[#57534E]">
              {navLinks.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item)}
                  className={`transition-colors hover:text-[#1C1917] relative py-1 ${
                    activeSection === item.id ? 'text-[#1C1917] font-semibold' : ''
                  }`}
                >
                  {item.name}
                  {activeSection === item.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#1C1917] rounded-full"></span>
                  )}
                </a>
              ))}
            </nav>

            {/* Right Actions: Instagram CTA & Admin Button */}
            <div className="hidden md:flex items-center space-x-3.5">
              <a
                href={settings?.instagramUrl || `https://www.instagram.com/${settings?.instagramUsername || 'likith_thuduri'}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs font-medium px-3.5 py-1.5 rounded-full border border-[#D6D3D1] bg-white text-[#1C1917] hover:border-[#1C1917] hover:bg-[#1C1917] hover:text-[#FAF9F6] transition-all shadow-subtle group"
                title={`Visit @${settings?.instagramUsername || 'likith_thuduri'} on Instagram`}
              >
                <InstagramIcon size={13} className="text-[#E1306C] group-hover:text-white transition-colors" />
                <span>@{settings?.instagramUsername || 'likith_thuduri'}</span>
                <ArrowUpRight size={13} className="opacity-60 group-hover:opacity-100" />
              </a>

              <button
                onClick={onAdminClick}
                className={`p-2 rounded-full transition-colors ${
                  isAdmin
                    ? 'bg-stone-900 text-stone-100 hover:bg-stone-800 shadow-sm'
                    : 'text-[#78716C] hover:text-[#1C1917] hover:bg-stone-200/50'
                }`}
                title={isAdmin ? "Admin Studio (Active)" : "Admin Studio Login"}
              >
                {isAdmin ? <Settings size={15} /> : <Lock size={15} />}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                onClick={onAdminClick}
                className={`p-2 rounded-full ${
                  isAdmin ? 'bg-stone-900 text-stone-100' : 'text-[#78716C]'
                }`}
                title="Admin Studio"
              >
                {isAdmin ? <Settings size={16} /> : <Lock size={16} />}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#1C1917] rounded-md focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E7E5E4] bg-[#FAF9F6] px-5 py-6 space-y-4 shadow-lg animate-fadeIn">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item)}
                className="flex items-center space-x-3 text-base font-medium text-[#44403C] hover:text-[#1C1917] py-1.5"
              >
                <item.icon size={17} className="text-[#78716C]" />
                <span>{item.name}</span>
              </a>
            ))}
          </nav>

          <div className="pt-4 border-t border-[#E7E5E4] flex flex-col space-y-3">
            <a
              href={settings?.instagramUrl || `https://www.instagram.com/${settings?.instagramUsername || 'likith_thuduri'}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg bg-[#1C1917] text-[#FAF9F6] text-sm font-medium"
            >
              <span className="flex items-center space-x-2">
                <InstagramIcon size={16} className="text-[#E1306C]" />
                <span>Follow @{settings?.instagramUsername || 'likith_thuduri'}</span>
              </span>
              <ArrowUpRight size={16} />
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onAdminClick();
              }}
              className="w-full text-center py-2 text-xs font-mono text-[#78716C] hover:text-[#1C1917]"
            >
              {isAdmin ? "Open Admin Studio Dashboard" : "Admin Studio Login"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
