import React from 'react';
import { ShieldCheck, ArrowLeft, Globe, Lock } from 'lucide-react';
import { Language, AppRoute } from '../../types';
import { AnimatedGlassBackground } from '../AnimatedGlassBackground';
import logoImg from '../../assets/images/nyaay_sarathi_logo_1787153284213.jpg';

interface AuthLayoutProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigate: (route: AppRoute) => void;
  subtitle: string;
  subtitleHi?: string;
  roleTabType: 'login' | 'register';
  activeRole: 'citizen' | 'advocate';
  children: React.ReactNode;
}

export function AuthLayout({
  language,
  onLanguageChange,
  onNavigate,
  subtitle,
  subtitleHi,
  roleTabType,
  activeRole,
  children,
}: AuthLayoutProps) {
  const handleTabChange = (role: 'citizen' | 'advocate') => {
    if (roleTabType === 'login') {
      onNavigate(role === 'citizen' ? 'auth/login/citizen' : 'auth/login/advocate');
    } else {
      onNavigate(role === 'citizen' ? 'auth/register/citizen' : 'auth/register/advocate');
    }
  };

  return (
    <div className="min-h-screen text-slate-900 flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] selection:bg-sky-200 selection:text-sky-950 relative">
      <AnimatedGlassBackground />
      
      {/* Top Navigation Bar */}
      <header className="w-full bg-white/65 backdrop-blur-xl border-b border-white/70 shadow-[0_4px_24px_rgba(31,38,135,0.06)] py-3.5 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            id="auth-back-to-home-btn"
            onClick={() => onNavigate('home')}
            className="glass-btn inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-semibold text-slate-800 hover:text-sky-900 bg-white/70 hover:bg-white border border-white/80 shadow-xs transition-all active:scale-97 group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-sky-600 group-hover:-translate-x-0.5 transition-transform" />
            <span>{language === 'en' ? 'Back to Home' : 'होम पर वापस जाएं'}</span>
          </button>

          {/* Logo Brand in header */}
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

          {/* Language Switch */}
          <div className="flex items-center bg-white/60 backdrop-blur-md p-1 rounded-2xl border border-white/80 shadow-xs">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-white/95 text-sky-800 shadow-xs font-bold border border-white/90'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3 text-sky-600" />
                EN
              </span>
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

      {/* Main Form Center Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="glass-panel w-full max-w-xl bg-white/70 backdrop-blur-2xl rounded-3xl border border-white/85 shadow-[0_16px_48px_rgba(31,38,135,0.1)] p-6 sm:p-8 md:p-10 my-4 transition-all">
          
          {/* Card Header with Logo */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/90 backdrop-blur-md p-1.5 border border-white/90 shadow-[0_8px_24px_rgba(31,38,135,0.1)] flex items-center justify-center overflow-hidden">
                <img 
                  src={logoImg} 
                  alt="Nyaay सारथी Logo" 
                  className="w-full h-full object-cover rounded-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              Nyaay <span className="text-sky-600 font-['Noto_Sans_Devanagari',sans-serif] font-extrabold">सारथी</span>
            </h1>

            <p className="text-xs sm:text-sm font-medium text-slate-600 mt-1 max-w-md mx-auto">
              {language === 'hi' && subtitleHi ? subtitleHi : subtitle}
            </p>
          </div>

          {/* Role Tabs Switcher */}
          <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-white/50 backdrop-blur-md border border-white/80 mb-6 shadow-xs">
            <button
              type="button"
              id="role-tab-citizen"
              onClick={() => handleTabChange('citizen')}
              className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer active:scale-97 ${
                activeRole === 'citizen'
                  ? 'bg-white text-sky-900 shadow-xs border border-sky-300/40'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {roleTabType === 'login'
                ? language === 'en' ? 'Citizen Login' : 'नागरिक लॉगिन'
                : language === 'en' ? 'Citizen Sign Up' : 'नागरिक साइन अप'}
            </button>

            <button
              type="button"
              id="role-tab-advocate"
              onClick={() => handleTabChange('advocate')}
              className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer active:scale-97 ${
                activeRole === 'advocate'
                  ? 'bg-white text-sky-900 shadow-xs border border-sky-300/40'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {roleTabType === 'login'
                ? language === 'en' ? 'Advocate Login' : 'अधिवक्ता लॉगिन'
                : language === 'en' ? 'Advocate Sign Up' : 'अधिवक्ता साइन अप'}
            </button>
          </div>

          {/* Form Content */}
          {children}

          {/* Security Guarantee Footer Badge */}
          <div className="mt-8 pt-4 border-t border-sky-100/60 flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-500">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Secure Encryption • DPDP Act Compliant</span>
          </div>

        </div>
      </main>

      {/* Auth Page Mini-Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-white/70 bg-white/40 backdrop-blur-md">
        <p>© {new Date().getFullYear()} Nyaay सारथी. Digital Legal Awareness & Guidance Platform.</p>
      </footer>
    </div>
  );
}
