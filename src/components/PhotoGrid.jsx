import React from 'react';
import { Heart, Edit2, Trash2 } from 'lucide-react';

export default function PhotoGrid({
  photos = [],
  onPhotoClick,
  onLikePhoto,
  likedPhotoIds = new Set(),
  isAdmin,
  onEditPhoto,
  onDeletePhoto
}) {
  if (!photos || photos.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-stone-400 text-xs sm:text-sm font-light">No photographs to display yet.</p>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-20">
      {/* 2 columns on mobile, 3 columns on desktop */}
      <div className="columns-2 md:columns-3 gap-3 sm:gap-4 md:gap-6 [column-fill:_balance]">
        {photos.map((photo) => {
          const isLiked = likedPhotoIds.has(photo.id);

          return (
            <div
              key={photo.id}
              onClick={() => onPhotoClick(photo)}
              className="group relative cursor-pointer break-inside-avoid mb-3 sm:mb-4 md:mb-6 overflow-hidden bg-stone-100 transition-opacity duration-200"
            >
              {/* Natural Proportion Photograph */}
              <img
                src={photo.thumbnailUrl || photo.imageUrl}
                alt={photo.title || 'Photograph by Likith'}
                loading="lazy"
                decoding="async"
                className="w-full h-auto block select-none group-hover:opacity-90 transition-opacity duration-300"
              />

              {/* Admin Direct Quick Actions */}
              {isAdmin && (
                <div
                  className="absolute top-2 left-2 z-20 flex items-center space-x-1 bg-stone-900/80 backdrop-blur-sm px-1.5 py-1 rounded text-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onEditPhoto && onEditPhoto(photo)}
                    className="p-1 text-stone-300 hover:text-white transition-colors"
                    title="Edit Photo"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => onDeletePhoto && onDeletePhoto(photo.id, photo.title)}
                    className="p-1 text-rose-300 hover:text-rose-100 transition-colors"
                    title="Delete Photo"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              )}

              {/* Subtle Quiet Hover Overlay (VSCO Style) */}
              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-2.5 sm:p-3.5 text-white pointer-events-none">
                
                {/* Top: Like button (pointer-events-auto) */}
                <div className="flex justify-end pointer-events-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onLikePhoto) onLikePhoto(photo.id);
                    }}
                    className={`p-1.5 rounded-full transition-colors ${
                      isLiked
                        ? 'text-rose-400'
                        : 'text-white/80 hover:text-white'
                    }`}
                    title="Like"
                  >
                    <Heart size={14} className={isLiked ? 'fill-current' : ''} />
                  </button>
                </div>

                {/* Bottom: Minimal Title / Location */}
                {(photo.title || photo.location) && (
                  <div className="text-[11px] sm:text-xs font-light text-stone-100/90 truncate">
                    {photo.title && <span className="font-normal block truncate">{photo.title}</span>}
                    {photo.location && <span className="text-white/70 text-[10px] block truncate">{photo.location}</span>}
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
