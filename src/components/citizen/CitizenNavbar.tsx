import React, { useState, useRef, useEffect } from 'react';
import { 
  Globe, Menu, X, ArrowRight, User, Briefcase, LogOut, 
  Calendar, BookOpen, Bot, FileText, Settings, Bookmark, ChevronDown, Check
} from 'lucide-react';
import { Language, AppRoute, AuthUser } from '../../types';
import logoImg from '../../assets/images/nyaay_sarathi_logo_1787153284213.jpg';
import { DEFAULT_CITIZEN_AVATAR } from '../../data/portalData';

interface CitizenNavbarProps {
  currentRoute: AppRoute;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currentUser?: AuthUser;
  user?: AuthUser;
  onNavigate: (route: AppRoute, params?: any) => void;
  onLogout: () => void;
  notificationCount?: number;
}

export function CitizenNavbar({
  currentRoute,
  language,
  onLanguageChange,
  currentUser: propCurrentUser,
  user: propUser,
  onNavigate,
  onLogout,
  notificationCount = 0,
}: CitizenNavbarProps) {
  const currentUser = propCurrentUser || propUser || {
    id: 'demo_user',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@gmail.com',
    role: 'citizen' as const,
  };

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
      route: 'user/home' as AppRoute,
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
      route: 'user/applications' as AppRoute,
      icon: FileText,
    },
  ];

  const handleNav = (route: AppRoute) => {
    onNavigate(route);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const profileImgSrc = currentUser.profilePicture || DEFAULT_CITIZEN_AVATAR;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-2xs transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-2">
          
          {/* Logo & Portal Name */}
          <div 
            onClick={() => handleNav('user/home')}
            id="citizen-brand-logo-btn"
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white border border-sky-100 p-0.5 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200 shrink-0 overflow-hidden">
              <img 
                src={logoImg} 
                alt="Nyaay सारथी Logo" 
                className="w-full h-full object-cover rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  Nyaay <span className="text-sky-600 font-['Noto_Sans_Devanagari',sans-serif] font-extrabold">सारथी</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 bg-sky-100 text-sky-800 text-[10px] font-extrabold rounded-full tracking-wide uppercase">
                  {language === 'en' ? 'Citizen' : 'नागरिक'}
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-medium text-slate-500 hidden md:inline-block whitespace-nowrap">
                {language === 'en' ? 'Legal Awareness & Advocate Network' : 'नागरिक कानूनी सहायता व परामर्श मंच'}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links: Exact items from Section 4 */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.key}
                  id={`citizen-nav-${item.key.replace('/', '-')}`}
                  onClick={() => handleNav(item.route)}
                  className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'text-sky-700 bg-sky-50 border border-sky-200/90 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50/60 border border-transparent'
                  }`}
                >
                  {item.icon && <item.icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Area: Unified Language Switch + Profile Avatar */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Unified Language Switch */}
            <div className="flex items-center bg-slate-100/90 p-0.5 sm:p-1 rounded-xl border border-sky-100">
              <button
                id="citizen-lang-switch-en"
                onClick={() => onLanguageChange('en')}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-white text-sky-700 shadow-xs font-bold border border-sky-200/70'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-sky-500" />
                <span>English</span>
              </button>
              <button
                id="citizen-lang-switch-hi"
                onClick={() => onLanguageChange('hi')}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  language === 'hi'
                    ? 'bg-white text-sky-700 shadow-xs font-bold border border-sky-200/70'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <span>हिंदी</span>
              </button>
            </div>

            {/* Profile Avatar & Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                id="citizen-profile-avatar-btn"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  profileDropdownOpen 
                    ? 'bg-sky-50 border-sky-300 ring-2 ring-sky-500/20' 
                    : 'bg-white border-sky-200 hover:bg-sky-50/70 hover:border-sky-300'
                }`}
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-sky-200 bg-sky-50 shrink-0">
                  <img 
                    src={profileImgSrc} 
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_CITIZEN_AVATAR;
                    }}
                  />
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 max-w-[100px] truncate leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-sky-600 font-medium leading-none">
                    {language === 'en' ? 'Profile' : 'प्रोफ़ाइल'}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${profileDropdownOpen ? 'rotate-180 text-sky-600' : ''}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-sky-100 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-150">
                      {language === 'en' ? 'Verified Citizen' : 'सत्यापित नागरिक'}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      id="dropdown-profile-link"
                      onClick={() => handleNav('user/profile')}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-sky-600" />
                      <span>{language === 'en' ? 'My Profile' : 'मेरी प्रोफ़ाइल'}</span>
                    </button>

                    <button
                      id="dropdown-appointments-link"
                      onClick={() => handleNav('user/appointments')}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 text-sky-600" />
                      <span>{language === 'en' ? 'My Appointments' : 'मेरी नियुक्तियां'}</span>
                    </button>

                    <button
                      id="dropdown-applications-link"
                      onClick={() => handleNav('user/applications')}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-sky-600" />
                      <span>{language === 'en' ? 'My Applications' : 'मेरे आवेदन'}</span>
                    </button>

                    <button
                      id="dropdown-saved-link"
                      onClick={() => handleNav('user/saved')}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-sky-600" />
                      <span>{language === 'en' ? 'Saved Resources' : 'सहेजे गए अधिकार'}</span>
                    </button>

                    <button
                      id="dropdown-settings-link"
                      onClick={() => handleNav('user/settings')}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5 text-sky-600" />
                      <span>{language === 'en' ? 'Account Settings' : 'खाता सेटिंग्स'}</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      id="dropdown-signout-link"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Sign Out' : 'लॉग आउट'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Drawer Toggle */}
            <button
              id="citizen-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-sky-50 border border-sky-100 cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-sky-700" /> : <Menu className="w-5 h-5 text-slate-700" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-sky-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-150 flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-sky-200 bg-white">
              <img 
                src={profileImgSrc} 
                alt={currentUser.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
              <p className="text-[11px] text-slate-500">{currentUser.email}</p>
            </div>
          </div>

          {navLinks.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <button
                key={`m-${item.key}`}
                id={`m-citizen-nav-${item.key.replace('/', '-')}`}
                onClick={() => handleNav(item.route)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between cursor-pointer ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 font-bold border border-sky-200/80'
                    : 'text-slate-700 hover:bg-sky-50/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon && <item.icon className="w-4 h-4 text-sky-600" />}
                  <span>{item.label}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-sky-500" />
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-100 space-y-1">
            <button
              onClick={() => handleNav('user/profile')}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-sky-50 flex items-center gap-2"
            >
              <User className="w-3.5 h-3.5 text-sky-600" />
              <span>{language === 'en' ? 'My Profile' : 'मेरी प्रोफ़ाइल'}</span>
            </button>
            <button
              onClick={() => handleNav('user/appointments')}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-sky-50 flex items-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5 text-sky-600" />
              <span>{language === 'en' ? 'My Appointments' : 'मेरी नियुक्तियां'}</span>
            </button>
            <button
              onClick={() => handleNav('user/saved')}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-sky-50 flex items-center gap-2"
            >
              <Bookmark className="w-3.5 h-3.5 text-sky-600" />
              <span>{language === 'en' ? 'Saved Resources' : 'सहेजे गए अधिकार'}</span>
            </button>
            <button
              onClick={() => handleNav('user/settings')}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-sky-50 flex items-center gap-2"
            >
              <Settings className="w-3.5 h-3.5 text-sky-600" />
              <span>{language === 'en' ? 'Settings' : 'सेटिंग्स'}</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>{language === 'en' ? 'Sign Out' : 'लॉग आउट'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
