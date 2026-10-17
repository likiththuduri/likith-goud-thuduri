import React from 'react';
import { ArrowLeft, MapPin, Calendar, Layers, Heart, Maximize2 } from 'lucide-react';

export default function AlbumDetail({ album, photos, onBack, onPhotoClick, onLikePhoto }) {
  if (!album) return null;

  const albumPhotos = photos.filter(p => p.albumId === album.id || p.albumId === album.slug);

  return (
    <div className="pt-36 sm:pt-44 pb-24 min-h-screen animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-mono tracking-wider uppercase text-stone-500 hover:text-stone-900 transition-colors mb-8 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to all collections</span>
        </button>

        {/* Album Header Banner */}
        <div className="relative rounded-sm overflow-hidden bg-stone-900 text-stone-100 mb-14 shadow-lift">
          <div className="absolute inset-0 z-0 opacity-40">
            <img
              src={album.coverImage}
              alt={album.title}
              className="w-full h-full object-cover filter blur-sm scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30"></div>
          </div>

          <div className="relative z-10 p-6 sm:p-12 md:p-16 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-stone-300 uppercase tracking-wider mb-4">
              <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded">
                {album.category || 'Collection'}
              </span>
              {album.location && (
                <span className="flex items-center">
                  <MapPin size={12} className="mr-1 text-stone-300" />
                  {album.location}
                </span>
              )}
              {album.year && (
                <span className="flex items-center">
                  <Calendar size={12} className="mr-1 text-stone-300" />
                  {album.year}
                </span>
              )}
              <span className="flex items-center">
                <Layers size={12} className="mr-1 text-stone-300" />
                {albumPhotos.length} frames
              </span>
            </div>

            <h1 className="font-editorial text-3xl sm:text-5xl md:text-6xl font-normal text-white mb-6 leading-tight">
              {album.title}
            </h1>

            <p className="text-stone-200 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
              {album.description}
            </p>
          </div>
        </div>

        {/* Album Photos Stream */}
        {albumPhotos.length === 0 ? (
          <div className="text-center py-20 bg-stone-100/50 rounded-sm border border-stone-200/60">
            <p className="text-stone-500 font-mono text-sm">No photographs added to this album yet.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {albumPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => onPhotoClick(photo)}
                className="group relative cursor-pointer break-inside-avoid overflow-hidden rounded-sm bg-stone-100 shadow-subtle border border-stone-200/70"
              >
                <img
                  src={photo.thumbnailUrl || photo.imageUrl}
                  alt={photo.title}
                  loading="lazy"
                  className="w-full h-auto object-cover img-zoom"
                />

                {/* Hover overlay with photo details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 sm:p-5 text-white">
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-mono tracking-wider uppercase bg-black/40 backdrop-blur-md px-2 py-0.5 rounded">
                      {photo.camera || '35mm'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLikePhoto(photo.id);
                      }}
                      className="flex items-center space-x-1 text-xs bg-black/40 backdrop-blur-md px-2.5 py-1 rounded hover:bg-rose-600/80 transition-colors"
                      title="Like photograph"
                    >
                      <Heart size={12} className="fill-current text-rose-400" />
                      <span>{photo.likes || 0}</span>
                    </button>
                  </div>

                  <div>
                    <h3 className="font-editorial text-lg text-white font-normal mb-1">
                      {photo.title}
                    </h3>
                    <p className="text-stone-300 text-xs line-clamp-2 mb-2 font-light">
                      {photo.caption}
                    </p>
                    <div className="flex items-center justify-between text-[11px] font-mono text-stone-300 pt-2 border-t border-white/20">
                      <span>{photo.location}</span>
                      <span className="flex items-center opacity-80">
                        <Maximize2 size={12} className="mr-1" />
                        Inspect Frame
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
