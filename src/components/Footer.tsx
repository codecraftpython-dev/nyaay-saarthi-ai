import { Phone, ExternalLink, ShieldCheck } from 'lucide-react';
import { FOOTER_PLATFORM_LINKS, FOOTER_RIGHTS_LINKS, FOOTER_GOVT_LINKS } from '../data/content';
import { Language, FooterLink } from '../types';
import logoImg from '../assets/images/nyaay_sarathi_logo_1787153284213.jpg';

interface FooterProps {
  language: Language;
  onActionClick: (action: string, title?: string, linkData?: FooterLink) => void;
}

export function Footer({ language, onActionClick }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="relative bg-slate-900/90 backdrop-blur-2xl text-slate-200 pt-16 pb-12 border-t border-white/20 shadow-[0_-8px_32px_rgba(31,38,135,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Branding & Helpline Badges */}
        <div className="pb-10 border-b border-white/15 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={scrollToTop}>
            <div className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-md p-1 shadow-md border border-white/80 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
              <img 
                src={logoImg} 
                alt="Nyaay सारथी Logo" 
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
                Nyaay <span className="text-sky-400 font-['Noto_Sans_Devanagari',sans-serif] font-extrabold">सारथी</span>
              </span>
              <p className="text-xs text-sky-200/80 font-medium">
                {language === 'en'
                  ? 'Digital Citizen Legal Assistance & Guidance'
                  : 'डिजिटल नागरिक कानूनी सहायता व मार्गदर्शन मंच'}
              </p>
            </div>
          </div>

          {/* Essential Citizen Helplines - Frosted Glass Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs shadow-sm hover:bg-white/15 transition-colors">
              <Phone className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-sky-200 font-medium">Cyber Crime:</span>
              <strong className="text-white font-mono font-bold tracking-wider">1930</strong>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs shadow-sm hover:bg-white/15 transition-colors">
              <Phone className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-sky-200 font-medium">NALSA Legal Aid:</span>
              <strong className="text-white font-mono font-bold tracking-wider">15100</strong>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs shadow-sm hover:bg-white/15 transition-colors">
              <Phone className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-sky-200 font-medium">Consumer:</span>
              <strong className="text-white font-mono font-bold tracking-wider">1915</strong>
            </div>
          </div>
        </div>

        {/* 3 Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-12">
          
          {/* Column 1: Platform */}
          <div id="footer-col-platform" className="space-y-4">
            <h3 className="font-bold text-xs tracking-widest uppercase text-sky-400 font-mono">
              Platform
            </h3>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_PLATFORM_LINKS.map((link) => {
                const isHome = link.actionKey === 'home';
                return (
                  <li key={link.actionKey}>
                    <button
                      id={`footer-link-${link.actionKey}`}
                      onClick={() => {
                        if (isHome) {
                          scrollToTop();
                        } else {
                          onActionClick(
                            link.actionKey,
                            language === 'en' ? link.label : link.labelHi,
                            link
                          );
                        }
                      }}
                      className="text-slate-300 hover:text-sky-300 transition-colors text-left flex items-center gap-2 group cursor-pointer"
                    >
                      <span className="group-hover:translate-x-1 transition-transform">
                        {language === 'en' ? link.label : link.labelHi}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 2: Rights & Topics */}
          <div id="footer-col-rights" className="space-y-4">
            <h3 className="font-bold text-xs tracking-widest uppercase text-sky-400 font-mono">
              Rights & Topics
            </h3>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_RIGHTS_LINKS.map((link) => (
                <li key={link.actionKey}>
                  <button
                    id={`footer-link-${link.actionKey}`}
                    onClick={() =>
                      onActionClick(
                        link.actionKey,
                        language === 'en' ? link.label : link.labelHi,
                        link
                      )
                    }
                    className="text-slate-300 hover:text-sky-300 transition-colors text-left flex items-center gap-2 group cursor-pointer"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">
                      {language === 'en' ? link.label : link.labelHi}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Govt Portals */}
          <div id="footer-col-govt" className="space-y-4">
            <h3 className="font-bold text-xs tracking-widest uppercase text-sky-400 font-mono">
              Govt Portals
            </h3>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_GOVT_LINKS.map((link) => (
                <li key={link.actionKey}>
                  <button
                    id={`footer-link-${link.actionKey}`}
                    onClick={() =>
                      onActionClick(
                        link.actionKey,
                        language === 'en' ? link.label : link.labelHi,
                        link
                      )
                    }
                    className="text-slate-300 hover:text-sky-300 transition-colors text-left flex items-center gap-1.5 group cursor-pointer"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">
                      {language === 'en' ? link.label : link.labelHi}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 text-sky-400" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Legal Disclaimer & Copyright */}
        <div className="pt-8 border-t border-white/15 text-xs text-slate-400 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
            <p>
              {language === 'en'
                ? 'Nyaay सारथी is an informational & legal assistance gateway. Not a solicitation under Bar Council Rules.'
                : 'न्याय सारथी एक सूचना व कानूनी मार्गदर्शन मंच है। यह बार काउंसिल नियमों के तहत विज्ञापन या वकालत आमंत्रण नहीं है।'}
            </p>
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-center">
            <span>© {new Date().getFullYear()} Nyaay सारथी. Dedicated to Indian Citizens.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
