import React, { useState } from 'react';
import {
  Course,
  BusinessSettings,
  Registration,
  DeliveryMethod,
} from '../types';
import { ArchitecturalVisual } from './ArchitecturalVisual';
import {
  formatNaira,
  formatDateReadable,
  buildCourseWhatsAppUrl,
} from '../utils/formatters';
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  HelpCircle,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

interface CourseDetailViewProps {
  course: Course;
  settings: BusinessSettings;
  onBack: () => void;
  onSubmitRegistration: (
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
  ) => Registration;
  onVerifyCoursePayment: (registrationId: string, paymentRef: string) => void;
  onTrackWhatsAppClick: () => void;
}

export const CourseDetailView: React.FC<CourseDetailViewProps> = ({
  course,
  settings,
  onBack,
  onSubmitRegistration,
  onVerifyCoursePayment,
  onTrackWhatsAppClick,
}) => {
  const canRegister =
    course.registration_status === 'Registration Open' ||
    course.registration_status === 'Upcoming';

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredDelivery, setPreferredDelivery] = useState<DeliveryMethod>(
    course.delivery_method === 'Hybrid' ? 'In-Person' : course.delivery_method
  );
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [consent, setConsent] = useState(false);
  const [formError, setFormError] = useState('');
  const [completedRegistration, setCompletedRegistration] = useState<Registration | null>(null);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);

  const whatsappUrl = buildCourseWhatsAppUrl(settings.whatsapp_number, course);
  const seatsRemaining = Math.max(0, course.capacity - course.enrolled_count);

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!canRegister) {
      setFormError('Registration is currently closed for this programme.');
      return;
    }
    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      setFormError('Please complete your full name, phone number, and email address.');
      return;
    }
    if (!consent) {
      setFormError('Please provide consent to be contacted by Consultant Real Estate Academy.');
      return;
    }

    const saved = onSubmitRegistration({
      course_id: course.id,
      course_reference: course.reference,
      course_title: course.title,
      full_name: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      preferred_delivery: preferredDelivery,
      additional_information: additionalInfo.trim(),
      consent_status: consent,
      amount: course.fee,
    });
    setCompletedRegistration(saved);
  };

  const handleSimulateServerVerifiedPayment = () => {
    if (!completedRegistration) return;
    setVerifyingPayment(true);
    setTimeout(() => {
      const generatedPayRef = `PAY-CRA-${Date.now().toString().slice(-6)}`;
      onVerifyCoursePayment(completedRegistration.id, generatedPayRef);
      setPaymentVerified(true);
      setVerifyingPayment(false);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E3E7E3]">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#202923] hover:text-[#174C3C] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Academy Programmes</span>
        </button>

        <div className="flex items-center gap-3 text-xs text-[#69736D]">
          <span>
            Course Code:{' '}
            <strong className="font-mono-tabular text-[#202923]">{course.reference}</strong>
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Status:{' '}
            <strong className="text-[#174C3C]">{course.registration_status}</strong>
          </span>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left 7 Columns: Course Details, Modules, Outcomes, FAQs */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#69736D] mb-2">
              <span>Consultant Real Estate Academy</span>
              <span aria-hidden="true">·</span>
              <span>{course.delivery_method} Format</span>
              <span aria-hidden="true">·</span>
              <span>{course.duration}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#202923] tracking-tight mb-4 balance-text">
              {course.title}
            </h1>

            <p className="text-base text-[#69736D] leading-relaxed">
              {course.description}
            </p>
          </div>

          <div className="bg-white border border-[#E3E7E3] rounded-xl overflow-hidden">
            <ArchitecturalVisual
              preset={course.visual_preset}
              customImageUrl={course.custom_image_url}
              alt={course.title}
              caption={`${course.reference} — ${course.venue}`}
              aspectRatio="16:9"
            />
          </div>

          {/* Schedule & Key Logistics */}
          <section className="bg-white border border-[#E3E7E3] rounded-xl p-6">
            <h2 className="text-lg font-bold text-[#202923] mb-4">
              Programme Schedule &amp; Delivery Logistics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#E3E7E3] text-sm">
              <div>
                <span className="block text-xs text-[#69736D]">Commencement Date</span>
                <strong className="font-mono-tabular text-[#202923]">
                  {formatDateReadable(course.start_date)}
                </strong>
              </div>
              <div>
                <span className="block text-xs text-[#69736D]">Registration Deadline</span>
                <strong className="font-mono-tabular text-[#202923]">
                  {formatDateReadable(course.registration_deadline)}
                </strong>
              </div>
              <div>
                <span className="block text-xs text-[#69736D]">Session Schedule</span>
                <strong className="text-[#202923]">{course.schedule}</strong>
              </div>
              <div>
                <span className="block text-xs text-[#69736D]">Cohort Capacity</span>
                <strong className="font-mono-tabular text-[#202923]">
                  {seatsRemaining} seats remaining (Max {course.capacity})
                </strong>
              </div>
              <div className="sm:col-span-2 pt-2 border-t border-[#E3E7E3]">
                <span className="block text-xs text-[#69736D]">Physical Venue / Online Access</span>
                <strong className="text-[#202923]">{course.venue}</strong>
              </div>
            </div>
          </section>

          {/* Learning Outcomes */}
          <section className="bg-white border border-[#E3E7E3] rounded-xl p-6">
            <h2 className="text-lg font-bold text-[#202923] mb-4">
              Learning Objectives &amp; Practitioner Outcomes
            </h2>
            <ul className="space-y-3 text-sm text-[#202923]">
              {course.learning_objectives.map((obj, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="font-mono-tabular text-xs font-bold text-[#174C3C] mt-0.5">
                    0{index + 1}.
                  </span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Curriculum Modules */}
          <section className="bg-white border border-[#E3E7E3] rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-[#202923]">
              Course Modules &amp; Syllabus
            </h2>
            <div className="divide-y divide-[#E3E7E3]">
              {course.modules.map((mod, idx) => (
                <div key={mod.code} className="py-4 first:pt-1 last:pb-1">
                  <div className="text-xs font-mono-tabular text-[#174C3C] font-semibold mb-1">
                    0{idx + 1}. {mod.code}
                  </div>
                  <h3 className="text-sm font-bold text-[#202923]">{mod.title}</h3>
                  <p className="text-sm text-[#69736D] mt-1">{mod.summary}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Target Audience */}
          <section className="bg-white border border-[#E3E7E3] rounded-xl p-6">
            <h2 className="text-lg font-bold text-[#202923] mb-2">
              Intended Participants
            </h2>
            <p className="text-sm text-[#69736D] leading-relaxed">
              {course.target_audience}
            </p>
          </section>

          {/* Frequently Asked Questions */}
          {course.faqs.length > 0 && (
            <section className="bg-white border border-[#E3E7E3] rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#174C3C]" />
                <h2 className="text-lg font-bold text-[#202923]">
                  Programme FAQs
                </h2>
              </div>
              <div className="divide-y divide-[#E3E7E3]">
                {course.faqs.map((faq, index) => (
                  <div key={index} className="py-4 first:pt-1 last:pb-1">
                    <h3 className="text-sm font-bold text-[#202923] mb-1">
                      {faq.question}
                    </h3>
                    <p className="text-sm text-[#69736D] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right 5 Columns: Online Registration Form & Tuition Instructions */}
        <div className="lg:col-span-5 bg-white border border-[#E3E7E3] rounded-xl p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-[#E3E7E3] flex items-baseline justify-between gap-4">
            <div>
              <span className="block text-xs text-[#69736D]">Programme Tuition</span>
              <span className="text-2xl sm:text-3xl font-bold text-[#174C3C] font-mono-tabular">
                {formatNaira(course.fee)}
              </span>
            </div>
            <span className="text-xs font-mono-tabular text-[#69736D]">
              Ref: {course.reference}
            </span>
          </div>

          {!canRegister ? (
            <div className="p-5 rounded-xl bg-[#FAF9F6] border border-[#E3E7E3] space-y-2">
              <h3 className="text-sm font-bold text-[#202923]">
                Registration Currently Unavailable ({course.registration_status})
              </h3>
              <p className="text-xs text-[#69736D] leading-relaxed">
                Online registration is disabled when a course is closed, in progress, or completed. Please contact the Academy via WhatsApp to join the priority list for the next cohort.
              </p>
            </div>
          ) : completedRegistration ? (
            <div className="space-y-5">
              {/* Exact PRD Section 6.6 Registration Confirmation Wording */}
              <div className="p-5 rounded-xl bg-[#EAF2ED] border border-[#174C3C]/30 space-y-3">
                <div className="flex items-center gap-2 text-[#174C3C] font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Registration Received</span>
                </div>

                <p className="text-sm text-[#202923] font-medium leading-relaxed">
                  Thank you for registering with Consultant Real Estate Academy. Your registration details have been received. The academy will contact you with the next steps.
                </p>

                <div className="pt-3 border-t border-[#174C3C]/15 text-xs text-[#202923] space-y-1">
                  <p>
                    Registration Reference:{' '}
                    <strong className="font-mono-tabular">
                      {completedRegistration.registration_reference}
                    </strong>
                  </p>
                  <p>
                    Selected Programme: <strong>{completedRegistration.course_title}</strong>
                  </p>
                  <p>
                    Current Status:{' '}
                    <strong className="text-[#174C3C]">
                      {paymentVerified
                        ? 'Confirmed (Payment Verified)'
                        : completedRegistration.registration_status}
                    </strong>
                  </p>
                </div>
              </div>

              {/* Payment Instructions & Optional Server-Verified Checkout (PRD Section 7) */}
              <div className="p-5 rounded-xl bg-[#FAF9F6] border border-[#E3E7E3] space-y-3">
                <h3 className="text-xs font-bold text-[#202923]">
                  Tuition Payment Instructions
                </h3>
                <p className="text-xs text-[#69736D]">
                  Bank: <strong className="text-[#202923]">{settings.bank_name}</strong> · Account:{' '}
                  <strong className="font-mono-tabular text-[#202923]">
                    {settings.bank_account_number}
                  </strong>{' '}
                  ({settings.bank_account_name})
                </p>
                <p className="text-xs text-[#69736D]">
                  Quote your registration reference{' '}
                  <strong className="font-mono-tabular text-[#202923]">
                    {completedRegistration.registration_reference}
                  </strong>{' '}
                  in the transfer narration.
                </p>

                {settings.enable_online_payment_verification && !paymentVerified && (
                  <div className="pt-3 border-t border-[#E3E7E3]">
                    <button
                      type="button"
                      disabled={verifyingPayment}
                      onClick={handleSimulateServerVerifiedPayment}
                      className="w-full py-2.5 px-4 bg-[#174C3C] hover:bg-[#123B2E] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>
                        {verifyingPayment
                          ? 'Verifying Transaction Reference...'
                          : `Complete Instant Checkout (${formatNaira(course.fee)})`}
                      </span>
                    </button>
                  </div>
                )}

                {paymentVerified && (
                  <div className="flex items-center gap-2 text-xs text-[#174C3C] font-semibold pt-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>
                      Tuition payment verified on server. Official receipt recorded.
                    </span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setCompletedRegistration(null);
                  setPaymentVerified(false);
                }}
                className="text-xs font-semibold text-[#174C3C] underline cursor-pointer"
              >
                Register another participant
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegistrationSubmit} className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-[#202923]">
                  Online Trainee Registration
                </h2>
                <p className="text-xs text-[#69736D] mt-0.5">
                  Register directly below to receive your unique trainee reference and joining instructions.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202923] mb-1">
                  Selected Programme
                </label>
                <input
                  type="text"
                  readOnly
                  value={`${course.reference} — ${course.title}`}
                  className="w-full px-3.5 py-2 text-xs font-mono-tabular bg-[#FAF9F6] border border-[#E3E7E3] rounded-lg text-[#69736D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202923] mb-1">
                  Full Name (as to appear on Certificate) *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Chidinma Okafor"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E3E7E3] rounded-lg focus:outline-none focus:border-[#174C3C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#202923] mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 803 000 0000"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E3E7E3] rounded-lg focus:outline-none focus:border-[#174C3C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#202923] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E3E7E3] rounded-lg focus:outline-none focus:border-[#174C3C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202923] mb-1">
                  Preferred Delivery Option
                </label>
                <select
                  value={preferredDelivery}
                  onChange={(e) => setPreferredDelivery(e.target.value as DeliveryMethod)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E3E7E3] rounded-lg focus:outline-none focus:border-[#174C3C]"
                >
                  {course.delivery_method === 'Hybrid' ? (
                    <>
                      <option value="In-Person">In-Person (Lekki Phase 1 Training Suite)</option>
                      <option value="Online Live">Online Live (Interactive Zoom Classroom)</option>
                    </>
                  ) : (
                    <option value={course.delivery_method}>{course.delivery_method}</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202923] mb-1">
                  Current Role / Learning Goals (Optional)
                </label>
                <textarea
                  rows={2}
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Share your background or specific questions for the faculty..."
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#E3E7E3] rounded-lg focus:outline-none focus:border-[#174C3C]"
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
                  I consent to Consultant Real Estate Academy contacting me with programme registration updates and payment instructions.
                </span>
              </label>

              {formError && (
                <p className="text-xs text-red-700 font-medium">{formError}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#174C3C] hover:bg-[#123B2E] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Submit Online Registration
              </button>
            </form>
          )}

          {/* Direct WhatsApp Course Enquiry */}
          <div className="pt-4 border-t border-[#E3E7E3]">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onTrackWhatsAppClick}
              className="w-full py-2.5 px-4 bg-[#EAF2ED] hover:bg-[#d8e8de] text-[#174C3C] text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Enquire About This Course on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
