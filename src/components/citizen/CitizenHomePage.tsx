import React, { useState } from 'react';
import { 
  Bot, Calendar, BookOpen, FileText, ArrowRight, Sparkles, 
  Clock, CheckCircle2, ShieldCheck, PhoneCall, ChevronRight,
  ExternalLink, UserCheck, AlertCircle, Bookmark, MessageSquare,
  Star, ThumbsUp
} from 'lucide-react';
import { Language, AppRoute, AuthUser, Application, Appointment, AdvocateFeedback } from '../../types';
import { getStoredApplications, getStoredAppointments, getStoredFeedback } from '../../data/portalData';
import { AdvocateFeedbackModal } from './AdvocateFeedbackModal';

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

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState<AdvocateFeedback[]>(() => getStoredFeedback());

  const recentAppointments = appointments.slice(0, 2);
  const recentApplications = applications.slice(0, 2);

  return (
    <div className="space-y-8 pb-12">
      
      {/* 1. Header Greeting Section - Glass Hero Panel */}
      <section className="glass-panel bg-white/65 backdrop-blur-xl rounded-3xl p-6 sm:p-8 md:p-10 border border-white/85 shadow-[0_12px_40px_rgba(31,38,135,0.08)] relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-sky-200/40 rounded-full blur-3xl opacity-70 pointer-events-none" />
        
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/70 backdrop-blur-md text-sky-900 text-xs font-bold border border-white/80 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>{language === 'en' ? 'Citizen Legal Empowerment Portal' : 'नागरिक कानूनी सशक्तिकरण मंच'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {getGreeting()}, {user.name} 👋
          </h1>

          <p className="text-base sm:text-lg text-sky-950 font-semibold">
            {language === 'en' 
              ? 'How can Nyaay सारथी help you today?' 
              : 'न्याय सारथी आज आपकी किस प्रकार सहायता कर सकता है?'}
          </p>

          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed pt-1">
            {language === 'en'
              ? 'Understand your constitutional rights, analyze legal notices, prepare complaints with AI assistance, and book consultations with verified Bar Council advocates.'
              : 'संवैधानिक अधिकारों को समझें, कानूनी नोटिसों का सरल विश्लेषण करें, AI से आवेदन तैयार करें और बार काउंसिल वकीलों से परामर्श लें।'}
          </p>
        </div>
      </section>

      {/* 2. Main Citizen Actions */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            {language === 'en' ? 'Primary Legal Services' : 'प्रमुख कानूनी सेवाएं'}
          </h2>
          <span className="text-xs text-slate-600 font-semibold hidden sm:inline">
            {language === 'en' ? 'Transparent • Jargon-Free • Citizen-First' : 'पारदर्शी • सरल भाषा • नागरिक सर्वोपरि'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          
          {/* Card 1: AI Legal Assistance */}
          <div className="glass-card bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-white/80 shadow-[0_8px_32px_rgba(31,38,135,0.07)] hover:bg-white/80 hover:border-sky-300/70 hover:shadow-[0_14px_40px_rgba(31,38,135,0.12),0_0_20px_rgba(74,144,226,0.25)] transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/15 backdrop-blur-md text-sky-700 flex items-center justify-center border border-sky-300/40 group-hover:scale-105 transition-transform shadow-xs">
                  <Bot className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold px-3 py-1 bg-white/70 backdrop-blur-md text-sky-900 border border-white/80 rounded-full shadow-2xs">
                  {language === 'en' ? 'Instant 24/7' : '24/7 तुरंत'}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1.5 group-hover:text-sky-800 transition-colors">
                  {language === 'en' ? 'Chat with Nyaay सारथी' : 'न्याय सारथी AI से बात करें'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
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
                className="glass-btn-primary w-full py-3 px-4 rounded-2xl text-white text-xs sm:text-sm font-bold shadow-[0_4px_16px_rgba(37,99,235,0.25)] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>{language === 'en' ? 'Start Chat' : 'बातचीत शुरू करें'}</span>
                <ArrowRight className="w-4 h-4 text-sky-100" />
              </button>
            </div>
          </div>

          {/* Card 2: Book an Appointment */}
          <div className="glass-card bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-white/80 shadow-[0_8px_32px_rgba(31,38,135,0.07)] hover:bg-white/80 hover:border-sky-300/70 hover:shadow-[0_14px_40px_rgba(31,38,135,0.12),0_0_20px_rgba(74,144,226,0.25)] transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 backdrop-blur-md text-indigo-700 flex items-center justify-center border border-indigo-300/40 group-hover:scale-105 transition-transform shadow-xs">
                  <Calendar className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold px-3 py-1 bg-white/70 backdrop-blur-md text-emerald-800 border border-white/80 rounded-full shadow-2xs">
                  {language === 'en' ? 'Verified Advocates' : 'सत्यापित वकील'}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1.5 group-hover:text-sky-800 transition-colors">
                  {language === 'en' ? 'Find an Advocate' : 'वकील खोजें और अपॉइंटमेंट लें'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
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
                className="glass-btn-sky w-full py-3 px-4 rounded-2xl bg-white/70 hover:bg-white/90 text-sky-900 border border-white/80 text-xs sm:text-sm font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>{language === 'en' ? 'Book Appointment' : 'अपॉइंटमेंट बुक करें'}</span>
                <ArrowRight className="w-4 h-4 text-sky-600" />
              </button>
            </div>
          </div>

          {/* Card 3: Know Your Rights */}
          <div className="glass-card bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-white/80 shadow-[0_8px_32px_rgba(31,38,135,0.07)] hover:bg-white/80 hover:border-sky-300/70 hover:shadow-[0_14px_40px_rgba(31,38,135,0.12),0_0_20px_rgba(74,144,226,0.25)] transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/15 backdrop-blur-md text-teal-700 flex items-center justify-center border border-teal-300/40 group-hover:scale-105 transition-transform shadow-xs">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold px-3 py-1 bg-white/70 backdrop-blur-md text-teal-900 border border-white/80 rounded-full shadow-2xs">
                  {language === 'en' ? '12 Categories' : '12 श्रेणियां'}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1.5 group-hover:text-sky-800 transition-colors">
                  {language === 'en' ? 'Know Your Rights' : 'अपने नागरिक अधिकार जानें'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
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
                className="glass-btn-sky w-full py-3 px-4 rounded-2xl bg-white/70 hover:bg-white/90 text-teal-900 border border-white/80 text-xs sm:text-sm font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>{language === 'en' ? 'Explore Rights' : 'अधिकार देखें'}</span>
                <ArrowRight className="w-4 h-4 text-teal-600" />
              </button>
            </div>
          </div>

          {/* Card 4: My Applications */}
          <div className="glass-card bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-white/80 shadow-[0_8px_32px_rgba(31,38,135,0.07)] hover:bg-white/80 hover:border-sky-300/70 hover:shadow-[0_14px_40px_rgba(31,38,135,0.12),0_0_20px_rgba(74,144,226,0.25)] transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 backdrop-blur-md text-amber-700 flex items-center justify-center border border-amber-300/40 group-hover:scale-105 transition-transform shadow-xs">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold px-3 py-1 bg-white/70 backdrop-blur-md text-amber-900 border border-white/80 rounded-full shadow-2xs">
                  {applications.length} {language === 'en' ? 'Active' : 'सक्रिय'}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1.5 group-hover:text-sky-800 transition-colors">
                  {language === 'en' ? 'My Applications' : 'मेरे आवेदन व शिकायतें'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
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
                className="glass-btn w-full py-3 px-4 rounded-2xl bg-white/70 hover:bg-white/90 border border-white/80 text-slate-800 text-xs sm:text-sm font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>{language === 'en' ? 'View Applications' : 'आवेदन देखें'}</span>
                <ArrowRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Quick Action Section */}
      <section className="glass-panel bg-white/60 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-white/80 shadow-[0_8px_32px_rgba(31,38,135,0.06)] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            {language === 'en' ? 'Quick Actions' : 'त्वरित कार्य'}
          </h3>
          <span className="text-xs text-slate-500 font-medium">Direct Access</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3">
          
          <button
            id="quick-action-chat-ai"
            onClick={() => onNavigate('chat')}
            className="p-3 rounded-2xl bg-white/55 backdrop-blur-md hover:bg-white/85 border border-white/75 hover:border-sky-300/70 text-xs font-bold text-slate-800 hover:text-sky-800 flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-97 group"
          >
            <Bot className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
            <span className="truncate">{language === 'en' ? 'Chat with AI' : 'AI से बात करें'}</span>
          </button>

          <button
            id="quick-action-book-apt"
            onClick={() => onNavigate('appointments')}
            className="p-3 rounded-2xl bg-white/55 backdrop-blur-md hover:bg-white/85 border border-white/75 hover:border-sky-300/70 text-xs font-bold text-slate-800 hover:text-sky-800 flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-97 group"
          >
            <Calendar className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
            <span className="truncate">{language === 'en' ? 'Book Appointment' : 'अपॉइंटमेंट लें'}</span>
          </button>

          <button
            id="quick-action-rights"
            onClick={() => onNavigate('rights')}
            className="p-3 rounded-2xl bg-white/55 backdrop-blur-md hover:bg-white/85 border border-white/75 hover:border-sky-300/70 text-xs font-bold text-slate-800 hover:text-sky-800 flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-97 group"
          >
            <BookOpen className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
            <span className="truncate">{language === 'en' ? 'Know Your Rights' : 'अधिकार जानें'}</span>
          </button>

          <button
            id="quick-action-applications"
            onClick={() => onNavigate('user/applications')}
            className="p-3 rounded-2xl bg-white/55 backdrop-blur-md hover:bg-white/85 border border-white/75 hover:border-sky-300/70 text-xs font-bold text-slate-800 hover:text-sky-800 flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-97 group"
          >
            <FileText className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
            <span className="truncate">{language === 'en' ? 'My Applications' : 'मेरे आवेदन'}</span>
          </button>

          <button
            id="quick-action-appointments"
            onClick={() => onNavigate('user/appointments')}
            className="p-3 rounded-2xl bg-white/55 backdrop-blur-md hover:bg-white/85 border border-white/75 hover:border-sky-300/70 text-xs font-bold text-slate-800 hover:text-sky-800 flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-97 group col-span-2 sm:col-span-1"
          >
            <Clock className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
            <span className="truncate">{language === 'en' ? 'My Appointments' : 'नियुक्तियां'}</span>
          </button>

        </div>
      </section>

      {/* 4. Recent Activity Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Scheduled Appointments & Recent Applications */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recent Scheduled Consultations */}
          <div className="glass-panel bg-white/60 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-white/80 shadow-[0_8px_32px_rgba(31,38,135,0.06)] space-y-4">
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
                className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer"
              >
                <span>{language === 'en' ? 'View All' : 'सभी देखें'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentAppointments.length === 0 ? (
              <div className="text-center py-6 bg-white/40 backdrop-blur-md rounded-2xl border border-dashed border-sky-200">
                <p className="text-xs text-slate-500 mb-2">No consultations scheduled yet.</p>
                <button
                  onClick={() => onNavigate('appointments')}
                  className="glass-btn-primary px-3.5 py-1.5 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Book an Advocate
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAppointments.map((apt) => (
                  <div 
                    key={apt.id}
                    className="p-4 rounded-2xl bg-white/55 backdrop-blur-md border border-white/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/80 hover:border-sky-300/60 transition-all shadow-xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-500/15 backdrop-blur-md text-sky-800 flex items-center justify-center font-bold text-sm shrink-0 border border-sky-300/40">
                        {apt.advocateName.split(' ').slice(1, 3).map(n => n[0]).join('') || 'AD'}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{apt.advocateName}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            apt.status === 'upcoming' 
                              ? 'bg-emerald-500/15 text-emerald-800 border border-emerald-300/40' 
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            {apt.status === 'upcoming' ? (language === 'en' ? 'Confirmed' : 'पुष्ट') : apt.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">{apt.advocateSpecialty}</p>
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
                          className="glass-btn-primary px-3.5 py-1.5 rounded-xl text-white text-xs font-bold shadow-xs cursor-pointer text-center"
                        >
                          {language === 'en' ? 'Join Session' : 'सत्र में जुड़ें'}
                        </button>
                      )}
                      <button
                        onClick={() => onNavigate('user/appointments')}
                        className="glass-btn px-3.5 py-1.5 rounded-xl bg-white/70 hover:bg-white border border-white/80 text-slate-800 text-xs font-semibold cursor-pointer text-center"
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
          <div className="glass-panel bg-white/60 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-white/80 shadow-[0_8px_32px_rgba(31,38,135,0.06)] space-y-4">
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
                className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer"
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
                  className="p-4 rounded-2xl bg-white/55 backdrop-blur-md border border-white/80 hover:border-sky-300/70 hover:bg-white/85 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900">{app.category}</span>
                      <span className="text-[10px] font-mono font-bold bg-sky-500/15 text-sky-900 border border-sky-300/40 px-2 py-0.5 rounded-lg">
                        #{app.applicationId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium line-clamp-1">{app.description}</p>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {language === 'en' ? `Advocate: ${app.advocateName}` : `वकील: ${app.advocateName}`}
                    </p>
                  </div>

                  <div className="flex items-center sm:flex-col items-end gap-1.5 shrink-0">
                    <span className="text-xs font-bold text-sky-900 bg-sky-500/15 border border-sky-300/40 px-2.5 py-1 rounded-full flex items-center gap-1">
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
          <div className="glass-panel bg-white/60 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-white/80 shadow-[0_8px_32px_rgba(31,38,135,0.06)] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-rose-600" />
                <span>{language === 'en' ? 'National Emergency Helplines' : 'आपातकालीन राष्ट्रीय हेल्पलाइन'}</span>
              </h3>
            </div>

            <div className="space-y-2.5">
              <div className="p-2.5 rounded-2xl bg-white/55 backdrop-blur-md border border-white/80 flex items-center justify-between shadow-2xs">
                <div>
                  <p className="text-xs font-bold text-slate-900">Cyber Crime Helpline</p>
                  <p className="text-[10px] text-slate-500">Golden hour financial freeze</p>
                </div>
                <a 
                  href="tel:1930" 
                  className="px-2.5 py-1 rounded-xl bg-rose-500/15 text-rose-700 font-bold text-xs border border-rose-300/40 hover:bg-rose-500/25 transition-colors"
                >
                  1930
                </a>
              </div>

              <div className="p-2.5 rounded-2xl bg-white/55 backdrop-blur-md border border-white/80 flex items-center justify-between shadow-2xs">
                <div>
                  <p className="text-xs font-bold text-slate-900">NALSA Free Legal Aid</p>
                  <p className="text-[10px] text-slate-500">Section 12 free advocate</p>
                </div>
                <a 
                  href="tel:15100" 
                  className="px-2.5 py-1 rounded-xl bg-sky-500/15 text-sky-800 font-bold text-xs border border-sky-300/40 hover:bg-sky-500/25 transition-colors"
                >
                  15100
                </a>
              </div>

              <div className="p-2.5 rounded-2xl bg-white/55 backdrop-blur-md border border-white/80 flex items-center justify-between shadow-2xs">
                <div>
                  <p className="text-xs font-bold text-slate-900">National Consumer Helpline</p>
                  <p className="text-[10px] text-slate-500">Defective goods & refunds</p>
                </div>
                <a 
                  href="tel:1915" 
                  className="px-2.5 py-1 rounded-xl bg-teal-500/15 text-teal-800 font-bold text-xs border border-teal-300/40 hover:bg-teal-500/25 transition-colors"
                >
                  1915
                </a>
              </div>

              <div className="p-2.5 rounded-2xl bg-white/55 backdrop-blur-md border border-white/80 flex items-center justify-between shadow-2xs">
                <div>
                  <p className="text-xs font-bold text-slate-900">Women Safety Helpline</p>
                  <p className="text-[10px] text-slate-500">Domestic violence & emergency</p>
                </div>
                <a 
                  href="tel:1091" 
                  className="px-2.5 py-1 rounded-xl bg-purple-500/15 text-purple-800 font-bold text-xs border border-purple-300/40 hover:bg-purple-500/25 transition-colors"
                >
                  1091
                </a>
              </div>
            </div>
          </div>

          {/* Privacy & DPDP Act Compliance Card */}
          <div className="p-5 rounded-3xl bg-slate-900/85 backdrop-blur-xl text-white space-y-2.5 shadow-[0_8px_32px_rgba(15,23,42,0.15)] border border-white/20">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-200">
                DPDP Act & Confidentiality
              </h4>
            </div>
            <p className="text-xs text-sky-100 leading-relaxed font-medium">
              {language === 'en'
                ? 'Your legal inquiries, consultations, and documents are encrypted and protected under the Digital Personal Data Protection Act.'
                : 'आपकी कानूनी पूछताछ और परामर्श विवरण डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम के तहत सुरक्षित हैं।'}
            </p>
          </div>

          {/* Legal Notice / Disclaimer */}
          <div className="glass-panel p-4 rounded-3xl bg-white/55 backdrop-blur-md border border-white/80 text-[11px] text-slate-700 leading-relaxed shadow-2xs">
            <span className="font-bold text-sky-900 block mb-1">
              {language === 'en' ? 'General Legal Information & Guidance' : 'सामान्य कानूनी सूचना व मार्गदर्शन'}
            </span>
            {language === 'en'
              ? 'Nyaay सारथी is an educational assistance platform and not a replacement for a qualified advocate, court, or government authority.'
              : 'न्याय सारथी एक कानूनी जागरूकता मंच है और यह किसी न्यायालय या अधिवक्ता का विकल्प नहीं है।'}
          </div>

        </div>

      </section>

      {/* 5. Advocate Consultation Feedback Section (Lower Section of Citizen Dashboard) */}
      <section className="glass-panel bg-white/60 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/80 shadow-[0_8px_32px_rgba(31,38,135,0.06)] relative overflow-hidden space-y-5">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200/60 shadow-2xs">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>{language === 'en' ? 'Advocate Consultation Feedback' : 'अधिवक्ता परामर्श प्रतिक्रिया'}</span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {language === 'en' ? 'Share Your Consultation Experience' : 'अपने परामर्श का अनुभव व प्रतिक्रिया साझा करें'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              {language === 'en'
                ? 'Had a legal consultation with an advocate? Provide your rating, case details, and review to help build a transparent and trusted legal assistance ecosystem.'
                : 'क्या आपने किसी अधिवक्ता से परामर्श प्राप्त किया है? साथी नागरिकों के मार्गदर्शन हेतु अपनी रेटिंग, केस विवरण और समीक्षा साझा करें।'}
            </p>
          </div>

          <button
            id="btn-give-feedback"
            onClick={() => setIsFeedbackModalOpen(true)}
            className="glass-btn-primary py-3 px-6 rounded-2xl text-white text-xs sm:text-sm font-bold shadow-[0_4px_16px_rgba(37,99,235,0.25)] flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 active:scale-95 group"
          >
            <MessageSquare className="w-4 h-4 text-sky-100 group-hover:scale-110 transition-transform" />
            <span>{language === 'en' ? 'Give Feedback' : 'प्रतिक्रिया दें'}</span>
          </button>
        </div>

        {/* Display Previous Feedbacks if any exist */}
        {feedbacks.length > 0 && (
          <div className="pt-3 border-t border-sky-100 space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                {language === 'en' ? 'Recent Citizen Reviews & Ratings' : 'हालिया समीक्षाएं व रेटिंग'}
              </h4>
              <span className="text-[11px] text-slate-500 font-medium">
                {feedbacks.length} {language === 'en' ? 'Feedback Submitted' : 'प्रतिक्रियाएं'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {feedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-white/90 shadow-2xs hover:shadow-xs transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h5 className="text-xs sm:text-sm font-bold text-slate-900">{fb.advocateName}</h5>
                      <p className="text-[11px] text-sky-700 font-medium line-clamp-1">{fb.caseInformation}</p>
                    </div>

                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/15 text-amber-900 font-bold text-xs border border-amber-300/40 shrink-0">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                      <span>{Number(fb.rating).toFixed(1)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 italic font-medium leading-relaxed">
                    "{fb.review}"
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium pt-1 border-t border-slate-100">
                    <span>By {fb.userName}</span>
                    <span>{fb.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Advocate Feedback Modal */}
      <AdvocateFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        language={language}
        currentUser={user}
        onFeedbackSubmitted={(newFb) => {
          setFeedbacks((prev) => [newFb, ...prev.filter(f => f.id !== newFb.id)]);
        }}
      />

    </div>
  );
}
