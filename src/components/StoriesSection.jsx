import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, ArrowRight, X, Edit2, Trash2 } from 'lucide-react';

export default function StoriesSection({ stories, isAdmin, onEditStory, onDeleteStory }) {
  const [activeStory, setActiveStory] = useState(null);

  if (!stories || stories.length === 0) return null;

  return (
    <section id="stories" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-stone-200">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-stone-200 pb-5">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#78716C] mb-2 block">
            03 / Journal & Essays
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#1C1917] font-normal">
            Behind the Lens
          </h2>
        </div>
        <p className="text-stone-500 text-sm max-w-md mt-2 md:mt-0 font-normal">
          Reflections on pacing, film stock experiments, visual philosophy, and the quiet moments between frames.
        </p>
      </div>

      {/* Story Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
        {stories.map((story) => (
          <article
            key={story.id}
            onClick={() => setActiveStory(story)}
            className="group cursor-pointer flex flex-col space-y-4 relative"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-stone-100 border border-stone-200/70 shadow-subtle">
              <img
                src={story.coverImage}
                alt={story.title}
                loading="lazy"
                className="w-full h-full object-cover img-zoom"
              />
              <div className="absolute top-3.5 left-3.5">
                <span className="px-2.5 py-1 text-[11px] font-mono tracking-wider uppercase bg-white/90 backdrop-blur-md text-stone-900 rounded">
                  {story.location || 'Essay'}
                </span>
              </div>

              {/* Admin Direct Actions */}
              {isAdmin && (
                <div
                  className="absolute top-3.5 right-3.5 flex items-center space-x-1.5 z-20 bg-stone-950/85 backdrop-blur-md p-1 rounded border border-white/20 shadow-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onEditStory && onEditStory(story)}
                    className="p-1.5 text-stone-300 hover:text-white hover:bg-white/20 rounded transition-colors text-xs flex items-center space-x-1"
                    title="Edit Story"
                  >
                    <Edit2 size={12} />
                    <span className="font-mono text-[10px]">Edit</span>
                  </button>
                  <button
                    onClick={() => onDeleteStory && onDeleteStory(story.id, story.title)}
                    className="p-1.5 text-rose-300 hover:text-rose-100 hover:bg-rose-500/30 rounded transition-colors text-xs flex items-center space-x-1"
                    title="Delete Story"
                  >
                    <Trash2 size={12} />
                    <span className="font-mono text-[10px]">Del</span>
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-xs font-mono text-stone-400">
                <span className="flex items-center">
                  <Calendar size={11} className="mr-1 text-stone-500" />
                  {story.date}
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <Clock size={11} className="mr-1 text-stone-500" />
                  {story.readTime}
                </span>
              </div>

              <h3 className="font-editorial text-2xl text-stone-900 group-hover:text-stone-600 transition-colors leading-snug">
                {story.title}
              </h3>

              <p className="text-stone-600 text-sm line-clamp-3 leading-relaxed font-light">
                {story.excerpt}
              </p>

              <div className="pt-2 flex items-center justify-between text-xs font-medium text-stone-900">
                <span className="group-hover:translate-x-1 transition-transform flex items-center">
                  <span>Read Full Essay</span>
                  <ArrowRight size={13} className="ml-1 opacity-70" />
                </span>

                {isAdmin && (
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Admin Active
                  </span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Story Reader Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-md p-4 sm:p-6 animate-fadeIn">
          <div className="bg-[#FAF9F6] border border-stone-300 rounded-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 shadow-2xl relative">
            <button
              onClick={() => setActiveStory(null)}
              className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-900 rounded-full"
            >
              <X size={20} />
            </button>

            <div className="flex items-center space-x-3 text-xs font-mono text-stone-400 uppercase tracking-wider mb-3">
              <span>{activeStory.date}</span>
              <span>•</span>
              <span>{activeStory.readTime}</span>
              <span>•</span>
              <span>{activeStory.location}</span>
            </div>

            <h2 className="font-editorial text-3xl sm:text-4xl text-stone-900 mb-6 leading-tight">
              {activeStory.title}
            </h2>

            <div className="aspect-[16/9] overflow-hidden rounded mb-6">
              <img
                src={activeStory.coverImage}
                alt={activeStory.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed font-light whitespace-pre-line text-base">
              {activeStory.content}
            </div>

            <div className="mt-8 pt-6 border-t border-stone-200 flex justify-between items-center text-xs font-mono text-stone-500">
              <span>Essay by Thuduri Likith Goud</span>
              <div className="flex space-x-2">
                {isAdmin && (
                  <button
                    onClick={() => {
                      const storyToEdit = activeStory;
                      setActiveStory(null);
                      onEditStory && onEditStory(storyToEdit);
                    }}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-xs font-mono flex items-center space-x-1"
                  >
                    <Edit2 size={12} />
                    <span>Edit Essay</span>
                  </button>
                )}
                <button
                  onClick={() => setActiveStory(null)}
                  className="px-4 py-2 bg-stone-900 text-stone-100 rounded text-xs font-sans font-medium"
                >
                  Close Story
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
