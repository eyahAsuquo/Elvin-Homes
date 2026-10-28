import React, { useState } from 'react';
import {
  BusinessSettings,
  Property,
  PropertyEnquiry,
} from '../types';
import { buildGeneralWhatsAppUrl } from '../utils/formatters';
import {
  Building2,
  CheckCircle2,
  Compass,
  GraduationCap,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
} from 'lucide-react';

interface ServicesViewProps {
  settings: BusinessSettings;
  onExploreProperties: () => void;
  onExploreAcademy: () => void;
  onNavigateContact: () => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  settings,
  onExploreProperties,
  onExploreAcademy,
  onNavigateContact,
}) => {
  const services = [
    {
      index: '01.',
      title: 'Residential & Commercial Property Marketing',
      division: 'Elvins Properties',
      imageUrl: '/images/lekki-villa-ext.jpg',
      description:
        'Structured marketing and mandate representation for detached residences, waterfront apartments, commercial floors, and serviced land plots across Lagos and Abuja.',
      deliverables: [
        'Verified property catalogue profiling with transparent guide pricing',
        'Pre-qualified buyer and corporate tenant matching',
        'Coordinated physical and live virtual site inspections',
      ],
    },
    {
      index: '02.',
      title: 'Real Estate Investment & Land Banking Advisory',
      division: 'Elvins Properties',
      imageUrl: '/images/aerial-estate.jpg',
      description:
        'Objective acquisition guidance for individual and diaspora investors evaluating growth corridors such as Lekki, Ikoyi, Victoria Island, Ketu-Epe, and Guzape.',
      deliverables: [
        'Preliminary review of offered title documents (C of O, Governor’s Consent, Gazette)',
        'Milestone payment schedule coordination with vetted developers',
        'Rental yield and capital appreciation benchmarking',
      ],
    },
    {
      index: '03.',
      title: 'Practitioner Brokerage & Agency Training',
      division: 'Consultant Real Estate Academy',
      imageUrl: '/images/academy-masterclass.jpg',
      description:
        'Practical, cohort-based training programmes for aspiring and practicing real estate consultants seeking repeatable sales systems and ethical practice standards.',
      deliverables: [
        'Client mandate structuring and commission protection workflows',
        'Land title verification clinics and survey plan literacy',
        'In-person Lekki workshops and live interactive virtual classrooms',
      ],
    },
    {
      index: '04.',
      title: 'Corporate Real Estate Sales Team Training',
      division: 'Consultant Real Estate Academy',
      imageUrl: '/images/advisory-consultation.jpg',
      description:
        'Customised in-house advisory workshops for real estate development firms and brokerage teams looking to improve inspection-to-close conversion rates.',
      deliverables: [
        'Lead follow-up and CRM pipeline discipline',
        'Objection handling for high-value Nigerian property transactions',
        'Post-training assessment and practical case dossiers',
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
      {/* Header Split with Architectural Photo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7">
          <div className="text-xs text-[#69736D] mb-2">
            <span>Advisory &amp; Education Capabilities</span>
            <span aria-hidden="true"> · </span>
            <span>Nigeria</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#202923] tracking-tight mb-4 balance-text">
            Real Estate Services &amp; Practitioner Development
          </h1>
          <p className="text-base text-[#69736D] leading-relaxed">
            {settings.brand_relationship_statement}
          </p>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-xl overflow-hidden border border-[#E3E7E3] aspect-video">
            <img
              src="/images/site-inspection.jpg"
              alt="Elvins Properties Advisory & Site Inspection Service"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* 4 Service Cards with Real Photography */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((srv) => (
          <div
            key={srv.index}
            className="bg-white border border-[#E3E7E3] rounded-xl overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="aspect-[16/9] overflow-hidden border-b border-[#E3E7E3]">
                <img
                  src={srv.imageUrl}
                  alt={srv.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-7 space-y-3">
                <div className="flex items-center gap-2 text-xs text-[#69736D]">
                  <span className="font-mono-tabular font-bold text-[#174C3C]">
                    {srv.index}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{srv.division}</span>
                </div>
                <h2 className="text-xl font-bold text-[#202923]">{srv.title}</h2>
                <p className="text-sm text-[#69736D] leading-relaxed">
                  {srv.description}
                </p>
              </div>
            </div>

            <div className="px-7 pb-7 pt-4 border-t border-[#E3E7E3] space-y-2 bg-[#FAF9F6]/60">
              <span className="block text-xs font-semibold text-[#202923]">
                Scope of Delivery
              </span>
              <ul className="space-y-1.5 text-xs text-[#69736D]">
                {srv.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#174C3C] mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Scope Transparency Note (PRD Section 3.3 & 17.4) */}
      <div className="bg-white border border-[#E3E7E3] rounded-xl p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-1.5">
          <h3 className="text-base font-bold text-[#202923]">
            Professional Scope &amp; Due Diligence Notice
          </h3>
          <p className="text-xs text-[#69736D] leading-relaxed">
            Elvins Properties provides property marketing, inspection coordination, and transaction advisory. Formal statutory title perfection and independent legal verification should always be completed in consultation with a qualified legal practitioner.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onExploreProperties}
            className="px-4 py-2.5 bg-[#174C3C] hover:bg-[#123B2E] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Browse Properties
          </button>
          <button
            type="button"
            onClick={onExploreAcademy}
            className="px-4 py-2.5 bg-[#EAF2ED] hover:bg-[#d8e8de] text-[#174C3C] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            View Academy Courses
          </button>
          <button
            type="button"
            onClick={onNavigateContact}
            className="px-4 py-2.5 bg-white border border-[#E3E7E3] hover:bg-[#FAF9F6] text-[#202923] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Speak With Us
          </button>
        </div>
      </div>
    </div>
  );
};

interface AboutViewProps {
  settings: BusinessSettings;
  onExploreProperties: () => void;
  onExploreAcademy: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  settings,
  onExploreProperties,
  onExploreAcademy,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Corporate Profile Split Header with Real Photograph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7">
          <div className="text-xs text-[#69736D] mb-2">
            <span>Corporate Profile</span>
            <span aria-hidden="true"> · </span>
            <span>Lagos &amp; Abuja, Nigeria</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#202923] tracking-tight mb-4 balance-text">
            About {settings.company_name} &amp; {settings.academy_name}
          </h1>
          <p className="text-base text-[#69736D] leading-relaxed">
            We operate across two complementary pillars of the Nigerian real estate ecosystem: connecting buyers and investors with vetted residential, commercial, and land opportunities, while equipping real estate practitioners with structured commercial education.
          </p>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-xl overflow-hidden border border-[#E3E7E3] aspect-video">
            <img
              src="/images/advisory-consultation.jpg"
              alt="Elvins Properties and Consultant Real Estate Academy Executive Team"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Dual Pillar Breakdown with Real Photographs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-[#E3E7E3] rounded-xl overflow-hidden flex flex-col justify-between">
          <div>
            <div className="aspect-[16/9] overflow-hidden border-b border-[#E3E7E3]">
              <img
                src="/images/lekki-villa-ext.jpg"
                alt={settings.company_name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#174C3C]">
                <Building2 className="w-4 h-4" />
                <span>Pillar 01 · Property Marketing &amp; Advisory</span>
              </div>
              <h2 className="text-2xl font-bold text-[#202923]">{settings.company_name}</h2>
              <p className="text-sm text-[#69736D] leading-relaxed">
                {settings.company_name} curates residential duplexes, waterfront apartments, commercial floors, and surveyed land developments across high-growth corridors in Nigeria. Every listing carries a unique reference code, clear availability status, and transparent specification sheet so buyers can make informed decisions and request inspections without friction.
              </p>
            </div>
          </div>
          <div className="px-8 pb-8">
            <button
              type="button"
              onClick={onExploreProperties}
              className="px-4 py-2.5 bg-[#174C3C] hover:bg-[#123B2E] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Explore Property Catalogue
            </button>
          </div>
        </div>

        <div className="bg-white border border-[#E3E7E3] rounded-xl overflow-hidden flex flex-col justify-between">
          <div>
            <div className="aspect-[16/9] overflow-hidden border-b border-[#E3E7E3]">
              <img
                src="/images/academy-masterclass.jpg"
                alt={settings.academy_name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#174C3C]">
                <GraduationCap className="w-4 h-4" />
                <span>Pillar 02 · Real Estate Education</span>
              </div>
              <h2 className="text-2xl font-bold text-[#202923]">{settings.academy_name}</h2>
              <p className="text-sm text-[#69736D] leading-relaxed">
                {settings.academy_name} delivers practical, practitioner-led courses covering brokerage operations, land title due diligence, property valuation, and real estate investment feasibility. Prospective trainees can review detailed curricula, schedules, and fees online and receive immediate registration references.
              </p>
            </div>
          </div>
          <div className="px-8 pb-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onExploreAcademy}
              className="px-4 py-2.5 bg-[#174C3C] hover:bg-[#123B2E] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Browse Training Programmes
            </button>
            {settings.google_sites_mode === 'Coexisting Academy Landing' && (
              <a
                href={settings.google_sites_legacy_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#174C3C] underline"
              >
                Visit Legacy Google Sites Portal
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Brand Clarification & Operating Principles */}
      <div className="bg-white border border-[#E3E7E3] rounded-xl p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#174C3C]">
            <Compass className="w-4 h-4" />
            <span>Brand Relationship &amp; Transparency</span>
          </div>
          <h3 className="text-lg font-bold text-[#202923]">
            How Both Divisions Work Together
          </h3>
          <p className="text-sm text-[#69736D] leading-relaxed">
            {settings.brand_relationship_statement} Course certificates issued by Consultant Real Estate Academy represent completion of our proprietary professional training programmes and do not claim statutory government regulatory licensure.
          </p>
        </div>
        <div className="lg:col-span-4">
          <div className="rounded-xl overflow-hidden border border-[#E3E7E3] aspect-video">
            <img
              src="/images/office-suite.jpg"
              alt="Lekki Phase 1 Executive Suite"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface ContactViewProps {
  settings: BusinessSettings;
  properties: Property[];
  onSubmitGeneralEnquiry: (
    data: Omit<
      PropertyEnquiry,
      'id' | 'enquiry_reference' | 'lead_status' | 'internal_notes' | 'created_at' | 'updated_at'
    >
  ) => PropertyEnquiry;
  onTrackWhatsAppClick: () => void;
}

export const ContactView: React.FC<ContactViewProps> = ({
  settings,
  properties,
  onSubmitGeneralEnquiry,
  onTrackWhatsAppClick,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedPropertyId, setSelectedPropertyId] = useState('GENERAL');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [submittedRecord, setSubmittedRecord] = useState<PropertyEnquiry | null>(null);

  const whatsappUrl = buildGeneralWhatsAppUrl(settings.whatsapp_number);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !phone.trim() || !message.trim()) {
      setError('Please complete your full name, phone number, and enquiry message.');
      return;
    }
    if (!consent) {
      setError('Please confirm your consent to be contacted.');
      return;
    }

    const matchedProp = properties.find((p) => p.id === selectedPropertyId);

    const saved = onSubmitGeneralEnquiry({
      property_id: matchedProp ? matchedProp.id : 'general',
      property_reference: matchedProp ? matchedProp.reference : 'GENERAL-ENQ',
      property_title: matchedProp
        ? matchedProp.title
        : 'General Property / Academy Enquiry',
      full_name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      message: message.trim(),
      consent_status: consent,
      source: 'General Contact',
    });

    setSubmittedRecord(saved);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="text-xs text-[#69736D] mb-2">
              <span>Client &amp; Trainee Desk</span>
              <span aria-hidden="true"> · </span>
              <span>Monday – Saturday, 8:30 AM – 6:00 PM WAT</span>
            </div>
            <h1 className="text-3xl font-bold text-[#202923] tracking-tight mb-3">
              Contact Elvins Properties &amp; Consultant Academy
            </h1>
            <p className="text-sm text-[#69736D] leading-relaxed">
              Whether you are enquiring about a specific property, scheduling a site inspection, or registering for an upcoming training cohort, our team responds promptly.
            </p>
          </div>

          <div className="bg-white border border-[#E3E7E3] rounded-xl overflow-hidden">
            <div className="aspect-[16/9] overflow-hidden border-b border-[#E3E7E3]">
              <img
                src="/images/office-suite.jpg"
                alt="Elvins Properties Lekki Phase 1 Office & Training Suite"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#174C3C] shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-xs font-bold text-[#202923]">Office &amp; Training Suite</h2>
                  <p className="text-sm text-[#69736D] mt-0.5">{settings.office_address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#174C3C] shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-xs font-bold text-[#202923]">Telephone &amp; WhatsApp Desk</h2>
                  <p className="text-sm font-mono-tabular text-[#202923] mt-0.5">
                    +{settings.whatsapp_number}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#174C3C] shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-xs font-bold text-[#202923]">Email Enquiries</h2>
                  <p className="text-sm text-[#69736D] mt-0.5">{settings.notification_email}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E3E7E3]">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onTrackWhatsAppClick}
                  className="w-full py-3 px-4 bg-[#174C3C] hover:bg-[#123B2E] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Start WhatsApp Conversation</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white border border-[#E3E7E3] rounded-xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-[#202923] mb-1">
            Send an Online Enquiry
          </h2>
          <p className="text-xs text-[#69736D] mb-6">
            Your message is saved directly to our central lead desk and triggers an immediate administrator notification.
          </p>

          {submittedRecord ? (
            <div className="p-6 rounded-xl bg-[#EAF2ED] border border-[#174C3C]/25 space-y-3">
              <div className="flex items-center gap-2 text-[#174C3C] font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Enquiry Received ({submittedRecord.enquiry_reference})</span>
              </div>
              <p className="text-sm text-[#202923]">
                Thank you, <strong>{submittedRecord.full_name}</strong>. We have logged your message and will contact you on{' '}
                <strong className="font-mono-tabular">{submittedRecord.phone}</strong>.
              </p>
              <button
                type="button"
                onClick={() => setSubmittedRecord(null)}
                className="text-xs font-semibold text-[#174C3C] underline cursor-pointer"
              >
                Submit another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#202923] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E3E7E3] rounded-lg focus:outline-none focus:border-[#174C3C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#202923] mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 803 000 0000"
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E3E7E3] rounded-lg focus:outline-none focus:border-[#174C3C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#202923] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E3E7E3] rounded-lg focus:outline-none focus:border-[#174C3C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#202923] mb-1">
                    Subject / Related Property
                  </label>
                  <select
                    value={selectedPropertyId}
                    onChange={(e) => setSelectedPropertyId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E3E7E3] rounded-lg bg-white focus:outline-none focus:border-[#174C3C]"
                  >
                    <option value="GENERAL">General Property or Academy Enquiry</option>
                    {properties
                      .filter((p) => p.publication_status === 'Published')
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.reference} — {p.title}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202923] mb-1">
                  Enquiry Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can Elvins Properties or Consultant Real Estate Academy assist you?"
                  className="w-full px-3.5 py-2.5 text-sm border border-[#E3E7E3] rounded-lg focus:outline-none focus:border-[#174C3C]"
                />
              </div>

              <label className="flex items-start gap-2.5 text-xs text-[#69736D] cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 accent-[#174C3C]"
                />
                <span>
                  I consent to Elvins Properties &amp; Consultant Real Estate Academy storing my contact details and responding to this enquiry in accordance with the Nigerian Data Protection Act (NDPA).
                </span>
              </label>

              {error && <p className="text-xs text-red-700 font-medium">{error}</p>}

              <button
                type="submit"
                className="px-6 py-3 bg-[#174C3C] hover:bg-[#123B2E] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Submit Enquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const LegalView: React.FC<{
  type: 'privacy' | 'terms';
  settings: BusinessSettings;
}> = ({ type, settings }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white border border-[#E3E7E3] rounded-xl p-8 space-y-6">
        <div className="flex items-center gap-2 text-xs text-[#174C3C] font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>
            {type === 'privacy'
              ? 'Data Protection & Privacy Notice (NDPA Compliant)'
              : 'Website Terms of Use & Advisory Disclaimer'}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#202923]">
          {type === 'privacy' ? 'Privacy Policy' : 'Terms of Use'}
        </h1>

        {type === 'privacy' ? (
          <div className="space-y-4 text-sm text-[#69736D] leading-relaxed">
            <p>
              <strong className="text-[#202923]">1. Purpose of Data Collection:</strong>{' '}
              {settings.company_name} and {settings.academy_name} collect only the personal contact information (full name, phone number, email address, and enquiry preferences) necessary to respond to property enquiries, coordinate site inspection appointments, and process training course registrations.
            </p>
            <p>
              <strong className="text-[#202923]">2. Consent &amp; Lawful Basis:</strong> By submitting an enquiry, inspection request, or course registration form on this platform, you provide explicit consent to be contacted by our authorised staff via phone, email, or WhatsApp regarding your specific request.
            </p>
            <p>
              <strong className="text-[#202923]">3. Access Restriction &amp; Security:</strong> Incoming enquiry records and trainee registration lists are never exposed publicly. Access is restricted strictly to authorised administrators and staff. Raw payment card credentials are never stored on this website.
            </p>
            <p>
              <strong className="text-[#202923]">4. Data Retention &amp; Deletion Requests:</strong> In accordance with applicable Nigerian Data Protection Act (NDPA) requirements, you may request access to, correction of, or deletion of your personal record at any time by contacting{' '}
              <strong className="text-[#202923]">{settings.notification_email}</strong>.
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-sm text-[#69736D] leading-relaxed">
            <p>
              <strong className="text-[#202923]">1. Property Listing Accuracy:</strong>{' '}
              {settings.company_name} takes reasonable care to ensure that published property specifications, guide prices, and availability statuses are accurate at the time of publication. However, property prices and availability are subject to change prior to formal contract exchange.
            </p>
            <p>
              <strong className="text-[#202923]">2. Inspection Appointments:</strong> Submitting an online inspection request initiates an appointment workflow and remains subject to confirmation by an administrator.
            </p>
            <p>
              <strong className="text-[#202923]">3. Legal Due Diligence:</strong> Website listing descriptions do not constitute legal advice or a formal contract of sale. Prospective buyers are advised to engage independent legal and survey professionals to verify land registry titles prior to payment.
            </p>
            <p>
              <strong className="text-[#202923]">4. Academy Registrations:</strong> Online registration reserves a provisional trainee slot under a unique reference number. Full seat confirmation is completed upon verification of applicable course tuition.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
