import React from 'react';

export default function Hero({ albums = [], selectedAlbumId = 'all', onSelectAlbum }) {
  return (
    <section className="pt-28 sm:pt-36 pb-8 sm:pb-12 max-w-4xl mx-auto px-4 sm:px-6 text-center">
      
      {/* Understated Tagline */}
      <h1 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-normal text-[#1C1917] tracking-tight leading-relaxed max-w-2xl mx-auto">
        “A life of my own, in little frames.”
      </h1>

      {/* Optional Minimal Filter Tabs (only if albums exist) */}
      {albums && albums.length > 0 && onSelectAlbum && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs sm:text-sm text-stone-400 font-normal">
          <button
            onClick={() => onSelectAlbum(null)}
            className={`transition-colors lowercase ${
              !selectedAlbumId || selectedAlbumId === 'all'
                ? 'text-[#1C1917] font-medium underline underline-offset-4'
                : 'hover:text-stone-700'
            }`}
          >
            all
          </button>
          {albums.map((album) => {
            const isSelected = selectedAlbumId === album.id || selectedAlbumId === album.slug;
            return (
              <React.Fragment key={album.id}>
                <span className="text-stone-300 select-none">/</span>
                <button
                  onClick={() => onSelectAlbum(album)}
                  className={`transition-colors lowercase ${
                    isSelected
                      ? 'text-[#1C1917] font-medium underline underline-offset-4'
                      : 'hover:text-stone-700'
                  }`}
                >
                  {album.title.toLowerCase()}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      )}

    </section>
  );
}
