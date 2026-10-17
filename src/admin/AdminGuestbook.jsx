import React, { useState } from 'react';
import { MessageSquare, Check, X, Trash2, Edit2, Mail, Sparkles, Plus, Save } from 'lucide-react';
import InstagramIcon from '../components/InstagramIcon';
import { api } from '../api';

export default function AdminGuestbook({ guestbook, inquiries, onGuestbookUpdated, onInquiriesUpdated }) {
  const [activeTab, setActiveTab] = useState('guestbook'); // 'guestbook' | 'inquiries'
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Edit Guestbook Modal State
  const [editingEntry, setEditingEntry] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    instagram: '',
    message: '',
    emoji: '✨',
    status: 'approved'
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const emojiOptions = ['✨', '🤍', '📸', '🎞️', '☕', '🌅', '🕯️', '🪄'];

  const handleStatusChange = async (id, status) => {
    try {
      await api.updateGuestbookStatus(id, status);
      setSuccess(`Status updated to ${status}`);
      onGuestbookUpdated();
      setTimeout(() => setSuccess(null), 2500);
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const openEditModal = (entry) => {
    setEditingEntry(entry);
    setEditForm({
      name: entry.name || '',
      instagram: entry.instagram || '',
      message: entry.message || '',
      emoji: entry.emoji || '✨',
      status: entry.status || 'approved'
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim() || !editForm.message.trim()) return;

    setSavingEdit(true);
    try {
      await api.updateGuestbookEntry(editingEntry.id, {
        name: editForm.name.trim(),
        instagram: editForm.instagram.trim().replace(/^@/, ''),
        message: editForm.message.trim(),
        emoji: editForm.emoji,
        status: editForm.status
      });

      setSuccess('Guestbook memory updated successfully');
      setEditingEntry(null);
      onGuestbookUpdated();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to save changes');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteGuestbook = async (id, name) => {
    if (!window.confirm(`Delete memory note from "${name}" permanently?`)) return;
    try {
      await api.deleteGuestbookEntry(id);
      setSuccess('Entry deleted permanently');
      onGuestbookUpdated();
      setTimeout(() => setSuccess(null), 2500);
    } catch (err) {
      setError('Failed to delete entry');
    }
  };

  const handleUpdateInquiryStatus = async (id, status) => {
    try {
      await api.updateInquiry(id, { status });
      setSuccess(`Inquiry marked as ${status}`);
      onInquiriesUpdated();
      setTimeout(() => setSuccess(null), 2500);
    } catch (err) {
      setError('Failed to update inquiry');
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm('Delete this inquiry permanently?')) return;
    try {
      await api.deleteInquiry(id);
      setSuccess('Inquiry deleted permanently');
      onInquiriesUpdated();
      setTimeout(() => setSuccess(null), 2500);
    } catch (err) {
      setError('Failed to delete inquiry');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h2 className="font-editorial text-2xl sm:text-3xl text-stone-900 font-normal">
            Community & Inquiries Moderation
          </h2>
          <p className="text-stone-500 text-xs font-mono mt-1">
            Edit, moderate, or delete guestbook messages and collaboration requests.
          </p>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('guestbook')}
            className={`px-4 py-2 rounded text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === 'guestbook'
                ? 'bg-stone-900 text-stone-100 shadow-sm'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            Guestbook Notes ({guestbook?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2 rounded text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === 'inquiries'
                ? 'bg-stone-900 text-stone-100 shadow-sm'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            Inquiries ({inquiries?.length || 0})
          </button>
        </div>
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono rounded flex items-center space-x-2 animate-fadeIn">
          <Sparkles size={14} className="text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono rounded animate-fadeIn">
          {error}
        </div>
      )}

      {activeTab === 'guestbook' ? (
        <div className="bg-white rounded-sm border border-stone-200/90 shadow-subtle overflow-hidden">
          {(!guestbook || guestbook.length === 0) ? (
            <div className="p-12 text-center text-stone-400 font-mono text-xs">
              No guestbook messages received yet.
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {guestbook.map((entry) => (
                <div key={entry.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/50 transition-colors">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xl">{entry.emoji || '✨'}</span>
                      <span className="font-editorial text-base text-stone-900 font-semibold">{entry.name}</span>
                      {entry.instagram && (
                        <a
                          href={`https://www.instagram.com/${entry.instagram}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-xs font-mono text-stone-500 hover:text-stone-900"
                        >
                          <InstagramIcon size={11} className="text-[#E1306C]" />
                          <span>@{entry.instagram}</span>
                        </a>
                      )}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                        entry.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {entry.status}
                      </span>
                    </div>

                    <p className="text-stone-700 text-sm font-light">"{entry.message}"</p>

                    <div className="text-[10px] font-mono text-stone-400">
                      {new Date(entry.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {/* Edit Option */}
                    <button
                      onClick={() => openEditModal(entry)}
                      className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs font-mono flex items-center space-x-1"
                      title="Edit memory content"
                    >
                      <Edit2 size={12} />
                      <span>Edit</span>
                    </button>

                    {/* Quick Approve / Hide Status */}
                    {entry.status !== 'approved' ? (
                      <button
                        onClick={() => handleStatusChange(entry.id, 'approved')}
                        className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-xs font-mono flex items-center space-x-1"
                        title="Approve and publish"
                      >
                        <Check size={12} />
                        <span>Approve</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(entry.id, 'hidden')}
                        className="px-2.5 py-1.5 bg-stone-100 text-stone-600 hover:bg-stone-200 rounded text-xs font-mono flex items-center space-x-1"
                        title="Hide from public"
                      >
                        <X size={12} />
                        <span>Hide</span>
                      </button>
                    )}

                    {/* Delete Option */}
                    <button
                      onClick={() => handleDeleteGuestbook(entry.id, entry.name)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded text-xs font-mono"
                      title="Delete permanently"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-sm border border-stone-200/90 shadow-subtle overflow-hidden">
          {(!inquiries || inquiries.length === 0) ? (
            <div className="p-12 text-center text-stone-400 font-mono text-xs">
              No inquiries received yet.
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {inquiries.map((inq) => (
                <div key={inq.id} className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-stone-50/50">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center space-x-3">
                      <Mail size={15} className="text-stone-600" />
                      <span className="font-editorial text-base text-stone-900 font-semibold">{inq.name}</span>
                      <a href={`mailto:${inq.email}`} className="text-xs font-mono text-stone-500 hover:text-stone-900 underline">
                        {inq.email}
                      </a>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                        inq.status === 'replied' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {inq.status || 'unread'}
                      </span>
                    </div>

                    <div className="font-mono text-xs text-stone-800 font-medium">
                      Subject: {inq.subject}
                    </div>

                    <p className="text-stone-700 text-sm font-light whitespace-pre-line bg-stone-50 p-3 rounded border border-stone-100">
                      {inq.message}
                    </p>

                    <div className="text-[10px] font-mono text-stone-400">
                      Received: {new Date(inq.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button
                      onClick={() => handleUpdateInquiryStatus(inq.id, inq.status === 'replied' ? 'unread' : 'replied')}
                      className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs font-mono"
                    >
                      {inq.status === 'replied' ? 'Mark Unread' : 'Mark Replied'}
                    </button>
                    <button
                      onClick={() => handleDeleteInquiry(inq.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded text-xs font-mono"
                      title="Delete inquiry"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Guestbook Entry Modal */}
      {editingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#FAF9F6] border border-stone-300 rounded-sm max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setEditingEntry(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-900 p-1 rounded-full"
            >
              <X size={20} />
            </button>

            <h3 className="font-editorial text-2xl text-stone-900 mb-6">
              Edit Guestbook Memory
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                  Visitor Name *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                  Instagram Handle
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">@</span>
                  <input
                    type="text"
                    value={editForm.instagram}
                    onChange={(e) => setEditForm({ ...editForm, instagram: e.target.value })}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                  Message / Thought *
                </label>
                <textarea
                  required
                  rows={4}
                  value={editForm.message}
                  onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm leading-relaxed"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                    Status
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-stone-200 text-xs font-mono"
                  >
                    <option value="approved">Approved (Public)</option>
                    <option value="pending">Pending Review</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                    Stamp Emoji
                  </label>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {emojiOptions.map((e) => (
                      <button
                        type="button"
                        key={e}
                        onClick={() => setEditForm({ ...editForm, emoji: e })}
                        className={`w-7 h-7 rounded text-sm flex items-center justify-center border transition-all ${
                          editForm.emoji === e ? 'border-stone-900 bg-stone-200 scale-105' : 'border-stone-200 bg-white'
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingEntry(null)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-mono uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded text-xs font-mono uppercase tracking-wider flex items-center space-x-1.5"
                >
                  <Save size={13} />
                  <span>{savingEdit ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
