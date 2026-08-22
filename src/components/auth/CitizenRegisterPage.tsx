import React, { useState } from 'react';
import { User, Phone, Mail, Lock, Eye, EyeOff, CheckCircle2, UserPlus } from 'lucide-react';
import { Language, AppRoute, AuthUser } from '../../types';
import { AuthLayout } from './AuthLayout';

interface CitizenRegisterPageProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigate: (route: AppRoute) => void;
  onRegisterSuccess: (user: AuthUser) => void;
}

export function CitizenRegisterPage({
  language,
  onLanguageChange,
  onNavigate,
  onRegisterSuccess,
}: CitizenRegisterPageProps) {
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !mobile.trim() || !email.trim() || !password.trim()) {
      setErrorMsg(language === 'en' ? 'Please fill in all mandatory fields.' : 'कृपया सभी आवश्यक फ़ील्ड भरें।');
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
      setErrorMsg(language === 'en' ? 'Passwords do not match. Please verify.' : 'पासवर्ड मेल नहीं खाते। कृपया पुनः जाँचें।');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg(language === 'en' ? 'Please agree to the Terms of Service & Privacy Policy.' : 'कृपया सेवा की शर्तों और गोपनीयता नीति से सहमति दें।');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const newUser: AuthUser = {
        id: 'usr_' + Date.now().toString().slice(-6),
        name: fullName.trim(),
        email: email.trim(),
        phone: mobile.trim(),
        role: 'citizen',
        createdAt: new Date().toISOString(),
      };
      onRegisterSuccess(newUser);
    }, 500);
  };

  return (
    <AuthLayout
      language={language}
      onLanguageChange={onLanguageChange}
      onNavigate={onNavigate}
      subtitle="Create Your Account & Access Legal Services"
      subtitleHi="अपना खाता बनाएं और कानूनी सेवाओं का लाभ उठाएं"
      roleTabType="register"
      activeRole="citizen"
    >
      <div className="space-y-5">
        {/* Supporting description */}
        <div className="p-3 bg-sky-500/10 backdrop-blur-md rounded-2xl border border-sky-300/30 text-center">
          <p className="text-xs font-semibold text-sky-950 leading-relaxed">
            {language === 'en'
              ? 'For citizens seeking legal assistance, document drafting, and appointments'
              : 'कानूनी सहायता, दस्तावेज़ प्रारूपण व वकील अपॉइंटमेंट चाहने वाले नागरिकों हेतु'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-500/10 backdrop-blur-md border border-rose-300/40 text-rose-800 text-xs rounded-2xl font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              {language === 'en' ? 'Full Name' : 'पूरा नाम'} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="citizen-reg-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={language === 'en' ? 'e.g. Ramesh Kumar' : 'उदा. रमेश कुमार'}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 text-slate-900 text-sm focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-400 transition-all font-medium shadow-inner"
              />
            </div>
          </div>

          {/* Mobile & Email row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                {language === 'en' ? 'Mobile Number' : 'मोबाइल नंबर'} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="citizen-reg-mobile"
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="98765 43210"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 text-slate-900 text-sm focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-400 transition-all font-mono font-medium shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                {language === 'en' ? 'Email Address' : 'ईमेल पता'} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="citizen-reg-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 text-slate-900 text-sm focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-400 transition-all font-mono font-medium shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                {language === 'en' ? 'Password' : 'पासवर्ड'} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="citizen-reg-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 text-slate-900 text-sm focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-400 transition-all font-medium shadow-inner"
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
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="citizen-reg-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 text-slate-900 text-sm focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-400 transition-all font-medium shadow-inner"
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

          {/* Terms Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer select-none font-medium">
              <input
                id="citizen-reg-terms-check"
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-sky-600 focus:ring-sky-500 border-slate-300 shrink-0"
              />
              <span>
                {language === 'en'
                  ? 'I agree to the Terms of Service, Privacy Policy, and applicable legal guidelines.'
                  : 'मैं सेवा की शर्तों, गोपनीयता नीति और लागू कानूनी दिशानिर्देशों से सहमत हूँ।'}
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            id="citizen-register-submit-btn"
            type="submit"
            disabled={isSubmitting}
            className="glass-btn-primary w-full py-3 px-4 rounded-2xl text-white font-bold text-sm shadow-[0_4px_16px_rgba(37,99,235,0.25)] transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
          >
            <UserPlus className="w-4 h-4 text-sky-200" />
            <span>{isSubmitting ? (language === 'en' ? 'Registering Account...' : 'पंजीकरण हो रहा है...') : (language === 'en' ? 'Complete Citizen Registration' : 'नागरिक पंजीकरण पूर्ण करें')}</span>
          </button>
        </form>

        {/* Bottom Login Link */}
        <div className="text-center pt-2 space-y-2">
          <p className="text-xs text-slate-600 font-medium">
            {language === 'en' ? 'Already have an account?' : 'पहले से खाता है?'}{' '}
            <button
              type="button"
              id="citizen-reg-to-login-btn"
              onClick={() => onNavigate('auth/login/citizen')}
              className="font-bold text-sky-700 hover:text-sky-900 hover:underline cursor-pointer"
            >
              {language === 'en' ? 'Log In' : 'लॉग इन करें'}
            </button>
          </p>
        </div>

      </div>
    </AuthLayout>
  );
}
