import React, { useState } from 'react';
import { 
  Calendar, Clock, Video, Phone, Users, CheckCircle2, 
  XCircle, AlertCircle, ArrowRight, ExternalLink, RefreshCw, X, ShieldCheck
} from 'lucide-react';
import { Language, AppRoute, Appointment } from '../../types';
import { getStoredAppointments, updateAppointmentStatus, saveAppointment } from '../../data/portalData';

interface MyAppointmentsPageProps {
  language: Language;
  onNavigate: (route: AppRoute) => void;
}

export function MyAppointmentsPage({
  language,
  onNavigate,
}: MyAppointmentsPageProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [appointments, setAppointments] = useState<Appointment[]>(() => getStoredAppointments());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [rescheduleModalApt, setRescheduleModalApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('04:00 PM');
  const [cancelModalApt, setCancelModalApt] = useState<Appointment | null>(null);

  const filteredAppointments = appointments.filter(apt => apt.status === activeTab);

  const handleCancel = (apt: Appointment) => {
    updateAppointmentStatus(apt.id, 'cancelled');
    setAppointments(getStoredAppointments());
    setCancelModalApt(null);
  };

  const handleReschedule = () => {
    if (!rescheduleModalApt || !newDate) return;
    const updated: Appointment = {
      ...rescheduleModalApt,
      date: newDate,
      time: newTime,
      status: 'upcoming'
    };
    saveAppointment(updated);
    setAppointments(getStoredAppointments());
    setRescheduleModalApt(null);
  };

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
              ? 'Manage scheduled consultations, video sessions, and counsel representations.'
              : 'वकीलों के साथ निर्धारित सत्र, वीडियो परामर्श और समयरेखा प्रबंधित करें।'}
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
          className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'upcoming'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-sky-50'
          }`}
        >
          {language === 'en' ? 'Upcoming' : 'आगामी'} ({appointments.filter(a => a.status === 'upcoming').length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'completed'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-sky-50'
          }`}
        >
          {language === 'en' ? 'Completed' : 'संपन्न'} ({appointments.filter(a => a.status === 'completed').length})
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'cancelled'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-sky-50'
          }`}
        >
          {language === 'en' ? 'Cancelled' : 'रद्द'} ({appointments.filter(a => a.status === 'cancelled').length})
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
              className="bg-white rounded-2xl p-5 border border-sky-100 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
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

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    apt.status === 'upcoming' 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                      : apt.status === 'completed'
                      ? 'bg-slate-100 text-slate-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}>
                    {apt.status}
                  </span>
                </div>

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

                {apt.status === 'upcoming' && (
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
                    {apt.meetingLink ? (
                      <a
                        href={apt.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 px-3.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Call</span>
                      </a>
                    ) : (
                      <button
                        onClick={() => alert(`Advocate contact: ${apt.advocatePhone}`)}
                        className="py-2 px-3.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold"
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

              {selectedAppointment.meetingLink && (
                <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-sky-700 font-bold block">Encrypted Video Conference</span>
                    <span className="text-xs text-slate-600 font-mono truncate">Google Meet Session Active</span>
                  </div>
                  <a
                    href={selectedAppointment.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="py-1.5 px-3 bg-sky-600 text-white rounded-lg font-bold text-xs hover:bg-sky-700"
                  >
                    Open Link
                  </a>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-between gap-2 border-t border-slate-100">
              {selectedAppointment.status === 'upcoming' && (
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
