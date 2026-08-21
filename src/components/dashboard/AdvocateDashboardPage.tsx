import React, { useState } from 'react';
import { 
  Briefcase, Scale, Award, ShieldCheck, Clock, Calendar, Users, 
  BookOpen, LogOut, ArrowLeft, CheckCircle2, AlertCircle, ChevronRight, 
  ExternalLink, Search, Sparkles, MessageSquare, Video, Settings
} from 'lucide-react';
import { Language, AppRoute, AuthUser } from '../../types';
import logoImg from '../../assets/images/nyaay_sarathi_logo_1787153284213.jpg';

interface AdvocateDashboardPageProps {
  user: AuthUser;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigate: (route: AppRoute) => void;
  onLogout: () => void;
  onOpenDialog: (actionKey: string, topic?: string) => void;
}

export function AdvocateDashboardPage({
  user,
  language,
  onLanguageChange,
  onNavigate,
  onLogout,
  onOpenDialog,
}: AdvocateDashboardPageProps) {
  const [bnsQuery, setBnsQuery] = useState('');
  const [showBnsResult, setShowBnsResult] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F9FD] text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-sky-200 selection:text-sky-950 flex flex-col justify-between">
      
      {/* Top Navbar */}
      <header className="w-full bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-30 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-sky-400" />
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
              <span className="text-base font-bold text-white tracking-tight">
                Nyaay <span className="text-sky-400 font-['Noto_Sans_Devanagari',sans-serif] font-extrabold">सारथी</span>
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/80 ml-1">
                Advocate Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Switch */}
            <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  language === 'en' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  language === 'hi' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                HI
              </button>
            </div>

            {/* Advocate Profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-sky-400 flex items-center justify-center font-bold text-xs border border-slate-700">
                <Briefcase className="w-4 h-4" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-100 leading-tight">{user.name}</p>
                <p className="text-[10px] text-sky-400 font-medium">
                  {user.barEnrollment || 'DL/1842/2016'}
                </p>
              </div>
            </div>

            {/* Logout button */}
            <button
              id="advocate-logout-btn"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/80 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'en' ? 'Sign Out' : 'लॉग आउट'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Dashboard Area */}
      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 md:p-8 space-y-6">
        
        {/* Advocate Profile Summary Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{user.isVerified !== false ? (language === 'en' ? 'Bar Council Verified' : 'बार काउंसिल सत्यापित') : (language === 'en' ? 'Verification In Review' : 'सत्यापन प्रक्रियाधीन')}</span>
              </span>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                {user.stateBarCouncil || 'Bar Council of Delhi'}
              </span>
              <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
                {user.barEnrollment || 'DL/1842/2016'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {user.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              {language === 'en'
                ? 'Practice: Criminal Defense, Consumer Protection, Cyber Law & Civil Rights • Delhi High Court & Supreme Court'
                : 'अभ्यास: आपराधिक बचाव, उपभोक्ता संरक्षण, साइबर कानून एवं सिविल अधिकार'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center min-w-[110px]">
              <p className="text-xs text-slate-500 font-medium">{language === 'en' ? 'Active Inquiries' : 'सक्रिय मामले'}</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">14</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center min-w-[110px]">
              <p className="text-xs text-slate-500 font-medium">{language === 'en' ? 'Consultations' : 'परामर्श सत्र'}</p>
              <p className="text-xl font-bold text-sky-600 mt-0.5">38</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center min-w-[110px]">
              <p className="text-xs text-slate-500 font-medium">{language === 'en' ? 'Rating' : 'रेटिंग'}</p>
              <p className="text-xl font-bold text-amber-600 mt-0.5">4.9 ★</p>
            </div>
          </div>
        </div>

        {/* 3 Main Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Col 1 & 2: Consultations & Client Requests */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Upcoming Consultations */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-sky-100 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-600" />
                  <h2 className="text-base font-bold text-slate-900">
                    {language === 'en' ? 'Upcoming Consultations' : 'आगामी परामर्श सत्र'}
                  </h2>
                </div>
                <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
                  {language === 'en' ? '3 Slots Scheduled Today' : 'आज के ३ सत्र'}
                </span>
              </div>

              <div className="space-y-3">
                {/* Consultation item 1 */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">Rajesh Kumar (Citizen)</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">Confirmed</span>
                    </div>
                    <p className="text-xs text-slate-600">Topic: Cyber OTP Fraud & Banking Liability under RBI Circulars</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-sky-600" />
                      <span>Today, 4:30 PM (30 min Video Consultation)</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert(language === 'en' ? 'Starting video room for consultation session.' : 'परामर्श सत्र प्रारंभ हो रहा है।')}
                      className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Start Call' : 'कॉल शुरू करें'}</span>
                    </button>
                  </div>
                </div>

                {/* Consultation item 2 */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">Ananya Verma (Citizen)</span>
                      <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-semibold">Draft Review</span>
                    </div>
                    <p className="text-xs text-slate-600">Topic: Landlord Security Deposit Recovery & Tenancy Notice</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-sky-600" />
                      <span>Tomorrow, 11:00 AM (Phone Consultation)</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert(language === 'en' ? 'Client documents ready for pre-review.' : 'क्लाइंट दस्तावेज़ समीक्षा के लिए तैयार हैं।')}
                      className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-semibold text-xs cursor-pointer"
                    >
                      {language === 'en' ? 'View Docs' : 'दस्तावेज़ देखें'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* New Citizen Inquiries & Case Leads */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-sky-100 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-sky-600" />
                  <h2 className="text-base font-bold text-slate-900">
                    {language === 'en' ? 'New Citizen Inquiries' : 'नागरिकों की नई कानूनी पूछताछ'}
                  </h2>
                </div>
                <span className="text-xs text-slate-500">Auto-routed via Nyaay AI</span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-slate-200 hover:border-sky-300 transition-all">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">Consumer Notice for Defective Electronics (₹48,000)</span>
                    <span className="text-[10px] text-slate-400">20 mins ago</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">Citizen has completed AI draft for Section 35 Consumer Protection Act complaint. Requesting legal scrutiny.</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert(language === 'en' ? 'Inquiry accepted. Added to client roster.' : 'पूछताछ स्वीकार कर ली गई।')}
                      className="px-3 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 cursor-pointer"
                    >
                      {language === 'en' ? 'Accept Request' : 'स्वीकार करें'}
                    </button>
                    <button
                      onClick={() => alert(language === 'en' ? 'Inquiry passed back to pool.' : 'पूछताछ अग्रेषित की गई।')}
                      className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium hover:bg-slate-200 cursor-pointer"
                    >
                      {language === 'en' ? 'Decline' : 'अस्वीकार'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Col 3: Legal Reference Tools (BNS / BNSS / BSA Matrix) */}
          <div className="space-y-6">
            
            {/* Bharatiya Nyaya Sanhita Quick Lookup */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-sky-100 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-sky-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  {language === 'en' ? 'BNS / IPC Transition Matrix' : 'BNS / IPC त्वरित धारा रूपांतरण'}
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                {language === 'en'
                  ? 'Quickly translate old IPC sections into new Bharatiya Nyaya Sanhita (BNS 2023) provisions.'
                  : 'आईपीसी धाराओं को नए भारतीय न्याय संहिता (BNS 2023) में खोजें।'}
              </p>

              <div className="relative">
                <input
                  type="text"
                  value={bnsQuery}
                  onChange={(e) => {
                    setBnsQuery(e.target.value);
                    setShowBnsResult(true);
                  }}
                  placeholder="e.g. 420 (Cheating) or 302 (Murder)"
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>

              {showBnsResult && bnsQuery && (
                <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-xs space-y-1">
                  <p className="font-bold text-sky-900">IPC Sec {bnsQuery} → BNS 2023 Reference</p>
                  <p className="text-slate-700">
                    {bnsQuery.includes('420') 
                      ? 'Section 420 IPC (Cheating) is now Section 318(4) BNS 2023 (Cheating and dishonestly inducing delivery of property).'
                      : bnsQuery.includes('302')
                      ? 'Section 302 IPC (Murder) is now Section 103(1) BNS 2023.'
                      : `Mapped to new Bharatiya Nyaya Sanhita 2023 statutory schedule for reference.`}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Practice Links */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-sky-100 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                {language === 'en' ? 'Official Judicial Portals' : 'आधिकारिक न्यायिक पोर्टल्स'}
              </h3>
              
              <div className="space-y-2 text-xs">
                <a
                  href="https://ecourts.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-700 border border-slate-200/80 transition-all"
                >
                  <span>eCourts Services Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
                </a>

                <a
                  href="https://main.sci.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-700 border border-slate-200/80 transition-all"
                >
                  <span>Supreme Court of India (e-Filing)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
                </a>

                <a
                  href="https://nalsa.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-700 border border-slate-200/80 transition-all"
                >
                  <span>NALSA Legal Services Authority</span>
                  <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
                </a>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-sky-100 bg-white/50 mt-12">
        <p>© {new Date().getFullYear()} Nyaay सारथी. State Bar Council Registered Advocate Network.</p>
      </footer>

    </div>
  );
}
