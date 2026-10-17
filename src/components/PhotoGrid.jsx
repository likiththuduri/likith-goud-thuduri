import React from 'react';
import { Heart, Maximize2, Camera, MapPin, Sparkles, Edit2, Trash2 } from 'lucide-react';

export default function PhotoGrid({
  photos,
  selectedCategory,
  onPhotoClick,
  onLikePhoto,
  likedPhotoIds = new Set(),
  isAdmin,
  onEditPhoto,
  onDeletePhoto
}) {
  return (
    <section id="gallery" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Editorial Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-stone-200 pb-5">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#78716C] mb-2 block">
            02 / Visual Stream
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#1C1917] font-normal">
            Selected Captures
          </h2>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-stone-500 mt-2 md:mt-0">
          <span>{photos.length} Captures</span>
        </div>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-24 bg-stone-100/60 rounded-sm border border-stone-200/80">
          <Camera size={32} className="mx-auto text-stone-400 mb-3" />
          <h3 className="font-editorial text-xl text-stone-800 mb-1">No photographs found</h3>
          <p className="text-stone-500 text-xs font-mono">Try adjusting your search query or selecting a different category.</p>
        </div>
      ) : (
        /* Masonry Multi-column stream */
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {photos.map((photo) => {
            const isLiked = likedPhotoIds.has(photo.id);

            return (
              <div
                key={photo.id}
                onClick={() => onPhotoClick(photo)}
                className="group relative cursor-pointer break-inside-avoid overflow-hidden rounded-sm bg-stone-100 shadow-subtle border border-stone-200/60 transition-all duration-300 hover:shadow-photo"
              >
                {/* Photo Image */}
                <img
                  src={photo.thumbnailUrl || photo.imageUrl}
                  alt={photo.title}
                  loading="lazy"
                  className="w-full h-auto object-cover img-zoom"
                />

                {/* Admin Direct Actions Top Bar */}
                {isAdmin && (
                  <div
                    className="absolute top-3 left-3 z-30 flex items-center space-x-1.5 bg-stone-950/85 backdrop-blur-md p-1 rounded border border-white/20 shadow-md"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => onEditPhoto && onEditPhoto(photo)}
                      className="p-1.5 text-stone-300 hover:text-white hover:bg-white/20 rounded transition-colors text-xs flex items-center space-x-1"
                      title="Edit Photo & Specs"
                    >
                      <Edit2 size={12} />
                      <span className="font-mono text-[10px]">Edit</span>
                    </button>
                    <button
                      onClick={() => onDeletePhoto && onDeletePhoto(photo.id, photo.title)}
                      className="p-1.5 text-rose-300 hover:text-rose-100 hover:bg-rose-500/30 rounded transition-colors text-xs flex items-center space-x-1"
                      title="Delete Photo"
                    >
                      <Trash2 size={12} />
                      <span className="font-mono text-[10px]">Del</span>
                    </button>
                  </div>
                )}

                {/* Always-visible subtle bottom info on mobile; hover overlay on desktop */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 sm:p-5 text-white">
                  
                  {/* Top Bar: Category badge & Like Button */}
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-mono tracking-wider uppercase bg-black/40 backdrop-blur-md px-2.5 py-1 rounded text-stone-200 border border-white/10">
                      {photo.category || 'Capture'}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLikePhoto(photo.id);
                      }}
                      className={`flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-full backdrop-blur-md transition-all ${
                        isLiked
                          ? 'bg-rose-500 text-white shadow-sm'
                          : 'bg-black/50 text-stone-200 hover:bg-rose-600/80 hover:text-white'
                      }`}
                      title="Like photograph"
                    >
                      <Heart size={12} className={isLiked ? 'fill-current' : ''} />
                      <span className="font-mono">{photo.likes || 0}</span>
                    </button>
                  </div>

                  {/* Bottom Meta & Caption */}
                  <div>
                    {photo.location && (
                      <div className="flex items-center text-[11px] font-mono text-stone-300 mb-1">
                        <MapPin size={11} className="mr-1 text-stone-400" />
                        <span>{photo.location}</span>
                      </div>
                    )}

                    <h3 className="font-editorial text-lg sm:text-xl text-white font-normal mb-1">
                      {photo.title}
                    </h3>

                    {photo.caption && (
                      <p className="text-stone-300 text-xs line-clamp-2 mb-3 font-light leading-relaxed">
                        {photo.caption}
                      </p>
                    )}

                    {/* Details bar */}
                    <div className="flex items-center justify-between text-[11px] font-mono text-stone-300 pt-2 border-t border-white/20">
                      <span>{photo.location || photo.captureDate || 'Capture'}</span>
                      <span className="flex items-center text-white/90">
                        <Maximize2 size={12} className="mr-1" />
                        View Full Frame
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
