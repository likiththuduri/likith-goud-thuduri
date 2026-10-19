const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('likith_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function parseResponse(res, defaultError = 'Request failed') {
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // Non-JSON response (e.g., 413 Request Entity Too Large, 502, 504 HTML error)
  }

  if (!res.ok) {
    if (res.status === 413) {
      throw new Error('Image size is too large for upload (server payload limit). Please try uploading images individually.');
    }
    const message = data?.error || data?.message || (text && text.length < 150 ? text : defaultError);
    throw new Error(message);
  }

  return data;
}

export const api = {
  // Settings & Branding
  async getSettings() {
    const res = await fetch(`${API_BASE}/settings`);
    return parseResponse(res, 'Failed to load settings');
  },

  async updateSettings(settings) {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });
    return parseResponse(res, 'Failed to update settings');
  },

  // Albums
  async getAlbums() {
    const res = await fetch(`${API_BASE}/albums`);
    if (!res.ok) throw new Error('Failed to load albums');
    return res.json();
  },

  async getAlbum(slugOrId) {
    const res = await fetch(`${API_BASE}/albums/${slugOrId}`);
    if (!res.ok) throw new Error('Failed to load album');
    return res.json();
  },

  async createAlbum(albumData) {
    const res = await fetch(`${API_BASE}/albums`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(albumData)
    });
    if (!res.ok) throw new Error('Failed to create album');
    return res.json();
  },

  async updateAlbum(id, albumData) {
    const res = await fetch(`${API_BASE}/albums/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(albumData)
    });
    if (!res.ok) throw new Error('Failed to update album');
    return res.json();
  },

  async deleteAlbum(id) {
    const res = await fetch(`${API_BASE}/albums/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete album');
    return res.json();
  },

  // Photos
  async getPhotos(filters = {}) {
    const params = new URLSearchParams();
    if (filters.albumId) params.append('albumId', filters.albumId);
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.featured) params.append('featured', filters.featured);
    if (filters.search) params.append('search', filters.search);

    const query = params.toString() ? `?${params.toString()}` : '';
    let serverPhotos = [];
    try {
      const res = await fetch(`${API_BASE}/photos${query}`);
      if (res.ok) {
        serverPhotos = await res.json();
      }
    } catch (err) {
      console.warn('Network error fetching photos from server, using local cache:', err);
    }

    // Client-side persistent backup
    try {
      const saved = localStorage.getItem('likith_custom_photos');
      const localPhotos = saved ? JSON.parse(saved) : null;
      if (localPhotos && Array.isArray(localPhotos)) {
        if (serverPhotos.length === 0 && localPhotos.length > 0) {
          // If server container reset to empty baseline, restore from persistent local cache
          return localPhotos;
        }
        if (serverPhotos.length > 0) {
          localStorage.setItem('likith_custom_photos', JSON.stringify(serverPhotos));
        }
      } else if (serverPhotos.length > 0) {
        localStorage.setItem('likith_custom_photos', JSON.stringify(serverPhotos));
      }
    } catch {}

    return serverPhotos;
  },

  async getPhoto(id) {
    const res = await fetch(`${API_BASE}/photos/${id}`);
    if (!res.ok) throw new Error('Failed to load photo');
    return res.json();
  },

  async likePhoto(id, action = 'like') {
    const res = await fetch(`${API_BASE}/photos/${id}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    });

    // Also update client-side cache
    try {
      const saved = localStorage.getItem('likith_custom_photos');
      if (saved) {
        const photos = JSON.parse(saved);
        const delta = action === 'unlike' ? -1 : 1;
        const next = photos.map(p =>
          p.id === id ? { ...p, likes: Math.max(0, (p.likes || 0) + delta) } : p
        );
        localStorage.setItem('likith_custom_photos', JSON.stringify(next));
      }
    } catch {}

    if (!res.ok) throw new Error('Failed to update like');
    return res.json();
  },

  async createPhoto(photoData) {
    const res = await fetch(`${API_BASE}/photos`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(photoData)
    });
    const created = await parseResponse(res, 'Failed to create photo');

    // Backup to persistent local cache
    try {
      const saved = localStorage.getItem('likith_custom_photos');
      const photos = saved ? JSON.parse(saved) : [];
      const updated = [created, ...photos.filter(p => p.id !== created.id)];
      localStorage.setItem('likith_custom_photos', JSON.stringify(updated));
    } catch {}

    return created;
  },

  async updatePhoto(id, photoData) {
    const res = await fetch(`${API_BASE}/photos/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(photoData)
    });
    const updated = await parseResponse(res, 'Failed to update photo');

    try {
      const saved = localStorage.getItem('likith_custom_photos');
      if (saved) {
        const photos = JSON.parse(saved);
        const next = photos.map(p => p.id === id ? { ...p, ...updated } : p);
        localStorage.setItem('likith_custom_photos', JSON.stringify(next));
      }
    } catch {}

    return updated;
  },

  async deletePhoto(id) {
    const res = await fetch(`${API_BASE}/photos/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const result = await parseResponse(res, 'Failed to delete photo');

    try {
      const saved = localStorage.getItem('likith_custom_photos');
      if (saved) {
        const photos = JSON.parse(saved);
        const next = photos.filter(p => p.id !== id);
        localStorage.setItem('likith_custom_photos', JSON.stringify(next));
      }
    } catch {}

    return result;
  },

  // File Upload
  async uploadSinglePhoto(file) {
    const formData = new FormData();
    formData.append('photos', file);

    const token = localStorage.getItem('likith_token');
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    });

    return parseResponse(res, 'File upload failed');
  },

  async uploadPhotos(files) {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('photos', files[i]);
    }

    const token = localStorage.getItem('likith_token');
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    });

    return parseResponse(res, 'Upload failed');
  },

  // Stories / Journal
  async getStories() {
    const res = await fetch(`${API_BASE}/stories`);
    if (!res.ok) throw new Error('Failed to load stories');
    return res.json();
  },

  async getStory(slug) {
    const res = await fetch(`${API_BASE}/stories/${slug}`);
    if (!res.ok) throw new Error('Failed to load story');
    return res.json();
  },

  async createStory(storyData) {
    const res = await fetch(`${API_BASE}/stories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(storyData)
    });
    if (!res.ok) throw new Error('Failed to create story');
    return res.json();
  },

  async updateStory(id, storyData) {
    const res = await fetch(`${API_BASE}/stories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(storyData)
    });
    if (!res.ok) throw new Error('Failed to update story');
    return res.json();
  },

  async deleteStory(id) {
    const res = await fetch(`${API_BASE}/stories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete story');
    return res.json();
  },

  // Guestbook
  async getGuestbook(all = false) {
    const res = await fetch(`${API_BASE}/guestbook?all=${all}`);
    if (!res.ok) throw new Error('Failed to load guestbook');
    return res.json();
  },

  async addGuestbookEntry(entry) {
    const res = await fetch(`${API_BASE}/guestbook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
    if (!res.ok) throw new Error('Failed to submit entry');
    return res.json();
  },

  async updateGuestbookStatus(id, status) {
    const res = await fetch(`${API_BASE}/guestbook/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },

  async updateGuestbookEntry(id, data) {
    const res = await fetch(`${API_BASE}/guestbook/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update entry');
    return res.json();
  },

  async deleteGuestbookEntry(id) {
    const res = await fetch(`${API_BASE}/guestbook/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete entry');
    return res.json();
  },

  // Contact
  async sendContactMessage(data) {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },

  async getInquiries() {
    const res = await fetch(`${API_BASE}/inquiries`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load inquiries');
    return res.json();
  },

  async updateInquiry(id, data) {
    const res = await fetch(`${API_BASE}/inquiries/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update inquiry');
    return res.json();
  },

  async deleteInquiry(id) {
    const res = await fetch(`${API_BASE}/inquiries/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete inquiry');
    return res.json();
  },

  // Authentication & Stats
  async login(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    localStorage.setItem('likith_token', data.token);
    return data;
  },

  async verifyAuth() {
    const token = localStorage.getItem('likith_token');
    if (!token) return false;
    try {
      const res = await fetch(`${API_BASE}/auth/verify`, {
        headers: getAuthHeaders()
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  logout() {
    localStorage.removeItem('likith_token');
  },

  async changeCredentials(currentPassword, newUsername, newPassword) {
    const res = await fetch(`${API_BASE}/auth/credentials`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newUsername, newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update credentials');
    return data;
  },

  async changePassword(currentPassword, newPassword) {
    const res = await fetch(`${API_BASE}/auth/password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to change password');
    return data;
  },

  async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  async resetDatabase() {
    const res = await fetch(`${API_BASE}/admin/reset`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to reset database');
    return res.json();
  }
};
