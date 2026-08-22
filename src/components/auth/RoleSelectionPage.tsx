import React from 'react';
import { User, Briefcase, ArrowRight, ShieldCheck, Sparkles, Scale, BookOpen, Calendar, ArrowLeft, Globe } from 'lucide-react';
import { Language, AppRoute } from '../../types';
import { AnimatedGlassBackground } from '../AnimatedGlassBackground';
import logoImg from '../../assets/images/nyaay_sarathi_logo_1787153284213.jpg';

interface RoleSelectionPageProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigate: (route: AppRoute) => void;
}

export function RoleSelectionPage({
  language,
  onLanguageChange,
  onNavigate,
}: RoleSelectionPageProps) {
  return (
    <div className="min-h-screen text-slate-900 flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] selection:bg-sky-200 selection:text-sky-950 relative">
      <AnimatedGlassBackground />
      
      {/* Top Header */}
      <header className="w-full bg-white/65 backdrop-blur-xl border-b border-white/70 shadow-[0_4px_24px_rgba(31,38,135,0.06)] py-3.5 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            id="role-selection-back-btn"
            onClick={() => onNavigate('home')}
            className="glass-btn inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-semibold text-slate-800 hover:text-sky-900 bg-white/70 hover:bg-white border border-white/80 shadow-xs transition-all active:scale-97 group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-sky-600 group-hover:-translate-x-0.5 transition-transform" />
            <span>{language === 'en' ? 'Back to Home' : 'होम पर वापस जाएं'}</span>
          </button>

          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div className="w-8 h-8 rounded-xl bg-white/90 border border-white/80 p-0.5 shadow-xs overflow-hidden">
              <img 
                src={logoImg} 
                alt="Nyaay सारथी Logo" 
                className="w-full h-full object-cover rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-base font-bold text-slate-900 tracking-tight">
              Nyaay <span className="text-sky-600 font-['Noto_Sans_Devanagari',sans-serif] font-extrabold">सारथी</span>
            </span>
          </div>

          <div className="flex items-center bg-white/60 backdrop-blur-md p-1 rounded-2xl border border-white/80 shadow-xs">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-white/95 text-sky-800 shadow-xs font-bold border border-white/90'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('hi')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                language === 'hi'
                  ? 'bg-white/95 text-sky-800 shadow-xs font-bold border border-white/90'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              HI
            </button>
          </div>
        </div>
      </header>

      {/* Main Selection Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="glass-panel w-full max-w-4xl bg-white/70 backdrop-blur-2xl rounded-3xl border border-white/85 shadow-[0_16px_48px_rgba(31,38,135,0.1)] p-6 sm:p-10 my-4">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/70 backdrop-blur-md border border-white/80 text-sky-900 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>{language === 'en' ? 'Get Started' : 'प्रारंभ करें'}</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              {language === 'en' ? 'How would you like to use Nyaay सारथी?' : 'आप न्याय सारथी का उपयोग किस रूप में करना चाहते हैं?'}
            </h1>
            
            <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
              {language === 'en'
                ? 'Choose your portal access to proceed with legal guidance or advocate consultation services.'
                : 'कानूनी मार्गदर्शन अथवा अधिवक्ता परामर्श सेवाओं के लिए अपना पोर्टल विकल्प चुनें।'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1: Citizen / User */}
            <div 
              id="select-role-citizen-card"
              className="glass-card bg-white/60 backdrop-blur-xl hover:bg-white/80 rounded-3xl p-6 sm:p-8 border border-white/80 hover:border-sky-300/70 transition-all duration-300 flex flex-col justify-between group shadow-[0_8px_32px_rgba(31,38,135,0.06)] hover:shadow-[0_14px_40px_rgba(31,38,135,0.12),0_0_20px_rgba(74,144,226,0.2)]"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-sky-500/15 backdrop-blur-md border border-sky-300/40 text-sky-700 flex items-center justify-center mb-5 shadow-xs group-hover:scale-105 transition-transform">
                  <User className="w-7 h-7" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {language === 'en' ? 'Citizen / User' : 'नागरिक / उपभोक्ता'}
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-medium">
                  {language === 'en'
                    ? 'Legal awareness, AI guidance, appointments and grievance assistance.'
                    : 'नागरिक अधिकार, AI कानूनी सलाह, शिकायत निवारण व वकील अपॉइंटमेंट।'}
                </p>

                <div className="space-y-2 mb-8 text-xs text-slate-700 font-medium">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>{language === 'en' ? '24/7 AI Legal Guidance in plain language' : '24/7 सरल भाषा में AI कानूनी सहायता'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>{language === 'en' ? 'Book verified advocate consultations' : 'सत्यापित अधिवक्ताओं से अपॉइंटमेंट'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>{language === 'en' ? 'Know Your Rights & Section references' : 'अधिकारों व कानूनी धाराओं की स्पष्ट जानकारी'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-sky-100/60">
                <button
                  id="role-citizen-login-btn"
                  onClick={() => onNavigate('auth/login/citizen')}
                  className="glass-btn-primary w-full py-3 px-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(37,99,235,0.25)] transition-all active:scale-95 cursor-pointer"
                >
                  <span>{language === 'en' ? 'Continue as Citizen' : 'नागरिक के रूप में जारी रखें'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  id="role-citizen-register-btn"
                  onClick={() => onNavigate('auth/register/citizen')}
                  className="glass-btn w-full py-2.5 px-4 rounded-2xl bg-white/70 hover:bg-white text-slate-800 border border-white/80 font-bold text-xs transition-colors cursor-pointer active:scale-97"
                >
                  {language === 'en' ? 'New Citizen? Create Account' : 'नया खाता बनाएं'}
                </button>
              </div>
            </div>

            {/* Card 2: Advocate */}
            <div 
              id="select-role-advocate-card"
              className="glass-card bg-white/60 backdrop-blur-xl hover:bg-white/80 rounded-3xl p-6 sm:p-8 border border-white/80 hover:border-sky-300/70 transition-all duration-300 flex flex-col justify-between group shadow-[0_8px_32px_rgba(31,38,135,0.06)] hover:shadow-[0_14px_40px_rgba(31,38,135,0.12),0_0_20px_rgba(74,144,226,0.2)]"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-slate-900/90 text-white flex items-center justify-center mb-5 shadow-xs border border-white/20 group-hover:scale-105 transition-transform">
                  <Briefcase className="w-7 h-7 text-sky-400" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {language === 'en' ? 'Advocate' : 'अधिवक्ता / वकील'}
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-900 bg-sky-500/15 px-2.5 py-0.5 rounded-full border border-sky-300/40">
                    Bar Verified
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-medium">
                  {language === 'en'
                    ? 'Professional legal profile, consultations, clients and legal references.'
                    : 'पेशेवर प्रोफाइल, क्लाइंट कंसल्टेशन, कानूनी संदर्भ व केस प्रबंधन।'}
                </p>

                <div className="space-y-2 mb-8 text-xs text-slate-700 font-medium">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-slate-900 shrink-0" />
                    <span>{language === 'en' ? 'Manage consultation appointments & clients' : 'परामर्श सत्र व क्लाइंट्स का प्रबंधन'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-slate-900 shrink-0" />
                    <span>{language === 'en' ? 'State Bar Council verified advocate badge' : 'सत्यापित बार काउंसिल अधिवक्ता बैज'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-slate-900 shrink-0" />
                    <span>{language === 'en' ? 'BNS, BNSS, BSA statutory reference lookup' : 'नए BNS व कानूनी प्रावधानों का त्वरित संदर्भ'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-sky-100/60">
                <button
                  id="role-advocate-login-btn"
                  onClick={() => onNavigate('auth/login/advocate')}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(15,23,42,0.25)] border border-white/20 transition-all active:scale-95 cursor-pointer"
                >
                  <span>{language === 'en' ? 'Continue as Advocate' : 'अधिवक्ता के रूप में जारी रखें'}</span>
                  <ArrowRight className="w-4 h-4 text-sky-400" />
                </button>
                <button
                  id="role-advocate-register-btn"
                  onClick={() => onNavigate('auth/register/advocate')}
                  className="glass-btn w-full py-2.5 px-4 rounded-2xl bg-white/70 hover:bg-white text-slate-800 border border-white/80 font-bold text-xs transition-colors cursor-pointer active:scale-97"
                >
                  {language === 'en' ? 'Apply for Advocate Account' : 'अधिवक्ता पंजीकरण के लिए आवेदन करें'}
                </button>
              </div>
            </div>

          </div>

        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-500 border-t border-white/70 bg-white/40 backdrop-blur-md">
        <p>© {new Date().getFullYear()} Nyaay सारथी. Citizen Legal Assistance & Advocate Network.</p>
      </footer>
    </div>
  );
}
