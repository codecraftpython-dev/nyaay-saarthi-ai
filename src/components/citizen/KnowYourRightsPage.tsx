import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Search, Bookmark, ArrowRight, Scale, 
  ShieldCheck, HelpCircle, CheckCircle2, ChevronDown, 
  ExternalLink, Bot, Check, FileText
} from 'lucide-react';
import { Language, AppRoute, LegalRight, AuthUser } from '../../types';
import { INITIAL_LEGAL_RIGHTS, getStoredSavedResources, toggleSavedResource } from '../../data/portalData';

interface KnowYourRightsPageProps {
  user: AuthUser;
  language: Language;
  onNavigate: (route: AppRoute, params?: any) => void;
}

export function KnowYourRightsPage({
  user,
  language,
  onNavigate,
}: KnowYourRightsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [savedResourceIds, setSavedResourceIds] = useState<string[]>(() => {
    return getStoredSavedResources().map(s => s.rightId);
  });
  const [expandedRightId, setExpandedRightId] = useState<string | null>('r-1');

  const categories = [
    'All',
    'Police & Criminal Justice',
    'Consumer',
    'Cyber',
    'Tenant & Property',
    'Constitutional',
    'Employment',
    'Women',
    'Senior Citizen',
  ];

  const handleToggleSave = (right: LegalRight) => {
    const isSavedNow = toggleSavedResource(user.id, right);
    if (isSavedNow) {
      setSavedResourceIds(prev => [...prev, right.id]);
    } else {
      setSavedResourceIds(prev => prev.filter(id => id !== right.id));
    }
  };

  const filteredRights = useMemo(() => {
    return INITIAL_LEGAL_RIGHTS.filter((r) => {
      if (selectedCategory !== 'All' && r.category !== selectedCategory) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = r.name.toLowerCase().includes(q) || (r.nameHi && r.nameHi.toLowerCase().includes(q));
        const matchDesc = r.shortDescription.toLowerCase().includes(q) || (r.shortDescriptionHi && r.shortDescriptionHi.toLowerCase().includes(q));
        const matchSource = r.legalSource.toLowerCase().includes(q);
        const matchEx = r.exampleSituation.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchSource && !matchEx) return false;
      }
      return true;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider">
          <BookOpen className="w-4 h-4 text-teal-600" />
          <span>{language === 'en' ? 'Citizen Legal Awareness Repository' : 'नागरिक अधिकार ज्ञानकोश'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {language === 'en' ? 'Know Your Rights' : 'अपने नागरिक अधिकार जानें'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          {language === 'en'
            ? 'Clear, jargon-free explanations of Indian constitutional protections, consumer safety laws, tenant rights, and grievance procedures.'
            : 'भारतीय संविधान, उपभोक्ता संरक्षण, साइबर सुरक्षा और किरायेदारी कानूनों के तहत अपने वैधानिक अधिकारों को सरल भाषा में समझें।'}
        </p>

        {/* Search Bar */}
        <div className="pt-2">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'en' 
                ? 'Search rights by keyword (e.g. Zero FIR, Security Deposit, Defective Product, Free Legal Aid)...' 
                : 'अधिकार खोजें (जैसे ज़ीरो FIR, सिक्योरिटी डिपॉजिट, उपभोक्ता, साइबर फ्रॉड)...'}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                isSelected
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-teal-50 border border-sky-100'
              }`}
            >
              {cat === 'All' ? (language === 'en' ? 'All Categories' : 'सभी श्रेणियां') : cat}
            </button>
          );
        })}
      </div>

      {/* Rights Grid */}
      {filteredRights.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-sky-100 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No legal rights found matching your search.</h3>
          <p className="text-xs text-slate-500">Try searching for a different keyword or category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRights.map((r) => {
            const isSaved = savedResourceIds.includes(r.id);
            const isExpanded = expandedRightId === r.id;

            return (
              <div
                key={r.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-sky-100 shadow-2xs hover:border-sky-300 transition-all space-y-4"
              >
                {/* Header: Name, Category, Save button */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-150">
                      {r.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {language === 'hi' && r.nameHi ? r.nameHi : r.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                      {language === 'hi' && r.shortDescriptionHi ? r.shortDescriptionHi : r.shortDescription}
                    </p>
                  </div>

                  <button
                    onClick={() => handleToggleSave(r)}
                    className={`p-2.5 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                      isSaved 
                        ? 'bg-sky-50 border-sky-300 text-sky-700' 
                        : 'bg-white border-slate-200 text-slate-400 hover:text-sky-600 hover:bg-sky-50'
                    }`}
                    title={isSaved ? 'Remove from Saved' : 'Save to My Resources'}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-sky-600 text-sky-600' : ''}`} />
                  </button>
                </div>

                {/* Structured Breakdown Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Legal Provision & Statute
                    </span>
                    <p className="font-semibold text-slate-800">{r.legalSource}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Who It Protects
                    </span>
                    <p className="text-slate-700">{language === 'hi' && r.whoItAppliesToHi ? r.whoItAppliesToHi : r.whoItAppliesTo}</p>
                  </div>
                </div>

                {/* Practical Example & Action */}
                <div className="space-y-2 text-xs pt-1">
                  <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-150 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 block">
                      Real-Life Scenario Example
                    </span>
                    <p className="text-slate-700 italic">
                      "{language === 'hi' && r.exampleSituationHi ? r.exampleSituationHi : r.exampleSituation}"
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                      Recommended Practical Action
                    </span>
                    <p className="text-slate-800 font-medium">
                      {language === 'hi' && r.possibleActionHi ? r.possibleActionHi : r.possibleAction}
                    </p>
                  </div>
                </div>

                {/* Documents & Authority */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Competent Authority / Forum</span>
                    <p className="font-semibold text-slate-800">{r.relevantAuthority}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Key Documents Needed</span>
                    <p className="text-slate-600">{r.requiredDocuments.join(', ')}</p>
                  </div>
                </div>

                {/* Action CTAs: Chat with AI & Consult Advocate */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400">
                    Source: Supreme Court of India / Statutory Codes
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigate('chat')}
                      className="py-2 px-3.5 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold hover:bg-sky-100 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Bot className="w-3.5 h-3.5 text-sky-600" />
                      <span>{language === 'en' ? 'Ask Nyaay सारथी' : 'AI से इस पर पूछें'}</span>
                    </button>

                    {r.advocateCategoryHint && (
                      <button
                        onClick={() => onNavigate('appointments', { category: r.advocateCategoryHint })}
                        className="py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>{language === 'en' ? 'Find Advocates' : 'वकील खोजें'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
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
  );
}
