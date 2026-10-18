# LIKITH. — INTO MY CAPTURES
> **Production-Ready Personal Photography Journal & Memories Platform for Instagram Bio**

A minimal, warm editorial photography diary and memories website handcrafted for **Thuduri Likith Goud** (`@likith_thuduri`).

Designed to serve as the centerpiece of an Instagram bio, featuring zero-code customization, full-stack persistence, cloud & local image uploading, EXIF metadata inspection, interactive guestbook, curated albums, and an administrator dashboard.

---

## 🌟 Key Highlights

1. **Editorial White & Warm Aesthetic**
   - High-fashion magazine typography pairing: **Playfair Display & Cormorant Garamond** (serif display headings) with **Plus Jakarta Sans** (crisp modern body).
   - Warm off-white palettes (`#FAF9F6`, `#F5F3EF`), stone gray borders, and charcoal typography.
   - Preserved aspect ratios, subtle hover elevation, frosted glass sticky header, and smooth transitions.

2. **100% Zero-Code Brand Customization**
   - Modify every single field from the **Admin Studio** without touching code:
     - Full Name: `Thuduri Likith Goud`
     - Website Brand: `likith.`
     - Main Tagline: `into my captures`
     - Hero Heading: `A little corner of my world.`
     - Introductory Bio: `Moments, places, people, and memories — collected one frame at a time.`
     - Instagram Handle: `likith_thuduri`
     - Instagram Link: `https://www.instagram.com/likith_thuduri/`
     - Location, Email, Camera Bag Gear, and Footer Text.

3. **Curated Albums**
   - Personal collections and albums.
   - Dedicated album view with album cover banner, narrative description, location, shoot gear, and photo stream.

4. **Editorial Lightbox Inspector**
   - High-resolution modal viewer with keyboard arrow navigation (`←`, `→`, `Esc`).
   - Technical EXIF specs card (Camera, Prime Lens, Aperture, Shutter Speed, ISO, Focal Length, Film Stock).
   - Real-time like counter with optimistic UI updates and persistent database counts.
   - Social sharing (copy direct link, open Instagram bio prompt, download original).

5. **Interactive Memory Wall & Guestbook**
   - Visitors from Instagram bio can leave a warm note, stamp an emoji, and connect their own Instagram handle.
   - Automatic or moderated approval with live confetti celebration.

6. **Admin Studio CMS (`/admin`)**
   - Secured with bcrypt password hashing and JWT authentication.
   - Overview metrics: Total photos, albums, likes, guestbook submissions, unread inquiries.
   - Drag-and-drop multi-file photo uploader (saving directly to `/uploads/` with static serving) or cloud image URLs.
   - Album manager: Create, edit, delete, set cover image.
   - Photo manager: Edit camera specs, assign albums, toggle featured status.
   - Change admin credentials or restore default curated seed dataset at any time.

---

## 🚀 Quick Start Guide

### 1. Run the Full Application
```bash
# Navigate to the project directory
cd likith-captures

# Start both backend server and Vite frontend (Development)
npm run dev
```

Alternatively, to run the standalone production server:
```bash
# 1. Build the frontend
npm run build

# 2. Start the unified production server (serves frontend + API on port 5000)
npm run server
```

The application will be accessible at:
- **Public Website:** `http://localhost:5000` (or `http://localhost:3000` in Vite dev mode)
- **Admin Studio:** Click the key/lock icon in the header or visit `http://localhost:5000/?admin=true`

---

## 🔐 Administrator Access

- **Username:** `admin`
- **Default Password:** `likith2026!`
- *(You can change this password anytime under **Studio Settings**)*

---

## 📁 Project Architecture

```
likith-captures/
├── server/
│   ├── index.js          # Express server with RESTful API, multer uploads & static serving
│   ├── db.js             # Robust JSON database engine with auto-persistence & seed data
│   ├── auth.js           # JWT authentication middleware and bcrypt helper
│   └── uploads/          # Local directory storing uploaded photo files
├── data/
│   └── database.json     # Auto-persisted database file (zero external binary dependencies)
├── src/
│   ├── main.jsx          # React 19 entry point
│   ├── index.css         # Tailwind CSS & editorial styling
│   ├── api.js            # Frontend API client with JWT token handling
│   ├── components/
│   │   ├── Navbar.jsx            # Sticky header with Instagram CTA and admin lock
│   │   ├── Hero.jsx              # Editorial masthead, branding chip, and category filters
│   │   ├── AlbumGrid.jsx         # Clickable magazine-style album cards
│   │   ├── AlbumDetail.jsx       # Dedicated album landing page
│   │   ├── PhotoGrid.jsx         # Responsive masonry stream with quick likes
│   │   ├── LightboxModal.jsx     # Full-screen inspector with EXIF card & sharing
│   │   ├── StoriesSection.jsx    # Photo essays and behind-the-lens journal
│   │   ├── GuestbookSection.jsx  # Visitor memory wall & sign form
│   │   ├── AboutSection.jsx      # Biography, camera bag gear, and direct contact
│   │   ├── ContactSection.jsx    # Collaboration inquiry form
│   │   ├── InstagramIcon.jsx     # Crisp inline SVG Instagram icon
│   │   └── Footer.jsx            # Editorial signature and copyright
│   └── admin/
│       ├── AdminLayout.jsx       # Studio CMS sidebar shell
│       ├── AdminLogin.jsx        # Login modal with auto-fill demo button
│       ├── AdminOverview.jsx     # Analytics metric cards & recent activity
│       ├── AdminBranding.jsx     # Real-time zero-code brand & bio customizer
│       ├── AdminAlbums.jsx       # Album CRUD & cover photo selector
│       ├── AdminPhotos.jsx       # Multi-photo uploader & EXIF metadata editor
│       ├── AdminStories.jsx      # Photo essay publisher
│       ├── AdminGuestbook.jsx    # Memory wall moderation & inquiry viewer
│       └── AdminSettings.jsx     # Security, password change, and portfolio reset
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🌐 Deploying to the Web

### Free 1-Click Hosting (Render / Railway / Render)
1. Push this directory to your GitHub account (`git init`, `git add .`, `git commit -m "Initial commit"`).
2. Connect the repository to [Render](https://render.com) or [Railway](https://railway.app).
3. Set Build Command: `npm install && npm run build`
4. Set Start Command: `node server/index.js`
5. Add environment variable `PORT=5000` (or leave default).

Your personal photo diary is live and ready to paste into your Instagram bio!
