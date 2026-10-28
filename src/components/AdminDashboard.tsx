import React, { useState } from 'react';
import {
  Property,
  Course,
  Registration,
  PropertyEnquiry,
  InspectionRequest,
  BusinessSettings,
  NotificationLogItem,
  AnalyticsSummary,
  UserRole,
  PropertyCategory,
  TransactionType,
  PropertyAvailability,
  PublicationStatus,
  CourseStatus,
  DeliveryMethod,
  LeadStatus,
  InspectionStatus,
  RegistrationStatus,
  ArchitecturalVisualPreset,
} from '../types';
import {
  formatNaira,
  formatDateReadable,
  exportRecordsToCsv,
} from '../utils/formatters';
import { resolveVisualUrl } from './ArchitecturalVisual';
import {
  Download,
  Eye,
  Plus,
  Search,
  Shield,
  Sliders,
  Upload,
} from 'lucide-react';

interface AdminDashboardProps {
  properties: Property[];
  courses: Course[];
  registrations: Registration[];
  enquiries: PropertyEnquiry[];
  inspections: InspectionRequest[];
  notifications: NotificationLogItem[];
  analytics: AnalyticsSummary;
  settings: BusinessSettings;
  onSaveProperty: (property: Property) => void;
  onSaveCourse: (course: Course) => void;
  onUpdateEnquiry: (id: string, status: LeadStatus, notes: string) => void;
  onUpdateInspection: (id: string, status: InspectionStatus, notes: string) => void;
  onUpdateRegistration: (id: string, status: RegistrationStatus, notes: string) => void;
  onUpdateSettings: (settings: BusinessSettings) => void;
  onPreviewProperty: (property: Property) => void;
  onPreviewCourse: (course: Course) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  properties,
  courses,
  registrations,
  enquiries,
  inspections,
  notifications,
  analytics,
  settings,
  onSaveProperty,
  onSaveCourse,
  onUpdateEnquiry,
  onUpdateInspection,
  onUpdateRegistration,
  onUpdateSettings,
  onPreviewProperty,
  onPreviewCourse,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'properties' | 'courses' | 'leads' | 'settings'
  >('overview');
  const [role, setRole] = useState<UserRole>('Administrator');
  const [permissionNotice, setPermissionNotice] = useState('');

  // Leads sub-tab & filter
  const [leadSubTab, setLeadSubTab] = useState<'enquiries' | 'inspections' | 'registrations'>(
    'enquiries'
  );
  const [leadSearch, setLeadSearch] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('ALL');

  // Property Editor Modal/Drawer State
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Course Editor State
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Settings Form State
  const [draftSettings, setDraftSettings] = useState<BusinessSettings>(settings);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(false);

  // Summary Metrics (PRD Section 9.1)
  const publishedPropertiesCount = properties.filter(
    (p) => p.publication_status === 'Published' && p.availability_status !== 'Archived'
  ).length;
  const availablePropertiesCount = properties.filter(
    (p) => p.publication_status === 'Published' && p.availability_status === 'Available'
  ).length;
  const upcomingCoursesCount = courses.filter(
    (c) =>
      c.publication_status === 'Published' &&
      (c.registration_status === 'Registration Open' || c.registration_status === 'Upcoming')
  ).length;
  const newRegistrationsCount = registrations.filter(
    (r) => r.registration_status === 'New' || r.registration_status === 'Awaiting Payment'
  ).length;
  const pendingEnquiriesCount = enquiries.filter((e) => e.lead_status === 'New').length;
  const pendingInspectionsCount = inspections.filter(
    (i) => i.inspection_status === 'Pending'
  ).length;

  const requireAdminPermission = (actionName: string): boolean => {
    if (role !== 'Administrator') {
      setPermissionNotice(
        `Access Restricted: "${actionName}" requires Administrator privileges. Current active role is Staff.`
      );
      setTimeout(() => setPermissionNotice(''), 4000);
      return false;
    }
    return true;
  };

  const handleCreateNewProperty = () => {
    if (!requireAdminPermission('Create Property Listing')) return;
    const nextNum = properties.length + 1;
    const newProp: Property = {
      id: `prop-${Date.now()}`,
      reference: `ELV-LAG-00${nextNum}`,
      title: 'New 4-Bedroom Contemporary Terrace Duplex',
      slug: `new-4-bedroom-terrace-duplex-${Date.now().toString().slice(-4)}`,
      description:
        'Newly developed residential property featuring modern architectural finishes, ample parking, and verified title documentation.',
      property_type: 'Residential Houses',
      transaction_type: 'For Sale',
      location: 'Lekki Phase 1, Lagos',
      state: 'Lagos',
      price: 195000000,
      price_on_request: false,
      payment_plan_summary: 'Outright or 6-month structured milestone payment',
      currency: 'NGN',
      specifications: {
        bedrooms: 4,
        bathrooms: 5,
        plot_size_sqm: 360,
        parking_spaces: 3,
        title_document: 'Governor’s Consent',
        serviced: true,
        district_zone: 'Lekki Residential Zone',
        amenities: ['24-Hour Security', 'Treated Water Plant', 'Service Quarters (BQ)'],
      },
      gallery: [
        {
          id: `gal-${Date.now()}`,
          caption: 'Primary Architectural Elevation',
          viewType: 'Exterior',
          preset: 'lekki_villa',
        },
      ],
      availability_status: 'Available',
      publication_status: 'Draft',
      featured: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setEditingProperty(newProp);
  };

  const handleCreateNewCourse = () => {
    if (!requireAdminPermission('Create Academy Course')) return;
    const nextNum = courses.length + 101;
    const newCourse: Course = {
      id: `crs-${Date.now()}`,
      reference: `CRA-2026-${nextNum}`,
      title: 'Real Estate Sales Mastery & Client Advisory Workshop',
      slug: `real-estate-sales-mastery-${Date.now().toString().slice(-4)}`,
      short_description:
        'Practical workshop on property prospecting, inspection conversion, and closing high-value real estate mandates in Nigeria.',
      description:
        'Structured training programme equipping real estate consultants with ethical brokerage tools, valuation fundamentals, and repeatable client acquisition workflows.',
      learning_objectives: [
        'Qualify prospective buyers and investors accurately.',
        'Coordinate seamless site inspections and follow-up sequences.',
        'Understand fundamental Nigerian land title documentation.',
      ],
      modules: [
        {
          code: 'MOD 01',
          title: 'Consultative Property Marketing',
          summary: 'Positioning residential and commercial listings with clarity.',
        },
        {
          code: 'MOD 02',
          title: 'Inspection Conversion & Closing',
          summary: 'Managing post-inspection objections and documentation handover.',
        },
      ],
      target_audience: 'Real estate consultants, sales executives, and agency team leads.',
      duration: '2 Weeks (Weekends)',
      start_date: '2026-12-12',
      schedule: 'Saturdays 10:00 AM – 2:00 PM WAT',
      delivery_method: 'Hybrid',
      venue: 'Lekki Phase 1 Training Suite + Online Live',
      fee: 120000,
      currency: 'NGN',
      registration_deadline: '2026-12-09',
      capacity: 30,
      enrolled_count: 0,
      registration_status: 'Registration Open',
      publication_status: 'Draft',
      visual_preset: 'academy_masterclass',
      faqs: [
        {
          question: 'Is a certificate issued upon completion?',
          answer:
            'Yes, participants who complete all modules receive a Certificate of Completion from Consultant Real Estate Academy.',
        },
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setEditingCourse(newCourse);
  };

  const handleImageFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'property' | 'course'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (target === 'property' && editingProperty) {
        const updatedGallery = [...editingProperty.gallery];
        if (updatedGallery.length > 0) {
          updatedGallery[0] = { ...updatedGallery[0], customImageUrl: result };
        }
        setEditingProperty({ ...editingProperty, gallery: updatedGallery });
      } else if (target === 'course' && editingCourse) {
        setEditingCourse({ ...editingCourse, custom_image_url: result });
      }
    };
    reader.readAsDataURL(file);
  };

  // Filtered Lead Lists
  const filteredEnquiries = enquiries.filter(
    (e) =>
      e.full_name.toLowerCase().includes(leadSearch.toLowerCase()) ||
      e.property_reference.toLowerCase().includes(leadSearch.toLowerCase()) ||
      e.enquiry_reference.toLowerCase().includes(leadSearch.toLowerCase()) ||
      e.phone.includes(leadSearch)
  );

  const filteredInspections = inspections.filter(
    (i) =>
      i.full_name.toLowerCase().includes(leadSearch.toLowerCase()) ||
      i.property_reference.toLowerCase().includes(leadSearch.toLowerCase()) ||
      i.inspection_reference.toLowerCase().includes(leadSearch.toLowerCase()) ||
      i.phone.includes(leadSearch)
  );

  const filteredRegistrations = registrations.filter((r) => {
    const matchesCourse =
      selectedCourseFilter === 'ALL' || r.course_id === selectedCourseFilter;
    const matchesSearch =
      r.full_name.toLowerCase().includes(leadSearch.toLowerCase()) ||
      r.registration_reference.toLowerCase().includes(leadSearch.toLowerCase()) ||
      r.course_reference.toLowerCase().includes(leadSearch.toLowerCase()) ||
      r.email.toLowerCase().includes(leadSearch.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Header & Role Switcher */}
      <div className="bg-white border border-[#E3E7E3] rounded-xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#69736D] mb-1">
            <span>Management Console</span>
            <span aria-hidden="true">·</span>
            <span>Elvins Properties &amp; Consultant Real Estate Academy</span>
          </div>
          <h1 className="text-2xl font-bold text-[#202923]">
            Administrator Content &amp; Lead Operations
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs bg-[#FAF9F6] border border-[#E3E7E3] rounded-lg px-3 py-1.5">
            <Shield className="w-3.5 h-3.5 text-[#174C3C]" />
            <span className="text-[#69736D]">Active Role:</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="font-semibold text-[#202923] bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="Administrator">Administrator (Full Access)</option>
              <option value="Staff">Staff (Lead Follow-Up Only)</option>
            </select>
          </div>
        </div>
      </div>

      {permissionNotice && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 font-medium">
          {permissionNotice}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-white border border-[#E3E7E3] rounded-xl">
        {[
          { id: 'overview', label: 'Dashboard Overview' },
          { id: 'properties', label: `Properties (${properties.length})` },
          { id: 'courses', label: `Academy Courses (${courses.length})` },
          {
            id: 'leads',
            label: `Enquiries, Inspections & Registrations (${
              enquiries.length + inspections.length + registrations.length
            })`,
          },
          { id: 'settings', label: 'Platform & SEO Settings' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#174C3C] text-white'
                : 'text-[#69736D] hover:text-[#202923]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: DASHBOARD OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* 6 Required PRD Section 9.1 KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white border border-[#E3E7E3] rounded-xl p-5">
              <span className="block text-xs text-[#69736D]">Published Properties</span>
              <span className="text-2xl font-bold text-[#202923] font-mono-tabular mt-1 block">
                {publishedPropertiesCount}
              </span>
            </div>
            <div className="bg-white border border-[#E3E7E3] rounded-xl p-5">
              <span className="block text-xs text-[#69736D]">Available Properties</span>
              <span className="text-2xl font-bold text-[#174C3C] font-mono-tabular mt-1 block">
                {availablePropertiesCount}
              </span>
            </div>
            <div className="bg-white border border-[#E3E7E3] rounded-xl p-5">
              <span className="block text-xs text-[#69736D]">Upcoming Courses</span>
              <span className="text-2xl font-bold text-[#202923] font-mono-tabular mt-1 block">
                {upcomingCoursesCount}
              </span>
            </div>
            <div className="bg-white border border-[#E3E7E3] rounded-xl p-5">
              <span className="block text-xs text-[#69736D]">New Registrations</span>
              <span className="text-2xl font-bold text-[#174C3C] font-mono-tabular mt-1 block">
                {newRegistrationsCount}
              </span>
            </div>
            <div className="bg-white border border-[#E3E7E3] rounded-xl p-5">
              <span className="block text-xs text-[#69736D]">Pending Enquiries</span>
              <span className="text-2xl font-bold text-amber-800 font-mono-tabular mt-1 block">
                {pendingEnquiriesCount}
              </span>
            </div>
            <div className="bg-white border border-[#E3E7E3] rounded-xl p-5">
              <span className="block text-xs text-[#69736D]">Pending Inspections</span>
              <span className="text-2xl font-bold text-amber-800 font-mono-tabular mt-1 block">
                {pendingInspectionsCount}
              </span>
            </div>
          </div>

          {/* Analytics & Notification Log Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Conversion & Analytics Metrics (PRD Section 1.4 & 14) */}
            <div className="lg:col-span-6 bg-white border border-[#E3E7E3] rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#202923]">
                  Conversion &amp; Traffic Analytics
                </h2>
                <span className="text-xs text-[#69736D] font-mono-tabular">
                  WhatsApp Clicks: {analytics.whatsapp_clicks}
                </span>
              </div>

              <div className="divide-y divide-[#E3E7E3] text-xs">
                {properties.slice(0, 4).map((prop) => (
                  <div key={prop.id} className="py-2.5 flex items-center justify-between gap-4">
                    <span className="truncate text-[#202923]">
                      <strong className="font-mono-tabular">{prop.reference}</strong> ·{' '}
                      {prop.title}
                    </span>
                    <span className="font-mono-tabular text-[#69736D] shrink-0">
                      {analytics.property_views[prop.id] || 0} views
                    </span>
                  </div>
                ))}
                {courses.map((crs) => (
                  <div key={crs.id} className="py-2.5 flex items-center justify-between gap-4">
                    <span className="truncate text-[#202923]">
                      <strong className="font-mono-tabular">{crs.reference}</strong> ·{' '}
                      {crs.title}
                    </span>
                    <span className="font-mono-tabular text-[#174C3C] font-semibold shrink-0">
                      {analytics.course_views[crs.id] || 0} views
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification Reliability Log (PRD Section 10) */}
            <div className="lg:col-span-6 bg-white border border-[#E3E7E3] rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#202923]">
                  Administrator Notification Log
                </h2>
                <span className="text-xs text-[#69736D]">
                  Target: {settings.notification_email}
                </span>
              </div>

              <div className="divide-y divide-[#E3E7E3] text-xs max-h-64 overflow-y-auto">
                {notifications.map((item) => (
                  <div key={item.id} className="py-2.5 space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-[#202923]">{item.subject}</span>
                      <span className="font-mono-tabular text-[#174C3C] font-medium shrink-0">
                        {item.delivery_state}
                      </span>
                    </div>
                    <div className="text-[#69736D] flex items-center gap-2">
                      <span>{item.type}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-tabular">{item.reference}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatDateReadable(item.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROPERTY MANAGEMENT (PRD Section 9.2) */}
      {activeTab === 'properties' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#202923]">
                Property Catalogue Management
              </h2>
              <p className="text-xs text-[#69736D]">
                Create listings, update availability statuses, upload photographs, and control publication visibility.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCreateNewProperty}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#174C3C] hover:bg-[#123B2E] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Property Listing</span>
            </button>
          </div>

          {editingProperty && (
            <div className="bg-white border-2 border-[#174C3C] rounded-xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#E3E7E3] pb-3">
                <h3 className="text-base font-bold text-[#202923]">
                  Editing Property: {editingProperty.reference}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingProperty(null)}
                  className="text-xs text-[#69736D] hover:text-[#202923] cursor-pointer"
                >
                  Close Editor
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Reference Code</label>
                  <input
                    type="text"
                    value={editingProperty.reference}
                    onChange={(e) =>
                      setEditingProperty({ ...editingProperty, reference: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm font-mono-tabular border border-[#E3E7E3] rounded-lg"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold mb-1">Property Title</label>
                  <input
                    type="text"
                    value={editingProperty.title}
                    onChange={(e) =>
                      setEditingProperty({ ...editingProperty, title: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-[#E3E7E3] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Property Category</label>
                  <select
                    value={editingProperty.property_type}
                    onChange={(e) =>
                      setEditingProperty({
                        ...editingProperty,
                        property_type: e.target.value as PropertyCategory,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-[#E3E7E3] rounded-lg bg-white"
                  >
                    <option value="Residential Houses">Residential Houses</option>
                    <option value="Apartments">Apartments</option>
                    <option value="Land">Land</option>
                    <option value="Commercial Properties">Commercial Properties</option>
                    <option value="Estates">Estates</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Transaction Type</label>
                  <select
                    value={editingProperty.transaction_type}
                    onChange={(e) =>
                      setEditingProperty({
                        ...editingProperty,
                        transaction_type: e.target.value as TransactionType,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-[#E3E7E3] rounded-lg bg-white"
                  >
                    <option value="For Sale">For Sale</option>
                    <option value="For Rent">For Rent</option>
                    <option value="For Lease">For Lease</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    value={editingProperty.location}
                    onChange={(e) =>
                      setEditingProperty({ ...editingProperty, location: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-[#E3E7E3] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Price (NGN)</label>
                  <input
                    type="number"
                    disabled={editingProperty.price_on_request}
                    value={editingProperty.price ?? 0}
                    onChange={(e) =>
                      setEditingProperty({
                        ...editingProperty,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 text-sm font-mono-tabular border border-[#E3E7E3] rounded-lg"
                  />
                  <label className="inline-flex items-center gap-2 text-xs text-[#69736D] mt-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProperty.price_on_request}
                      onChange={(e) =>
                        setEditingProperty({
                          ...editingProperty,
                          price_on_request: e.target.checked,
                          price: e.target.checked ? null : editingProperty.price || 150000000,
                        })
                      }
                      className="accent-[#174C3C]"
                    />
                    <span>Display as &ldquo;Price on Request&rdquo;</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Availability Status</label>
                  <select
                    value={editingProperty.availability_status}
                    onChange={(e) =>
                      setEditingProperty({
                        ...editingProperty,
                        availability_status: e.target.value as PropertyAvailability,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-[#E3E7E3] rounded-lg bg-white"
                  >
                    <option value="Available">Available</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Sold">Sold</option>
                    <option value="Rented">Rented</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Publication Status</label>
                  <select
                    value={editingProperty.publication_status}
                    onChange={(e) =>
                      setEditingProperty({
                        ...editingProperty,
                        publication_status: e.target.value as PublicationStatus,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-[#E3E7E3] rounded-lg bg-white"
                  >
                    <option value="Published">Published (Public)</option>
                    <option value="Draft">Draft (Hidden)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Plot / Floor Area (SQM)</label>
                  <input
                    type="number"
                    value={editingProperty.specifications.plot_size_sqm}
                    onChange={(e) =>
                      setEditingProperty({
                        ...editingProperty,
                        specifications: {
                          ...editingProperty.specifications,
                          plot_size_sqm: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-sm font-mono-tabular border border-[#E3E7E3] rounded-lg"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold mb-1">
                    Approved Title Document
                  </label>
                  <input
                    type="text"
                    value={editingProperty.specifications.title_document}
                    onChange={(e) =>
                      setEditingProperty({
                        ...editingProperty,
                        specifications: {
                          ...editingProperty.specifications,
                          title_document: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-[#E3E7E3] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Architectural Preset
                  </label>
                  <select
                    value={editingProperty.gallery[0]?.preset || 'lekki_villa'}
                    onChange={(e) => {
                      const updatedGallery = [...editingProperty.gallery];
                      if (updatedGallery.length > 0) {
                        updatedGallery[0] = {
                          ...updatedGallery[0],
                          preset: e.target.value as ArchitecturalVisualPreset,
                        };
                      }
                      setEditingProperty({ ...editingProperty, gallery: updatedGallery });
                    }}
                    className="w-full px-3 py-2 text-sm border border-[#E3E7E3] rounded-lg bg-white"
                  >
                    <option value="lekki_villa">Lekki Villa Exterior</option>
                    <option value="ikoyi_penthouse">Ikoyi Lagoon Penthouse</option>
                    <option value="abuja_terrace">Abuja Terrace Estate</option>
                    <option value="vi_commercial">Victoria Island Commercial</option>
                    <option value="epe_land_estate">Surveyed Land Masterplan</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold mb-1">
                    Upload Genuine Property Photograph (Optional Override)
                  </label>
                  <label className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-[#FAF9F6] border border-[#E3E7E3] rounded-lg cursor-pointer hover:bg-[#EAF2ED]">
                    <Upload className="w-4 h-4 text-[#174C3C]" />
                    <span>Select Image File from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileUpload(e, 'property')}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editingProperty.description}
                    onChange={(e) =>
                      setEditingProperty({ ...editingProperty, description: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-[#E3E7E3] rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E3E7E3]">
                <button
                  type="button"
                  onClick={() => setEditingProperty(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#69736D] hover:text-[#202923] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSaveProperty({
                      ...editingProperty,
                      updated_at: new Date().toISOString(),
                    });
                    setEditingProperty(null);
                  }}
                  className="px-5 py-2.5 bg-[#174C3C] hover:bg-[#123B2E] text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Save Property Listing
                </button>
              </div>
            </div>
          )}

          {/* Properties Table */}
          <div className="bg-white border border-[#E3E7E3] rounded-xl overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E3E7E3] bg-[#FAF9F6] text-[11px] font-semibold text-[#69736D]">
                  <th className="py-3.5 px-4">Reference</th>
                  <th className="py-3.5 px-4">Title &amp; Location</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Availability</th>
                  <th className="py-3.5 px-4">Publication</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E7E3] text-xs">
                {properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-[#FAF9F6]/60">
                    <td className="py-3.5 px-4 font-mono-tabular font-semibold text-[#202923]">
                      {prop.reference}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={resolveVisualUrl(
                            prop.gallery[0]?.preset || 'lekki_villa',
                            prop.gallery[0]?.customImageUrl
                          )}
                          alt={prop.title}
                          className="w-12 h-9 rounded object-cover shrink-0 border border-[#E3E7E3]"
                        />
                        <div>
                          <div className="font-bold text-[#202923]">{prop.title}</div>
                          <div className="text-[#69736D]">{prop.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#69736D]">
                      {prop.property_type} · {prop.transaction_type}
                    </td>
                    <td className="py-3.5 px-4 font-mono-tabular font-semibold text-[#202923]">
                      {formatNaira(prop.price, prop.price_on_request)}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={prop.availability_status}
                        onChange={(e) => {
                          if (
                            e.target.value === 'Archived' &&
                            !requireAdminPermission('Archive Listing')
                          ) {
                            return;
                          }
                          onSaveProperty({
                            ...prop,
                            availability_status: e.target.value as PropertyAvailability,
                            updated_at: new Date().toISOString(),
                          });
                        }}
                        className="px-2.5 py-1 text-xs font-semibold border border-[#E3E7E3] rounded bg-white cursor-pointer"
                      >
                        <option value="Available">Available</option>
                        <option value="Reserved">Reserved</option>
                        <option value="Sold">Sold</option>
                        <option value="Rented">Rented</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => {
                          if (!requireAdminPermission('Publish / Unpublish Property')) return;
                          onSaveProperty({
                            ...prop,
                            publication_status:
                              prop.publication_status === 'Published' ? 'Draft' : 'Published',
                            updated_at: new Date().toISOString(),
                          });
                        }}
                        className={`font-semibold underline cursor-pointer ${
                          prop.publication_status === 'Published'
                            ? 'text-[#174C3C]'
                            : 'text-[#69736D]'
                        }`}
                      >
                        {prop.publication_status}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onPreviewProperty(prop)}
                        className="inline-flex items-center gap-1 text-[#69736D] hover:text-[#202923] font-medium cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!requireAdminPermission('Edit Property Details')) return;
                          setEditingProperty(prop);
                        }}
                        className="text-[#174C3C] font-semibold hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: COURSE MANAGEMENT (PRD Section 9.3) */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#202923]">
                Consultant Real Estate Academy Courses
              </h2>
              <p className="text-xs text-[#69736D]">
                Manage training programmes, tuition fees, cohort capacities, and registration availability.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCreateNewCourse}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#174C3C] hover:bg-[#123B2E] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Academy Course</span>
            </button>
          </div>

          {editingCourse && (
            <div className="bg-white border-2 border-[#174C3C] rounded-xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#E3E7E3] pb-3">
                <h3 className="text-base font-bold text-[#202923]">
                  Editing Course: {editingCourse.reference}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="text-xs text-[#69736D] hover:text-[#202923] cursor-pointer"
                >
                  Close Editor
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Course Code</label>
                  <input
                    type="text"
                    value={editingCourse.reference}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, reference: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm font-mono-tabular border border-[#E3E7E3] rounded-lg"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold mb-1">Course Title</label>
                  <input
                    type="text"
                    value={editingCourse.title}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, title: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-[#E3E7E3] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Tuition Fee (NGN)</label>
                  <input
                    type="number"
                    value={editingCourse.fee}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, fee: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-sm font-mono-tabular border border-[#E3E7E3] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    value={editingCourse.start_date}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, start_date: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-[#E3E7E3] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Registration Deadline
                  </label>
                  <input
                    type="date"
                    value={editingCourse.registration_deadline}
                    onChange={(e) =>
                      setEditingCourse({
                        ...editingCourse,
                        registration_deadline: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-[#E3E7E3] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Delivery Format</label>
                  <select
                    value={editingCourse.delivery_method}
                    onChange={(e) =>
                      setEditingCourse({
                        ...editingCourse,
                        delivery_method: e.target.value as DeliveryMethod,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-[#E3E7E3] rounded-lg bg-white"
                  >
                    <option value="In-Person">In-Person</option>
                    <option value="Online Live">Online Live</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Cohort Capacity</label>
                  <input
                    type="number"
                    value={editingCourse.capacity}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, capacity: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-sm font-mono-tabular border border-[#E3E7E3] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Registration Status</label>
                  <select
                    value={editingCourse.registration_status}
                    onChange={(e) =>
                      setEditingCourse({
                        ...editingCourse,
                        registration_status: e.target.value as CourseStatus,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-[#E3E7E3] rounded-lg bg-white"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Registration Open">Registration Open</option>
                    <option value="Registration Closed">Registration Closed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold mb-1">
                    Venue / Online Classroom Details
                  </label>
                  <input
                    type="text"
                    value={editingCourse.venue}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, venue: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-[#E3E7E3] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Upload Course Banner Image
                  </label>
                  <label className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-[#FAF9F6] border border-[#E3E7E3] rounded-lg cursor-pointer hover:bg-[#EAF2ED]">
                    <Upload className="w-4 h-4 text-[#174C3C]" />
                    <span>Upload Banner</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileUpload(e, 'course')}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold mb-1">
                    Programme Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingCourse.description}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, description: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-[#E3E7E3] rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E3E7E3]">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#69736D] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSaveCourse({
                      ...editingCourse,
                      updated_at: new Date().toISOString(),
                    });
                    setEditingCourse(null);
                  }}
                  className="px-5 py-2.5 bg-[#174C3C] hover:bg-[#123B2E] text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Save Course Changes
                </button>
              </div>
            </div>
          )}

          {/* Courses Table */}
          <div className="bg-white border border-[#E3E7E3] rounded-xl overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E3E7E3] bg-[#FAF9F6] text-[11px] font-semibold text-[#69736D]">
                  <th className="py-3.5 px-4">Code</th>
                  <th className="py-3.5 px-4">Programme Title</th>
                  <th className="py-3.5 px-4">Start Date</th>
                  <th className="py-3.5 px-4">Tuition</th>
                  <th className="py-3.5 px-4">Enrolled / Cap</th>
                  <th className="py-3.5 px-4">Course Status</th>
                  <th className="py-3.5 px-4">Publication</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E7E3] text-xs">
                {courses.map((crs) => (
                  <tr key={crs.id} className="hover:bg-[#FAF9F6]/60">
                    <td className="py-3.5 px-4 font-mono-tabular font-semibold text-[#202923]">
                      {crs.reference}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={resolveVisualUrl(crs.visual_preset, crs.custom_image_url)}
                          alt={crs.title}
                          className="w-12 h-9 rounded object-cover shrink-0 border border-[#E3E7E3]"
                        />
                        <div>
                          <div className="font-bold text-[#202923]">{crs.title}</div>
                          <div className="text-[#69736D]">
                            {crs.delivery_method} · {crs.duration}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono-tabular text-[#69736D]">
                      {formatDateReadable(crs.start_date)}
                    </td>
                    <td className="py-3.5 px-4 font-mono-tabular font-semibold text-[#202923]">
                      {formatNaira(crs.fee)}
                    </td>
                    <td className="py-3.5 px-4 font-mono-tabular">
                      {crs.enrolled_count} / {crs.capacity}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={crs.registration_status}
                        onChange={(e) => {
                          if (!requireAdminPermission('Change Course Registration Status'))
                            return;
                          onSaveCourse({
                            ...crs,
                            registration_status: e.target.value as CourseStatus,
                            updated_at: new Date().toISOString(),
                          });
                        }}
                        className="px-2.5 py-1 text-xs font-semibold border border-[#E3E7E3] rounded bg-white cursor-pointer"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Upcoming">Upcoming</option>
                        <option value="Registration Open">Registration Open</option>
                        <option value="Registration Closed">Registration Closed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => {
                          if (!requireAdminPermission('Publish / Unpublish Course')) return;
                          onSaveCourse({
                            ...crs,
                            publication_status:
                              crs.publication_status === 'Published' ? 'Draft' : 'Published',
                            updated_at: new Date().toISOString(),
                          });
                        }}
                        className={`font-semibold underline cursor-pointer ${
                          crs.publication_status === 'Published'
                            ? 'text-[#174C3C]'
                            : 'text-[#69736D]'
                        }`}
                      >
                        {crs.publication_status}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCourseFilter(crs.id);
                          setLeadSubTab('registrations');
                          setActiveTab('leads');
                        }}
                        className="text-[#174C3C] font-medium hover:underline cursor-pointer"
                      >
                        View Trainees
                      </button>
                      <button
                        type="button"
                        onClick={() => onPreviewCourse(crs)}
                        className="text-[#69736D] hover:text-[#202923] font-medium cursor-pointer"
                      >
                        Preview
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!requireAdminPermission('Edit Course')) return;
                          setEditingCourse(crs);
                        }}
                        className="text-[#174C3C] font-semibold hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: LEAD & REGISTRATION MANAGEMENT (PRD Section 9.4) */}
      {activeTab === 'leads' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1 p-1 bg-white border border-[#E3E7E3] rounded-lg">
              <button
                type="button"
                onClick={() => setLeadSubTab('enquiries')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-md cursor-pointer ${
                  leadSubTab === 'enquiries'
                    ? 'bg-[#174C3C] text-white'
                    : 'text-[#69736D] hover:text-[#202923]'
                }`}
              >
                Property Enquiries ({enquiries.length})
              </button>
              <button
                type="button"
                onClick={() => setLeadSubTab('inspections')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-md cursor-pointer ${
                  leadSubTab === 'inspections'
                    ? 'bg-[#174C3C] text-white'
                    : 'text-[#69736D] hover:text-[#202923]'
                }`}
              >
                Inspection Requests ({inspections.length})
              </button>
              <button
                type="button"
                onClick={() => setLeadSubTab('registrations')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-md cursor-pointer ${
                  leadSubTab === 'registrations'
                    ? 'bg-[#174C3C] text-white'
                    : 'text-[#69736D] hover:text-[#202923]'
                }`}
              >
                Academy Registrations ({registrations.length})
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-[#69736D] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  placeholder="Search name, ref, phone..."
                  className="pl-9 pr-3 py-2 text-xs bg-white border border-[#E3E7E3] rounded-lg focus:outline-none focus:border-[#174C3C]"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  if (leadSubTab === 'enquiries') {
                    exportRecordsToCsv(
                      'elvins-property-enquiries.csv',
                      filteredEnquiries as unknown as Record<string, unknown>[]
                    );
                  } else if (leadSubTab === 'inspections') {
                    exportRecordsToCsv(
                      'elvins-inspection-requests.csv',
                      filteredInspections as unknown as Record<string, unknown>[]
                    );
                  } else {
                    exportRecordsToCsv(
                      'consultant-academy-registrations.csv',
                      filteredRegistrations as unknown as Record<string, unknown>[]
                    );
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#E3E7E3] hover:bg-[#EAF2ED] text-[#202923] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#174C3C]" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Sub-tab A: Property Enquiries */}
          {leadSubTab === 'enquiries' && (
            <div className="bg-white border border-[#E3E7E3] rounded-xl divide-y divide-[#E3E7E3]">
              {filteredEnquiries.length === 0 ? (
                <div className="p-8 text-center text-sm text-[#69736D]">
                  No property enquiries match your search filter.
                </div>
              ) : (
                filteredEnquiries.map((enq) => (
                  <div key={enq.id} className="p-6 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#69736D]">
                        <span className="font-mono-tabular font-bold text-[#202923]">
                          {enq.enquiry_reference}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          Listing:{' '}
                          <strong className="font-mono-tabular text-[#174C3C]">
                            {enq.property_reference}
                          </strong>{' '}
                          ({enq.property_title})
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{formatDateReadable(enq.created_at)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#69736D]">Lead Status:</span>
                        <select
                          value={enq.lead_status}
                          onChange={(e) =>
                            onUpdateEnquiry(
                              enq.id,
                              e.target.value as LeadStatus,
                              enq.internal_notes
                            )
                          }
                          className="px-2.5 py-1 text-xs font-semibold border border-[#E3E7E3] rounded bg-[#FAF9F6] cursor-pointer"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Qualified">Qualified</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                      <div className="lg:col-span-7 space-y-1">
                        <div className="text-sm font-bold text-[#202923]">
                          {enq.full_name} ·{' '}
                          <span className="font-mono-tabular font-normal">{enq.phone}</span>{' '}
                          {enq.email && `· ${enq.email}`}
                        </div>
                        <p className="text-xs text-[#202923]/90 bg-[#FAF9F6] p-3 rounded-lg border border-[#E3E7E3]">
                          {enq.message}
                        </p>
                      </div>

                      <div className="lg:col-span-5 space-y-1.5">
                        <label className="block text-[11px] font-semibold text-[#69736D]">
                          Internal Follow-Up Notes
                        </label>
                        <textarea
                          rows={2}
                          value={enq.internal_notes}
                          onChange={(e) =>
                            onUpdateEnquiry(enq.id, enq.lead_status, e.target.value)
                          }
                          placeholder="Record call outcome or client budget notes..."
                          className="w-full px-3 py-1.5 text-xs border border-[#E3E7E3] rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Sub-tab B: Inspection Requests */}
          {leadSubTab === 'inspections' && (
            <div className="bg-white border border-[#E3E7E3] rounded-xl divide-y divide-[#E3E7E3]">
              {filteredInspections.length === 0 ? (
                <div className="p-8 text-center text-sm text-[#69736D]">
                  No inspection requests match your filter.
                </div>
              ) : (
                filteredInspections.map((insp) => (
                  <div key={insp.id} className="p-6 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#69736D]">
                        <span className="font-mono-tabular font-bold text-[#202923]">
                          {insp.inspection_reference}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          Property:{' '}
                          <strong className="font-mono-tabular text-[#174C3C]">
                            {insp.property_reference}
                          </strong>{' '}
                          ({insp.property_title})
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          Requested Slot:{' '}
                          <strong className="font-mono-tabular text-[#202923]">
                            {formatDateReadable(insp.preferred_date)} at {insp.preferred_time}
                          </strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#69736D]">Inspection Status:</span>
                        <select
                          value={insp.inspection_status}
                          onChange={(e) =>
                            onUpdateInspection(
                              insp.id,
                              e.target.value as InspectionStatus,
                              insp.internal_notes
                            )
                          }
                          className="px-2.5 py-1 text-xs font-semibold border border-[#E3E7E3] rounded bg-[#FAF9F6] cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                      <div className="lg:col-span-7 space-y-1">
                        <div className="text-sm font-bold text-[#202923]">
                          {insp.full_name} ·{' '}
                          <span className="font-mono-tabular font-normal">{insp.phone}</span>{' '}
                          {insp.email && `· ${insp.email}`}
                        </div>
                        <p className="text-xs text-[#202923]/90 bg-[#FAF9F6] p-3 rounded-lg border border-[#E3E7E3]">
                          {insp.message || 'Standard physical site inspection requested.'}
                        </p>
                      </div>

                      <div className="lg:col-span-5 space-y-1.5">
                        <label className="block text-[11px] font-semibold text-[#69736D]">
                          Site Coordinator &amp; Confirmation Notes
                        </label>
                        <textarea
                          rows={2}
                          value={insp.internal_notes}
                          onChange={(e) =>
                            onUpdateInspection(
                              insp.id,
                              insp.inspection_status,
                              e.target.value
                            )
                          }
                          placeholder="Assign field representative and confirm appointment slot..."
                          className="w-full px-3 py-1.5 text-xs border border-[#E3E7E3] rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Sub-tab C: Trainee Registrations */}
          {leadSubTab === 'registrations' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[#69736D]">
                  Filter by Academy Course:
                </span>
                <select
                  value={selectedCourseFilter}
                  onChange={(e) => setSelectedCourseFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-white border border-[#E3E7E3] rounded-lg"
                >
                  <option value="ALL">All Academy Courses</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.reference} — {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-white border border-[#E3E7E3] rounded-xl divide-y divide-[#E3E7E3]">
                {filteredRegistrations.length === 0 ? (
                  <div className="p-8 text-center text-sm text-[#69736D]">
                    No trainee registrations found for this filter.
                  </div>
                ) : (
                  filteredRegistrations.map((reg) => (
                    <div key={reg.id} className="p-6 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#69736D]">
                          <span className="font-mono-tabular font-bold text-[#202923]">
                            {reg.registration_reference}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>
                            Course:{' '}
                            <strong className="font-mono-tabular text-[#174C3C]">
                              {reg.course_reference}
                            </strong>
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>Delivery: {reg.preferred_delivery}</span>
                          <span aria-hidden="true">·</span>
                          <span>
                            Payment:{' '}
                            <strong className="text-[#202923]">{reg.payment_status}</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#69736D]">Registration Status:</span>
                          <select
                            value={reg.registration_status}
                            onChange={(e) =>
                              onUpdateRegistration(
                                reg.id,
                                e.target.value as RegistrationStatus,
                                reg.internal_notes
                              )
                            }
                            className="px-2.5 py-1 text-xs font-semibold border border-[#E3E7E3] rounded bg-[#FAF9F6] cursor-pointer"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Awaiting Payment">Awaiting Payment</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                        <div className="lg:col-span-7 space-y-1">
                          <div className="text-sm font-bold text-[#202923]">
                            {reg.full_name} ·{' '}
                            <span className="font-mono-tabular font-normal">{reg.phone}</span>{' '}
                            · {reg.email}
                          </div>
                          <div className="text-xs text-[#69736D]">
                            Programme: <strong>{reg.course_title}</strong> · Tuition:{' '}
                            <span className="font-mono-tabular">
                              {formatNaira(reg.amount)}
                            </span>
                            {reg.payment_reference && (
                              <>
                                {' '}
                                · Payment Ref:{' '}
                                <span className="font-mono-tabular">
                                  {reg.payment_reference}
                                </span>
                              </>
                            )}
                          </div>
                          {reg.additional_information && (
                            <p className="text-xs text-[#202923]/90 bg-[#FAF9F6] p-2.5 rounded-lg border border-[#E3E7E3] mt-1">
                              {reg.additional_information}
                            </p>
                          )}
                        </div>

                        <div className="lg:col-span-5 space-y-1.5">
                          <label className="block text-[11px] font-semibold text-[#69736D]">
                            Academy Onboarding &amp; Payment Verification Notes
                          </label>
                          <textarea
                            rows={2}
                            value={reg.internal_notes}
                            onChange={(e) =>
                              onUpdateRegistration(
                                reg.id,
                                reg.registration_status,
                                e.target.value
                              )
                            }
                            placeholder="Record bank transfer verification or cohort onboarding status..."
                            className="w-full px-3 py-1.5 text-xs border border-[#E3E7E3] rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: PLATFORM & DISCOVERY SETTINGS (PRD Section 8.4, 18.1, 21) */}
      {activeTab === 'settings' && (
        <div className="bg-white border border-[#E3E7E3] rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 border-b border-[#E3E7E3] pb-4">
            <Sliders className="w-5 h-5 text-[#174C3C]" />
            <div>
              <h2 className="text-lg font-bold text-[#202923]">
                Platform Configuration &amp; Brand Relationship Settings
              </h2>
              <p className="text-xs text-[#69736D]">
                Configure WhatsApp routing, notification email, Google Sites coexistence strategy, and payment verification settings.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[#202923] mb-1">
                Configurable Business WhatsApp Number (International Format)
              </label>
              <input
                type="text"
                value={draftSettings.whatsapp_number}
                onChange={(e) =>
                  setDraftSettings({ ...draftSettings, whatsapp_number: e.target.value })
                }
                className="w-full px-3.5 py-2 text-sm font-mono-tabular border border-[#E3E7E3] rounded-lg"
              />
              <span className="text-[11px] text-[#69736D]">
                Used across all property and course WhatsApp deep-links.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202923] mb-1">
                Administrator Notification Email
              </label>
              <input
                type="email"
                value={draftSettings.notification_email}
                onChange={(e) =>
                  setDraftSettings({ ...draftSettings, notification_email: e.target.value })
                }
                className="w-full px-3.5 py-2 text-sm border border-[#E3E7E3] rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202923] mb-1">
                Existing Google Sites Academy Strategy (PRD Section 1.2)
              </label>
              <select
                value={draftSettings.google_sites_mode}
                onChange={(e) =>
                  setDraftSettings({
                    ...draftSettings,
                    google_sites_mode: e.target.value as BusinessSettings['google_sites_mode'],
                  })
                }
                className="w-full px-3.5 py-2 text-sm border border-[#E3E7E3] rounded-lg bg-white"
              >
                <option value="Integrated Replacement">
                  Integrated Replacement (Full Academy on Main Platform)
                </option>
                <option value="Coexisting Academy Landing">
                  Coexisting Academy Landing (Display Legacy Archive Link)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202923] mb-1">
                Existing Google Sites URL Reference
              </label>
              <input
                type="url"
                value={draftSettings.google_sites_legacy_url}
                onChange={(e) =>
                  setDraftSettings({
                    ...draftSettings,
                    google_sites_legacy_url: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2 text-sm border border-[#E3E7E3] rounded-lg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#202923] mb-1">
                Brand Relationship Clarification Statement (PRD Section 3.3)
              </label>
              <textarea
                rows={2}
                value={draftSettings.brand_relationship_statement}
                onChange={(e) =>
                  setDraftSettings({
                    ...draftSettings,
                    brand_relationship_statement: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2 text-sm border border-[#E3E7E3] rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202923] mb-1">
                Physical Office Address
              </label>
              <input
                type="text"
                value={draftSettings.office_address}
                onChange={(e) =>
                  setDraftSettings({ ...draftSettings, office_address: e.target.value })
                }
                className="w-full px-3.5 py-2 text-sm border border-[#E3E7E3] rounded-lg"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="inline-flex items-center gap-2.5 text-xs font-semibold text-[#202923] cursor-pointer">
                <input
                  type="checkbox"
                  checked={draftSettings.enable_online_payment_verification}
                  onChange={(e) =>
                    setDraftSettings({
                      ...draftSettings,
                      enable_online_payment_verification: e.target.checked,
                    })
                  }
                  className="accent-[#174C3C] w-4 h-4"
                />
                <span>Enable Instant Course Fee Checkout &amp; Server Verification</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E3E7E3]">
            <div>
              {settingsSavedMsg && (
                <span className="text-xs font-semibold text-[#174C3C]">
                  Configuration saved and applied across all pages.
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                if (!requireAdminPermission('Update Platform Settings')) return;
                onUpdateSettings(draftSettings);
                setSettingsSavedMsg(true);
                setTimeout(() => setSettingsSavedMsg(false), 3000);
              }}
              className="px-5 py-2.5 bg-[#174C3C] hover:bg-[#123B2E] text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              Save Platform Configuration
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
