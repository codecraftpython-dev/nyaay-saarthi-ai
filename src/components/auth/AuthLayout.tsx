import React from 'react';
import { ShieldCheck, ArrowLeft, Globe, Lock } from 'lucide-react';
import { Language, AppRoute } from '../../types';
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
    <div className="min-h-screen bg-[#F4F9FD] text-slate-900 flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] selection:bg-sky-200 selection:text-sky-950">
      {/* Top Navigation Bar */}
      <header className="w-full bg-white/90 backdrop-blur-md border-b border-sky-100 py-3.5 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            id="auth-back-to-home-btn"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-sky-700 bg-slate-50 hover:bg-sky-50 border border-sky-200/80 shadow-2xs transition-all active:scale-95 group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-sky-600 group-hover:-translate-x-0.5 transition-transform" />
            <span>{language === 'en' ? 'Back to Home' : 'होम पर वापस जाएं'}</span>
          </button>

          {/* Logo Brand in header */}
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

          {/* Language Switch */}
          <div className="flex items-center bg-slate-100/90 p-0.5 sm:p-1 rounded-lg border border-sky-100">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-white text-sky-700 shadow-xs font-bold border border-sky-200/70'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3 text-sky-500" />
                EN
              </span>
            </button>
            <button
              onClick={() => onLanguageChange('hi')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                language === 'hi'
                  ? 'bg-white text-sky-700 shadow-xs font-bold border border-sky-200/70'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              HI
            </button>
          </div>
        </div>
      </header>

      {/* Main Form Center Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl border border-sky-100/90 shadow-xl p-6 sm:p-8 md:p-10 my-4 transition-all">
          
          {/* Card Header with Logo */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1.5 border border-sky-200 shadow-md flex items-center justify-center overflow-hidden">
                <img 
                  src={logoImg} 
                  alt="Nyaay सारथी Logo" 
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              Nyaay <span className="text-sky-600 font-['Noto_Sans_Devanagari',sans-serif] font-extrabold">सारथी</span>
            </h1>

            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1 max-w-md mx-auto">
              {language === 'hi' && subtitleHi ? subtitleHi : subtitle}
            </p>
          </div>

          {/* Role Tabs Switcher */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 border border-slate-200/80 mb-5">
            <button
              type="button"
              id="role-tab-citizen"
              onClick={() => handleTabChange('citizen')}
              className={`py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeRole === 'citizen'
                  ? 'bg-white text-sky-700 shadow-xs border border-sky-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
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
              className={`py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeRole === 'advocate'
                  ? 'bg-white text-sky-700 shadow-xs border border-sky-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
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
          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-400">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Secure Encryption • DPDP Act Compliant</span>
          </div>

        </div>
      </main>

      {/* Auth Page Mini-Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-sky-100 bg-white/50">
        <p>© {new Date().getFullYear()} Nyaay सारथी. Digital Legal Awareness & Guidance Platform.</p>
      </footer>
    </div>
  );
}
