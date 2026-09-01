import React, { useState } from 'react';
import { X, Upload, Link, Check, Image as ImageIcon, Film, Sparkles } from 'lucide-react';

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

const PRESET_YOUTUBE_VIDEOS = [
  {
    name: 'Roto Paint Wala Official Showreel (P5vvOZRO9JU)',
    id: 'P5vvOZRO9JU',
  },
  {
    name: 'VFX Breakdown & Prep Reel (dQw4w9WgXcQ)',
    id: 'dQw4w9WgXcQ',
  },
  {
    name: 'Cinematic Nuke Comp Reel (L_LUpnjgPso)',
    id: 'L_LUpnjgPso',
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
  const [urlInput, setUrlInput] = useState(currentValue);
  const [previewUrl, setPreviewUrl] = useState(currentValue);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setUrlInput(reader.result);
          setPreviewUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApply = () => {
    onSelect(urlInput);
    onClose();
  };

  // Helper to extract YouTube ID if user pastes full youtube link
  const cleanYouTubeId = (input: string) => {
    const match = input.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : input.trim();
  };

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
            ? 'Provide a YouTube Video ID, embed link, or pick from our high-res VFX showreel presets.'
            : 'Enter an image URL, upload a local media asset, or select from curated VFX production presets.'}
        </p>

        {/* URL / ID Input Form */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-mono uppercase text-[#66fcf1] font-bold mb-2">
              {mediaType === 'video' ? 'YouTube Video ID or Full Link' : 'Media Asset URL or Base64'}
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => {
                  const val = mediaType === 'video' ? cleanYouTubeId(e.target.value) : e.target.value;
                  setUrlInput(val);
                  setPreviewUrl(val);
                }}
                placeholder={mediaType === 'video' ? 'e.g. P5vvOZRO9JU or https://youtube.com/watch?v=...' : 'https://... or upload below'}
                className="w-full bg-[#05070b] border border-white/20 focus:border-[#66fcf1] rounded-xl px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#66fcf1] transition-all font-mono"
              />
            </div>
          </div>

          {/* Local File Upload for Images */}
          {mediaType === 'image' && (
            <div>
              <label className="block text-xs font-mono uppercase text-[#9daab4] mb-2">
                Or Upload from Computer:
              </label>
              <label className="flex items-center justify-center gap-2 w-full p-4 border border-dashed border-[#66fcf1]/30 hover:border-[#66fcf1] rounded-xl bg-white/[0.02] hover:bg-[#66fcf1]/[0.05] cursor-pointer transition-all text-xs text-[#9daab4] hover:text-white">
                <Upload className="w-4 h-4 text-[#66fcf1]" />
                <span>Choose PNG / JPG / SVG / WebP</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* Live Preview Box */}
        <div className="mb-6">
          <label className="block text-xs font-mono uppercase text-[#9daab4] mb-2">
            Live Preview:
          </label>
          <div className="w-full h-44 rounded-xl bg-black border border-white/10 flex items-center justify-center overflow-hidden relative">
            {mediaType === 'video' ? (
              previewUrl ? (
                <iframe
                  src={`https://www.youtube.com/embed/${previewUrl}?controls=0&mute=1&autoplay=0`}
                  title="Video Preview"
                  className="w-full h-full pointer-events-none"
                />
              ) : (
                <span className="text-xs text-white/40">No video selected</span>
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
              <span className="text-xs text-white/40">No image selected</span>
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
              {PRESET_YOUTUBE_VIDEOS.map((vid) => (
                <button
                  key={vid.id}
                  onClick={() => {
                    setUrlInput(vid.id);
                    setPreviewUrl(vid.id);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all text-xs flex items-center justify-between ${
                    urlInput === vid.id
                      ? 'bg-[#66fcf1]/15 border-[#66fcf1] text-[#66fcf1]'
                      : 'bg-white/5 border-white/10 text-[#9daab4] hover:text-white hover:border-white/30'
                  }`}
                >
                  <span className="truncate pr-2 font-medium">{vid.name}</span>
                  {urlInput === vid.id && <Check className="w-3.5 h-3.5 shrink-0 text-[#66fcf1]" />}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_VFX_IMAGES.map((preset, idx) => (
                <button
                  key={idx}
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
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#aeb9c1] hover:text-white border border-white/15 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider text-[#05070b] bg-[#66fcf1] hover:shadow-[0_0_25px_rgba(102,252,241,0.4)] transition-all flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Apply Media Asset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
