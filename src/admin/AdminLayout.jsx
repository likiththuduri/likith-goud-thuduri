import React, { useState } from 'react';
import {
  LayoutDashboard, Type, Layers, Camera, BookOpen, MessageSquare,
  Settings, LogOut, ArrowUpRight, Menu, X, Eye, ExternalLink
} from 'lucide-react';

export default function AdminLayout({
  activeTab,
  onTabChange,
  onLogout,
  onViewSite,
  settings,
  children
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'branding', label: 'Brand & Identity', icon: Type },
    { id: 'albums', label: 'Curated Albums', icon: Layers },
    { id: 'photos', label: 'Photos & EXIF', icon: Camera },
    { id: 'stories', label: 'Stories & Essays', icon: BookOpen },
    { id: 'guestbook', label: 'Guestbook & Notes', icon: MessageSquare },
    { id: 'settings', label: 'Studio Settings', icon: Settings },
  ];

  const handleSelectTab = (tabId) => {
    onTabChange(tabId);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 flex flex-col md:flex-row">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-stone-200/90 p-5 justify-between flex-shrink-0 shadow-subtle min-h-screen sticky top-0">
        
        {/* Top Branding */}
        <div className="space-y-6">
          <div className="pb-4 border-b border-stone-100 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-editorial text-2xl font-bold text-stone-900">
                  {settings?.brandName || 'likith.'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-stone-900"></span>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400">
                Studio Studio CMS
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-mono">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded transition-colors text-left ${
                    isActive
                      ? 'bg-stone-900 text-stone-100 font-semibold shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-stone-100 space-y-2 text-xs font-mono">
          <button
            onClick={onViewSite}
            className="w-full flex items-center justify-between px-3 py-2 rounded text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <span className="flex items-center space-x-2">
              <Eye size={14} />
              <span>View Public Site</span>
            </span>
            <ArrowUpRight size={14} />
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* Mobile Header Bar */}
      <div className="md:hidden bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 text-stone-800 rounded"
          >
            {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="font-editorial text-xl font-bold">{settings?.brandName || 'likith.'} Studio</span>
        </div>

        <button
          onClick={onViewSite}
          className="text-xs font-mono flex items-center space-x-1 text-stone-700"
        >
          <span>Live Site</span>
          <ArrowUpRight size={13} />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-5 py-4 space-y-2 shadow-lg animate-fadeIn z-20">
          <nav className="space-y-1 text-xs font-mono">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded transition-colors text-left ${
                    isActive
                      ? 'bg-stone-900 text-stone-100 font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-stone-100">
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded text-xs font-mono text-rose-600 hover:bg-rose-50"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>

    </div>
  );
}
