/**
 * Unified Media & Video Helper Utilities for RPW Studio
 * Extracts YouTube IDs, handles Shorts, standard URLs, youtu.be, embeds, and parameters.
 */

export function extractYouTubeId(url?: string | null): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Direct 11-char alphanumeric ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // youtu.be/<id>
  const youtuBeMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/i);
  if (youtuBeMatch && youtuBeMatch[1]) {
    return youtuBeMatch[1];
  }

  // youtube.com/watch?v=<id>
  const watchMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/watch\?(?:[^&]+&)*v=([a-zA-Z0-9_-]{11})/i);
  if (watchMatch && watchMatch[1]) {
    return watchMatch[1];
  }

  // youtube.com/embed/<id>
  const embedMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]{11})/i);
  if (embedMatch && embedMatch[1]) {
    return embedMatch[1];
  }

  // youtube.com/shorts/<id>
  const shortsMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i);
  if (shortsMatch && shortsMatch[1]) {
    return shortsMatch[1];
  }

  // Generic fallback query param v=<id>
  const vParamMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/i);
  if (vParamMatch && vParamMatch[1]) {
    return vParamMatch[1];
  }

  return null;
}

export interface YouTubeEmbedOptions {
  autoplay?: boolean;
  mute?: boolean;
  loop?: boolean;
  controls?: boolean;
  modestbranding?: boolean;
  enablejsapi?: boolean;
}

export function getYouTubeEmbedUrl(
  url?: string | null,
  options: YouTubeEmbedOptions = {}
): string | null {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;

  const {
    autoplay = true,
    mute = true,
    loop = true,
    controls = true,
    modestbranding = true,
    enablejsapi = false,
  } = options;

  const params = new URLSearchParams();
  if (autoplay) params.set('autoplay', '1');
  if (mute) params.set('mute', '1');
  if (loop) {
    params.set('loop', '1');
    params.set('playlist', videoId);
  }
  if (!controls) params.set('controls', '0');
  if (modestbranding) params.set('modestbranding', '1');
  if (enablejsapi) {
    params.set('enablejsapi', '1');
    if (typeof window !== 'undefined' && window.location?.origin && window.location.origin !== 'null') {
      params.set('origin', window.location.origin);
    }
  }
  params.set('rel', '0');
  params.set('playsinline', '1');

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

export function isDirectVideoUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const lower = url.toLowerCase().trim();
  return (
    lower.endsWith('.mp4') ||
    lower.endsWith('.webm') ||
    lower.endsWith('.mov') ||
    lower.endsWith('.m4v') ||
    lower.includes('.mp4?') ||
    lower.includes('.webm?') ||
    lower.includes('/uploads/video_') ||
    lower.startsWith('data:video/')
  );
}

export function extractPlaylistId(url?: string | null): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // 1. Query parameter list=<id> (e.g. youtube.com/watch?v=xxx&list=PL... or youtube.com/playlist?list=PL...)
  const match = trimmed.match(/[?&]list=([a-zA-Z0-9_-]+)/i);
  if (match && match[1]) {
    return match[1];
  }

  // 2. Direct YouTube playlist ID format: PL..., UU..., LL..., RD..., FL..., OLAK5uy_...
  if (/^(?:PL|UU|LL|RD|FL|OLAK5uy_)[a-zA-Z0-9_-]{8,}$/i.test(trimmed)) {
    return trimmed;
  }

  // 3. YouTube Channel URL (e.g. youtube.com/channel/UC... -> Channel Uploads playlist is UU...)
  const channelMatch = trimmed.match(/(?:youtube\.com\/channel\/|^)(UC[a-zA-Z0-9_-]{20,})/i);
  if (channelMatch && channelMatch[1]) {
    return 'UU' + channelMatch[1].slice(2);
  }

  return null;
}

/**
 * Parses user input containing one or multiple YouTube links or IDs (separated by commas, lines, or spaces)
 * into a clean array of valid YouTube video IDs.
 */
export function extractMultipleVideoIds(input?: string | string[] | null): string[] {
  if (!input) return [];
  const rawItems = Array.isArray(input) ? input : input.split(/[\n,;]+|\s{2,}/);
  const ids: string[] = [];

  for (const item of rawItems) {
    const trimmed = item.trim();
    if (!trimmed) continue;
    // Skip if it's explicitly a playlist link/ID
    if (trimmed.includes('list=') || /^(?:PL|UU|LL|RD|FL|OLAK5uy_)[a-zA-Z0-9_-]{8,}$/i.test(trimmed)) {
      continue;
    }
    const id = extractYouTubeId(trimmed);
    if (id && !ids.includes(id)) {
      ids.push(id);
    } else if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed) && !ids.includes(trimmed)) {
      ids.push(trimmed);
    }
  }

  return ids;
}
