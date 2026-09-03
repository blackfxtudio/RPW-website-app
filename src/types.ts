export type AppPage = 'home' | 'portfolio' | 'about';

export interface PortfolioShowreelItem {
  id: string;
  title: string;
  category: 'Roto' | 'Digital Paint' | 'Wire Removal' | 'Beauty & De-Aging' | 'Stereo 3D' | 'Full Comp';
  tag: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  aspectRatio?: string;
  clientTier: 'Feature Film' | 'OTT Series' | 'Commercial' | 'Music Video';
  resolution: string;
  turnaroundTime: string;
  software: string[];
  description: string;
  beforeImage?: string;
  afterImage?: string;
  matteImage?: string;
  featured?: boolean;
}

export interface VfxBreakdownItem {
  id: string;
  title: string;
  category: 'Roto' | 'Digital Paint' | 'Wire Removal' | 'Beauty & De-Aging' | 'Stereo 3D' | 'Full Comp';
  tag: string;
  beforeImage: string;
  afterImage: string;
  resolution: string;
  turnaroundTime: string;
  software: string[];
  description: string;
  featured?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  experience: string;
  bio: string;
  avatar: string;
  credits: string[];
  specialty: string;
}

export interface ProjectPoster {
  id: string;
  title: string;
  year: string;
  category: string;
  studioClient: string;
  services: string[];
  posterUrl: string;
  badge?: string;
  highlight?: string;
}

export interface MoviePosterItem {
  id: string;
  title: string;
  year: string;
  category: string;
  studio: string;
  posterUrl: string;
  tag: string;
  vfxWork: string[];
  aspectRatio?: string;
  highlight?: string;
}

export interface PartnerStudio {
  studioName: string;
  email?: string;
  website?: string;
  logo?: string;
  region?: string;
  speciality?: string;
  artistCount?: number;
  status?: 'ACTIVE' | 'BUSY' | 'VERIFIED';
}

export interface WorkShot {
  id: string;
  title: string;
  category: 'Roto' | 'Digital Paint' | 'Cleanup' | 'Keying' | 'VFX Support';
  tag: string;
  description: string;
  originalImage: string;
  processedImage: string;
  videoUrl?: string;
  clientType: string;
  resolution: string;
  frameRange: string;
  complexity: 'Standard' | 'High' | 'Master';
}

export interface ServiceItem {
  number: string;
  title: string;
  description: string;
  deliverables: string[];
  tools: string[];
}

export interface ProductionLiveShot {
  id: string;
  shotCode: string;
  service: 'ROTO' | 'PAINT' | 'CLEANUP' | 'KEYING' | 'TRACK';
  status: 'DONE' | 'WIP' | 'QC' | 'INGEST' | 'DELIVERED';
  frames: number;
  artistLead: string;
  progress: number;
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export interface WhyPillarItem {
  number: string;
  title: string;
  description: string;
  iconName: 'Users' | 'Compass' | 'Lock' | 'Zap' | 'ShieldCheck' | 'Layers';
}

export interface SocialLinkItem {
  id: string;
  platform: 'facebook' | 'x' | 'instagram' | 'youtube' | 'reddit' | 'discord' | 'linkedin' | 'google' | 'whatsapp' | 'custom';
  label: string;
  url: string;
  enabled: boolean;
  customIconUrl?: string;
}

export interface SiteConfig {
  // Branding & Header
  brandName: string;
  brandHighlight: string;
  logoUrl: string;
  headerLiveBadgeText: string;
  primaryTagline: string;
  primaryTaglineHighlight: string;
  primaryFont: 'Poppins' | 'Space Grotesk' | 'Inter';
  accentColor: string;
  supportEmail: string;
  connectPortalUrl: string;
  whatsappNumber?: string;
  whatsappUrl?: string;

  // Hero Section
  heroEyebrow: string;
  heroHeadlineLine1: string;
  heroHeadlineGradient: string;
  heroHeadlineLine3: string;
  heroDescription: string;
  heroBgVideoType: 'youtube' | 'mp4' | 'image';
  heroBgSourceType: 'single-video' | 'playlist';
  heroBgVideoYouTubeId: string;
  heroBgPlaylistId: string;
  heroBgPlaylistShuffle: boolean;
  heroBgLoop: boolean;
  heroBgVideoMp4Url: string;
  heroBgImageFallback: string;
  heroCtaPrimaryText: string;
  heroCtaSecondaryText: string;
  heroCtaTertiaryText: string;

  // Partner Universe
  partnerEyebrow: string;
  partnerTagline: string;
  partnerTaglineHighlight: string;
  partnerDescription: string;
  partners: PartnerStudio[];

  // Work Showcase
  workEyebrow: string;
  workHeading: string;
  workHeadingHighlight: string;
  workDescription: string;
  shots: WorkShot[];

  // Services Section
  servicesEyebrow: string;
  servicesHeading: string;
  servicesHeadingHighlight: string;
  servicesDescription: string;
  services: ServiceItem[];

  // Why RPW
  whyEyebrow: string;
  whyHeading: string;
  whyHeadingHighlight: string;
  whyPillars: WhyPillarItem[];

  // Telemetry & Stats
  liveShots: ProductionLiveShot[];
  stats: Array<{ value: string; label: string }>;

  // Ticker
  tickerItems: string[];

  // FAQs
  faqEyebrow: string;
  faqHeading: string;
  faqHeadingHighlight: string;
  faqs: FAQItem[];

  // Portfolio & Feature Films
  portfolioReels?: PortfolioShowreelItem[];
  collaborationTagline?: string;
  collaborationSubDescription?: string;
  vfxBreakdowns?: VfxBreakdownItem[];
  moviePosters?: MoviePosterItem[];
  homePostersHeadline?: string;
  homePostersHeadlineLine1?: string;
  homePostersHeadlineLine2?: string;
  homePostersHeadlineLine3?: string;
  homePostersSubheadline?: string;
  homePostersDescription?: string;
  homePostersCtaText?: string;
  collageTiles?: Array<{
    id: string;
    title: string;
    category: string;
    image: string;
    videoUrl: string;
    badge: string;
    glowColor: string;
  }>;
  featureFilms?: ProjectPoster[];

  // RPW-Connect 3D Features Customization
  rpwFeatureImages?: Record<string, string>;
  rpwFeatureOverrides?: Record<string, { title?: string; shortDesc?: string; category?: string; imageSrc?: string; badgeText?: string }>;
  rpwShowcaseAutoRotate?: boolean;
  rpwShowcaseRotateInterval?: number;
  rpwShowcaseSpeed?: number;

  // Final CTA & Footer
  finalCtaEyebrow: string;
  finalCtaHeadline: string;
  finalCtaHeadlineHighlight: string;
  finalCtaDescription: string;
  finalCtaPrimaryText: string;
  finalCtaSecondaryText: string;
  footerCopyright: string;
  footerTagline: string;
  socialLinks: SocialLinkItem[];
}
