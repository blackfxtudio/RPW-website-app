import React from 'react';
import { SocialIconsGroup } from './SocialIconsGroup';
import { useSiteConfig } from '../context/SiteConfigContext';
import { Edit3 } from 'lucide-react';
import { AppPage } from '../types';

interface FooterProps {
  onNavigate?: (page: AppPage, targetSectionId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { config, isEditorOpen, setActiveEditTarget } = useSiteConfig();
  const whatsappUrl = config.whatsappUrl || 'https://wa.me/919876543210?text=Hello%20Roto%20Paint%20Wala%20Team%2C%20I%20would%20like%20to%20discuss%20a%20VFX%20Project';

  const handleLinkClick = (page: AppPage, sectionId?: string) => {
    if (onNavigate) {
      onNavigate(page, sectionId);
    }
  };

  return (
    <footer className="border-t border-white/10 pt-12 sm:pt-16 pb-20 sm:pb-16 px-4 sm:px-8 md:px-12 relative z-10 bg-[#05070b]">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Top Row: Enlarged Brand Logo & Social Channels / WhatsApp */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-10 border-b border-white/5">
          {/* Prominently Scaled Roto Paint Wala Brand Logo */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5">
            <button
              onClick={() => handleLinkClick('home')}
              className="flex items-center justify-center p-2 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#66fcf1]/50 hover:shadow-[0_0_30px_rgba(102,252,241,0.2)] transition-all group shrink-0"
              title="Roto Paint Wala - Home"
            >
              <img
                src="https://static.wixstatic.com/media/7ffb5e_bebd8db90704414a9140cfbf0e8fe1e1~mv2.png/v1/fill/w_217,h_217,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/RPW.png"
                alt="Roto Paint Wala"
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_20px_rgba(102,252,241,0.3)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </button>

            <div className="flex flex-col items-center sm:items-start">
              <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                <span className="font-heading font-black text-xl sm:text-2xl md:text-3xl text-white tracking-wide">
                  ROTO PAINT <span className="text-[#66fcf1]">WALA</span>
                </span>
                {isEditorOpen && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveEditTarget('social');
                    }}
                    className="p-1 rounded bg-[#66fcf1]/20 text-[#66fcf1] border border-[#66fcf1]/40 hover:bg-[#66fcf1] hover:text-black transition-all"
                    title="Edit Social Media Links & Channels"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <p className="text-xs sm:text-sm text-[#9daab4] font-mono mt-1 max-w-md">
                {config.footerTagline || 'Production-ready Roto, Paint & VFX Support Network.'}
              </p>

              {/* Direct WhatsApp Quick Contact Link */}
              <div className="mt-3 flex items-center gap-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/40 hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] text-xs font-bold font-mono transition-all duration-300"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>Connect on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Social Media Circular Brand Icons + WhatsApp */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span className="text-[11px] font-mono text-[#87949c] uppercase tracking-wider hidden lg:inline-block">
              Connect With Us:
            </span>
            <SocialIconsGroup size="md" />
          </div>
        </div>

        {/* Bottom Row: Copyright and Nav Links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#87949c] font-mono">
          <p className="tracking-wide text-center md:text-left">
            {config.footerCopyright || '© 2026 ROTO PAINT WALA. A Division of Black Fxtudio.'}
          </p>

          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
            <button
              onClick={() => handleLinkClick('home')}
              className="hover:text-[#66fcf1] transition-colors uppercase font-bold"
            >
              HOME
            </button>
            <button
              onClick={() => handleLinkClick('portfolio')}
              className="hover:text-[#66fcf1] text-[#66fcf1] transition-colors uppercase font-bold"
            >
              PORTFOLIO
            </button>
            <button
              onClick={() => handleLinkClick('about')}
              className="hover:text-[#66fcf1] transition-colors uppercase font-bold"
            >
              ABOUT US
            </button>
            <button
              onClick={() => handleLinkClick('home', 'services')}
              className="hover:text-[#66fcf1] transition-colors uppercase"
            >
              SERVICES
            </button>
            <button
              onClick={() => handleLinkClick('home', 'partners')}
              className="hover:text-[#66fcf1] transition-colors uppercase"
            >
              NETWORK
            </button>
            <button
              onClick={() => handleLinkClick('home', 'faq')}
              className="hover:text-[#66fcf1] transition-colors uppercase"
            >
              FAQ
            </button>
            <a
              href={config.connectPortalUrl || 'https://app.rotopaintwala.com/'}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#66fcf1] transition-colors uppercase font-bold text-[#66fcf1]"
            >
              RPW CONNECT
            </a>
            <a
              href={`mailto:${config.supportEmail || 'tom@blackfx.net'}`}
              className="hover:text-[#66fcf1] transition-colors uppercase"
            >
              SUPPORT
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};


