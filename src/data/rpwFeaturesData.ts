import React from 'react';
import {
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Edit3,
  CheckCircle2,
  Clock,
  Sparkles,
  Play,
  ShieldAlert,
  HardDrive,
  FolderArchive,
  PhoneCall,
  ShieldBan,
  CloudLightning,
  FolderGit2
} from 'lucide-react';

import screenProjectMatrix from '../assets/images/rpw_screen_project_matrix_1788302979376.jpg';
import screenShotProgress from '../assets/images/rpw_screen_shot_progress_1788303011945.jpg';
import screenShotSheet from '../assets/images/rpw_screen_shot_sheet_1788303051844.jpg';
import screenChatAttachments from '../assets/images/rpw_screen_chat_attachments_1788303205444.jpg';
import screenVideoAnnotator from '../assets/images/rpw_screen_video_annotator_1788303075883.jpg';
import screenWatermarkPlayer from '../assets/images/rpw_screen_watermark_player_1788303101307.jpg';
import screenLargeTransfer from '../assets/images/rpw_screen_large_transfer_1788303130918.jpg';
import screenSharedFiles from '../assets/images/rpw_screen_shared_files_1788303151843.jpg';
import screenInappCall from '../assets/images/rpw_screen_inapp_call_1788303171847.jpg';
import screenAntiLeak from '../assets/images/rpw_screen_anti_leak_1788303189453.jpg';

export interface FeatureCardItem {
  id: string;
  tag: string;
  category: string;
  title: string;
  shortDesc: string;
  themeColor: string;
  glowColor: string;
  accentBg: string;
  icon: React.ElementType;
  imageSrc: string;
  bulletPoints: {
    icon: React.ElementType;
    title: string;
    desc: string;
  }[];
  uiMockup: {
    screenTitle: string;
    badgeText: string;
  };
}

export const RPW_FEATURES: FeatureCardItem[] = [
  {
    id: 'multi-project-matrix',
    tag: 'FEATURE 01',
    category: 'PIPELINE ISOLATION',
    title: 'Multiple Project Groups & Studio Matrix',
    shortDesc:
      'Manage multiple client studios, active project codes, and live bidding hubs simultaneously in isolated high-security environments.',
    themeColor: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.55)',
    accentBg: 'from-blue-600/20 to-blue-900/10',
    icon: FolderGit2,
    imageSrc: screenProjectMatrix,
    bulletPoints: [
      {
        icon: ShieldCheck,
        title: 'Complete Client Isolation',
        desc: 'Separate project channels with zero cross-visibility between client studios.'
      },
      {
        icon: Zap,
        title: 'Live Bidding Hub',
        desc: 'Direct bidding matrix with real-time showreel updates and project status flags.'
      },
      {
        icon: Layers,
        title: 'Active Code Indexing',
        desc: 'Instant access to Project Codes with completion percentages.'
      }
    ],
    uiMockup: {
      screenTitle: 'Project Matrix • RPW-Connect',
      badgeText: 'MULTI-STUDIO MATRIX'
    }
  },
  {
    id: 'shots-live-progress',
    tag: 'FEATURE 02',
    category: 'REAL-TIME TELEMETRY',
    title: 'Shots Live Progress Tracking Bar',
    shortDesc:
      'Live shot-by-shot progress bars with real-time frame completion counters (1000/7000 frames) streaming directly from production.',
    themeColor: '#00df81',
    glowColor: 'rgba(0, 223, 129, 0.55)',
    accentBg: 'from-emerald-600/20 to-emerald-950/20',
    icon: Activity,
    imageSrc: screenShotProgress,
    bulletPoints: [
      {
        icon: Activity,
        title: 'Granular Shot Meters',
        desc: 'Live telemetry bars for Shot 1 (25%), Shot 2 (20%), Shot 3 (30%), Shot 4 (10%).'
      },
      {
        icon: Clock,
        title: 'Frame Milestone Counter',
        desc: 'Tracks total delivered frames vs active prep frames in real-time.'
      },
      {
        icon: CheckCircle2,
        title: 'Instant QC Triggers',
        desc: 'One-click "CHECK REVIEW" notification buttons embedded directly inside chat streams.'
      }
    ],
    uiMockup: {
      screenTitle: 'Test Project • Shot Progress Meter',
      badgeText: 'LIVE FRAME METER'
    }
  },
  {
    id: 'all-shots-matrix-updates',
    tag: 'FEATURE 03',
    category: 'PRODUCTION TRACKING',
    title: 'All Shots Updates & Inline Artist Matrix',
    shortDesc:
      'Full production spreadsheet inside the app with double-click inline cell editing, artist headcounts (50+ artists), and render tracking.',
    themeColor: '#66fcf1',
    glowColor: 'rgba(102, 252, 241, 0.55)',
    accentBg: 'from-cyan-600/20 to-cyan-950/20',
    icon: Layers,
    imageSrc: screenShotSheet,
    bulletPoints: [
      {
        icon: Edit3,
        title: 'Inline Spreadsheet Grid',
        desc: 'Double-click any cell to update shot total, rendered frames, or status flags.'
      },
      {
        icon: Zap,
        title: '50+ Artists Live Allocation',
        desc: 'Visual breakdown of artists assigned to each shot with real-time WIP updates.'
      },
      {
        icon: ShieldCheck,
        title: 'Zero Lag Synchronization',
        desc: 'Updates propagate instantly to client supervisors and studio dispatchers.'
      }
    ],
    uiMockup: {
      screenTitle: 'Test • Inline Shot Tracking Sheet',
      badgeText: '50 ARTISTS WORKING'
    }
  },
  {
    id: 'chat-file-attachments-1gb',
    tag: 'FEATURE 04',
    category: 'STREAMING STORAGE',
    title: 'Chat File Attachments Up to 1 GB',
    shortDesc:
      'Attach large assets (Photos, MP4, PDF, ZIP) directly into conversational threads with real-time upload progress meters.',
    themeColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.55)',
    accentBg: 'from-purple-600/20 to-purple-950/20',
    icon: Sparkles,
    imageSrc: screenChatAttachments,
    bulletPoints: [
      {
        icon: Sparkles,
        title: 'Multi-Format Support',
        desc: 'Drop ProRes, MP4, High-res EXR sequences, PDF brief packages, and project archives.'
      },
      {
        icon: Activity,
        title: 'Streaming Upload Telemetry',
        desc: 'Displays upload percentage, elapsed time, and download token generation.'
      },
      {
        icon: CheckCircle2,
        title: 'In-Thread Media Card',
        desc: 'Renders actionable cards inside chat with instant preview or download trigger.'
      }
    ],
    uiMockup: {
      screenTitle: 'Attach to Chat Menu • 1GB Limit',
      badgeText: 'UP TO 1 GB FILES'
    }
  },
  {
    id: 'in-chat-video-player-launch',
    tag: 'FEATURE 05',
    category: 'MEDIA REVIEW',
    title: 'In-Chat Video Review Launcher',
    shortDesc:
      'Launch frame-accurate 25 FPS video review directly from any video thumbnail in the chat without opening third-party software.',
    themeColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.55)',
    accentBg: 'from-sky-600/20 to-sky-950/20',
    icon: Play,
    imageSrc: screenVideoAnnotator,
    bulletPoints: [
      {
        icon: Play,
        title: 'Native MP4/MOV Playback',
        desc: 'Embedded video player with smooth scrub bar, timecode tracking, and FPS counter.'
      },
      {
        icon: Zap,
        title: 'Instant One-Click Review',
        desc: 'Directly transition from chat discussion into frame-by-frame annotation studio.'
      },
      {
        icon: CheckCircle2,
        title: 'No App Switching',
        desc: 'Review, annotate, and approve shots entirely within RPW-Connect.'
      }
    ],
    uiMockup: {
      screenTitle: 'In-Chat Video Review Launcher',
      badgeText: '25 FPS PLAYER'
    }
  },
  {
    id: 'frame-accurate-video-review',
    tag: 'FEATURE 06',
    category: 'PRECISION QC',
    title: 'Frame-Accurate Video Review & Doodle Annotations',
    shortDesc:
      'Comprehensive drawing and pin annotation studio with numbered markers, comment sidebar, and watermarked video export.',
    themeColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.55)',
    accentBg: 'from-amber-600/20 to-amber-950/20',
    icon: Edit3,
    imageSrc: screenVideoAnnotator,
    bulletPoints: [
      {
        icon: Edit3,
        title: 'Doodle & Marker Tooling',
        desc: 'Freehand draw on video canvas with dynamic color picker, erase tool, and stroke width.'
      },
      {
        icon: Activity,
        title: 'Numbered Marker Pins',
        desc: 'Timeline pins (1, 2, 3, 4...) linked directly to timecoded feedback notes.'
      },
      {
        icon: HardDrive,
        title: 'Download Watermarked (WM)',
        desc: 'Export annotated video containing burned-in marks and studio verification metadata.'
      }
    ],
    uiMockup: {
      screenTitle: 'Video Review Studio • Frame Annotations',
      badgeText: 'TIMECODE PINNING'
    }
  },
  {
    id: 'dynamic-watermarked-playback',
    tag: 'FEATURE 07',
    category: 'SECURITY & FORENSICS',
    title: 'Dynamic Forensic Watermarked Video Playback',
    shortDesc:
      'Burn-in forensic watermarking displaying viewer name, timestamp, IP address, and translucent ROTO corner logo on all media.',
    themeColor: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.55)',
    accentBg: 'from-red-600/20 to-red-950/20',
    icon: ShieldAlert,
    imageSrc: screenWatermarkPlayer,
    bulletPoints: [
      {
        icon: ShieldAlert,
        title: 'Tamper-Proof Forensic Overlay',
        desc: 'Dynamic text overlays preventing unauthorized leaks.'
      },
      {
        icon: ShieldCheck,
        title: 'Corner Studio Branding',
        desc: 'Translucent ROTO corner watermark permanently embedded in canvas viewport.'
      },
      {
        icon: Layers,
        title: 'Enterprise MPAA Compliance',
        desc: 'Built specifically to satisfy tier-1 Hollywood studio digital security requirements.'
      }
    ],
    uiMockup: {
      screenTitle: 'Watermarked Video Player (MPC-Style Preview)',
      badgeText: 'DYNAMIC FORENSIC WM'
    }
  },
  {
    id: 'large-file-transfers-10gb',
    tag: 'FEATURE 08',
    category: 'CLOUD INFRASTRUCTURE',
    title: 'Large File Transfer Up to 10 GB (3-Day Expiry)',
    shortDesc:
      'Send massive VFX packages, EXR sequence archives, and RAW plates up to 10 GB with automated 3-day cleanup lifecycles.',
    themeColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.55)',
    accentBg: 'from-emerald-600/20 to-emerald-950/20',
    icon: HardDrive,
    imageSrc: screenLargeTransfer,
    bulletPoints: [
      {
        icon: HardDrive,
        title: '10 GB Chunked Transmission',
        desc: 'Resilient multi-part chunked uploads preventing timeouts on large transfers.'
      },
      {
        icon: Clock,
        title: 'Automated 3-Day Lifecycle',
        desc: 'Transfers auto-expire in 72 hours, reducing cloud bloat and maintaining asset hygiene.'
      },
      {
        icon: Zap,
        title: 'Instant Download Links',
        desc: 'Secure one-click tokens generated directly for assigned studio supervisors.'
      }
    ],
    uiMockup: {
      screenTitle: 'RPW-Connect • Large File Transfer',
      badgeText: 'UP TO 10 GB • 3-DAY EXPIRY'
    }
  },
  {
    id: 'shared-files-hub-transfers',
    tag: 'FEATURE 09',
    category: 'ASSET MANAGEMENT',
    title: 'Shared Files Hub & Active Transfer Expiry Tracker',
    shortDesc:
      'Centralized asset repository showing active file transfers, remaining expiry countdowns (e.g., 2D 23H left), and download buttons.',
    themeColor: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.55)',
    accentBg: 'from-cyan-600/20 to-cyan-950/20',
    icon: FolderArchive,
    imageSrc: screenSharedFiles,
    bulletPoints: [
      {
        icon: FolderArchive,
        title: 'Shared Files Repository',
        desc: 'Categorized asset view by project code, file type, and upload date.'
      },
      {
        icon: Clock,
        title: 'Live Expiry Countdown',
        desc: 'Clear visual countdown badges showing time remaining before automated purging.'
      },
      {
        icon: CheckCircle2,
        title: 'Direct Quick Download',
        desc: 'Instant high-speed download buttons for authorized studio team members.'
      }
    ],
    uiMockup: {
      screenTitle: 'Shared Files Hub • Test Group',
      badgeText: 'ASSET REPOSITORY'
    }
  },
  {
    id: 'encrypted-inapp-calling-bell',
    tag: 'FEATURE 10',
    category: 'VOIP COMMUNICATIONS',
    title: 'In-App Calling with Offline Wakeup Bell',
    shortDesc:
      'Encrypted WebRTC voice and video calls with an urgent trigger alert that rings offline users directly on their phone.',
    themeColor: '#6366f1',
    glowColor: 'rgba(99, 102, 241, 0.55)',
    accentBg: 'from-indigo-600/20 to-indigo-950/20',
    icon: PhoneCall,
    imageSrc: screenInappCall,
    bulletPoints: [
      {
        icon: PhoneCall,
        title: 'Direct VoIP Calling',
        desc: 'Crystal-clear Opus codec voice communication with zero third-party telecom lag.'
      },
      {
        icon: Zap,
        title: 'Offline User Wakeup Bell',
        desc: '"RPW TEAM IS OFFLINE RINGING THEIR PHONE" alert triggers mobile push notifications.'
      },
      {
        icon: ShieldCheck,
        title: 'End-to-End Encrypted',
        desc: 'Secure DTLS-SRTP encryption guaranteeing conversational privacy.'
      }
    ],
    uiMockup: {
      screenTitle: 'Encrypted In-App Calling & Bell Trigger',
      badgeText: 'WEBRTC OPUS CALL'
    }
  },
  {
    id: 'anti-leak-interceptor-units',
    tag: 'FEATURE 11',
    category: 'DATA LOSS PREVENTION',
    title: 'Anti-Leak Filter & Email Redaction Interceptor',
    shortDesc:
      'Protective guardrails that redact external email sharing and require explicit unit selection (Days, Month, Time, Minute, Sec, Mandays) for numbers before sending.',
    themeColor: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.55)',
    accentBg: 'from-rose-600/20 to-rose-950/20',
    icon: ShieldBan,
    imageSrc: screenAntiLeak,
    bulletPoints: [
      {
        icon: ShieldBan,
        title: 'Email Sharing Prohibited Warning',
        desc: 'Automatically detects and redacts external email strings in conversational streams.'
      },
      {
        icon: Activity,
        title: 'Unit Selection Prompt',
        desc: 'Forces users to specify unit type (Rupee, Days, Mandays, Hours, Frames, Sec) for all bare numbers.'
      },
      {
        icon: ShieldCheck,
        title: 'Proprietary Pipeline Protection',
        desc: 'Protects commercial rate cards, bidding figures, and sensitive credentials from accidental leakage.'
      }
    ],
    uiMockup: {
      screenTitle: 'Unit Selector & Email Redaction Interceptor',
      badgeText: 'LEAK INTERCEPTOR'
    }
  },
  {
    id: 'google-drive-enterprise-bridge',
    tag: 'FEATURE 12',
    category: 'ENTERPRISE INTEGRATION',
    title: 'Assign Google Drive Enterprise Storage',
    shortDesc:
      'Connect enterprise Google Drive shared storage folders directly to project channels for multi-terabyte assets.',
    themeColor: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.55)',
    accentBg: 'from-blue-600/20 to-blue-950/20',
    icon: CloudLightning,
    imageSrc: screenChatAttachments,
    bulletPoints: [
      {
        icon: CloudLightning,
        title: 'Multi-TB Shared Drives',
        desc: 'Directly sync existing Google Workspace and Google Drive production folders.'
      },
      {
        icon: Layers,
        title: 'Role-Based Access Control',
        desc: 'Assign drive access privileges to studio admins, supervisors, or artists.'
      },
      {
        icon: CheckCircle2,
        title: 'Unified File Navigation',
        desc: 'Browse Google Drive directories alongside native RPW-Connect transfers.'
      }
    ],
    uiMockup: {
      screenTitle: 'Assign Google Drive • Enterprise Pipeline',
      badgeText: 'MULTI-TB READY'
    }
  }
];
