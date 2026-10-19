import React, { useState, useRef } from 'react';
import {
  Upload, Plus, Edit2, Trash2, Camera, MapPin, Calendar, Heart,
  Image as ImageIcon, Check, X, Sliders, ExternalLink, Filter
} from 'lucide-react';
import { api } from '../api';
import { optimizeImage } from '../utils/imageOptimizer';

export default function AdminPhotos({ photos, albums, onPhotosUpdated }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [filterAlbum, setFilterAlbum] = useState('all');
  const [search, setSearch] = useState('');

  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: '',
    albumId: '',
    category: 'Street',
    imageUrl: '',
    thumbnailUrl: '',
    caption: '',
    location: '',
    captureDate: new Date().toISOString().split('T')[0],
    camera: 'Sony A7 IV',
    lens: 'FE 35mm f/1.4 GM',
    aperture: 'ƒ/1.4',
    shutterSpeed: '1/250s',
    iso: '100',
    focalLength: '35mm',
    filmSimulation: '',
    featured: true,
    orientation: 'portrait'
  });

  const categories = ['Street', 'Portraits', 'Monochrome', 'Travel', 'Architecture', 'Moments', 'Film', 'General'];

  // Handle direct file uploads from disk
  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);
    try {
      const fileList = Array.from(files);
      let addedCount = 0;

      for (const file of fileList) {
        // Optimize and compress image to high-quality responsive data URL
        const { dataUrl } = await optimizeImage(file, 1800, 1800, 0.85);
        const imageSource = dataUrl || '';

        await api.createPhoto({
          title: file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
          albumId: albums[0]?.id || 'album-1',
          category: 'General',
          imageUrl: imageSource,
          thumbnailUrl: imageSource,
          caption: '',
          location: '',
          captureDate: new Date().toISOString().split('T')[0],
          featured: true,
          orientation: 'portrait'
        });
        addedCount++;
      }

      setSuccess(`Successfully uploaded and indexed ${addedCount} photo(s)!`);
      onPhotosUpdated();
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      setError(err.message || 'File upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const openCreateModal = () => {
    setEditingPhoto(null);
    setForm({
      title: '',
      albumId: albums[0]?.id || '',
      category: 'Street',
      imageUrl: '',
      thumbnailUrl: '',
      caption: '',
      location: 'Hyderabad, India',
      captureDate: new Date().toISOString().split('T')[0],
      camera: 'Sony A7 IV',
      lens: 'FE 35mm f/1.4 GM',
      aperture: 'ƒ/1.4',
      shutterSpeed: '1/250s',
      iso: '100',
      focalLength: '35mm',
      filmSimulation: 'Kodak Portra 400',
      featured: true,
      orientation: 'portrait'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (photo) => {
    setEditingPhoto(photo);
    setForm({
      title: photo.title || '',
      albumId: photo.albumId || '',
      category: photo.category || 'Street',
      imageUrl: photo.imageUrl || '',
      thumbnailUrl: photo.thumbnailUrl || '',
      caption: photo.caption || '',
      location: photo.location || '',
      captureDate: photo.captureDate || '',
      camera: photo.camera || 'Sony A7 IV',
      lens: photo.lens || 'FE 35mm f/1.4 GM',
      aperture: photo.aperture || 'ƒ/1.4',
      shutterSpeed: photo.shutterSpeed || '1/250s',
      iso: photo.iso || '100',
      focalLength: photo.focalLength || '35mm',
      filmSimulation: photo.filmSimulation || '',
      featured: Boolean(photo.featured),
      orientation: photo.orientation || 'portrait'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.imageUrl.trim()) return;

    setLoading(true);
    setError(null);
    try {
      if (editingPhoto) {
        await api.updatePhoto(editingPhoto.id, form);
        setSuccess('Photograph details updated successfully');
      } else {
        await api.createPhoto(form);
        setSuccess('New frame added to gallery');
      }

      setIsModalOpen(false);
      onPhotosUpdated();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete frame "${title}" permanently?`)) return;

    try {
      await api.deletePhoto(id);
      setSuccess('Photo removed');
      onPhotosUpdated();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete photo');
    }
  };

  // Filter photos
  const filteredPhotos = (photos || []).filter(p => {
    const matchesAlbum = filterAlbum === 'all' || p.albumId === filterAlbum;
    const matchesSearch = !search || 
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.camera.toLowerCase().includes(search.toLowerCase());
    return matchesAlbum && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h2 className="font-editorial text-2xl sm:text-3xl text-stone-900 font-normal">
            Upload Images
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            accept="image/*"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded bg-stone-900 text-stone-100 hover:bg-stone-800 text-xs font-mono uppercase tracking-wider transition-all shadow-subtle disabled:opacity-50"
          >
            <Upload size={14} />
            <span>{uploading ? 'Uploading Files...' : 'Upload from Device'}</span>
          </button>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded border border-stone-300 hover:border-stone-900 bg-white text-stone-800 text-xs font-mono uppercase tracking-wider transition-all"
          >
            <Plus size={14} />
            <span>Add by URL</span>
          </button>
        </div>
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

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-sm border border-stone-200/90 shadow-subtle flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <Filter size={15} className="text-stone-400" />
          <select
            value={filterAlbum}
            onChange={(e) => setFilterAlbum(e.target.value)}
            className="px-3 py-1.5 rounded border border-stone-200 text-stone-900 text-xs font-mono"
          >
            <option value="all">All Albums ({photos?.length || 0})</option>
            {(albums || []).map(a => (
              <option key={a.id} value={a.id}>{a.title}</option>
            ))}
          </select>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by title, camera, or place..."
          className="w-full sm:w-64 px-3.5 py-1.5 rounded border border-stone-200 text-xs text-stone-900"
        />
      </div>

      {/* Photos Table / Grid */}
      <div className="bg-white rounded-sm border border-stone-200/90 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Frame</th>
                <th className="py-3 px-4">Title & Story</th>
                <th className="py-3 px-4">Album</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4 text-center">Likes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredPhotos.map((photo) => {
                const album = albums?.find(a => a.id === photo.albumId || a.slug === photo.albumId);

                return (
                  <tr key={photo.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="w-14 h-14 rounded overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
                        <img
                          src={photo.thumbnailUrl || photo.imageUrl}
                          alt={photo.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* Title */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-editorial text-sm text-stone-900 font-semibold mb-0.5">
                        {photo.title}
                      </div>
                      <div className="text-[11px] text-stone-500 line-clamp-1 font-sans">
                        {photo.caption || 'No caption'}
                      </div>
                    </td>

                    {/* Album */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[11px]">
                        {album?.title || 'Unassigned'}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="py-3 px-4 text-stone-600">
                      {photo.location || '—'}
                    </td>

                    {/* Likes */}
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center space-x-1 text-rose-500">
                        <Heart size={11} className="fill-current" />
                        <span>{photo.likes || 0}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(photo)}
                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded"
                        title="Edit photo metadata"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(photo.id, photo.title)}
                        className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded"
                        title="Delete photo"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Photo Metadata Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#FAF9F6] border border-stone-300 rounded-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-900 p-1 rounded-full"
            >
              <X size={20} />
            </button>

            <h3 className="font-editorial text-2xl text-stone-900 mb-6">
              {editingPhoto ? 'Edit Image' : 'Add New Image'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                    Frame Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Midnight Rain Reflections"
                    className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm font-editorial"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                    Assign to Album *
                  </label>
                  <select
                    value={form.albumId}
                    onChange={(e) => setForm({ ...form, albumId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm"
                  >
                    <option value="">Select Album</option>
                    {(albums || []).map(a => (
                      <option key={a.id} value={a.id}>{a.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                  High-Resolution Image URL *
                </label>
                <input
                  type="text"
                  required
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/... or /uploads/..."
                  className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                  Story & Memory Notes (Caption)
                </label>
                <textarea
                  rows={2}
                  value={form.caption}
                  onChange={(e) => setForm({ ...form, caption: e.target.value })}
                  placeholder="The emotional context, weather, or memory behind this shot..."
                  className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm font-light resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Shinjuku, Tokyo"
                    className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                    Date Captured
                  </label>
                  <input
                    type="date"
                    value={form.captureDate}
                    onChange={(e) => setForm({ ...form, captureDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm"
                  />
                </div>
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
                  {loading ? 'Saving...' : editingPhoto ? 'Update Image' : 'Add Image'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
