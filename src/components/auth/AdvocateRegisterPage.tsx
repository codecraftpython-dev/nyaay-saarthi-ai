import React, { useState } from 'react';
import { User, Phone, Mail, Lock, Eye, EyeOff, Award, FileText, Upload, CheckCircle2, AlertTriangle, ShieldCheck, Briefcase } from 'lucide-react';
import { Language, AppRoute, AuthUser } from '../../types';
import { AuthLayout } from './AuthLayout';

interface AdvocateRegisterPageProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigate: (route: AppRoute) => void;
  onRegisterSuccess: (user: AuthUser) => void;
}

export function AdvocateRegisterPage({
  language,
  onLanguageChange,
  onNavigate,
  onRegisterSuccess,
}: AdvocateRegisterPageProps) {
  // Basic info
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');

  // Professional details
  const [barEnrollment, setBarEnrollment] = useState('');
  const [stateBarCouncil, setStateBarCouncil] = useState('Bar Council of Delhi');
  const [practiceAreas, setPracticeAreas] = useState('Consumer Disputes, Criminal Defense');
  const [experience, setExperience] = useState('5-8 Years');
  const [courts, setCourts] = useState('District Courts & High Court');
  const [languages, setLanguages] = useState('English, Hindi');
  const [consultationFee, setConsultationFee] = useState('₹500 / 30 mins');

  // Files
  const [barIdFile, setBarIdFile] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<string | null>(null);

  // Passwords
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stateBarOptions = [
    'Bar Council of Delhi',
    'Bar Council of Maharashtra & Goa',
    'Bar Council of Uttar Pradesh',
    'Bar Council of Karnataka',
    'Bar Council of Tamil Nadu & Puducherry',
    'Bar Council of West Bengal',
    'Bar Council of Gujarat',
    'Bar Council of Rajasthan',
    'Bar Council of Punjab & Haryana',
    'Bar Council of Bihar',
    'Bar Council of Madhya Pradesh',
    'Other State Bar Council',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !mobile.trim() || !email.trim() || !barEnrollment.trim() || !password.trim()) {
      setErrorMsg(language === 'en' ? 'Please complete all required fields (*).' : 'कृपया सभी आवश्यक फ़ील्ड (*) भरें।');
      return;
    }

    if (mobile.replace(/[^0-9]/g, '').length < 10) {
      setErrorMsg(language === 'en' ? 'Please enter a valid 10-digit mobile number.' : 'कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें।');
      return;
    }

    if (password.length < 6) {
      setErrorMsg(language === 'en' ? 'Password must be at least 6 characters long.' : 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg(language === 'en' ? 'Passwords do not match.' : 'पासवर्ड मेल नहीं खाते।');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg(language === 'en' ? 'Please accept the Bar Council statutory terms.' : 'कृपया बार काउंसिल वैधानिक शर्तों से सहमति दें।');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const newUser: AuthUser = {
        id: 'adv_' + Date.now().toString().slice(-6),
        name: fullName.startsWith('Adv.') ? fullName.trim() : 'Adv. ' + fullName.trim(),
        email: email.trim(),
        phone: mobile.trim(),
        role: 'advocate',
        barEnrollment: barEnrollment.trim().toUpperCase(),
        stateBarCouncil: stateBarCouncil,
        practiceAreas: practiceAreas.split(',').map((s) => s.trim()),
        experience: experience,
        courts: courts,
        languages: languages,
        consultationFee: consultationFee,
        isVerified: false,
        createdAt: new Date().toISOString(),
      };
      onRegisterSuccess(newUser);
    }, 600);
  };

  return (
    <AuthLayout
      language={language}
      onLanguageChange={onLanguageChange}
      onNavigate={onNavigate}
      subtitle="Create Your Account & Access Legal Services"
      subtitleHi="अपना खाता बनाएं और कानूनी सेवाओं का लाभ उठाएं"
      roleTabType="register"
      activeRole="advocate"
    >
      <div className="space-y-6">
        {/* Supporting text */}
        <div className="p-3 bg-slate-900/10 backdrop-blur-md rounded-2xl border border-slate-300/40 text-center">
          <p className="text-xs font-semibold text-slate-800 leading-relaxed">
            {language === 'en'
              ? 'For practicing legal professionals registered with State Bar Councils'
              : 'राज्य बार काउंसिल के साथ पंजीकृत पेशेवर अधिवक्ताओं हेतु'}
          </p>
        </div>

        {/* Verification Notice */}
        <div className="p-3.5 bg-amber-500/10 backdrop-blur-md border border-amber-300/40 rounded-2xl flex items-start gap-3 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5 font-medium">
            <p className="font-bold text-amber-950">
              {language === 'en' ? 'Verification Notice' : 'सत्यापन सूचना'}
            </p>
            <p className="leading-relaxed text-amber-900">
              {language === 'en'
                ? 'Account requires Bar Council verification before activation. Please provide accurate enrollment details.'
                : 'खाता सक्रिय करने से पहले बार काउंसिल सत्यापन आवश्यक है। कृपया सटीक नामांकन विवरण प्रदान करें।'}
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-500/10 backdrop-blur-md border border-rose-300/40 text-rose-800 text-xs rounded-2xl font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* SECTION 1: BASIC INFORMATION */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2 pb-2 border-b border-sky-100/60">
              <User className="w-4 h-4 text-sky-600" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                {language === 'en' ? '1. Basic Information' : '१. बुनियादी जानकारी'}
              </h3>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                {language === 'en' ? 'Full Name (with Adv. Prefix)' : 'पूरा नाम'} <span className="text-rose-500">*</span>
              </label>
              <input
                id="adv-reg-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Adv. Priya Sen"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 text-slate-900 text-sm focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-400 transition-all font-medium shadow-inner"
              />
            </div>

            {/* Mobile & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {language === 'en' ? 'Mobile Number' : 'मोबाइल नंबर'} <span className="text-rose-500">*</span>
                </label>
                <input
                  id="adv-reg-mobile"
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 text-slate-900 text-sm focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-400 transition-all font-mono font-medium shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {language === 'en' ? 'Email Address' : 'ईमेल पता'} <span className="text-rose-500">*</span>
                </label>
                <input
                  id="adv-reg-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="advocate@barcouncil.org"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 text-slate-900 text-sm focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-400 transition-all font-mono font-medium shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: PROFESSIONAL DETAILS */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-sky-100/60">
              <Award className="w-4 h-4 text-sky-600" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                {language === 'en' ? '2. Professional Details' : '२. पेशेवर विवरण'}
              </h3>
            </div>

            {/* Bar Council Enrollment & State Bar Council */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {language === 'en' ? 'Bar Council Enrollment Number' : 'बार काउंसिल नामांकन संख्या'} <span className="text-rose-500">*</span>
                </label>
                <input
                  id="adv-reg-bar-number"
                  type="text"
                  required
                  value={barEnrollment}
                  onChange={(e) => setBarEnrollment(e.target.value.toUpperCase())}
                  placeholder="e.g. D/5482/2019"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 text-slate-900 text-sm focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-400 transition-all uppercase font-mono font-medium shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {language === 'en' ? 'State Bar Council' : 'राज्य बार काउंसिल'} <span className="text-rose-500">*</span>
                </label>
                <select
                  id="adv-reg-state-bar"
                  value={stateBarCouncil}
                  onChange={(e) => setStateBarCouncil(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 text-slate-900 text-sm focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-400 transition-all font-medium shadow-inner"
                >
                  {stateBarOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Practice Areas & Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {language === 'en' ? 'Practice Areas' : 'अभ्यास क्षेत्र'}
                </label>
                <input
                  type="text"
                  value={practiceAreas}
                  onChange={(e) => setPracticeAreas(e.target.value)}
                  placeholder="e.g. Criminal, Consumer, Property"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 text-slate-900 text-sm focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-400 transition-all font-medium shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {language === 'en' ? 'Years of Experience' : 'अनुभव (वर्ष)'}
                </label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 text-slate-900 text-sm focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-400 transition-all font-medium shadow-inner"
                >
                  <option>1-3 Years</option>
                  <option>3-5 Years</option>
                  <option>5-8 Years</option>
                  <option>8-12 Years</option>
                  <option>12+ Years</option>
                </select>
              </div>
            </div>

            {/* Courts, Languages & Consultation Fee */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {language === 'en' ? 'Courts / Jurisdictions' : 'न्यायालय / क्षेत्राधिकार'}
                </label>
                <input
                  type="text"
                  value={courts}
                  onChange={(e) => setCourts(e.target.value)}
                  placeholder="e.g. High Court, District Court"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 text-slate-900 text-sm focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-400 transition-all font-medium shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {language === 'en' ? 'Languages' : 'भाषाएं'}
                </label>
                <input
                  type="text"
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                  placeholder="e.g. English, Hindi"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 text-slate-900 text-sm focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-400 transition-all font-medium shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {language === 'en' ? 'Consultation Fee' : 'परामर्श शुल्क'}
                </label>
                <input
                  type="text"
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(e.target.value)}
                  placeholder="e.g. ₹500 / ₹1000"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 text-slate-900 text-sm focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-400 transition-all font-medium shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: DOCUMENT VERIFICATION */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-sky-100/60">
              <FileText className="w-4 h-4 text-sky-600" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                {language === 'en' ? '3. Document Verification' : '३. दस्तावेज़ सत्यापन'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Upload Bar Council ID */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {language === 'en' ? 'Upload Bar Council ID / Certificate' : 'बार काउंसिल आईडी अथवा प्रमाण पत्र अपलोड करें'}
                </label>
                <div 
                  onClick={() => setBarIdFile('bar_council_certificate.pdf')}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                    barIdFile 
                      ? 'border-emerald-400 bg-emerald-500/15 backdrop-blur-md'
                      : 'border-white/90 hover:border-sky-400 bg-white/50 backdrop-blur-md'
                  }`}
                >
                  {barIdFile ? (
                    <div className="flex items-center justify-center gap-2 text-emerald-800 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{barIdFile} (Ready)</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-5 h-5 text-sky-600 mx-auto" />
                      <p className="text-xs font-semibold text-slate-700">
                        {language === 'en' ? 'Drag & drop or Click to Upload' : 'अपलोड करने के लिए क्लिक करें'}
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium">PDF, JPG, PNG (Max 10MB)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Passport Photograph */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {language === 'en' ? 'Upload Passport Photograph' : 'पासपोर्ट साइज फोटो अपलोड करें'}
                </label>
                <div 
                  onClick={() => setPhotoFile('advocate_photo.jpg')}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                    photoFile 
                      ? 'border-emerald-400 bg-emerald-500/15 backdrop-blur-md'
                      : 'border-white/90 hover:border-sky-400 bg-white/50 backdrop-blur-md'
                  }`}
                >
                  {photoFile ? (
                    <div className="flex items-center justify-center gap-2 text-emerald-800 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{photoFile} (Ready)</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-5 h-5 text-sky-600 mx-auto" />
                      <p className="text-xs font-semibold text-slate-700">
                        {language === 'en' ? 'Drag & drop or Click to Upload' : 'अपलोड करने के लिए क्लिक करें'}
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium">JPG, PNG (Passport size)</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 4: PASSWORD */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-sky-100/60">
              <Lock className="w-4 h-4 text-sky-600" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                {language === 'en' ? '4. Security & Credentials' : '४. सुरक्षा व पासवर्ड'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {language === 'en' ? 'Password' : 'पासवर्ड'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="adv-reg-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 pr-9 py-2.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 text-slate-900 text-sm focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-400 transition-all font-medium shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {language === 'en' ? 'Confirm Password' : 'पासवर्ड पुष्टि'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="adv-reg-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 pr-9 py-2.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 text-slate-900 text-sm focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-400 transition-all font-medium shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer select-none font-medium">
              <input
                id="adv-reg-terms-check"
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-slate-900 focus:ring-slate-800 border-slate-300 shrink-0"
              />
              <span>
                {language === 'en'
                  ? 'I agree to the Terms of Service, Privacy Policy, and applicable Bar Council statutory guidelines.'
                  : 'मैं सेवा की शर्तों, गोपनीयता नीति और लागू बार काउंसिल वैधानिक दिशानिर्देशों से सहमत हूँ।'}
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            id="advocate-register-submit-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-[0_4px_16px_rgba(15,23,42,0.25)] border border-white/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
          >
            <Briefcase className="w-4 h-4 text-sky-400" />
            <span>{isSubmitting ? (language === 'en' ? 'Submitting Application...' : 'आवेदन जमा हो रहा है...') : (language === 'en' ? 'Submit Advocate Application' : 'अधिवक्ता आवेदन जमा करें')}</span>
          </button>
        </form>

        {/* Bottom Login Link & Verification notice */}
        <div className="text-center pt-2 space-y-2">
          <p className="text-xs text-slate-600 font-medium">
            {language === 'en' ? 'Already have an account?' : 'पहले से खाता है?'}{' '}
            <button
              type="button"
              id="adv-reg-to-login-btn"
              onClick={() => onNavigate('auth/login/advocate')}
              className="font-bold text-sky-700 hover:text-sky-900 hover:underline cursor-pointer"
            >
              {language === 'en' ? 'Log In' : 'लॉग इन करें'}
            </button>
          </p>

          <p className="text-[11px] text-slate-500 font-medium">
            {language === 'en'
              ? 'Advocate profiles become active only after verification.'
              : 'अधिवक्ता प्रोफाइल केवल सत्यापन के बाद ही सक्रिय होती हैं।'}
          </p>
        </div>

      </div>
    </AuthLayout>
  );
}
