import React from 'react';
import { ArrowLeft } from 'lucide-react';
import PhotoGrid from './PhotoGrid';

export default function AlbumDetail({
  album,
  photos = [],
  onBack,
  onPhotoClick,
  onLikePhoto,
  likedPhotoIds,
  isAdmin,
  onEditPhoto,
  onDeletePhoto
}) {
  if (!album) return null;

  const albumPhotos = photos.filter(
    (p) => p.albumId === album.id || p.albumId === album.slug
  );

  return (
    <div className="pt-24 sm:pt-32 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1 text-xs text-stone-500 hover:text-stone-900 transition-colors mb-8"
        >
          <ArrowLeft size={13} />
          <span>all frames</span>
        </button>

        {/* Minimal Album Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="font-editorial text-2xl sm:text-3xl text-[#1C1917] font-normal tracking-tight mb-2">
            {album.title}
          </h1>
          {album.description && (
            <p className="text-stone-500 text-xs sm:text-sm font-light leading-relaxed">
              {album.description}
            </p>
          )}
          <span className="text-[11px] text-stone-400 font-mono mt-2 block">
            {albumPhotos.length} {albumPhotos.length === 1 ? 'frame' : 'frames'}
          </span>
        </div>

        {/* Album Photos */}
        <PhotoGrid
          photos={albumPhotos}
          onPhotoClick={onPhotoClick}
          onLikePhoto={onLikePhoto}
          likedPhotoIds={likedPhotoIds}
          isAdmin={isAdmin}
          onEditPhoto={onEditPhoto}
          onDeletePhoto={onDeletePhoto}
        />

      </div>
    </div>
  );
}
