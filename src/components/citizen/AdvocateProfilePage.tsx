import React from 'react';
import { 
  ShieldCheck, Star, MapPin, Calendar, Clock, ArrowLeft, 
  ArrowRight, Award, BookOpen, Scale, CheckCircle2, MessageSquare,
  Building, GraduationCap, FileCheck
} from 'lucide-react';
import { Language, AppRoute, Advocate } from '../../types';

interface AdvocateProfilePageProps {
  advocate: Advocate;
  language: Language;
  onNavigate: (route: AppRoute, params?: any) => void;
  onBookAppointment?: (advocate: Advocate) => void;
}

export function AdvocateProfilePage({
  advocate,
  language,
  onNavigate,
  onBookAppointment,
}: AdvocateProfilePageProps) {
  const handleBooking = () => {
    if (onBookAppointment) {
      onBookAppointment(advocate);
    } else {
      onNavigate('appointment-book', { advocate });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Back Button */}
      <button
        id="btn-back-to-advocates"
        onClick={() => onNavigate('appointments')}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-sky-700 transition-colors cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-sky-100 shadow-2xs"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{language === 'en' ? 'Back to Advocate Discovery' : 'अधिवक्ता सूची पर वापस जाएं'}</span>
      </button>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
              {advocate.name.split(' ').slice(1, 3).map(n => n[0]).join('') || 'AD'}
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{advocate.name}</h1>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                  <span>Verified Bar Advocate</span>
                </span>
              </div>

              <p className="text-sm font-bold text-sky-700">
                {advocate.practiceAreas.join(' • ')}
              </p>

              <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap pt-0.5">
                <span className="flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{advocate.location}</span>
                </span>
                <span>•</span>
                <span className="font-semibold text-slate-700">{advocate.experience}</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-bold text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{advocate.rating}</span>
                  <span className="text-slate-400 font-normal">({advocate.reviewCount} client reviews)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Fee & Instant CTA */}
          <div className="w-full sm:w-auto p-4 rounded-2xl bg-sky-50/80 border border-sky-200/80 flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block sm:text-right">Consultation Fee</span>
              <span className="text-2xl font-extrabold text-slate-900">₹{advocate.consultationFee}</span>
              <span className="text-xs text-slate-500"> / 30-min session</span>
            </div>

            <button
              id="btn-profile-book-now"
              onClick={handleBooking}
              className="py-2.5 px-5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-600/20 flex items-center gap-2 cursor-pointer"
            >
              <span>Book Appointment</span>
              <ArrowRight className="w-4 h-4 text-sky-200" />
            </button>
          </div>

        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 block font-semibold">Bar Council ID</span>
            <span className="font-mono font-bold text-slate-800 text-[11px] truncate block">
              {advocate.barEnrollment || 'Enrolled / Verified'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 block font-semibold">Languages</span>
            <span className="font-semibold text-slate-800 truncate block">
              {advocate.languages.join(', ')}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 block font-semibold">Primary Courts</span>
            <span className="font-semibold text-slate-800 truncate block">
              {advocate.courtLevels.join(', ')}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 block font-semibold">Current Availability</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{advocate.availability}</span>
            </span>
          </div>
        </div>

      </div>

      {/* Details Sections: About, Education, Experience, Past Cases */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Biography, Courts, Experience */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* About Section */}
          <div className="bg-white rounded-2xl p-6 border border-sky-100 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-600" />
              <span>About the Advocate</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {advocate.about}
            </p>
          </div>

          {/* Education & Bar Credentials */}
          <div className="bg-white rounded-2xl p-6 border border-sky-100 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-sky-600" />
              <span>Education & Credentials</span>
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{advocate.education}</span>
              </div>
              <div className="flex items-start gap-2">
                <FileCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span>Bar Council Enrollment: <strong>{advocate.barEnrollment}</strong></span>
              </div>
              <div className="flex items-start gap-2">
                <Building className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>Practising Before: {advocate.courts}</span>
              </div>
            </div>
          </div>

          {/* Past Cases / Track Record */}
          <div className="bg-white rounded-2xl p-6 border border-sky-100 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Scale className="w-4 h-4 text-sky-600" />
              <span>Track Record & Case Summary</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {advocate.pastCasesSummary}
            </p>
          </div>

          {/* Client Reviews */}
          {advocate.reviews && advocate.reviews.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-sky-100 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-500" />
                <span>Verified Citizen Feedback</span>
              </h3>

              <div className="space-y-3">
                {advocate.reviews.map((rev, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{rev.author}</span>
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 italic">"{rev.comment}"</p>
                    <span className="text-[10px] text-slate-400 block">{rev.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Appointment Booking Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-sky-200 shadow-sm space-y-4 sticky top-24">
            <h3 className="text-base font-bold text-slate-900">Schedule Consultation</h3>
            
            <div className="space-y-2 text-xs text-slate-600">
              <p className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>Duration:</span>
                <span className="font-bold text-slate-800">30 Minutes</span>
              </p>
              <p className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>Modes:</span>
                <span className="font-bold text-slate-800">Video, Audio or In-Person</span>
              </p>
              <p className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>Fee:</span>
                <span className="font-bold text-slate-900 text-sm">₹{advocate.consultationFee}</span>
              </p>
              <p className="flex items-center justify-between py-1">
                <span>Privacy:</span>
                <span className="text-emerald-700 font-semibold">100% Confidential</span>
              </p>
            </div>

            <button
              id="btn-sidebar-book-appointment"
              onClick={() => onBookAppointment(advocate)}
              className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <span>Proceed to Booking</span>
              <ArrowRight className="w-4 h-4 text-sky-200" />
            </button>

            <p className="text-[11px] text-slate-400 text-center leading-tight">
              Includes document inspection & legal notice guidance.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
