import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Sparkles, Scale, Briefcase, Award } from 'lucide-react';
import { Language, AppRoute, AuthUser } from '../../types';
import { AuthLayout } from './AuthLayout';

interface AdvocateLoginPageProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigate: (route: AppRoute) => void;
  onLoginSuccess: (user: AuthUser) => void;
}

export function AdvocateLoginPage({
  language,
  onLanguageChange,
  onNavigate,
  onLoginSuccess,
}: AdvocateLoginPageProps) {
  const [email, setEmail] = useState('');
  const [barEnrollment, setBarEnrollment] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg(language === 'en' ? 'Please fill in your registered email and password.' : 'कृपया अपना पंजीकृत ईमेल और पासवर्ड दर्ज करें।');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const user: AuthUser = {
        id: 'adv_' + Date.now().toString().slice(-6),
        name: email.includes('sharma') ? 'Adv. Vikram Sharma' : ('Adv. ' + (email.split('@')[0].replace(/[^a-zA-Z]/g, ' ') || 'Legal Practitioner')),
        email: email.trim(),
        role: 'advocate',
        barEnrollment: barEnrollment.trim() || 'D/1842/2016',
        stateBarCouncil: 'Bar Council of Delhi',
        practiceAreas: ['Constitutional Law', 'Criminal Defense', 'Consumer Disputes'],
        experience: '8+ Years',
        courts: 'Delhi High Court & Supreme Court of India',
        languages: 'English, Hindi',
        consultationFee: '₹800 / session',
        isVerified: true,
        createdAt: new Date().toISOString(),
      };
      onLoginSuccess(user);
    }, 500);
  };

  const handleDemoFillAdvocate = () => {
    setEmail('adv.vikram.sharma@delhibar.org');
    setBarEnrollment('D/1842/2016');
    setPassword('Advocate@2026');
    setErrorMsg('');
  };

  const handleDemoFillCitizen = () => {
    onNavigate('auth/login/citizen');
  };

  return (
    <AuthLayout
      language={language}
      onLanguageChange={onLanguageChange}
      onNavigate={onNavigate}
      subtitle="Citizen Legal Assistance & Advocate Network"
      subtitleHi="नागरिक कानूनी सहायता एवं अधिवक्ता नेटवर्क"
      roleTabType="login"
      activeRole="advocate"
    >
      <div className="space-y-5">
        {/* Supporting description */}
        <div className="p-3 bg-slate-900/10 backdrop-blur-md rounded-2xl border border-slate-300/40 text-center">
          <p className="text-xs font-semibold text-slate-800 leading-relaxed">
            {language === 'en'
              ? 'For verified advocates & Bar Council registered legal practitioners'
              : 'सत्यापित अधिवक्ताओं व बार काउंसिल पंजीकृत विधिक पेशेवरों हेतु'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-500/10 backdrop-blur-md border border-rose-300/40 text-rose-800 text-xs rounded-2xl font-semibold">
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
                id="advocate-login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="advocate@barcouncil.org"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 text-slate-900 text-sm focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-400 transition-all font-mono font-medium shadow-inner"
              />
            </div>
          </div>

          {/* Bar Council Enrollment No. (Optional for Login) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                {language === 'en' ? 'Bar Council Enrollment No.' : 'बार काउंसिल नामांकन संख्या'}
              </label>
              <span className="text-[10px] text-slate-500 font-semibold">
                {language === 'en' ? '(Optional for Login)' : '(वैकल्पिक)'}
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Award className="w-4 h-4" />
              </div>
              <input
                id="advocate-login-enrollment"
                type="text"
                value={barEnrollment}
                onChange={(e) => setBarEnrollment(e.target.value.toUpperCase())}
                placeholder="e.g. DL/1234/2018"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 text-slate-900 text-sm focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-400 transition-all font-mono uppercase font-medium shadow-inner"
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
                onClick={() => alert(language === 'en' ? 'Password reset link sent to your registered advocate email.' : 'डेमो: पासवर्ड रीसेट लिंक भेजा गया।')}
                className="text-xs font-semibold text-sky-700 hover:text-sky-900 hover:underline cursor-pointer"
              >
                {language === 'en' ? 'Forgot password?' : 'पासवर्ड भूल गए?'}
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="advocate-login-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 text-slate-900 text-sm focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-400 transition-all font-medium shadow-inner"
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

          {/* Options: Keep me logged in & Bar Verified indicator */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-700 cursor-pointer select-none font-medium">
              <input
                type="checkbox"
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
                className="w-4 h-4 rounded text-slate-900 focus:ring-slate-800 border-slate-300"
              />
              <span>{language === 'en' ? 'Keep me logged in' : 'मुझे लॉग इन रखें'}</span>
            </label>

            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-900 bg-sky-500/15 px-2.5 py-0.5 rounded-full border border-sky-300/40">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>Bar Verified</span>
            </span>
          </div>

          {/* Primary Submit Button */}
          <button
            id="advocate-signin-submit-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-[0_4px_16px_rgba(15,23,42,0.25)] border border-white/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
          >
            <Briefcase className="w-4 h-4 text-sky-400" />
            <span>{isSubmitting ? (language === 'en' ? 'Verifying Credentials...' : 'सत्यापित हो रहा है...') : (language === 'en' ? 'Sign In as Advocate' : 'अधिवक्ता के रूप में साइन इन करें')}</span>
          </button>
        </form>

        {/* Quick Demo Fill Section */}
        <div className="p-3.5 bg-white/50 backdrop-blur-md border border-white/80 rounded-2xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-sky-600" />
              <span>{language === 'en' ? 'Quick Demo Fill' : 'क्विक डेमो ऑटो-फ़िल'}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              id="advocate-demo-citizen-btn"
              onClick={handleDemoFillCitizen}
              className="py-1.5 px-2.5 rounded-xl bg-white/80 hover:bg-white text-slate-800 border border-slate-200/80 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-97"
            >
              <span>Citizen Demo</span>
              <span className="text-[10px] text-slate-500 font-bold">→ Switch</span>
            </button>

            <button
              type="button"
              id="advocate-demo-fill-btn"
              onClick={handleDemoFillAdvocate}
              className="py-1.5 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-white/20 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-97"
            >
              <span>Advocate Demo</span>
              <span className="text-[10px] text-sky-400 font-bold">→ Fill</span>
            </button>
          </div>
        </div>

        {/* Bottom Verification Note & Register Link */}
        <div className="text-center pt-2 space-y-3">
          <p className="text-xs text-slate-600 font-medium">
            {language === 'en' ? "Don't have an advocate account?" : 'अधिवक्ता खाता नहीं है?'}{' '}
            <button
              type="button"
              id="advocate-to-register-btn"
              onClick={() => onNavigate('auth/register/advocate')}
              className="font-bold text-sky-700 hover:text-sky-900 hover:underline cursor-pointer"
            >
              {language === 'en' ? 'Create New Account' : 'नया खाता बनाएं'}
            </button>
          </p>

          <p className="text-[11px] text-amber-900 bg-amber-500/10 backdrop-blur-md p-2.5 rounded-2xl border border-amber-300/40 leading-relaxed font-semibold">
            {language === 'en'
              ? 'Notice: Advocate accounts require State Bar Council verification before activation.'
              : 'सूचना: अधिवक्ता खातों को सक्रिय करने से पहले राज्य बार काउंसिल सत्यापन आवश्यक है।'}
          </p>
        </div>

      </div>
    </AuthLayout>
  );
}
