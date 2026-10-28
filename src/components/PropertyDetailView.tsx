import React, { useState } from 'react';
import {
  Property,
  BusinessSettings,
  PropertyEnquiry,
  InspectionRequest,
} from '../types';
import { ArchitecturalVisual, resolveVisualUrl } from './ArchitecturalVisual';
import { PropertyCard } from './PropertyCard';
import {
  formatNaira,
  formatDateReadable,
  buildPropertyWhatsAppUrl,
} from '../utils/formatters';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  FileCheck2,
  MapPin,
  MessageSquare,
  Share2,
} from 'lucide-react';

interface PropertyDetailViewProps {
  property: Property;
  relatedProperties: Property[];
  settings: BusinessSettings;
  onBack: () => void;
  onSelectProperty: (property: Property) => void;
  onSubmitEnquiry: (
    data: Omit<
      PropertyEnquiry,
      'id' | 'enquiry_reference' | 'lead_status' | 'internal_notes' | 'created_at' | 'updated_at'
    >
  ) => PropertyEnquiry;
  onSubmitInspection: (
    data: Omit<
      InspectionRequest,
      'id' | 'inspection_reference' | 'inspection_status' | 'internal_notes' | 'created_at' | 'updated_at'
    >
  ) => InspectionRequest;
  onTrackWhatsAppClick: () => void;
}

export const PropertyDetailView: React.FC<PropertyDetailViewProps> = ({
  property,
  relatedProperties,
  settings,
  onBack,
  onSelectProperty,
  onSubmitEnquiry,
  onSubmitInspection,
  onTrackWhatsAppClick,
}) => {
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0);
  const [activeFormTab, setActiveFormTab] = useState<'enquiry' | 'inspection'>('inspection');

  // Enquiry Form State
  const [enqName, setEnqName] = useState('');
  const [enqPhone, setEnqPhone] = useState('');
  const [enqEmail, setEnqEmail] = useState('');
  const [enqMessage, setEnqMessage] = useState(
    `I am interested in ${property.title} (${property.reference}). Please share further details regarding documentation and payment structure.`
  );
  const [enqConsent, setEnqConsent] = useState(false);
  const [enqError, setEnqError] = useState('');
  const [savedEnquiry, setSavedEnquiry] = useState<PropertyEnquiry | null>(null);

  // Inspection Booking Form State
  const [inspName, setInspName] = useState('');
  const [inspPhone, setInspPhone] = useState('');
  const [inspEmail, setInspEmail] = useState('');
  const [inspDate, setInspDate] = useState('');
  const [inspTime, setInspTime] = useState('11:00 AM');
  const [inspMessage, setInspMessage] = useState('');
  const [inspConsent, setInspConsent] = useState(false);
  const [inspError, setInspError] = useState('');
  const [savedInspection, setSavedInspection] = useState<InspectionRequest | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const activeGalleryItem =
    property.gallery[selectedGalleryIndex] ||
    property.gallery[0] || {
      id: 'default',
      caption: property.title,
      viewType: 'Exterior' as const,
      preset: 'lekki_villa' as const,
    };

  const isAvailable = property.availability_status === 'Available';
  const whatsappUrl = buildPropertyWhatsAppUrl(settings.whatsapp_number, property);

  const handleCopyShareUrl = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#/properties/${property.slug}`;
    navigator.clipboard?.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnqError('');
    if (!enqName.trim() || !enqPhone.trim()) {
      setEnqError('Please enter your full name and phone number.');
      return;
    }
    if (!enqConsent) {
      setEnqError('Please confirm consent to be contacted by Elvins Properties.');
      return;
    }

    const record = onSubmitEnquiry({
      property_id: property.id,
      property_reference: property.reference,
      property_title: property.title,
      full_name: enqName.trim(),
      phone: enqPhone.trim(),
      email: enqEmail.trim(),
      message: enqMessage.trim(),
      consent_status: enqConsent,
      source: 'Web Form',
    });
    setSavedEnquiry(record);
  };

  const handleInspectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInspError('');
    if (!inspName.trim() || !inspPhone.trim() || !inspDate) {
      setInspError('Please provide your full name, phone number, and preferred inspection date.');
      return;
    }
    if (!inspConsent) {
      setInspError('Please confirm consent to be contacted regarding your inspection appointment.');
      return;
    }

    const record = onSubmitInspection({
      property_id: property.id,
      property_reference: property.reference,
      property_title: property.title,
      full_name: inspName.trim(),
      phone: inspPhone.trim(),
      email: inspEmail.trim(),
      preferred_date: inspDate,
      preferred_time: inspTime,
      message: inspMessage.trim(),
      consent_status: inspConsent,
    });
    setSavedInspection(record);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top breadcrumb & share bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E3E7E3]">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#202923] hover:text-[#174C3C] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Property Catalogue</span>
        </button>

        <div className="flex items-center gap-4 text-xs text-[#69736D]">
          <span>
            Reference:{' '}
            <strong className="font-mono-tabular text-[#202923]">{property.reference}</strong>
          </span>
          <span aria-hidden="true">·</span>
          <span>Updated {formatDateReadable(property.updated_at)}</span>
          <span aria-hidden="true">·</span>
          <button
            type="button"
            onClick={handleCopyShareUrl}
            className="inline-flex items-center gap-1.5 text-[#174C3C] font-semibold hover:underline cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Copied' : 'Share Listing URL'}</span>
          </button>
        </div>
      </div>

      {/* Header Metadata & Price */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8 items-end">
        <div className="lg:col-span-8">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#69736D] mb-2">
            <span className="font-mono-tabular font-semibold text-[#202923]">
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
              Availability: {property.availability_status}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#202923] tracking-tight mb-2 balance-text">
            {property.title}
          </h1>

          <p className="inline-flex items-center gap-1.5 text-sm text-[#69736D]">
            <MapPin className="w-4 h-4 text-[#174C3C] shrink-0" />
            <span>
              {property.location} ({property.specifications.district_zone})
            </span>
          </p>
        </div>

        <div className="lg:col-span-4 lg:text-right">
          <span className="block text-xs text-[#69736D] mb-0.5">
            {property.transaction_type === 'For Sale' ? 'Guide Sale Price' : 'Annual Lease / Rent'}
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-[#174C3C] font-mono-tabular">
            {formatNaira(property.price, property.price_on_request)}
          </div>
          {property.payment_plan_summary && (
            <p className="text-xs text-[#69736D] mt-1">{property.payment_plan_summary}</p>
          )}
        </div>
      </div>

      {/* Main Content Split: Gallery + Specifications on Left, Enquiry/Inspection Console on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7 space-y-8">
          {/* Interactive Gallery */}
          <div className="bg-white border border-[#E3E7E3] rounded-xl overflow-hidden">
            <ArchitecturalVisual
              preset={activeGalleryItem.preset}
              customImageUrl={activeGalleryItem.customImageUrl}
              alt={activeGalleryItem.caption}
              caption={`${activeGalleryItem.viewType} View — ${activeGalleryItem.caption}`}
              aspectRatio="16:9"
            />

            {property.gallery.length > 1 && (
              <div className="p-3 bg-[#FAF9F6] border-t border-[#E3E7E3] grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {property.gallery.map((item, idx) => {
                  const thumbSrc = resolveVisualUrl(item.preset, item.customImageUrl);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedGalleryIndex(idx)}
                      className={`p-2 text-left rounded-lg border transition-all flex items-center gap-2.5 cursor-pointer ${
                        selectedGalleryIndex === idx
                          ? 'bg-[#174C3C] text-white border-[#174C3C]'
                          : 'bg-white text-[#202923] border-[#E3E7E3] hover:bg-[#EAF2ED]'
                      }`}
                    >
                      <img
                        src={thumbSrc}
                        alt={item.caption}
                        className="w-14 h-10 rounded object-cover shrink-0 border border-black/10"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="block text-[11px] font-bold truncate">
                          0{idx + 1}. {item.viewType}
                        </span>
                        <span
                          className={`block text-[11px] truncate ${
                            selectedGalleryIndex === idx ? 'text-white/85' : 'text-[#69736D]'
                          }`}
                        >
                          {item.caption}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Key Specifications Matrix */}
          <section className="bg-white border border-[#E3E7E3] rounded-xl p-6">
            <h2 className="text-lg font-bold text-[#202923] mb-4">
              Key Property Specifications
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-2 border-t border-[#E3E7E3]">
              <div>
                <span className="block text-xs text-[#69736D]">Land / Floor Area</span>
                <span className="text-base font-bold text-[#202923] font-mono-tabular">
                  {property.specifications.plot_size_sqm.toLocaleString()} SQM
                </span>
              </div>
              <div>
                <span className="block text-xs text-[#69736D]">Bedrooms</span>
                <span className="text-base font-bold text-[#202923] font-mono-tabular">
                  {property.specifications.bedrooms !== undefined
                    ? `${property.specifications.bedrooms} En-Suite`
                    : 'N/A (Plot/Comm.)'}
                </span>
              </div>
              <div>
                <span className="block text-xs text-[#69736D]">Bathrooms</span>
                <span className="text-base font-bold text-[#202923] font-mono-tabular">
                  {property.specifications.bathrooms !== undefined
                    ? property.specifications.bathrooms
                    : 'N/A'}
                </span>
              </div>
              <div>
                <span className="block text-xs text-[#69736D]">Parking Allocation</span>
                <span className="text-base font-bold text-[#202923] font-mono-tabular">
                  {property.specifications.parking_spaces !== undefined
                    ? `${property.specifications.parking_spaces} Vehicles`
                    : 'Ample On-Site'}
                </span>
              </div>
            </div>
          </section>

          {/* Property Description */}
          <section className="bg-white border border-[#E3E7E3] rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-[#202923]">Property Overview</h2>
            <p className="text-sm sm:text-base text-[#202923]/90 leading-relaxed">
              {property.description}
            </p>

            {/* Approved Documentation Details */}
            <div className="pt-4 border-t border-[#E3E7E3]">
              <div className="flex items-start gap-3">
                <FileCheck2 className="w-5 h-5 text-[#174C3C] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-[#202923]">
                    Approved Title &amp; Documentation Status
                  </h3>
                  <p className="text-sm text-[#69736D] mt-0.5">
                    {property.specifications.title_document}
                  </p>
                  <p className="text-xs text-[#69736D] mt-1">
                    Note: Prospective buyers and their legal counsel are encouraged to conduct independent registry verification during the formal inspection and due diligence stage.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Estate Features & Infrastructure */}
          <section className="bg-white border border-[#E3E7E3] rounded-xl p-6">
            <h2 className="text-lg font-bold text-[#202923] mb-4">
              Infrastructure &amp; Amenities
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#202923]">
              {property.specifications.amenities.map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#174C3C] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right Column: Action Console (Inspection Request, Enquiry Form, WhatsApp Direct) */}
        <div className="lg:col-span-5 bg-white border border-[#E3E7E3] rounded-xl p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-xs text-[#69736D] font-mono-tabular">
              LISTING REF: {property.reference}
            </span>
            <h2 className="text-xl font-bold text-[#202923] mt-1">
              Schedule an Inspection or Enquire
            </h2>
            <p className="text-xs text-[#69736D] mt-1">
              All submissions automatically attach reference{' '}
              <strong className="text-[#202923] font-mono-tabular">{property.reference}</strong>{' '}
              for immediate advisory follow-up.
            </p>
          </div>

          {!isAvailable && (
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
              <strong>Current Status: {property.availability_status}.</strong> This listing is not currently marked as available for immediate acquisition. You may still submit an enquiry for similar properties in {property.location}.
            </div>
          )}

          {/* Segmented Control: Inspection Request vs Property Enquiry */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#FAF9F6] border border-[#E3E7E3] rounded-lg">
            <button
              type="button"
              onClick={() => setActiveFormTab('inspection')}
              className={`py-2 px-3 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeFormTab === 'inspection'
                  ? 'bg-[#174C3C] text-white'
                  : 'text-[#69736D] hover:text-[#202923]'
              }`}
            >
              Book Inspection
            </button>
            <button
              type="button"
              onClick={() => setActiveFormTab('enquiry')}
              className={`py-2 px-3 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeFormTab === 'enquiry'
                  ? 'bg-[#174C3C] text-white'
                  : 'text-[#69736D] hover:text-[#202923]'
              }`}
            >
              Enquire Online
            </button>
          </div>

          {activeFormTab === 'inspection' ? (
            savedInspection ? (
              <div className="p-5 rounded-xl bg-[#EAF2ED] border border-[#174C3C]/25 space-y-3">
                <div className="flex items-center gap-2 text-[#174C3C] font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Inspection Request Received</span>
                </div>
                <p className="text-xs text-[#202923] leading-relaxed">
                  Thank you, <strong>{savedInspection.full_name}</strong>. Your inspection request for{' '}
                  <strong>{property.title}</strong> has been logged with reference{' '}
                  <strong className="font-mono-tabular">
                    {savedInspection.inspection_reference}
                  </strong>
                  .
                </p>
                <div className="text-xs text-[#69736D] pt-2 border-t border-[#174C3C]/15 space-y-1">
                  <p>
                    Requested Slot:{' '}
                    <strong className="text-[#202923] font-mono-tabular">
                      {formatDateReadable(savedInspection.preferred_date)} at{' '}
                      {savedInspection.preferred_time}
                    </strong>
                  </p>
                  <p>
                    Appointment Status:{' '}
                    <strong className="text-[#174C3C]">
                      Pending Administrator Confirmation
                    </strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSavedInspection(null)}
                  className="text-xs font-semibold text-[#174C3C] underline cursor-pointer pt-1"
                >
                  Submit another inspection request
                </button>
              </div>
            ) : (
              <form onSubmit={handleInspectionSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#202923] mb-1">
                    Property Reference
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={`${property.reference} — ${property.title}`}
                    className="w-full px-3.5 py-2 text-xs font-mono-tabular bg-[#FAF9F6] border border-[#E3E7E3] rounded-lg text-[#69736D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#202923] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={inspName}
                    onChange={(e) => setInspName(e.target.value)}
                    placeholder="e.g. Engr. Kunle Adebayo"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E3E7E3] rounded-lg focus:outline-none focus:border-[#174C3C]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#202923] mb-1">
                      Phone Number (Nigeria / Int’l) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={inspPhone}
                      onChange={(e) => setInspPhone(e.target.value)}
                      placeholder="+234 803 000 0000"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E3E7E3] rounded-lg focus:outline-none focus:border-[#174C3C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#202923] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={inspEmail}
                      onChange={(e) => setInspEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E3E7E3] rounded-lg focus:outline-none focus:border-[#174C3C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#202923] mb-1">
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={inspDate}
                      onChange={(e) => setInspDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E3E7E3] rounded-lg focus:outline-none focus:border-[#174C3C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#202923] mb-1">
                      Preferred Time *
                    </label>
                    <select
                      value={inspTime}
                      onChange={(e) => setInspTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E3E7E3] rounded-lg focus:outline-none focus:border-[#174C3C]"
                    >
                      <option value="10:00 AM">10:00 AM WAT</option>
                      <option value="11:00 AM">11:00 AM WAT</option>
                      <option value="01:00 PM">01:00 PM WAT</option>
                      <option value="03:00 PM">03:00 PM WAT</option>
                      <option value="04:30 PM">04:30 PM WAT</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#202923] mb-1">
                    Additional Notes (Physical vs Virtual Inspection)
                  </label>
                  <textarea
                    rows={2}
                    value={inspMessage}
                    onChange={(e) => setInspMessage(e.target.value)}
                    placeholder="Specify if requesting an in-person site visit or live video walk-through..."
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#E3E7E3] rounded-lg focus:outline-none focus:border-[#174C3C]"
                  />
                </div>

                <label className="flex items-start gap-2.5 text-xs text-[#69736D] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inspConsent}
                    onChange={(e) => setInspConsent(e.target.checked)}
                    className="mt-0.5 accent-[#174C3C]"
                  />
                  <span>
                    I consent to Elvins Properties contacting me by phone, WhatsApp, or email to confirm this inspection request.
                  </span>
                </label>

                {inspError && (
                  <p className="text-xs text-red-700 font-medium">{inspError}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#174C3C] hover:bg-[#123B2E] text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Request Site Inspection</span>
                </button>
              </form>
            )
          ) : savedEnquiry ? (
            <div className="p-5 rounded-xl bg-[#EAF2ED] border border-[#174C3C]/25 space-y-3">
              <div className="flex items-center gap-2 text-[#174C3C] font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Property Enquiry Saved</span>
              </div>
              <p className="text-xs text-[#202923] leading-relaxed">
                Thank you, <strong>{savedEnquiry.full_name}</strong>. Your enquiry regarding{' '}
                <strong className="font-mono-tabular">{property.reference}</strong> has been logged under reference{' '}
                <strong className="font-mono-tabular">{savedEnquiry.enquiry_reference}</strong>. An advisor will respond shortly.
              </p>
              <button
                type="button"
                onClick={() => setSavedEnquiry(null)}
                className="text-xs font-semibold text-[#174C3C] underline cursor-pointer"
              >
                Send another enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleEnquirySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#202923] mb-1">
                  Property Reference
                </label>
                <input
                  type="text"
                  readOnly
                  value={`${property.reference} — ${property.title}`}
                  className="w-full px-3.5 py-2 text-xs font-mono-tabular bg-[#FAF9F6] border border-[#E3E7E3] rounded-lg text-[#69736D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202923] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={enqName}
                  onChange={(e) => setEnqName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E3E7E3] rounded-lg focus:outline-none focus:border-[#174C3C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#202923] mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={enqPhone}
                    onChange={(e) => setEnqPhone(e.target.value)}
                    placeholder="+234 803 000 0000"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E3E7E3] rounded-lg focus:outline-none focus:border-[#174C3C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#202923] mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={enqEmail}
                    onChange={(e) => setEnqEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E3E7E3] rounded-lg focus:outline-none focus:border-[#174C3C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202923] mb-1">
                  Enquiry Message *
                </label>
                <textarea
                  rows={3}
                  required
                  value={enqMessage}
                  onChange={(e) => setEnqMessage(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#E3E7E3] rounded-lg focus:outline-none focus:border-[#174C3C]"
                />
              </div>

              <label className="flex items-start gap-2.5 text-xs text-[#69736D] cursor-pointer">
                <input
                  type="checkbox"
                  checked={enqConsent}
                  onChange={(e) => setEnqConsent(e.target.checked)}
                  className="mt-0.5 accent-[#174C3C]"
                />
                <span>
                  I agree to be contacted by Elvins Properties regarding this property enquiry in accordance with the Privacy Notice.
                </span>
              </label>

              {enqError && (
                <p className="text-xs text-red-700 font-medium">{enqError}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#174C3C] hover:bg-[#123B2E] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Submit Property Enquiry
              </button>
            </form>
          )}

          {/* Direct WhatsApp Enquiry CTA with Pre-filled Reference */}
          <div className="pt-4 border-t border-[#E3E7E3]">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onTrackWhatsAppClick}
              className="w-full py-2.5 px-4 bg-[#EAF2ED] hover:bg-[#d8e8de] text-[#174C3C] text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Enquire via WhatsApp (Ref: {property.reference})</span>
            </a>
          </div>
        </div>
      </div>

      {/* Related Properties */}
      {relatedProperties.length > 0 && (
        <section className="mt-16 pt-12 border-t border-[#E3E7E3]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#202923]">
                Related Properties
              </h2>
              <p className="text-sm text-[#69736D]">
                Comparable listings curated by Elvins Properties
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProperties.slice(0, 3).map((rel) => (
              <PropertyCard
                key={rel.id}
                property={rel}
                onSelect={onSelectProperty}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
