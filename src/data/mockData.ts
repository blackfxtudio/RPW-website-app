import { PartnerStudio, WorkShot, ServiceItem, ProductionLiveShot, FAQItem } from '../types';

export const DEFAULT_PARTNERS: PartnerStudio[] = [
  {
    "studioName": "Leoceo VFX",
    "email": "tom@blackfx.net",
    "website": "https://leoceovfx.com",
    "logo": "/uploads/img_partners_0_logo_1788364494155.png",
    "region": "Global Network",
    "speciality": "VFX Support & Rotoscopy",
    "artistCount": 30,
    "status": "ACTIVE"
  },
  {
    "studioName": "Cinerva VFX Private Limited",
    "email": "tom@blackfx.net",
    "website": "https://cinervavfx.com",
    "logo": "/uploads/img_partners_1_logo_1788364494169.webp",
    "region": "Global Network",
    "speciality": "VFX Support & Rotoscopy",
    "artistCount": 45,
    "status": "ACTIVE"
  },
  {
    "studioName": "Vision Peak VFX",
    "email": "tom@blackfx.net",
    "website": "https://visionpeakvfx.com",
    "logo": "https://static.wixstatic.com/media/7ffb5e_7bc187b5a1bb402796dc951e8da61bc0~mv2.png/v1/fill/w_200,h_120,al_c,q_85,enc_avif,quality_auto/visionpeak.png",
    "region": "Global Network",
    "speciality": "VFX Support & Rotoscopy",
    "artistCount": 25,
    "status": "ACTIVE"
  },
  {
    "studioName": "AccuRoto",
    "email": "tom@blackfx.net",
    "website": "https://accuroto.com",
    "logo": "https://static.wixstatic.com/media/7ffb5e_e6fa89c09c914bf199eb3c1a700eb8aa~mv2.png/v1/fill/w_200,h_100,al_c,q_85,enc_avif,quality_auto/accuroto.png",
    "region": "Global Network",
    "speciality": "High-Density Roto & Prep",
    "artistCount": 35,
    "status": "ACTIVE"
  },
  {
    "studioName": "Symbol VFX Studios",
    "email": "tom@blackfx.net",
    "website": "https://symbolvfx.com",
    "logo": "https://static.wixstatic.com/media/7ffb5e_d23a41b52bc2467d93ffcf29759ad766~mv2.png/v1/fill/w_200,h_120,al_c,q_85,enc_avif,quality_auto/symbol.png",
    "region": "Global Network",
    "speciality": "VFX Support & Rotoscopy",
    "artistCount": 28,
    "status": "ACTIVE"
  },
  {
    "studioName": "Reelax Studios",
    "email": "tom@blackfx.net",
    "website": "https://reelaxstudios.com",
    "logo": "https://static.wixstatic.com/media/7ffb5e_c3a060416b254a61905ea8bb1d8a14d5~mv2.png/v1/fill/w_200,h_100,al_c,q_85,enc_avif,quality_auto/reelax.png",
    "region": "Global Network",
    "speciality": "VFX Support & Rotoscopy",
    "artistCount": 20,
    "status": "ACTIVE"
  },
  {
    "studioName": "Zedone Animation and Vfx Studios LLP",
    "email": "tom@blackfx.net",
    "website": "https://zedonestudios.com",
    "logo": "https://static.wixstatic.com/media/7ffb5e_7fa99c1543884e9089f21f1da83eb1be~mv2.png/v1/fill/w_180,h_180,al_c,q_85,enc_avif,quality_auto/zedone.png",
    "region": "Global Network",
    "speciality": "VFX Support & Rotoscopy",
    "artistCount": 40,
    "status": "ACTIVE"
  }
];

export const WORK_SHOTS: WorkShot[] = [
  {
    id: 'shot-01',
    title: 'Precision Character & Hair Rotoscopy',
    category: 'Roto',
    tag: '01 / FEATURED',
    description: 'Multi-layer isolated silhouette, motion-blurred fine hair detail, and complex interactive edge preservation for feature film composite.',
    originalImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    processedImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    clientType: 'Sci-Fi Feature Film',
    resolution: '4K DCI (4096x2160)',
    frameRange: '184 Frames @ 24fps',
    complexity: 'Master',
  },
  {
    id: 'shot-02',
    title: 'Stunt Rig & Wire Deconstruction',
    category: 'Digital Paint',
    tag: '02 / CLEANUP',
    description: 'Sub-pixel background reconstruction behind high-velocity acrobatic harness wire rigs without grain jitter or spatial distortion.',
    originalImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    processedImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    clientType: 'Commercial Campaign',
    resolution: '4K UHD (3840x2160)',
    frameRange: '96 Frames @ 60fps',
    complexity: 'High',
  },
  {
    id: 'shot-03',
    title: 'Clean Plate & Dynamic Shadow Re-creation',
    category: 'Cleanup',
    tag: '03 / VFX PIPELINE',
    description: 'Removal of boom mics, tracking markers, and production crew reflections with matched natural optical aberrations and film grain.',
    originalImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    processedImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    clientType: 'High-End Streaming Series',
    resolution: '4K ProRes 4444 XQ',
    frameRange: '240 Frames @ 24fps',
    complexity: 'High',
  },
];

export const SERVICES_LIST: ServiceItem[] = [
  {
    number: '01',
    title: 'Rotoscopy',
    description: 'Character, object, hair, motion and complex interaction mattes.',
    deliverables: ['Isolated Matte Channels (.EXR RGB/Alpha)', 'Nuke Roto Nodes (.nk script)', 'Silhouette & Core Layer Partitioning'],
    tools: ['Silhouette FX', 'Foundry Nuke', 'Mocha Pro'],
  },
  {
    number: '02',
    title: 'Digital Paint',
    description: 'Wire removal, rig removal, clean plates, beauty work and frame restoration.',
    deliverables: ['Frame-by-Frame Clean Plates', 'Temporal Grain Matched Sequences', 'Dynamic Texture Projection Patches'],
    tools: ['Foundry Nuke', 'Adobe Photoshop', 'Mari / 3D Projection'],
  },
  {
    number: '03',
    title: 'Cleanup',
    description: 'High-detail cleanup for film, advertising and VFX production.',
    deliverables: ['Marker Removal Passes', 'Anamorphic Flare Preservation', 'Seamless Seam & Boundary Blends'],
    tools: ['Foundry Nuke', 'Silhouette FX', 'Flame'],
  },
  {
    number: '04',
    title: 'Keying',
    description: 'Green-screen and extraction support for production pipelines.',
    deliverables: ['Edge Treatment & Despill Passes', 'Additive Hair Detail Recovery', 'Core & Edge Composite Splits'],
    tools: ['Primatte', 'Keylight', 'IBK Colour & Gizmos'],
  },
  {
    number: '05',
    title: 'Matchmove',
    description: 'Tracking and matchmove support for downstream VFX work.',
    deliverables: ['3D Camera Solver (.FBX / .Alembic)', 'Survey Point Cloud & Distortion Grid', 'Geometry Object Tracking'],
    tools: ['3DEqualizer', 'PFTrack', 'Syntheyes'],
  },
  {
    number: '06',
    title: 'VFX Support',
    description: 'Production-ready support integrated into your existing VFX pipeline.',
    deliverables: ['Shotgun / Ftrack Status Sync', 'Custom Pipeline Hand-off', 'Round-the-clock 12H Shift Rotations'],
    tools: ['ShotGrid API', 'Aspera / Signiant', 'Custom Python Dispatch'],
  },
];

export const INITIAL_LIVE_SHOTS: ProductionLiveShot[] = [
  { id: '1', shotCode: 'SHOT_00128', service: 'ROTO', status: 'DONE', frames: 144, artistLead: 'Lead A-09', progress: 100 },
  { id: '2', shotCode: 'SHOT_00129', service: 'PAINT', status: 'WIP', frames: 96, artistLead: 'Lead P-03', progress: 68 },
  { id: '3', shotCode: 'SHOT_00130', service: 'CLEANUP', status: 'QC', frames: 210, artistLead: 'Lead C-12', progress: 90 },
  { id: '4', shotCode: 'SHOT_00131', service: 'ROTO', status: 'WIP', frames: 75, artistLead: 'Lead A-04', progress: 42 },
  { id: '5', shotCode: 'SHOT_00132', service: 'PAINT', status: 'DONE', frames: 180, artistLead: 'Lead P-07', progress: 100 },
  { id: '6', shotCode: 'SHOT_00133', service: 'KEYING', status: 'INGEST', frames: 320, artistLead: 'Lead K-01', progress: 15 },
  { id: '7', shotCode: 'SHOT_00134', service: 'TRACK', status: 'DELIVERED', frames: 110, artistLead: 'Lead M-02', progress: 100 },
];

export const FAQS: FAQItem[] = [
  {
    question: 'What type of roto and paint work do you handle?',
    answer: 'RPW handles character and object rotoscopy, hair mattes, complex interactions, digital paint, wire and rig removal, cleanup, keying and related VFX preparation work.',
    category: 'Capabilities',
  },
  {
    question: 'Can you work under NDA?',
    answer: 'Yes. Confidentiality and controlled project handling are part of the RPW production workflow. We execute bilateral Non-Disclosure Agreements with every client and have isolated, secure pipeline infrastructure.',
    category: 'Security',
  },
  {
    question: 'Can RPW handle large-volume projects?',
    answer: "That's one of the primary reasons the network exists. RPW can allocate work across its internal production team and verified partner network according to project requirements and deadlines, scaling to hundreds of shots concurrently.",
    category: 'Scale',
  },
  {
    question: 'How do we send you a project?',
    answer: 'Start through RPW Connect or contact the RPW team with your brief, shot count, requirements and deadline. We can immediately determine the appropriate production setup and provide turnaround estimates.',
    category: 'Workflow',
  },
  {
    question: 'Can we start with a test shot?',
    answer: 'Yes! Test-shot workflows can be scheduled based on the project scope, technical requirements, and production timeline. We frequently run sample frames to calibrate matte softness, edge tolerances, and clean plate specs.',
    category: 'Trial',
  },
];
