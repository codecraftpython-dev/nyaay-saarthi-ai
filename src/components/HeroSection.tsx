import { MessageSquareText, Calendar, BookOpen, Shield, CheckCircle } from 'lucide-react';
import { HERO_CONTENT } from '../data/content';
import { Language } from '../types';
import logoImg from '../assets/images/nyaay_sarathi_logo_1787153284213.jpg';

interface HeroSectionProps {
  language: Language;
  onActionClick: (action: string, title?: string) => void;
}

export function HeroSection({ language, onActionClick }: HeroSectionProps) {
  return (
    <section id="hero-what-is-it-section" className="relative pt-10 pb-16 md:pt-14 md:pb-20 overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto mb-10 pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/80 text-sky-900 text-xs sm:text-sm font-semibold mb-5 shadow-[0_4px_16px_rgba(31,38,135,0.06)]">
            <img 
              src={logoImg} 
              alt="Nyaay सारथी" 
              className="w-5 h-5 rounded-full object-cover shadow-xs" 
              referrerPolicy="no-referrer"
            />
            <span>{language === 'en' ? 'Digital Legal Empowerment Platform' : 'डिजिटल कानूनी सशक्तिकरण मंच'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 max-w-3xl mx-auto leading-tight tracking-tight">
            {HERO_CONTENT.headlineSub[language]}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed font-medium">
            {HERO_CONTENT.description[language]}
          </p>
        </div>

        {/* Primary Action Buttons - Tinted Glass Panels */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-14">
          <button
            id="hero-chat-ai-cta"
            onClick={() => onActionClick('chat-ai', language === 'en' ? 'AI Legal Assistant' : 'AI कानूनी सहायक')}
            className="glass-btn-primary inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-white font-semibold text-sm sm:text-base shadow-[0_6px_24px_rgba(37,99,235,0.3)] hover:shadow-[0_0_28px_rgba(74,144,226,0.55)] transition-all cursor-pointer"
          >
            <MessageSquareText className="w-5 h-5 text-sky-100" />
            <span>{HERO_CONTENT.ctaAi[language]}</span>
          </button>

          <button
            id="hero-book-appointment-cta"
            onClick={() => onActionClick('book-appointment', language === 'en' ? 'Book an Appointment' : 'अपॉइंटमेंट लें')}
            className="glass-btn-sky inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white/70 hover:bg-white/90 text-sky-800 border border-white/85 font-semibold text-sm sm:text-base shadow-[0_4px_16px_rgba(31,38,135,0.06)] hover:shadow-[0_0_22px_rgba(74,144,226,0.4)] transition-all cursor-pointer"
          >
            <Calendar className="w-5 h-5 text-sky-600" />
            <span>{HERO_CONTENT.ctaAppointment[language]}</span>
          </button>

          <button
            id="hero-explore-rights-cta"
            onClick={() => onActionClick('know-rights', language === 'en' ? 'Know Your Rights' : 'अधिकार संदर्शिका')}
            className="glass-btn inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/50 hover:bg-white/80 border border-white/75 text-slate-800 font-semibold text-sm sm:text-base shadow-[0_4px_16px_rgba(31,38,135,0.05)] transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-cyan-600" />
            <span>{HERO_CONTENT.ctaRights[language]}</span>
          </button>
        </div>

        {/* "What is it" Content Card - Tinted Glass Showcase */}
        <div className="glass-panel bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-[0_12px_40px_rgba(31,38,135,0.08)] p-6 sm:p-8 lg:p-10 max-w-5xl mx-auto">
          <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-sky-100/60">
            <div className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-md border border-white/80 p-0.5 flex items-center justify-center shadow-xs overflow-hidden shrink-0">
              <img 
                src={logoImg} 
                alt="Nyaay सारथी" 
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {HERO_CONTENT.whatIsItTitle[language]}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                {language === 'en' 
                  ? 'Designed to make Indian justice transparent, fast, and accessible for all citizens.'
                  : 'भारतीय न्याय प्रणाली को हर नागरिक के लिए सुलभ, सरल और पारदर्शी बनाने का प्रयास।'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HERO_CONTENT.whatIsItPoints.map((item, idx) => (
              <div 
                key={idx}
                id={`what-is-it-point-${idx}`}
                className="glass-card bg-white/55 backdrop-blur-md rounded-2xl p-5 border border-white/75 hover:bg-white/80 hover:border-sky-300/60 transition-all"
              >
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-6 h-6 rounded-full bg-sky-500/15 text-sky-800 text-xs font-bold flex items-center justify-center shrink-0 border border-sky-300/40">
                    {idx + 1}
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {language === 'en' ? item.titleEn : item.titleHi}
                  </h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  {language === 'en' ? item.descEn : item.descHi}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Notice Banner */}
          <div className="mt-6 pt-5 border-t border-sky-100/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-sky-600 shrink-0" />
              <span className="font-medium">
                {language === 'en'
                  ? 'Compliant with Bar Council of India standards & Information Technology Rules.'
                  : 'बार काउंसिल ऑफ इंडिया व सूचना प्रौद्योगिकी नियमों के पूर्णतः अनुरूप।'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'en' ? 'Confidential & Secure' : 'पूर्ण गोपनीयता व सुरक्षा'}</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
