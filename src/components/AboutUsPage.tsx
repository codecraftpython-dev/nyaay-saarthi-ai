import React from 'react';
import { 
  ArrowLeft, 
  Globe, 
  Eye, 
  Target, 
  Scale, 
  Languages, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  Lock, 
  CheckCircle2, 
  FileText,
  UserCheck,
  ChevronRight,
  Shield,
  Layers
} from 'lucide-react';
import { motion } from 'motion/react';
import { Language, FooterLink } from '../types';
import { Footer } from './Footer';
import { AnimatedGlassBackground } from './AnimatedGlassBackground';
import logoImg from '../assets/images/nyaay_sarathi_logo_1787153284213.jpg';

interface AboutUsPageProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onBackToHome: () => void;
  onActionClick: (action: string, title?: string, linkData?: FooterLink) => void;
}

export function AboutUsPage({
  language,
  onLanguageChange,
  onBackToHome,
  onActionClick,
}: AboutUsPageProps) {
  // Translations dictionary for the About Us page
  const content = {
    backToHome: {
      en: 'Back to Home',
      hi: 'होम पर वापस जाएं',
    },
    heroHeading: {
      en: 'What is Nyaay सारथी?',
      hi: 'न्याय सारथी क्या है?',
    },
    heroHeadline: {
      en: 'Bridging the Gap Between Citizens and Digital Justice.',
      hi: 'नागरिकों और डिजिटल न्याय के बीच की दूरी को पाटना।',
    },
    heroSubHeadline: {
      en: 'An e-governance-inspired legal tech ecosystem engineering radical transparency, universal access, and accountability into the Indian legal system.',
      hi: 'एक ई-गवर्नेस प्रेरित लीगल-टेक इकोसिस्टम, जो भारतीय कानूनी व्यवस्था में अद्वितीय पारदर्शिता, सर्वसुलभ पहुँच और जवाबदेही स्थापित करता है।',
    },
    visionTitle: {
      en: 'Our Vision',
      hi: 'हमारा विजन (दृष्टिकोण)',
    },
    visionText: {
      en: 'To build a digitally empowered India where access to legal recourse is immediate, transparent, and dignified for every citizen, regardless of socio-economic background or legal literacy.',
      hi: 'एक डिजिटल रूप से सशक्त भारत का निर्माण करना जहाँ सामाजिक-आर्थिक पृष्ठभूमि या कानूनी साक्षरता की परवाह किए बिना प्रत्येक नागरिक के लिए कानूनी उपचार की पहुँच त्वरित, पारदर्शी और गरिमापूर्ण हो।',
    },
    visionTag: {
      en: 'Universal Access • Citizen Dignity',
      hi: 'सर्वसुलभ न्याय • नागरिक गरिमा',
    },
    missionTitle: {
      en: 'Our Mission',
      hi: 'हमारा मिशन',
    },
    missionText: {
      en: 'To eliminate systemic friction in the justice journey by bridging plain-language citizen grievances with verified legal advocates through transparent metrics, continuous request routing, and strict data compliance under the DPDP Act. Thereby, making citizens familiar with their rights and turning intimidated citizens into well informed individuals.',
      hi: 'पारदर्शी मेट्रिक्स, निरंतर अनुरोध रूटिंग और DPDP अधिनियम के तहत कड़े डेटा अनुपालन के माध्यम से आम नागरिक की शिकायतों को सत्यापित वकीलों से जोड़कर न्याय प्रक्रिया में आने वाली बाधाओं को समाप्त करना। जिससे नागरिक अपने अधिकारों से भली-भांति परिचित हों और भयभीत नागरिक एक जागरूक व सशक्त व्यक्ति में परिवर्तित हो सकें।',
    },
    missionTag: {
      en: 'Zero Friction • DPDP Compliant • Plain Language',
      hi: 'बाधारहित समाधान • DPDP अनुपालन • सरल भाषा',
    },
    providingHeading: {
      en: 'What We Are Providing',
      hi: 'हम क्या प्रदान कर रहे हैं',
    },
    providingSubHeading: {
      en: 'The Four Architectural Pillars of Digital Justice',
      hi: 'डिजिटल न्याय के चार सुदृढ़ आधार स्तम्भ',
    },
    pillar1Title: {
      en: 'Simple Legal Pricing',
      hi: 'सरल व पारदर्शी कानूनी शुल्क',
    },
    pillar1Desc: {
      en: 'See clear legal fees, verified lawyer profiles, and information about their past case results. No hidden charges.',
      hi: 'स्पष्ट कानूनी फीस, सत्यापित वकील प्रोफाइल और पिछले केस परिणामों की जानकारी देखें। कोई छुपा शुल्क नहीं।',
    },
    pillar1Badge: {
      en: 'Verified Advocates & Upfront Pricing',
      hi: 'सत्यापित वकील व पारदर्शी शुल्क',
    },
    pillar2Title: {
      en: 'Easy-to-Understand Legal Help',
      hi: 'आसान व स्पष्ट कानूनी सहायता',
    },
    pillar2Desc: {
      en: "We turn people's simple complaints into clear legal information and find the right BNS law category before they talk to a lawyer.",
      hi: 'हम नागरिकों की सामान्य शिकायतों को स्पष्ट कानूनी जानकारी में बदलते हैं और वकील से बात करने से पहले सही BNS कानून श्रेणी तय करते हैं।',
    },
    pillar2Badge: {
      en: 'BNS & Statutory Simplification',
      hi: 'BNS व कानूनी धाराओं का सरलीकरण',
    },
    pillar3Title: {
      en: 'No Waiting Without an Update',
      hi: 'बिना जवाब के इंतजार नहीं',
    },
    pillar3Desc: {
      en: 'Every request is sent to the right person within 24 hours, so users are not left waiting without any answer or action.',
      hi: 'प्रत्येक अनुरोध 24 घंटे के भीतर सही व्यक्ति तक पहुँचाया जाता है, ताकि नागरिकों को बिना उत्तर या कार्रवाई के इंतजार न करना पड़े।',
    },
    pillar3Badge: {
      en: 'Mandatory 24h Request Loop',
      hi: '24 घंटे में अनिवार्य कार्यवाही',
    },
    pillar4Title: {
      en: 'Your Data Stays Safe',
      hi: 'आपका डेटा सुरक्षित',
    },
    pillar4Desc: {
      en: 'We protect your personal legal information by controlling who can access it and removing access when it is no longer needed, following the DPDP Act.',
      hi: 'हम DPDP अधिनियम के तहत आपकी व्यक्तिगत कानूनी जानकारी की सुरक्षा करते हैं, एक्सेस नियंत्रित रखते हैं और काम पूरा होने पर एक्सेस हटा देते हैं।',
    },
    pillar4Badge: {
      en: 'DPDP Act Compliance & Security',
      hi: 'DPDP अधिनियम अनुपालन व सुरक्षा',
    },
    architectureFoundation: {
      en: 'FOUNDATION OF DIGITAL JUSTICE ECOSYSTEM',
      hi: 'डिजिटल न्याय इकोसिस्टम की सुदृढ़ आधारशिला',
    },
    chatAiBtn: {
      en: 'Chat with AI Legal Assistant',
      hi: 'AI कानूनी सहायक से बात करें',
    },
    exploreServicesBtn: {
      en: 'Find Verified Advocate',
      hi: 'सत्यापित वकील खोजें',
    },
  };

  const pillars = [
    {
      num: '01',
      roman: 'I',
      subhead: 'TRANSPARENCY',
      title: content.pillar1Title[language],
      desc: content.pillar1Desc[language],
      badge: content.pillar1Badge[language],
      icon: Scale,
      tagColor: 'bg-sky-500/10 text-sky-950 border-sky-300/40',
      accentBorder: 'border-white/80',
      highlightColor: 'from-sky-500 to-blue-600',
    },
    {
      num: '02',
      roman: 'II',
      subhead: 'TRANSLATION',
      title: content.pillar2Title[language],
      desc: content.pillar2Desc[language],
      badge: content.pillar2Badge[language],
      icon: Languages,
      tagColor: 'bg-indigo-500/10 text-indigo-950 border-indigo-300/40',
      accentBorder: 'border-white/80',
      highlightColor: 'from-indigo-500 to-purple-600',
    },
    {
      num: '03',
      roman: 'III',
      subhead: 'OPERATIONAL 24H',
      title: content.pillar3Title[language],
      desc: content.pillar3Desc[language],
      badge: content.pillar3Badge[language],
      icon: Clock,
      tagColor: 'bg-teal-500/10 text-teal-950 border-teal-300/40',
      accentBorder: 'border-white/80',
      highlightColor: 'from-teal-500 to-emerald-600',
    },
    {
      num: '04',
      roman: 'IV',
      subhead: 'DPDP COMPLIANCE',
      title: content.pillar4Title[language],
      desc: content.pillar4Desc[language],
      badge: content.pillar4Badge[language],
      icon: Lock,
      tagColor: 'bg-blue-500/10 text-blue-950 border-blue-300/40',
      accentBorder: 'border-white/80',
      highlightColor: 'from-blue-500 to-sky-600',
    },
  ];

  return (
    <div className="min-h-screen text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-sky-200 selection:text-sky-950 relative">
      <AnimatedGlassBackground />
      
      {/* 1. TOP NAVIGATION FOR ABOUT PAGE */}
      <header className="sticky top-0 z-40 w-full bg-white/65 backdrop-blur-xl border-b border-white/70 shadow-[0_4px_24px_rgba(31,38,135,0.06)] transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 sm:h-20 gap-2">
            
            {/* Top Left: Back to Home */}
            <button
              id="about-back-to-home-btn"
              onClick={onBackToHome}
              className="glass-btn inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-semibold text-slate-800 hover:text-sky-900 bg-white/70 hover:bg-white border border-white/80 shadow-xs transition-all active:scale-97 group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-sky-600 group-hover:-translate-x-0.5 transition-transform" />
              <span>{content.backToHome[language]}</span>
            </button>

            {/* Middle: Subtle Branding Badge */}
            <div 
              onClick={onBackToHome}
              className="cursor-pointer hidden md:flex items-center gap-2 select-none"
            >
              <div className="w-8 h-8 rounded-xl bg-white/90 border border-white/80 p-0.5 shadow-xs overflow-hidden">
                <img 
                  src={logoImg} 
                  alt="Nyaay सारथी Logo" 
                  className="w-full h-full object-cover rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-sm font-bold text-slate-900">
                Nyaay <span className="text-sky-600 font-['Noto_Sans_Devanagari',sans-serif] font-extrabold">सारथी</span>
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-300/40 text-sky-900 font-bold">
                {language === 'en' ? 'About Us' : 'हमारे बारे में'}
              </span>
            </div>

            {/* Top Right: Language Switcher */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-white/60 backdrop-blur-md p-1 rounded-2xl border border-white/80 shadow-xs">
                <button
                  id="about-lang-en-btn"
                  onClick={() => onLanguageChange('en')}
                  className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                    language === 'en'
                      ? 'bg-white/95 text-sky-800 shadow-xs font-bold border border-white/90'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-sky-600" />
                  <span>English</span>
                </button>
                <button
                  id="about-lang-hi-btn"
                  onClick={() => onLanguageChange('hi')}
                  className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                    language === 'hi'
                      ? 'bg-white/95 text-sky-800 shadow-xs font-bold border border-white/90'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>हिंदी</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* 2. MAIN BODY OF ABOUT PAGE */}
      <main className="flex-1 flex flex-col">
        
        {/* HERO SECTION */}
        <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-20 overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            
            {/* Center Logo with Animated Halo Entrance */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-center mb-8"
            >
              <div className="relative group">
                <div className="absolute -inset-3 bg-gradient-to-r from-sky-400/30 to-blue-500/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white/90 backdrop-blur-xl p-2.5 border border-white/90 shadow-[0_12px_40px_rgba(31,38,135,0.15)] flex items-center justify-center overflow-hidden">
                  <img
                    src={logoImg}
                    alt="Nyaay सारथी Logo"
                    className="w-full h-full object-cover rounded-2xl"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-slate-900/90 backdrop-blur-md text-[10px] uppercase tracking-wider font-extrabold text-sky-300 shadow-sm border border-white/20 whitespace-nowrap">
                  Digital Legal Portal
                </div>
              </div>
            </motion.div>

            {/* Staggered Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-white/80 text-sky-900 text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>{language === 'en' ? 'E-Governance Initiative' : 'ई-गवर्नेस कानूनी पहल'}</span>
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif] mb-4">
                {content.heroHeading[language]}
              </h1>
            </motion.div>

            {/* Staggered Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-sky-800 max-w-2xl mx-auto leading-snug mb-5">
                {content.heroHeadline[language]}
              </h2>
            </motion.div>

            {/* Staggered Sub-headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto font-medium">
                {content.heroSubHeadline[language]}
              </p>
            </motion.div>

          </div>
        </section>

        {/* 3. VISION & MISSION SECTION */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              
              {/* OUR VISION */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="glass-panel relative bg-white/60 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/80 shadow-[0_8px_32px_rgba(31,38,135,0.07)] hover:bg-white/80 hover:border-sky-300/70 hover:shadow-[0_14px_40px_rgba(31,38,135,0.12),0_0_20px_rgba(74,144,226,0.2)] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-sky-500/15 backdrop-blur-md text-sky-700 flex items-center justify-center border border-sky-300/40 shadow-xs">
                      <Eye className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-sky-900 bg-white/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/80 shadow-2xs">
                      {content.visionTag[language]}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-3 font-['Plus_Jakarta_Sans',sans-serif] flex items-center gap-2">
                    <span>{content.visionTitle[language]}</span>
                  </h3>

                  <p className="text-slate-700 leading-relaxed text-sm sm:text-base font-medium">
                    {content.visionText[language]}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-sky-100/60 flex items-center gap-2 text-xs text-sky-900 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>{language === 'en' ? 'Equal Justice for Every Indian' : 'प्रत्येक भारतीय के लिए समान न्याय'}</span>
                </div>
              </motion.div>

              {/* OUR MISSION */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="glass-panel relative bg-white/60 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/80 shadow-[0_8px_32px_rgba(31,38,135,0.07)] hover:bg-white/80 hover:border-sky-300/70 hover:shadow-[0_14px_40px_rgba(31,38,135,0.12),0_0_20px_rgba(74,144,226,0.2)] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900/90 text-white flex items-center justify-center shadow-xs border border-white/20">
                      <Target className="w-6 h-6 text-sky-400" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 bg-white/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/80 shadow-2xs">
                      {content.missionTag[language]}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-3 font-['Plus_Jakarta_Sans',sans-serif] flex items-center gap-2">
                    <span>{content.missionTitle[language]}</span>
                  </h3>

                  <p className="text-slate-700 leading-relaxed text-sm sm:text-base font-medium">
                    {content.missionText[language]}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-sky-100/60 flex items-center gap-2 text-xs text-slate-800 font-bold">
                  <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>{language === 'en' ? 'Empowering Citizens with Legal Awareness' : 'जागरूकता द्वारा नागरिकों का सशक्तिकरण'}</span>
                </div>
              </motion.div>

            </div>

          </div>
        </section>

        {/* 4. WHAT WE ARE PROVIDING: FOUR-PILLAR DIGITAL JUSTICE ARCHITECTURE */}
        <section className="py-16 sm:py-24 relative overflow-hidden">
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-white/80 text-sky-900 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
                <Building2 className="w-3.5 h-3.5 text-sky-600" />
                <span>{language === 'en' ? 'Core Architecture' : 'मूल संरचना'}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif] mb-3">
                {content.providingHeading[language]}
              </h2>
              <p className="text-slate-600 text-base sm:text-lg font-medium">
                {content.providingSubHeading[language]}
              </p>
            </motion.div>

            {/* THE FOUR PILLARS ARCHITECTURAL CONTAINER */}
            <div className="relative">
              
              {/* Architectural Top Header Beam */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0.9 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="hidden lg:flex items-center justify-between px-6 py-3 bg-slate-900/90 backdrop-blur-xl rounded-t-3xl border border-white/20 shadow-md text-white mb-2"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
                  <span className="text-xs font-mono tracking-widest uppercase font-bold text-sky-300">
                    Nyaay सारथी Architecture
                  </span>
                </div>
                <div className="flex items-center gap-8 text-[11px] font-mono text-slate-300 tracking-wider">
                  <span>[ I ] TRANSPARENCY</span>
                  <span>[ II ] TRANSLATION</span>
                  <span>[ III ] OPERATIONAL 24H</span>
                  <span>[ IV ] DPDP COMPLIANCE</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-sky-400 font-semibold">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Verified Pillars</span>
                </div>
              </motion.div>

              {/* 4 Pillars Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                
                {pillars.map((pillar, idx) => {
                  const Icon = pillar.icon;
                  return (
                    <motion.div
                      key={pillar.num}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ 
                        duration: 0.6, 
                        delay: idx * 0.15,
                        ease: [0.16, 1, 0.3, 1] 
                      }}
                      className="glass-card relative bg-white/60 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-white/80 shadow-[0_8px_32px_rgba(31,38,135,0.07)] hover:bg-white/80 hover:border-sky-300/70 hover:shadow-[0_14px_40px_rgba(31,38,135,0.12),0_0_20px_rgba(74,144,226,0.25)] transition-all duration-300 flex flex-col justify-between group overflow-hidden"
                    >
                      {/* Top Highlight Line */}
                      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${pillar.highlightColor}`} />

                      <div>
                        {/* Pillar Header & Roman Numeral */}
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-500 group-hover:text-sky-700 transition-colors">
                            {pillar.subhead}
                          </span>
                          <span className="w-7 h-7 rounded-xl bg-white/70 backdrop-blur-md border border-white/80 font-mono font-bold text-xs text-slate-800 flex items-center justify-center group-hover:bg-sky-500/20 group-hover:text-sky-900 group-hover:border-sky-300/60 transition-colors shadow-2xs">
                            {pillar.roman}
                          </span>
                        </div>

                        {/* Pillar Icon */}
                        <div className="w-12 h-12 rounded-2xl bg-sky-500/15 backdrop-blur-md border border-sky-300/40 flex items-center justify-center text-sky-700 mb-5 group-hover:scale-105 group-hover:bg-sky-600 group-hover:text-white transition-all duration-300 shadow-xs">
                          <Icon className="w-6 h-6" />
                        </div>

                        {/* Pillar Title */}
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-sky-800 transition-colors font-['Plus_Jakarta_Sans',sans-serif]">
                          {pillar.title}
                        </h3>

                        {/* Pillar Description */}
                        <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
                          {pillar.desc}
                        </p>
                      </div>

                      {/* Pillar Base Badge & Technical Highlights */}
                      <div className="pt-4 border-t border-sky-100/60">
                        <div className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border ${pillar.tagColor} flex items-center gap-1.5 shadow-2xs`}>
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-sky-600" />
                          <span className="line-clamp-1">{pillar.badge}</span>
                        </div>
                      </div>

                    </motion.div>
                  );
                })}

              </div>

              {/* Architectural Foundation Base */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0.95 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="hidden lg:flex items-center justify-between px-6 py-3.5 bg-slate-900/90 backdrop-blur-xl rounded-b-3xl border border-white/20 text-slate-200 text-xs font-mono mt-2 shadow-sm"
              >
                <div className="flex items-center gap-2 text-sky-400 font-bold">
                  <Layers className="w-4 h-4" />
                  <span>{content.architectureFoundation[language]}</span>
                </div>
                <div className="text-slate-300 font-medium">
                  <span>Radical Transparency • 24h Routing • BNS Simplification • DPDP Act</span>
                </div>
                <div className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>System Active</span>
                </div>
              </motion.div>

            </div>

            {/* Direct Action Callouts on About Page */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-14 p-6 sm:p-8 bg-slate-900/90 backdrop-blur-2xl rounded-3xl text-white shadow-[0_16px_48px_rgba(15,23,42,0.2)] border border-white/20 flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="space-y-1.5 text-center md:text-left">
                <h3 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans',sans-serif]">
                  {language === 'en' ? 'Experience Transparent Indian Legal Guidance' : 'पारदर्शी भारतीय कानूनी सहायता का अनुभव करें'}
                </h3>
                <p className="text-sky-200 text-xs sm:text-sm max-w-xl font-medium">
                  {language === 'en' 
                    ? 'Ask questions to our AI Legal assistant, explore constitutional citizen rights, or book a verified advocate.'
                    : 'हमारे AI सहायक से प्रश्न पूछें, अपने संवैधानिक अधिकारों को समझें अथवा अनुभवी वकील से परामर्श लें।'}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
                <button
                  id="about-chat-ai-cta-btn"
                  onClick={() => onActionClick('chat-ai', language === 'en' ? 'AI Legal Assistant' : 'AI कानूनी सहायक')}
                  className="glass-btn-primary px-4 py-2.5 rounded-2xl text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-sky-200" />
                  <span>{content.chatAiBtn[language]}</span>
                </button>

                <button
                  id="about-book-appointment-cta-btn"
                  onClick={() => onActionClick('book-appointment', language === 'en' ? 'Book an Advocate Appointment' : 'वकील अपॉइंटमेंट बुक करें')}
                  className="glass-btn-sky px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm border border-white/30 shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4 text-sky-300" />
                  <span>{content.exploreServicesBtn[language]}</span>
                </button>
              </div>
            </motion.div>

          </div>
        </section>

      </main>

      {/* 5. FOOTER */}
      <Footer
        language={language}
        onActionClick={onActionClick}
      />

    </div>
  );
}
