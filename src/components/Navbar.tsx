import { useState } from 'react';
import { Globe, Menu, X, ArrowRight, UserCheck, User, Briefcase, LogOut } from 'lucide-react';
import { Language, AppRoute, AuthUser } from '../types';
import logoImg from '../assets/images/nyaay_sarathi_logo_1787153284213.jpg';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onActionClick: (action: string, title?: string) => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  onNavigate?: (route: AppRoute) => void;
}

export function Navbar({ 
  language, 
  onLanguageChange, 
  onActionClick,
  currentUser,
  onLogout,
  onNavigate,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleHomeClick = () => {
    if (onNavigate) {
      onNavigate('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const handleAuthClick = () => {
    if (currentUser && onNavigate) {
      onNavigate(currentUser.role === 'citizen' ? 'user/home' : 'advocate-dashboard');
    } else if (onNavigate) {
      onNavigate('auth/login/citizen');
    } else {
      onActionClick('login-signup', language === 'en' ? 'Citizen & Advocate Access' : 'नागरिक व अधिवक्ता लॉगिन');
    }
    setMobileMenuOpen(false);
  };

  const navLinks = [
    {
      key: 'home',
      label: language === 'en' ? 'Home' : 'होम',
      isHome: true,
      onClick: handleHomeClick,
    },
    {
      key: 'chat-ai',
      label: language === 'en' ? 'Chat to AI' : 'AI से बात करें',
      onClick: () => {
        onActionClick('chat-ai', language === 'en' ? 'AI Legal Assistant' : 'AI कानूनी सहायक');
        setMobileMenuOpen(false);
      },
    },
    {
      key: 'book-appointment',
      label: language === 'en' ? 'Book an Appointment' : 'अपॉइंटमेंट लें',
      onClick: () => {
        onActionClick('book-appointment', language === 'en' ? 'Book an Advocate Appointment' : 'वकील अपॉइंटमेंट बुक करें');
        setMobileMenuOpen(false);
      },
    },
    {
      key: 'know-rights',
      label: language === 'en' ? 'Know Your Rights' : 'अपने अधिकार जानें',
      onClick: () => {
        onActionClick('know-rights', language === 'en' ? 'Citizen Rights Handbook' : 'नागरिक अधिकार संदर्शिका');
        setMobileMenuOpen(false);
      },
    },
    {
      key: 'about-us',
      label: language === 'en' ? 'About Us' : 'हमारे बारे में',
      onClick: () => {
        if (onNavigate) {
          onNavigate('about');
        } else {
          onActionClick('about-us', language === 'en' ? 'About Nyaay सारथी' : 'न्याय सारथी के बारे में');
        }
        setMobileMenuOpen(false);
      },
    },
    {
      key: 'contact-us',
      label: language === 'en' ? 'Contact Us' : 'संपर्क करें',
      onClick: () => {
        if (onNavigate) {
          onNavigate('contact');
        } else {
          onActionClick('contact-us', language === 'en' ? 'Contact Citizen Desk' : 'नागरिक सहायता डेस्क');
        }
        setMobileMenuOpen(false);
      },
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur-xl border-b border-white/60 shadow-[0_4px_24px_rgba(31,38,135,0.06)] transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-2">
          {/* Logo & Portal Name with Frosted Glass Badge */}
          <div 
            onClick={handleHomeClick}
            id="brand-logo-button"
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/80 backdrop-blur-md border border-white/80 p-0.5 flex items-center justify-center shadow-xs group-hover:shadow-[0_0_18px_rgba(74,144,226,0.35)] group-hover:scale-105 transition-all duration-300 shrink-0 overflow-hidden">
              <img 
                src={logoImg} 
                alt="Nyaay सारथी Logo" 
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  Nyaay <span className="text-sky-600 font-['Noto_Sans_Devanagari',sans-serif] font-extrabold">सारथी</span>
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-medium text-slate-500 hidden md:inline-block whitespace-nowrap">
                {language === 'en' ? 'Citizen Legal Assistance & Rights' : 'नागरिक कानूनी सहायता व अधिकार मंच'}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links with Frosted Glass Pill Styling */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-1 bg-white/35 backdrop-blur-md p-1 rounded-2xl border border-white/50 shadow-xs">
            {navLinks.map((item) => (
              <button
                key={item.key}
                id={`nav-link-${item.key}`}
                onClick={item.onClick}
                className={`px-3 py-1.5 rounded-xl text-xs xl:text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-97 ${
                  item.isHome
                    ? 'text-sky-900 bg-sky-500/15 border border-sky-400/40 font-semibold shadow-xs'
                    : 'text-slate-700 hover:text-sky-800 hover:bg-white/50 border border-transparent'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action Area: Single Unified Language Switch + Login/Signup */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Frosted Glass Language Switch Toggle */}
            <div className="flex items-center bg-white/45 backdrop-blur-md p-1 rounded-xl border border-white/70 shadow-inner">
              <button
                id="lang-switch-en"
                onClick={() => onLanguageChange('en')}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-95 ${
                  language === 'en'
                    ? 'bg-sky-600 text-white shadow-xs font-bold border border-sky-500'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>English</span>
              </button>
              <button
                id="lang-switch-hi"
                onClick={() => onLanguageChange('hi')}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-95 ${
                  language === 'hi'
                    ? 'bg-sky-600 text-white shadow-xs font-bold border border-sky-500'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                }`}
              >
                <span>हिंदी</span>
              </button>
            </div>

            {/* Login / Signup Button OR Logged-in Profile */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  id="nav-user-profile-btn"
                  onClick={handleAuthClick}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-xs xl:text-sm font-semibold rounded-xl bg-white/60 backdrop-blur-md text-sky-900 border border-white/80 hover:bg-white/85 hover:border-sky-300/60 hover:shadow-[0_0_15px_rgba(74,144,226,0.3)] transition-all shadow-xs cursor-pointer whitespace-nowrap active:scale-97"
                >
                  <div className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                    {currentUser.role === 'advocate' ? <Briefcase className="w-3 h-3" /> : <User className="w-3 h-3" />}
                  </div>
                  <span className="max-w-[120px] truncate">{currentUser.name}</span>
                </button>

                {onLogout && (
                  <button
                    onClick={onLogout}
                    title="Logout"
                    className="p-2 rounded-xl text-rose-600 hover:bg-rose-50/70 bg-white/40 backdrop-blur-md border border-white/60 hover:border-rose-200/80 transition-all cursor-pointer active:scale-95"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <button
                id="nav-login-signup-btn"
                onClick={handleAuthClick}
                className="hidden sm:inline-flex items-center gap-1.5 sm:gap-2 px-4 py-2 text-xs xl:text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white border border-white/40 shadow-[0_4px_16px_rgba(37,99,235,0.25)] hover:shadow-[0_0_22px_rgba(74,144,226,0.45)] hover:from-sky-600 hover:to-blue-700 transition-all duration-300 active:scale-97 whitespace-nowrap cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-sky-100" />
                <span>{language === 'en' ? 'Login / Signup' : 'लॉगिन / साइनअप'}</span>
              </button>
            )}

            {/* Mobile menu toggle button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 bg-white/50 backdrop-blur-md hover:bg-white/80 border border-white/70 focus:outline-none cursor-pointer active:scale-95 transition-all"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6 text-sky-700" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/60 bg-white/85 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((item) => (
            <button
              key={`m-${item.key}`}
              id={`m-nav-link-${item.key}`}
              onClick={item.onClick}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm sm:text-base font-medium flex items-center justify-between cursor-pointer active:scale-98 transition-all ${
                item.isHome
                  ? 'bg-sky-500/15 text-sky-900 font-semibold border border-sky-300/50'
                  : 'text-slate-800 hover:bg-white/60 border border-transparent'
              }`}
            >
              <span className="whitespace-nowrap">{item.label}</span>
              <ArrowRight className="w-4 h-4 text-sky-600" />
            </button>
          ))}

          <div className="pt-3 border-t border-white/60 flex flex-col gap-2">
            {currentUser ? (
              <div className="space-y-2">
                <button
                  id="mobile-user-profile-btn"
                  onClick={handleAuthClick}
                  className="w-full py-2.5 px-4 text-center rounded-xl bg-white/70 backdrop-blur-md text-sky-900 font-semibold text-sm border border-white/80 flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
                >
                  <User className="w-4 h-4 text-sky-600" />
                  <span>{currentUser.name} ({currentUser.role === 'citizen' ? 'Citizen' : 'Advocate'})</span>
                </button>
                {onLogout && (
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 px-4 text-center rounded-xl bg-rose-50/80 backdrop-blur-md text-rose-700 font-semibold text-xs border border-rose-200/80 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{language === 'en' ? 'Sign Out' : 'लॉग आउट'}</span>
                  </button>
                )}
              </div>
            ) : (
              <button
                id="mobile-login-btn"
                onClick={handleAuthClick}
                className="w-full py-2.5 px-4 text-center rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold text-sm shadow-[0_4px_16px_rgba(37,99,235,0.25)] flex items-center justify-center gap-2 transition-all whitespace-nowrap cursor-pointer active:scale-98"
              >
                <UserCheck className="w-4 h-4 text-sky-100" />
                <span>{language === 'en' ? 'Login / Signup' : 'लॉगिन / साइनअप'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
