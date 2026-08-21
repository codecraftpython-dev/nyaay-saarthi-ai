import React from 'react';
import { 
  Bot, Calendar, BookOpen, FileText, ArrowRight, Sparkles, 
  Clock, CheckCircle2, ShieldCheck, PhoneCall, ChevronRight,
  ExternalLink, UserCheck, AlertCircle, Bookmark, MessageSquare
} from 'lucide-react';
import { Language, AppRoute, AuthUser, Application, Appointment } from '../../types';
import { getStoredApplications, getStoredAppointments } from '../../data/portalData';

interface CitizenHomePageProps {
  user: AuthUser;
  language: Language;
  onLanguageChange?: (lang: Language) => void;
  onNavigate: (route: AppRoute, params?: any) => void;
  onLogout?: () => void;
}

export function CitizenHomePage({
  user,
  language,
  onLanguageChange,
  onNavigate,
  onLogout,
}: CitizenHomePageProps) {
  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return language === 'en' ? 'Good morning' : 'सुप्रभात';
    if (hour < 17) return language === 'en' ? 'Good afternoon' : 'शुभ दोपहर';
    return language === 'en' ? 'Good evening' : 'शुभ संध्या';
  };

  const applications = getStoredApplications();
  const appointments = getStoredAppointments();

  const recentAppointments = appointments.slice(0, 2);
  const recentApplications = applications.slice(0, 2);

  return (
    <div className="space-y-8 pb-12">
      
      {/* 1. Header Greeting Section (Section 5) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-sky-100 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-sky-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
        
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold border border-sky-200/60">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>{language === 'en' ? 'Citizen Legal Empowerment Portal' : 'नागरिक कानूनी सशक्तिकरण मंच'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {getGreeting()}, {user.name} 👋
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-medium">
            {language === 'en' 
              ? 'How can Nyaay सारथी help you today?' 
              : 'न्याय सारथी आज आपकी किस प्रकार सहायता कर सकता है?'}
          </p>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed pt-1">
            {language === 'en'
              ? 'Understand your constitutional rights, analyze legal notices, prepare complaints with AI assistance, and book consultations with verified Bar Council advocates.'
              : 'संवैधानिक अधिकारों को समझें, कानूनी नोटिसों का सरल विश्लेषण करें, AI से आवेदन तैयार करें और बार काउंसिल वकीलों से परामर्श लें।'}
          </p>
        </div>
      </section>

      {/* 2. Main Citizen Actions (Section 6) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            {language === 'en' ? 'Primary Legal Services' : 'प्रमुख कानूनी सेवाएं'}
          </h2>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            {language === 'en' ? 'Transparent • Jargon-Free • Citizen-First' : 'पारदर्शी • सरल भाषा • नागरिक सर्वोपरि'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          
          {/* Card 1: AI Legal Assistance */}
          <div className="bg-white rounded-2xl p-6 border border-sky-100 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 group-hover:scale-105 transition-transform">
                  <Bot className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 bg-sky-100/70 text-sky-800 rounded-full">
                  {language === 'en' ? 'Instant 24/7' : '24/7 तुरंत'}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1.5 group-hover:text-sky-700 transition-colors">
                  {language === 'en' ? 'Chat with Nyaay सारथी' : 'न्याय सारथी AI से बात करें'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {language === 'en'
                    ? 'Describe your legal problem in simple language and understand your possible rights and next steps.'
                    : 'अपनी कानूनी समस्या को सरल भाषा में बताएं और अपने संभावित अधिकार व अगला कदम समझें।'}
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button
                id="btn-main-start-chat"
                onClick={() => onNavigate('chat')}
                className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold shadow-sm shadow-sky-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                <span>{language === 'en' ? 'Start Chat' : 'बातचीत शुरू करें'}</span>
                <ArrowRight className="w-4 h-4 text-sky-200" />
              </button>
            </div>
          </div>

          {/* Card 2: Book an Appointment */}
          <div className="bg-white rounded-2xl p-6 border border-sky-100 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 group-hover:scale-105 transition-transform">
                  <Calendar className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 bg-emerald-100/80 text-emerald-800 rounded-full">
                  {language === 'en' ? 'Verified Advocates' : 'सत्यापित वकील'}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1.5 group-hover:text-sky-700 transition-colors">
                  {language === 'en' ? 'Find an Advocate' : 'वकील खोजें और अपॉइंटमेंट लें'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {language === 'en'
                    ? 'Find advocates based on your legal requirement, court level, location, experience and consultation fee.'
                    : 'अपनी कानूनी जरूरत, न्यायालय स्तर, स्थान, अनुभव और परामर्श शुल्क के अनुसार वकील खोजें।'}
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button
                id="btn-main-find-advocate"
                onClick={() => onNavigate('appointments')}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                <span>{language === 'en' ? 'Book Appointment' : 'अपॉइंटमेंट बुक करें'}</span>
                <ArrowRight className="w-4 h-4 text-slate-300" />
              </button>
            </div>
          </div>

          {/* Card 3: Know Your Rights */}
          <div className="bg-white rounded-2xl p-6 border border-sky-100 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 bg-teal-100/70 text-teal-800 rounded-full">
                  {language === 'en' ? '12 Categories' : '12 श्रेणियां'}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1.5 group-hover:text-sky-700 transition-colors">
                  {language === 'en' ? 'Know Your Rights' : 'अपने नागरिक अधिकार जानें'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {language === 'en'
                    ? 'Explore legal and constitutional rights explained in simple language.'
                    : 'संवैधानिक व वैधानिक अधिकारों को रोजमर्रा की आसान भाषा में समझें।'}
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button
                id="btn-main-explore-rights"
                onClick={() => onNavigate('rights')}
                className="w-full py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-bold shadow-sm shadow-teal-700/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                <span>{language === 'en' ? 'Explore Rights' : 'अधिकार देखें'}</span>
                <ArrowRight className="w-4 h-4 text-teal-200" />
              </button>
            </div>
          </div>

          {/* Card 4: My Applications */}
          <div className="bg-white rounded-2xl p-6 border border-sky-100 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 bg-amber-100/70 text-amber-800 rounded-full">
                  {applications.length} {language === 'en' ? 'Active' : 'सक्रिय'}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1.5 group-hover:text-sky-700 transition-colors">
                  {language === 'en' ? 'My Applications' : 'मेरे आवेदन व शिकायतें'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {language === 'en'
                    ? 'View your applications, complaints, case-related requests and their current status.'
                    : 'अपने आवेदन, कानूनी नोटिस, शिकायतें और वर्तमान स्थिति को ट्रैक करें।'}
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button
                id="btn-main-view-applications"
                onClick={() => onNavigate('user/applications')}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs sm:text-sm font-bold shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                <span>{language === 'en' ? 'View Applications' : 'आवेदन देखें'}</span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Quick Action Section (Section 7) */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 border border-sky-100 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            {language === 'en' ? 'Quick Actions' : 'त्वरित कार्य'}
          </h3>
          <span className="text-xs text-slate-400">Direct Navigation</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3">
          
          <button
            id="quick-action-chat-ai"
            onClick={() => onNavigate('chat')}
            className="p-3 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200/80 hover:border-sky-200 text-xs font-bold text-slate-700 hover:text-sky-700 flex items-center gap-2 transition-all cursor-pointer shadow-2xs group"
          >
            <Bot className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
            <span className="truncate">{language === 'en' ? 'Chat with AI' : 'AI से बात करें'}</span>
          </button>

          <button
            id="quick-action-book-apt"
            onClick={() => onNavigate('appointments')}
            className="p-3 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200/80 hover:border-sky-200 text-xs font-bold text-slate-700 hover:text-sky-700 flex items-center gap-2 transition-all cursor-pointer shadow-2xs group"
          >
            <Calendar className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
            <span className="truncate">{language === 'en' ? 'Book Appointment' : 'अपॉइंटमेंट लें'}</span>
          </button>

          <button
            id="quick-action-rights"
            onClick={() => onNavigate('rights')}
            className="p-3 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200/80 hover:border-sky-200 text-xs font-bold text-slate-700 hover:text-sky-700 flex items-center gap-2 transition-all cursor-pointer shadow-2xs group"
          >
            <BookOpen className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
            <span className="truncate">{language === 'en' ? 'Know Your Rights' : 'अधिकार जानें'}</span>
          </button>

          <button
            id="quick-action-applications"
            onClick={() => onNavigate('user/applications')}
            className="p-3 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200/80 hover:border-sky-200 text-xs font-bold text-slate-700 hover:text-sky-700 flex items-center gap-2 transition-all cursor-pointer shadow-2xs group"
          >
            <FileText className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
            <span className="truncate">{language === 'en' ? 'My Applications' : 'मेरे आवेदन'}</span>
          </button>

          <button
            id="quick-action-appointments"
            onClick={() => onNavigate('user/appointments')}
            className="p-3 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200/80 hover:border-sky-200 text-xs font-bold text-slate-700 hover:text-sky-700 flex items-center gap-2 transition-all cursor-pointer shadow-2xs group col-span-2 sm:col-span-1"
          >
            <Clock className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
            <span className="truncate">{language === 'en' ? 'My Appointments' : 'नियुक्तियां'}</span>
          </button>

        </div>
      </section>

      {/* 4. Recent Activity Section (Section 8 & 24) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Scheduled Appointments & Recent Applications */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recent Scheduled Consultations */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-sky-100 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'en' ? 'Upcoming & Recent Consultations' : 'आगामी व हालिया परामर्श'}
                </h3>
              </div>
              <button
                id="btn-see-all-appointments"
                onClick={() => onNavigate('user/appointments')}
                className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
              >
                <span>{language === 'en' ? 'View All' : 'सभी देखें'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentAppointments.length === 0 ? (
              <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-500 mb-2">No consultations scheduled yet.</p>
                <button
                  onClick={() => onNavigate('appointments')}
                  className="px-3 py-1.5 bg-sky-600 text-white rounded-lg text-xs font-bold"
                >
                  Book an Advocate
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAppointments.map((apt) => (
                  <div 
                    key={apt.id}
                    className="p-4 rounded-xl bg-slate-50/80 border border-sky-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-sky-50/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm shrink-0 border border-sky-200">
                        {apt.advocateName.split(' ').slice(1, 3).map(n => n[0]).join('') || 'AD'}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{apt.advocateName}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            apt.status === 'upcoming' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            {apt.status === 'upcoming' ? (language === 'en' ? 'Confirmed' : 'पुष्ट') : apt.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{apt.advocateSpecialty}</p>
                        <p className="text-xs text-slate-700 font-semibold flex items-center gap-1.5 pt-0.5">
                          <Clock className="w-3.5 h-3.5 text-sky-600" />
                          <span>{apt.date} • {apt.time} ({apt.consultationType} Consultation)</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-2 shrink-0">
                      {apt.status === 'upcoming' && (
                        <button
                          onClick={() => {
                            if (apt.meetingLink) {
                              window.open(apt.meetingLink, '_blank');
                            } else {
                              alert(language === 'en' ? 'Consultation link will be activated 5 minutes before the session.' : 'परामर्श लिंक सत्र से ५ मिनट पहले सक्रिय होगा।');
                            }
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-2xs cursor-pointer text-center"
                        >
                          {language === 'en' ? 'Join Session' : 'सत्र में जुड़ें'}
                        </button>
                      )}
                      <button
                        onClick={() => onNavigate('user/appointments')}
                        className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer text-center"
                      >
                        {language === 'en' ? 'Details' : 'विवरण'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Applications Activity */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-sky-100 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'en' ? 'Recent Applications & Case Inquiries' : 'हालिया आवेदन व मामले'}
                </h3>
              </div>
              <button
                id="btn-see-all-applications"
                onClick={() => onNavigate('user/applications')}
                className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
              >
                <span>{language === 'en' ? 'View All' : 'सभी देखें'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {recentApplications.map((app) => (
                <div 
                  key={app.id}
                  onClick={() => onNavigate('user/applications')}
                  className="p-4 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900">{app.category}</span>
                      <span className="text-[10px] font-mono font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                        #{app.applicationId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1">{app.description}</p>
                    <p className="text-[11px] text-slate-400">
                      {language === 'en' ? `Advocate: ${app.advocateName}` : `वकील: ${app.advocateName}`}
                    </p>
                  </div>

                  <div className="flex items-center sm:flex-col items-end gap-1.5 shrink-0">
                    <span className="text-xs font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                      <span>{app.status}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {language === 'en' ? 'Click to inspect timeline' : 'समयरेखा देखने हेतु क्लिक करें'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Helplines & DPDP Act Privacy Notice */}
        <div className="space-y-6">
          
          {/* National Helplines Directory */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-sky-100 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-rose-600" />
                <span>{language === 'en' ? 'National Emergency Helplines' : 'आपातकालीन राष्ट्रीय हेल्पलाइन'}</span>
              </h3>
            </div>

            <div className="space-y-2.5">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Cyber Crime Helpline</p>
                  <p className="text-[10px] text-slate-500">Golden hour financial freeze</p>
                </div>
                <a 
                  href="tel:1930" 
                  className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-bold text-xs border border-rose-200 hover:bg-rose-100"
                >
                  1930
                </a>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">NALSA Free Legal Aid</p>
                  <p className="text-[10px] text-slate-500">Section 12 free advocate</p>
                </div>
                <a 
                  href="tel:15100" 
                  className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 font-bold text-xs border border-sky-200 hover:bg-sky-100"
                >
                  15100
                </a>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">National Consumer Helpline</p>
                  <p className="text-[10px] text-slate-500">Defective goods & refunds</p>
                </div>
                <a 
                  href="tel:1915" 
                  className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 font-bold text-xs border border-teal-200 hover:bg-teal-100"
                >
                  1915
                </a>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Women Safety Helpline</p>
                  <p className="text-[10px] text-slate-500">Domestic violence & emergency</p>
                </div>
                <a 
                  href="tel:1091" 
                  className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 font-bold text-xs border border-purple-200 hover:bg-purple-100"
                >
                  1091
                </a>
              </div>
            </div>
          </div>

          {/* Privacy & DPDP Act Compliance Card */}
          <div className="p-5 rounded-2xl bg-sky-950 text-white space-y-2.5 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-200">
                DPDP Act & Confidentiality
              </h4>
            </div>
            <p className="text-xs text-sky-100 leading-relaxed">
              {language === 'en'
                ? 'Your legal inquiries, consultations, and documents are encrypted and protected under the Digital Personal Data Protection Act.'
                : 'आपकी कानूनी पूछताछ और परामर्श विवरण डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम के तहत सुरक्षित हैं।'}
            </p>
          </div>

          {/* Legal Notice / Disclaimer */}
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-150 text-[11px] text-slate-600 leading-relaxed">
            <span className="font-bold text-sky-900 block mb-1">
              {language === 'en' ? 'General Legal Information & Guidance' : 'सामान्य कानूनी सूचना व मार्गदर्शन'}
            </span>
            {language === 'en'
              ? 'Nyaay सारथी is an educational assistance platform and not a replacement for a qualified advocate, court, or government authority.'
              : 'न्याय सारथी एक कानूनी जागरूकता मंच है और यह किसी न्यायालय या अधिवक्ता का विकल्प नहीं है।'}
          </div>

        </div>

      </section>

    </div>
  );
}
