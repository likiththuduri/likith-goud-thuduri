import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AlbumGrid from './components/AlbumGrid';
import AlbumDetail from './components/AlbumDetail';
import PhotoGrid from './components/PhotoGrid';
import LightboxModal from './components/LightboxModal';
import Footer from './components/Footer';

// Admin Views
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/AdminLogin';
import AdminOverview from './admin/AdminOverview';
import AdminBranding from './admin/AdminBranding';
import AdminAlbums from './admin/AdminAlbums';
import AdminPhotos from './admin/AdminPhotos';
import AdminSettings from './admin/AdminSettings';

import { api } from './api';
import { Settings, Plus, Camera, Layers, LogOut } from 'lucide-react';

export default function App() {
  // App Data State
  const [settings, setSettings] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // View & Navigation State
  const [viewMode, setViewMode] = useState('public'); // 'public' | 'admin'
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [activePhoto, setActivePhoto] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('home');

  // Admin Dashboard State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [adminTab, setAdminTab] = useState('overview');

  // User likes tracking
  const [likedPhotoIds, setLikedPhotoIds] = useState(() => {
    try {
      const saved = localStorage.getItem('likith_liked_photos');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Fetch all initial data
  const loadData = async () => {
    try {
      const [sData, aData, pData] = await Promise.all([
        api.getSettings(),
        api.getAlbums(),
        api.getPhotos()
      ]);

      setSettings(sData);
      setAlbums(aData);
      setPhotos(pData);

      // Check admin status
      const auth = await api.verifyAuth();
      setIsAdminLoggedIn(auth);
      if (auth) {
        try {
          const stats = await api.getAdminStats();
          setAdminStats(stats);
          const inq = await api.getInquiries();
          setInquiries(inq);
        } catch (e) {
          console.error(e);
        }
      }
    } catch (err) {
      console.error('Failed to load portfolio data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Check if URL has ?admin or photo param
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
      setViewMode('admin');
    }
  }, []);

  // Sync title and favicon
  useEffect(() => {
    if (settings) {
      document.title = `${settings.fullName || 'THUDURI LIKITH GOUD'} — ${settings.brandName || 'likith.'} (${settings.tagline || 'into my captures'})`;
    }
  }, [settings]);

  // Handle Likes
  const handleLikePhoto = async (photoId) => {
    // Optimistic UI update
    setPhotos(prev =>
      prev.map(p => (p.id === photoId ? { ...p, likes: (p.likes || 0) + 1 } : p))
    );

    if (activePhoto && activePhoto.id === photoId) {
      setActivePhoto(prev => ({ ...prev, likes: (prev.likes || 0) + 1 }));
    }

    const nextLiked = new Set(likedPhotoIds);
    nextLiked.add(photoId);
    setLikedPhotoIds(nextLiked);
    localStorage.setItem('likith_liked_photos', JSON.stringify([...nextLiked]));

    try {
      await api.likePhoto(photoId);
    } catch (err) {
      console.error('Failed to record like on server:', err);
    }
  };

  // Lightbox Navigation
  const handleNextPhoto = () => {
    if (!activePhoto) return;
    const currentList = selectedAlbum
      ? photos.filter(p => p.albumId === selectedAlbum.id || p.albumId === selectedAlbum.slug)
      : filteredPhotos;
    const idx = currentList.findIndex(p => p.id === activePhoto.id);
    if (idx !== -1 && idx < currentList.length - 1) {
      setActivePhoto(currentList[idx + 1]);
    } else {
      setActivePhoto(currentList[0]);
    }
  };

  const handlePrevPhoto = () => {
    if (!activePhoto) return;
    const currentList = selectedAlbum
      ? photos.filter(p => p.albumId === selectedAlbum.id || p.albumId === selectedAlbum.slug)
      : filteredPhotos;
    const idx = currentList.findIndex(p => p.id === activePhoto.id);
    if (idx > 0) {
      setActivePhoto(currentList[idx - 1]);
    } else {
      setActivePhoto(currentList[currentList.length - 1]);
    }
  };

  // Filtered Photos for Home stream
  const filteredPhotos = photos.filter(p => {
    const matchesCat = selectedCategory === 'all' || (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());
    const matchesSearch = !searchQuery ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.camera?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.lens?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Direct Edit & Delete Handlers
  const handleDirectEditAlbum = (album) => {
    setAdminTab('albums');
    setViewMode('admin');
  };

  const handleDirectDeleteAlbum = async (id, title) => {
    if (!window.confirm(`Delete album "${title}" permanently?`)) return;
    try {
      await api.deleteAlbum(id);
      const updated = await api.getAlbums();
      setAlbums(updated);
      if (selectedAlbum && selectedAlbum.id === id) setSelectedAlbum(null);
    } catch (err) {
      alert('Failed to delete album');
    }
  };

  const handleDirectEditPhoto = (photo) => {
    setAdminTab('photos');
    setViewMode('admin');
  };

  const handleDirectDeletePhoto = async (id, title) => {
    if (!window.confirm(`Delete photo "${title}" permanently?`)) return;
    try {
      await api.deletePhoto(id);
      const updated = await api.getPhotos();
      setPhotos(updated);
      if (activePhoto && activePhoto.id === id) setActivePhoto(null);
    } catch (err) {
      alert('Failed to delete photo');
    }
  };

  // Admin access handler
  const handleOpenAdmin = () => {
    if (isAdminLoggedIn) {
      setViewMode('admin');
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLoginSuccess = async () => {
    setIsAdminLoggedIn(true);
    setShowLoginModal(false);
    setViewMode('admin');
    const stats = await api.getAdminStats();
    setAdminStats(stats);
    const inq = await api.getInquiries();
    setInquiries(inq);
  };

  const handleLogout = () => {
    api.logout();
    setIsAdminLoggedIn(false);
    setViewMode('public');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 rounded-full border-2 border-stone-800 border-t-transparent animate-spin"></div>
        <p className="font-editorial text-2xl font-bold tracking-wider text-stone-900 uppercase">
          THUDURI LIKITH GOUD
        </p>
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-stone-400">into my captures...</span>
      </div>
    );
  }

  // ==========================================
  // RENDER: ADMIN DASHBOARD
  // ==========================================
  if (viewMode === 'admin' && isAdminLoggedIn) {
    return (
      <AdminLayout
        activeTab={adminTab}
        onTabChange={setAdminTab}
        onLogout={handleLogout}
        onViewSite={() => setViewMode('public')}
        settings={settings}
      >
        {adminTab === 'overview' && (
          <AdminOverview
            stats={adminStats}
            onNavigate={setAdminTab}
            photos={photos}
            albums={albums}
            inquiries={inquiries}
          />
        )}
        {adminTab === 'branding' && (
          <AdminBranding
            initialSettings={settings}
            onSettingsUpdated={(newSettings) => setSettings(newSettings)}
          />
        )}
        {adminTab === 'albums' && (
          <AdminAlbums
            albums={albums}
            onAlbumsUpdated={async () => {
              const updated = await api.getAlbums();
              setAlbums(updated);
            }}
            photos={photos}
          />
        )}
        {adminTab === 'photos' && (
          <AdminPhotos
            photos={photos}
            albums={albums}
            onPhotosUpdated={async () => {
              const updated = await api.getPhotos();
              setPhotos(updated);
            }}
          />
        )}
        {adminTab === 'settings' && (
          <AdminSettings
            onResetCompleted={loadData}
          />
        )}
      </AdminLayout>
    );
  }

  // ==========================================
  // RENDER: PUBLIC PHOTOGRAPHY WEBSITE
  // ==========================================
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1C1917] flex flex-col justify-between selection:bg-[#1C1917] selection:text-white">
      
      {/* Sticky Editorial Navigation */}
      <Navbar
        settings={settings}
        onAdminClick={handleOpenAdmin}
        activeSection={activeSection}
        isAdmin={isAdminLoggedIn}
        onOpenAdminTab={(tab) => {
          setAdminTab(tab);
          setViewMode('admin');
        }}
        onNavigate={(sec) => {
          setSelectedAlbum(null);
          setActiveSection(sec);
          if (sec === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <main className="flex-1">
        {selectedAlbum ? (
          /* Dedicated Album View */
          <AlbumDetail
            album={selectedAlbum}
            photos={photos}
            onBack={() => {
              setSelectedAlbum(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onPhotoClick={(photo) => setActivePhoto(photo)}
            onLikePhoto={handleLikePhoto}
          />
        ) : (
          /* Public Homepage */
          <>
            <Hero
              settings={settings}
            />

            <AlbumGrid
              albums={albums}
              onSelectAlbum={(album) => {
                setSelectedAlbum(album);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              isAdmin={isAdminLoggedIn}
              onEditAlbum={handleDirectEditAlbum}
              onDeleteAlbum={handleDirectDeleteAlbum}
            />

            <PhotoGrid
              photos={photos}
              onPhotoClick={(photo) => setActivePhoto(photo)}
              onLikePhoto={handleLikePhoto}
              likedPhotoIds={likedPhotoIds}
              isAdmin={isAdminLoggedIn}
              onEditPhoto={handleDirectEditPhoto}
              onDeletePhoto={handleDirectDeletePhoto}
            />
          </>
        )}
      </main>

      {/* Floating Admin Toolbar for Quick Edit/Delete/Upload Actions */}
      {isAdminLoggedIn && (
        <div className="fixed bottom-5 right-5 z-40 bg-stone-900/95 backdrop-blur-md text-white px-4 py-2.5 rounded-full shadow-2xl border border-stone-700 flex items-center space-x-3 text-xs font-mono animate-fadeIn">
          <span className="flex items-center space-x-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold hidden sm:inline">Admin Active</span>
          </span>

          <span className="text-stone-600">|</span>

          <button
            onClick={() => {
              setAdminTab('overview');
              setViewMode('admin');
            }}
            className="hover:text-emerald-300 transition-colors flex items-center space-x-1"
            title="Open Full CMS Studio"
          >
            <Settings size={13} />
            <span>Studio CMS</span>
          </button>

          <button
            onClick={() => {
              setAdminTab('photos');
              setViewMode('admin');
            }}
            className="hover:text-emerald-300 transition-colors hidden sm:flex items-center space-x-1"
            title="Upload Photographs"
          >
            <Camera size={13} />
            <span>+ Photo</span>
          </button>

          <button
            onClick={() => {
              setAdminTab('albums');
              setViewMode('admin');
            }}
            className="hover:text-emerald-300 transition-colors hidden md:flex items-center space-x-1"
            title="Create Album"
          >
            <Layers size={13} />
            <span>+ Album</span>
          </button>

          <button
            onClick={handleLogout}
            className="text-rose-400 hover:text-rose-300 transition-colors"
            title="Sign Out"
          >
            <LogOut size={13} />
          </button>
        </div>
      )}

      {/* Editorial Footer */}
      <Footer
        settings={settings}
        onAdminClick={handleOpenAdmin}
      />

      {/* Lightbox Inspector Modal */}
      <LightboxModal
        photo={activePhoto}
        photos={selectedAlbum ? photos.filter(p => p.albumId === selectedAlbum.id || p.albumId === selectedAlbum.slug) : filteredPhotos}
        isOpen={Boolean(activePhoto)}
        onClose={() => setActivePhoto(null)}
        onNext={handleNextPhoto}
        onPrev={handlePrevPhoto}
        onLike={handleLikePhoto}
        isLiked={activePhoto ? likedPhotoIds.has(activePhoto.id) : false}
        isAdmin={isAdminLoggedIn}
        onEditPhoto={handleDirectEditPhoto}
        onDeletePhoto={handleDirectDeletePhoto}
      />

      {/* Admin Login Modal */}
      {showLoginModal && (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onCancel={() => setShowLoginModal(false)}
        />
      )}

    </div>
  );
}
