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
    <section id="features-section" className="py-16 md:py-24 bg-white border-y border-sky-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest font-bold text-sky-700 bg-sky-100 px-3 py-1 rounded-md">
            {language === 'en' ? 'Core Capabilities' : 'प्रमुख सुविधाएं'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 mb-4">
            {language === 'en' ? 'Features We Provide' : 'हमारी प्रमुख सुविधाएं'}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
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
              className="bg-white rounded-2xl p-6 sm:p-7 border border-sky-100 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center">
                    {getIcon(feature.iconName)}
                  </div>
                  <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                    {language === 'en' ? feature.tag : feature.tagHi}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {language === 'en' ? feature.title : feature.titleHi}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {language === 'en' ? feature.description : feature.descriptionHi}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-sky-100/70 flex items-center justify-between text-xs font-semibold text-sky-600">
                <span>{language === 'en' ? 'Core Feature' : 'प्रमुख सुविधा'}</span>
                <ArrowUpRight className="w-4 h-4 text-sky-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
