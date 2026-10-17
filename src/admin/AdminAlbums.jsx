import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Layers, MapPin, Calendar, Check, X, Sparkles } from 'lucide-react';
import { api } from '../api';

export default function AdminAlbums({ albums, onAlbumsUpdated, photos }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    coverImage: '',
    category: 'Street',
    location: '',
    year: new Date().getFullYear().toString(),
    featured: true
  });

  const categories = ['Street', 'Portraits', 'Monochrome', 'Travel', 'Architecture', 'Moments', 'Film', 'General'];

  const openCreateModal = () => {
    setEditingAlbum(null);
    setForm({
      title: '',
      slug: '',
      description: '',
      coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      category: 'Street',
      location: '',
      year: new Date().getFullYear().toString(),
      featured: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (album) => {
    setEditingAlbum(album);
    setForm({
      title: album.title,
      slug: album.slug,
      description: album.description || '',
      coverImage: album.coverImage || '',
      category: album.category || 'Street',
      location: album.location || '',
      year: album.year || '',
      featured: Boolean(album.featured)
    });
    setIsModalOpen(true);
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setForm(prev => ({
      ...prev,
      title,
      slug: prev.slug === '' || !editingAlbum ? slug : prev.slug
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    setLoading(true);
    setError(null);
    try {
      if (editingAlbum) {
        await api.updateAlbum(editingAlbum.id, form);
        setSuccess('Album updated successfully');
      } else {
        await api.createAlbum(form);
        setSuccess('New album created successfully');
      }

      setIsModalOpen(false);
      onAlbumsUpdated();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete album "${title}"? Photos in this album will remain in your library.`)) {
      return;
    }

    try {
      await api.deleteAlbum(id);
      setSuccess('Album deleted successfully');
      onAlbumsUpdated();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete album');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h2 className="font-editorial text-2xl sm:text-3xl text-stone-900 font-normal">
            Curated Albums & Collections
          </h2>
          <p className="text-stone-500 text-xs font-mono mt-1">
            Organize photographs into thematic narratives and editorial series.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded bg-stone-900 text-stone-100 hover:bg-stone-800 text-xs font-mono uppercase tracking-wider transition-all shadow-subtle"
        >
          <Plus size={14} />
          <span>New Album</span>
        </button>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono rounded flex items-center space-x-2 animate-fadeIn">
          <Check size={14} className="text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono rounded">
          {error}
        </div>
      )}

      {/* Albums Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(albums || []).map((album) => {
          const photoCount = photos?.filter(p => p.albumId === album.id || p.albumId === album.slug).length || album.photoCount || 0;

          return (
            <div
              key={album.id}
              className="bg-white rounded-sm border border-stone-200/90 shadow-subtle overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
                  <img
                    src={album.coverImage}
                    alt={album.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-white/90 rounded text-stone-900">
                      {album.category}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5">
                    <span className="px-2 py-0.5 text-[10px] font-mono text-white bg-black/60 rounded flex items-center space-x-1">
                      <Layers size={10} />
                      <span>{photoCount} frames</span>
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
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

                  <h3 className="font-editorial text-xl text-stone-900 font-normal">
                    {album.title}
                  </h3>

                  <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed">
                    {album.description}
                  </p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="px-5 py-3 border-t border-stone-100 bg-stone-50/50 flex justify-end space-x-2">
                <button
                  onClick={() => openEditModal(album)}
                  className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded transition-colors text-xs font-mono flex items-center space-x-1"
                >
                  <Edit2 size={13} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(album.id, album.title)}
                  className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded transition-colors text-xs font-mono flex items-center space-x-1"
                >
                  <Trash2 size={13} />
                  <span>Delete</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Create / Edit Album Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#FAF9F6] border border-stone-300 rounded-sm max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-900 p-1 rounded-full"
            >
              <X size={20} />
            </button>

            <h3 className="font-editorial text-2xl text-stone-900 mb-6">
              {editingAlbum ? 'Edit Curated Album' : 'Create New Curated Album'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                  Album Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Midnight Walk in Shinjuku"
                  className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900 font-editorial"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="midnight-walk"
                  className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                    Year / Timeline
                  </label>
                  <input
                    type="text"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    placeholder="2025 – 2026"
                    className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                  Location / Geographic Scope
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Tokyo & Kyoto"
                  className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  required
                  value={form.coverImage}
                  onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                  Curator's Statement / Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the mood, technique, and intent behind this collection..."
                  className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm resize-none font-light"
                ></textarea>
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-2 text-xs font-mono text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-stone-900 focus:ring-stone-900"
                  />
                  <span>Feature on Homepage Albums Showcase</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-mono uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded text-xs font-mono uppercase tracking-wider disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingAlbum ? 'Update Album' : 'Create Album'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
