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
    <section id="stats-section" className="py-16 md:py-20 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-xs uppercase tracking-widest font-bold text-sky-900 bg-white/60 backdrop-blur-md border border-white/80 px-3.5 py-1 rounded-full shadow-[0_4px_16px_rgba(31,38,135,0.05)]">
            {language === 'en' ? 'Impact & Reach' : 'विश्वसनीयता व आंकड़े'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 mb-3 tracking-tight">
            {language === 'en' ? 'Trusted by Citizens Nationwide' : 'देशभर के नागरिकों का विश्वास'}
          </h2>
          <p className="text-slate-700 text-sm sm:text-base font-medium">
            {language === 'en'
              ? 'Delivering real, measurable impact by simplifying justice for every Indian.'
              : 'प्रत्येक भारतीय के लिए कानूनी मदद को सरल और सुलभ बनाकर वास्तविक बदलाव।'}
          </p>
        </div>

        {/* Stats Grid - Frosted Glass Containers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {STATS_DATA.map((stat) => (
            <div
              key={stat.id}
              id={`stat-card-${stat.id}`}
              className="glass-card bg-white/60 backdrop-blur-xl rounded-3xl p-5 sm:p-7 border border-white/80 text-center flex flex-col items-center justify-between shadow-[0_8px_32px_rgba(31,38,135,0.07)] hover:bg-white/80 hover:border-sky-300/60 hover:shadow-[0_12px_36px_rgba(31,38,135,0.12),0_0_20px_rgba(74,144,226,0.15)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-sky-500/15 backdrop-blur-md border border-sky-300/40 flex items-center justify-center mb-3 shadow-xs">
                {getIcon(stat.iconName)}
              </div>

              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-sky-800 font-['Cinzel',serif] tracking-tight">
                {stat.value}
              </div>

              <div className="mt-2">
                <div className="text-sm font-bold text-slate-900">
                  {language === 'en' ? stat.label : stat.labelHi}
                </div>
                <div className="text-xs text-slate-600 font-medium mt-0.5">
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
