import React from 'react';
import { Layers, MapPin, Calendar, ArrowRight, Edit2, Trash2 } from 'lucide-react';

export default function AlbumGrid({ albums, onSelectAlbum, isAdmin, onEditAlbum, onDeleteAlbum }) {
  if (!albums || albums.length === 0) return null;

  return (
    <section id="albums" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Editorial Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-stone-200 pb-5">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#78716C] mb-2 block">
            01 / Curated Collections
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#1C1917] font-normal">
            Thematic Albums
          </h2>
        </div>
        <p className="text-stone-500 text-sm max-w-md mt-2 md:mt-0 font-normal">
          Each album represents a continuous photographic narrative shot over seasons, travels, and intentional study of light.
        </p>
      </div>

      {/* Album Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {albums.map((album) => (
          <div
            key={album.id}
            onClick={() => onSelectAlbum(album)}
            className="group cursor-pointer flex flex-col transition-all duration-300 relative"
          >
            {/* Album Cover Container */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-stone-100 mb-4 shadow-subtle border border-stone-200/60">
              <img
                src={album.coverImage}
                alt={album.title}
                loading="lazy"
                className="w-full h-full object-cover img-zoom"
              />
              <div className="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Top Category Badge */}
              <div className="absolute top-3.5 left-3.5">
                <span className="px-2.5 py-1 text-[11px] font-mono tracking-wider uppercase bg-white/90 backdrop-blur-md text-stone-900 rounded shadow-sm">
                  {album.category || 'Collection'}
                </span>
              </div>

              {/* Photo Count Badge */}
              <div className="absolute bottom-3.5 right-3.5">
                <span className="px-2.5 py-1 text-[11px] font-mono text-white bg-black/60 backdrop-blur-md rounded flex items-center space-x-1">
                  <Layers size={11} />
                  <span>{album.photoCount || 0} frames</span>
                </span>
              </div>

              {/* Admin Direct Action Buttons (Edit / Delete) */}
              {isAdmin && (
                <div
                  className="absolute top-3.5 right-3.5 flex items-center space-x-1 z-20 bg-stone-950/80 backdrop-blur-md p-1 rounded border border-white/20 shadow-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onEditAlbum && onEditAlbum(album)}
                    className="p-1.5 text-stone-300 hover:text-white hover:bg-white/20 rounded transition-colors"
                    title="Edit Album"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => onDeleteAlbum && onDeleteAlbum(album.id, album.title)}
                    className="p-1.5 text-rose-300 hover:text-rose-100 hover:bg-rose-500/30 rounded transition-colors"
                    title="Delete Album"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              )}
            </div>

            {/* Album Meta */}
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center space-x-3 text-xs text-stone-400 font-mono">
                {album.location && (
                  <span className="flex items-center">
                    <MapPin size={11} className="mr-1 text-stone-500" />
                    {album.location}
                  </span>
                )}
                {album.year && (
                  <span className="flex items-center">
                    <Calendar size={11} className="mr-1 text-stone-500" />
                    {album.year}
                  </span>
                )}
              </div>

              <h3 className="font-editorial text-xl sm:text-2xl text-stone-900 group-hover:text-stone-600 transition-colors">
                {album.title}
              </h3>

              <p className="text-stone-500 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                {album.description}
              </p>

              <div className="pt-2 flex items-center justify-between text-xs font-medium text-stone-900">
                <span className="group-hover:translate-x-1 transition-transform flex items-center">
                  <span>Open Album</span>
                  <ArrowRight size={13} className="ml-1 opacity-70" />
                </span>

                {isAdmin && (
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Admin Active
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
