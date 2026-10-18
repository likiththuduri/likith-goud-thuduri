import React, { useEffect, useState } from 'react';
import {
  X, ChevronLeft, ChevronRight, Heart, Share2,
  MapPin, Calendar, Check, Edit2, Trash2, Info
} from 'lucide-react';

export default function LightboxModal({
  photo,
  photos = [],
  isOpen,
  onClose,
  onNext,
  onPrev,
  onLike,
  isLiked,
  isAdmin,
  onEditPhoto,
  onDeletePhoto
}) {
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onNext, onPrev, onClose]);

  if (!isOpen || !photo) return null;

  const currentIndex = photos.findIndex(p => p.id === photo.id);
  const hasMultiple = photos.length > 1;

  const handleShare = (e) => {
    e.stopPropagation();
    const url = window.location.href.split('#')[0] + `?photo=${photo.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasMeta = Boolean(photo.caption || photo.location || photo.captureDate);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 text-stone-100 select-none animate-fadeIn cursor-zoom-out p-3 sm:p-6"
    >
      {/* Top Bar: Counter & Controls */}
      <div
        className="w-full flex items-center justify-between text-xs text-stone-400 z-20 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-mono text-[11px] sm:text-xs tracking-wider text-stone-400">
          {currentIndex !== -1 ? `${currentIndex + 1} / ${photos.length}` : ''}
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Admin Edit/Delete */}
          {isAdmin && (
            <div className="flex items-center space-x-2 bg-stone-900/90 border border-stone-800 rounded px-2 py-1">
              <button
                onClick={() => {
                  onClose();
                  if (onEditPhoto) onEditPhoto(photo);
                }}
                className="text-stone-300 hover:text-white flex items-center space-x-1 text-[11px]"
                title="Edit Photo"
              >
                <Edit2 size={11} />
                <span>edit</span>
              </button>
              <span className="text-stone-700">|</span>
              <button
                onClick={() => {
                  if (onDeletePhoto) {
                    onDeletePhoto(photo.id, photo.title);
                    onClose();
                  }
                }}
                className="text-rose-400 hover:text-rose-300 flex items-center space-x-1 text-[11px]"
                title="Delete Photo"
              >
                <Trash2 size={11} />
                <span>del</span>
              </button>
            </div>
          )}

          {/* Toggle Details (if meta exists) */}
          {hasMeta && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={`p-1.5 rounded transition-colors ${
                showDetails ? 'text-white bg-stone-800' : 'text-stone-400 hover:text-white'
              }`}
              title="Toggle Details"
            >
              <Info size={15} />
            </button>
          )}

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-1.5 text-stone-400 hover:text-white transition-colors relative"
            title="Copy photo link"
          >
            {copied ? <Check size={15} className="text-emerald-400" /> : <Share2 size={15} />}
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white transition-colors"
            title="Close viewer (Esc)"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div
        className="relative flex-1 flex items-center justify-center my-auto min-h-0 overflow-hidden cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Previous Button */}
        {hasMultiple && (
          <button
            onClick={onPrev}
            className="absolute left-1 sm:left-4 z-10 p-2 sm:p-3 rounded-full text-stone-400 hover:text-white hover:bg-stone-900/60 transition-all"
            title="Previous (Left Arrow)"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {/* Full Photograph */}
        <img
          src={photo.imageUrl}
          alt={photo.title || 'Photograph'}
          className="max-h-[82vh] max-w-[92vw] sm:max-w-[85vw] object-contain block mx-auto shadow-2xl transition-all duration-300"
        />

        {/* Next Button */}
        {hasMultiple && (
          <button
            onClick={onNext}
            className="absolute right-1 sm:right-4 z-10 p-2 sm:p-3 rounded-full text-stone-400 hover:text-white hover:bg-stone-900/60 transition-all"
            title="Next (Right Arrow)"
          >
            <ChevronRight size={28} />
          </button>
        )}
      </div>

      {/* Bottom Bar: Caption, Details & Like */}
      <div
        className="w-full max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 pt-2 sm:pt-4 z-20 cursor-default gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center sm:text-left truncate max-w-xl">
          {photo.title && (
            <span className="text-stone-200 font-normal mr-2">
              {photo.title}
            </span>
          )}
          {photo.caption && (
            <span className="text-stone-400 font-light italic mr-2">
              "{photo.caption}"
            </span>
          )}
          {photo.location && (
            <span className="inline-flex items-center text-stone-400 text-[11px] mr-2">
              <MapPin size={10} className="mr-0.5 opacity-70" />
              {photo.location}
            </span>
          )}
          {photo.captureDate && (
            <span className="text-stone-500 text-[11px]">
              {photo.captureDate}
            </span>
          )}
        </div>

        {/* Like Button */}
        <button
          onClick={() => onLike && onLike(photo.id)}
          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded transition-colors text-xs ${
            isLiked
              ? 'text-rose-400'
              : 'text-stone-400 hover:text-stone-200'
          }`}
          title="Like photograph"
        >
          <Heart size={13} className={isLiked ? 'fill-current' : ''} />
          <span>{photo.likes || 0}</span>
        </button>
      </div>

    </div>
  );
}
