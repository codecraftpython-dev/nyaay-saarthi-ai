import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote, Calendar, CheckCircle2, ShieldCheck } from 'lucide-react';
import { REVIEWS_DATA } from '../data/content';
import { Language } from '../types';

interface ReviewsSectionProps {
  language: Language;
  onActionClick: (action: string, title?: string) => void;
}

export function ReviewsSection({ language, onActionClick }: ReviewsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');

  const totalReviews = REVIEWS_DATA.length;

  const nextSlide = useCallback(() => {
    setSlideDirection('next');
    setCurrentIndex((prev) => (prev + 1) % totalReviews);
  }, [totalReviews]);

  const prevSlide = useCallback(() => {
    setSlideDirection('prev');
    setCurrentIndex((prev) => (prev - 1 + totalReviews) % totalReviews);
  }, [totalReviews]);

  // Auto-slide effect
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const currentReview = REVIEWS_DATA[currentIndex];

  return (
    <section 
      id="reviews-section" 
      className="py-16 md:py-24 bg-white border-t border-sky-100 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest font-bold text-sky-700 bg-sky-100 px-3 py-1 rounded-md">
            {language === 'en' ? 'Citizen Experiences' : 'नागरिकों के अनुभव'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 mb-3">
            {language === 'en' ? 'Real Stories, Real Justice' : 'सच्ची कहानियां, वास्तविक न्याय'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {language === 'en'
              ? 'See how everyday citizens resolved disputes, recovered funds, and exercised their constitutional rights.'
              : 'जानें कैसे आम नागरिकों ने विवाद सुलझाए, अपनी राशि वापस पाई और अपने अधिकारों की रक्षा की।'}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Arrow Left */}
          <button
            id="review-carousel-prev-btn"
            onClick={prevSlide}
            aria-label="Previous Review"
            className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-sky-200 text-slate-700 hover:text-white hover:border-sky-600 hover:bg-sky-600 shadow-sm flex items-center justify-center transition-all active:scale-90"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Arrow Right */}
          <button
            id="review-carousel-next-btn"
            onClick={nextSlide}
            aria-label="Next Review"
            className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-sky-200 text-slate-700 hover:text-white hover:border-sky-600 hover:bg-sky-600 shadow-sm flex items-center justify-center transition-all active:scale-90"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Rectangular Animated Review Card */}
          <div className="relative min-h-[340px] sm:min-h-[290px] flex items-center justify-center px-4 sm:px-12">
            <div
              key={currentReview.id}
              id={`review-box-${currentReview.id}`}
              className={`w-full bg-[#F8FAFC] rounded-2xl p-6 sm:p-9 border border-sky-100 shadow-sm shadow-sky-900/5 transform transition-all duration-500 ease-out ${
                slideDirection === 'next'
                  ? 'animate-in fade-in zoom-in-95 slide-in-from-right-8'
                  : 'animate-in fade-in zoom-in-95 slide-in-from-left-8'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sky-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 font-bold text-lg flex items-center justify-center shrink-0">
                    {(language === 'en' ? currentReview.name : currentReview.nameHi).charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-lg">
                        {language === 'en' ? currentReview.name : currentReview.nameHi}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200/80">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {language === 'en' ? 'Verified' : 'सत्यापित'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {language === 'en' ? currentReview.role : currentReview.roleHi} • {language === 'en' ? currentReview.city : currentReview.cityHi}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-400">
                    {[...Array(currentReview.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 bg-white border border-sky-100 px-2.5 py-1 rounded-md shadow-2xs">
                    {language === 'en' ? currentReview.topic : currentReview.topicHi}
                  </span>
                </div>
              </div>

              {/* Review text in rectangular box */}
              <div className="relative mt-5">
                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-sky-200/60 -z-0 pointer-events-none" />
                <p className="relative z-10 text-slate-700 text-base sm:text-lg leading-relaxed italic">
                  "{language === 'en' ? currentReview.comment : currentReview.commentHi}"
                </p>
              </div>

              <div className="mt-5 pt-3 flex items-center justify-between text-xs text-slate-400">
                <span>{currentReview.date}</span>
                <span className="text-sky-700 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                  {language === 'en' ? 'Resolved via Nyaay सारथी' : 'न्याय सारथी द्वारा समाधान'}
                </span>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {REVIEWS_DATA.map((_, idx) => (
              <button
                key={idx}
                id={`carousel-dot-${idx}`}
                onClick={() => {
                  setSlideDirection(idx > currentIndex ? 'next' : 'prev');
                  setCurrentIndex(idx);
                }}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'w-8 bg-sky-600'
                    : 'w-2.5 bg-sky-200 hover:bg-sky-300'
                }`}
                aria-label={`Go to review ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* BOOK APPOINTMENT BUTTON BELOW REVIEWS */}
        <div className="mt-14 pt-8 text-center max-w-xl mx-auto flex flex-col items-center">
          <p className="text-sm font-semibold text-slate-600 mb-3">
            {language === 'en' 
              ? 'Need tailored legal advice for your situation?'
              : 'क्या आपको अपने मामले के लिए व्यक्तिगत कानूनी परामर्श चाहिए?'}
          </p>
          <button
            id="book-appointment-below-reviews-btn"
            onClick={() => onActionClick('book-appointment', language === 'en' ? 'Book an Advocate Appointment' : 'वकील अपॉइंटमेंट बुक करें')}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-base sm:text-lg shadow-md shadow-sky-600/25 hover:shadow-lg hover:shadow-sky-600/30 transition-all active:scale-95 group"
          >
            <Calendar className="w-5 h-5 text-sky-200 group-hover:scale-110 transition-transform" />
            <span>{language === 'en' ? 'Book an Appointment' : 'अपॉइंटमेंट बुक करें'}</span>
          </button>
          <span className="text-xs text-slate-500 mt-2">
            {language === 'en' ? '• Instant confirmation • Audio/Video/In-person' : '• तुरंत पुष्टि • ऑडियो / वीडियो / व्यक्तिगत'}
          </span>
        </div>

      </div>
    </section>
  );
}
