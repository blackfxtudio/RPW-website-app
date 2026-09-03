import React, { useState } from 'react';
import { X, Upload, Link, Check, Image as ImageIcon, Film, Sparkles, RefreshCw, AlertCircle, ListMusic } from 'lucide-react';
import { isDirectVideoUrl, extractYouTubeId, extractPlaylistId } from '../../utils/mediaUtils';

interface MediaUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  currentValue: string;
  mediaType: 'image' | 'video';
  onSelect: (url: string) => void;
}

const PRESET_VFX_IMAGES = [
  {
    name: 'RPW Official Brand Logo',
    url: 'https://static.wixstatic.com/media/7ffb5e_bebd8db90704414a9140cfbf0e8fe1e1~mv2.png/v1/fill/w_400,h_400,al_c,q_90,enc_avif,quality_auto/RPW.png',
    type: 'logo',
  },
  {
    name: 'Character Hair Matte Plate',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    type: 'plate',
  },
  {
    name: 'Alpha Matte Composite',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    type: 'matte',
  },
  {
    name: 'Stunt Wire Deconstruction',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    type: 'plate',
  },
  {
    name: 'Clean Plate Reconstruction',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    type: 'clean',
  },
  {
    name: 'Boom & Rig Removal Raw',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    type: 'plate',
  },
  {
    name: 'Clean Matte Reconstruction',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    type: 'clean',
  },
  {
    name: 'Cyberpunk VFX Cityscape',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
    type: 'plate',
  },
];

const PRESET_SHOWREELS = [
  {
    name: 'RPW Official Studio Reel (P5vvOZRO9JU)',
    url: 'P5vvOZRO9JU',
    badge: 'YOUTUBE 4K',
    type: 'youtube',
  },
  {
    name: 'RPW Official VFX Production Playlist Matrix',
    url: 'PLrAl6sJc9k_VwW1v4HjD4Lw_zR-wzD5bN',
    badge: 'PLAYLIST',
    type: 'playlist',
  },
  {
    name: 'Cinematic VFX Breakdown Prep Reel',
    url: 'dQw4w9WgXcQ',
    badge: 'YOUTUBE REEL',
    type: 'youtube',
  },
  {
    name: 'High-Energy Sci-Fi Roto Reel',
    url: 'L_LUpnjgPso',
    badge: 'YOUTUBE REEL',
    type: 'youtube',
  },
  {
    name: 'Direct MP4 Stream: Big Buck Bunny Clean Plate',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    badge: 'DIRECT MP4',
    type: 'direct',
  },
  {
    name: 'Direct MP4 Stream: Tears of Steel VFX Plate',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    badge: 'DIRECT MP4',
    type: 'direct',
  },
  {
    name: 'Direct MP4 Stream: Elephants Dream Render',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    badge: 'DIRECT MP4',
    type: 'direct',
  },
];

export const MediaUploaderModal: React.FC<MediaUploaderModalProps> = ({
  isOpen,
  onClose,
  title,
  currentValue,
  mediaType,
  onSelect,
}) => {
  const [urlInput, setUrlInput] = useState(currentValue || '');
  const [previewUrl, setPreviewUrl] = useState(currentValue || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  if (!isOpen) return null;

  const processFile = async (file: File) => {
    setUploadError(null);
    setIsUploading(true);

    const isVid = file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v|ogg)$/i.test(file.name);
    const isImg = file.type.startsWith('image/') || /\.(png|jpe?g|webp|svg|gif)$/i.test(file.name);

    if (mediaType === 'video' && !isVid) {
      setUploadError('Please select a valid video file (.mp4, .webm, or .mov).');
      setIsUploading(false);
      return;
    }

    if (mediaType === 'image' && !isImg) {
      setUploadError('Please select a valid image file (.png, .jpg, .webp, or .svg).');
      setIsUploading(false);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      if (typeof reader.result === 'string') {
        const rawData = reader.result;
        setPreviewUrl(rawData);

        // Upload to server endpoint to get a lightweight, persistent static URL
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataUrl: rawData, filename: file.name }),
          });
          const data = await res.json();
          if (data.success && data.url) {
            setUrlInput(data.url);
            setPreviewUrl(data.url);
          } else {
            // Fallback to raw data url if server returned error
            setUrlInput(rawData);
          }
        } catch (err) {
          console.warn('Upload API error, using direct data stream:', err);
          setUrlInput(rawData);
        } finally {
          setIsUploading(false);
        }
      }
    };

    reader.onerror = () => {
      setUploadError('Failed to read file from disk. Please try again.');
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleApply = () => {
    let finalUrl = urlInput.trim();
    if (mediaType === 'video') {
      if (!isDirectVideoUrl(finalUrl)) {
        const plId = extractPlaylistId(finalUrl);
        if (plId) {
          finalUrl = plId;
        } else {
          const ytId = extractYouTubeId(finalUrl);
          if (ytId) {
            finalUrl = ytId;
          }
        }
      }
    }
    onSelect(finalUrl);
    onClose();
  };

  const isCurrentDirectVideo = isDirectVideoUrl(previewUrl);
  const currentPlId = extractPlaylistId(previewUrl);
  const currentYtId = extractYouTubeId(previewUrl);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#08111a] border border-[#66fcf1]/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_80px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#9daab4] hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2.5 mb-1">
          {mediaType === 'video' ? (
            <Film className="w-5 h-5 text-[#66fcf1]" />
          ) : (
            <ImageIcon className="w-5 h-5 text-[#66fcf1]" />
          )}
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
            {title}
          </h3>
        </div>
        <p className="text-xs text-[#9daab4] mb-6">
          {mediaType === 'video'
            ? 'Upload your MP4/WebM video file directly, paste a YouTube/Vimeo link, or pick from our high-res VFX presets. Changes reflect immediately.'
            : 'Enter an image URL, upload a local media asset, or select from curated VFX production presets.'}
        </p>

        {/* URL / ID Input Form */}
        <div className="space-y-4 mb-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono uppercase text-[#66fcf1] font-bold">
                {mediaType === 'video' ? 'Video File URL or YouTube ID / Link' : 'Media Asset URL or Base64'}
              </label>
              {mediaType === 'video' && (
                <span className="text-[10px] font-mono text-[#9daab4]">
                  {isCurrentDirectVideo ? 'Direct MP4 / WebM' : currentYtId ? `YouTube ID: ${currentYtId}` : 'Ready for input'}
                </span>
              )}
            </div>
            <div className="relative flex items-center">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setUrlInput(val);
                  setPreviewUrl(val);
                }}
                placeholder={
                  mediaType === 'video'
                    ? 'Paste YouTube link, MP4 URL, or upload below...'
                    : 'https://... or upload below'
                }
                className="w-full bg-[#05070b] border border-white/20 focus:border-[#66fcf1] rounded-xl px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#66fcf1] transition-all font-mono"
              />
            </div>
          </div>

          {/* Local File Upload for Both Video and Image */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#9daab4] mb-2">
              {mediaType === 'video' ? 'Or Upload Video File From Computer (.MP4, .WebM, .MOV):' : 'Or Upload Image From Computer:'}
            </label>
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`flex flex-col sm:flex-row items-center justify-center gap-2 w-full p-4 border border-dashed rounded-xl cursor-pointer transition-all text-xs ${
                isDragOver
                  ? 'border-[#66fcf1] bg-[#66fcf1]/10 text-white'
                  : 'border-[#66fcf1]/30 hover:border-[#66fcf1] bg-white/[0.02] hover:bg-[#66fcf1]/[0.05] text-[#9daab4] hover:text-white'
              }`}
            >
              {isUploading ? (
                <div className="flex items-center gap-2 text-[#66fcf1]">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="font-mono font-bold">Uploading & saving reel to server...</span>
                </div>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-[#66fcf1]" />
                  <span>
                    {mediaType === 'video'
                      ? 'Click or Drop MP4, WebM, or MOV video showreel'
                      : 'Choose PNG, JPG, SVG, or WebP'}
                  </span>
                </>
              )}
              <input
                type="file"
                accept={mediaType === 'video' ? 'video/mp4,video/webm,video/quicktime,video/*' : 'image/*'}
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
            {uploadError && (
              <div className="mt-2 text-[11px] text-rose-400 flex items-center gap-1.5 font-mono">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Preview Box */}
        <div className="mb-6">
          <label className="block text-xs font-mono uppercase text-[#9daab4] mb-2">
            Live Preview (Before & After Publishing):
          </label>
          <div className="w-full h-48 rounded-xl bg-black border border-white/10 flex items-center justify-center overflow-hidden relative">
            {mediaType === 'video' ? (
              isCurrentDirectVideo ? (
                <video
                  src={previewUrl}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : currentPlId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/videoseries?list=${currentPlId}&controls=1&mute=1&autoplay=0`}
                  title="Playlist Preview"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  className="w-full h-full"
                />
              ) : currentYtId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${currentYtId}?controls=1&mute=1&autoplay=0`}
                  title="Video Preview"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  className="w-full h-full"
                />
              ) : previewUrl ? (
                <div className="text-center p-4">
                  <Film className="w-8 h-8 text-[#66fcf1] mx-auto mb-2 opacity-50" />
                  <span className="text-xs text-white/70 block font-mono">
                    Video link ready: {previewUrl.substring(0, 45)}...
                  </span>
                  <span className="text-[10px] text-[#9daab4] mt-1 block">
                    Click "Apply Media Asset" to load and play
                  </span>
                </div>
              ) : (
                <span className="text-xs text-white/40 font-mono">No video or reel selected</span>
              )
            ) : previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-full max-w-full object-contain p-2"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <span className="text-xs text-white/40 font-mono">No image selected</span>
            )}
          </div>
        </div>

        {/* Curated Presets */}
        <div className="mb-6">
          <label className="block text-xs font-mono uppercase text-[#66fcf1] font-bold mb-2">
            Quick VFX Presets:
          </label>
          {mediaType === 'video' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_SHOWREELS.map((vid, idx) => {
                const isSelected = urlInput === vid.url || (vid.type === 'youtube' && urlInput === vid.url);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setUrlInput(vid.url);
                      setPreviewUrl(vid.url);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all text-xs flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#66fcf1]/15 border-[#66fcf1] text-[#66fcf1]'
                        : 'bg-white/5 border-white/10 text-[#9daab4] hover:text-white hover:border-white/30'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-white/80 font-mono">
                          {vid.badge}
                        </span>
                      </div>
                      <span className="truncate block font-medium text-white/90">{vid.name}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 shrink-0 text-[#66fcf1]" />}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_VFX_IMAGES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setUrlInput(preset.url);
                    setPreviewUrl(preset.url);
                  }}
                  className={`group relative h-20 rounded-xl border overflow-hidden transition-all ${
                    urlInput === preset.url
                      ? 'border-[#66fcf1] ring-2 ring-[#66fcf1]/50'
                      : 'border-white/10 hover:border-white/40'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-end p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] text-white truncate">{preset.name}</span>
                  </div>
                  {urlInput === preset.url && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#66fcf1] text-[#05070b] flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <span className="text-[11px] text-[#9daab4] font-mono">
            Applies to hero reel immediately
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#aeb9c1] hover:text-white border border-white/15 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={isUploading}
              className="px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider text-[#05070b] bg-[#66fcf1] hover:shadow-[0_0_25px_rgba(102,252,241,0.4)] transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>Apply Media Asset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
