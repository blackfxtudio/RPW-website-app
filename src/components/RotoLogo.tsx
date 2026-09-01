import React, { useState } from 'react';

interface RotoLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero' | 'header';
  showText?: boolean;
  src?: string;
}

export const RotoLogo: React.FC<RotoLogoProps> = ({
  className = '',
  size = 'md',
  src = 'https://static.wixstatic.com/media/7ffb5e_bebd8db90704414a9140cfbf0e8fe1e1~mv2.png/v1/fill/w_400,h_400,al_c,q_90,enc_avif,quality_auto/RPW.png',
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    header: 'h-12 sm:h-14 w-auto max-h-[58px]',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
    hero: 'w-36 h-36 sm:w-44 sm:h-44',
  }[size];

  // If remote image fails, render exact high-precision vector fallback
  if (imgError) {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        <svg
          viewBox="0 0 500 500"
          className={`${sizeClasses} drop-shadow-[0_0_20px_rgba(0,132,255,0.4)]`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="105" y1="235" x2="250" y2="90" stroke="#0084ff" strokeWidth="12" strokeLinecap="round" />
          <circle cx="105" cy="235" r="18" fill="#0084ff" />
          <circle cx="250" cy="90" r="18" fill="#0084ff" />
          
          <rect
            x="170"
            y="145"
            width="26"
            height="26"
            fill="#0084ff"
            transform="rotate(-45 183 158)"
          />

          <path
            d="M 160 190 Q 230 135 375 135 L 375 355 L 160 355 Z"
            fill="#1e1e1e"
            stroke="#0084ff"
            strokeWidth="10"
            strokeLinejoin="round"
          />

          <path
            d="M 200 178 L 275 208 L 290 265 L 265 290 L 235 260 L 200 178 Z"
            fill="none"
            stroke="#ffffff"
            strokeWidth="7"
            strokeLinejoin="round"
          />
          <line x1="200" y1="178" x2="250" y2="235" stroke="#ffffff" strokeWidth="5" />
          <circle cx="252" cy="237" r="7" stroke="#ffffff" strokeWidth="5" fill="none" />
          
          <rect
            x="263"
            y="262"
            width="24"
            height="40"
            rx="6"
            fill="none"
            stroke="#ffffff"
            strokeWidth="7"
            transform="rotate(-45 275 282)"
          />

          <text
            x="267"
            y="346"
            fill="#ffffff"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="900"
            fontSize="76"
            letterSpacing="2"
            textAnchor="middle"
          >
            ROTO
          </text>

          <rect x="155" y="362" width="225" height="34" fill="#0084ff" />
          <text
            x="267"
            y="386"
            fill="#ffffff"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="900"
            fontSize="22"
            letterSpacing="2"
            textAnchor="middle"
          >
            PAINT WALA
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <img
        src={src}
        alt="Roto Paint Wala Official Logo"
        className={`${sizeClasses} object-contain select-none transition-transform duration-300 hover:scale-105`}
        onError={() => setImgError(true)}
      />
    </div>
  );
};
