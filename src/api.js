const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('likith_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const api = {
  // Settings & Branding
  async getSettings() {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to load settings');
    return res.json();
  },

  async updateSettings(settings) {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update settings');
    }
    return res.json();
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
    const res = await fetch(`${API_BASE}/photos${query}`);
    if (!res.ok) throw new Error('Failed to load photos');
    return res.json();
  },

  async getPhoto(id) {
    const res = await fetch(`${API_BASE}/photos/${id}`);
    if (!res.ok) throw new Error('Failed to load photo');
    return res.json();
  },

  async likePhoto(id) {
    const res = await fetch(`${API_BASE}/photos/${id}/like`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to like photo');
    return res.json();
  },

  async createPhoto(photoData) {
    const res = await fetch(`${API_BASE}/photos`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(photoData)
    });
    if (!res.ok) throw new Error('Failed to create photo');
    return res.json();
  },

  async updatePhoto(id, photoData) {
    const res = await fetch(`${API_BASE}/photos/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(photoData)
    });
    if (!res.ok) throw new Error('Failed to update photo');
    return res.json();
  },

  async deletePhoto(id) {
    const res = await fetch(`${API_BASE}/photos/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete photo');
    return res.json();
  },

  // File Upload
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

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Upload failed');
    }
    return res.json();
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
