import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, CheckCircle2, Sparkles, ArrowRight, UserCheck, Shield } from 'lucide-react';
import { Language, AppRoute, AuthUser } from '../../types';
import { AuthLayout } from './AuthLayout';

interface CitizenLoginPageProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigate: (route: AppRoute) => void;
  onLoginSuccess: (user: AuthUser) => void;
}

export function CitizenLoginPage({
  language,
  onLanguageChange,
  onNavigate,
  onLoginSuccess,
}: CitizenLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg(language === 'en' ? 'Please fill in all required fields.' : 'कृपया सभी आवश्यक फ़ील्ड भरें।');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      // Construct user object
      const user: AuthUser = {
        id: 'usr_' + Date.now().toString().slice(-6),
        name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ') || 'Citizen User',
        email: email.trim(),
        role: 'citizen',
        phone: '+91 9876543210',
        createdAt: new Date().toISOString(),
      };
      onLoginSuccess(user);
    }, 500);
  };

  const handleDemoFillCitizen = () => {
    setEmail('rajesh.kumar@gmail.com');
    setPassword('Citizen@2026');
    setErrorMsg('');
  };

  const handleDemoFillAdvocate = () => {
    onNavigate('auth/login/advocate');
  };

  return (
    <AuthLayout
      language={language}
      onLanguageChange={onLanguageChange}
      onNavigate={onNavigate}
      subtitle="Citizen Legal Assistance & Advocate Network"
      subtitleHi="नागरिक कानूनी सहायता एवं अधिवक्ता नेटवर्क"
      roleTabType="login"
      activeRole="citizen"
    >
      <div className="space-y-5">
        {/* Supporting description */}
        <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-150 text-center">
          <p className="text-xs font-semibold text-sky-900 leading-relaxed">
            {language === 'en'
              ? 'For Indian citizens seeking legal aid, AI guidance & appointment bookings'
              : 'कानूनी सहायता, AI मार्गदर्शन व वकील अपॉइंटमेंट चाहने वाले भारतीय नागरिकों हेतु'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              {language === 'en' ? 'Email Address' : 'ईमेल पता'} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="citizen-login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={language === 'en' ? 'name@example.com' : 'name@example.com'}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-mono"
              />
            </div>
          </div>

          {/* Password with Show/Hide & Forgot Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                {language === 'en' ? 'Password' : 'पासवर्ड'} <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => alert(language === 'en' ? 'Password reset link sent to your registered email in demo.' : 'डेमो: पासवर्ड रीसेट लिंक आपके ईमेल पर भेजा गया।')}
                className="text-xs font-semibold text-sky-600 hover:text-sky-800 hover:underline cursor-pointer"
              >
                {language === 'en' ? 'Forgot password?' : 'पासवर्ड भूल गए?'}
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="citizen-login-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Options: Keep me logged in */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
              />
              <span>{language === 'en' ? 'Keep me logged in' : 'मुझे लॉग इन रखें'}</span>
            </label>
          </div>

          {/* Primary Submit Button */}
          <button
            id="citizen-signin-submit-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
          >
            <UserCheck className="w-4 h-4 text-sky-200" />
            <span>{isSubmitting ? (language === 'en' ? 'Signing In...' : 'लॉग इन हो रहा है...') : (language === 'en' ? 'Sign In as Citizen' : 'नागरिक के रूप में साइन इन करें')}</span>
          </button>
        </form>

        {/* Quick Demo Fill Section */}
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-sky-500" />
              <span>{language === 'en' ? 'Quick Demo Fill' : 'क्विक डेमो ऑटो-फ़िल'}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              id="citizen-demo-fill-btn"
              onClick={handleDemoFillCitizen}
              className="py-1.5 px-2.5 rounded-lg bg-white hover:bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <span>Citizen Demo</span>
              <span className="text-[10px] text-sky-500 font-bold">→ Fill</span>
            </button>

            <button
              type="button"
              id="advocate-demo-fill-btn"
              onClick={handleDemoFillAdvocate}
              className="py-1.5 px-2.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <span>Advocate Demo</span>
              <span className="text-[10px] text-slate-500 font-bold">→ Switch</span>
            </button>
          </div>
        </div>

        {/* Bottom Navigation Links */}
        <div className="text-center pt-2 space-y-3">
          <p className="text-xs text-slate-600">
            {language === 'en' ? "Don't have an account?" : 'खाता नहीं है?'}{' '}
            <button
              type="button"
              id="citizen-to-register-btn"
              onClick={() => onNavigate('auth/register/citizen')}
              className="font-bold text-sky-600 hover:text-sky-800 hover:underline cursor-pointer"
            >
              {language === 'en' ? 'Create New Account' : 'नया खाता बनाएं'}
            </button>
          </p>
        </div>

      </div>
    </AuthLayout>
  );
}
