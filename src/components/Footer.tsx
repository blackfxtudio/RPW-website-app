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

  const handleLinkClick = (page: AppPage, sectionId?: string) => {
    if (onNavigate) {
      onNavigate(page, sectionId);
    }
  };

  return (
    <footer className="border-t border-white/10 pt-12 pb-14 px-4 sm:px-8 md:px-12 relative z-10 bg-[#05070b]">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Top Row: Brand & Social Channels */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => handleLinkClick('home')}
              className="flex items-center gap-3 text-left focus:outline-none"
            >
              <img
                src="https://static.wixstatic.com/media/7ffb5e_bebd8db90704414a9140cfbf0e8fe1e1~mv2.png/v1/fill/w_217,h_217,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/RPW.png"
                alt="RPW"
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-black text-sm text-white tracking-wider">
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
                      <Edit3 className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-[#697780] font-mono mt-0.5">
                  {config.footerTagline || 'Production-ready Roto, Paint & VFX Support Network.'}
                </p>
              </div>
            </button>
          </div>

          {/* Social Media Circular Brand Icons Matching Visual Reference */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span className="text-[11px] font-mono text-[#87949c] uppercase tracking-wider hidden lg:inline-block">
              Connect With Us:
            </span>
            <SocialIconsGroup size="md" />
          </div>
        </div>

        {/* Bottom Row: Copyright and Nav Links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#87949c] font-mono">
          <p className="tracking-wide">
            {config.footerCopyright || '© 2026 ROTO PAINT WALA. A Division of Black Fxtudio.'}
          </p>

          <div className="flex items-center gap-6 flex-wrap justify-center">
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


