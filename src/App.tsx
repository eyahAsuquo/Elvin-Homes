/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  Property,
  Course,
  Registration,
  PropertyEnquiry,
  InspectionRequest,
  BusinessSettings,
  NotificationLogItem,
  AnalyticsSummary,
  LeadStatus,
  InspectionStatus,
  RegistrationStatus,
} from './types';
import {
  INITIAL_PROPERTIES,
  INITIAL_COURSES,
  INITIAL_REGISTRATIONS,
  INITIAL_ENQUIRIES,
  INITIAL_INSPECTIONS,
  INITIAL_SETTINGS,
  INITIAL_NOTIFICATION_LOG,
  INITIAL_ANALYTICS,
} from './data/initialData';
import { HeroSliderRevolution } from './components/HeroSliderRevolution';
import { PropertyCard } from './components/PropertyCard';
import { CourseCard } from './components/CourseCard';
import { PropertyDetailView } from './components/PropertyDetailView';
import { CourseDetailView } from './components/CourseDetailView';
import { AdminDashboard } from './components/AdminDashboard';
import {
  ServicesView,
  AboutView,
  ContactView,
  LegalView,
} from './components/InfoPages';
import { buildGeneralWhatsAppUrl } from './utils/formatters';
import {
  ArrowRight,
  Menu,
  MessageSquare,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';

type ActiveRoute =
  | { page: 'home' }
  | { page: 'properties'; slug?: string }
  | { page: 'academy'; slug?: string }
  | { page: 'services' }
  | { page: 'about' }
  | { page: 'contact' }
  | { page: 'privacy' }
  | { page: 'terms' }
  | { page: 'admin' };

const STORAGE_KEYS = {
  properties: 'elvins_properties_v3',
  courses: 'elvins_courses_v3',
  registrations: 'elvins_registrations_v3',
  enquiries: 'elvins_enquiries_v3',
  inspections: 'elvins_inspections_v3',
  settings: 'elvins_settings_v3',
  notifications: 'elvins_notifications_v3',
  analytics: 'elvins_analytics_v3',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function parseHashRoute(hash: string): ActiveRoute {
  const cleaned = hash.replace(/^#\/?/, '');
  if (!cleaned || cleaned === 'home') return { page: 'home' };
  const parts = cleaned.split('/');
  if (parts[0] === 'properties') {
    return { page: 'properties', slug: parts[1] };
  }
  if (parts[0] === 'academy') {
    return { page: 'academy', slug: parts[1] };
  }
  if (parts[0] === 'services') return { page: 'services' };
  if (parts[0] === 'about') return { page: 'about' };
  if (parts[0] === 'contact') return { page: 'contact' };
  if (parts[0] === 'privacy') return { page: 'privacy' };
  if (parts[0] === 'terms') return { page: 'terms' };
  if (parts[0] === 'admin') return { page: 'admin' };
  return { page: 'home' };
}

export default function App() {
  const [route, setRoute] = useState<ActiveRoute>(() =>
    parseHashRoute(window.location.hash)
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Persistent Platform State
  const [properties, setProperties] = useState<Property[]>(() =>
    loadFromStorage(STORAGE_KEYS.properties, INITIAL_PROPERTIES)
  );
  const [courses, setCourses] = useState<Course[]>(() =>
    loadFromStorage(STORAGE_KEYS.courses, INITIAL_COURSES)
  );
  const [registrations, setRegistrations] = useState<Registration[]>(() =>
    loadFromStorage(STORAGE_KEYS.registrations, INITIAL_REGISTRATIONS)
  );
  const [enquiries, setEnquiries] = useState<PropertyEnquiry[]>(() =>
    loadFromStorage(STORAGE_KEYS.enquiries, INITIAL_ENQUIRIES)
  );
  const [inspections, setInspections] = useState<InspectionRequest[]>(() =>
    loadFromStorage(STORAGE_KEYS.inspections, INITIAL_INSPECTIONS)
  );
  const [settings, setSettings] = useState<BusinessSettings>(() =>
    loadFromStorage(STORAGE_KEYS.settings, INITIAL_SETTINGS)
  );
  const [notifications, setNotifications] = useState<NotificationLogItem[]>(() =>
    loadFromStorage(STORAGE_KEYS.notifications, INITIAL_NOTIFICATION_LOG)
  );
  const [analytics, setAnalytics] = useState<AnalyticsSummary>(() =>
    loadFromStorage(STORAGE_KEYS.analytics, INITIAL_ANALYTICS)
  );

  // Property Catalogue Filter State (PRD Section 5.4)
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterTransaction, setFilterTransaction] = useState('ALL');
  const [filterPriceBand, setFilterPriceBand] = useState('ALL');
  const [filterAvailability, setFilterAvailability] = useState<'ALL_PUBLISHED' | 'AVAILABLE_ONLY'>(
    'ALL_PUBLISHED'
  );

  // Academy Filter State
  const [courseFormatFilter, setCourseFormatFilter] = useState('ALL');

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.properties, JSON.stringify(properties));
    } catch {
      // Ignore quota errors
    }
  }, [properties]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.courses, JSON.stringify(courses));
    } catch {
      // Ignore
    }
  }, [courses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.registrations, JSON.stringify(registrations));
    } catch {
      // Ignore
    }
  }, [registrations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.enquiries, JSON.stringify(enquiries));
    } catch {
      // Ignore
    }
  }, [enquiries]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.inspections, JSON.stringify(inspections));
    } catch {
      // Ignore
    }
  }, [inspections]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
    } catch {
      // Ignore
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(notifications));
    } catch {
      // Ignore
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.analytics, JSON.stringify(analytics));
    } catch {
      // Ignore
    }
  }, [analytics]);

  // Listen to hash changes for shareable URLs
  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHashRoute(window.location.hash));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigateTo = (nextRoute: ActiveRoute) => {
    setMobileMenuOpen(false);
    let nextHash = '#/';
    if (nextRoute.page === 'properties') {
      nextHash = nextRoute.slug
        ? `#/properties/${nextRoute.slug}`
        : '#/properties';
    } else if (nextRoute.page === 'academy') {
      nextHash = nextRoute.slug ? `#/academy/${nextRoute.slug}` : '#/academy';
    } else if (nextRoute.page !== 'home') {
      nextHash = `#/${nextRoute.page}`;
    }
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    } else {
      setRoute(nextRoute);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Dynamic Page Title for On-Page SEO (PRD Section 13.1)
  useEffect(() => {
    if (route.page === 'properties' && route.slug) {
      const matched = properties.find((p) => p.slug === route.slug);
      if (matched) {
        document.title = `${matched.title} (${matched.reference}) | ${settings.company_name}`;
        return;
      }
    }
    if (route.page === 'academy' && route.slug) {
      const matched = courses.find((c) => c.slug === route.slug);
      if (matched) {
        document.title = `${matched.title} | ${settings.academy_name}`;
        return;
      }
    }
    const pageTitles: Record<ActiveRoute['page'], string> = {
      home: `${settings.company_name} & ${settings.academy_name} | Nigeria`,
      properties: `Property Catalogue & Listings | ${settings.company_name}`,
      academy: `Real Estate Training Programmes | ${settings.academy_name}`,
      services: `Real Estate Advisory & Training Services | ${settings.company_name}`,
      about: `About Us | ${settings.company_name} & ${settings.academy_name}`,
      contact: `Contact & Inspection Desk | ${settings.company_name}`,
      privacy: `Privacy Notice (NDPA) | ${settings.company_name}`,
      terms: `Terms of Use | ${settings.company_name}`,
      admin: `Administrator Console | ${settings.company_name}`,
    };
    document.title = pageTitles[route.page];
  }, [route, properties, courses, settings]);

  // Select property and increment view analytics
  const handleSelectProperty = (property: Property) => {
    setAnalytics((prev) => ({
      ...prev,
      property_views: {
        ...prev.property_views,
        [property.id]: (prev.property_views[property.id] || 0) + 1,
      },
    }));
    navigateTo({ page: 'properties', slug: property.slug });
  };

  // Select course and increment view analytics
  const handleSelectCourse = (course: Course) => {
    setAnalytics((prev) => ({
      ...prev,
      course_views: {
        ...prev.course_views,
        [course.id]: (prev.course_views[course.id] || 0) + 1,
      },
    }));
    navigateTo({ page: 'academy', slug: course.slug });
  };

  const handleTrackWhatsAppClick = () => {
    setAnalytics((prev) => ({
      ...prev,
      whatsapp_clicks: prev.whatsapp_clicks + 1,
    }));
  };

  // Submit Property Enquiry Workflow (PRD Section 5.7 & 10.1)
  const handleSubmitPropertyEnquiry = (
    data: Omit<
      PropertyEnquiry,
      'id' | 'enquiry_reference' | 'lead_status' | 'internal_notes' | 'created_at' | 'updated_at'
    >
  ): PropertyEnquiry => {
    const refCode = `ELV-ENQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();
    const newRecord: PropertyEnquiry = {
      ...data,
      id: `enq-${Date.now()}`,
      enquiry_reference: refCode,
      lead_status: 'New',
      internal_notes: '',
      created_at: now,
      updated_at: now,
    };

    setEnquiries((prev) => [newRecord, ...prev]);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        type: 'Property Enquiry',
        recipient_email: settings.notification_email,
        subject: `New Property Enquiry [${refCode}] for ${data.property_reference}`,
        reference: refCode,
        delivery_state: 'Delivered',
        timestamp: now,
      },
      ...prev,
    ]);
    setAnalytics((prev) => ({
      ...prev,
      property_enquiries_count: prev.property_enquiries_count + 1,
    }));
    return newRecord;
  };

  // Submit Inspection Request Workflow (PRD Section 5.8 & 10.1)
  const handleSubmitInspectionRequest = (
    data: Omit<
      InspectionRequest,
      'id' | 'inspection_reference' | 'inspection_status' | 'internal_notes' | 'created_at' | 'updated_at'
    >
  ): InspectionRequest => {
    const refCode = `ELV-INS-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();
    const newRecord: InspectionRequest = {
      ...data,
      id: `insp-${Date.now()}`,
      inspection_reference: refCode,
      inspection_status: 'Pending',
      internal_notes: '',
      created_at: now,
      updated_at: now,
    };

    setInspections((prev) => [newRecord, ...prev]);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        type: 'Inspection Request',
        recipient_email: settings.notification_email,
        subject: `New Inspection Request [${refCode}] for ${data.property_reference}`,
        reference: refCode,
        delivery_state: 'Delivered',
        timestamp: now,
      },
      ...prev,
    ]);
    setAnalytics((prev) => ({
      ...prev,
      inspection_requests_count: prev.inspection_requests_count + 1,
    }));
    return newRecord;
  };

  // Submit Academy Course Registration Workflow (PRD Section 6.5 & 10.1)
  const handleSubmitCourseRegistration = (
    data: Omit<
      Registration,
      | 'id'
      | 'registration_reference'
      | 'registration_status'
      | 'payment_status'
      | 'internal_notes'
      | 'created_at'
      | 'updated_at'
    >
  ): Registration => {
    const refCode = `CRA-REG-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();
    const newRegistration: Registration = {
      ...data,
      id: `reg-${Date.now()}`,
      registration_reference: refCode,
      registration_status: 'New',
      payment_status: 'Awaiting Transfer',
      internal_notes: '',
      created_at: now,
      updated_at: now,
    };

    setRegistrations((prev) => [newRegistration, ...prev]);
    setCourses((prev) =>
      prev.map((c) =>
        c.id === data.course_id
          ? { ...c, enrolled_count: Math.min(c.capacity, c.enrolled_count + 1) }
          : c
      )
    );
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        type: 'Course Registration',
        recipient_email: settings.notification_email,
        subject: `New Academy Registration [${refCode}] — ${data.full_name}`,
        reference: refCode,
        delivery_state: 'Delivered',
        timestamp: now,
      },
      ...prev,
    ]);
    setAnalytics((prev) => ({
      ...prev,
      academy_registrations_count: prev.academy_registrations_count + 1,
    }));
    return newRegistration;
  };

  const handleVerifyCoursePayment = (registrationId: string, paymentRef: string) => {
    const now = new Date().toISOString();
    setRegistrations((prev) =>
      prev.map((reg) =>
        reg.id === registrationId
          ? {
              ...reg,
              registration_status: 'Confirmed',
              payment_status: 'Paid',
              payment_reference: paymentRef,
              internal_notes: `Instant checkout verified (${paymentRef}).`,
              updated_at: now,
            }
          : reg
      )
    );
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        type: 'Payment Verification',
        recipient_email: settings.notification_email,
        subject: `Verified Course Payment [${paymentRef}]`,
        reference: paymentRef,
        delivery_state: 'Delivered',
        timestamp: now,
      },
      ...prev,
    ]);
  };

  // Admin Handlers
  const handleSaveProperty = (updated: Property) => {
    setProperties((prev) => {
      const exists = prev.some((p) => p.id === updated.id);
      if (exists) {
        return prev.map((p) => (p.id === updated.id ? updated : p));
      }
      return [updated, ...prev];
    });
  };

  const handleSaveCourse = (updated: Course) => {
    setCourses((prev) => {
      const exists = prev.some((c) => c.id === updated.id);
      if (exists) {
        return prev.map((c) => (c.id === updated.id ? updated : c));
      }
      return [updated, ...prev];
    });
  };

  const handleUpdateEnquiry = (id: string, status: LeadStatus, notes: string) => {
    setEnquiries((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, lead_status: status, internal_notes: notes, updated_at: new Date().toISOString() }
          : e
      )
    );
  };

  const handleUpdateInspection = (id: string, status: InspectionStatus, notes: string) => {
    setInspections((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              inspection_status: status,
              internal_notes: notes,
              updated_at: new Date().toISOString(),
            }
          : i
      )
    );
  };

  const handleUpdateRegistration = (id: string, status: RegistrationStatus, notes: string) => {
    setRegistrations((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              registration_status: status,
              internal_notes: notes,
              updated_at: new Date().toISOString(),
            }
          : r
      )
    );
  };

  // Publicly visible properties (excludes Draft & Archived per PRD 5.6)
  const publicProperties = useMemo(
    () =>
      properties.filter(
        (p) =>
          p.publication_status === 'Published' &&
          p.availability_status !== 'Archived'
      ),
    [properties]
  );

  // Featured properties on Homepage: ONLY Published and Available by default (PRD 4.2)
  const featuredAvailableProperties = useMemo(
    () =>
      publicProperties.filter(
        (p) => p.availability_status === 'Available' && p.featured
      ),
    [publicProperties]
  );

  // Filtered Catalogue Properties
  const filteredCatalogueProperties = useMemo(() => {
    return publicProperties.filter((prop) => {
      if (
        filterAvailability === 'AVAILABLE_ONLY' &&
        prop.availability_status !== 'Available'
      ) {
        return false;
      }
      if (
        filterLocation !== 'ALL' &&
        !prop.location.toLowerCase().includes(filterLocation.toLowerCase())
      ) {
        return false;
      }
      if (filterCategory !== 'ALL' && prop.property_type !== filterCategory) {
        return false;
      }
      if (filterTransaction !== 'ALL' && prop.transaction_type !== filterTransaction) {
        return false;
      }
      if (filterPriceBand !== 'ALL') {
        if (filterPriceBand === 'POR' && !prop.price_on_request) return false;
        if (filterPriceBand === 'UNDER_50M') {
          if (prop.price === null || prop.price > 50000000) return false;
        }
        if (filterPriceBand === '50M_TO_300M') {
          if (prop.price === null || prop.price < 50000000 || prop.price > 300000000)
            return false;
        }
        if (filterPriceBand === 'ABOVE_300M') {
          if (prop.price === null || prop.price <= 300000000) return false;
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = prop.title.toLowerCase().includes(q);
        const matchesLocation = prop.location.toLowerCase().includes(q);
        const matchesRef = prop.reference.toLowerCase().includes(q);
        if (!matchesTitle && !matchesLocation && !matchesRef) return false;
      }
      return true;
    });
  }, [
    publicProperties,
    filterAvailability,
    filterLocation,
    filterCategory,
    filterTransaction,
    filterPriceBand,
    searchQuery,
  ]);

  // Publicly visible courses (PRD 6.3: Only published courses appear publicly)
  const publicCourses = useMemo(
    () =>
      courses.filter(
        (c) =>
          c.publication_status === 'Published' &&
          c.registration_status !== 'Draft'
      ),
    [courses]
  );

  const filteredPublicCourses = useMemo(() => {
    if (courseFormatFilter === 'ALL') return publicCourses;
    return publicCourses.filter((c) => c.delivery_method === courseFormatFilter);
  }, [publicCourses, courseFormatFilter]);

  const generalWhatsAppUrl = buildGeneralWhatsAppUrl(settings.whatsapp_number);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#202923]">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-[#E3E7E3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              navigateTo({ page: 'home' });
            }}
            className="font-display text-lg font-extrabold tracking-tight text-[#174C3C] whitespace-nowrap shrink-0"
          >
            Elvins Properties
          </a>

          {/* Zone 2: 5 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#69736D]">
            <a
              href="#/properties"
              onClick={(e) => {
                e.preventDefault();
                navigateTo({ page: 'properties' });
              }}
              className={`hover:text-[#174C3C] transition-colors whitespace-nowrap shrink-0 ${
                route.page === 'properties'
                  ? 'text-[#174C3C] font-semibold underline underline-offset-8'
                  : ''
              }`}
            >
              Properties
            </a>
            <a
              href="#/services"
              onClick={(e) => {
                e.preventDefault();
                navigateTo({ page: 'services' });
              }}
              className={`hover:text-[#174C3C] transition-colors whitespace-nowrap shrink-0 ${
                route.page === 'services'
                  ? 'text-[#174C3C] font-semibold underline underline-offset-8'
                  : ''
              }`}
            >
              Services
            </a>
            <a
              href="#/academy"
              onClick={(e) => {
                e.preventDefault();
                navigateTo({ page: 'academy' });
              }}
              className={`hover:text-[#174C3C] transition-colors whitespace-nowrap shrink-0 ${
                route.page === 'academy'
                  ? 'text-[#174C3C] font-semibold underline underline-offset-8'
                  : ''
              }`}
            >
              Academy
            </a>
            <a
              href="#/about"
              onClick={(e) => {
                e.preventDefault();
                navigateTo({ page: 'about' });
              }}
              className={`hover:text-[#174C3C] transition-colors whitespace-nowrap shrink-0 ${
                route.page === 'about'
                  ? 'text-[#174C3C] font-semibold underline underline-offset-8'
                  : ''
              }`}
            >
              About Us
            </a>
            <a
              href="#/contact"
              onClick={(e) => {
                e.preventDefault();
                navigateTo({ page: 'contact' });
              }}
              className={`hover:text-[#174C3C] transition-colors whitespace-nowrap shrink-0 ${
                route.page === 'contact'
                  ? 'text-[#174C3C] font-semibold underline underline-offset-8'
                  : ''
              }`}
            >
              Contact
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() =>
                navigateTo(
                  route.page === 'admin' ? { page: 'home' } : { page: 'admin' }
                )
              }
              className="px-4 py-2 text-xs font-semibold text-white bg-[#174C3C] rounded-lg hover:bg-[#123B2E] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {route.page === 'admin' ? 'Exit Admin' : 'Admin Console'}
            </button>

            <button
              type="button"
              aria-label="Toggle Menu"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 text-[#202923] hover:text-[#174C3C] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#E3E7E3] px-4 py-4 space-y-2">
            {[
              { page: 'home' as const, label: 'Home' },
              { page: 'properties' as const, label: 'Properties' },
              { page: 'services' as const, label: 'Real Estate Services' },
              { page: 'academy' as const, label: 'Consultant Academy' },
              { page: 'about' as const, label: 'About Us' },
              { page: 'contact' as const, label: 'Contact Us' },
              { page: 'admin' as const, label: 'Admin Console' },
            ].map((item) => (
              <button
                key={item.page}
                type="button"
                onClick={() => navigateTo({ page: item.page })}
                className="block w-full text-left py-2 text-sm font-semibold text-[#202923] hover:text-[#174C3C]"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {/* ROUTE: HOMEPAGE (PRD Section 4) */}
        {route.page === 'home' && (
          <div>
            {/* 4.1 Slider Revolution Style Hero Section */}
            <HeroSliderRevolution
              whatsappUrl={generalWhatsAppUrl}
              searchQuery={searchQuery}
              filterCategory={filterCategory}
              filterTransaction={filterTransaction}
              onSearchQueryChange={setSearchQuery}
              onFilterCategoryChange={setFilterCategory}
              onFilterTransactionChange={setFilterTransaction}
              onExecuteSearch={() => navigateTo({ page: 'properties' })}
              onNavigateProperties={() => navigateTo({ page: 'properties' })}
              onNavigateAcademy={() => navigateTo({ page: 'academy' })}
              onNavigateContact={() => navigateTo({ page: 'contact' })}
              onSelectPropertySlug={(slug) => navigateTo({ page: 'properties', slug })}
              onSelectCourseSlug={(slug) => navigateTo({ page: 'academy', slug })}
              onTrackWhatsAppClick={handleTrackWhatsAppClick}
            />

            {/* 4.2 Featured Properties Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="text-xs text-[#69736D] mb-1">
                    <span>Elvins Properties</span>
                    <span aria-hidden="true"> · </span>
                    <span>Published &amp; Available Listings</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#202923]">
                    Featured Properties Across Nigeria
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => navigateTo({ page: 'properties' })}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#174C3C] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>View Full Property Catalogue ({publicProperties.length})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                {featuredAvailableProperties.slice(0, 3).map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onSelect={handleSelectProperty}
                  />
                ))}
              </div>
            </section>

            {/* 4.3 Academy Programmes Section */}
            <section className="bg-white border-y border-[#E3E7E3]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                  <div>
                    <div className="text-xs text-[#69736D] mb-1">
                      <span>Consultant Real Estate Academy</span>
                      <span aria-hidden="true"> · </span>
                      <span>Upcoming Cohorts</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#202923]">
                      Professional Real Estate Training Programmes
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigateTo({ page: 'academy' })}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#174C3C] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Explore All Academy Courses</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
                  {publicCourses.slice(0, 3).map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onSelect={handleSelectCourse}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* 4.4 Trust, Process & Credibility Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
              <div className="max-w-2xl">
                <div className="text-xs text-[#69736D] mb-1">
                  <span>Structured Workflows</span>
                  <span aria-hidden="true"> · </span>
                  <span>How the Platform Works</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#202923]">
                  Clear Next Steps for Property Buyers &amp; Trainees
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    step: '01.',
                    title: 'Review Verified Specifications',
                    imageUrl: '/images/lekki-villa-ext.jpg',
                    body: 'Browse published properties with clear availability statuses, plot sizes, title document types, and reference codes.',
                  },
                  {
                    step: '02.',
                    title: 'Enquire or Request Inspection',
                    imageUrl: '/images/site-inspection.jpg',
                    body: 'Submit an online enquiry, request a preferred inspection date and time, or initiate a pre-filled WhatsApp conversation.',
                  },
                  {
                    step: '03.',
                    title: 'Select an Academy Programme',
                    imageUrl: '/images/academy-masterclass.jpg',
                    body: 'Compare upcoming real estate courses, learning outcomes, schedules, delivery formats, and tuition fees.',
                  },
                  {
                    step: '04.',
                    title: 'Register Online Instantly',
                    imageUrl: '/images/advisory-consultation.jpg',
                    body: 'Receive your unique trainee registration reference immediately and complete onboarding with our faculty desk.',
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="bg-white border border-[#E3E7E3] rounded-xl overflow-hidden flex flex-col"
                  >
                    <div className="aspect-[16/10] overflow-hidden border-b border-[#E3E7E3]">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 space-y-2">
                      <span className="font-mono-tabular text-xs font-bold text-[#174C3C]">
                        {item.step}
                      </span>
                      <h3 className="text-base font-bold text-[#202923]">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#69736D] leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dual Action Banner with Real Photography Split */}
              <div className="bg-[#174C3C] text-white rounded-xl overflow-hidden border border-[#174C3C] grid grid-cols-1 lg:grid-cols-12 items-stretch">
                <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between space-y-6">
                  <div className="max-w-xl space-y-2">
                    <h3 className="text-xl sm:text-2xl font-bold">
                      Ready to Schedule a Site Inspection or Join Our Next Cohort?
                    </h3>
                    <p className="text-sm text-[#EAF2ED]/90 leading-relaxed">
                      Speak directly with an advisor at {settings.company_name} or register online for an upcoming course with {settings.academy_name}.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => navigateTo({ page: 'properties' })}
                      className="px-5 py-3 bg-white text-[#174C3C] text-xs font-bold rounded-lg hover:bg-[#EAF2ED] transition-colors cursor-pointer"
                    >
                      Book an Inspection
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateTo({ page: 'academy' })}
                      className="px-5 py-3 bg-[#123B2E] text-white border border-white/25 text-xs font-bold rounded-lg hover:bg-black/20 transition-colors cursor-pointer"
                    >
                      Register for a Course
                    </button>
                    <a
                      href={generalWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleTrackWhatsAppClick}
                      className="px-5 py-3 bg-transparent border border-white/30 text-white text-xs font-bold rounded-lg hover:bg-white/10 transition-colors inline-flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Contact on WhatsApp</span>
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-5 min-h-[240px]">
                  <img
                    src="/images/villa-interior.jpg"
                    alt="Luxury Property Interior & Advisory"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ROUTE: PROPERTIES CATALOGUE OR PROPERTY DETAIL (PRD Section 5) */}
        {route.page === 'properties' &&
          (route.slug ? (
            (() => {
              const selectedProperty = properties.find(
                (p) => p.slug === route.slug
              );
              if (!selectedProperty) {
                return (
                  <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
                    <h1 className="text-2xl font-bold text-[#202923]">
                      Property Listing Not Found
                    </h1>
                    <p className="text-sm text-[#69736D]">
                      The requested property may have been archived or moved.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigateTo({ page: 'properties' })}
                      className="px-5 py-2.5 bg-[#174C3C] text-white text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      Return to Property Catalogue
                    </button>
                  </div>
                );
              }
              const related = publicProperties.filter(
                (p) =>
                  p.id !== selectedProperty.id &&
                  p.availability_status === 'Available'
              );
              return (
                <PropertyDetailView
                  property={selectedProperty}
                  relatedProperties={related}
                  settings={settings}
                  onBack={() => navigateTo({ page: 'properties' })}
                  onSelectProperty={handleSelectProperty}
                  onSubmitEnquiry={handleSubmitPropertyEnquiry}
                  onSubmitInspection={handleSubmitInspectionRequest}
                  onTrackWhatsAppClick={handleTrackWhatsAppClick}
                />
              );
            })()
          ) : (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
              <div className="max-w-3xl">
                <div className="text-xs text-[#69736D] mb-2">
                  <span>Elvins Properties</span>
                  <span aria-hidden="true"> · </span>
                  <span>Verified Catalogue</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-[#202923] tracking-tight mb-3">
                  Property Catalogue &amp; Inspection Booking
                </h1>
                <p className="text-sm sm:text-base text-[#69736D]">
                  Filter available residential duplexes, apartments, commercial spaces, and surveyed land across Lagos and Abuja. Select any listing to review full specifications or request a site inspection.
                </p>
              </div>

              {/* Search & Filtering Bar (PRD Section 5.4) */}
              <div className="bg-white border border-[#E3E7E3] rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#202923]">
                    <SlidersHorizontal className="w-4 h-4 text-[#174C3C]" />
                    <span>Filter Property Listings</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setFilterLocation('ALL');
                      setFilterCategory('ALL');
                      setFilterTransaction('ALL');
                      setFilterPriceBand('ALL');
                      setFilterAvailability('ALL_PUBLISHED');
                    }}
                    className="text-xs font-semibold text-[#174C3C] hover:underline cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                  <div className="lg:col-span-2">
                    <label className="block text-[11px] font-semibold text-[#69736D] mb-1">
                      Keyword / Reference Search
                    </label>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-[#69736D] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Title, location, or ELV-..."
                        className="w-full pl-8 pr-3 py-2 text-xs bg-[#FAF9F6] border border-[#E3E7E3] rounded-lg focus:outline-none focus:border-[#174C3C]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#69736D] mb-1">
                      Location Corridor
                    </label>
                    <select
                      value={filterLocation}
                      onChange={(e) => setFilterLocation(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#E3E7E3] rounded-lg"
                    >
                      <option value="ALL">All Locations</option>
                      <option value="Lekki">Lekki Phase 1</option>
                      <option value="Ikoyi">Old Ikoyi</option>
                      <option value="Victoria Island">Victoria Island</option>
                      <option value="Epe">Ketu-Epe Corridor</option>
                      <option value="Ikeja">Ikeja GRA</option>
                      <option value="Abuja">Guzape, Abuja</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#69736D] mb-1">
                      Property Type
                    </label>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#E3E7E3] rounded-lg"
                    >
                      <option value="ALL">All Categories</option>
                      <option value="Residential Houses">Residential Houses</option>
                      <option value="Apartments">Apartments</option>
                      <option value="Land">Land</option>
                      <option value="Commercial Properties">Commercial Properties</option>
                      <option value="Estates">Estates</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#69736D] mb-1">
                      Transaction Type
                    </label>
                    <select
                      value={filterTransaction}
                      onChange={(e) => setFilterTransaction(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#E3E7E3] rounded-lg"
                    >
                      <option value="ALL">All Transactions</option>
                      <option value="For Sale">For Sale</option>
                      <option value="For Rent">For Rent</option>
                      <option value="For Lease">For Lease</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#69736D] mb-1">
                      Price Range
                    </label>
                    <select
                      value={filterPriceBand}
                      onChange={(e) => setFilterPriceBand(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#E3E7E3] rounded-lg"
                    >
                      <option value="ALL">All Price Ranges</option>
                      <option value="UNDER_50M">Up to ₦50M</option>
                      <option value="50M_TO_300M">₦50M – ₦300M</option>
                      <option value="ABOVE_300M">Above ₦300M</option>
                      <option value="POR">Price on Request</option>
                    </select>
                  </div>
                </div>

                {/* Availability Filter Toggle */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#E3E7E3] text-xs">
                  <span className="text-[#69736D] font-mono-tabular">
                    Showing {filteredCatalogueProperties.length} of {publicProperties.length}{' '}
                    published properties
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFilterAvailability('ALL_PUBLISHED')}
                      className={`px-3 py-1.5 rounded-md font-semibold cursor-pointer ${
                        filterAvailability === 'ALL_PUBLISHED'
                          ? 'bg-[#174C3C] text-white'
                          : 'bg-[#FAF9F6] text-[#69736D]'
                      }`}
                    >
                      All Published
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterAvailability('AVAILABLE_ONLY')}
                      className={`px-3 py-1.5 rounded-md font-semibold cursor-pointer ${
                        filterAvailability === 'AVAILABLE_ONLY'
                          ? 'bg-[#174C3C] text-white'
                          : 'bg-[#FAF9F6] text-[#69736D]'
                      }`}
                    >
                      Available Only
                    </button>
                  </div>
                </div>
              </div>

              {/* Property Catalogue Grid */}
              {filteredCatalogueProperties.length === 0 ? (
                <div className="bg-white border border-[#E3E7E3] rounded-xl p-12 text-center space-y-3">
                  <h2 className="text-lg font-bold text-[#202923]">
                    No Matching Properties Found
                  </h2>
                  <p className="text-sm text-[#69736D] max-w-md mx-auto">
                    Try broadening your location or price range filter, or contact our advisory desk for off-market mandates.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                  {filteredCatalogueProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onSelect={handleSelectProperty}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}

        {/* ROUTE: ACADEMY CATALOGUE OR COURSE DETAIL (PRD Section 6) */}
        {route.page === 'academy' &&
          (route.slug ? (
            (() => {
              const selectedCourse = courses.find((c) => c.slug === route.slug);
              if (!selectedCourse) {
                return (
                  <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
                    <h1 className="text-2xl font-bold text-[#202923]">
                      Course Programme Not Found
                    </h1>
                    <button
                      type="button"
                      onClick={() => navigateTo({ page: 'academy' })}
                      className="px-5 py-2.5 bg-[#174C3C] text-white text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      Return to Academy Catalogue
                    </button>
                  </div>
                );
              }
              return (
                <CourseDetailView
                  course={selectedCourse}
                  settings={settings}
                  onBack={() => navigateTo({ page: 'academy' })}
                  onSubmitRegistration={handleSubmitCourseRegistration}
                  onVerifyCoursePayment={handleVerifyCoursePayment}
                  onTrackWhatsAppClick={handleTrackWhatsAppClick}
                />
              );
            })()
          ) : (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="max-w-3xl">
                  <div className="text-xs text-[#69736D] mb-2">
                    <span>Consultant Real Estate Academy</span>
                    <span aria-hidden="true"> · </span>
                    <span>Professional Development &amp; Brokerage Training</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-[#202923] tracking-tight mb-3 balance-text">
                    Real Estate Training Programmes &amp; Online Registration
                  </h1>
                  <p className="text-sm sm:text-base text-[#69736D]">
                    Practical courses built for aspiring real estate consultants, agency principals, and property investors across Nigeria. Select a programme to review modules, schedules, fees, and register online.
                  </p>
                </div>

                {/* Delivery Format Filter */}
                <div className="flex items-center gap-1 p-1 bg-white border border-[#E3E7E3] rounded-lg shrink-0">
                  {['ALL', 'In-Person', 'Online Live', 'Hybrid'].map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setCourseFormatFilter(fmt)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                        courseFormatFilter === fmt
                          ? 'bg-[#174C3C] text-white'
                          : 'text-[#69736D] hover:text-[#202923]'
                      }`}
                    >
                      {fmt === 'ALL' ? 'All Formats' : fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
                {filteredPublicCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onSelect={handleSelectCourse}
                  />
                ))}
              </div>

              {/* Academy FAQ & Brand Relationship Section */}
              <div className="bg-white border border-[#E3E7E3] rounded-xl p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 space-y-2">
                  <span className="text-xs font-semibold text-[#174C3C]">
                    Academy Admissions Desk
                  </span>
                  <h2 className="text-xl font-bold text-[#202923]">
                    Frequently Asked Questions About Academy Registration
                  </h2>
                  <p className="text-xs text-[#69736D] leading-relaxed">
                    Have a question before registering? Review common answers or message our admissions coordinator on WhatsApp.
                  </p>
                </div>

                <div className="lg:col-span-7 divide-y divide-[#E3E7E3] text-sm">
                  <div className="pb-4">
                    <h3 className="font-bold text-[#202923] mb-1">
                      How does the online registration workflow operate?
                    </h3>
                    <p className="text-xs text-[#69736D] leading-relaxed">
                      Select your preferred programme, complete the online registration form, and receive a unique registration reference (e.g., CRA-REG-84920). Our admissions team will contact you with onboarding and tuition settlement instructions.
                    </p>
                  </div>
                  <div className="py-4">
                    <h3 className="font-bold text-[#202923] mb-1">
                      Can I attend if I am based outside Lagos?
                    </h3>
                    <p className="text-xs text-[#69736D] leading-relaxed">
                      Yes. Our Online Live and Hybrid courses support participants across Abuja, Port Harcourt, Ibadan, Enugu, and the diaspora via interactive live virtual classrooms.
                    </p>
                  </div>
                  <div className="pt-4">
                    <h3 className="font-bold text-[#202923] mb-1">
                      How is Consultant Real Estate Academy connected to Elvins Properties?
                    </h3>
                    <p className="text-xs text-[#69736D] leading-relaxed">
                      {settings.brand_relationship_statement}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

        {/* ROUTE: REAL ESTATE SERVICES */}
        {route.page === 'services' && (
          <ServicesView
            settings={settings}
            onExploreProperties={() => navigateTo({ page: 'properties' })}
            onExploreAcademy={() => navigateTo({ page: 'academy' })}
            onNavigateContact={() => navigateTo({ page: 'contact' })}
          />
        )}

        {/* ROUTE: ABOUT US */}
        {route.page === 'about' && (
          <AboutView
            settings={settings}
            onExploreProperties={() => navigateTo({ page: 'properties' })}
            onExploreAcademy={() => navigateTo({ page: 'academy' })}
          />
        )}

        {/* ROUTE: CONTACT US */}
        {route.page === 'contact' && (
          <ContactView
            settings={settings}
            properties={properties}
            onSubmitGeneralEnquiry={handleSubmitPropertyEnquiry}
            onTrackWhatsAppClick={handleTrackWhatsAppClick}
          />
        )}

        {/* ROUTE: PRIVACY POLICY & TERMS OF USE */}
        {route.page === 'privacy' && (
          <LegalView type="privacy" settings={settings} />
        )}
        {route.page === 'terms' && (
          <LegalView type="terms" settings={settings} />
        )}

        {/* ROUTE: ADMINISTRATOR DASHBOARD (PRD Section 9) */}
        {route.page === 'admin' && (
          <AdminDashboard
            properties={properties}
            courses={courses}
            registrations={registrations}
            enquiries={enquiries}
            inspections={inspections}
            notifications={notifications}
            analytics={analytics}
            settings={settings}
            onSaveProperty={handleSaveProperty}
            onSaveCourse={handleSaveCourse}
            onUpdateEnquiry={handleUpdateEnquiry}
            onUpdateInspection={handleUpdateInspection}
            onUpdateRegistration={handleUpdateRegistration}
            onUpdateSettings={setSettings}
            onPreviewProperty={handleSelectProperty}
            onPreviewCourse={handleSelectCourse}
          />
        )}
      </main>

      {/* Quiet Footer (PRD Section 4.5) */}
      <footer className="bg-white border-t border-[#E3E7E3] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-[#E3E7E3]">
            <div className="lg:col-span-2 space-y-3">
              <span className="font-display text-lg font-extrabold text-[#174C3C]">
                {settings.company_name} &amp; {settings.academy_name}
              </span>
              <p className="text-xs text-[#69736D] max-w-md leading-relaxed">
                {settings.brand_relationship_statement}
              </p>
              <div className="text-xs text-[#202923] space-y-1 pt-1">
                <p>{settings.office_address}</p>
                <p className="font-mono-tabular">
                  Tel / WhatsApp: +{settings.whatsapp_number} · {settings.notification_email}
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <span className="font-bold text-[#202923] block">
                Elvins Properties
              </span>
              <ul className="space-y-2 text-[#69736D]">
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo({ page: 'properties' })}
                    className="hover:text-[#174C3C] cursor-pointer"
                  >
                    Property Catalogue
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setFilterAvailability('AVAILABLE_ONLY');
                      navigateTo({ page: 'properties' });
                    }}
                    className="hover:text-[#174C3C] cursor-pointer"
                  >
                    Available Listings
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo({ page: 'services' })}
                    className="hover:text-[#174C3C] cursor-pointer"
                  >
                    Real Estate Services
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo({ page: 'contact' })}
                    className="hover:text-[#174C3C] cursor-pointer"
                  >
                    Request Site Inspection
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5 text-xs">
              <span className="font-bold text-[#202923] block">
                Consultant Academy
              </span>
              <ul className="space-y-2 text-[#69736D]">
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo({ page: 'academy' })}
                    className="hover:text-[#174C3C] cursor-pointer"
                  >
                    Training Programmes
                  </button>
                </li>
                {publicCourses.slice(0, 3).map((crs) => (
                  <li key={crs.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectCourse(crs)}
                      className="hover:text-[#174C3C] text-left truncate max-w-[200px] cursor-pointer"
                    >
                      {crs.reference}: {crs.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2.5 text-xs">
              <span className="font-bold text-[#202923] block">
                Governance &amp; Contact
              </span>
              <ul className="space-y-2 text-[#69736D]">
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo({ page: 'about' })}
                    className="hover:text-[#174C3C] cursor-pointer"
                  >
                    About the Business
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo({ page: 'privacy' })}
                    className="hover:text-[#174C3C] cursor-pointer"
                  >
                    Privacy Policy (NDPA)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo({ page: 'terms' })}
                    className="hover:text-[#174C3C] cursor-pointer"
                  >
                    Terms of Use
                  </button>
                </li>
                <li>
                  <a
                    href={generalWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleTrackWhatsAppClick}
                    className="text-[#174C3C] font-semibold hover:underline"
                  >
                    Chat on WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#69736D]">
            <p>
              &copy; {new Date().getFullYear()} {settings.company_name} &amp;{' '}
              {settings.academy_name}. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigateTo({ page: 'privacy' })}
                className="hover:text-[#202923] cursor-pointer"
              >
                Privacy Policy
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => navigateTo({ page: 'terms' })}
                className="hover:text-[#202923] cursor-pointer"
              >
                Terms of Use
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => navigateTo({ page: 'admin' })}
                className="hover:text-[#202923] cursor-pointer"
              >
                Administrator Access
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
