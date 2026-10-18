import React from 'react';
import { ArrowUpRight, Lock } from 'lucide-react';

export default function Footer({ settings, onAdminClick }) {
  return (
    <footer className="border-t border-stone-200/60 bg-[#FAF9F6] py-10 text-xs text-stone-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Minimal Copyright */}
        <p className="font-light tracking-wide text-stone-600">
          © 2026 likith.
        </p>

        {/* Subtle Instagram link & Discreet Admin */}
        <div className="flex items-center space-x-6">
          <a
            href={settings?.instagramUrl || `https://www.instagram.com/${settings?.instagramUsername || 'likith_thuduri'}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-stone-900 transition-colors inline-flex items-center space-x-0.5 tracking-wide"
          >
            <span>instagram</span>
            <ArrowUpRight size={11} className="opacity-60" />
          </a>

          <button
            onClick={onAdminClick}
            className="text-stone-400 hover:text-stone-700 transition-colors p-1"
            title="Admin"
          >
            <Lock size={11} className="opacity-40 hover:opacity-100" />
          </button>
        </div>

      </div>
    </footer>
  );
}
