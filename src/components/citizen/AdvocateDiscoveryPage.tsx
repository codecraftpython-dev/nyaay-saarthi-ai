import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, ShieldCheck, Star, MapPin, Calendar, 
  Clock, ArrowRight, UserCheck, SlidersHorizontal, X, Check,
  Briefcase, Scale, Award, Globe, ChevronRight
} from 'lucide-react';
import { Language, AppRoute, Advocate } from '../../types';
import { INITIAL_ADVOCATES, DEFAULT_CITIZEN_AVATAR } from '../../data/portalData';

interface AdvocateDiscoveryPageProps {
  language: Language;
  onNavigate: (route: AppRoute, params?: any) => void;
  onSelectAdvocate?: (advocate: Advocate) => void;
  onBookAppointment?: (advocate: Advocate) => void;
  preselectedCategory?: string | null;
  initialCategory?: string | null;
}

export function AdvocateDiscoveryPage({
  language,
  onNavigate,
  onSelectAdvocate,
  onBookAppointment,
  preselectedCategory,
  initialCategory,
}: AdvocateDiscoveryPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourtLevel, setSelectedCourtLevel] = useState<string>('All');
  const [selectedPracticeArea, setSelectedPracticeArea] = useState<string>(
    initialCategory || preselectedCategory || 'All'
  );

  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedFeeRange, setSelectedFeeRange] = useState<string>('All');
  const [selectedExperience, setSelectedExperience] = useState<string>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [availableTodayOnly, setAvailableTodayOnly] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const courtLevels = [
    { id: 'All', label: language === 'en' ? 'All Courts' : 'सभी न्यायालय' },
    { id: 'Supreme Court', label: language === 'en' ? 'Supreme Court' : 'सर्वोच्च न्यायालय (SC)' },
    { id: 'High Court', label: language === 'en' ? 'High Court' : 'उच्च न्यायालय (HC)' },
    { id: 'District Court', label: language === 'en' ? 'District Court' : 'जिला व सत्र न्यायालय' },
    { id: 'Other Courts / Forums', label: language === 'en' ? 'Consumer & Tribunals' : 'उपभोक्ता व अधिकरण' },
  ];

  const practiceAreas = [
    'All',
    'Consumer Law',
    'Cyber Law',
    'Civil Law',
    'Property & Tenancy',
    'Criminal Law',
    'Labour & Employment',
    'Family & Matrimonial',
    'Constitutional Law',
    'Banking & Financial',
  ];

  const locations = [
    'All',
    'New Delhi',
    'Mumbai',
    'Bengaluru',
    'Jaipur',
    'Lucknow',
    'Kolkata',
    'Chandigarh',
  ];

  const feeRanges = [
    { id: 'All', label: 'Any Fee' },
    { id: 'under-600', label: 'Under ₹600' },
    { id: '600-1000', label: '₹600 - ₹1,000' },
    { id: 'above-1000', label: '₹1,000+' },
  ];

  const experienceFilters = [
    { id: 'All', label: 'Any Experience' },
    { id: '5', label: '5+ Years' },
    { id: '10', label: '10+ Years' },
    { id: '15', label: '15+ Years' },
  ];

  // Filter Advocates
  const filteredAdvocates = useMemo(() => {
    return INITIAL_ADVOCATES.filter((adv) => {
      // 1. Search filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchName = adv.name.toLowerCase().includes(query);
        const matchArea = adv.practiceAreas.some(p => p.toLowerCase().includes(query));
        const matchLoc = adv.location.toLowerCase().includes(query);
        const matchCourts = adv.courts.toLowerCase().includes(query);
        if (!matchName && !matchArea && !matchLoc && !matchCourts) return false;
      }

      // 2. Court Level
      if (selectedCourtLevel !== 'All') {
        if (!adv.courtLevels.includes(selectedCourtLevel)) return false;
      }

      // 3. Practice Area
      if (selectedPracticeArea !== 'All') {
        if (!adv.practiceAreas.includes(selectedPracticeArea)) return false;
      }

      // 4. Location
      if (selectedLocation !== 'All') {
        if (adv.city !== selectedLocation) return false;
      }

      // 5. Fee Range
      if (selectedFeeRange === 'under-600' && adv.consultationFee >= 600) return false;
      if (selectedFeeRange === '600-1000' && (adv.consultationFee < 600 || adv.consultationFee > 1000)) return false;
      if (selectedFeeRange === 'above-1000' && adv.consultationFee < 1000) return false;

      // 6. Experience
      if (selectedExperience !== 'All') {
        const expNum = parseInt(selectedExperience, 10);
        if (adv.experienceYears < expNum) return false;
      }

      // 7. Language
      if (selectedLanguage !== 'All') {
        if (!adv.languages.includes(selectedLanguage)) return false;
      }

      // 8. Available Today
      if (availableTodayOnly) {
        if (!adv.availability.includes('Today')) return false;
      }

      return true;
    });
  }, [
    searchTerm, 
    selectedCourtLevel, 
    selectedPracticeArea, 
    selectedLocation, 
    selectedFeeRange, 
    selectedExperience, 
    selectedLanguage,
    availableTodayOnly
  ]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCourtLevel('All');
    setSelectedPracticeArea('All');
    setSelectedLocation('All');
    setSelectedFeeRange('All');
    setSelectedExperience('All');
    setSelectedLanguage('All');
    setAvailableTodayOnly(false);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner / Heading (Section 14) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-sky-700 uppercase tracking-wider">
          <Scale className="w-4 h-4 text-sky-600" />
          <span>{language === 'en' ? 'Verified Bar Council Advocate Network' : 'सत्यापित अधिवक्ता नेटवर्क'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {language === 'en' ? 'Find the Right Advocate' : 'उपयुक्त वकील खोजें'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          {language === 'en'
            ? 'Choose an advocate based on your legal requirement, court level, experience, location and consultation preferences.'
            : 'अपनी कानूनी आवश्यकता, न्यायालय स्तर, अनुभव, स्थान व परामर्श शुल्क के अनुसार उपयुक्त अधिवक्ता का चयन करें।'}
        </p>

        {/* Search Bar */}
        <div className="pt-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              id="input-search-advocates"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'en' 
                ? 'Search by advocate name, specialization or legal issue (e.g. Consumer, Cyber, Tenant, Bail)...' 
                : 'वकील का नाम, विशेषज्ञता या कानूनी विषय से खोजें (जैसे उपभोक्ता, साइबर, किराया)...'}
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Court Level Segmented Control / Cards (Section 15) */}
      <div className="bg-white rounded-2xl p-4 border border-sky-100 shadow-2xs space-y-2">
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
          {language === 'en' ? 'Choose Court / Legal Level' : 'न्यायालय / कानूनी स्तर चुनें'}
        </span>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {courtLevels.map((lvl) => {
            const isSelected = selectedCourtLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                id={`court-filter-${lvl.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => setSelectedCourtLevel(lvl.id)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                  isSelected
                    ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/20'
                    : 'bg-slate-50 hover:bg-sky-50 text-slate-700 border border-slate-200/80 hover:border-sky-200'
                }`}
              >
                {lvl.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Filter & Results Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Desktop Sidebar Filters (Section 16) */}
        <div className="hidden lg:block space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-sky-600" />
                <span>Filters</span>
              </span>
              <button
                onClick={clearAllFilters}
                className="text-[11px] font-bold text-sky-600 hover:text-sky-800 cursor-pointer"
              >
                Reset All
              </button>
            </div>

            {/* Practice Area */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Practice Area</label>
              <select
                id="filter-practice-area"
                value={selectedPracticeArea}
                onChange={(e) => setSelectedPracticeArea(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-sky-500"
              >
                {practiceAreas.map(pa => (
                  <option key={pa} value={pa}>{pa === 'All' ? 'All Practice Areas' : pa}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">City / Jurisdiction</label>
              <select
                id="filter-location"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-sky-500"
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc === 'All' ? 'All Cities' : loc}</option>
                ))}
              </select>
            </div>

            {/* Consultation Fee */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Consultation Fee</label>
              <div className="space-y-1.5">
                {feeRanges.map(fr => (
                  <label key={fr.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="fee-range"
                      checked={selectedFeeRange === fr.id}
                      onChange={() => setSelectedFeeRange(fr.id)}
                      className="text-sky-600 focus:ring-sky-500"
                    />
                    <span>{fr.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Minimum Experience */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Experience</label>
              <div className="space-y-1.5">
                {experienceFilters.map(ef => (
                  <label key={ef.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="exp-filter"
                      checked={selectedExperience === ef.id}
                      onChange={() => setSelectedExperience(ef.id)}
                      className="text-sky-600 focus:ring-sky-500"
                    />
                    <span>{ef.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={availableTodayOnly}
                  onChange={(e) => setAvailableTodayOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                />
                <span>Available Today Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Advocate Cards Grid (Section 17) */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Mobile Filter Button */}
          <div className="lg:hidden flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">
              Showing {filteredAdvocates.length} Verified Advocates
            </span>
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="py-2 px-3.5 rounded-xl bg-white border border-sky-200 text-sky-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Results Count Bar */}
          <div className="hidden lg:flex items-center justify-between text-xs text-slate-500">
            <span>Showing <strong className="text-slate-900 font-bold">{filteredAdvocates.length}</strong> verified advocates</span>
            {selectedPracticeArea !== 'All' && (
              <span className="bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full border border-sky-150 font-semibold">
                Category: {selectedPracticeArea}
              </span>
            )}
          </div>

          {/* Empty State */}
          {filteredAdvocates.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-sky-100 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {language === 'en' ? 'No advocates found for your selected filters.' : 'चयनित फिल्टर के अनुसार कोई वकील नहीं मिला।'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {language === 'en' 
                  ? 'Try broadening your court level, location, or practice area search.' 
                  : 'कृपया न्यायालय स्तर या स्थान बदलकर पुनः प्रयास करें।'}
              </p>
              <div className="pt-2">
                <button
                  onClick={clearAllFilters}
                  className="py-2 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  {language === 'en' ? 'Clear Filters' : 'फिल्टर हटाएं'}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAdvocates.map((adv) => (
                <div 
                  key={adv.id}
                  className="bg-white rounded-2xl p-5 border border-sky-100 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    
                    {/* Header: Photo, Name & Verification */}
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center font-bold text-base shrink-0 shadow-2xs">
                        {adv.name.split(' ').slice(1, 3).map(n => n[0]).join('') || 'AD'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-sm font-bold text-slate-900 truncate">{adv.name}</h3>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-150 shrink-0">
                            <ShieldCheck className="w-3 h-3 text-sky-600" />
                            <span>Verified Advocate</span>
                          </span>
                        </div>
                        <p className="text-xs text-sky-700 font-semibold truncate pt-0.5">
                          {adv.practiceAreas.join(' • ')}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {adv.courtLevels.join(' • ')}
                        </p>
                      </div>
                    </div>

                    {/* Meta tags: Experience, Location, Languages */}
                    <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-700 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          <span>{adv.experience}</span>
                        </span>
                        <span className="flex items-center gap-1 font-bold text-amber-600">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{adv.rating}</span>
                          <span className="text-slate-400 font-normal">({adv.reviewCount})</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{adv.location}</span>
                        </span>
                        <span className="truncate text-slate-400">
                          {adv.languages.join(', ')}
                        </span>
                      </div>
                    </div>

                    {/* Fee & Availability Banner */}
                    <div className="p-2.5 rounded-xl bg-slate-50/90 border border-slate-200/70 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Consultation Fee</span>
                        <span className="text-sm font-extrabold text-slate-900">₹{adv.consultationFee}</span>
                        <span className="text-[10px] text-slate-500"> / session</span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{adv.availability}</span>
                      </span>
                    </div>

                  </div>

                  {/* Action Buttons: View Profile & Book Appointment */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <button
                      id={`btn-view-profile-${adv.id}`}
                      onClick={() => onSelectAdvocate(adv)}
                      className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer text-center"
                    >
                      {language === 'en' ? 'View Profile' : 'प्रोफ़ाइल देखें'}
                    </button>

                    <button
                      id={`btn-book-apt-${adv.id}`}
                      onClick={() => onBookAppointment(adv)}
                      className="py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer text-center flex items-center justify-center gap-1"
                    >
                      <span>{language === 'en' ? 'Book Appointment' : 'अपॉइंटमेंट लें'}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-sky-200" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Mobile Filter Drawer Modal */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-6 space-y-5 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Filters</h3>
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Practice Area */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Practice Area</label>
              <select
                value={selectedPracticeArea}
                onChange={(e) => setSelectedPracticeArea(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800"
              >
                {practiceAreas.map(pa => (
                  <option key={pa} value={pa}>{pa === 'All' ? 'All Practice Areas' : pa}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">City / Jurisdiction</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800"
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc === 'All' ? 'All Cities' : loc}</option>
                ))}
              </select>
            </div>

            {/* Fee Range */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Consultation Fee</label>
              <div className="space-y-1.5">
                {feeRanges.map(fr => (
                  <label key={fr.id} className="flex items-center gap-2 text-xs text-slate-700">
                    <input
                      type="radio"
                      name="m-fee-range"
                      checked={selectedFeeRange === fr.id}
                      onChange={() => setSelectedFeeRange(fr.id)}
                    />
                    <span>{fr.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 flex gap-2">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
              >
                Reset
              </button>
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-sky-600 text-white text-xs font-bold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
