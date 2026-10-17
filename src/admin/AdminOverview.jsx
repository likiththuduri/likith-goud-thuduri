import React from 'react';
import { Camera, Layers, Heart, Mail, Plus, ArrowUpRight, Sliders, ExternalLink } from 'lucide-react';

export default function AdminOverview({ stats, onNavigate, photos, albums, inquiries }) {
  const statCards = [
    { title: 'Total Frames', value: photos?.length || 0, icon: Camera, color: 'text-stone-900', target: 'photos' },
    { title: 'Curated Albums', value: albums?.length || 0, icon: Layers, color: 'text-stone-900', target: 'albums' },
    { title: 'Public Likes', value: stats?.totalLikes || 0, icon: Heart, color: 'text-rose-500', target: 'photos' },
    { title: 'Direct Inquiries', value: inquiries?.length || 0, icon: Mail, color: 'text-blue-600', target: 'branding' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h2 className="font-editorial text-2xl sm:text-3xl text-stone-900 font-normal">
            Studio Dashboard Overview
          </h2>
          <p className="text-stone-500 text-xs font-mono mt-1">
            Real-time analytics and management controls for your visual captures portfolio.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('photos')}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded bg-stone-900 text-stone-100 hover:bg-stone-800 text-xs font-mono uppercase tracking-wider transition-all shadow-subtle"
          >
            <Plus size={14} />
            <span>Upload Photos</span>
          </button>

          <button
            onClick={() => onNavigate('albums')}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded border border-stone-300 hover:border-stone-900 bg-white text-stone-800 text-xs font-mono uppercase tracking-wider transition-all"
          >
            <Plus size={14} />
            <span>New Album</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => onNavigate(card.target)}
            className="bg-white p-5 rounded-sm border border-stone-200/90 shadow-subtle cursor-pointer hover:border-stone-400 transition-all group"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-stone-400 text-xs font-mono uppercase tracking-wider">{card.title}</span>
              <card.icon size={16} className={`${card.color} group-hover:scale-110 transition-transform`} />
            </div>
            <div className="font-editorial text-3xl font-semibold text-stone-900">
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout: Recent Captures + Albums Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Captures */}
        <div className="lg:col-span-7 bg-white p-6 rounded-sm border border-stone-200/90 shadow-subtle space-y-4">
          <div className="flex justify-between items-center border-b border-stone-100 pb-3">
            <h3 className="font-editorial text-lg text-stone-900 font-normal">Recent Uploads</h3>
            <button
              onClick={() => onNavigate('photos')}
              className="text-xs font-mono text-stone-500 hover:text-stone-900 flex items-center space-x-1"
            >
              <span>Manage all ({photos?.length})</span>
              <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {(photos || []).slice(0, 12).map((photo) => (
              <div key={photo.id} className="relative aspect-square rounded overflow-hidden bg-stone-100 group border border-stone-200/60">
                <img
                  src={photo.thumbnailUrl || photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover img-zoom"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1 text-center">
                  <span className="text-[10px] text-white font-mono line-clamp-2">{photo.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Curated Albums Overview */}
        <div className="lg:col-span-5 bg-white p-6 rounded-sm border border-stone-200/90 shadow-subtle space-y-4">
          <div className="flex justify-between items-center border-b border-stone-100 pb-3">
            <h3 className="font-editorial text-lg text-stone-900 font-normal">Active Albums</h3>
            <button
              onClick={() => onNavigate('albums')}
              className="text-xs font-mono text-stone-500 hover:text-stone-900 flex items-center space-x-1"
            >
              <span>Manage ({albums?.length})</span>
              <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="space-y-3">
            {(albums || []).slice(0, 4).map((album) => {
              const albumCount = photos?.filter(p => p.albumId === album.id || p.albumId === album.slug).length || album.photoCount || 0;
              return (
                <div
                  key={album.id}
                  onClick={() => onNavigate('albums')}
                  className="p-3 bg-stone-50 hover:bg-stone-100 rounded border border-stone-100 text-xs flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={album.coverImage}
                      alt={album.title}
                      className="w-10 h-10 object-cover rounded border border-stone-200"
                    />
                    <div>
                      <span className="font-editorial text-sm font-medium text-stone-900 block">{album.title}</span>
                      <span className="text-[10px] font-mono text-stone-400">{album.category} • {album.year || '2026'}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-stone-600 bg-white px-2 py-0.5 rounded border border-stone-200">
                    {albumCount} frames
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
