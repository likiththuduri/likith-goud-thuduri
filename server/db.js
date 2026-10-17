import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'database.json');
const UPLOADS_DIR = path.join(__dirname, '../uploads');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function getInitialData() {
  const salt = bcrypt.genSaltSync(10);
  const adminPasswordHash = bcrypt.hashSync('likith2026!', salt);

  return {
    settings: {
      fullName: 'Thuduri Likith Goud',
      brandName: 'likith.',
      tagline: 'into my captures',
      heroHeading: 'A little corner of my world.',
      introText: 'Moments, places, people, and memories — collected one frame at a time.',
      instagramUsername: 'likith_thuduri',
      instagramUrl: 'https://www.instagram.com/likith_thuduri/',
      email: 'contact@likithgoud.com',
      location: 'Hyderabad, India',
      bioHeading: 'The human experience in 35mm and ambient light.',
      aboutBio: "Hey, I'm Likith. Based in India, documenting honest moments across streets, quiet corners, faces, and natural landscapes. What started as an impulse to freeze fleeting seconds has grown into an ongoing visual diary of life as it unfolds.\n\nEvery frame here is personal. No heavy artificial lighting or excessive staging — just available light, subtle film textures, and genuine emotions. Thank you for stopping by my corner of the internet.",
      cameraPrimary: 'Sony A7 IV · 35mm f/1.4 GM · Leica M10-R',
      gearList: [
        { item: 'Sony Alpha 7 IV', category: 'Camera Body', detail: 'Primary 33MP hybrid full-frame body' },
        { item: 'FE 35mm f/1.4 GM', category: 'Lens', detail: 'Everyday street, documentary & portrait lens' },
        { item: 'FE 85mm f/1.8', category: 'Lens', detail: 'Dreamy compression & intimate portraits' },
        { item: 'Leica M10-R Rangefinder', category: 'Camera Body', detail: 'Analog feel, deliberate manual pacing' },
        { item: 'Fujifilm X100V', category: 'Everyday Carry', detail: 'Classic Chrome & Black & White film recipes' },
        { item: 'Black Mist 1/8 Filter', category: 'Filter', detail: 'Subtle halation around warm highlights' }
      ],
      socialLinks: [
        { platform: 'Instagram', handle: '@likith_thuduri', url: 'https://www.instagram.com/likith_thuduri/' },
        { platform: 'Unsplash', handle: '@likiththuduri', url: 'https://unsplash.com/' },
        { platform: 'VSCO', handle: 'likith-captures', url: 'https://vsco.co/' },
        { platform: 'X / Twitter', handle: '@likith_captures', url: 'https://x.com/' }
      ],
      theme: 'warm-white', // 'warm-white' | 'pure-white' | 'editorial-cream' | 'dark-film'
      footerText: 'Captured through the lens of Thuduri Likith Goud. All photographs and rights reserved.',
      autoApproveGuestbook: true
    },
    admin: {
      username: 'admin',
      passwordHash: adminPasswordHash,
      lastLogin: null
    },
    albums: [
      {
        id: 'album-1',
        title: 'Silent Streets & Midnight Neons',
        slug: 'silent-streets',
        description: 'Night walks through dimly lit alleys, neon reflections after downpours, and quiet solitary moments in bustling metropolises.',
        coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1400&q=80',
        category: 'Street',
        location: 'Tokyo & Mumbai',
        year: '2025 – 2026',
        featured: true,
        photoCount: 5,
        createdAt: '2026-01-15T10:00:00.000Z'
      },
      {
        id: 'album-2',
        title: 'Portraits in Ambient Light',
        slug: 'ambient-portraits',
        description: 'Unposed, quiet expressions captured solely under morning window light, golden hour, and natural surroundings.',
        coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=80',
        category: 'Portraits',
        location: 'Studio & Natural Light',
        year: '2025 – 2026',
        featured: true,
        photoCount: 4,
        createdAt: '2026-01-18T12:00:00.000Z'
      },
      {
        id: 'album-3',
        title: 'Monochrome Echoes',
        slug: 'monochrome-echoes',
        description: 'Stripping away color to uncover geometry, raw textures, deep silver gelatin tones, and shadow play.',
        coverImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1400&q=80',
        category: 'Monochrome',
        location: 'Various Locations',
        year: '2024 – 2026',
        featured: true,
        photoCount: 4,
        createdAt: '2026-01-20T14:00:00.000Z'
      },
      {
        id: 'album-4',
        title: 'Wanderlust & Horizons',
        slug: 'wanderlust-horizons',
        description: 'Expeditions through rugged Himalayan passes, mist-draped pine valleys, and tranquil mountain dawn light.',
        coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80',
        category: 'Travel',
        location: 'Ladakh & Himachal',
        year: '2025',
        featured: true,
        photoCount: 4,
        createdAt: '2026-02-01T08:30:00.000Z'
      },
      {
        id: 'album-5',
        title: 'Architectural Geometry',
        slug: 'architectural-geometry',
        description: 'The harmonious rhythm of concrete, brutalist lines, and shadows sculpted by mid-afternoon sun.',
        coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80',
        category: 'Architecture',
        location: 'Hyderabad & Delhi',
        year: '2025',
        featured: false,
        photoCount: 4,
        createdAt: '2026-02-10T09:15:00.000Z'
      },
      {
        id: 'album-6',
        title: 'Fleeting Golden Hours',
        slug: 'golden-hours',
        description: 'That gentle 20-minute window before dusk when the sky turns liquid amber and softens everything it touches.',
        coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
        category: 'Moments',
        location: 'Coastal Escapes',
        year: '2025 – 2026',
        featured: true,
        photoCount: 3,
        createdAt: '2026-02-14T18:00:00.000Z'
      }
    ],
    photos: [
      {
        id: 'photo-1',
        title: 'Midnight Rain Reflections',
        albumId: 'album-1',
        category: 'Street',
        imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
        caption: 'Standing beneath an umbrella while red tail lights melted across the wet asphalt. The street hummed in quiet solitude.',
        location: 'Shinjuku, Tokyo',
        captureDate: '2025-11-14',
        camera: 'Sony A7 IV',
        lens: 'FE 35mm f/1.4 GM',
        aperture: 'ƒ/1.4',
        shutterSpeed: '1/160s',
        iso: '800',
        focalLength: '35mm',
        filmSimulation: 'Cinestill 800T Mood',
        featured: true,
        orientation: 'portrait',
        likes: 142,
        createdAt: '2026-01-15T10:10:00.000Z'
      },
      {
        id: 'photo-2',
        title: 'The Solitary Commuter',
        albumId: 'album-1',
        category: 'Street',
        imageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80',
        caption: 'Framed between train pillars as the city rushed past in an ethereal blur. One person standing perfectly still.',
        location: 'Mumbai Central',
        captureDate: '2025-12-02',
        camera: 'Leica M10-R',
        lens: 'Summilux 50mm f/1.4',
        aperture: 'ƒ/2.0',
        shutterSpeed: '1/60s',
        iso: '1600',
        focalLength: '50mm',
        filmSimulation: 'Kodak Portra 400',
        featured: true,
        orientation: 'landscape',
        likes: 98,
        createdAt: '2026-01-15T10:20:00.000Z'
      },
      {
        id: 'photo-3',
        title: 'Neon Crossroads',
        albumId: 'album-1',
        category: 'Street',
        imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1600&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80',
        caption: 'Late night walk when the city finally lets its guard down. The vibrant signage cut clean through the damp evening mist.',
        location: 'Shibuya Crossing',
        captureDate: '2025-11-18',
        camera: 'Sony A7 IV',
        lens: 'FE 35mm f/1.4 GM',
        aperture: 'ƒ/1.8',
        shutterSpeed: '1/200s',
        iso: '640',
        focalLength: '35mm',
        filmSimulation: 'Tokyo Teal & Orange',
        featured: false,
        orientation: 'portrait',
        likes: 76,
        createdAt: '2026-01-15T10:30:00.000Z'
      },
      {
        id: 'photo-4',
        title: 'Alleyway Serenade',
        albumId: 'album-1',
        category: 'Street',
        imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1600&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=800&q=80',
        caption: 'Warm incandescent streetlights casting long cinematic silhouettes across cobblestones.',
        location: 'Old Quarter',
        captureDate: '2025-10-25',
        camera: 'Fujifilm X100V',
        lens: '23mm f/2.0',
        aperture: 'ƒ/2.0',
        shutterSpeed: '1/125s',
        iso: '1250',
        focalLength: '23mm (35mm eq.)',
        filmSimulation: 'Classic Chrome',
        featured: true,
        orientation: 'landscape',
        likes: 114,
        createdAt: '2026-01-15T10:40:00.000Z'
      },
      {
        id: 'photo-5',
        title: 'Midnight Lantern Glow',
        albumId: 'album-1',
        category: 'Street',
        imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
        caption: 'Paper lanterns gently swaying under the night breeze outside a small noodle bar.',
        location: 'Kyoto, Japan',
        captureDate: '2025-11-20',
        camera: 'Leica M10-R',
        lens: 'Summicron 35mm f/2',
        aperture: 'ƒ/2.0',
        shutterSpeed: '1/90s',
        iso: '1600',
        focalLength: '35mm',
        filmSimulation: 'Warm Amber Tone',
        featured: false,
        orientation: 'portrait',
        likes: 89,
        createdAt: '2026-01-15T10:50:00.000Z'
      },
      {
        id: 'photo-6',
        title: 'Morning Window Reverie',
        albumId: 'album-2',
        category: 'Portraits',
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        caption: 'Pure natural window light illuminating subtle details. Unscripted and candid.',
        location: 'Hyderabad Studio',
        captureDate: '2026-01-08',
        camera: 'Sony A7 IV',
        lens: 'FE 85mm f/1.8',
        aperture: 'ƒ/1.8',
        shutterSpeed: '1/400s',
        iso: '100',
        focalLength: '85mm',
        filmSimulation: 'Kodak Gold 200',
        featured: true,
        orientation: 'portrait',
        likes: 185,
        createdAt: '2026-01-18T12:10:00.000Z'
      },
      {
        id: 'photo-7',
        title: 'Quiet Contemplation',
        albumId: 'album-2',
        category: 'Portraits',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1600&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
        caption: 'The strength in quiet moments. Direct eye contact that tells a story without needing words.',
        location: 'Banjara Hills',
        captureDate: '2026-01-12',
        camera: 'Sony A7 IV',
        lens: 'FE 50mm f/1.2 GM',
        aperture: 'ƒ/1.2',
        shutterSpeed: '1/1000s',
        iso: '100',
        focalLength: '50mm',
        filmSimulation: 'Natural Muted Tone',
        featured: true,
        orientation: 'portrait',
        likes: 130,
        createdAt: '2026-01-18T12:20:00.000Z'
      },
      {
        id: 'photo-8',
        title: 'Golden Hour Silhouette',
        albumId: 'album-2',
        category: 'Portraits',
        imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        caption: 'Dappled sunlight filtering through eucalyptus trees, painting warmth across hair and shoulders.',
        location: 'Jubilee Hills',
        captureDate: '2026-01-22',
        camera: 'Sony A7 IV',
        lens: 'FE 35mm f/1.4 GM',
        aperture: 'ƒ/1.4',
        shutterSpeed: '1/1600s',
        iso: '100',
        focalLength: '35mm',
        filmSimulation: 'Portra 160 Warmth',
        featured: false,
        orientation: 'portrait',
        likes: 167,
        createdAt: '2026-01-18T12:30:00.000Z'
      },
      {
        id: 'photo-9',
        title: 'Spontaneous Laughter',
        albumId: 'album-2',
        category: 'Portraits',
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1600&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
        caption: 'Caught mid-joke between frames. Real beauty is always in the unguarded seconds.',
        location: 'Gachibowli Cafe',
        captureDate: '2026-01-30',
        camera: 'Fujifilm X100V',
        lens: '23mm f/2.0',
        aperture: 'ƒ/2.0',
        shutterSpeed: '1/320s',
        iso: '200',
        focalLength: '23mm',
        filmSimulation: 'Astia Soft',
        featured: false,
        orientation: 'portrait',
        likes: 95,
        createdAt: '2026-01-18T12:40:00.000Z'
      },
      {
        id: 'photo-10',
        title: 'The Chess Master in Shadow',
        albumId: 'album-3',
        category: 'Monochrome',
        imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1600&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
        caption: 'High contrast monochrome portrait. Light carve out intense concentration.',
        location: 'Kolkata Park',
        captureDate: '2025-09-14',
        camera: 'Leica M10-R',
        lens: 'Summicron 50mm f/2',
        aperture: 'ƒ/2.8',
        shutterSpeed: '1/500s',
        iso: '400',
        focalLength: '50mm',
        filmSimulation: 'Ilford HP5 Plus 400',
        featured: true,
        orientation: 'portrait',
        likes: 210,
        createdAt: '2026-01-20T14:10:00.000Z'
      },
      {
        id: 'photo-11',
        title: 'Geometry & Solitude',
        albumId: 'album-3',
        category: 'Monochrome',
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
        caption: 'Glass facades reflecting geometric grids. Modern architecture in stark black and white tonal gradients.',
        location: 'Cyberabad',
        captureDate: '2025-10-10',
        camera: 'Sony A7 IV',
        lens: 'FE 24-70mm f/2.8 GM',
        aperture: 'ƒ/8.0',
        shutterSpeed: '1/400s',
        iso: '100',
        focalLength: '24mm',
        filmSimulation: 'Tri-X 400 High Contrast',
        featured: true,
        orientation: 'landscape',
        likes: 122,
        createdAt: '2026-01-20T14:20:00.000Z'
      },
      {
        id: 'photo-12',
        title: 'Fog over Himalayan Ridge',
        albumId: 'album-4',
        category: 'Travel',
        imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        caption: 'Standing at 14,000 feet as clouds rolled over the mountain saddle like slow tidal waves. Freezing hands, warm heart.',
        location: 'Spiti Valley, Himachal',
        captureDate: '2025-08-19',
        camera: 'Sony A7 IV',
        lens: 'FE 24-70mm f/2.8 GM',
        aperture: 'ƒ/5.6',
        shutterSpeed: '1/800s',
        iso: '100',
        focalLength: '45mm',
        filmSimulation: 'Fuji Velvia Vivid',
        featured: true,
        orientation: 'landscape',
        likes: 245,
        createdAt: '2026-02-01T08:40:00.000Z'
      },
      {
        id: 'photo-13',
        title: 'Azure Alpine Waters',
        albumId: 'album-4',
        category: 'Travel',
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        caption: 'Still reflections on glacier-fed lake waters at first light. Complete silence except for gentle ripples.',
        location: 'Pangong Tso, Ladakh',
        captureDate: '2025-08-23',
        camera: 'Sony A7 IV',
        lens: 'FE 35mm f/1.4 GM',
        aperture: 'ƒ/4.0',
        shutterSpeed: '1/640s',
        iso: '100',
        focalLength: '35mm',
        filmSimulation: 'Ektachrome 100',
        featured: true,
        orientation: 'landscape',
        likes: 198,
        createdAt: '2026-02-01T08:50:00.000Z'
      },
      {
        id: 'photo-14',
        title: 'Spiral Staircase Ascendance',
        albumId: 'album-5',
        category: 'Architecture',
        imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
        caption: 'Looking upward through pure architectural Fibonacci curves. The play of light transforms concrete into sculpture.',
        location: 'Modern Art Center',
        captureDate: '2025-07-11',
        camera: 'Sony A7 IV',
        lens: 'FE 16-35mm f/2.8 GM',
        aperture: 'ƒ/6.3',
        shutterSpeed: '1/250s',
        iso: '200',
        focalLength: '18mm',
        filmSimulation: 'Warm Minimal Monochrome',
        featured: false,
        orientation: 'portrait',
        likes: 147,
        createdAt: '2026-02-10T09:20:00.000Z'
      },
      {
        id: 'photo-15',
        title: 'Amber Dusk over the Coast',
        albumId: 'album-6',
        category: 'Moments',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        caption: 'The sun sinking below the horizon, turning the ocean surface into a molten mirror of copper and gold.',
        location: 'Goa Coastline',
        captureDate: '2026-01-02',
        camera: 'Sony A7 IV',
        lens: 'FE 35mm f/1.4 GM',
        aperture: 'ƒ/2.8',
        shutterSpeed: '1/1000s',
        iso: '100',
        focalLength: '35mm',
        filmSimulation: 'Warm Sunset Glow',
        featured: true,
        orientation: 'landscape',
        likes: 278,
        createdAt: '2026-02-14T18:10:00.000Z'
      }
    ],
    stories: [
      {
        id: 'story-1',
        title: 'Chasing the Blue Hour in Old Quarters',
        slug: 'chasing-blue-hour',
        excerpt: 'How waking up before sunrise taught me to look for light where everyone else sees empty streets.',
        content: `Photography is less about the camera you hold and more about how patient you are with the light. 

During my winter trip through the older lanes of the city, I gave myself a single rule: don't take the camera out until the city is half-awake and the street lamps begin fighting the morning dawn.

The result was a collection of quiet frames that felt intimate and suspended in time. The smell of fresh filter coffee, the faint hum of temple bells in the distance, and the soft blue mist creeping between heritage buildings. Every frame from that morning carries a memory I can still vividly recall.`,
        coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1400&q=80',
        date: 'February 2026',
        readTime: '3 min read',
        location: 'Old Quarters',
        likes: 86
      },
      {
        id: 'story-2',
        title: 'The Art of the 35mm Focal Length',
        slug: 'art-of-35mm',
        excerpt: 'Why one single lens has remained glued to my camera body for over three years.',
        content: `If I had to document the rest of my life with just one lens, it would unquestionably be a fast 35mm.

A 50mm feels like a thoughtful conversation. An 85mm feels like admiring someone from across the room. But a 35mm? A 35mm puts you right in the center of the scene. It forces you to take two steps forward, to engage with your subject, and to include the environment that gives context to the moment.

It is wide enough to capture architecture and landscape, yet fast and close enough to shoot intimate environmental portraits with beautiful separation. Here are some of my favorite frames shot entirely on this focal length.`,
        coverImage: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1400&q=80',
        date: 'January 2026',
        readTime: '4 min read',
        location: 'Everywhere',
        likes: 112
      }
    ],
    guestbook: [
      {
        id: 'gb-1',
        name: 'Aarav Sharma',
        instagram: 'aarav_captures',
        message: 'Discovered your site from your Instagram bio. The color grading on the Tokyo rain series is absolute perfection! Keep inspiring brother.',
        emoji: '✨',
        status: 'approved',
        createdAt: '2026-02-16T14:30:00.000Z'
      },
      {
        id: 'gb-2',
        name: 'Elena Rostova',
        instagram: 'elena_lens',
        message: 'Such an elegant, serene website. Feels like holding a physical art magazine. The portrait in window light took my breath away!',
        emoji: '🤍',
        status: 'approved',
        createdAt: '2026-02-15T09:15:00.000Z'
      },
      {
        id: 'gb-3',
        name: 'Rohan Varma',
        instagram: 'rohan.v.photo',
        message: 'Fellow Hyderabad photographer here! Love the minimal aesthetic and how clean every frame is presented. Great work Likith.',
        emoji: '📸',
        status: 'approved',
        createdAt: '2026-02-14T20:45:00.000Z'
      }
    ],
    inquiries: [
      {
        id: 'inq-1',
        name: 'Priya Mehta',
        email: 'priya@mehta-studio.com',
        subject: 'Portrait & Editorial Collaboration',
        message: 'Hi Likith, I love your ambient light portrait series. We are working on a fashion editorial in Hyderabad next month and would love to collaborate!',
        status: 'unread',
        createdAt: '2026-02-16T11:00:00.000Z'
      }
    ]
  };
}

class Database {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(fileContent);
      } else {
        this.data = getInitialData();
        this.save();
      }
    } catch (err) {
      console.error('Error loading database, resetting to initial data:', err);
      this.data = getInitialData();
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
      return true;
    } catch (err) {
      console.error('Failed to save database:', err);
      return false;
    }
  }

  // Settings
  getSettings() {
    return this.data.settings;
  }

  updateSettings(newSettings) {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.save();
    return this.data.settings;
  }

  // Admin
  getAdmin() {
    return this.data.admin;
  }

  updateAdminPassword(newHash) {
    this.data.admin.passwordHash = newHash;
    this.save();
  }

  updateAdminCredentials(newUsername, newHash) {
    if (newUsername) {
      this.data.admin.username = newUsername.trim();
    }
    if (newHash) {
      this.data.admin.passwordHash = newHash;
    }
    this.save();
    return { username: this.data.admin.username };
  }

  updateAdminLoginTime() {
    this.data.admin.lastLogin = new Date().toISOString();
    this.save();
  }

  // Albums
  getAlbums() {
    // dynamically sync photo counts
    const albums = this.data.albums.map(album => {
      const count = this.data.photos.filter(p => p.albumId === album.id || p.albumId === album.slug).length;
      return { ...album, photoCount: count };
    });
    return albums;
  }

  getAlbumBySlugOrId(slugOrId) {
    const album = this.data.albums.find(a => a.id === slugOrId || a.slug === slugOrId);
    if (!album) return null;
    const count = this.data.photos.filter(p => p.albumId === album.id || p.albumId === album.slug).length;
    return { ...album, photoCount: count };
  }

  createAlbum(albumData) {
    this.data.albums.unshift(albumData);
    this.save();
    return albumData;
  }

  updateAlbum(id, albumData) {
    const index = this.data.albums.findIndex(a => a.id === id);
    if (index === -1) return null;
    this.data.albums[index] = { ...this.data.albums[index], ...albumData };
    this.save();
    return this.data.albums[index];
  }

  deleteAlbum(id) {
    const index = this.data.albums.findIndex(a => a.id === id);
    if (index === -1) return false;
    this.data.albums.splice(index, 1);
    this.save();
    return true;
  }

  // Photos
  getPhotos(filters = {}) {
    let list = [...this.data.photos];
    if (filters.albumId) {
      list = list.filter(p => p.albumId === filters.albumId || p.albumSlug === filters.albumId);
    }
    if (filters.category && filters.category !== 'all') {
      list = list.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.featured === 'true' || filters.featured === true) {
      list = list.filter(p => p.featured === true);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(p => 
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.caption && p.caption.toLowerCase().includes(q)) ||
        (p.location && p.location.toLowerCase().includes(q)) ||
        (p.camera && p.camera.toLowerCase().includes(q))
      );
    }
    return list;
  }

  getPhotoById(id) {
    return this.data.photos.find(p => p.id === id) || null;
  }

  createPhoto(photoData) {
    this.data.photos.unshift(photoData);
    this.save();
    return photoData;
  }

  updatePhoto(id, photoData) {
    const index = this.data.photos.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.data.photos[index] = { ...this.data.photos[index], ...photoData };
    this.save();
    return this.data.photos[index];
  }

  deletePhoto(id) {
    const index = this.data.photos.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.data.photos.splice(index, 1);
    this.save();
    return true;
  }

  likePhoto(id) {
    const photo = this.data.photos.find(p => p.id === id);
    if (!photo) return null;
    photo.likes = (photo.likes || 0) + 1;
    this.save();
    return photo.likes;
  }

  // Stories
  getStories() {
    return this.data.stories || [];
  }

  getStoryBySlug(slug) {
    return (this.data.stories || []).find(s => s.slug === slug || s.id === slug) || null;
  }

  createStory(storyData) {
    if (!this.data.stories) this.data.stories = [];
    this.data.stories.unshift(storyData);
    this.save();
    return storyData;
  }

  updateStory(id, storyData) {
    if (!this.data.stories) return null;
    const index = this.data.stories.findIndex(s => s.id === id);
    if (index === -1) return null;
    this.data.stories[index] = { ...this.data.stories[index], ...storyData };
    this.save();
    return this.data.stories[index];
  }

  deleteStory(id) {
    if (!this.data.stories) return false;
    const index = this.data.stories.findIndex(s => s.id === id);
    if (index === -1) return false;
    this.data.stories.splice(index, 1);
    this.save();
    return true;
  }

  // Guestbook
  getGuestbook(includePending = false) {
    let list = this.data.guestbook || [];
    if (!includePending) {
      list = list.filter(item => item.status === 'approved');
    }
    return list;
  }

  addGuestbookEntry(entry) {
    if (!this.data.guestbook) this.data.guestbook = [];
    this.data.guestbook.unshift(entry);
    this.save();
    return entry;
  }

  updateGuestbookStatus(id, status) {
    const entry = (this.data.guestbook || []).find(g => g.id === id);
    if (!entry) return null;
    entry.status = status;
    this.save();
    return entry;
  }

  updateGuestbookEntry(id, entryData) {
    if (!this.data.guestbook) return null;
    const index = this.data.guestbook.findIndex(g => g.id === id);
    if (index === -1) return null;
    this.data.guestbook[index] = { ...this.data.guestbook[index], ...entryData };
    this.save();
    return this.data.guestbook[index];
  }

  deleteGuestbookEntry(id) {
    if (!this.data.guestbook) return false;
    const index = this.data.guestbook.findIndex(g => g.id === id);
    if (index === -1) return false;
    this.data.guestbook.splice(index, 1);
    this.save();
    return true;
  }

  // Inquiries
  getInquiries() {
    return this.data.inquiries || [];
  }

  addInquiry(inq) {
    if (!this.data.inquiries) this.data.inquiries = [];
    this.data.inquiries.unshift(inq);
    this.save();
    return inq;
  }

  updateInquiry(id, inqData) {
    if (!this.data.inquiries) return null;
    const index = this.data.inquiries.findIndex(i => i.id === id);
    if (index === -1) return null;
    this.data.inquiries[index] = { ...this.data.inquiries[index], ...inqData };
    this.save();
    return this.data.inquiries[index];
  }

  deleteInquiry(id) {
    if (!this.data.inquiries) return false;
    const index = this.data.inquiries.findIndex(i => i.id === id);
    if (index === -1) return false;
    this.data.inquiries.splice(index, 1);
    this.save();
    return true;
  }

  // Stats
  getStats() {
    const totalPhotos = this.data.photos.length;
    const totalAlbums = this.data.albums.length;
    const totalLikes = this.data.photos.reduce((sum, p) => sum + (p.likes || 0), 0);
    const totalGuestbook = (this.data.guestbook || []).length;
    const totalInquiries = (this.data.inquiries || []).length;

    return {
      totalPhotos,
      totalAlbums,
      totalLikes,
      totalGuestbook,
      totalInquiries,
      lastLogin: this.data.admin.lastLogin
    };
  }

  // Reset to initial seed data
  resetDatabase() {
    this.data = getInitialData();
    this.save();
    return true;
  }
}

export const db = new Database();
