import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, Heart, Edit2, Trash2 } from 'lucide-react';
import InstagramIcon from './InstagramIcon';
import confetti from 'canvas-confetti';

export default function GuestbookSection({ guestbook, onAddEntry, isAdmin, onEditEntry, onDeleteEntry }) {
  const [name, setName] = useState('');
  const [instagram, setInstagram] = useState('');
  const [message, setMessage] = useState('');
  const [emoji, setEmoji] = useState('✨');
  const [submitting, setSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState(null);

  const emojiOptions = ['✨', '🤍', '📸', '🎞️', '☕', '🌅', '🕯️', '🪄'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      const res = await onAddEntry({
        name: name.trim(),
        instagram: instagram.trim().replace(/^@/, ''),
        message: message.trim(),
        emoji
      });

      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.7 }
      });

      setName('');
      setInstagram('');
      setMessage('');
      setSubmittedMessage(res?.message || 'Thank you for leaving your note on my wall!');
      setTimeout(() => setSubmittedMessage(null), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="guestbook" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-stone-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-stone-200 pb-5">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#78716C] mb-2 block">
            04 / Community & Visitors
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#1C1917] font-normal">
            The Memory Wall
          </h2>
        </div>
        <p className="text-stone-500 text-sm max-w-md mt-2 md:mt-0 font-normal">
          Dropping in from my Instagram bio? Leave a gentle note, favorite frame, or say hello.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Sign Form */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-sm border border-stone-200/80 shadow-subtle h-fit">
          <div className="flex items-center space-x-2 text-stone-900 font-editorial text-xl mb-4">
            <MessageSquare size={18} className="text-stone-800" />
            <span>Sign the Guestbook</span>
          </div>

          {submittedMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono rounded flex items-center space-x-2 animate-fadeIn">
              <Sparkles size={14} className="text-emerald-600" />
              <span>{submittedMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maya Chen"
                className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                Instagram Handle (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">@</span>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="your_handle"
                  className="w-full pl-8 pr-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                A Note or Favorite Memory *
              </label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Loved the lighting on the Tokyo rainy night capture..."
                className="w-full px-3.5 py-2.5 rounded border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                Choose a Stamp
              </label>
              <div className="flex flex-wrap gap-2">
                {emojiOptions.map((e) => (
                  <button
                    type="button"
                    key={e}
                    onClick={() => setEmoji(e)}
                    className={`w-9 h-9 rounded flex items-center justify-center text-base border transition-all ${
                      emoji === e
                        ? 'border-stone-900 bg-stone-100 scale-105 shadow-sm'
                        : 'border-stone-200 hover:border-stone-400 bg-white'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded text-xs font-mono uppercase tracking-wider font-medium flex items-center justify-center space-x-2 transition-all shadow-subtle disabled:opacity-50"
            >
              <Send size={13} />
              <span>{submitting ? 'Inscribing...' : 'Leave Your Note'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Wall of Notes */}
        <div className="lg:col-span-7">
          {guestbook.length === 0 ? (
            <div className="p-8 text-center bg-white border border-stone-200 rounded-sm text-stone-400 font-mono text-xs">
              No notes inscribed yet. Be the first to leave a memory!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[540px] overflow-y-auto pr-2">
              {guestbook.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white p-5 rounded-sm border border-stone-200/80 shadow-subtle flex flex-col justify-between space-y-3 relative group"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-editorial text-base text-stone-900 font-semibold">
                          {entry.name}
                        </h4>
                        {entry.instagram && (
                          <a
                            href={`https://www.instagram.com/${entry.instagram}/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-[11px] font-mono text-stone-500 hover:text-stone-900"
                          >
                            <InstagramIcon size={11} className="text-[#E1306C]" />
                            <span>@{entry.instagram}</span>
                          </a>
                        )}
                      </div>
                      <span className="text-xl">{entry.emoji || '✨'}</span>
                    </div>

                    <p className="text-stone-700 text-xs sm:text-sm font-light leading-relaxed">
                      "{entry.message}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 border-t border-stone-100 pt-2">
                    <span>
                      {new Date(entry.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>

                    {/* Admin Direct Actions on memory note */}
                    {isAdmin && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onEditEntry && onEditEntry(entry)}
                          className="text-stone-600 hover:text-stone-900 flex items-center space-x-0.5"
                          title="Edit Note"
                        >
                          <Edit2 size={11} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => onDeleteEntry && onDeleteEntry(entry.id, entry.name)}
                          className="text-rose-500 hover:text-rose-700 flex items-center space-x-0.5"
                          title="Delete Note"
                        >
                          <Trash2 size={11} />
                          <span>Del</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </section>
  );
}
