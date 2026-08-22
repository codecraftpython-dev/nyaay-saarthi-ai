import React, { useState, useRef, useEffect } from 'react';
import { 
  Globe, Menu, X, ArrowRight, User, LogOut, 
  Calendar, BookOpen, Bot, FileText, Settings, Bookmark, ChevronDown, UserCheck
} from 'lucide-react';
import { Language, AppRoute, AuthUser } from '../../types';
import logoImg from '../../assets/images/nyaay_sarathi_logo_1787153284213.jpg';
import { DEFAULT_CITIZEN_AVATAR } from '../../data/portalData';

interface CitizenNavbarProps {
  currentRoute: AppRoute;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currentUser?: AuthUser | null;
  user?: AuthUser;
  onNavigate: (route: AppRoute, params?: any) => void;
  onLogout: () => void;
  notificationCount?: number;
}

export function CitizenNavbar({
  currentRoute,
  language,
  onLanguageChange,
  currentUser,
  user: propUser,
  onNavigate,
  onLogout,
  notificationCount = 0,
}: CitizenNavbarProps) {
  const activeUser = currentUser || propUser;
  const isLoggedIn = !!currentUser;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    {
      key: 'user/home',
      label: language === 'en' ? 'Home' : 'होम',
      route: (isLoggedIn ? 'user/home' : 'home') as AppRoute,
      icon: null,
    },
    {
      key: 'appointments',
      label: language === 'en' ? 'Book an Appointment' : 'अपॉइंटमेंट लें',
      route: 'appointments' as AppRoute,
      icon: Calendar,
    },
    {
      key: 'rights',
      label: language === 'en' ? 'Know Your Rights' : 'अपने अधिकार जानें',
      route: 'rights' as AppRoute,
      icon: BookOpen,
    },
    {
      key: 'chat',
      label: language === 'en' ? 'Chat to AI' : 'AI से बात करें',
      route: 'chat' as AppRoute,
      icon: Bot,
    },
    {
      key: 'user/applications',
      label: language === 'en' ? 'My Applications' : 'मेरे आवेदन',
      route: (isLoggedIn ? 'user/applications' : 'auth/login/citizen') as AppRoute,
      icon: FileText,
    },
  ];

  const handleNav = (route: AppRoute) => {
    onNavigate(route);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const displayName = activeUser?.name || (language === 'en' ? 'Citizen' : 'नागरिक');
  const displayEmail = activeUser?.email || '';
  const profileImgSrc = activeUser?.profilePicture || DEFAULT_CITIZEN_AVATAR;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur-xl border-b border-white/60 shadow-[0_4px_24px_rgba(31,38,135,0.06)] transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-2">
          
          {/* Logo & Portal Name with Frosted Glass Badge */}
          <div 
            onClick={() => handleNav(isLoggedIn ? 'user/home' : 'home')}
            id="citizen-brand-logo-btn"
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
                <span className="hidden sm:inline-block px-2 py-0.5 bg-sky-500/15 text-sky-900 border border-sky-300/40 backdrop-blur-sm text-[10px] font-extrabold rounded-full tracking-wide uppercase">
                  {language === 'en' ? 'Citizen' : 'नागरिक'}
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-medium text-slate-500 hidden md:inline-block whitespace-nowrap">
                {language === 'en' ? 'Legal Awareness & Advocate Network' : 'नागरिक कानूनी सहायता व परामर्श मंच'}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 bg-white/35 backdrop-blur-md p-1 rounded-2xl border border-white/50 shadow-xs">
            {navLinks.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.key}
                  id={`citizen-nav-${item.key.replace('/', '-')}`}
                  onClick={() => handleNav(item.route)}
                  className={`px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 active:scale-97 ${
                    isActive
                      ? 'text-sky-950 bg-sky-500/15 border border-sky-400/40 shadow-xs font-bold'
                      : 'text-slate-700 hover:text-sky-800 hover:bg-white/50 border border-transparent'
                  }`}
                >
                  {item.icon && <item.icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Area: Unified Language Switch + Profile Avatar / Login Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Unified Glass Language Switch */}
            <div className="flex items-center bg-white/45 backdrop-blur-md p-1 rounded-xl border border-white/70 shadow-inner">
              <button
                id="citizen-lang-switch-en"
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
                id="citizen-lang-switch-hi"
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

            {/* Profile Avatar & Dropdown OR Login/Signup Button */}
            {isLoggedIn && activeUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  id="citizen-profile-avatar-btn"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-xl border transition-all duration-200 cursor-pointer active:scale-97 ${
                    profileDropdownOpen 
                      ? 'bg-white/80 border-sky-300 shadow-[0_0_15px_rgba(74,144,226,0.3)] ring-2 ring-sky-500/20' 
                      : 'bg-white/55 backdrop-blur-md border-white/80 hover:bg-white/85 hover:border-sky-300/60 shadow-xs'
                  }`}
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-white bg-sky-100 shrink-0 shadow-xs">
                    <img 
                      src={profileImgSrc} 
                      alt={displayName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_CITIZEN_AVATAR;
                      }}
                    />
                  </div>
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-900 max-w-[100px] truncate leading-tight">
                      {displayName}
                    </span>
                    <span className="text-[10px] text-sky-700 font-semibold leading-none">
                      {language === 'en' ? 'Profile' : 'प्रोफ़ाइल'}
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180 text-sky-600' : ''}`} />
                </button>

                {/* Profile Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white/85 backdrop-blur-2xl rounded-2xl border border-white/80 shadow-[0_16px_48px_rgba(31,38,135,0.15)] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2.5 border-b border-sky-100/60">
                      <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
                      {displayEmail && <p className="text-[11px] text-slate-500 truncate">{displayEmail}</p>}
                      <span className="inline-block mt-1 text-[10px] font-bold text-sky-800 bg-sky-500/15 px-2 py-0.5 rounded-full border border-sky-300/40">
                        {language === 'en' ? 'Verified Citizen' : 'सत्यापित नागरिक'}
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        id="dropdown-profile-link"
                        onClick={() => handleNav('user/profile')}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-sky-500/10 hover:text-sky-900 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5 text-sky-600" />
                        <span>{language === 'en' ? 'My Profile' : 'मेरी प्रोफ़ाइल'}</span>
                      </button>

                      <button
                        id="dropdown-appointments-link"
                        onClick={() => handleNav('user/appointments')}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-sky-500/10 hover:text-sky-900 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5 text-sky-600" />
                        <span>{language === 'en' ? 'My Appointments' : 'मेरी नियुक्तियां'}</span>
                      </button>

                      <button
                        id="dropdown-applications-link"
                        onClick={() => handleNav('user/applications')}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-sky-500/10 hover:text-sky-900 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-sky-600" />
                        <span>{language === 'en' ? 'My Applications' : 'मेरे आवेदन'}</span>
                      </button>

                      <button
                        id="dropdown-saved-link"
                        onClick={() => handleNav('user/saved')}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-sky-500/10 hover:text-sky-900 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Bookmark className="w-3.5 h-3.5 text-sky-600" />
                        <span>{language === 'en' ? 'Saved Resources' : 'सहेजे गए अधिकार'}</span>
                      </button>

                      <button
                        id="dropdown-settings-link"
                        onClick={() => handleNav('user/settings')}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-sky-500/10 hover:text-sky-900 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5 text-sky-600" />
                        <span>{language === 'en' ? 'Account Settings' : 'खाता सेटिंग्स'}</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-sky-100/60">
                      <button
                        id="dropdown-signout-link"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50/80 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{language === 'en' ? 'Sign Out' : 'लॉग आउट'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="citizen-nav-login-btn"
                onClick={() => onNavigate('auth/login/citizen')}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs xl:text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white border border-white/40 shadow-xs hover:from-sky-600 hover:to-blue-700 transition-all cursor-pointer whitespace-nowrap active:scale-97"
              >
                <UserCheck className="w-4 h-4 text-sky-100" />
                <span>{language === 'en' ? 'Login / Signup' : 'लॉगिन / साइनअप'}</span>
              </button>
            )}

            {/* Mobile Drawer Toggle */}
            <button
              id="citizen-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 bg-white/50 backdrop-blur-md hover:bg-white/80 border border-white/70 cursor-pointer active:scale-95 transition-all"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-sky-700" /> : <Menu className="w-5 h-5 text-slate-700" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/60 bg-white/90 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
          {isLoggedIn && activeUser ? (
            <div className="p-3 bg-sky-500/10 rounded-2xl border border-sky-300/40 flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-white bg-white shadow-xs">
                <img 
                  src={profileImgSrc} 
                  alt={displayName} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{displayName}</p>
                {displayEmail && <p className="text-[11px] text-slate-500">{displayEmail}</p>}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-sky-500/10 rounded-2xl border border-sky-300/40 flex items-center justify-between mb-2">
              <div>
                <p className="text-xs font-bold text-slate-900">{language === 'en' ? 'Guest Citizen' : 'नागरिक अतिथि'}</p>
                <p className="text-[10px] text-slate-500">{language === 'en' ? 'Sign in to access your portal' : 'पोर्टल हेतु लॉगिन करें'}</p>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('auth/login/citizen');
                }}
                className="px-3 py-1.5 bg-sky-600 text-white text-xs font-semibold rounded-xl"
              >
                {language === 'en' ? 'Login' : 'लॉगिन'}
              </button>
            </div>
          )}

          {navLinks.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <button
                key={`m-${item.key}`}
                id={`m-citizen-nav-${item.key.replace('/', '-')}`}
                onClick={() => handleNav(item.route)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between cursor-pointer active:scale-98 transition-all ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-900 font-bold border border-sky-300/50'
                    : 'text-slate-800 hover:bg-white/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon && <item.icon className="w-4 h-4 text-sky-600" />}
                  <span>{item.label}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-sky-600" />
              </button>
            );
          })}

          {isLoggedIn ? (
            <div className="pt-2 border-t border-white/60 space-y-1">
              <button
                onClick={() => handleNav('user/profile')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white/60 flex items-center gap-2"
              >
                <User className="w-3.5 h-3.5 text-sky-600" />
                <span>{language === 'en' ? 'My Profile' : 'मेरी प्रोफ़ाइल'}</span>
              </button>
              <button
                onClick={() => handleNav('user/appointments')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white/60 flex items-center gap-2"
              >
                <Calendar className="w-3.5 h-3.5 text-sky-600" />
                <span>{language === 'en' ? 'My Appointments' : 'मेरी नियुक्तियां'}</span>
              </button>
              <button
                onClick={() => handleNav('user/saved')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white/60 flex items-center gap-2"
              >
                <Bookmark className="w-3.5 h-3.5 text-sky-600" />
                <span>{language === 'en' ? 'Saved Resources' : 'सहेजे गए अधिकार'}</span>
              </button>
              <button
                onClick={() => handleNav('user/settings')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white/60 flex items-center gap-2"
              >
                <Settings className="w-3.5 h-3.5 text-sky-600" />
                <span>{language === 'en' ? 'Settings' : 'सेटिंग्स'}</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50/80 flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span>{language === 'en' ? 'Sign Out' : 'लॉग आउट'}</span>
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-white/60">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('auth/login/citizen');
                }}
                className="w-full text-center px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 shadow-xs"
              >
                {language === 'en' ? 'Sign In / Register' : 'लॉगिन / पंजीकरण करें'}
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
