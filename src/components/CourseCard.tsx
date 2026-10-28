import React from 'react';
import { Course } from '../types';
import { ArchitecturalVisual } from './ArchitecturalVisual';
import { formatNaira, formatDateReadable } from '../utils/formatters';
import { ArrowUpRight } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onSelect: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect }) => {
  const isOpen =
    course.registration_status === 'Registration Open' ||
    course.registration_status === 'Upcoming';

  const seatsRemaining = Math.max(0, course.capacity - course.enrolled_count);

  return (
    <article className="group bg-white border border-[#E3E7E3] rounded-xl overflow-hidden flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5">
      <div>
        <div
          onClick={() => onSelect(course)}
          className="cursor-pointer overflow-hidden border-b border-[#E3E7E3]"
        >
          <ArchitecturalVisual
            preset={course.visual_preset}
            customImageUrl={course.custom_image_url}
            alt={course.title}
            aspectRatio="16:9"
            className="transition-transform duration-200 group-hover:scale-[1.02]"
          />
        </div>

        <div className="p-6">
          {/* Unboxed static metadata line */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#69736D] mb-2">
            <span className="font-mono-tabular text-[#202923] font-medium">
              {course.reference}
            </span>
            <span aria-hidden="true">·</span>
            <span>{course.delivery_method}</span>
            <span aria-hidden="true">·</span>
            <span>{course.duration}</span>
            <span aria-hidden="true">·</span>
            <span
              className={
                isOpen
                  ? 'text-[#174C3C] font-semibold'
                  : 'text-[#69736D] font-semibold'
              }
            >
              {course.registration_status}
            </span>
          </div>

          <h3
            onClick={() => onSelect(course)}
            className="text-lg font-bold text-[#202923] group-hover:text-[#174C3C] transition-colors cursor-pointer leading-snug mb-2 balance-text"
          >
            {course.title}
          </h3>

          <p className="text-sm text-[#69736D] line-clamp-2 mb-4">
            {course.short_description}
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#69736D] pt-3 border-t border-[#E3E7E3]">
            <span>
              Starts:{' '}
              <strong className="text-[#202923] font-mono-tabular">
                {formatDateReadable(course.start_date)}
              </strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Deadline:{' '}
              <span className="font-mono-tabular">
                {formatDateReadable(course.registration_deadline)}
              </span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">
              {seatsRemaining} of {course.capacity} seats left
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-[#FAF9F6] border-t border-[#E3E7E3] flex items-center justify-between gap-4">
        <div>
          <span className="block text-[11px] text-[#69736D]">Programme Tuition</span>
          <span className="text-base font-bold text-[#202923] font-mono-tabular">
            {formatNaira(course.fee)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onSelect(course)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#174C3C] rounded-lg hover:bg-[#123B2E] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>View Programme</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
};
