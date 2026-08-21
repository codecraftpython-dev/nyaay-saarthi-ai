import React, { useState } from 'react';
import { 
  Settings, Bell, Globe, ShieldCheck, Download, Trash2, 
  CheckCircle2, AlertTriangle, ArrowRight, Lock, Phone, Mail, X
} from 'lucide-react';
import { Language, AppRoute, AuthUser } from '../../types';

interface UserSettingsPageProps {
  user: AuthUser;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigate: (route: AppRoute) => void;
  onLogout: () => void;
}

export function UserSettingsPage({
  user,
  language,
  onLanguageChange,
  onNavigate,
  onLogout,
}: UserSettingsPageProps) {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const handleSavePreferences = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleExportData = () => {
    const exportPayload = {
      user,
      exportDate: new Date().toISOString(),
      platform: 'Nyaay सारथी Citizen Portal',
      compliance: 'Digital Personal Data Protection Act (DPDP), 2023',
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nyaay_sarathi_data_${user.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = () => {
    localStorage.removeItem('nyay_saathi_user');
    localStorage.removeItem('nyay_saathi_appointments');
    localStorage.removeItem('nyay_saathi_applications');
    localStorage.removeItem('nyay_saathi_saved_resources');
    localStorage.removeItem('nyay_saathi_chat_history');
    setDeleteModalOpen(false);
    onLogout();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-sky-700 uppercase tracking-wider">
          <Settings className="w-4 h-4 text-sky-600" />
          <span>{language === 'en' ? 'System & Privacy Preferences' : 'सिस्टम व गोपनीयता प्राथमिकताएं'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {language === 'en' ? 'Account Settings' : 'खाता सेटिंग्स'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {language === 'en'
            ? 'Configure notifications, language defaults, privacy preferences, and data rights.'
            : 'अधिसूचनाएं, भाषा विकल्प और डेटा गोपनीयता सेटिंग्स को प्रबंधित करें।'}
        </p>
      </div>

      {saveToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Preferences saved successfully!</span>
        </div>
      )}

      {/* 1. Language Preference */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-sky-100 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <Globe className="w-5 h-5 text-sky-600" />
          <div>
            <h3 className="text-base font-bold text-slate-900">Language Preference</h3>
            <p className="text-xs text-slate-500">Select your default reading and consultation language.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => onLanguageChange('en')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
              language === 'en'
                ? 'bg-sky-50 border-sky-600 ring-2 ring-sky-500/20 font-bold text-sky-950'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-sky-50/50'
            }`}
          >
            <div>
              <span className="text-sm font-bold block">English</span>
              <span className="text-xs text-slate-500 font-normal">Official legal notifications and documents</span>
            </div>
            {language === 'en' && <CheckCircle2 className="w-5 h-5 text-sky-600" />}
          </button>

          <button
            onClick={() => onLanguageChange('hi')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
              language === 'hi'
                ? 'bg-sky-50 border-sky-600 ring-2 ring-sky-500/20 font-bold text-sky-950'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-sky-50/50'
            }`}
          >
            <div>
              <span className="text-sm font-bold block">हिंदी (Hindi)</span>
              <span className="text-xs text-slate-500 font-normal">सरल हिंदी में अधिकार और कानूनी सहायता</span>
            </div>
            {language === 'hi' && <CheckCircle2 className="w-5 h-5 text-sky-600" />}
          </button>
        </div>
      </div>

      {/* 2. Notification Preferences */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-sky-100 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <Bell className="w-5 h-5 text-sky-600" />
          <div>
            <h3 className="text-base font-bold text-slate-900">Notification Alerts</h3>
            <p className="text-xs text-slate-500">Choose how you receive status updates regarding case filings and advocate calls.</p>
          </div>
        </div>

        <div className="space-y-3 pt-1 text-xs sm:text-sm">
          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer">
            <div>
              <span className="font-bold text-slate-900 block">Email Notifications</span>
              <span className="text-xs text-slate-500">Case milestone progress and consultation receipts sent to {user.email}</span>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-5 h-5 rounded text-sky-600 focus:ring-sky-500"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer">
            <div>
              <span className="font-bold text-slate-900 block">SMS Alerts</span>
              <span className="text-xs text-slate-500">Critical reminders 15 minutes before advocate consultation on {user.phone}</span>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="w-5 h-5 rounded text-sky-600 focus:ring-sky-500"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer">
            <div>
              <span className="font-bold text-slate-900 block">WhatsApp Updates</span>
              <span className="text-xs text-slate-500">Real-time status alerts from Nyaay सारथी Verified Business Account</span>
            </div>
            <input
              type="checkbox"
              checked={whatsappAlerts}
              onChange={(e) => setWhatsappAlerts(e.target.checked)}
              className="w-5 h-5 rounded text-sky-600 focus:ring-sky-500"
            />
          </label>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSavePreferences}
            className="py-2.5 px-5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs cursor-pointer"
          >
            Save Preferences
          </button>
        </div>
      </div>

      {/* 3. Privacy, DPDP Act & Data Rights */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-sky-100 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <ShieldCheck className="w-5 h-5 text-sky-600" />
          <div>
            <h3 className="text-base font-bold text-slate-900">Privacy & Data Governance</h3>
            <p className="text-xs text-slate-500">Digital Personal Data Protection Act (DPDP 2023) citizen controls.</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-150 text-xs text-slate-700 space-y-2">
          <p className="font-bold text-sky-950">Your Data Privacy Guarantees:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-600">
            <li>End-to-end encryption on all citizen grievance statements and consultation recordings.</li>
            <li>Zero sale of personal contact records to third-party commercial vendors.</li>
            <li>Right to access, rectify, and permanently erase personal records on request.</li>
          </ul>
        </div>

        <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-slate-800 block">Export Account Data</span>
            <span className="text-[11px] text-slate-500">Download a machine-readable JSON copy of your profile and case history.</span>
          </div>
          <button
            onClick={handleExportData}
            className="py-2 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-sky-600" />
            <span>Download Data Archive</span>
          </button>
        </div>
      </div>

      {/* 4. Danger Zone: Delete Account */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-rose-100 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-rose-100">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <div>
            <h3 className="text-base font-bold text-rose-950">Danger Zone</h3>
            <p className="text-xs text-rose-600/80">Permanent account closure and data deletion.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-900 block">Delete Account</span>
            <p className="text-xs text-slate-500 max-w-md">
              Permanently remove your citizen profile, appointment bookings, and application logs from the system.
            </p>
          </div>

          <button
            onClick={() => setDeleteModalOpen(true)}
            className="py-2.5 px-4 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 text-xs font-bold transition-all cursor-pointer shrink-0"
          >
            Delete My Account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal (Section 12) */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">Are you sure you want to delete your account?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                This action is permanent and cannot be undone. All your booked appointments, active applications, saved rights, and AI chat transcripts will be immediately purged.
              </p>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Keep Account
              </button>
              <button
                onClick={handleDeleteAccount}
                className="py-2.5 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Yes, Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
