import React, { useState, useEffect, useRef } from 'react';
import { Search, Film, Check, X, Loader2, Sparkles, Image as ImageIcon, ExternalLink, RefreshCw } from 'lucide-react';

export interface FetchedPosterResult {
  title: string;
  year?: string;
  posterUrl: string;
  genre?: string;
  director?: string;
}

interface MoviePosterFetcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery: string;
  onSelectPoster: (posterUrl: string, movieTitle?: string) => void;
}

const POPULAR_SEARCH_SUGGESTIONS = [
  'Kalki 2898 AD',
  'Pushpa 2',
  'RRR',
  'Devara',
  'Stree 2',
  'Leo',
  'Jawan',
  'Animal',
  'Salaar',
  'K.G.F 2',
  'Dune 2',
  'Avatar',
  'Oppenheimer',
  'Interstellar',
  'The Batman',
  'Godzilla Minus One',
];

export const MoviePosterFetcherModal: React.FC<MoviePosterFetcherModalProps> = ({
  isOpen,
  onClose,
  initialQuery,
  onSelectPoster,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<FetchedPosterResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      const startQuery = initialQuery.trim();
      setQuery(startQuery);
      if (startQuery) {
        searchMoviePosters(startQuery);
      } else {
        // Load initial popular results
        searchMoviePosters('');
      }
    }
  }, [isOpen, initialQuery]);

  // Handle live typing with automatic debounce
  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      searchMoviePosters(val);
    }, 350);
  };

  const searchMoviePosters = async (searchTerm: string) => {
    setIsLoading(true);
    setHasSearched(true);

    try {
      // 1. Fetch from our multi-source secure server-side poster endpoint
      const targetUrl = searchTerm.trim() 
        ? `/api/posters/search?query=${encodeURIComponent(searchTerm.trim())}`
        : `/api/posters/search`;

      const serverRes = await fetch(targetUrl);
      if (serverRes.ok) {
        const serverData = await serverRes.json();
        if (serverData.results && serverData.results.length > 0) {
          setResults(serverData.results);
          setIsLoading(false);
          return;
        }
      }

      // 2. Fallback: Direct iTunes HD Search API in case server connection is delayed
      if (searchTerm.trim()) {
        const res = await fetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(
            searchTerm.trim()
          )}&entity=movie&limit=16`
        );

        if (res.ok) {
          const data = await res.json();
          if (data.results && data.results.length > 0) {
            const mapped: FetchedPosterResult[] = data.results.map((item: any) => {
              const rawArtwork = item.artworkUrl100 || '';
              const hdArtwork = rawArtwork
                .replace('100x100bb', '1400x1400bb')
                .replace('100x100', '1400x1400')
                .replace('60x60bb', '1400x1400bb');

              return {
                title: item.trackName || item.collectionName || searchTerm,
                year: item.releaseDate ? new Date(item.releaseDate).getFullYear().toString() : '',
                posterUrl: hdArtwork,
                genre: item.primaryGenreName || 'Feature Film',
                director: item.artistName || 'Studio Production',
              };
            });

            setResults(mapped);
            setIsLoading(false);
            return;
          }
        }
      }
    } catch (e) {
      console.warn('Online movie poster search error, falling back to curated posters:', e);
    }

    setIsLoading(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    searchMoviePosters(query);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-[#08111a] border border-[#66fcf1]/30 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#05070b]/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#66fcf1]/15 border border-[#66fcf1]/40 flex items-center justify-center text-[#66fcf1] shadow-[0_0_15px_rgba(102,252,241,0.2)]">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <span>Auto-Fetch Movie Posters</span>
                <span className="px-2 py-0.5 rounded-full bg-[#66fcf1]/15 border border-[#66fcf1]/30 text-[#66fcf1] text-[10px] font-mono font-bold">
                  MULTI-ENGINE HD ARTWORK
                </span>
              </h3>
              <p className="text-xs text-[#9daab4]">
                Type any movie name to automatically query official high-definition theatrical artwork and film posters.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#9daab4] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar, Quick Suggestion Chips & Manual URL */}
        <div className="p-6 space-y-4 border-b border-white/10 bg-[#060c13]/50">
          <form onSubmit={handleFormSubmit} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#66fcf1] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="Type any movie or show title (e.g. Kalki, Pushpa 2, Dune 2, Avatar, Batman, RRR)..."
                className="w-full bg-[#05070b] border border-white/20 rounded-xl pl-10 pr-10 py-3 text-xs text-white placeholder:text-white/30 focus:border-[#66fcf1] focus:outline-none font-medium transition-colors"
                autoFocus
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    searchMoviePosters('');
                  }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-xl bg-[#66fcf1] text-[#05070b] font-heading font-black text-xs uppercase tracking-wider hover:bg-[#52ece1] transition-all disabled:opacity-50 flex items-center gap-2 shadow-[0_0_20px_rgba(102,252,241,0.25)] active:scale-95 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Search</span>
                </>
              )}
            </button>
          </form>

          {/* Quick-Pick Popular Movie Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] font-mono font-bold text-[#66fcf1] uppercase tracking-wider shrink-0">
              Quick Picks:
            </span>
            {POPULAR_SEARCH_SUGGESTIONS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setQuery(item);
                  searchMoviePosters(item);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono shrink-0 transition-all border ${
                  query.toLowerCase() === item.toLowerCase()
                    ? 'bg-[#66fcf1]/20 border-[#66fcf1] text-[#66fcf1]'
                    : 'bg-white/[0.03] border-white/10 text-white/70 hover:border-[#66fcf1]/40 hover:text-white'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Direct URL input option */}
          <div className="pt-2 border-t border-white/5 flex flex-wrap sm:flex-nowrap items-center gap-2">
            <span className="text-[11px] font-mono text-[#87949c] whitespace-nowrap">
              Or paste direct image URL:
            </span>
            <input
              type="url"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              placeholder="https://... (JPG, PNG, WebP)"
              className="flex-1 min-w-[200px] bg-[#05070b] border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-[#66fcf1] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                if (manualUrl.trim()) {
                  onSelectPoster(manualUrl.trim(), query || 'Custom Poster');
                  onClose();
                }
              }}
              disabled={!manualUrl.trim()}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all disabled:opacity-40 whitespace-nowrap"
            >
              Apply Direct URL
            </button>
          </div>
        </div>

        {/* Results Grid */}
        <div className="flex-1 p-6 overflow-y-auto min-h-[300px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#66fcf1]">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-xs font-mono text-[#9daab4]">
                Scanning live film databases & high-definition poster libraries...
              </p>
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.map((item, idx) => (
                <div
                  key={`${item.title}-${idx}`}
                  onClick={() => {
                    onSelectPoster(item.posterUrl, item.title);
                    onClose();
                  }}
                  className="group relative rounded-xl overflow-hidden border border-white/15 bg-[#05070b] hover:border-[#66fcf1] transition-all cursor-pointer hover:shadow-[0_0_30px_rgba(102,252,241,0.35)] hover:scale-[1.02] flex flex-col"
                >
                  <div className="aspect-[2/3] w-full bg-black/60 overflow-hidden relative">
                    <img
                      src={item.posterUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback image if particular link fails
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />
                    
                    {/* HD Badge */}
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md border border-white/10 text-[9px] font-mono font-bold text-[#66fcf1]">
                      HD POSTER
                    </div>

                    {/* Hover Select overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-[#66fcf1]/20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="px-3 py-1.5 rounded-full bg-[#66fcf1] text-[#05070b] font-bold text-xs shadow-lg flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Select Poster</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-between bg-[#08121d]/40">
                    <h4 className="font-heading font-bold text-xs text-white truncate group-hover:text-[#66fcf1] transition-colors" title={item.title}>
                      {item.title}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#87949c] mt-1.5">
                      <span>{item.year || 'Cinema'}</span>
                      <span className="truncate max-w-[80px] text-right">{item.genre || 'VFX'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : hasSearched ? (
            <div className="text-center py-20 space-y-3">
              <Film className="w-12 h-12 text-white/20 mx-auto" />
              <p className="text-sm text-white font-medium">No film posters found for "{query}"</p>
              <p className="text-xs text-[#87949c] max-w-sm mx-auto">
                Try searching with alternate keywords or paste a direct poster image URL in the bar above.
              </p>
            </div>
          ) : (
            <div className="text-center py-20 space-y-3">
              <Sparkles className="w-12 h-12 text-[#66fcf1]/40 mx-auto" />
              <p className="text-sm text-white font-medium">Search Any Movie by Title</p>
              <p className="text-xs text-[#87949c] max-w-sm mx-auto">
                Type any movie name to instantly retrieve official high-resolution film posters.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#05070b]/70 flex items-center justify-between text-[11px] font-mono text-[#87949c]">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#66fcf1] shadow-[0_0_8px_#66fcf1]" />
            <span>Multi-Source HD Artwork Engine • Apple / Wikipedia / Theatrical Posters</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

