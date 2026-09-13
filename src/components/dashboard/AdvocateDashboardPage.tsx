import React, { useState, useEffect, useRef } from 'react';
import { 
  Briefcase, Scale, Award, ShieldCheck, Clock, Calendar, Users, 
  BookOpen, ArrowLeft, CheckCircle2, AlertCircle, ChevronRight, LogOut,
  ExternalLink, Search, Sparkles, MessageSquare, Video, Phone,
  FileText, Check, X, Undo2, Filter, Settings, User, MapPin, Eye,
  Building, ChevronDown, Bell, HelpCircle, Bot
} from 'lucide-react';
import { Language, AppRoute, AuthUser } from '../../types';
import { AnimatedGlassBackground } from '../AnimatedGlassBackground';
import { AiAssistantPage } from '../citizen/AiAssistantPage';
import { apiGetAdvocateProfile, apiUpdateAdvocateProfile, apiGetApplications, apiUpdateApplicationStatus } from '../../services/apiClient';
import { saveStoredUser } from '../../data/portalData';
import logoImg from '../../assets/images/nyaay_sarathi_logo_1787153284213.jpg';

interface ConsultationRequest {
  id: string;
  citizenName: string;
  citizenNameHi: string;
  avatarColor: string;
  initials: string;
  category: string;
  categoryHi: string;
  categoryType: 'cybercrime' | 'property' | 'consumer' | 'tenancy' | 'cheque' | 'employment';
  summary: string;
  summaryHi: string;
  city: string;
  timeAgo: string;
  timeAgoHi: string;
  preferredMode: 'Video Consultation' | 'Phone Call' | 'Document Scrutiny';
  preferredModeHi: string;
  urgency: 'High' | 'Medium' | 'Normal';
  status: 'pending' | 'accepted' | 'rejected';
  scheduledTime?: string;
  attachments?: string[];
}

const INITIAL_REQUESTS: ConsultationRequest[] = [];

const BNS_REFERENCE_DATA = [
  { ipc: "420", ipcTitle: "Cheating", bns: "318(4)", bnsTitle: "Cheating", description: "Cheating and dishonestly inducing delivery of property" },
  { ipc: "302", ipcTitle: "Murder", bns: "103(1)", bnsTitle: "Punishment for Murder", description: "Whoever commits murder shall be punished with death or imprisonment for life, and shall also be liable to fine." },
  { ipc: "376", ipcTitle: "Rape", bns: "64", bnsTitle: "Punishment for rape", description: "Whoever commits rape shall be punished with rigorous imprisonment." }
];

interface AdvocateDashboardPageProps {
  user: AuthUser;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigate: (route: AppRoute, params?: any) => void;
  onLogout: () => void;
  onOpenDialog: (actionKey: string, topic?: string) => void;
  initialView?: 'feed' | 'history' | 'bns' | 'chat';
}

export function AdvocateDashboardPage({
  user,
  language,
  onLanguageChange,
  onNavigate,
  onLogout,
  onOpenDialog,
  initialView = 'feed',
}: AdvocateDashboardPageProps) {
  // Requests state
  const [requests, setRequests] = useState<ConsultationRequest[]>(INITIAL_REQUESTS);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'feed' | 'history' | 'bns' | 'chat'>(initialView);

  useEffect(() => {
    if (initialView) {
      setActiveView(initialView);
    }
  }, [initialView]);

  // Avatar Dropdown State
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Manage Profile Modal State
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name || '',
    email: user.email || '',
    barEnrollment: user.barEnrollment || '',
    stateBarCouncil: user.stateBarCouncil || 'Bar Council of Delhi',
    experience: user.experience || '5+ Years',
    courts: user.courts || 'District Court & High Court',
    languages: user.languages || 'English, Hindi',
    consultationFee: typeof (user as any).consultationFee === 'number'
      ? (user as any).consultationFee
      : (parseInt(String(user.consultationFee || '500').replace(/[^0-9]/g, ''), 10) || 500),
    consultationDuration: (user as any).consultationDuration || '30 mins',
    phone: user.phone || '',
    practiceAreas: user.practiceAreas || ['Civil Law', 'Consumer Disputes'],
    city: user.city || '',
    state: user.state || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Authoritatively fetch authenticated advocate's actual PostgreSQL database record
  useEffect(() => {
    let isMounted = true;
    async function loadAdvocateProfile() {
      if (!user?.id) return;
      setProfileLoading(true);
      setProfileError(null);

      try {
        const res = await apiGetAdvocateProfile(user.id);
        if (isMounted && res && res.advocate) {
          const adv = res.advocate;
          const u = res.user;
          const rawFee = adv.consultationFee;
          const numFee = typeof rawFee === 'number'
            ? rawFee
            : (parseInt(String(rawFee || '500').replace(/[^0-9]/g, ''), 10) || 500);
          const durStr = adv.consultationDuration || '30 mins';
          const langStr = Array.isArray(adv.languages)
            ? adv.languages.join(', ')
            : (adv.languages || '');

          setProfileData({
            name: adv.name || u.name || user.name || '',
            email: adv.email || u.email || user.email || '',
            barEnrollment: adv.barEnrollment || user.barEnrollment || '',
            stateBarCouncil: adv.stateBarCouncil || user.stateBarCouncil || 'Bar Council of Delhi',
            experience: adv.experience || user.experience || '5+ Years',
            courts: adv.courts || user.courts || 'District Court & High Court',
            languages: langStr || user.languages || 'English, Hindi',
            consultationFee: numFee,
            consultationDuration: durStr,
            phone: adv.phone || u.phone || user.phone || '',
            practiceAreas: adv.practiceAreas || user.practiceAreas || ['Civil Law'],
            city: adv.city || u.city || user.city || '',
            state: adv.state || u.state || user.state || '',
          });

          // Fetch applications for this advocate
          const apps = await apiGetApplications(undefined, adv.id);
          if (isMounted) {
             const mappedRequests = apps.map(app => ({
                id: app.id,
                citizenName: app.citizenName || 'Citizen',
                citizenNameHi: app.citizenName || 'नागरिक',
                avatarColor: 'from-sky-500 to-blue-600',
                initials: (app.citizenName || 'CZ').substring(0, 2).toUpperCase(),
                category: app.category,
                categoryHi: app.category,
                categoryType: 'consumer' as any,
                summary: app.description,
                summaryHi: app.description,
                city: 'Online',
                timeAgo: 'Just now',
                timeAgoHi: 'अभी-अभी',
                preferredMode: 'Video Consultation' as const,
                preferredModeHi: 'वीडियो परामर्श',
                urgency: 'Medium' as const,
                status: ((app.acceptanceStatus?.toLowerCase() === 'accepted' || app.status?.toLowerCase() === 'in progress') 
                  ? 'accepted' 
                  : (app.acceptanceStatus?.toLowerCase() === 'rejected' ? 'rejected' : 'pending')) as 'pending' | 'accepted' | 'rejected',
                scheduledTime: app.appointmentDate && app.appointmentTime ? `${app.appointmentDate} ${app.appointmentTime}` : undefined,
                attachments: []
             }));
             
             if (mappedRequests) {
               setRequests(mappedRequests);
             }
             setRequestsLoading(false);
          }
        }
      } catch (err: any) {
        console.error('[AdvocateDashboard] Error loading profile from database:', err);
        if (isMounted) {
          setProfileError(err.message || 'Unable to load profile from database');
        }
      } finally {
        if (isMounted) {
          setProfileLoading(false);
        }
      }
    }

    loadAdvocateProfile();
    return () => { isMounted = false; };
  }, [user.id]);

  // BNS Search State
  const [bnsQuery, setBnsQuery] = useState('');

  // Live Date formatting
  const todayDateString = new Intl.DateTimeFormat(language === 'hi' ? 'hi-IN' : 'en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  // Close avatar dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAvatarDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Accepting a Consultation Request
  const handleAcceptRequest = async (id: string) => {
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        return {
          ...req,
          status: 'accepted',
          scheduledTime: req.scheduledTime || 'Today at 5:00 PM (Video Room Ready)',
        };
      }
      return req;
    }));
    await apiUpdateApplicationStatus(id, { acceptanceStatus: 'Accepted', status: 'In Progress' });
  };

  // Handle Rejecting a Consultation Request
  const handleRejectRequest = async (id: string) => {
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        return {
          ...req,
          status: 'rejected',
        };
      }
      return req;
    }));
    await apiUpdateApplicationStatus(id, { acceptanceStatus: 'Rejected', status: 'Rejected' });
  };

  // Handle Undo of Accept / Reject
  const handleUndoStatus = (id: string) => {
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        return {
          ...req,
          status: 'pending',
          scheduledTime: undefined,
        };
      }
      return req;
    }));
  };

  // Calculate counts
  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const acceptedCount = requests.filter(r => r.status === 'accepted').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  // Filter requests
  const filteredRequests = requests.filter(req => {
    if (filterTab === 'pending' && req.status !== 'pending') return false;
    if (filterTab === 'accepted' && req.status !== 'accepted') return false;
    if (filterTab === 'rejected' && req.status !== 'rejected') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = req.citizenName.toLowerCase().includes(q) || req.citizenNameHi.toLowerCase().includes(q);
      const matchCat = req.category.toLowerCase().includes(q) || req.categoryHi.toLowerCase().includes(q);
      const matchSummary = req.summary.toLowerCase().includes(q) || req.summaryHi.toLowerCase().includes(q);
      const matchCity = req.city.toLowerCase().includes(q);
      return matchName || matchCat || matchSummary || matchCity;
    }
    return true;
  });

  // Filter BNS Matrix
  const filteredBNS = BNS_REFERENCE_DATA.filter(item => {
    if (!bnsQuery.trim()) return true;
    const q = bnsQuery.toLowerCase();
    return (
      item.ipc.toLowerCase().includes(q) ||
      item.ipcTitle.toLowerCase().includes(q) ||
      item.bns.toLowerCase().includes(q) ||
      item.bnsTitle.toLowerCase().includes(q)
    );
  });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setSaveLoading(true);

    try {
      const parsedFee = Number(profileData.consultationFee) || 500;
      const durationStr = profileData.consultationDuration || '30 mins';

      const res = await apiUpdateAdvocateProfile(user.id, {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        barEnrollment: profileData.barEnrollment,
        stateBarCouncil: profileData.stateBarCouncil,
        experience: profileData.experience,
        courts: profileData.courts,
        consultationFee: parsedFee,
        consultationDuration: durationStr,
        languages: profileData.languages,
        practiceAreas: profileData.practiceAreas,
        city: profileData.city,
        state: profileData.state,
      });

      if (res && res.advocate) {
        const adv = res.advocate;
        const updatedFee = typeof adv.consultationFee === 'number' ? adv.consultationFee : parsedFee;
        const updatedDur = adv.consultationDuration || durationStr;

        const updatedData = {
          ...profileData,
          name: adv.name || profileData.name,
          email: adv.email || profileData.email,
          phone: adv.phone || profileData.phone,
          barEnrollment: adv.barEnrollment || profileData.barEnrollment,
          stateBarCouncil: adv.stateBarCouncil || profileData.stateBarCouncil,
          experience: adv.experience || profileData.experience,
          courts: adv.courts || profileData.courts,
          consultationFee: updatedFee,
          consultationDuration: updatedDur,
          city: adv.city || profileData.city,
          state: adv.state || profileData.state,
        };
        setProfileData(updatedData);

        // Sync local storage so other tabs and components reflect updated details
        const updatedUser: AuthUser = {
          ...user,
          name: updatedData.name,
          phone: updatedData.phone,
          barEnrollment: updatedData.barEnrollment,
          stateBarCouncil: updatedData.stateBarCouncil,
          experience: updatedData.experience,
          courts: updatedData.courts,
          consultationFee: `₹${updatedFee} / ${updatedDur}`,
          city: updatedData.city,
          state: updatedData.state,
        };
        saveStoredUser(updatedUser);
      }

      setSaveToast(language === 'en' ? 'Profile details updated successfully!' : 'प्रोफ़ाइल विवरण सफलतापूर्वक अपडेट किया गया!');
      setTimeout(() => {
        setSaveToast(null);
        setProfileModalOpen(false);
      }, 1200);
    } catch (err: any) {
      console.error('Failed to save profile changes:', err);
      setSaveError(err.message || (language === 'en' ? 'Failed to save profile changes' : 'प्रोफ़ाइल विवरण सहेजने में विफल'));
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-sky-200 selection:text-sky-950 flex flex-col justify-between relative">
      <AnimatedGlassBackground />
      
      {/* ========================================================
          1. ADVOCATE DASHBOARD HEADER / NAVBAR (LIGHT THEME)
         ======================================================== */}
      <header className="w-full bg-white/65 backdrop-blur-xl text-slate-900 border-b border-white/70 sticky top-0 z-40 py-2.5 sm:py-3 px-4 sm:px-8 shadow-[0_4px_24px_rgba(31,38,135,0.06)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Nyaay Saathi Logo & 'Advocate Portal' sub-badge */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => {
                setActiveView('feed');
                onNavigate('advocate-dashboard');
              }}
              className="flex items-center gap-3 cursor-pointer select-none group"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-sky-50 border border-sky-200 p-0.5 shadow-sm overflow-hidden group-hover:scale-105 transition-transform flex items-center justify-center">
                <img 
                  src={logoImg} 
                  alt="Nyaay Sarthi Logo" 
                  className="w-full h-full object-contain scale-[1.36]" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg tracking-tight text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  <span className="font-bold text-slate-900">Nyaay</span> <span className="text-blue-600 font-bold">Sarthi</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200 shadow-2xs">
                  <Briefcase className="w-3 h-3 text-sky-600" />
                  <span>Advocate Portal</span>
                </span>
              </div>
            </div>
          </div>

          {/* Center: Navigation Items */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => {
                setActiveView('feed');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'feed'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              {language === 'en' ? 'Home' : 'होम'}
            </button>

            <button
              onClick={() => {
                setActiveView('history');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'history'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              <span>{language === 'en' ? 'Record History' : 'परामर्श इतिहास'}</span>
              {acceptedCount > 0 && (
                <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-1.5 py-0.2 rounded-full border border-emerald-200">
                  {acceptedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveView('bns');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'bns'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-sky-600" />
              <span>{language === 'en' ? 'IPC / BNS Reference' : 'IPC / BNS संदर्भ'}</span>
            </button>

            <button
              id="advocate-nav-chat"
              onClick={() => {
                setActiveView('chat');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'chat'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-sky-600" />
              <span>{language === 'en' ? 'Chat to AI' : 'AI से बात करें'}</span>
            </button>

            <button
              onClick={() => onNavigate('about')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all cursor-pointer"
            >
              {language === 'en' ? 'About Us' : 'हमारे बारे में'}
            </button>
          </nav>

          {/* Right: Live Date, Language Toggle, Log Out button, and Interactive Avatar Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Live Date Display */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/90 text-[11px] font-semibold text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-sky-600" />
              <span>{todayDateString}</span>
            </div>

            {/* Language Switcher Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/90 shadow-2xs">
              <button
                id="advocate-lang-en-toggle"
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  language === 'en' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                id="advocate-lang-hi-toggle"
                onClick={() => onLanguageChange('hi')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  language === 'hi' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                HI
              </button>
            </div>

            {/* Advocate Profile Avatar with Interactive Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                id="advocate-avatar-dropdown-trigger"
                onClick={() => setAvatarDropdownOpen(prev => !prev)}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-slate-50 hover:bg-sky-50/80 border border-slate-200/90 hover:border-sky-300 transition-all cursor-pointer active:scale-95 group focus:outline-none focus:ring-2 focus:ring-sky-500"
                aria-expanded={avatarDropdownOpen}
              >
                {/* Avatar Icon / Initials */}
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs border border-sky-300">
                    {profileData.name ? profileData.name.replace(/^Adv\.?\s*/i, '').trim().slice(0, 2).toUpperCase() : 'AD'}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" title="Online & Verified" />
                </div>

                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-900 leading-tight group-hover:text-sky-700 transition-colors">
                    {profileData.name.length > 18 ? profileData.name.slice(0, 16) + '...' : profileData.name}
                  </p>
                  <p className="text-[10px] text-sky-700 font-mono font-semibold">
                    {profileData.barEnrollment}
                  </p>
                </div>

                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform ${avatarDropdownOpen ? 'rotate-180 text-sky-600' : ''}`} />
              </button>

              {/* Avatar Dropdown Menu */}
              {avatarDropdownOpen && (
                <div 
                  id="advocate-avatar-dropdown-menu"
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-sky-100 py-2 z-50 text-slate-900 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  {/* Dropdown Header Info */}
                  <div className="px-4 py-3 border-b border-slate-100 bg-sky-50/50">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                        {language === 'en' ? 'Verified Practitioner' : 'सत्यापित अधिवक्ता'}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 mt-1">{profileData.name}</p>
                    <p className="text-xs text-slate-500 truncate">{profileData.email}</p>
                    <p className="text-[11px] font-mono text-sky-700 mt-0.5">{profileData.barEnrollment} • {profileData.stateBarCouncil}</p>
                  </div>

                  {/* Dropdown Action 1: Manage Profile */}
                  <button
                    id="dropdown-manage-profile-btn"
                    onClick={() => {
                      setAvatarDropdownOpen(false);
                      setProfileModalOpen(true);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:text-sky-700 hover:bg-sky-50/80 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                      <Settings className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{language === 'en' ? 'Manage Profile' : 'प्रोफ़ाइल प्रबंधन'}</p>
                      <p className="text-[10px] text-slate-500">{language === 'en' ? 'Bar credentials, fees & court admissions' : 'बार पंजीकरण, शुल्क व अभ्यास क्षेत्र'}</p>
                    </div>
                  </button>

                  {/* Dropdown Action 2: Record History */}
                  <button
                    onClick={() => {
                      setAvatarDropdownOpen(false);
                      setActiveView('history');
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:text-sky-700 hover:bg-sky-50/80 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{language === 'en' ? 'Consultation Records' : 'परामर्श रिकॉर्ड'}</p>
                      <p className="text-[10px] text-slate-500">{language === 'en' ? 'Accepted briefs & past appointments' : 'स्वीकृत मामले व परामर्श विवरण'}</p>
                    </div>
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  {/* Dropdown Action 3: Log Out */}
                  <button
                    id="dropdown-logout-btn"
                    onClick={() => {
                      setAvatarDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                      <LogOut className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-bold text-rose-700">{language === 'en' ? 'Log Out' : 'लॉग आउट'}</p>
                      <p className="text-[10px] text-rose-500">{language === 'en' ? 'End session & return to home' : 'सत्र समाप्त करें'}</p>
                    </div>
                  </button>

                </div>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* ========================================================
          MAIN ADVOCATE DASHBOARD VIEW AREA
         ======================================================== */}
      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 md:p-8 space-y-6">
        
        {/* Controlled Error Alert if Advocate Profile is missing from DB */}
        {profileError && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-2xl font-semibold flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{profileError}</span>
            </div>
          </div>
        )}

        {/* Top Banner: Advocate Status & Quick Stats */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-sky-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{language === 'en' ? 'Bar Council Verified' : 'बार काउंसिल सत्यापित'}</span>
              </span>
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                {profileData.stateBarCouncil}
              </span>
              <span className="text-xs font-mono font-bold text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                {profileData.barEnrollment}
              </span>
              <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                ⭐ 4.9 (42 Reviews)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {profileData.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              {language === 'en'
                ? `Enrolled with ${profileData.stateBarCouncil || 'State Bar Council'}. Practice: ${Array.isArray(profileData.practiceAreas) && profileData.practiceAreas.length > 0 ? profileData.practiceAreas.join(', ') : 'Civil, Criminal & Constitutional Law'} • Admitted to ${profileData.courts || 'District & High Courts'}.`
                : `${profileData.stateBarCouncil || 'राज्य बार काउंसिल'} के साथ पंजीकृत। अभ्यास: ${Array.isArray(profileData.practiceAreas) && profileData.practiceAreas.length > 0 ? profileData.practiceAreas.join(', ') : 'आपराधिक व दीवानी कानून'} • न्यायालय: ${profileData.courts || 'जिला एवं उच्च न्यायालय'}।`}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-slate-200/90 text-center min-w-[100px] sm:min-w-[115px]">
              <p className="text-xs text-slate-500 font-semibold">{language === 'en' ? 'Pending' : 'लंबित'}</p>
              <p className="text-2xl font-black text-sky-600 mt-0.5 font-mono">{pendingCount}</p>
            </div>
            <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-slate-200/90 text-center min-w-[100px] sm:min-w-[115px]">
              <p className="text-xs text-slate-500 font-semibold">{language === 'en' ? 'Accepted' : 'स्वीकृत'}</p>
              <p className="text-2xl font-black text-emerald-600 mt-0.5 font-mono">{acceptedCount}</p>
            </div>
            <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-slate-200/90 text-center min-w-[100px] sm:min-w-[115px]">
              <p className="text-xs text-slate-500 font-semibold">{language === 'en' ? 'Fee / Slot' : 'शुल्क'}</p>
              <p className="text-lg sm:text-xl font-bold text-slate-800 mt-1 font-mono">
                ₹{Number(profileData.consultationFee || 500).toLocaleString('en-IN')}
              </p>
              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                / {profileData.consultationDuration || '30 mins'}
              </p>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 border-b border-sky-100 pb-3">
          <button
            onClick={() => setActiveView('feed')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeView === 'feed'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-sky-50 border border-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{language === 'en' ? 'Consultation Requests Feed' : 'नागरिक परामर्श अनुरोध'}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
              activeView === 'feed' ? 'bg-sky-700 text-white' : 'bg-slate-100 text-slate-700'
            }`}>
              {requests.length}
            </span>
          </button>

          <button
            onClick={() => setActiveView('history')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeView === 'history'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-sky-50 border border-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{language === 'en' ? 'Record History' : 'परामर्श इतिहास'}</span>
            {acceptedCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800">
                {acceptedCount} {language === 'en' ? 'Active' : 'सक्रिय'}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView('bns')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeView === 'bns'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-sky-50 border border-slate-200'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>{language === 'en' ? 'IPC / BNS Quick Matrix' : 'BNS धारा संदर्भ'}</span>
          </button>

          <button
            onClick={() => setActiveView('chat')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeView === 'chat'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-sky-50 border border-slate-200'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>{language === 'en' ? 'Chat to AI' : 'AI से बात करें'}</span>
          </button>
        </div>

        {/* ========================================================
            VIEW 1: CLIENT CONSULTATION REQUESTS FEED (MAIN WORKSPACE)
           ======================================================== */}
        {activeView === 'feed' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Main Feed Cards */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Section Header: 'Incoming Citizen Consultation Requests' & Counter Badge */}
              <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                      {language === 'en' ? 'Incoming Citizen Consultation Requests' : 'नागरिकों के नए परामर्श अनुरोध'}
                    </h2>
                    
                    {/* Counter Badge showing pending requests */}
                    <span 
                      id="pending-requests-counter-badge"
                      className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold font-mono border border-sky-200 flex items-center gap-1"
                    >
                      <span className="w-2 h-2 rounded-full bg-sky-600 animate-pulse" />
                      <span>{pendingCount} {language === 'en' ? 'Pending' : 'लंबित'}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-1">
                    {language === 'en' 
                      ? 'Review citizen inquiries, case summaries & verified details. Accept to initiate formal consultation.'
                      : 'नागरिक कानूनी पूछताछ व केस विवरण की समीक्षा करें और परामर्श हेतु स्वीकार करें।'}
                  </p>
                </div>

                {/* Search / Filter bar inside feed header */}
                <div className="relative min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === 'en' ? 'Search requests...' : 'अनुरोध खोजें...'}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Status Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setFilterTab('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    filterTab === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {language === 'en' ? 'All Requests' : 'सभी अनुरोध'} ({requests.length})
                </button>
                <button
                  onClick={() => setFilterTab('pending')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    filterTab === 'pending'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-white text-sky-700 hover:bg-sky-50 border border-sky-200'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>{language === 'en' ? 'Pending' : 'लंबित'} ({pendingCount})</span>
                </button>
                <button
                  onClick={() => setFilterTab('accepted')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    filterTab === 'accepted'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Accepted' : 'स्वीकृत'} ({acceptedCount})</span>
                </button>
                <button
                  onClick={() => setFilterTab('rejected')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    filterTab === 'rejected'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
                  }`}
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Declined' : 'अस्वीकृत'} ({rejectedCount})</span>
                </button>
              </div>

              {/* Feed Card List */}
              {filteredRequests.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 border border-sky-100 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                    <Filter className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">
                    {language === 'en' ? 'No consultation requests found' : 'कोई परामर्श अनुरोध नहीं मिला'}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {language === 'en' 
                      ? 'No requests match your selected filter or search query. Try clearing your search.'
                      : 'आपके चुने हुए फ़िल्टर में कोई केस नहीं है।'}
                  </p>
                  <button
                    onClick={() => { setFilterTab('all'); setSearchQuery(''); }}
                    className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 transition-all cursor-pointer"
                  >
                    {language === 'en' ? 'View All Requests' : 'सभी अनुरोध देखें'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRequests.map((req) => {
                    const isAccepted = req.status === 'accepted';
                    const isRejected = req.status === 'rejected';

                    return (
                      <div
                        key={req.id}
                        id={`request-card-${req.id}`}
                        className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all duration-200 shadow-xs ${
                          isAccepted
                            ? 'border-emerald-200 bg-emerald-50/15 ring-1 ring-emerald-500/20'
                            : isRejected
                            ? 'border-slate-200 opacity-70 bg-slate-50/50'
                            : 'border-sky-150 hover:border-sky-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          
                          {/* Left: Citizen Profile Picture / Avatar Placeholder */}
                          <div className="flex items-start gap-3.5 flex-1">
                            <div className="relative shrink-0">
                              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${req.avatarColor} text-white font-black text-sm flex items-center justify-center shadow-xs border border-white/50`}>
                                {req.initials}
                              </div>
                              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[9px] shadow-2xs">
                                🇮🇳
                              </span>
                            </div>

                            {/* Center: Citizen Name, Case Category tag, and Case Summary description */}
                            <div className="space-y-2 flex-1">
                              
                              {/* Name, Category tag & Metadata */}
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-base font-bold text-slate-900">
                                  {language === 'en' ? req.citizenName : req.citizenNameHi}
                                </h3>

                                {/* Case Category Tag */}
                                <span className={`inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                                  req.categoryType === 'cybercrime' 
                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                    : req.categoryType === 'property'
                                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                    : req.categoryType === 'consumer'
                                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                                    : req.categoryType === 'cheque'
                                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                                    : 'bg-sky-50 text-sky-700 border-sky-200'
                                }`}>
                                  {language === 'en' ? req.category : req.categoryHi}
                                </span>

                                {/* Urgency Tag */}
                                {req.urgency === 'High' && (
                                  <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                                    Urgent
                                  </span>
                                )}

                                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-400" />
                                  <span>{req.city}</span>
                                </span>

                                <span className="text-[11px] text-slate-400">
                                  • {language === 'en' ? req.timeAgo : req.timeAgoHi}
                                </span>
                              </div>

                              {/* Case Summary Description */}
                              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-150">
                                {language === 'en' ? req.summary : req.summaryHi}
                              </p>

                              {/* Consultation Mode & Attachment Badges */}
                              <div className="flex flex-wrap items-center gap-2 pt-1">
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                                  {req.preferredMode === 'Video Consultation' ? (
                                    <Video className="w-3 h-3 text-sky-600" />
                                  ) : req.preferredMode === 'Phone Call' ? (
                                    <Phone className="w-3 h-3 text-emerald-600" />
                                  ) : (
                                    <FileText className="w-3 h-3 text-amber-600" />
                                  )}
                                  <span>{language === 'en' ? req.preferredMode : req.preferredModeHi}</span>
                                </span>

                                {req.attachments?.map((file, idx) => (
                                  <span key={idx} className="inline-flex items-center gap-1 text-[11px] font-mono text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
                                    <FileText className="w-3 h-3 text-sky-500" />
                                    <span>{file}</span>
                                  </span>
                                ))}
                              </div>

                              {/* Options below the appeal/application details: Show User Profile & View Documents / Evidence */}
                              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 mt-1">
                                <button
                                  id={`btn-show-user-profile-${req.id}`}
                                  onClick={() => onNavigate('advocate/user-profile', { request: req })}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-slate-700 hover:text-sky-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                                >
                                  <User className="w-3.5 h-3.5 text-sky-600" />
                                  <span>{language === 'en' ? 'Show User Profile' : 'उपयोगकर्ता प्रोफ़ाइल देखें'}</span>
                                </button>

                                <button
                                  id={`btn-view-evidence-${req.id}`}
                                  onClick={() => onNavigate('advocate/documents', { request: req })}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-slate-700 hover:text-sky-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                                >
                                  <FileText className="w-3.5 h-3.5 text-sky-600" />
                                  <span>{language === 'en' ? 'View Documents / Evidence' : 'दस्तावेज़ / साक्ष्य देखें'}</span>
                                </button>
                              </div>

                              {/* Accepted Banner */}
                              {isAccepted && (
                                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between gap-2 mt-2 text-xs">
                                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    <span>{language === 'en' ? '✓ Request Accepted • Meeting Slot: Today at 5:00 PM (Video Room Ready)' : '✓ अनुरोध स्वीकृत • परामर्श सत्र निर्धारित (आज सायं 5:00)'}</span>
                                  </div>
                                  <button
                                    onClick={() => handleUndoStatus(req.id)}
                                    className="text-slate-500 hover:text-slate-800 text-[11px] font-semibold underline flex items-center gap-1 cursor-pointer"
                                  >
                                    <Undo2 className="w-3 h-3" />
                                    <span>{language === 'en' ? 'Undo' : 'पूर्ववत करें'}</span>
                                  </button>
                                </div>
                              )}

                              {/* Rejected Banner */}
                              {isRejected && (
                                <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 flex items-center justify-between gap-2 mt-2 text-xs">
                                  <span className="text-rose-700 font-semibold">
                                    {language === 'en' ? '✕ Request Declined • Re-routed to state legal aid advocate pool' : '✕ अनुरोध अस्वीकृत • पूल में वापस भेजा गया'}
                                  </span>
                                  <button
                                    onClick={() => handleUndoStatus(req.id)}
                                    className="text-slate-600 hover:text-slate-900 text-[11px] font-bold underline flex items-center gap-1 cursor-pointer"
                                  >
                                    <Undo2 className="w-3 h-3" />
                                    <span>{language === 'en' ? 'Re-open' : 'पुनः खोलें'}</span>
                                  </button>
                                </div>
                              )}

                            </div>
                          </div>

                          {/* Right: Two Action Buttons (Accept - Solid Blue & Reject - Outline Red/Slate) */}
                          <div className="flex md:flex-col items-center justify-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                            
                            {req.status === 'pending' ? (
                              <>
                                {/* Accept Button: Solid Blue */}
                                <button
                                  id={`accept-btn-${req.id}`}
                                  onClick={() => handleAcceptRequest(req.id)}
                                  className="flex-1 md:flex-none w-full md:w-32 py-2 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
                                >
                                  <Check className="w-4 h-4 stroke-[2.5]" />
                                  <span>{language === 'en' ? 'Accept' : 'स्वीकार करें'}</span>
                                </button>

                                {/* Reject Button: Outline Red/Slate */}
                                <button
                                  id={`reject-btn-${req.id}`}
                                  onClick={() => handleRejectRequest(req.id)}
                                  className="flex-1 md:flex-none w-full md:w-32 py-2 px-4 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 hover:border-rose-300 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                                >
                                  <X className="w-4 h-4" />
                                  <span>{language === 'en' ? 'Reject' : 'अस्वीकार'}</span>
                                </button>
                              </>
                            ) : isAccepted ? (
                              <div className="flex md:flex-col items-center gap-2 w-full md:w-32">
                                <button
                                  onClick={() => alert(language === 'en' ? `Opening video consultation room for ${req.citizenName}...` : `परामर्श कक्ष खोला जा रहा है...`)}
                                  className="flex-1 md:flex-none w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-95 cursor-pointer"
                                >
                                  <Video className="w-3.5 h-3.5" />
                                  <span>{language === 'en' ? 'Join Video' : 'कॉल शुरू करें'}</span>
                                </button>
                                <button
                                  onClick={() => alert(language === 'en' ? `Viewing legal brief & uploaded proofs for ${req.citizenName}` : `दस्तावेज़ देखे जा रहे हैं`)}
                                  className="flex-1 md:flex-none w-full py-1.5 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <Eye className="w-3 h-3 text-slate-500" />
                                  <span>{language === 'en' ? 'Brief' : 'विवरण'}</span>
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleUndoStatus(req.id)}
                                className="w-full md:w-32 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                              >
                                <Undo2 className="w-3.5 h-3.5 text-slate-500" />
                                <span>{language === 'en' ? 'Undo' : 'पूर्ववत'}</span>
                              </button>
                            )}

                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>

            {/* Right Column: Advocate Legal Tools & Scheduled Hearings */}
            <div className="space-y-6">
              
              {/* Upcoming Scheduled Consultations Widget */}
              <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-sky-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      {language === 'en' ? "Today's Consultations" : 'आज के परामर्श सत्र'}
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full border border-sky-200">
                    2 Scheduled
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/90 flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-slate-900">Rajesh Kumar (Cyber Fraud)</p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-sky-600" />
                        <span>Today • 4:30 PM (30 min Video)</span>
                      </p>
                    </div>
                    <button
                      onClick={() => alert(language === 'en' ? 'Starting video session room.' : 'सत्र प्रारंभ हो रहा है।')}
                      className="px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Video className="w-3 h-3" />
                      <span>Join</span>
                    </button>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/90 flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-slate-900">Ananya Verma (Tenant Notice)</p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-sky-600" />
                        <span>Tomorrow • 11:00 AM (Phone)</span>
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Confirmed
                    </span>
                  </div>
                </div>
              </div>

              {/* Bharatiya Nyaya Sanhita (BNS) Transition Quick Lookup Widget */}
              <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-sky-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    {language === 'en' ? 'IPC ↔ BNS Quick Transition' : 'IPC ↔ BNS त्वरित धारा रूपांतरण'}
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  {language === 'en'
                    ? 'Search old IPC criminal sections to view corresponding Bharatiya Nyaya Sanhita 2023 provisions.'
                    : 'आईपीसी धाराओं को नए BNS 2023 प्रावधानों में तुरंत खोजें।'}
                </p>

                <div className="relative">
                  <input
                    type="text"
                    value={bnsQuery}
                    onChange={(e) => setBnsQuery(e.target.value)}
                    placeholder="e.g. 420 (Cheating) or 302 (Murder)"
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                </div>

                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {filteredBNS.slice(0, 3).map((item, i) => (
                    <div key={i} className="p-2.5 bg-sky-50/70 rounded-xl border border-sky-150 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-slate-800">IPC Sec {item.ipc}</span>
                        <span className="text-sky-700 font-mono">→ BNS Sec {item.bns}</span>
                      </div>
                      <p className="text-[11px] text-slate-600">{item.bnsTitle}: {item.description}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setActiveView('bns')}
                  className="w-full text-center text-xs font-bold text-sky-700 hover:text-sky-800 pt-1 cursor-pointer"
                >
                  {language === 'en' ? 'View Full BNS ↔ IPC Matrix →' : 'पूर्ण BNS रूपांतरण तालिका देखें →'}
                </button>
              </div>

              {/* AI Drafting & Legal Research Launcher */}
              <div className="bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl p-5 text-white border border-slate-800 shadow-md space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">
                    {language === 'en' ? 'AI Legal Drafter & Research' : 'AI कानूनी प्रारूपक व रिसर्च'}
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {language === 'en'
                    ? 'Generate standard Section 138 demand notices, consumer complaints, and legal citations in seconds.'
                    : 'नागरिक विवादों हेतु कानूनी नोटिस व शिकायत प्रारूप सेकंडों में तैयार करें।'}
                </p>
                <button
                  onClick={() => {
                    setActiveView('chat');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>{language === 'en' ? 'Launch AI Drafter' : 'AI ड्राफ्टर शुरू करें'}</span>
                </button>
              </div>

              {/* Judicial Portals Links */}
              <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-xs space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {language === 'en' ? 'Official Judicial Portals' : 'आधिकारिक न्यायिक पोर्टल'}
                </h3>
                <div className="space-y-1.5 text-xs">
                  <a
                    href="https://ecourts.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-700 border border-slate-200/70 transition-colors"
                  >
                    <span>eCourts Services Portal</span>
                    <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
                  </a>
                  <a
                    href="https://main.sci.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-700 border border-slate-200/70 transition-colors"
                  >
                    <span>Supreme Court of India (e-Filing)</span>
                    <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
                  </a>
                  <a
                    href="https://nalsa.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-700 border border-slate-200/70 transition-colors"
                  >
                    <span>NALSA Legal Services Authority</span>
                    <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
                  </a>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================
            VIEW 2: RECORD HISTORY
           ======================================================== */}
        {activeView === 'history' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  {language === 'en' ? 'Advocate Consultation & Case Record History' : 'अधिवक्ता परामर्श एवं केस रिकॉर्ड इतिहास'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {language === 'en'
                    ? 'Comprehensive log of accepted consultations, client conferences, and completed legal opinions.'
                    : 'स्वीकृत परामर्श, क्लाइंट ब्रीफ और पूर्ण विधिक राय का विस्तृत विवरण।'}
                </p>
              </div>

              <button
                onClick={() => setActiveView('feed')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 transition-all cursor-pointer self-start sm:self-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{language === 'en' ? 'Back to Requests Feed' : 'अनुरोध फ़ीड पर वापस जाएं'}</span>
              </button>
            </div>

            {/* Records Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                    <th className="p-3.5">Citizen Name</th>
                    <th className="p-3.5">Matter Category</th>
                    <th className="p-3.5">Location</th>
                    <th className="p-3.5">Mode</th>
                    <th className="p-3.5">Scheduled Slot</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.filter(r => r.status === 'accepted').length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        {language === 'en' ? 'No accepted consultation records yet. Accept incoming requests from the main feed.' : 'वर्तमान में कोई स्वीकृत परामर्श रिकॉर्ड नहीं है।'}
                      </td>
                    </tr>
                  ) : (
                    requests.filter(r => r.status === 'accepted').map(item => (
                      <tr key={item.id} className="hover:bg-sky-50/40 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${item.avatarColor} text-white font-bold text-[10px] flex items-center justify-center`}>
                            {item.initials}
                          </div>
                          <span>{item.citizenName}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                            {item.category}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-600">{item.city}</td>
                        <td className="p-3.5 font-medium text-sky-700">{item.preferredMode}</td>
                        <td className="p-3.5 font-mono text-slate-700">{item.scheduledTime || 'Today, 5:00 PM'}</td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                            Active
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => alert(language === 'en' ? `Opening case documents for ${item.citizenName}` : 'दस्तावेज़ देखे जा रहे हैं')}
                            className="px-3 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold cursor-pointer"
                          >
                            {language === 'en' ? 'View Brief' : 'विवरण देखें'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW 3: IPC / BNS REFERENCE MATRIX
           ======================================================== */}
        {activeView === 'bns' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-sky-600" />
                  <h2 className="text-xl font-extrabold text-slate-900">
                    {language === 'en' ? 'Indian Penal Code (IPC 1860) ↔ Bharatiya Nyaya Sanhita (BNS 2023)' : 'IPC 1860 ↔ BNS 2023 तुलनात्मक संदर्भ'}
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {language === 'en'
                    ? 'Cross-reference statutory provisions between legacy IPC and newly enacted criminal statutes effective July 1, 2024.'
                    : 'आईपीसी व नई भारतीय न्याय संहिता 2023 की धाराओं का तुलनात्मक चार्ट।'}
                </p>
              </div>

              <div className="relative min-w-[240px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={bnsQuery}
                  onChange={(e) => setBnsQuery(e.target.value)}
                  placeholder={language === 'en' ? 'Filter by section or topic...' : 'धारा अथवा विषय द्वारा खोजें...'}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBNS.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2 hover:border-sky-300 transition-colors">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="font-bold text-slate-800 text-sm">
                      IPC Sec <span className="font-mono text-rose-700 font-extrabold">{item.ipc}</span>
                    </div>
                    <div className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200 font-mono">
                      BNS Sec {item.bns}
                    </div>
                  </div>
                  <p className="text-xs font-bold text-slate-900">{item.bnsTitle}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW 4: AI ASSISTANT (CHAT TO AI)
           ======================================================== */}
        {activeView === 'chat' && (
          <div className="animate-in fade-in duration-200">
            <AiAssistantPage
              user={user}
              language={language}
              onNavigate={onNavigate}
            />
          </div>
        )}

      </main>

      {/* ========================================================
          MANAGE PROFILE MODAL (Triggered from Avatar Dropdown)
         ======================================================== */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-sky-100 shadow-2xl space-y-5 relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {language === 'en' ? 'Manage Advocate Profile' : 'अधिवक्ता प्रोफ़ाइल प्रबंधन'}
                  </h3>
                  <p className="text-xs text-slate-500">{language === 'en' ? 'Update your credentials and verified practice info' : 'पंजीकरण व अभ्यास विवरण अपडेट करें'}</p>
                </div>
              </div>

              <button
                onClick={() => setProfileModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {saveToast && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{saveToast}</span>
              </div>
            )}

            {saveError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{saveError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs max-h-[75vh] overflow-y-auto pr-1">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'en' ? 'Full Advocate Name' : 'अधिवक्ता का पूरा नाम'}
                </label>
                <input
                  id="adv-profile-name"
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'en' ? 'Email Address' : 'ईमेल पता'}
                  </label>
                  <input
                    id="adv-profile-email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'en' ? 'Phone / Mobile' : 'फ़ोन / मोबाइल'}
                  </label>
                  <input
                    id="adv-profile-phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'en' ? 'Bar Enrollment No.' : 'बार पंजीकरण संख्या'}
                  </label>
                  <input
                    id="adv-profile-bar-id"
                    type="text"
                    value={profileData.barEnrollment}
                    onChange={(e) => setProfileData({ ...profileData, barEnrollment: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'en' ? 'State Bar Council' : 'राज्य बार काउंसिल'}
                  </label>
                  <input
                    id="adv-profile-bar-council"
                    type="text"
                    value={profileData.stateBarCouncil}
                    onChange={(e) => setProfileData({ ...profileData, stateBarCouncil: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'en' ? 'City / Practice Location' : 'शहर / स्थान'}
                  </label>
                  <input
                    id="adv-profile-city"
                    type="text"
                    value={profileData.city}
                    onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                    placeholder="e.g. New Delhi"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'en' ? 'State' : 'राज्य'}
                  </label>
                  <input
                    id="adv-profile-state"
                    type="text"
                    value={profileData.state}
                    onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                    placeholder="e.g. Delhi"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'en' ? 'Consultation Fee (₹ INR)' : 'परामर्श शुल्क (₹)'}
                  </label>
                  <input
                    id="adv-profile-fee"
                    type="number"
                    min="0"
                    step="50"
                    value={profileData.consultationFee}
                    onChange={(e) => setProfileData({ ...profileData, consultationFee: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'en' ? 'Consultation Duration' : 'परामर्श अवधि'}
                  </label>
                  <select
                    id="adv-profile-duration"
                    value={profileData.consultationDuration}
                    onChange={(e) => setProfileData({ ...profileData, consultationDuration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:ring-2 focus:ring-sky-500/20"
                  >
                    <option value="15 mins">15 mins</option>
                    <option value="30 mins">30 mins</option>
                    <option value="45 mins">45 mins</option>
                    <option value="60 mins">60 mins</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'en' ? 'Experience' : 'अनुभव'}
                  </label>
                  <input
                    id="adv-profile-experience"
                    type="text"
                    value={profileData.experience}
                    onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'en' ? 'Courts of Practice' : 'अभ्यास न्यायालय'}
                  </label>
                  <input
                    id="adv-profile-courts"
                    type="text"
                    value={profileData.courts}
                    onChange={(e) => setProfileData({ ...profileData, courts: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'en' ? 'Languages' : 'भाषाएं'}
                </label>
                <input
                  id="adv-profile-languages"
                  type="text"
                  value={profileData.languages}
                  onChange={(e) => setProfileData({ ...profileData, languages: e.target.value })}
                  placeholder="e.g. English, Hindi"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  {language === 'en' ? 'Cancel' : 'रद्द करें'}
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white font-bold cursor-pointer shadow-xs transition-opacity"
                >
                  {saveLoading 
                    ? (language === 'en' ? 'Saving...' : 'सहेज रहे हैं...') 
                    : (language === 'en' ? 'Save Changes' : 'सहेजें')}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-5 text-center text-xs text-slate-500 border-t border-sky-100 bg-white/70 mt-12">
        <p>© {new Date().getFullYear()} Nyaay Sarthi. State Bar Council Registered Advocate Network. All rights reserved.</p>
      </footer>

    </div>
  );
}
