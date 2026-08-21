import React, { useState } from 'react';
import { 
  Bookmark, Trash2, Bot, ArrowRight, BookOpen, 
  Scale, ShieldCheck, ChevronRight
} from 'lucide-react';
import { Language, AppRoute, SavedResource, AuthUser } from '../../types';
import { getStoredSavedResources, INITIAL_LEGAL_RIGHTS } from '../../data/portalData';

interface SavedResourcesPageProps {
  user: AuthUser;
  language: Language;
  onNavigate: (route: AppRoute, params?: any) => void;
}

export function SavedResourcesPage({
  user,
  language,
  onNavigate,
}: SavedResourcesPageProps) {
  const [savedItems, setSavedItems] = useState<SavedResource[]>(() => getStoredSavedResources());

  const handleRemove = (id: string) => {
    const updated = savedItems.filter(item => item.id !== id);
    setSavedItems(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nyay_saathi_saved_resources', JSON.stringify(updated));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-700 uppercase tracking-wider">
            <Bookmark className="w-4 h-4 text-sky-600" />
            <span>{language === 'en' ? 'Bookmarked Knowledge Repository' : 'सहेजी गई कानूनी सामग्री'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {language === 'en' ? 'Saved Legal Resources' : 'सहेजे गए अधिकार व लेख'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'en'
              ? 'Quick access to statutory rights, provisions, and complaint blueprints you have bookmarked.'
              : 'आपके द्वारा सहेजे गए कानूनी अधिकार, धाराएं और शिकायत प्रारूप।'}
          </p>
        </div>

        <button
          onClick={() => onNavigate('rights')}
          className="py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold shadow-xs cursor-pointer shrink-0"
        >
          {language === 'en' ? 'Explore More Rights' : 'और अधिकार देखें'}
        </button>
      </div>

      {/* Saved Items List */}
      {savedItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-sky-100 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {language === 'en' ? 'No saved legal resources yet.' : 'अभी कोई सहेजी गई सामग्री नहीं है।'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {language === 'en'
              ? 'While browsing the "Know Your Rights" section or chatting with the AI Assistant, you can click the bookmark icon to save key legal provisions.'
              : 'अधिकार ज्ञानकोश या AI चैट से मुख्य कानूनी प्रावधानों को सहेजने के लिए बुकमार्क आइकन पर क्लिक करें।'}
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('rights')}
              className="py-2.5 px-5 rounded-xl bg-sky-600 text-white text-xs font-bold shadow-xs hover:bg-sky-700 cursor-pointer"
            >
              Browse Rights
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {savedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-sky-100 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-150">
                  {item.category}
                </span>
                <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-500 font-medium">Source: {item.legalSource}</p>
                <p className="text-[11px] text-slate-400">Saved on {item.savedAt}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onNavigate('chat')}
                  className="py-2 px-3 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold hover:bg-sky-100 flex items-center gap-1 cursor-pointer"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Ask AI</span>
                </button>

                <button
                  onClick={() => onNavigate('rights')}
                  className="py-2 px-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>View Right</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleRemove(item.id)}
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors cursor-pointer"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
