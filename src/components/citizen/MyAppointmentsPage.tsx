import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Video, Phone, Users, CheckCircle2, 
  XCircle, AlertCircle, ArrowRight, ExternalLink, RefreshCw, X, ShieldCheck,
  AlertTriangle, CreditCard
} from 'lucide-react';
import { Language, AppRoute, Appointment } from '../../types';
import { updateAppointmentStatus, saveAppointment } from '../../data/portalData';
import { apiGetAppointments, apiUpdateAppointmentStatus, apiCreateAppointment } from '../../services/apiClient';
import { AdvocateResponseTimer } from './AdvocateResponseTimer';

interface MyAppointmentsPageProps {
  language: Language;
  onNavigate: (route: AppRoute) => void;
}

export function MyAppointmentsPage({
  language,
  onNavigate,
}: MyAppointmentsPageProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [rescheduleModalApt, setRescheduleModalApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('04:00 PM');
  const [cancelModalApt, setCancelModalApt] = useState<Appointment | null>(null);

  const refreshAppointments = async () => {
    try {
      const serverApts = await apiGetAppointments();
      if (serverApts) {
        setAppointments(serverApts);
        return;
      }
    } catch (e) {
      // fallback
    }
    setAppointments([]);
  };

  useEffect(() => {
    refreshAppointments();
  }, []);

  const filteredAppointments = appointments.filter(apt => {
    if (activeTab === 'upcoming') {
      return apt.status === 'upcoming' || apt.status === 'confirmed' || apt.status === 'pending';
    }
    if (activeTab === 'completed') {
      return apt.status === 'completed';
    }
    if (activeTab === 'cancelled') {
      return apt.status === 'cancelled' || apt.status === 'expired' || apt.status === 'no-response';
    }
    return true;
  });

  const handleCancel = (apt: Appointment) => {
    updateAppointmentStatus(apt.id, 'cancelled');
    apiUpdateAppointmentStatus(apt.id, 'cancelled');
    setAppointments(prev => prev.map(a => a.id === apt.id ? { ...a, status: 'cancelled' } : a));
    setCancelModalApt(null);
  };

  const handleReschedule = () => {
    if (!rescheduleModalApt || !newDate) return;
    const updated: Appointment = {
      ...rescheduleModalApt,
      date: newDate,
      time: newTime,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    saveAppointment(updated);
    apiCreateAppointment(updated);
    setAppointments(prev => prev.map(a => a.id === updated.id ? updated : a));
    setRescheduleModalApt(null);
  };

  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const upcomingCount = appointments.filter(a => a.status === 'upcoming' || a.status === 'confirmed' || a.status === 'pending').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;
  const cancelledCount = appointments.filter(a => a.status === 'cancelled' || a.status === 'expired' || a.status === 'no-response').length;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-700 uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-sky-600" />
            <span>{language === 'en' ? 'Consultation Manager' : 'परामर्श व नियुक्तियां'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {language === 'en' ? 'My Appointments' : 'मेरी कानूनी नियुक्तियां'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'en'
              ? 'Manage scheduled consultations, video sessions, and track 24-hour advocate responses.'
              : 'वकीलों के साथ निर्धारित सत्र, वीडियो परामर्श और 24-घंटे की स्वीकृति समयरेखा प्रबंधित करें।'}
          </p>
        </div>

        <button
          id="btn-book-new-apt-top"
          onClick={() => onNavigate('appointments')}
          className="py-3 px-5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold shadow-sm shadow-sky-600/20 flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <span>{language === 'en' ? 'Book New Appointment' : 'नया अपॉइंटमेंट लें'}</span>
          <ArrowRight className="w-4 h-4 text-sky-200" />
        </button>
      </div>

      {/* Tabs: Upcoming / Completed / Cancelled */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'upcoming'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-sky-50'
          }`}
        >
          <span>{language === 'en' ? 'Upcoming & Pending' : 'आगामी व प्रतीक्षारत'}</span>
          <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-white/20">({upcomingCount})</span>
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'completed'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-sky-50'
          }`}
        >
          {language === 'en' ? 'Completed' : 'संपन्न'} ({completedCount})
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'cancelled'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-sky-50'
          }`}
        >
          {language === 'en' ? 'Expired / Cancelled' : 'समाप्त / रद्द'} ({cancelledCount})
        </button>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-sky-100 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {language === 'en' ? `No ${activeTab} appointments found.` : `कोई ${activeTab} अपॉइंटमेंट नहीं मिला।`}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {language === 'en' 
              ? 'Consult verified advocates for civil, criminal, consumer, cyber or tenancy disputes.' 
              : 'सत्यापित अधिवक्ताओं से तुरंत कानूनी सलाह प्राप्त करें।'}
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('appointments')}
              className="py-2.5 px-5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              {language === 'en' ? 'Find an Advocate' : 'अधिवक्ता खोजें'}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAppointments.map((apt) => (
            <div 
              key={apt.id}
              className={`bg-white rounded-2xl p-5 border shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 ${
                apt.status === 'pending' ? 'border-amber-200/90 bg-amber-50/20' : 'border-sky-100'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center font-bold text-base shrink-0">
                      {apt.advocateName.split(' ').slice(1, 3).map(n => n[0]).join('') || 'AD'}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{apt.advocateName}</h3>
                      <p className="text-xs text-sky-700 font-semibold">{apt.advocateSpecialty}</p>
                      <p className="text-[11px] text-slate-500 font-mono">Ref: {apt.id}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {apt.status === 'pending' && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                      <span>Pending Advocate Response</span>
                    </span>
                  )}
                  {(apt.status === 'upcoming' || apt.status === 'confirmed') && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                      Confirmed
                    </span>
                  )}
                  {(apt.status === 'expired' || apt.status === 'no-response') && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                      No Response from Advocate
                    </span>
                  )}
                  {apt.status === 'completed' && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 uppercase">
                      Completed
                    </span>
                  )}
                  {apt.status === 'cancelled' && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 uppercase">
                      Cancelled
                    </span>
                  )}
                </div>

                {/* 24-Hour Countdown Timer for Pending Appointments */}
                {apt.status === 'pending' && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/90 flex items-center justify-between">
                    <AdvocateResponseTimer
                      createdAt={apt.createdAt}
                      onExpire={refreshAppointments}
                      compact={false}
                    />
                  </div>
                )}

                {/* Expired Message banner */}
                {(apt.status === 'expired' || apt.status === 'no-response') && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-700 font-medium">
                    {language === 'en'
                      ? 'The advocate did not respond within the 24-hour response window. You can choose another advocate immediately.'
                      : 'अधिवक्ता ने 24 घंटे के भीतर उत्तर नहीं दिया। आप दूसरा अधिवक्ता चुन सकते हैं।'}
                  </div>
                )}

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span className="flex items-center gap-1.5 text-sky-700">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{apt.date} • {apt.time}</span>
                    </span>
                    <span className="text-slate-900">₹{apt.fee}</span>
                  </div>

                  <div className="text-[11px] text-slate-600 flex items-center justify-between">
                    <span>Mode: <strong>{apt.consultationType} Consultation</strong></span>
                    {apt.applicationId && (
                      <span className="font-mono text-sky-700">App #{apt.applicationId}</span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-1 italic pt-1 border-t border-slate-200/60">
                    "{apt.issue}"
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedAppointment(apt)}
                  className="py-2 px-3 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  View Details
                </button>

                {/* Choose another advocate button for expired appointments */}
                {(apt.status === 'expired' || apt.status === 'no-response') && (
                  <button
                    onClick={() => onNavigate('appointments')}
                    className="py-2 px-3.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <span>Choose Another Advocate</span>
                    <ArrowRight className="w-3.5 h-3.5 text-sky-200" />
                  </button>
                )}

                {(apt.status === 'upcoming' || apt.status === 'confirmed' || apt.status === 'pending') && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setRescheduleModalApt(apt);
                        setNewDate(apt.date);
                        setNewTime(apt.time);
                      }}
                      className="py-2 px-3 rounded-lg text-slate-600 hover:text-sky-700 hover:bg-sky-50 text-xs font-semibold cursor-pointer"
                    >
                      Reschedule
                    </button>
                    {(apt.status === 'upcoming' || apt.status === 'confirmed') ? (
                      <button
                        id={`btn-pay-consultation-fee-${apt.id}`}
                        onClick={() => {
                          window.open('https://paytm.com', '_blank', 'noopener,noreferrer');
                        }}
                        className="py-2 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all active:scale-95"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay Consultation Fee</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => alert(`Advocate contact: ${apt.advocatePhone}`)}
                        className="py-2 px-3.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold cursor-pointer"
                      >
                        Contact
                      </button>
                    )}
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Consultation Particulars</h3>
                <p className="text-xs text-slate-500 font-mono">Reference: {selectedAppointment.id}</p>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Response Timer Banner inside modal if pending */}
              {selectedAppointment.status === 'pending' && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/90 space-y-1.5">
                  <span className="text-[10px] text-amber-800 font-bold uppercase block">Advocate Review Window</span>
                  <AdvocateResponseTimer createdAt={selectedAppointment.createdAt} />
                  <p className="text-[11px] text-amber-800 leading-normal">
                    The advocate will accept your booking within 24 hours. You will receive an instant confirmation update here.
                  </p>
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Assigned Counsel</span>
                <p className="text-sm font-bold text-slate-900">{selectedAppointment.advocateName}</p>
                <p className="text-xs text-sky-700 font-semibold">{selectedAppointment.advocateSpecialty}</p>
                <p className="text-xs text-slate-600">Contact: {selectedAppointment.advocatePhone}</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Scheduled Slot</span>
                  <span className="font-bold text-slate-800">{selectedAppointment.date}</span>
                  <span className="block text-slate-600">{selectedAppointment.time}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Mode & Fee</span>
                  <span className="font-bold text-sky-700">{selectedAppointment.consultationType} Consultation</span>
                  <span className="block text-slate-800 font-bold">₹{selectedAppointment.fee} (Paid)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Citizen Problem Statement</span>
                <p className="text-slate-700 leading-relaxed font-normal">{selectedAppointment.issue}</p>
              </div>

              {(selectedAppointment.status === 'upcoming' || selectedAppointment.status === 'confirmed') && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">
                      Consultation Fee Payment
                    </span>
                    <span className="text-xs text-slate-700 font-medium">
                      Fee: ₹{selectedAppointment.fee} • Official Paytm Gateway
                    </span>
                  </div>
                  <button
                    id="btn-modal-pay-consultation-fee"
                    onClick={() => {
                      window.open('https://paytm.com', '_blank', 'noopener,noreferrer');
                    }}
                    className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-all active:scale-95"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Pay Consultation Fee</span>
                  </button>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-between gap-2 border-t border-slate-100">
              {(selectedAppointment.status === 'upcoming' || selectedAppointment.status === 'pending') && (
                <button
                  onClick={() => {
                    const apt = selectedAppointment;
                    setSelectedAppointment(null);
                    setCancelModalApt(apt);
                  }}
                  className="py-2 px-3 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold"
                >
                  Cancel Appointment
                </button>
              )}

              {(selectedAppointment.status === 'expired' || selectedAppointment.status === 'no-response') && (
                <button
                  onClick={() => {
                    setSelectedAppointment(null);
                    onNavigate('appointments');
                  }}
                  className="py-2 px-4 bg-sky-600 text-white rounded-xl text-xs font-bold hover:bg-sky-700"
                >
                  Choose Another Advocate
                </button>
              )}

              <button
                onClick={() => setSelectedAppointment(null)}
                className="py-2 px-4 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 ml-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModalApt && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Reschedule Consultation</h3>
            <p className="text-xs text-slate-500">Pick a new date and time slot for your appointment with {rescheduleModalApt.advocateName}.</p>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">New Date</label>
                <input
                  type="date"
                  value={newDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">New Time Slot</label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                >
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="05:30 PM">05:30 PM</option>
                </select>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                onClick={() => setRescheduleModalApt(null)}
                className="py-2 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleReschedule}
                className="py-2 px-4 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalApt && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Cancel Appointment?</h3>
                <p className="text-xs text-slate-500">This action will release your scheduled time slot.</p>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                onClick={() => setCancelModalApt(null)}
                className="py-2 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
              >
                Keep Appointment
              </button>
              <button
                onClick={() => handleCancel(cancelModalApt)}
                className="py-2 px-4 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
