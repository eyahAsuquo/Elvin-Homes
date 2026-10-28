import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';

interface HeroSlide {
  id: string;
  indexLabel: string;
  headline: string;
  subheadline: string;
  imageUrl: string;
  primaryCtaLabel: string;
  primaryAction: 'properties' | 'academy' | 'property-slug' | 'course-slug';
  targetSlug?: string;
  secondaryCtaLabel: string;
  secondaryAction: 'academy' | 'properties' | 'contact';
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    indexLabel: '01',
    headline: 'Find Your Next Property. Build Your Real Estate Career.',
    subheadline:
      'Verified residential homes, commercial properties, and practitioner training.',
    imageUrl: '/images/lekki-villa-ext.jpg',
    primaryCtaLabel: 'Explore Properties',
    primaryAction: 'properties',
    secondaryCtaLabel: 'Explore Training Programmes',
    secondaryAction: 'academy',
  },
  {
    id: 'slide-2',
    indexLabel: '02',
    headline: 'Architectural Residences in Prime Neighbourhoods.',
    subheadline:
      'Private gated estates with verified documentation and coordinated site inspections.',
    imageUrl: '/images/abuja-terrace.jpg',
    primaryCtaLabel: 'View Crestview Court',
    primaryAction: 'property-slug',
    targetSlug: 'crestview-court-4-bedroom-terrace-guzape-abuja',
    secondaryCtaLabel: 'Book an Inspection',
    secondaryAction: 'contact',
  },
  {
    id: 'slide-3',
    indexLabel: '03',
    headline: 'Refined Waterfront Living & High-Yield Property Assets.',
    subheadline:
      'Curated luxury apartments, Grade-A commercial floors, and surveyed land.',
    imageUrl: '/images/ikoyi-penthouse.jpg',
    primaryCtaLabel: 'View Waterfront Residence',
    primaryAction: 'property-slug',
    targetSlug: '4-bedroom-waterfront-sky-residence-old-ikoyi',
    secondaryCtaLabel: 'Browse All Properties',
    secondaryAction: 'properties',
  },
  {
    id: 'slide-4',
    indexLabel: '04',
    headline: 'Master Real Estate Brokerage, Title Verification & Advisory.',
    subheadline:
      'Register online for practical training programmes designed for consultants and property investors.',
    imageUrl: '/images/academy-masterclass.jpg',
    primaryCtaLabel: 'Register for a Course',
    primaryAction: 'course-slug',
    targetSlug: 'certified-real-estate-agency-brokerage-practice',
    secondaryCtaLabel: 'View All Courses',
    secondaryAction: 'academy',
  },
];

interface HeroSliderRevolutionProps {
  whatsappUrl: string;
  searchQuery: string;
  filterCategory: string;
  filterTransaction: string;
  onSearchQueryChange: (val: string) => void;
  onFilterCategoryChange: (val: string) => void;
  onFilterTransactionChange: (val: string) => void;
  onExecuteSearch: () => void;
  onNavigateProperties: () => void;
  onNavigateAcademy: () => void;
  onNavigateContact: () => void;
  onSelectPropertySlug: (slug: string) => void;
  onSelectCourseSlug: (slug: string) => void;
  onTrackWhatsAppClick: () => void;
}

export const HeroSliderRevolution: React.FC<HeroSliderRevolutionProps> = ({
  searchQuery,
  filterCategory,
  filterTransaction,
  onSearchQueryChange,
  onFilterCategoryChange,
  onFilterTransactionChange,
  onExecuteSearch,
  onNavigateProperties,
  onNavigateAcademy,
  onNavigateContact,
  onSelectPropertySlug,
  onSelectCourseSlug,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Slower, unhurried 11-second slide duration
  const SLIDE_DURATION_MS = 11000;

  // Preload all slide images into browser memory on mount
  useEffect(() => {
    HERO_SLIDES.forEach((slide) => {
      const img = new Image();
      img.src = slide.imageUrl;
    });
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, [isPaused]);

  const activeSlide = HERO_SLIDES[activeIndex];

  const handlePrimaryAction = (slide: HeroSlide) => {
    if (slide.primaryAction === 'properties') {
      onNavigateProperties();
    } else if (slide.primaryAction === 'academy') {
      onNavigateAcademy();
    } else if (slide.primaryAction === 'property-slug' && slide.targetSlug) {
      onSelectPropertySlug(slide.targetSlug);
    } else if (slide.primaryAction === 'course-slug' && slide.targetSlug) {
      onSelectCourseSlug(slide.targetSlug);
    }
  };

  const handleSecondaryAction = (slide: HeroSlide) => {
    if (slide.secondaryAction === 'academy') {
      onNavigateAcademy();
    } else if (slide.secondaryAction === 'properties') {
      onNavigateProperties();
    } else {
      onNavigateContact();
    }
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <section
      className="relative bg-[#0D261E] border-b border-[#E3E7E3]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Spacious WP Residence / WP Rentals Inspired Hero Viewport */}
      <div className="relative h-[580px] sm:h-[640px] lg:h-[680px] overflow-hidden flex items-center">
        {/* All 4 slide images stay mounted in the DOM simultaneously for instant zero-delay rendering */}
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-[1800ms] ease-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.imageUrl}
                alt={slide.headline}
                loading="eager"
                decoding="sync"
                fetchPriority="high"
                className={`w-full h-full object-cover transition-transform duration-[9000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />
              {/* Clean editorial gradient scrim */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#091D16]/85 via-[#091D16]/55 to-black/25" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#091D16]/90 via-transparent to-black/20" />
            </div>
          );
        })}

        {/* Uncrowded Editorial Content Container with Generous Leading Space Where Text Begins */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-6 sm:px-12 lg:px-20 pt-8 sm:pt-12 pb-16">
          <div className="max-w-2xl pl-2 sm:pl-6 lg:pl-10 space-y-6 transition-all duration-1000 ease-out">
            {/* Clean Display Headline */}
            <h1
              className="font-display font-bold text-white tracking-tight leading-[1.12] balance-text"
              style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)' }}
            >
              {activeSlide.headline}
            </h1>

            {/* Concise 1-sentence Subtitle */}
            <p className="text-base sm:text-lg text-white/85 max-w-xl leading-relaxed">
              {activeSlide.subheadline}
            </p>

            {/* Clean Two-Button CTA Row */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => handlePrimaryAction(activeSlide)}
                className="px-6 py-3.5 bg-[#174C3C] hover:bg-[#1E634E] text-white text-sm font-semibold rounded-lg border border-white/15 transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{activeSlide.primaryCtaLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleSecondaryAction(activeSlide)}
                className="px-6 py-3.5 bg-white/95 hover:bg-white text-[#174C3C] text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {activeSlide.secondaryCtaLabel}
              </button>
            </div>
          </div>

          {/* Minimalist Slide Controls & Indicators (Bottom Right of Hero Canvas) */}
          <div className="mt-10 sm:mt-0 sm:absolute sm:right-8 sm:bottom-20 flex items-center gap-4">
            <div className="flex items-center gap-2">
              {HERO_SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={`Go to slide ${idx + 1}`}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-700 cursor-pointer ${
                    idx === activeIndex
                      ? 'w-8 bg-[#8CE0BE]'
                      : 'w-2 bg-white/35 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Previous Slide"
                onClick={handlePrev}
                className="w-10 h-10 rounded-full bg-black/35 hover:bg-[#174C3C] border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Next Slide"
                onClick={handleNext}
                className="w-10 h-10 rounded-full bg-black/35 hover:bg-[#174C3C] border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* WP Residence / WP Rentals Inspired Floating Search Dock */}
      <div className="relative z-30 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onExecuteSearch();
          }}
          className="bg-white rounded-xl shadow-xl border border-[#E3E7E3] p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-center"
        >
          <div className="lg:col-span-4 sm:border-r border-[#E3E7E3] sm:pr-4">
            <label className="block text-[11px] font-semibold text-[#69736D] mb-1">
              Location or Reference
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="Lekki, Ikoyi, Guzape, ELV-..."
              className="w-full text-sm text-[#202923] placeholder-[#69736D]/70 bg-transparent focus:outline-none"
            />
          </div>

          <div className="lg:col-span-3 lg:border-r border-[#E3E7E3] lg:pr-4">
            <label className="block text-[11px] font-semibold text-[#69736D] mb-1">
              Property Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => onFilterCategoryChange(e.target.value)}
              className="w-full text-sm text-[#202923] bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="Residential Houses">Residential Houses</option>
              <option value="Apartments">Apartments</option>
              <option value="Land">Land</option>
              <option value="Commercial Properties">Commercial Properties</option>
              <option value="Estates">Estates</option>
            </select>
          </div>

          <div className="lg:col-span-3 lg:pr-2">
            <label className="block text-[11px] font-semibold text-[#69736D] mb-1">
              Transaction Type
            </label>
            <select
              value={filterTransaction}
              onChange={(e) => onFilterTransactionChange(e.target.value)}
              className="w-full text-sm text-[#202923] bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="ALL">For Sale, Rent &amp; Lease</option>
              <option value="For Sale">For Sale</option>
              <option value="For Rent">For Rent</option>
              <option value="For Lease">For Lease</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <button
              type="submit"
              className="w-full py-3.5 px-5 bg-[#174C3C] hover:bg-[#123B2E] text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
