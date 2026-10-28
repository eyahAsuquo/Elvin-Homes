import { Property, Course } from '../types';

export function formatNaira(amount: number | null, priceOnRequest = false): string {
  if (priceOnRequest || amount === null) {
    return 'Price on Request';
  }
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateReadable(dateStr: string): string {
  if (!dateStr) return 'TBA';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function buildGeneralWhatsAppUrl(whatsappNumber: string, customMessage?: string): string {
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  const text =
    customMessage ||
    'Hello Elvins Properties & Consultant Real Estate Academy, I would like to speak with a representative regarding your property listings and training programmes.';
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function buildPropertyWhatsAppUrl(whatsappNumber: string, property: Property): string {
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  // Matches PRD Section 8.2 exact message structure:
  const message = `Hello Elvins Properties, I am interested in property ${property.reference} (${property.title} — ${property.location}). Please share more details and available inspection times.`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function buildCourseWhatsAppUrl(whatsappNumber: string, course: Course): string {
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  // Matches PRD Section 8.3 exact message structure:
  const message = `Hello Consultant Real Estate Academy, I would like more information about ${course.title} [${course.reference}], including the schedule, fees, and registration process.`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function exportRecordsToCsv(filename: string, rows: Record<string, unknown>[]): void {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((fieldName) => {
          const val = row[fieldName] ?? '';
          const escaped = String(val).replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
