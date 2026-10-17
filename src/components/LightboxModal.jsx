import React, { useEffect, useState } from 'react';
import {
  X, ChevronLeft, ChevronRight, Heart, Share2, Download,
  MapPin, Calendar, Camera, Aperture, Clock, Zap, Info, Check, Sparkles, Edit2, Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LightboxModal({
  photo,
  photos,
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
  const [showInfo, setShowInfo] = useState(true);

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

  const handleShare = () => {
    const url = window.location.href.split('#')[0] + `?photo=${photo.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const triggerLike = () => {
    onLike(photo.id);
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/95 backdrop-blur-xl animate-fadeIn select-none">
      
      {/* Top Floating Action Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 sm:p-6 text-stone-200">
        <div className="flex items-center space-x-3">
          <span className="font-mono text-xs uppercase tracking-wider text-stone-400">
            {photos.findIndex(p => p.id === photo.id) + 1} of {photos.length}
          </span>
          <span className="text-stone-600">•</span>
          <span className="text-xs font-mono text-stone-300 hidden sm:inline">
            {photo.category || 'Capture'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Admin Edit & Delete Actions */}
          {isAdmin && (
            <div className="flex items-center space-x-1 mr-2 bg-stone-900 border border-stone-700 rounded-full px-2 py-0.5">
              <button
                onClick={() => {
                  onClose();
                  onEditPhoto && onEditPhoto(photo);
                }}
                className="p-1.5 text-stone-300 hover:text-white rounded-full flex items-center space-x-1 text-xs font-mono"
                title="Edit Frame Metadata & EXIF"
              >
                <Edit2 size={13} />
                <span>Edit Frame</span>
              </button>
              <span className="text-stone-700">•</span>
              <button
                onClick={() => {
                  if (onDeletePhoto) {
                    onDeletePhoto(photo.id, photo.title);
                    onClose();
                  }
                }}
                className="p-1.5 text-rose-400 hover:text-rose-200 rounded-full flex items-center space-x-1 text-xs font-mono"
                title="Delete Frame"
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </button>
            </div>
          )}

          {/* Toggle Metadata Panel */}
          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`p-2 rounded-full transition-colors ${
              showInfo ? 'bg-stone-800 text-white' : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
            }`}
            title="Toggle Photography Details"
          >
            <Info size={18} />
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800/60 rounded-full transition-colors relative"
            title="Copy Direct Link"
          >
            {copied ? <Check size={18} className="text-emerald-400" /> : <Share2 size={18} />}
            {copied && (
              <span className="absolute -bottom-8 right-0 text-[11px] font-mono bg-stone-800 text-emerald-300 px-2 py-0.5 rounded shadow whitespace-nowrap">
                Link copied!
              </span>
            )}
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-full transition-colors ml-2"
            title="Close (Esc)"
          >
            <X size={22} />
          </button>
        </div>
      </div>

      {/* Main Body: Image Stage + Details Inspector */}
      <div className="w-full h-full flex flex-col md:flex-row pt-16 pb-6 px-4 sm:px-6">
        
        {/* Left / Center Image Stage */}
        <div className="relative flex-1 flex items-center justify-center min-h-0 overflow-hidden">
          
          {/* Prev Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-black/40 text-stone-300 hover:text-white hover:bg-black/80 backdrop-blur-md transition-all shadow-lg"
            title="Previous Frame (Left Arrow)"
          >
            <ChevronLeft size={24} />
          </button>

          {/* The Photograph */}
          <img
            src={photo.imageUrl}
            alt={photo.title}
            className="max-h-[82vh] max-w-full object-contain rounded-sm shadow-2xl transition-all duration-300"
          />

          {/* Next Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-black/40 text-stone-300 hover:text-white hover:bg-black/80 backdrop-blur-md transition-all shadow-lg"
            title="Next Frame (Right Arrow)"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Right Details Panel (collapsible) */}
        {showInfo && (
          <div className="w-full md:w-96 md:min-w-[340px] max-h-[82vh] overflow-y-auto bg-stone-900/90 border border-stone-800 rounded-sm p-6 text-stone-300 flex flex-col justify-between mt-4 md:mt-0 md:ml-6 shadow-2xl animate-fadeIn">
            
            {/* Upper Content */}
            <div className="space-y-6">
              
              {/* Title & Category */}
              <div>
                <div className="flex items-center space-x-2 text-xs font-mono text-stone-400 uppercase tracking-wider mb-2">
                  <span>{photo.category}</span>
                  {photo.filmSimulation && (
                    <>
                      <span>•</span>
                      <span className="text-amber-400/90">{photo.filmSimulation}</span>
                    </>
                  )}
                </div>
                <h2 className="font-editorial text-2xl sm:text-3xl text-white font-normal leading-tight">
                  {photo.title}
                </h2>
              </div>

              {/* Story / Caption */}
              {photo.caption && (
                <div className="border-l-2 border-stone-700 pl-4 py-1">
                  <p className="text-stone-300 text-sm leading-relaxed font-light italic">
                    "{photo.caption}"
                  </p>
                </div>
              )}

              {/* Date & Location */}
              <div className="space-y-2 text-xs font-mono text-stone-400">
                {photo.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin size={13} className="text-rose-400" />
                    <span>{photo.location}</span>
                  </div>
                )}
                {photo.captureDate && (
                  <div className="flex items-center space-x-2">
                    <Calendar size={13} className="text-stone-400" />
                    <span>Captured on {photo.captureDate}</span>
                  </div>
                )}
              </div>

              {/* EXIF Photography Metadata Card */}
              <div className="bg-stone-950/70 border border-stone-800/80 rounded p-4 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2 text-stone-400 uppercase tracking-wider text-[11px]">
                  <span className="flex items-center space-x-1.5">
                    <Camera size={13} />
                    <span>Camera Gear Specs</span>
                  </span>
                  <span>EXIF</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-stone-300 pt-1">
                  <div>
                    <span className="text-[10px] text-stone-500 block uppercase">Camera</span>
                    <span className="text-stone-200">{photo.camera || 'Sony A7 IV'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block uppercase">Lens</span>
                    <span className="text-stone-200">{photo.lens || '35mm Prime'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block uppercase">Aperture</span>
                    <span className="text-stone-200">{photo.aperture || 'ƒ/1.4'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block uppercase">Shutter</span>
                    <span className="text-stone-200">{photo.shutterSpeed || '1/250s'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block uppercase">ISO</span>
                    <span className="text-stone-200">{photo.iso || '100'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block uppercase">Focal Length</span>
                    <span className="text-stone-200">{photo.focalLength || '35mm'}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Actions: Like, Admin Edit/Delete & Direct Download */}
            <div className="pt-6 border-t border-stone-800 mt-6 flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={triggerLike}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-full font-medium text-xs transition-all ${
                    isLiked
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                      : 'bg-stone-800 text-stone-200 hover:bg-rose-600 hover:text-white'
                  }`}
                >
                  <Heart size={14} className={isLiked ? 'fill-current' : ''} />
                  <span>{photo.likes || 0} Likes</span>
                </button>

                <a
                  href={photo.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="flex items-center space-x-1.5 text-xs text-stone-400 hover:text-white font-mono transition-colors"
                  title="View High Resolution Source"
                >
                  <Download size={14} />
                  <span>Original</span>
                </a>
              </div>

              {isAdmin && (
                <div className="pt-2 border-t border-stone-800 flex justify-between items-center text-xs font-mono">
                  <span className="text-emerald-400 text-[11px]">Admin Tools:</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        onClose();
                        onEditPhoto && onEditPhoto(photo);
                      }}
                      className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded flex items-center space-x-1"
                    >
                      <Edit2 size={11} />
                      <span>Edit Info</span>
                    </button>
                    <button
                      onClick={() => {
                        if (onDeletePhoto) {
                          onDeletePhoto(photo.id, photo.title);
                          onClose();
                        }
                      }}
                      className="px-3 py-1 bg-rose-900/60 hover:bg-rose-900 text-rose-200 rounded flex items-center space-x-1"
                    >
                      <Trash2 size={11} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
