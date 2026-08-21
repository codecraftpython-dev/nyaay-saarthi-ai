import React, { useState, useRef } from 'react';
import { 
  User, Mail, Phone, Calendar, MapPin, ShieldCheck, 
  Camera, Lock, CheckCircle2, AlertCircle, Save, ArrowRight,
  FileText, Bookmark, Settings
} from 'lucide-react';
import { Language, AppRoute, AuthUser } from '../../types';
import { DEFAULT_CITIZEN_AVATAR, saveStoredUser } from '../../data/portalData';

interface UserProfilePageProps {
  user: AuthUser;
  language: Language;
  onNavigate: (route: AppRoute) => void;
  onUpdateUser: (updatedUser: AuthUser) => void;
}

export function UserProfilePage({
  user,
  language,
  onNavigate,
  onUpdateUser,
}: UserProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<AuthUser>({ ...user });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Password change state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Photo Upload (Convert to Base64 so it persists reliably in DB/LocalStorage)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Photo size should be under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      const updated = { ...formData, profilePicture: base64Data };
      setFormData(updated);
      saveStoredUser(updated);
      onUpdateUser(updated);
      setSuccessMessage('Profile photo updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMessage('Name, email and mobile number are required.');
      return;
    }

    saveStoredUser(formData);
    onUpdateUser(formData);
    setIsEditing(false);
    setSuccessMessage('Profile details saved successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordSuccess('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => {
      setPasswordSuccess('');
      setShowPasswordSection(false);
    }, 2500);
  };

  const photoSrc = user.profilePicture || DEFAULT_CITIZEN_AVATAR;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-700 uppercase tracking-wider">
            <User className="w-4 h-4 text-sky-600" />
            <span>{language === 'en' ? 'Citizen Account & Verification' : 'नागरिक खाता व विवरण'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {language === 'en' ? 'My Profile' : 'मेरी प्रोफ़ाइल'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'en'
              ? 'Manage your personal details, contact information, and security credentials.'
              : 'व्यक्तिगत विवरण, संपर्क जानकारी और सुरक्षा सेटिंग्स प्रबंधित करें।'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              id="btn-edit-profile-toggle"
              onClick={() => setIsEditing(true)}
              className="py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold shadow-xs cursor-pointer"
            >
              {language === 'en' ? 'Edit Details' : 'विवरण संपादित करें'}
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs sm:text-sm font-bold cursor-pointer"
            >
              {language === 'en' ? 'Cancel' : 'रद्द करें'}
            </button>
          )}
        </div>
      </div>

      {/* Status Notifications */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Photo & Quick Navigation */}
        <div className="space-y-6">
          
          {/* Profile Card */}
          <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-2xs text-center space-y-4">
            <div className="relative w-28 h-28 mx-auto">
              <div className="w-full h-full rounded-full overflow-hidden border-3 border-sky-200 bg-sky-50 shadow-inner">
                <img
                  src={photoSrc}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_CITIZEN_AVATAR;
                  }}
                />
              </div>

              {/* Upload Photo Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-sky-600 hover:bg-sky-700 text-white shadow-md border-2 border-white cursor-pointer"
                title="Upload new profile picture"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
              <p className="text-xs text-slate-500">{user.email}</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-150 mt-1">
                <ShieldCheck className="w-3 h-3 text-sky-600" />
                <span>Verified Indian Citizen</span>
              </span>
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 text-left space-y-2">
              <p className="flex items-center justify-between">
                <span>Account Role:</span>
                <strong className="text-slate-800 uppercase text-[10px]">Citizen Portal</strong>
              </p>
              <p className="flex items-center justify-between">
                <span>City:</span>
                <strong className="text-slate-800">{user.city || 'New Delhi'}</strong>
              </p>
              <p className="flex items-center justify-between">
                <span>State:</span>
                <strong className="text-slate-800">{user.state || 'Delhi'}</strong>
              </p>
            </div>
          </div>

          {/* Quick Portal Navigation Links */}
          <div className="bg-white rounded-2xl p-4 border border-sky-100 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 block">
              Quick Shortcuts
            </span>
            <button
              onClick={() => onNavigate('user/appointments')}
              className="w-full p-2.5 rounded-xl hover:bg-sky-50 text-left text-xs font-semibold text-slate-700 hover:text-sky-700 flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-sky-600" />
                <span>My Appointments</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigate('user/applications')}
              className="w-full p-2.5 rounded-xl hover:bg-sky-50 text-left text-xs font-semibold text-slate-700 hover:text-sky-700 flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-sky-600" />
                <span>My Applications</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigate('user/saved')}
              className="w-full p-2.5 rounded-xl hover:bg-sky-50 text-left text-xs font-semibold text-slate-700 hover:text-sky-700 flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Bookmark className="w-3.5 h-3.5 text-sky-600" />
                <span>Saved Rights</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigate('user/settings')}
              className="w-full p-2.5 rounded-xl hover:bg-sky-50 text-left text-xs font-semibold text-slate-700 hover:text-sky-700 flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-3.5 h-3.5 text-sky-600" />
                <span>Account Settings</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

        </div>

        {/* Right 2 Columns: Profile Details Form / Security Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Personal Information Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-sky-100 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Personal & Contact Particulars</h3>
              {isEditing && (
                <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                  Editing Mode
                </span>
              )}
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                  ) : (
                    <p className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800">
                      {user.name}
                    </p>
                  )}
                </div>

                {/* Mobile Number */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Mobile Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                  ) : (
                    <p className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800">
                      {user.phone}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                  ) : (
                    <p className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800">
                      {user.email}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={formData.dob || '1992-05-14'}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                  ) : (
                    <p className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800">
                      {user.dob || '14 May 1992'}
                    </p>
                  )}
                </div>

                {/* State */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">State / UT</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.state || 'Delhi'}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                  ) : (
                    <p className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800">
                      {user.state || 'Delhi'}
                    </p>
                  )}
                </div>

                {/* City */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">City / District</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.city || 'New Delhi'}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                  ) : (
                    <p className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800">
                      {user.city || 'New Delhi'}
                    </p>
                  )}
                </div>

              </div>

              {/* Permanent Address */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Residential Address</label>
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={formData.address || 'B-42, Pocket 1, Mayur Vihar Phase 1, New Delhi - 110091'}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-sky-500"
                  />
                ) : (
                  <p className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800">
                    {user.address || 'B-42, Pocket 1, Mayur Vihar Phase 1, New Delhi - 110091'}
                  </p>
                )}
              </div>

              {isEditing && (
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="py-2 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Change Password Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-sky-100 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-sky-600" />
                <h3 className="text-base font-bold text-slate-900">Security & Password</h3>
              </div>
              {!showPasswordSection && (
                <button
                  onClick={() => setShowPasswordSection(true)}
                  className="text-xs font-bold text-sky-600 hover:text-sky-800 cursor-pointer"
                >
                  Change Password
                </button>
              )}
            </div>

            {passwordSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{passwordSuccess}</span>
              </div>
            )}
            {passwordError && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>{passwordError}</span>
              </div>
            )}

            {showPasswordSection ? (
              <form onSubmit={handleChangePassword} className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                    placeholder="••••••••"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                      placeholder="Minimum 6 characters"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                      placeholder="Re-type password"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordSection(false)}
                    className="py-2 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-xs text-slate-500">
                Password was last updated 14 days ago. Two-factor authentication via SMS OTP is active.
              </p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
