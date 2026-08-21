import React, { useState } from 'react';
import { 
  Calendar, Clock, Video, Phone, Users, FileText, CheckCircle2, 
  ArrowLeft, ArrowRight, ShieldCheck, Scale, AlertCircle, Check
} from 'lucide-react';
import { Language, AppRoute, Advocate, Appointment, Application, AuthUser } from '../../types';
import { saveAppointment, saveApplication } from '../../data/portalData';

interface AppointmentBookingFlowProps {
  advocate: Advocate;
  currentUser?: AuthUser;
  user?: AuthUser;
  language: Language;
  onNavigate: (route: AppRoute, params?: any) => void;
  onBookingComplete?: (appointment: Appointment) => void;
}

export function AppointmentBookingFlow({
  advocate,
  currentUser: propCurrentUser,
  user: propUser,
  language,
  onNavigate,
  onBookingComplete,
}: AppointmentBookingFlowProps) {
  const currentUser = propCurrentUser || propUser || {
    id: 'demo_citizen',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@gmail.com',
    phone: '+91 98765 43210',
    role: 'citizen' as const,
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [purpose, setPurpose] = useState('Consumer Grievance / Defective Product');
  const [courtLevel, setCourtLevel] = useState('District Court / Consumer Forum');
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState('04:00 PM');
  const [consultationType, setConsultationType] = useState<'Video' | 'Audio' | 'In-Person'>('Video');
  const [issueDescription, setIssueDescription] = useState('');
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  const purposes = [
    'Consumer Grievance / Defective Product',
    'Cyber Financial Fraud / Phishing',
    'Tenant Security Deposit & Eviction Notice',
    'Unpaid Salary & Employment Dispute',
    'Police Complaint & Zero FIR / Bail',
    'Family Court & Maintenance Matter',
    'Property Document Title & Verification',
    'General Pre-Litigation Advisory',
  ];

  const courtLevels = [
    'District Court / Sessions Court',
    'High Court',
    'Supreme Court of India',
    'Consumer Forum / Tribunal (E-Daakhil / NCLT / RERA)',
    'Pre-Litigation / Statutory Legal Notice Stage',
  ];

  const timeSlots = [
    '10:00 AM',
    '11:30 AM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM',
    '06:30 PM',
  ];

  const consultationModes = [
    {
      id: 'Video',
      title: 'Video Consultation',
      desc: 'Secure end-to-end encrypted video meeting link provided upon confirmation.',
      icon: Video,
    },
    {
      id: 'Audio',
      title: 'Audio Call',
      desc: 'Direct telephonic conference call on your registered mobile number.',
      icon: Phone,
    },
    {
      id: 'In-Person',
      title: 'In-Person Office Meeting',
      desc: `Meet at advocate's chambers in ${advocate.city}.`,
      icon: Users,
    },
  ];

  // Handle final submission
  const handleConfirmBooking = () => {
    const aptRefId = `APT-${Date.now().toString().slice(-4)}`;
    const appRefId = `NS-${Date.now().toString().slice(-4)}`;

    const newAppointment: Appointment = {
      id: `apt_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userPhone: currentUser.phone,
      advocateId: advocate.id,
      advocateName: advocate.name,
      advocateSpecialty: advocate.practiceAreas.join(' • '),
      advocatePhone: advocate.phone,
      category: purpose,
      courtLevel,
      date: selectedDate,
      time: selectedTime,
      consultationType,
      issue: issueDescription || 'General legal consultation request.',
      fee: advocate.consultationFee,
      status: 'upcoming',
      meetingLink: consultationType === 'Video' ? `https://meet.google.com/nyaay-sarathi-session-${aptRefId.toLowerCase()}` : undefined,
      applicationId: appRefId,
      createdAt: new Date().toISOString(),
    };

    const newApplication: Application = {
      id: `app_${Date.now()}`,
      applicationId: appRefId,
      userId: currentUser.id,
      advocateId: advocate.id,
      advocateName: advocate.name,
      advocateContact: advocate.phone,
      category: purpose,
      description: issueDescription || 'Consultation request and legal review.',
      appointmentId: newAppointment.id,
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
      fee: advocate.consultationFee,
      paymentStatus: 'Paid',
      acceptanceStatus: 'Accepted',
      status: 'Under Review',
      timeline: [
        { stage: 'Created', title: 'Consultation & Application Created', description: `Consultation confirmed with ${advocate.name}`, status: 'completed', date: new Date().toLocaleString() },
        { stage: 'Documents', title: 'Awaiting Consultation', description: 'Session scheduled with verified counsel', status: 'current' },
        { stage: 'Advocate Review', title: 'Advocate Legal Review', description: 'Notice drafting & legal strategy formulation', status: 'pending' },
        { stage: 'Submitted', title: 'Submission / Notice Service', description: 'Filing before competent authority', status: 'pending' },
        { stage: 'Resolved', title: 'Resolution', description: 'Matter settled / completed', status: 'pending' },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveAppointment(newAppointment);
    saveApplication(newApplication);
    setConfirmedAppointment(newAppointment);
    setCurrentStep(8);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      
      {/* Back Button */}
      {currentStep < 8 && (
        <button
          onClick={() => {
            if (currentStep > 1) {
              setCurrentStep(currentStep - 1);
            } else {
              onNavigate('appointments');
            }
          }}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-sky-700 transition-colors cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-sky-100 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{currentStep === 1 ? 'Back to Discovery' : 'Previous Step'}</span>
        </button>
      )}

      {/* Booking Header & Progress Steps */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xs space-y-6">
        
        {/* Advocate Brief Bar */}
        <div className="flex items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center font-bold text-lg shrink-0">
              {advocate.name.split(' ').slice(1, 3).map(n => n[0]).join('') || 'AD'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">{advocate.name}</h2>
                <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-500">{advocate.practiceAreas.join(' • ')}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Fee</span>
            <span className="text-base sm:text-lg font-extrabold text-slate-900">₹{advocate.consultationFee}</span>
          </div>
        </div>

        {/* Step Indicator (1 to 7) */}
        {currentStep < 8 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Step {currentStep} of 7</span>
              <span className="text-sky-700">
                {currentStep === 1 && 'Consultation Purpose'}
                {currentStep === 2 && 'Court / Forum Level'}
                {currentStep === 3 && 'Consultation Date'}
                {currentStep === 4 && 'Time Slot'}
                {currentStep === 5 && 'Consultation Mode'}
                {currentStep === 6 && 'Problem Summary'}
                {currentStep === 7 && 'Review & Confirm'}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-sky-600 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 7) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Step 1: Select Purpose */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">1. What is the primary purpose of your consultation?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {purposes.map((p) => (
                <button
                  key={p}
                  onClick={() => setPurpose(p)}
                  className={`p-3.5 rounded-2xl text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                    purpose === p 
                      ? 'bg-sky-50 border-2 border-sky-600 text-sky-900 font-bold shadow-2xs' 
                      : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-sky-50/50'
                  }`}
                >
                  <span>{p}</span>
                  {purpose === p && <Check className="w-4 h-4 text-sky-600 shrink-0" />}
                </button>
              ))}
            </div>
            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                className="py-2.5 px-5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select Court / Forum Level */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">2. Relevant Court or Forum Level</h3>
            <p className="text-xs text-slate-500">Select where your dispute is currently pending or intended to be instituted.</p>
            <div className="space-y-2">
              {courtLevels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setCourtLevel(lvl)}
                  className={`w-full p-3.5 rounded-2xl text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                    courtLevel === lvl 
                      ? 'bg-sky-50 border-2 border-sky-600 text-sky-900 font-bold shadow-2xs' 
                      : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-sky-50/50'
                  }`}
                >
                  <span>{lvl}</span>
                  {courtLevel === lvl && <Check className="w-4 h-4 text-sky-600 shrink-0" />}
                </button>
              ))}
            </div>
            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="py-2.5 px-5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Select Date */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">3. Select Preferred Date</h3>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-700">Choose Consultation Date</label>
              <input
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm font-semibold focus:outline-none focus:border-sky-500"
              />
              <p className="text-[11px] text-slate-500">
                Advocate {advocate.name} is accepting consultations for the chosen day.
              </p>
            </div>
            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="py-2.5 px-5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Select Time Slot */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">4. Select Available Time Slot</h3>
            <p className="text-xs text-slate-500">All slots are 30 minutes in duration (Indian Standard Time).</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={`p-3.5 rounded-2xl text-center text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    selectedTime === slot 
                      ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/20' 
                      : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-sky-50/50'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{slot}</span>
                </button>
              ))}
            </div>
            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setCurrentStep(3)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(5)}
                className="py-2.5 px-5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Select Consultation Method */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">5. Select Consultation Method</h3>
            <div className="space-y-3">
              {consultationModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setConsultationType(mode.id as any)}
                  className={`w-full p-4 rounded-2xl text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                    consultationType === mode.id 
                      ? 'bg-sky-50 border-2 border-sky-600 text-sky-950 font-bold shadow-2xs' 
                      : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-sky-50/50'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${consultationType === mode.id ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
                    <mode.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{mode.title}</h4>
                    <p className="text-xs text-slate-500 font-normal mt-0.5">{mode.desc}</p>
                  </div>
                  {consultationType === mode.id && <Check className="w-5 h-5 text-sky-600 shrink-0" />}
                </button>
              ))}
            </div>
            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setCurrentStep(4)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(6)}
                className="py-2.5 px-5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Briefly Describe Issue */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">6. Briefly Describe Your Legal Problem</h3>
            <p className="text-xs text-slate-500">Provide key facts, dates, amounts, and relevant parties involved to help the advocate prepare.</p>
            <textarea
              rows={4}
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="e.g. Purchased a defective machine online on 12th Aug, vendor refuses refund. Want to issue a statutory legal notice under Consumer Protection Act..."
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:border-sky-500"
            />
            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setCurrentStep(5)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(7)}
                className="py-2.5 px-5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Review Appointment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 7: Review & Confirm */}
        {currentStep === 7 && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-slate-900">7. Review & Confirm Consultation</h3>
            
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Advocate</span>
                  <span className="text-sm font-bold text-slate-900">{advocate.name}</span>
                  <span className="text-[11px] text-slate-500 block">{advocate.practiceAreas.join(', ')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Citizen (You)</span>
                  <span className="text-sm font-bold text-slate-900">{currentUser.name}</span>
                  <span className="text-[11px] text-slate-500 block">{currentUser.phone} • {currentUser.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Date & Time</span>
                  <span className="font-bold text-slate-800">{selectedDate} at {selectedTime}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Consultation Mode</span>
                  <span className="font-bold text-sky-700">{consultationType} Consultation</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Purpose & Forum</span>
                <p className="font-semibold text-slate-800">{purpose} ({courtLevel})</p>
                {issueDescription && (
                  <p className="text-[11px] text-slate-600 italic mt-1 bg-white p-2 rounded-lg border border-slate-200">
                    "{issueDescription}"
                  </p>
                )}
              </div>

              <div className="pt-2 flex items-center justify-between bg-sky-50 p-3 rounded-xl border border-sky-200">
                <span className="text-xs font-bold text-slate-800">Total Consultation Fee</span>
                <span className="text-base font-extrabold text-slate-900">₹{advocate.consultationFee}</span>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setCurrentStep(6)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                id="btn-confirm-appointment-booking"
                onClick={handleConfirmBooking}
                className="py-3 px-6 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-sky-600/20 active:scale-95 transition-all"
              >
                <CheckCircle2 className="w-4 h-4 text-sky-200" />
                <span>Confirm & Schedule</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 8: Confirmed Success Screen */}
        {currentStep === 8 && confirmedAppointment && (
          <div className="text-center py-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center border-2 border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Appointment Successfully Scheduled
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 pt-2">
                Consultation Confirmed with {advocate.name}
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Booking Reference ID: {confirmedAppointment.id}
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left text-xs max-w-lg mx-auto space-y-2">
              <p className="flex justify-between">
                <span className="text-slate-500">Scheduled Date:</span>
                <strong className="text-slate-800">{confirmedAppointment.date}</strong>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-500">Scheduled Time:</span>
                <strong className="text-slate-800">{confirmedAppointment.time}</strong>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-500">Mode:</span>
                <strong className="text-sky-700">{confirmedAppointment.consultationType} Meeting</strong>
              </p>
              {confirmedAppointment.meetingLink && (
                <p className="flex justify-between">
                  <span className="text-slate-500">Meeting Link:</span>
                  <a 
                    href={confirmedAppointment.meetingLink} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-sky-600 font-bold hover:underline"
                  >
                    Open Google Meet
                  </a>
                </p>
              )}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('user/appointments')}
                className="w-full sm:w-auto py-2.5 px-5 bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs cursor-pointer"
              >
                View My Appointments
              </button>
              <button
                onClick={() => onNavigate('user/applications')}
                className="w-full sm:w-auto py-2.5 px-5 bg-white border border-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Track in My Applications
              </button>
              <button
                onClick={() => onNavigate('user/home')}
                className="w-full sm:w-auto py-2.5 px-5 text-slate-500 hover:text-slate-900 text-xs font-semibold cursor-pointer"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
