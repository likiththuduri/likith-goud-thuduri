import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db.js';
import { signToken, requireAuth } from './auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads folder
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Multer storage for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${Date.now()}-${cleanName}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif|avif/;
    const ext = path.extname(file.originalname).toLowerCase().slice(1);
    const mime = file.mimetype.toLowerCase();
    if (allowedTypes.test(ext) || allowedTypes.test(mime)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP, GIF, AVIF) are permitted'));
    }
  }
});

// ==========================================
// 1. SETTINGS & BRANDING ENDPOINTS
// ==========================================

// Public: Get site branding & settings
app.get('/api/settings', (req, res) => {
  try {
    const settings = db.getSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve settings' });
  }
});

// Admin: Update site branding & settings
app.put('/api/settings', requireAuth, (req, res) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json({ message: 'Settings saved successfully', settings: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// ==========================================
// 2. ALBUMS ENDPOINTS
// ==========================================

// Public: Get all albums
app.get('/api/albums', (req, res) => {
  try {
    const albums = db.getAlbums();
    res.json(albums);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch albums' });
  }
});

// Public: Get single album by slug or id
app.get('/api/albums/:slugOrId', (req, res) => {
  try {
    const album = db.getAlbumBySlugOrId(req.params.slugOrId);
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }
    // Also include photos belonging to this album
    const photos = db.getPhotos({ albumId: album.id });
    res.json({ ...album, photos });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch album details' });
  }
});

// Admin: Create new album
app.post('/api/albums', requireAuth, (req, res) => {
  try {
    const { title, slug, description, coverImage, category, location, year, featured } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Album title is required' });
    }

    const newAlbum = {
      id: `album-${uuidv4().slice(0, 8)}`,
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: description || '',
      coverImage: coverImage || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      category: category || 'General',
      location: location || '',
      year: year || new Date().getFullYear().toString(),
      featured: Boolean(featured),
      photoCount: 0,
      createdAt: new Date().toISOString()
    };

    const created = db.createAlbum(newAlbum);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create album' });
  }
});

// Admin: Update album
app.put('/api/albums/:id', requireAuth, (req, res) => {
  try {
    const updated = db.updateAlbum(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Album not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update album' });
  }
});

// Admin: Delete album
app.delete('/api/albums/:id', requireAuth, (req, res) => {
  try {
    const success = db.deleteAlbum(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Album not found' });
    }
    res.json({ message: 'Album deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete album' });
  }
});

// ==========================================
// 3. PHOTOS ENDPOINTS
// ==========================================

// Public: Get photos with optional query filters
app.get('/api/photos', (req, res) => {
  try {
    const { albumId, category, featured, search } = req.query;
    const photos = db.getPhotos({ albumId, category, featured, search });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch photos' });
  }
});

// Public: Get photo by id
app.get('/api/photos/:id', (req, res) => {
  try {
    const photo = db.getPhotoById(req.params.id);
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    res.json(photo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch photo' });
  }
});

// Public: Like a photo
app.post('/api/photos/:id/like', (req, res) => {
  try {
    const likes = db.likePhoto(req.params.id);
    if (likes === null) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    res.json({ success: true, likes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record like' });
  }
});

// Admin: Add new photo
app.post('/api/photos', requireAuth, (req, res) => {
  try {
    const {
      title,
      albumId,
      category,
      imageUrl,
      thumbnailUrl,
      caption,
      location,
      captureDate,
      camera,
      lens,
      aperture,
      shutterSpeed,
      iso,
      focalLength,
      filmSimulation,
      featured,
      orientation
    } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const newPhoto = {
      id: `photo-${uuidv4().slice(0, 8)}`,
      title: title || 'Untitled Frame',
      albumId: albumId || '',
      category: category || 'General',
      imageUrl,
      thumbnailUrl: thumbnailUrl || imageUrl,
      caption: caption || '',
      location: location || '',
      captureDate: captureDate || new Date().toISOString().split('T')[0],
      camera: camera || 'Sony A7 IV',
      lens: lens || 'FE 35mm f/1.4 GM',
      aperture: aperture || 'ƒ/1.4',
      shutterSpeed: shutterSpeed || '1/250s',
      iso: iso || '100',
      focalLength: focalLength || '35mm',
      filmSimulation: filmSimulation || '',
      featured: Boolean(featured),
      orientation: orientation || 'portrait',
      likes: 0,
      createdAt: new Date().toISOString()
    };

    const created = db.createPhoto(newPhoto);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create photo' });
  }
});

// Admin: Update photo
app.put('/api/photos/:id', requireAuth, (req, res) => {
  try {
    const updated = db.updatePhoto(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update photo' });
  }
});

// Admin: Delete photo
app.delete('/api/photos/:id', requireAuth, (req, res) => {
  try {
    const success = db.deletePhoto(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    res.json({ message: 'Photo removed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete photo' });
  }
});

// ==========================================
// 4. IMAGE UPLOAD HANDLER
// ==========================================

app.post('/api/upload', requireAuth, upload.array('photos', 20), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files were uploaded' });
    }

    const host = req.get('host');
    const protocol = req.protocol;

    const uploadedFiles = req.files.map(file => {
      const fileUrl = `/uploads/${file.filename}`;
      return {
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        url: fileUrl,
        fullUrl: `${protocol}://${host}${fileUrl}`
      };
    });

    res.json({
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
      files: uploadedFiles
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'File upload failed' });
  }
});

// ==========================================
// 5. STORIES / JOURNAL
// ==========================================

app.get('/api/stories', (req, res) => {
  try {
    res.json(db.getStories());
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

app.get('/api/stories/:slug', (req, res) => {
  try {
    const story = db.getStoryBySlug(req.params.slug);
    if (!story) return res.status(404).json({ error: 'Story not found' });
    res.json(story);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch story' });
  }
});

app.post('/api/stories', requireAuth, (req, res) => {
  try {
    const { title, slug, excerpt, content, coverImage, location, readTime } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    const newStory = {
      id: `story-${uuidv4().slice(0, 8)}`,
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      excerpt: excerpt || content.slice(0, 150) + '...',
      content,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      readTime: readTime || '3 min read',
      location: location || '',
      likes: 0
    };
    const created = db.createStory(newStory);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create story' });
  }
});

app.put('/api/stories/:id', requireAuth, (req, res) => {
  try {
    const updated = db.updateStory(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Story not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update story' });
  }
});

app.delete('/api/stories/:id', requireAuth, (req, res) => {
  try {
    const success = db.deleteStory(req.params.id);
    if (!success) return res.status(404).json({ error: 'Story not found' });
    res.json({ message: 'Story deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete story' });
  }
});

// ==========================================
// 6. GUESTBOOK & INQUIRIES
// ==========================================

// Public: Get approved guestbook entries
app.get('/api/guestbook', (req, res) => {
  try {
    const includeAll = req.query.all === 'true';
    const entries = db.getGuestbook(includeAll);
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch guestbook' });
  }
});

// Public: Leave a note in guestbook
app.post('/api/guestbook', (req, res) => {
  try {
    const { name, instagram, message, emoji } = req.body;
    if (!name || !message) {
      return res.status(400).json({ error: 'Name and message are required' });
    }

    const settings = db.getSettings();
    const status = settings.autoApproveGuestbook ? 'approved' : 'pending';

    const newEntry = {
      id: `gb-${uuidv4().slice(0, 8)}`,
      name: name.trim(),
      instagram: (instagram || '').replace(/^@/, '').trim(),
      message: message.trim(),
      emoji: emoji || '✨',
      status,
      createdAt: new Date().toISOString()
    };

    const saved = db.addGuestbookEntry(newEntry);
    res.status(201).json({
      message: status === 'approved' ? 'Thank you! Your note is published.' : 'Thank you! Your note is submitted for approval.',
      entry: saved
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit guestbook entry' });
  }
});

// Admin: Moderate guestbook status
app.put('/api/guestbook/:id/status', requireAuth, (req, res) => {
  try {
    const { status } = req.body;
    const updated = db.updateGuestbookStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ error: 'Entry not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Admin: Edit full guestbook entry
app.put('/api/guestbook/:id', requireAuth, (req, res) => {
  try {
    const updated = db.updateGuestbookEntry(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Entry not found' });
    res.json({ message: 'Guestbook entry updated', entry: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to edit guestbook entry' });
  }
});

// Admin: Delete guestbook entry
app.delete('/api/guestbook/:id', requireAuth, (req, res) => {
  try {
    const success = db.deleteGuestbookEntry(req.params.id);
    if (!success) return res.status(404).json({ error: 'Entry not found' });
    res.json({ message: 'Guestbook entry deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete entry' });
  }
});

// Public: Contact & Collaboration Form
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const newInquiry = {
      id: `inq-${uuidv4().slice(0, 8)}`,
      name: name.trim(),
      email: email.trim(),
      subject: subject || 'General Inquiry',
      message: message.trim(),
      status: 'unread',
      createdAt: new Date().toISOString()
    };

    const saved = db.addInquiry(newInquiry);
    res.status(201).json({ message: 'Thank you for reaching out! Likith will get back to you soon.', inquiry: saved });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Admin: Get inquiries
app.get('/api/inquiries', requireAuth, (req, res) => {
  try {
    res.json(db.getInquiries());
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

// Admin: Update inquiry status
app.put('/api/inquiries/:id', requireAuth, (req, res) => {
  try {
    const updated = db.updateInquiry(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Inquiry not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update inquiry' });
  }
});

// Admin: Delete inquiry
app.delete('/api/inquiries/:id', requireAuth, (req, res) => {
  try {
    const success = db.deleteInquiry(req.params.id);
    if (!success) return res.status(404).json({ error: 'Inquiry not found' });
    res.json({ message: 'Inquiry removed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete inquiry' });
  }
});

// ==========================================
// 7. AUTH & DASHBOARD METRICS
// ==========================================

// Admin Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = db.getAdmin();

    if (username !== admin.username) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isMatch = bcrypt.compareSync(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    db.updateAdminLoginTime();
    const token = signToken({ username: admin.username });

    res.json({
      message: 'Login successful',
      token,
      username: admin.username
    });
  } catch (err) {
    res.status(500).json({ error: 'Login authentication failed' });
  }
});

// Verify token
app.get('/api/auth/verify', requireAuth, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// Change Credentials (Username AND/OR Password)
app.put('/api/auth/credentials', requireAuth, (req, res) => {
  try {
    const { currentPassword, newUsername, newPassword } = req.body;
    const admin = db.getAdmin();

    const isMatch = bcrypt.compareSync(currentPassword, admin.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect current password' });
    }

    let newHash = null;
    if (newPassword && newPassword.trim()) {
      if (newPassword.trim().length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters long' });
      }
      const salt = bcrypt.genSaltSync(10);
      newHash = bcrypt.hashSync(newPassword.trim(), salt);
    }

    const updated = db.updateAdminCredentials(newUsername, newHash);
    res.json({
      message: 'Credentials updated successfully',
      username: updated.username
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update credentials' });
  }
});

// Change Password (legacy/direct support)
app.put('/api/auth/password', requireAuth, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = db.getAdmin();

    const isMatch = bcrypt.compareSync(currentPassword, admin.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect current password' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    const salt = bcrypt.genSaltSync(10);
    const newHash = bcrypt.hashSync(newPassword, salt);
    db.updateAdminPassword(newHash);

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Admin Stats
app.get('/api/admin/stats', requireAuth, (req, res) => {
  try {
    res.json(db.getStats());
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Reset Database to Initial Seed
app.post('/api/admin/reset', requireAuth, (req, res) => {
  try {
    db.resetDatabase();
    res.json({ message: 'Database reset to default photography portfolio' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset database' });
  }
});

// Serve static production build if available
const distDir = path.join(__dirname, '../dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      return res.sendFile(path.join(distDir, 'index.html'));
    }
    next();
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`[Likith Captures Server] Running on http://localhost:${PORT}`);
});
