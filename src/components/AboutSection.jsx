import React from 'react';
import { Camera, MapPin, Mail, ExternalLink, Award, Sparkles, Sliders } from 'lucide-react';
import InstagramIcon from './InstagramIcon';

export default function AboutSection({ settings }) {
  return (
    <section id="about" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-stone-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-stone-200 pb-5">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#78716C] mb-2 block">
            03 / The Story Behind
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#1C1917] font-normal">
            About Likith
          </h2>
        </div>
        <p className="text-stone-500 text-sm max-w-md mt-2 md:mt-0 font-normal">
          Moments, places, people, and memories — collected one frame at a time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Visual Portrait & Social Connect */}
        <div className="lg:col-span-5 space-y-6">
          <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-stone-100 border border-stone-200/80 shadow-subtle">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=85"
              alt={settings?.fullName || 'Thuduri Likith Goud'}
              className="w-full h-full object-cover img-zoom"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-stone-900/80 backdrop-blur-md p-4 rounded text-white text-xs font-mono">
              <div className="flex justify-between items-center">
                <span>{settings?.fullName || 'Thuduri Likith Goud'}</span>
                <span className="text-stone-400">{settings?.location || 'Hyderabad, India'}</span>
              </div>
            </div>
          </div>

          {/* Social Badges */}
          <div className="bg-white p-5 rounded-sm border border-stone-200/80 shadow-subtle space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-stone-400 block">
              Direct Channels
            </span>
            <div className="flex flex-col space-y-2 text-sm">
              <a
                href={settings?.instagramUrl || 'https://www.instagram.com/likith_thuduri/'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded hover:bg-stone-50 text-stone-700 hover:text-stone-900 transition-colors"
              >
                <span className="flex items-center space-x-2">
                  <InstagramIcon size={15} className="text-[#E1306C]" />
                  <span>Instagram</span>
                </span>
                <span className="font-mono text-xs text-stone-400">@{settings?.instagramUsername || 'likith_thuduri'} ↗</span>
              </a>

              <a
                href={`mailto:${settings?.email || 'contact@likithgoud.com'}`}
                className="flex items-center justify-between p-2 rounded hover:bg-stone-50 text-stone-700 hover:text-stone-900 transition-colors"
              >
                <span className="flex items-center space-x-2">
                  <Mail size={15} className="text-stone-600" />
                  <span>Email Inquiries</span>
                </span>
                <span className="font-mono text-xs text-stone-400">{settings?.email || 'contact@likithgoud.com'}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Bio Narrative */}
        <div className="lg:col-span-7 space-y-8">
          
          <div className="space-y-4">
            <h3 className="font-editorial text-2xl sm:text-3xl text-stone-900 font-normal leading-tight">
              {settings?.bioHeading || 'Collecting moments, places, and memories.'}
            </h3>

            <div className="text-stone-600 space-y-4 text-base font-light leading-relaxed whitespace-pre-line">
              {settings?.aboutBio || `Hey, I'm Likith. Based in Hyderabad, India, documenting honest moments across streets, quiet corners, faces, and natural landscapes. What started as an impulse to freeze fleeting seconds has grown into an ongoing visual diary of life as it unfolds.

Every capture here is personal — moments, places, and people collected along the way.`}
            </div>
          </div>

          {/* Quick Highlight Card */}
          <div className="bg-white p-6 rounded-sm border border-stone-200/80 shadow-subtle space-y-4">
            <div className="flex items-center space-x-2 text-stone-900 font-editorial text-lg">
              <Camera size={16} />
              <span>A Personal Visual Archive</span>
            </div>
            <p className="text-xs text-stone-500 font-mono leading-relaxed">
              Curated directly for followers, friends, and anyone dropping in from my Instagram bio. Feel free to browse through the albums or inspect individual frames.
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}
