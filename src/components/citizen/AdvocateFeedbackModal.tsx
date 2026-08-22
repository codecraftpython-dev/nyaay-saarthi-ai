import React, { useState } from 'react';
import { X, Star, Sparkles, CheckCircle2, AlertCircle, User, Briefcase, FileText } from 'lucide-react';
import { Language, AuthUser, AdvocateFeedback } from '../../types';
import { MOCK_ADVOCATES, saveFeedback } from '../../data/portalData';

interface AdvocateFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentUser?: AuthUser;
  onFeedbackSubmitted?: (feedback: AdvocateFeedback) => void;
}

export function AdvocateFeedbackModal({
  isOpen,
  onClose,
  language,
  currentUser,
  onFeedbackSubmitted,
}: AdvocateFeedbackModalProps) {
  const [advocateName, setAdvocateName] = useState('');
  const [customAdvocateName, setCustomAdvocateName] = useState('');
  const [rating, setRating] = useState('');
  const [caseInformation, setCaseInformation] = useState('');
  const [review, setReview] = useState('');
  
  // Validation errors
  const [errors, setErrors] = useState<{
    advocate?: string;
    rating?: string;
    caseInfo?: string;
    review?: string;
  }>({});

  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  // Handle rating input change adhering strictly to:
  // - 0.0 to 5.0
  // - at most one digit after decimal
  // - no negative numbers
  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      setRating('');
      setErrors((prev) => ({ ...prev, rating: undefined }));
      return;
    }

    // Disallow invalid formats like multiple dots or more than 1 decimal digit
    if (!/^\d*(\.\d{0,1})?$/.test(val)) {
      return;
    }

    const num = parseFloat(val);
    if (!isNaN(num)) {
      if (num < 0 || num > 5.0) {
        setErrors((prev) => ({
          ...prev,
          rating: language === 'en' ? 'Rating must be between 0.0 and 5.0' : 'रेटिंग 0.0 से 5.0 के बीच होनी चाहिए',
        }));
      } else {
        setErrors((prev) => ({ ...prev, rating: undefined }));
      }
    }

    setRating(val);
  };

  const handleQuickRating = (value: number) => {
    setRating(value.toFixed(1));
    setErrors((prev) => ({ ...prev, rating: undefined }));
  };

  const handleAdvocateSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setAdvocateName(val);
    if (val !== 'other') {
      setCustomAdvocateName('');
    }
    setErrors((prev) => ({ ...prev, advocate: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedName = advocateName === 'other' ? customAdvocateName.trim() : advocateName.trim();
    const newErrors: {
      advocate?: string;
      rating?: string;
      caseInfo?: string;
      review?: string;
    } = {};

    if (!selectedName) {
      newErrors.advocate = language === 'en' ? 'Please enter or select an advocate' : 'कृपया अधिवक्ता का नाम चुनें या दर्ज करें';
    }

    const parsedRating = parseFloat(rating);
    if (rating === '' || isNaN(parsedRating)) {
      newErrors.rating = language === 'en' ? 'Please provide a rating (0.0 to 5.0)' : 'कृपया रेटिंग दर्ज करें (0.0 से 5.0)';
    } else if (parsedRating < 0 || parsedRating > 5.0) {
      newErrors.rating = language === 'en' ? 'Rating must be between 0.0 and 5.0' : 'रेटिंग 0.0 से 5.0 के बीच होनी चाहिए';
    } else if (!/^\d+(\.\d)?$/.test(rating)) {
      newErrors.rating = language === 'en' ? 'Only one decimal place is allowed (e.g. 4.5)' : 'दशमलव के बाद केवल एक अंक मान्य है (उदा. 4.5)';
    }

    if (!caseInformation.trim()) {
      newErrors.caseInfo = language === 'en' ? 'Please enter related case information' : 'कृपया संबंधित मामले की जानकारी दर्ज करें';
    }

    if (!review.trim()) {
      newErrors.review = language === 'en' ? 'Please write your review' : 'कृपया अपनी समीक्षा लिखें';
    } else if (review.trim().length < 10) {
      newErrors.review = language === 'en' ? 'Review must be at least 10 characters long' : 'समीक्षा कम से कम 10 अक्षरों की होनी चाहिए';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Construct Feedback Object
    const newFeedback: AdvocateFeedback = {
      id: 'fb-' + Date.now().toString(),
      userId: currentUser?.id || 'demo_citizen',
      userName: currentUser?.name || 'Citizen User',
      advocateName: selectedName,
      rating: parsedRating,
      caseInformation: caseInformation.trim(),
      review: review.trim(),
      createdAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    };

    saveFeedback(newFeedback);

    if (onFeedbackSubmitted) {
      onFeedbackSubmitted(newFeedback);
    }

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      // Reset form
      setAdvocateName('');
      setCustomAdvocateName('');
      setRating('');
      setCaseInformation('');
      setReview('');
      setErrors({});
      onClose();
    }, 1500);
  };

  const handleModalClose = () => {
    setErrors({});
    setIsSuccess(false);
    onClose();
  };

  const currentNumericRating = parseFloat(rating);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="glass-panel bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.2),0_0_30px_rgba(74,144,226,0.15)] max-w-xl w-full relative my-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-modal-title"
      >
        {/* Top-Right Close (×) Button */}
        <button
          id="btn-close-feedback-modal"
          onClick={handleModalClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100/90 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer border border-slate-200/60 shadow-2xs group active:scale-95"
          aria-label="Close feedback modal"
        >
          <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 pr-10 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold border border-sky-200/60">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>{language === 'en' ? 'Citizen Feedback & Rating' : 'नागरिक प्रतिक्रिया व रेटिंग'}</span>
          </div>

          <h2 id="feedback-modal-title" className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {language === 'en' ? 'Advocate Consultation Feedback' : 'अधिवक्ता परामर्श प्रतिक्रिया'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            {language === 'en'
              ? 'Share your experience to help verified legal advocates improve their practice and empower fellow citizens.'
              : 'अपना अनुभव साझा करें ताकि साथी नागरिकों को सही और विश्वसनीय कानूनी सहायता मिल सके।'}
          </p>
        </div>

        {/* Success Banner */}
        {isSuccess ? (
          <div className="py-10 text-center space-y-3 bg-emerald-50/80 rounded-2xl border border-emerald-200/70 p-6 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-emerald-950">
              {language === 'en' ? 'Thank you for your feedback!' : 'आपकी प्रतिक्रिया के लिए धन्यवाद!'}
            </h3>
            <p className="text-xs text-emerald-800 font-medium max-w-md mx-auto">
              {language === 'en'
                ? 'Your review and rating have been recorded successfully.'
                : 'आपकी समीक्षा और रेटिंग सफलतापूर्वक सहेज ली गई है।'}
            </p>
          </div>
        ) : (
          /* Feedback Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* 1. Name of Advocate */}
            <div className="space-y-1.5">
              <label 
                htmlFor="feedback-advocate-name"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                {language === 'en' ? '1. Name of Advocate' : '१. अधिवक्ता का नाम'} <span className="text-rose-500">*</span>
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4 text-sky-600" />
                </div>

                <select
                  id="feedback-advocate-select"
                  value={advocateName}
                  onChange={handleAdvocateSelection}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-400 transition-all shadow-2xs"
                >
                  <option value="">
                    {language === 'en' ? '-- Select an Advocate --' : '-- अधिवक्ता चुनें --'}
                  </option>
                  {MOCK_ADVOCATES.map((adv) => (
                    <option key={adv.id} value={adv.name}>
                      {adv.name} — {adv.practiceAreas.slice(0, 2).join(', ')} ({adv.location})
                    </option>
                  ))}
                  <option value="other">
                    {language === 'en' ? '+ Enter Another Advocate Name Manually' : '+ अन्य अधिवक्ता का नाम मैन्युअली दर्ज करें'}
                  </option>
                </select>
              </div>

              {/* If "other" advocate is selected or user wants to enter custom name */}
              {advocateName === 'other' && (
                <div className="mt-2 animate-in fade-in duration-200">
                  <input
                    id="feedback-custom-advocate-input"
                    type="text"
                    value={customAdvocateName}
                    onChange={(e) => {
                      setCustomAdvocateName(e.target.value);
                      setErrors((prev) => ({ ...prev, advocate: undefined }));
                    }}
                    placeholder={language === 'en' ? 'Enter Advocate Name (e.g. Adv. R. K. Gupta)' : 'अधिवक्ता का नाम दर्ज करें'}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/80 backdrop-blur-md border border-sky-200 text-slate-900 text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-400 transition-all shadow-2xs"
                  />
                </div>
              )}

              {errors.advocate && (
                <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.advocate}</span>
                </p>
              )}
            </div>

            {/* 2. Rating (0.0 to 5.0, up to 1 decimal place) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label 
                  htmlFor="feedback-rating-input"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  {language === 'en' ? '2. Rating (0.0 to 5.0)' : '२. रेटिंग (0.0 से 5.0)'} <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-500 font-semibold">
                  {language === 'en' ? 'Single decimal allowed (e.g. 4.5)' : 'दशमलव तक मान्य (उदा. 4.5)'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  </div>
                  <input
                    id="feedback-rating-input"
                    type="number"
                    step="0.1"
                    min="0.0"
                    max="5.0"
                    value={rating}
                    onChange={handleRatingChange}
                    placeholder="e.g. 4.5"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 text-slate-900 text-xs sm:text-sm font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-400 transition-all shadow-2xs"
                  />
                </div>

                {/* Quick Rating Selector Pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[5.0, 4.5, 4.0, 3.5, 3.0].map((val) => {
                    const isSelected = !isNaN(currentNumericRating) && currentNumericRating === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleQuickRating(val)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 shadow-2xs ${
                          isSelected
                            ? 'bg-amber-500 text-white border-amber-600 shadow-amber-500/20'
                            : 'bg-white/80 hover:bg-amber-50 text-slate-700 border-slate-200 hover:border-amber-300'
                        }`}
                      >
                        <Star className={`w-3 h-3 ${isSelected ? 'fill-white' : 'text-amber-500 fill-amber-400'}`} />
                        <span>{val.toFixed(1)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {errors.rating && (
                <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.rating}</span>
                </p>
              )}
            </div>

            {/* 3. Case Information */}
            <div className="space-y-1.5">
              <label 
                htmlFor="feedback-case-info-input"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                {language === 'en' ? '3. Case Information' : '३. मामला / केस की जानकारी'} <span className="text-rose-500">*</span>
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Briefcase className="w-4 h-4 text-sky-600" />
                </div>
                <input
                  id="feedback-case-info-input"
                  type="text"
                  value={caseInformation}
                  onChange={(e) => {
                    setCaseInformation(e.target.value);
                    setErrors((prev) => ({ ...prev, caseInfo: undefined }));
                  }}
                  placeholder={language === 'en' 
                    ? 'e.g. Consumer Notice, Rental Agreement Dispute, Application #NS-1024' 
                    : 'उदा. उपभोक्ता नोटिस, किरायेदारी विवाद, आवेदन क्रमांक #NS-1024'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-400 transition-all shadow-2xs"
                />
              </div>

              {errors.caseInfo && (
                <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.caseInfo}</span>
                </p>
              )}
            </div>

            {/* 4. Write Your Review */}
            <div className="space-y-1.5">
              <label 
                htmlFor="feedback-review-textarea"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                {language === 'en' ? '4. Write Your Review' : '४. अपनी समीक्षा लिखें'} <span className="text-rose-500">*</span>
              </label>

              <div className="relative">
                <textarea
                  id="feedback-review-textarea"
                  rows={4}
                  value={review}
                  onChange={(e) => {
                    setReview(e.target.value);
                    setErrors((prev) => ({ ...prev, review: undefined }));
                  }}
                  placeholder="Write your review..."
                  className="w-full px-4 py-3 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-400 transition-all shadow-2xs resize-none"
                />
              </div>

              {errors.review && (
                <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.review}</span>
                </p>
              )}
            </div>

            {/* Modal Bottom Section: Submit Feedback button at bottom-right corner */}
            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between gap-3">
              <button
                type="button"
                id="btn-cancel-feedback"
                onClick={handleModalClose}
                className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                {language === 'en' ? 'Cancel' : 'रद्द करें'}
              </button>

              {/* Submit Feedback Button at bottom-right */}
              <button
                type="submit"
                id="btn-submit-feedback"
                className="glass-btn-primary py-2.5 px-6 rounded-2xl text-white text-xs sm:text-sm font-bold shadow-[0_4px_16px_rgba(37,99,235,0.25)] flex items-center gap-2 transition-all cursor-pointer active:scale-95 ml-auto"
              >
                <CheckCircle2 className="w-4 h-4 text-sky-100" />
                <span>{language === 'en' ? 'Submit Feedback' : 'प्रतिक्रिया सबमिट करें'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
