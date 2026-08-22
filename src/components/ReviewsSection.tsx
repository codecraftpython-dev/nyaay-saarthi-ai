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
      className="py-16 md:py-24 bg-transparent overflow-hidden relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block text-xs uppercase tracking-widest font-bold text-sky-900 bg-white/60 backdrop-blur-md border border-white/80 px-3.5 py-1 rounded-full shadow-[0_4px_16px_rgba(31,38,135,0.05)]">
            {language === 'en' ? 'Citizen Experiences' : 'नागरिकों के अनुभव'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 mb-3 tracking-tight">
            {language === 'en' ? 'Real Stories, Real Justice' : 'सच्ची कहानियां, वास्तविक न्याय'}
          </h2>
          <p className="text-slate-700 text-sm sm:text-base font-medium">
            {language === 'en'
              ? 'See how everyday citizens resolved disputes, recovered funds, and exercised their constitutional rights.'
              : 'जानें कैसे आम नागरिकों ने विवाद सुलझाए, अपनी राशि वापस पाई और अपने अधिकारों की रक्षा की।'}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Card & Navigation Wrapper */}
          <div className="relative flex items-center justify-center">
            {/* Arrow Left */}
            <button
              id="review-carousel-prev-btn"
              onClick={prevSlide}
              aria-label="Previous Review"
              className="glass-btn !absolute left-0 sm:-left-5 md:-left-7 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/70 backdrop-blur-md border border-white/80 text-slate-800 hover:text-sky-700 hover:bg-white shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-90"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Rectangular Animated Review Card */}
            <div className="w-full relative min-h-[340px] sm:min-h-[290px] flex items-center justify-center px-4 sm:px-12">
              <div
                key={currentReview.id}
                id={`review-box-${currentReview.id}`}
                className={`w-full glass-panel bg-white/65 backdrop-blur-2xl rounded-3xl p-6 sm:p-9 border border-white/85 shadow-[0_16px_48px_rgba(31,38,135,0.09)] transform transition-all duration-500 ease-out ${
                  slideDirection === 'next'
                    ? 'animate-in fade-in zoom-in-95 slide-in-from-right-8'
                    : 'animate-in fade-in zoom-in-95 slide-in-from-left-8'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sky-100/60">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-sky-500/15 backdrop-blur-md border border-sky-300/40 text-sky-800 font-bold text-lg flex items-center justify-center shrink-0 shadow-xs">
                      {(language === 'en' ? currentReview.name : currentReview.nameHi).charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-lg">
                          {language === 'en' ? currentReview.name : currentReview.nameHi}
                        </h3>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-900 bg-sky-500/15 px-2.5 py-0.5 rounded-full border border-sky-300/40">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {language === 'en' ? 'Verified' : 'सत्यापित'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">
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
                    <span className="text-xs font-bold text-slate-800 bg-white/70 backdrop-blur-md border border-white/80 px-3 py-1 rounded-xl shadow-2xs">
                      {language === 'en' ? currentReview.topic : currentReview.topicHi}
                    </span>
                  </div>
                </div>

                {/* Review text in rectangular box */}
                <div className="relative mt-5">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-sky-300/40 -z-0 pointer-events-none" />
                  <p className="relative z-10 text-slate-800 text-base sm:text-lg leading-relaxed italic font-medium">
                    "{language === 'en' ? currentReview.comment : currentReview.commentHi}"
                  </p>
                </div>

                <div className="mt-5 pt-3 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>{currentReview.date}</span>
                  <span className="text-sky-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                    {language === 'en' ? 'Resolved via Nyaay सारथी' : 'न्याय सारथी द्वारा समाधान'}
                  </span>
                </div>
              </div>
            </div>

            {/* Arrow Right */}
            <button
              id="review-carousel-next-btn"
              onClick={nextSlide}
              aria-label="Next Review"
              className="glass-btn !absolute right-0 sm:-right-5 md:-right-7 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/70 backdrop-blur-md border border-white/80 text-slate-800 hover:text-sky-700 hover:bg-white shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-90"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
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
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? 'w-8 bg-sky-600 shadow-[0_0_12px_rgba(74,144,226,0.6)]'
                    : 'w-2.5 bg-white/70 border border-sky-300/60 hover:bg-sky-200'
                }`}
                aria-label={`Go to review ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* BOOK APPOINTMENT BUTTON BELOW REVIEWS */}
        <div className="mt-14 pt-8 text-center max-w-xl mx-auto flex flex-col items-center">
          <p className="text-sm font-bold text-slate-700 mb-3">
            {language === 'en' 
              ? 'Need tailored legal advice for your situation?'
              : 'क्या आपको अपने मामले के लिए व्यक्तिगत कानूनी परामर्श चाहिए?'}
          </p>
          <button
            id="book-appointment-below-reviews-btn"
            onClick={() => onActionClick('book-appointment', language === 'en' ? 'Book an Advocate Appointment' : 'वकील अपॉइंटमेंट बुक करें')}
            className="glass-btn-primary inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-bold text-base sm:text-lg shadow-[0_6px_24px_rgba(37,99,235,0.3)] hover:shadow-[0_0_28px_rgba(74,144,226,0.55)] transition-all cursor-pointer group"
          >
            <Calendar className="w-5 h-5 text-sky-100 group-hover:scale-110 transition-transform" />
            <span>{language === 'en' ? 'Book an Appointment' : 'अपॉइंटमेंट बुक करें'}</span>
          </button>
          <span className="text-xs text-slate-600 font-medium mt-2">
            {language === 'en' ? '• Instant confirmation • Audio/Video/In-person' : '• तुरंत पुष्टि • ऑडियो / वीडियो / व्यक्तिगत'}
          </span>
        </div>

      </div>
    </section>
  );
}
