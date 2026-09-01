import { ProjectPoster } from '../types';

export const ABOUT_STORY = {
  headline: 'THE INVISIBLE ART OF SEAMLESS VISUAL EFFECTS',
  subheading: 'Powering global studios, streaming platforms, and commercial agencies with ultra-precision Roto, Digital Paint, Wire Removal, and Pipeline Dispatch.',
  storyParagraph1:
    'Roto Paint Wala was founded under the Black Fxtudio collective to solve the most critical bottleneck in modern VFX pipelines: high-volume, pixel-perfect prep work that requires surgical precision, zero turnaround friction, and absolute data security.',
  storyParagraph2:
    'From major studio feature films to streaming series and global commercials, our dedicated collective of roto artists, clean-up specialists, and pipeline engineers operate seamlessly 24/7 across global time zones.',
  mission: 'To deliver flawless alphas and pristine clean plates so lead comp supervisors never have to worry about edges, grain consistency, or delivery deadlines.',
};

export const PROJECT_POSTERS: ProjectPoster[] = [
  {
    id: 'poster-01',
    title: 'NEBULA: PROTOCOL ZERO',
    year: '2025',
    category: 'Sci-Fi Action Feature',
    studioClient: 'Major Streaming Flagship',
    services: ['Sub-Pixel Hair Roto', 'Motion Blur Mattes', '3D Camera Tracker Cleanup'],
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop',
    badge: 'FEATURE FILM',
    highlight: '1,420 Frames Delivered Overnight',
  },
  {
    id: 'poster-02',
    title: 'THE LAST HORIZON',
    year: '2024',
    category: 'Post-Apocalyptic Thriller',
    studioClient: 'Studio Theatrical Release',
    services: ['Complex Stunt Wire Removal', 'Clean Plate Projection', 'Drone Rig Erase'],
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    badge: 'THEATRICAL',
    highlight: '6K RED RAW Multi-Pass Prep',
  },
  {
    id: 'poster-03',
    title: 'SHADOW REALM',
    year: '2024',
    category: 'Dark Fantasy Series',
    studioClient: 'Global OTT Network',
    services: ['Cape & Armor Rotoscopy', 'Volumetric Smoke Extraction', 'Marker Erase'],
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    badge: 'OTT SERIES',
    highlight: '100% First-Pass QC Pass',
  },
  {
    id: 'poster-04',
    title: 'SPEED VELOCITY 9',
    year: '2024',
    category: 'High-Octane Action',
    studioClient: 'International Co-Production',
    services: ['Vehicle Rig & Camera Erase', 'Windshield Reflection Paint', 'Speed Roto'],
    posterUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800&auto=format&fit=crop',
    badge: 'BLOCKBUSTER',
    highlight: 'High-Motion Track & Splines',
  },
  {
    id: 'poster-05',
    title: 'CHRONO DRIFT',
    year: '2023',
    category: 'Cyberpunk Drama',
    studioClient: 'Studio Pilot Production',
    services: ['Digital De-Aging', 'Skin Texture Prep', 'Anamorphic Flare Paint'],
    posterUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
    badge: 'BEAUTY & DE-AGE',
    highlight: 'Organic Skin Frequency Retouch',
  },
  {
    id: 'poster-06',
    title: 'VALKYRIE DAWN',
    year: '2023',
    category: 'Historical Warfare Epic',
    studioClient: 'European Film Fund',
    services: ['Crowd Duplication Roto', 'Weapon Cleanups', 'Blood Rig Extraction'],
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    badge: 'EPIC CINEMA',
    highlight: 'Multi-Character Silhouette FX',
  },
  {
    id: 'poster-07',
    title: 'ECHOES OF THE DEEP',
    year: '2023',
    category: 'Sci-Fi Underwater VFX',
    studioClient: 'Major Hollywood Studio',
    services: ['Water & Bubble Separation', 'Stereo 3D Clean Plates', 'Deep Comp Prep'],
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    badge: 'STEREO 3D',
    highlight: 'Native Left/Right Eye Match',
  },
  {
    id: 'poster-08',
    title: 'APEX RACING: WORLD TOUR',
    year: '2025',
    category: 'Super Bowl Commercial',
    studioClient: 'Global Creative Agency',
    services: ['4K Commercial Clean Prep', 'Logo Replacement Paint', 'Refraction Roto'],
    posterUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
    badge: 'COMMERCIAL',
    highlight: '6-Hour Turnaround Dispatch',
  },
];

export const QC_PILLARS = [
  {
    code: 'QC-01',
    title: 'Sub-Pixel Alpha Integrity',
    desc: 'Inspected under RGB luminance ramps and checkered plates to ensure zero edge chatter or fringing.',
  },
  {
    code: 'QC-02',
    title: 'Color Space & ACES Fidelity',
    desc: 'Guaranteed linearity across ACEScg, Arri LogC4, REDWideGamut, and DCI-P3 without gamma shifting.',
  },
  {
    code: 'QC-03',
    title: 'Grain & Noise Synthesis',
    desc: 'Clean plates include matched organic sensor grain so composites blend without seam lines.',
  },
  {
    code: 'QC-04',
    title: 'TPN Security & Strict NDA',
    desc: 'Encrypted cloud workstations, watermark tracking, and strict MPAA/TPN compliance standards.',
  },
];

export const GLOBAL_HUBS = [
  { city: 'Mumbai, India', type: 'Primary Production Core', capacity: '120+ Active Artists', status: '24/7 LIVE' },
  { city: 'Vancouver, Canada', type: 'North America Dispatch', capacity: 'Client Direct Hub', status: 'ONLINE' },
  { city: 'London, UK', type: 'European Timezone Relay', capacity: 'Quality Inspection Lead', status: 'ONLINE' },
  { city: 'Seoul, South Korea', type: 'APAC High-Res Engine', capacity: 'Stereo 3D & 8K Core', status: 'ONLINE' },
];

