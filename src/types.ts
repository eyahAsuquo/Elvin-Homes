export type PropertyCategory =
  | 'Land'
  | 'Residential Houses'
  | 'Apartments'
  | 'Commercial Properties'
  | 'Estates';

export type TransactionType = 'For Sale' | 'For Rent' | 'For Lease';

export type PropertyAvailability =
  | 'Available'
  | 'Reserved'
  | 'Sold'
  | 'Rented'
  | 'Archived';

export type PublicationStatus = 'Published' | 'Draft';

export type ArchitecturalVisualPreset =
  | 'lekki_villa'
  | 'ikoyi_penthouse'
  | 'abuja_terrace'
  | 'vi_commercial'
  | 'epe_land_estate'
  | 'ikeja_duplex'
  | 'maitama_mansion'
  | 'academy_masterclass'
  | 'academy_valuation'
  | 'academy_law_title'
  | 'academy_development';

export interface PropertyGalleryItem {
  id: string;
  caption: string;
  viewType: 'Exterior' | 'Interior' | 'Site Plan';
  preset: ArchitecturalVisualPreset;
  customImageUrl?: string;
}

export interface PropertySpecifications {
  bedrooms?: number;
  bathrooms?: number;
  plot_size_sqm: number;
  parking_spaces?: number;
  title_document: string;
  serviced: boolean;
  amenities: string[];
  district_zone: string;
}

export interface Property {
  id: string;
  reference: string;
  title: string;
  slug: string;
  description: string;
  property_type: PropertyCategory;
  transaction_type: TransactionType;
  location: string;
  state: string;
  price: number | null; // null if Price on Request
  price_on_request: boolean;
  payment_plan_summary?: string;
  currency: 'NGN';
  specifications: PropertySpecifications;
  gallery: PropertyGalleryItem[];
  availability_status: PropertyAvailability;
  publication_status: PublicationStatus;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export type CourseStatus =
  | 'Draft'
  | 'Upcoming'
  | 'Registration Open'
  | 'Registration Closed'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled';

export type DeliveryMethod = 'In-Person' | 'Online Live' | 'Hybrid';

export interface CourseFAQ {
  question: string;
  answer: string;
}

export interface CourseModule {
  code: string;
  title: string;
  summary: string;
}

export interface Course {
  id: string;
  reference: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  learning_objectives: string[];
  modules: CourseModule[];
  target_audience: string;
  duration: string;
  start_date: string;
  schedule: string;
  delivery_method: DeliveryMethod;
  venue: string;
  fee: number;
  currency: 'NGN';
  registration_deadline: string;
  capacity: number;
  enrolled_count: number;
  registration_status: CourseStatus;
  publication_status: PublicationStatus;
  visual_preset: ArchitecturalVisualPreset;
  custom_image_url?: string;
  faqs: CourseFAQ[];
  created_at: string;
  updated_at: string;
}

export type RegistrationStatus =
  | 'New'
  | 'Contacted'
  | 'Awaiting Payment'
  | 'Confirmed'
  | 'Completed'
  | 'Cancelled';

export type PaymentStatus =
  | 'Awaiting Transfer'
  | 'Pending Verification'
  | 'Paid'
  | 'Failed';

export interface Registration {
  id: string;
  registration_reference: string;
  course_id: string;
  course_reference: string;
  course_title: string;
  full_name: string;
  phone: string;
  email: string;
  preferred_delivery: DeliveryMethod;
  additional_information: string;
  consent_status: boolean;
  registration_status: RegistrationStatus;
  payment_status: PaymentStatus;
  payment_reference?: string;
  amount: number;
  internal_notes: string;
  created_at: string;
  updated_at: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Closed';

export interface PropertyEnquiry {
  id: string;
  enquiry_reference: string;
  property_id: string;
  property_reference: string;
  property_title: string;
  full_name: string;
  phone: string;
  email: string;
  message: string;
  consent_status: boolean;
  lead_status: LeadStatus;
  source: 'Web Form' | 'WhatsApp Click' | 'General Contact';
  internal_notes: string;
  created_at: string;
  updated_at: string;
}

export type InspectionStatus =
  | 'Pending'
  | 'Contacted'
  | 'Confirmed'
  | 'Completed'
  | 'Cancelled';

export interface InspectionRequest {
  id: string;
  inspection_reference: string;
  property_id: string;
  property_reference: string;
  property_title: string;
  full_name: string;
  phone: string;
  email: string;
  preferred_date: string;
  preferred_time: string;
  message: string;
  consent_status: boolean;
  inspection_status: InspectionStatus;
  internal_notes: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationLogItem {
  id: string;
  type: 'Property Enquiry' | 'Inspection Request' | 'Course Registration' | 'Payment Verification';
  recipient_email: string;
  subject: string;
  reference: string;
  delivery_state: 'Delivered' | 'Queued (Retained in DB)';
  timestamp: string;
}

export interface AnalyticsSummary {
  property_views: Record<string, number>;
  course_views: Record<string, number>;
  whatsapp_clicks: number;
  property_enquiries_count: number;
  inspection_requests_count: number;
  academy_registrations_count: number;
}

export interface BusinessSettings {
  company_name: string;
  academy_name: string;
  brand_relationship_statement: string;
  whatsapp_number: string; // e.g. 2348030001234
  notification_email: string;
  office_address: string;
  google_sites_legacy_url: string;
  google_sites_mode: 'Integrated Replacement' | 'Coexisting Academy Landing';
  enable_online_payment_verification: boolean;
  bank_name: string;
  bank_account_name: string;
  bank_account_number: string;
}

export type UserRole = 'Administrator' | 'Staff';
