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
    <section id="hero-what-is-it-section" className="relative pt-10 pb-16 md:pt-14 md:pb-20 overflow-hidden bg-[#F4F9FD]">
      {/* Background Decorative Soft Sky & Cyan Accents */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center opacity-40">
        <div className="w-[650px] h-[650px] bg-gradient-to-br from-sky-200/50 via-cyan-100/30 to-transparent rounded-full blur-3xl transform -translate-y-1/4"></div>
      </div>
      <div className="absolute top-10 right-10 pointer-events-none -z-10 w-72 h-72 bg-sky-100/60 rounded-full blur-2xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto mb-10 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-sky-200/80 text-sky-800 text-xs sm:text-sm font-semibold mb-5 shadow-2xs">
            <img 
              src={logoImg} 
              alt="Nyaay सारथी" 
              className="w-5 h-5 rounded-full object-cover" 
              referrerPolicy="no-referrer"
            />
            <span>{language === 'en' ? 'Digital Legal Empowerment Platform' : 'डिजिटल कानूनी सशक्तिकरण मंच'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 max-w-3xl mx-auto leading-tight tracking-tight">
            {HERO_CONTENT.headlineSub[language]}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {HERO_CONTENT.description[language]}
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-16">
          <button
            id="hero-chat-ai-cta"
            onClick={() => onActionClick('chat-ai', language === 'en' ? 'AI Legal Assistant' : 'AI कानूनी सहायक')}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm sm:text-base shadow-md shadow-sky-600/25 hover:shadow-lg hover:shadow-sky-600/30 transition-all active:scale-98"
          >
            <MessageSquareText className="w-5 h-5 text-sky-200" />
            <span>{HERO_CONTENT.ctaAi[language]}</span>
          </button>

          <button
            id="hero-book-appointment-cta"
            onClick={() => onActionClick('book-appointment', language === 'en' ? 'Book an Appointment' : 'अपॉइंटमेंट लें')}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white hover:bg-sky-50/80 text-sky-700 border-2 border-sky-500/80 font-semibold text-sm sm:text-base shadow-sm shadow-sky-900/5 hover:border-sky-600 transition-all active:scale-98"
          >
            <Calendar className="w-5 h-5 text-sky-600" />
            <span>{HERO_CONTENT.ctaAppointment[language]}</span>
          </button>

          <button
            id="hero-explore-rights-cta"
            onClick={() => onActionClick('know-rights', language === 'en' ? 'Know Your Rights' : 'अधिकार संदर्शिका')}
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm sm:text-base shadow-2xs hover:border-sky-200 transition-all"
          >
            <BookOpen className="w-4 h-4 text-cyan-600" />
            <span>{HERO_CONTENT.ctaRights[language]}</span>
          </button>
        </div>

        {/* "What is it" Content Card */}
        <div className="bg-white rounded-2xl border border-sky-100 shadow-sm shadow-sky-900/5 p-6 sm:p-8 lg:p-10 max-w-5xl mx-auto">
          <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-sky-100/80">
            <div className="w-12 h-12 rounded-xl bg-white border border-sky-100 p-0.5 flex items-center justify-center shadow-xs overflow-hidden shrink-0">
              <img 
                src={logoImg} 
                alt="Nyaay सारथी" 
                className="w-full h-full object-cover rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {HERO_CONTENT.whatIsItTitle[language]}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
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
                className="bg-slate-50/60 rounded-xl p-5 border border-sky-100/70 hover:bg-sky-50/40 hover:border-sky-200 transition-all"
              >
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {language === 'en' ? item.titleEn : item.titleHi}
                  </h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {language === 'en' ? item.descEn : item.descHi}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Notice Banner */}
          <div className="mt-6 pt-5 border-t border-sky-100/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-sky-600 shrink-0" />
              <span>
                {language === 'en'
                  ? 'Compliant with Bar Council of India standards & Information Technology Rules.'
                  : 'बार काउंसिल ऑफ इंडिया व सूचना प्रौद्योगिकी नियमों के पूर्णतः अनुरूप।'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'en' ? 'Confidential & Secure' : 'पूर्ण गोपनीयता व सुरक्षा'}</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
