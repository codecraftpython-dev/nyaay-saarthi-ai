import { Briefcase, MessageSquare, CheckCircle2, Award } from 'lucide-react';
import { STATS_DATA } from '../data/content';
import { Language } from '../types';

interface StatsSectionProps {
  language: Language;
}

export function StatsSection({ language }: StatsSectionProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-sky-600" />;
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5 text-sky-600" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'Award':
        return <Award className="w-5 h-5 text-amber-500" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-sky-600" />;
    }
  };

  return (
    <section id="stats-section" className="py-16 md:py-20 bg-[#F4F9FD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest font-bold text-sky-700 bg-sky-100 px-3 py-1 rounded-md">
            {language === 'en' ? 'Impact & Reach' : 'विश्वसनीयता व आंकड़े'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 mb-3">
            {language === 'en' ? 'Trusted by Citizens Nationwide' : 'देशभर के नागरिकों का विश्वास'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {language === 'en'
              ? 'Delivering real, measurable impact by simplifying justice for every Indian.'
              : 'प्रत्येक भारतीय के लिए कानूनी मदद को सरल और सुलभ बनाकर वास्तविक बदलाव।'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {STATS_DATA.map((stat) => (
            <div
              key={stat.id}
              id={`stat-card-${stat.id}`}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-sky-100/90 text-center flex flex-col items-center justify-between hover:border-sky-300 hover:shadow-md hover:shadow-sky-500/5 transition-all shadow-2xs"
            >
              <div className="w-11 h-11 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center mb-3 shadow-2xs">
                {getIcon(stat.iconName)}
              </div>

              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-sky-700 font-['Cinzel',serif] tracking-tight">
                {stat.value}
              </div>

              <div className="mt-2">
                <div className="text-sm font-bold text-slate-800">
                  {language === 'en' ? stat.label : stat.labelHi}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {language === 'en' ? stat.sublabel : stat.sublabelHi}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
