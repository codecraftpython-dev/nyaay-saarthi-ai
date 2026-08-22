import { Bot, ShieldCheck, CalendarCheck, BookOpenCheck, FileText, PhoneCall, ArrowUpRight } from 'lucide-react';
import { FEATURES_DATA } from '../data/content';
import { Language } from '../types';

interface FeaturesSectionProps {
  language: Language;
  onActionClick?: (action: string, title?: string) => void;
}

export function FeaturesSection({ language }: FeaturesSectionProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bot':
        return <Bot className="w-6 h-6 text-sky-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-sky-600" />;
      case 'CalendarCheck':
        return <CalendarCheck className="w-6 h-6 text-sky-600" />;
      case 'BookOpenCheck':
        return <BookOpenCheck className="w-6 h-6 text-sky-600" />;
      case 'FileText':
        return <FileText className="w-6 h-6 text-sky-600" />;
      case 'PhoneCall':
        return <PhoneCall className="w-6 h-6 text-sky-600" />;
      default:
        return <Bot className="w-6 h-6 text-sky-600" />;
    }
  };

  return (
    <section id="features-section" className="py-16 md:py-24 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block text-xs uppercase tracking-widest font-bold text-sky-900 bg-white/60 backdrop-blur-md border border-white/80 px-3.5 py-1 rounded-full shadow-[0_4px_16px_rgba(31,38,135,0.05)]">
            {language === 'en' ? 'Core Capabilities' : 'प्रमुख सुविधाएं'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 mb-4 tracking-tight">
            {language === 'en' ? 'Features We Provide' : 'हमारी प्रमुख सुविधाएं'}
          </h2>
          <p className="text-slate-700 text-base sm:text-lg font-medium">
            {language === 'en'
              ? 'Comprehensive digital legal infrastructure built specifically for the day-to-day legal needs of Indian citizens.'
              : 'भारतीय नागरिकों की रोजमर्रा की कानूनी आवश्यकताओं को सरलता से पूरा करने के लिए तैयार डिजिटल मंच।'}
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES_DATA.map((feature) => (
            <div
              key={feature.id}
              id={`feature-card-${feature.id}`}
              className="glass-card bg-white/60 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-white/80 shadow-[0_8px_32px_rgba(31,38,135,0.07)] hover:bg-white/80 hover:border-sky-300/70 hover:shadow-[0_14px_40px_rgba(31,38,135,0.12),0_0_20px_rgba(74,144,226,0.2)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/15 backdrop-blur-md border border-sky-300/40 flex items-center justify-center shadow-xs">
                    {getIcon(feature.iconName)}
                  </div>
                  <span className="text-[11px] font-bold tracking-wide uppercase px-3 py-1 rounded-full bg-white/70 backdrop-blur-md border border-white/80 text-sky-900 shadow-2xs">
                    {language === 'en' ? feature.tag : feature.tagHi}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {language === 'en' ? feature.title : feature.titleHi}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  {language === 'en' ? feature.description : feature.descriptionHi}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-sky-100/60 flex items-center justify-between text-xs font-bold text-sky-700">
                <span>{language === 'en' ? 'Core Feature' : 'प्रमुख सुविधा'}</span>
                <ArrowUpRight className="w-4 h-4 text-sky-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
