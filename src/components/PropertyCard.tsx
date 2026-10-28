import React from 'react';
import { Property } from '../types';
import { ArchitecturalVisual } from './ArchitecturalVisual';
import { formatNaira } from '../utils/formatters';
import { ArrowUpRight } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelect }) => {
  const primaryImage = property.gallery[0] || {
    preset: 'lekki_villa' as const,
    caption: property.title,
  };

  const isAvailable = property.availability_status === 'Available';

  return (
    <article className="group bg-white border border-[#E3E7E3] rounded-xl overflow-hidden flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5">
      <div>
        <div
          onClick={() => onSelect(property)}
          className="cursor-pointer overflow-hidden border-b border-[#E3E7E3]"
        >
          <ArchitecturalVisual
            preset={primaryImage.preset}
            customImageUrl={primaryImage.customImageUrl}
            alt={`${property.title} in ${property.location}`}
            aspectRatio="4:3"
            className="transition-transform duration-200 group-hover:scale-[1.02]"
          />
        </div>

        <div className="p-6">
          {/* Unboxed static metadata line — Zero-Pill Discipline */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#69736D] mb-2">
            <span className="font-mono-tabular text-[#202923] font-medium">
              {property.reference}
            </span>
            <span aria-hidden="true">·</span>
            <span>{property.property_type}</span>
            <span aria-hidden="true">·</span>
            <span>{property.transaction_type}</span>
            <span aria-hidden="true">·</span>
            <span
              className={
                isAvailable
                  ? 'text-[#174C3C] font-semibold'
                  : 'text-amber-800 font-semibold'
              }
            >
              Status: {property.availability_status}
            </span>
          </div>

          <h3
            onClick={() => onSelect(property)}
            className="text-lg font-bold text-[#202923] group-hover:text-[#174C3C] transition-colors cursor-pointer leading-snug mb-1.5 balance-text"
          >
            {property.title}
          </h3>

          <p className="text-sm text-[#69736D] mb-4">{property.location}</p>

          {/* Key specifications in clean unboxed text */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#69736D] pt-3 border-t border-[#E3E7E3]">
            {property.specifications.bedrooms !== undefined && (
              <>
                <span className="font-mono-tabular">
                  {property.specifications.bedrooms} Beds
                </span>
                <span aria-hidden="true">·</span>
              </>
            )}
            {property.specifications.bathrooms !== undefined && (
              <>
                <span className="font-mono-tabular">
                  {property.specifications.bathrooms} Baths
                </span>
                <span aria-hidden="true">·</span>
              </>
            )}
            <span className="font-mono-tabular">
              {property.specifications.plot_size_sqm.toLocaleString()} SQM
            </span>
            <span aria-hidden="true">·</span>
            <span className="truncate max-w-[180px]">
              {property.specifications.title_document}
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-[#FAF9F6] border-t border-[#E3E7E3] flex items-center justify-between gap-4">
        <div>
          <span className="block text-[11px] text-[#69736D]">Guide Price</span>
          <span className="text-base font-bold text-[#202923] font-mono-tabular">
            {formatNaira(property.price, property.price_on_request)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onSelect(property)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#174C3C] rounded-lg hover:bg-[#123B2E] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>View Property</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
};
