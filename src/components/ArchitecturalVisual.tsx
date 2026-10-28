import React, { useState } from 'react';
import { ArchitecturalVisualPreset } from '../types';

interface ArchitecturalVisualProps {
  preset: ArchitecturalVisualPreset;
  customImageUrl?: string;
  alt: string;
  caption?: string;
  className?: string;
  aspectRatio?: '16:9' | '4:3' | 'none';
}

export const PRESET_REAL_IMAGE_MAP: Record<ArchitecturalVisualPreset, string> = {
  lekki_villa: '/images/lekki-villa-ext.jpg',
  ikoyi_penthouse: '/images/ikoyi-penthouse.jpg',
  abuja_terrace: '/images/abuja-terrace.jpg',
  vi_commercial: '/images/vi-commercial.jpg',
  epe_land_estate: '/images/epe-estate.jpg',
  ikeja_duplex: '/images/ikeja-duplex.jpg',
  maitama_mansion: '/images/villa-interior.jpg',
  academy_masterclass: '/images/academy-masterclass.jpg',
  academy_law_title: '/images/academy-law.jpg',
  academy_valuation: '/images/academy-valuation.jpg',
  academy_development: '/images/advisory-consultation.jpg',
};

export function resolveVisualUrl(
  preset: ArchitecturalVisualPreset,
  customImageUrl?: string
): string {
  return customImageUrl || PRESET_REAL_IMAGE_MAP[preset] || '/images/lekki-villa-ext.jpg';
}

export const ArchitecturalVisual: React.FC<ArchitecturalVisualProps> = ({
  preset,
  customImageUrl,
  alt,
  caption,
  className = '',
  aspectRatio = '4:3',
}) => {
  const [imageError, setImageError] = useState(false);

  const aspectClass =
    aspectRatio === '16:9'
      ? 'aspect-video'
      : aspectRatio === '4:3'
      ? 'aspect-[4/3]'
      : '';

  const resolvedSrc = resolveVisualUrl(preset, customImageUrl);

  if (!imageError) {
    return (
      <div className={`relative overflow-hidden bg-[#13382C] ${aspectClass} ${className}`}>
        <img
          src={resolvedSrc}
          alt={alt}
          loading="eager"
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-transform duration-500"
        />
        {caption && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-4 py-3">
            <p className="text-xs text-white/95 font-medium truncate">{caption}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative overflow-hidden select-none bg-[#143D30] flex items-center justify-center ${aspectClass} ${className}`}
    >
      <div className="text-center p-6">
        <p className="text-xs font-mono-tabular text-[#EAF2ED]/80">{alt}</p>
      </div>
      {caption && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 py-3">
          <p className="text-xs text-white/95 font-medium truncate">{caption}</p>
        </div>
      )}
    </div>
  );
};
