import React, { useState } from 'react';
import { 
  User, Bot, Calendar, BookOpen, ShieldCheck, LogOut, ArrowLeft, 
  MessageSquare, FileText, Clock, CheckCircle2, ChevronRight, Sparkles,
  Search, Bell, AlertCircle, PhoneCall, ExternalLink, Globe, Star
} from 'lucide-react';
import { Language, AppRoute, AuthUser, AdvocateFeedback } from '../../types';
import logoImg from '../../assets/images/nyaay_sarathi_logo_1787153284213.jpg';
import { AdvocateFeedbackModal } from '../citizen/AdvocateFeedbackModal';
import { getStoredFeedback } from '../../data/portalData';

interface CitizenDashboardPageProps {
  user: AuthUser;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigate: (route: AppRoute) => void;
  onLogout: () => void;
  onOpenDialog: (actionKey: string, topic?: string) => void;
}

export function CitizenDashboardPage({
  user,
  language,
  onLanguageChange,
  onNavigate,
  onLogout,
  onOpenDialog,
}: CitizenDashboardPageProps) {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState<AdvocateFeedback[]>(() => getStoredFeedback());
  return (
    <div className="min-h-screen bg-[#F4F9FD] text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-sky-200 selection:text-sky-950 flex flex-col justify-between">
      
      {/* Top Navbar */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-sky-100 sticky top-0 z-30 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-sky-700 bg-slate-50 hover:bg-sky-50 border border-sky-200/80 shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-sky-600" />
              <span className="hidden sm:inline">{language === 'en' ? 'Main Website' : 'मुख्य वेबसाइट'}</span>
            </button>

            <div 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-white border border-sky-100 p-0.5 shadow-2xs overflow-hidden">
                <img 
                  src={logoImg} 
                  alt="Nyaay सारथी Logo" 
                  className="w-full h-full object-cover rounded-md"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-base font-bold text-slate-900 tracking-tight">
                Nyaay <span className="text-sky-600 font-['Noto_Sans_Devanagari',sans-serif] font-extrabold">सारथी</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Switch */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-sky-100">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  language === 'en' ? 'bg-white text-sky-700 shadow-xs font-bold' : 'text-slate-500'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  language === 'hi' ? 'bg-white text-sky-700 shadow-xs font-bold' : 'text-slate-500'
                }`}
              >
                HI
              </button>
            </div>

            {/* User Profile info */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs border border-sky-200">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">{user.name}</p>
                <p className="text-[10px] text-sky-600 font-medium">
                  {language === 'en' ? 'Citizen Account' : 'नागरिक खाता'}
                </p>
              </div>
            </div>

            {/* Logout button */}
            <button
              id="citizen-logout-btn"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'en' ? 'Sign Out' : 'लॉग आउट'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 md:p-8 space-y-6">
        
        {/* Welcome Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>{language === 'en' ? 'Citizen Legal Aid Portal' : 'नागरिक कानूनी सहायता पोर्टल'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {language === 'en' ? `Welcome, ${user.name}` : `स्वागत है, ${user.name}`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === 'en'
                ? 'Access AI legal guidance, track your legal inquiries, book verified advocate consultations, and exercise your constitutional rights with confidence.'
                : 'AI कानूनी सहायता प्राप्त करें, अपनी शिकायतों को ट्रैक करें, सत्यापित वकीलों से परामर्श लें और अपने अधिकारों का उपयोग करें।'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              id="citizen-dash-ai-btn"
              onClick={() => onOpenDialog('chat-ai')}
              className="py-3 px-5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-600/20 flex items-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Bot className="w-4 h-4 text-sky-200" />
              <span>{language === 'en' ? 'Ask AI Legal Assistant' : 'AI कानूनी सहायक से पूछें'}</span>
            </button>
            <button
              id="citizen-dash-book-btn"
              onClick={() => onOpenDialog('book-appointment')}
              className="py-3 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-md flex items-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Calendar className="w-4 h-4 text-sky-400" />
              <span>{language === 'en' ? 'Book Advocate' : 'वकील बुक करें'}</span>
            </button>
          </div>
        </div>

        {/* 4 Feature Quick Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div 
            onClick={() => onOpenDialog('chat-ai')}
            className="bg-white p-5 rounded-2xl border border-sky-100 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              {language === 'en' ? 'AI Legal Simplifier' : 'AI कानूनी मार्गदर्शक'}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2">
              {language === 'en' ? 'Instant plain-English & Hindi explanation of sections, BNS & rights.' : 'सरल भाषा में कानूनी धाराओं और प्रक्रियाओं की जानकारी।'}
            </p>
          </div>

          <div 
            onClick={() => onOpenDialog('know-rights-hub')}
            className="bg-white p-5 rounded-2xl border border-sky-100 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              {language === 'en' ? 'Know Your Rights' : 'नागरिक अधिकार संकलन'}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2">
              {language === 'en' ? 'Guides on Zero FIR, 1930 Cyber Fraud, Tenancy & Free Legal Aid.' : 'ज़ीरो एफआईआर, साइबर हेल्पलाइन 1930 व किरायेदार अधिकार।'}
            </p>
          </div>

          <div 
            onClick={() => onOpenDialog('doc-summary')}
            className="bg-white p-5 rounded-2xl border border-sky-100 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              {language === 'en' ? 'Document Summarizer' : 'दस्तावेज़ विश्लेषण'}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2">
              {language === 'en' ? 'Upload notices, rent agreements & agreements for risk assessment.' : 'नोटिस और समझौतों के मुख्य बिंदुओं का सरल सारांश।'}
            </p>
          </div>

          <div 
            onClick={() => onOpenDialog('emergency-hub')}
            className="bg-white p-5 rounded-2xl border border-sky-100 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              {language === 'en' ? 'Helpline Directory' : 'आपातकालीन हेल्पलाइन'}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2">
              {language === 'en' ? '1930 (Cyber), 15100 (NALSA), 1915 (Consumer), 112 (Police).' : 'राष्ट्रीय विधिक सेवा व सरकारी हेल्पलाइन संपर्क सूची।'}
            </p>
          </div>

        </div>

        {/* 2 Column Details: Active Consultations & Tracked Inquiries */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1 & 2: Active Consultations & Inquiries */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Scheduled Appointments */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-sky-100 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-600" />
                  <h2 className="text-base font-bold text-slate-900">
                    {language === 'en' ? 'Your Scheduled Consultations' : 'आपकी निर्धारित परामर्श बैठकें'}
                  </h2>
                </div>
                <button
                  onClick={() => onOpenDialog('book-appointment')}
                  className="text-xs font-bold text-sky-600 hover:text-sky-800 cursor-pointer"
                >
                  + {language === 'en' ? 'Book New' : 'नया बुक करें'}
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-sky-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm shrink-0">
                      VS
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">Adv. Vikram Sharma</h4>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          {language === 'en' ? 'Confirmed' : 'पुष्ट'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">Practice: Consumer Protection & Digital Fraud</p>
                      <p className="text-xs text-slate-700 font-semibold mt-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-sky-600" />
                        <span>Friday, 4:30 PM • 30 mins Video Call</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2">
                    <button
                      onClick={() => alert(language === 'en' ? 'Video consultation link will activate 5 minutes before scheduled slot.' : 'वीडियो परामर्श लिंक समय से ५ मिनट पहले सक्रिय होगा।')}
                      className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-2xs cursor-pointer"
                    >
                      {language === 'en' ? 'Join Session' : 'सत्र में शामिल हों'}
                    </button>
                    <button
                      onClick={() => onOpenDialog('book-appointment')}
                      className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                    >
                      {language === 'en' ? 'Reschedule' : 'समय बदलें'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiries & Grievances */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-sky-100 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-600" />
                  <h2 className="text-base font-bold text-slate-900">
                    {language === 'en' ? 'Tracked Grievances & Legal Issues' : 'ट्रैक की गई शिकायतें व कानूनी मामले'}
                  </h2>
                </div>
                <button
                  onClick={() => onOpenDialog('chat-ai')}
                  className="text-xs font-bold text-sky-600 hover:text-sky-800 cursor-pointer"
                >
                  + {language === 'en' ? 'New Inquiry' : 'नई पूछताछ'}
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-slate-200 hover:border-sky-300 transition-all flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">Cyber UPI Fraud - Immediate Freeze Step</span>
                      <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-semibold">1930 Portal</span>
                    </div>
                    <p className="text-xs text-slate-500">Ack No: CFC-2026-9812 • Golden Hour Transaction Frozen</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active</span>
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 hover:border-sky-300 transition-all flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">E-Commerce Defective Product Refund</span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">NCH 1915</span>
                    </div>
                    <p className="text-xs text-slate-500">Doc Draft: Legal notice template created with AI assistant</p>
                  </div>
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>In Progress</span>
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Column 3: Legal Rights Quick Guide & Compliance */}
          <div className="space-y-6">
            
            {/* Quick Rights Access Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-sky-100 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                <span>{language === 'en' ? 'Essential Citizen Rights' : 'नागरिकों के प्रमुख अधिकार'}</span>
              </h3>

              <div className="space-y-2.5">
                <button
                  onClick={() => onOpenDialog('rights-police-fir')}
                  className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-left border border-slate-200/80 hover:border-sky-200 text-xs font-semibold text-slate-700 flex items-center justify-between transition-all cursor-pointer"
                >
                  <span>Zero FIR & Police Guidelines</span>
                  <ChevronRight className="w-3.5 h-3.5 text-sky-600" />
                </button>

                <button
                  onClick={() => onOpenDialog('rights-consumer')}
                  className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-left border border-slate-200/80 hover:border-sky-200 text-xs font-semibold text-slate-700 flex items-center justify-between transition-all cursor-pointer"
                >
                  <span>Consumer Dispute & Notice Rights</span>
                  <ChevronRight className="w-3.5 h-3.5 text-sky-600" />
                </button>

                <button
                  onClick={() => onOpenDialog('rights-legal-aid')}
                  className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-left border border-slate-200/80 hover:border-sky-200 text-xs font-semibold text-slate-700 flex items-center justify-between transition-all cursor-pointer"
                >
                  <span>Free Legal Aid (NALSA Sec 12)</span>
                  <ChevronRight className="w-3.5 h-3.5 text-sky-600" />
                </button>

                <button
                  onClick={() => onOpenDialog('rights-tenancy')}
                  className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-left border border-slate-200/80 hover:border-sky-200 text-xs font-semibold text-slate-700 flex items-center justify-between transition-all cursor-pointer"
                >
                  <span>Tenant Security Deposit Rules</span>
                  <ChevronRight className="w-3.5 h-3.5 text-sky-600" />
                </button>
              </div>
            </div>

            {/* DPDP Compliance and Data Privacy */}
            <div className="p-4 rounded-2xl bg-sky-900 text-white space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-sky-200">DPDP Act Compliant</h4>
              </div>
              <p className="text-xs text-sky-100 leading-relaxed">
                {language === 'en'
                  ? 'Your legal queries and uploaded documents are encrypted and confidential under the Digital Personal Data Protection Act.'
                  : 'आपकी कानूनी पूछताछ और दस्तावेज़ पूर्णतः एन्क्रिप्टेड और सुरक्षित हैं।'}
              </p>
            </div>

          </div>

        </div>

        {/* Lower Feedback Section */}
        <div className="mt-8 bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xs relative overflow-hidden space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200/60 shadow-2xs">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>{language === 'en' ? 'Advocate Consultation Feedback' : 'अधिवक्ता परामर्श प्रतिक्रिया'}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {language === 'en' ? 'Share Your Consultation Experience' : 'अपने परामर्श का अनुभव साझा करें'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                {language === 'en'
                  ? 'Had a consultation with an advocate? Provide rating, case details, and your honest review.'
                  : 'क्या आपने किसी अधिवक्ता से परामर्श लिया है? अपनी रेटिंग, केस जानकारी व समीक्षा साझा करें।'}
              </p>
            </div>

            <button
              id="citizen-dashboard-btn-give-feedback"
              onClick={() => setIsFeedbackModalOpen(true)}
              className="py-2.5 px-5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{language === 'en' ? 'Give Feedback' : 'प्रतिक्रिया दें'}</span>
            </button>
          </div>

          {feedbacks.length > 0 && (
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {language === 'en' ? 'Recent Citizen Feedbacks' : 'हालिया प्रतिक्रियाएं'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {feedbacks.map((fb) => (
                  <div key={fb.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900">{fb.advocateName}</p>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 font-bold text-[11px]">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {Number(fb.rating).toFixed(1)}
                      </span>
                    </div>
                    <p className="text-[11px] text-sky-700 font-semibold">{fb.caseInformation}</p>
                    <p className="text-xs text-slate-600 italic">"{fb.review}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </main>

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

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-sky-100 bg-white/50 mt-12">
        <p>© {new Date().getFullYear()} Nyaay सारथी. Citizen Legal Assistance & Advocate Network.</p>
      </footer>

    </div>
  );
}
