import React, { useState } from 'react';
import { Plus, Edit2, Trash2, BookOpen, Calendar, Clock, Check, X } from 'lucide-react';
import { api } from '../api';

export default function AdminStories({ stories, onStoriesUpdated }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    location: '',
    readTime: '3 min read'
  });

  const openCreateModal = () => {
    setEditingStory(null);
    setForm({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      location: 'Hyderabad, India',
      readTime: '3 min read'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (story) => {
    setEditingStory(story);
    setForm({
      title: story.title,
      slug: story.slug,
      excerpt: story.excerpt || '',
      content: story.content || '',
      coverImage: story.coverImage || '',
      location: story.location || '',
      readTime: story.readTime || '3 min read'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;

    setLoading(true);
    setError(null);
    try {
      if (editingStory) {
        await api.updateStory(editingStory.id, form);
        setSuccess('Story updated');
      } else {
        await api.createStory(form);
        setSuccess('New photo essay published');
      }

      setIsModalOpen(false);
      onStoriesUpdated();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete story "${title}"?`)) return;

    try {
      await api.deleteStory(id);
      setSuccess('Story deleted');
      onStoriesUpdated();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete story');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h2 className="font-editorial text-2xl sm:text-3xl text-stone-900 font-normal">
            Behind the Lens Stories & Essays
          </h2>
          <p className="text-stone-500 text-xs font-mono mt-1">
            Write reflective photographic essays, film recipe notes, and travel diaries.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded bg-stone-900 text-stone-100 hover:bg-stone-800 text-xs font-mono uppercase tracking-wider transition-all shadow-subtle"
        >
          <Plus size={14} />
          <span>New Essay</span>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(stories || []).map((story) => (
          <div key={story.id} className="bg-white rounded-sm border border-stone-200/90 shadow-subtle overflow-hidden flex flex-col justify-between">
            <div>
              <div className="aspect-[16/9] bg-stone-100 overflow-hidden">
                <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-5 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-mono text-stone-400">
                  <span>{story.date}</span>
                  <span>•</span>
                  <span>{story.readTime}</span>
                </div>
                <h3 className="font-editorial text-xl text-stone-900 font-normal">{story.title}</h3>
                <p className="text-stone-600 text-xs font-light line-clamp-3 leading-relaxed">{story.excerpt}</p>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-stone-100 bg-stone-50/50 flex justify-end space-x-2">
              <button
                onClick={() => openEditModal(story)}
                className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded text-xs font-mono flex items-center space-x-1"
              >
                <Edit2 size={13} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(story.id, story.title)}
                className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded text-xs font-mono flex items-center space-x-1"
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

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
              {editingStory ? 'Edit Photo Essay' : 'Write New Photo Essay'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">Essay Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. The Quiet Geometry of Shinjuku Rain"
                  className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm font-editorial"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">Reading Time</label>
                  <input
                    type="text"
                    value={form.readTime}
                    onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">Cover Image URL *</label>
                <input
                  type="url"
                  required
                  value={form.coverImage}
                  onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">Excerpt / Teaser</label>
                <textarea
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">Full Story Body *</label>
                <textarea
                  rows={8}
                  required
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Write your thoughts, memory of the light, gear choices, or narrative..."
                  className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm leading-relaxed"
                ></textarea>
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
                  {loading ? 'Publishing...' : editingStory ? 'Update Essay' : 'Publish Essay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
