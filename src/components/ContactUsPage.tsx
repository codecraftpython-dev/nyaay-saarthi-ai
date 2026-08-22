import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Globe, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  User, 
  Sparkles, 
  Users, 
  Briefcase, 
  Scale, 
  MessageSquare, 
  Clock,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { motion } from 'motion/react';
import { Language, FooterLink } from '../types';
import { Footer } from './Footer';
import { AnimatedGlassBackground } from './AnimatedGlassBackground';
import logoImg from '../assets/images/nyaay_sarathi_logo_1787153284213.jpg';

interface ContactUsPageProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onBackToHome: () => void;
  onActionClick: (action: string, title?: string, linkData?: FooterLink) => void;
}

export function ContactUsPage({
  language,
  onLanguageChange,
  onBackToHome,
  onActionClick,
}: ContactUsPageProps) {
  // Unified Contact Form State
  const [formData, setFormData] = useState({
    userType: 'Citizen',
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setFormData({
      userType: 'Citizen',
      fullName: '',
      email: '',
      subject: '',
      message: '',
    });
    setFormSubmitted(false);
  };

  // Translations dictionary
  const t = {
    backToHome: {
      en: 'Back to Home',
      hi: 'होम पर वापस जाएं',
    },
    pageBadge: {
      en: 'Unified Support Channel',
      hi: 'एकीकृत सहायता चैनल',
    },
    pageHeading: {
      en: 'Contact Us — Citizen & Advocate Support',
      hi: 'संपर्क करें — नागरिक एवं अधिवक्ता सहायता',
    },
    pageSubtitle: {
      en: 'A single, unified contact desk for both Citizens and Advocates across India.',
      hi: 'पूरे भारत के नागरिकों और अधिवक्ताओं दोनों के लिए एक साझा, एकीकृत संपर्क डेस्क।',
    },
    unifiedNoteHeading: {
      en: 'Unified Assistance Desk',
      hi: 'साझा सहायता डेस्क',
    },
    unifiedNoteText: {
      en: 'Both citizens and advocates can use the same contact channels below for all legal queries, platform assistance, onboarding, and feedback.',
      hi: 'नागरिक और अधिवक्ता दोनों सभी कानूनी प्रश्नों, प्लेटफॉर्म सहायता, ऑनबोर्डिंग एवं प्रतिक्रिया के लिए नीचे दिए गए साझा संपर्क माध्यमों का उपयोग कर सकते हैं।',
    },
    userTypeLabel: {
      en: 'I am contacting as',
      hi: 'मैं संपर्क कर रहा हूँ بطور',
    },
    userTypeCitizen: {
      en: 'Citizen / Litigant',
      hi: 'नागरिक / वादकारी',
    },
    userTypeAdvocate: {
      en: 'Advocate / Legal Professional',
      hi: 'अधिवक्ता / विधिक पेशेवर',
    },
    directChannelsHeading: {
      en: 'Direct Contact Channels',
      hi: 'सीधे संपर्क माध्यम',
    },
    directChannelsSubtext: {
      en: 'Connect directly with our unified support team via email or toll-free helpline.',
      hi: 'ईमेल अथवा टोल-फ्री हेल्पलाइन के माध्यम से सीधे हमारी एकीकृत टीम से जुड़ें।',
    },
    emailLabel: {
      en: 'Unified Support Email',
      hi: 'एकीकृत सहायता ईमेल',
    },
    emailAddress: 'support@nyasaathi.gov.in',
    emailDesc: {
      en: 'Direct email channel for both citizens and advocates.',
      hi: 'नागरिकों और अधिवक्ताओं दोनों के लिए प्रत्यक्ष ईमेल चैनल।',
    },
    phoneLabel: {
      en: 'Toll-Free Helpline',
      hi: 'टोल-फ्री हेल्पलाइन',
    },
    phoneNumber: '1800-XXX-Justice',
    phoneDesc: {
      en: 'Toll-free telephone assistance for citizens & advocate support.',
      hi: 'नागरिकों एवं अधिवक्ताओं के लिए निःशुल्क दूरभाष सहायता।',
    },
    protocolTitle: {
      en: '24-Hour Response Protocol',
      hi: '24-घंटे उत्तर प्रोटोकॉल',
    },
    protocolDesc: {
      en: 'All citizen grievances and advocate inquiries receive first routing within 24 hours.',
      hi: 'सभी नागरिक शिकायतों एवं अधिवक्ता पूछताछ पर 24 घंटे के भीतर प्रारंभिक कार्यवाही की जाती है।',
    },
    whoWeServeTitle: {
      en: 'Who We Support',
      hi: 'हम किसकी सहायता करते हैं',
    },
    citizenScope: {
      en: 'Citizen Support: Guidance on filing disputes, legal notices, appointments, and scheme eligibility.',
      hi: 'नागरिक सहायता: विवाद दर्ज करने, नोटिस ड्राफ्ट, अपॉइंटमेंट और सरकारी योजनाओं की पात्रता पर मार्गदर्शन।',
    },
    advocateScope: {
      en: 'Advocate Support: Verification assistance, Bar Council credentials, case management desk.',
      hi: 'अधिवक्ता सहायता: सत्यापन सहायता, बार काउंसिल साख, एवं केस प्रबंधन डेस्क।',
    },
    formHeading: {
      en: 'Send Us a Message',
      hi: 'हमें संदेश भेजें',
    },
    formSubtext: {
      en: 'Fill out this unified form and our support desk will respond via email.',
      hi: 'यह साझा फॉर्म भरें और हमारी सपोर्ट टीम ईमेल द्वारा आपसे संपर्क करेगी।',
    },
    fullNameLabel: {
      en: 'Full Name',
      hi: 'पूरा नाम',
    },
    fullNamePlaceholder: {
      en: 'Enter your full name',
      hi: 'अपना पूरा नाम दर्ज करें',
    },
    emailInputLabel: {
      en: 'Email Address',
      hi: 'ईमेल पता',
    },
    emailPlaceholder: {
      en: 'name@example.com',
      hi: 'name@example.com',
    },
    subjectLabel: {
      en: 'Subject / Legal Topic',
      hi: 'विषय / कानूनी मामला',
    },
    subjectPlaceholder: {
      en: 'Brief subject of your query',
      hi: 'अपनी पूछताछ का संक्षिप्त विषय लिखें',
    },
    messageLabel: {
      en: 'Message / Query Details',
      hi: 'संदेश / विस्तृत विवरण',
    },
    messagePlaceholder: {
      en: 'Describe your issue or question in detail...',
      hi: 'अपनी समस्या या प्रश्न का विस्तार से विवरण दें...',
    },
    sendBtn: {
      en: 'Send Message',
      hi: 'संदेश भेजें',
    },
    sendingBtn: {
      en: 'Sending...',
      hi: 'भेज रहे हैं...',
    },
    successTitle: {
      en: 'Message Received Successfully!',
      hi: 'संदेश सफलतापूर्वक प्राप्त हुआ!',
    },
    successDesc: {
      en: 'Thank you for reaching out. Our support team will review your message and reply to your email within 24 business hours.',
      hi: 'संपर्क करने के लिए धन्यवाद। हमारी सहायता टीम आपके संदेश की समीक्षा करेगी और २४ कार्य घंटों के भीतर आपके ईमेल पर उत्तर देगी।',
    },
    sendAnotherBtn: {
      en: 'Send Another Message',
      hi: 'दूसरा संदेश भेजें',
    },
    legalResourcesBadge: {
      en: 'Official Statutory Gateways',
      hi: 'आधिकारिक वैधानिक प्रवेश द्वार',
    },
    legalResourcesHeading: {
      en: 'Important Legal & Government Resources',
      hi: 'महत्वपूर्ण विधिक एवं सरकारी संसाधन',
    },
    legalResourcesSubtext: {
      en: 'Direct access to official Government of India judicial and legislative portals.',
      hi: 'भारत सरकार के आधिकारिक न्यायिक एवं विधायी पोर्टल्स तक सीधी पहुँच।',
    },
  };

  const officialLegalResources = [
    {
      id: 'constitution-of-india',
      title: {
        en: 'Constitution of India',
        hi: 'Constitution of India (भारत का संविधान)',
      },
      description: {
        en: 'Official Constitution of India resources provided by the Legislative Department, Ministry of Law and Justice.',
        hi: 'विधायी विभाग, विधि एवं न्याय मंत्रालय द्वारा उपलब्ध कराए गए भारत के संविधान के आधिकारिक संसाधन।',
      },
      url: 'https://www.legislative.gov.in/constitution-of-india',
      linkLabel: {
        en: 'Visit Constitution of India →',
        hi: 'Constitution of India पोर्टल पर जाएं →',
      },
    },
    {
      id: 'ministry-of-law-justice',
      title: {
        en: 'Ministry of Law and Justice',
        hi: 'Ministry of Law and Justice (विधि एवं न्याय मंत्रालय)',
      },
      description: {
        en: 'Official website of the Government of India’s Ministry of Law and Justice.',
        hi: 'भारत सरकार के विधि एवं न्याय मंत्रालय की आधिकारिक वेबसाइट।',
      },
      url: 'https://lawmin.gov.in/',
      linkLabel: {
        en: 'Visit Ministry of Law and Justice →',
        hi: 'Ministry of Law & Justice पोर्टल पर जाएं →',
      },
    },
    {
      id: 'supreme-court-of-india',
      title: {
        en: 'Supreme Court of India',
        hi: 'Supreme Court of India (भारत का सर्वोच्च न्यायालय)',
      },
      description: {
        en: 'Official website of the Supreme Court of India.',
        hi: 'भारत के सर्वोच्च न्यायालय की आधिकारिक वेबसाइट।',
      },
      url: 'https://www.sci.gov.in/',
      linkLabel: {
        en: 'Visit Supreme Court of India →',
        hi: 'Supreme Court पोर्टल पर जाएं →',
      },
    },
    {
      id: 'national-portal-constitution',
      title: {
        en: 'National Portal of India — Constitution of India',
        hi: 'National Portal of India — भारत का संविधान',
      },
      description: {
        en: 'Official Government of India information about the Constitution of India.',
        hi: 'भारत के संविधान के संबंध में भारत सरकार की आधिकारिक जानकारी।',
      },
      url: 'https://www.india.gov.in/my-government/constitution-of-india',
      linkLabel: {
        en: 'Visit National Portal of India →',
        hi: 'National Portal of India पर जाएं →',
      },
    },
  ];

  return (
    <div className="min-h-screen text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-sky-200 selection:text-sky-950 relative">
      <AnimatedGlassBackground />
      
      {/* 1. TOP NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 w-full bg-white/65 backdrop-blur-xl border-b border-white/70 shadow-[0_4px_24px_rgba(31,38,135,0.06)] transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 sm:h-20 gap-2">
            
            {/* Top Left: Back to Home + Logo */}
            <div className="flex items-center gap-3">
              <button
                id="contact-back-to-home-btn"
                onClick={onBackToHome}
                className="glass-btn inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-semibold text-slate-800 hover:text-sky-900 bg-white/70 hover:bg-white border border-white/80 shadow-xs transition-all active:scale-97 group cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-sky-600 group-hover:-translate-x-0.5 transition-transform" />
                <span>{t.backToHome[language]}</span>
              </button>

              <div 
                onClick={onBackToHome}
                className="cursor-pointer hidden sm:flex items-center gap-2 select-none pl-2 border-l border-white/80"
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
                  {language === 'en' ? 'Support' : 'सहायता'}
                </span>
              </div>
            </div>

            {/* Top Right: Language Switcher */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-white/60 backdrop-blur-md p-1 rounded-2xl border border-white/80 shadow-xs">
                <button
                  id="contact-lang-en-btn"
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
                  id="contact-lang-hi-btn"
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

      {/* 2. MAIN BODY */}
      <main className="flex-1 flex flex-col">
        
        {/* HERO SECTION */}
        <section className="pt-10 pb-8 sm:pt-14 sm:pb-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-3"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/70 backdrop-blur-md border border-white/80 text-sky-900 text-xs font-bold uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>{t.pageBadge[language]}</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                {t.pageHeading[language]}
              </h1>
              
              <p className="text-slate-700 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
                {t.pageSubtitle[language]}
              </p>

              {/* Stakeholder Badges Pill */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/70 backdrop-blur-md border border-white/80 text-slate-800 text-xs font-semibold shadow-2xs">
                  <User className="w-3.5 h-3.5 text-sky-600" />
                  <span>Citizens & Litigants</span>
                </span>
                <span className="text-slate-400 font-bold">•</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/70 backdrop-blur-md border border-white/80 text-slate-800 text-xs font-semibold shadow-2xs">
                  <Briefcase className="w-3.5 h-3.5 text-sky-600" />
                  <span>Advocates & Legal Professionals</span>
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3. SINGLE UNIFIED CONTACT SECTION */}
        <section className="py-10 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Unified Explanatory Note */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-4 sm:p-5 glass-panel bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl mb-8 flex items-start sm:items-center gap-3.5 shadow-xs"
            >
              <div className="w-10 h-10 rounded-2xl bg-sky-500/15 backdrop-blur-md border border-sky-300/40 text-sky-700 flex items-center justify-center shrink-0 shadow-2xs">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-xs sm:text-sm text-slate-800 space-y-0.5 font-medium">
                <p className="font-bold text-sky-950">
                  {t.unifiedNoteHeading[language]}
                </p>
                <p className="text-slate-600 leading-relaxed">
                  {t.unifiedNoteText[language]}
                </p>
              </div>
            </motion.div>

            {/* Main Unified Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN (5 cols) */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="lg:col-span-5 space-y-5"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                    {t.directChannelsHeading[language]}
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm mt-1 font-medium">
                    {t.directChannelsSubtext[language]}
                  </p>
                </div>

                {/* Direct Channel Cards */}
                <div className="space-y-3.5">
                  
                  {/* Email Channel Card */}
                  <div className="glass-card p-4 sm:p-5 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-[0_8px_32px_rgba(31,38,135,0.06)] hover:bg-white/80 hover:border-sky-300/70 transition-all duration-300 group">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-sky-500/15 backdrop-blur-md text-sky-700 flex items-center justify-center shrink-0 border border-sky-300/40 group-hover:scale-105 transition-transform shadow-2xs">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-sky-900">
                          {t.emailLabel[language]}
                        </span>
                        <div>
                          <a 
                            href={`mailto:${t.emailAddress}`}
                            className="font-mono text-sm sm:text-base font-bold text-sky-700 hover:text-sky-900 hover:underline break-all"
                          >
                            {t.emailAddress}
                          </a>
                        </div>
                        <p className="text-xs text-slate-500 font-medium pt-0.5">
                          {t.emailDesc[language]}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Phone Helpline Card */}
                  <div className="glass-card p-4 sm:p-5 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-[0_8px_32px_rgba(31,38,135,0.06)] hover:bg-white/80 hover:border-sky-300/70 transition-all duration-300 group">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-sky-500/15 backdrop-blur-md text-sky-700 flex items-center justify-center shrink-0 border border-sky-300/40 group-hover:scale-105 transition-transform shadow-2xs">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-sky-900">
                          {t.phoneLabel[language]}
                        </span>
                        <div>
                          <span className="font-mono text-sm sm:text-base font-bold text-slate-900">
                            {t.phoneNumber}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium pt-0.5">
                          {t.phoneDesc[language]}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Turnaround & Service Scope Card */}
                  <div className="glass-card p-5 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-[0_8px_32px_rgba(31,38,135,0.06)] space-y-4">
                    
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                      <Scale className="w-4 h-4 text-sky-600" />
                      <span>{t.whoWeServeTitle[language]}</span>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-700 font-medium">
                      <div className="flex items-start gap-2 p-2.5 rounded-2xl bg-white/50 backdrop-blur-md border border-white/70">
                        <User className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                        <span>{t.citizenScope[language]}</span>
                      </div>
                      <div className="flex items-start gap-2 p-2.5 rounded-2xl bg-white/50 backdrop-blur-md border border-white/70">
                        <Briefcase className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                        <span>{t.advocateScope[language]}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-sky-100/60 flex items-center gap-2 text-[11px] text-slate-600 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-sky-600" />
                      <span>{t.protocolDesc[language]}</span>
                    </div>

                  </div>

                </div>

              </motion.div>

              {/* RIGHT COLUMN (7 cols): Single Unified Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-7"
              >
                <div className="glass-panel bg-white/65 backdrop-blur-2xl rounded-3xl border border-white/85 shadow-[0_12px_40px_rgba(31,38,135,0.08)] p-6 sm:p-8">
                  
                  {/* Form Header */}
                  <div className="mb-6 pb-4 border-b border-sky-100/60">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-sky-600" />
                      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                        {t.formHeading[language]}
                      </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                      {t.formSubtext[language]}
                    </p>
                  </div>

                  {formSubmitted ? (
                    /* Success State */
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-6 sm:p-8 bg-emerald-500/10 backdrop-blur-md border border-emerald-300/40 rounded-3xl text-center space-y-4 shadow-xs"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-emerald-950">
                          {t.successTitle[language]}
                        </h3>
                        <p className="text-xs sm:text-sm text-emerald-900 font-medium mt-1 max-w-md mx-auto">
                          {t.successDesc[language]}
                        </p>
                      </div>
                      <div className="pt-2">
                        <button
                          onClick={handleReset}
                          className="glass-btn-primary px-5 py-2.5 rounded-2xl text-white font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95 cursor-pointer"
                        >
                          {t.sendAnotherBtn[language]}
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    /* Unified Form */
                    <form onSubmit={handleSubmit} className="space-y-4">
                      
                      {/* User Role Selector */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          {t.userTypeLabel[language]} <span className="text-rose-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, userType: 'Citizen' })}
                            className={`p-2.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border transition-all cursor-pointer active:scale-97 ${
                              formData.userType === 'Citizen'
                                ? 'bg-sky-500/20 border-sky-400 text-sky-950 font-bold shadow-xs'
                                : 'bg-white/50 border-white/80 text-slate-700 hover:bg-white/80'
                            }`}
                          >
                            <User className="w-4 h-4 text-sky-600" />
                            <span>{t.userTypeCitizen[language]}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, userType: 'Advocate' })}
                            className={`p-2.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border transition-all cursor-pointer active:scale-97 ${
                              formData.userType === 'Advocate'
                                ? 'bg-sky-500/20 border-sky-400 text-sky-950 font-bold shadow-xs'
                                : 'bg-white/50 border-white/80 text-slate-700 hover:bg-white/80'
                            }`}
                          >
                            <Briefcase className="w-4 h-4 text-sky-600" />
                            <span>{t.userTypeAdvocate[language]}</span>
                          </button>
                        </div>
                      </div>

                      {/* Full Name & Email row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                            {t.fullNameLabel[language]} <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            placeholder={t.fullNamePlaceholder[language]}
                            className="w-full px-3.5 py-2.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 text-slate-900 text-sm focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-400 transition-all placeholder:text-slate-400 font-medium shadow-inner"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                            {t.emailInputLabel[language]} <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder={t.emailPlaceholder[language]}
                            className="w-full px-3.5 py-2.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 text-slate-900 text-sm focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-400 transition-all placeholder:text-slate-400 font-mono shadow-inner"
                          />
                        </div>
                      </div>

                      {/* Subject */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          {t.subjectLabel[language]}
                        </label>
                        <input
                          type="text"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder={t.subjectPlaceholder[language]}
                          className="w-full px-3.5 py-2.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 text-slate-900 text-sm focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-400 transition-all placeholder:text-slate-400 font-medium shadow-inner"
                        />
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          {t.messageLabel[language]} <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder={t.messagePlaceholder[language]}
                          className="w-full px-3.5 py-2.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 text-slate-900 text-sm focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-400 transition-all placeholder:text-slate-400 resize-y font-medium shadow-inner"
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="glass-btn-primary w-full sm:w-auto px-7 py-3 rounded-2xl text-white font-bold text-sm shadow-[0_4px_16px_rgba(37,99,235,0.25)] transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                        >
                          <Send className="w-4 h-4 text-sky-200" />
                          <span>{isSubmitting ? t.sendingBtn[language] : t.sendBtn[language]}</span>
                        </button>
                      </div>

                    </form>
                  )}

                </div>
              </motion.div>

            </div>

          </div>
        </section>

        {/* 4. OFFICIAL LEGAL RESOURCES SECTION */}
        <section className="py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Section Header */}
            <div className="mb-8 sm:mb-10 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/70 backdrop-blur-md border border-white/80 text-sky-900 text-xs font-bold uppercase tracking-wider mb-2 shadow-xs">
                <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                <span>{t.legalResourcesBadge[language]}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                {t.legalResourcesHeading[language]}
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed font-medium">
                {t.legalResourcesSubtext[language]}
              </p>
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {officialLegalResources.map((resource, index) => (
                <div
                  key={resource.id}
                  className="glass-card p-5 sm:p-6 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-[0_8px_32px_rgba(31,38,135,0.06)] hover:bg-white/85 hover:border-sky-300/70 hover:shadow-[0_14px_40px_rgba(31,38,135,0.1),0_0_20px_rgba(74,144,226,0.2)] transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-sky-800 transition-colors">
                      {resource.title[language]}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-medium">
                      {resource.description[language]}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-sky-100/60">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-sky-700 hover:text-sky-900 group-hover:underline transition-all"
                    >
                      <span>{resource.linkLabel[language]}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-sky-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

      </main>

      {/* 4. FOOTER */}
      <Footer
        language={language}
        onActionClick={onActionClick}
      />

    </div>
  );
}
