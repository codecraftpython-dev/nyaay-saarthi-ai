import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Calendar, 
  Clock, 
  CheckCircle, 
  ExternalLink, 
  Scale, 
  Phone, 
  Mail, 
  Sparkles,
  Lock,
  FileCheck
} from 'lucide-react';
import { Language, FooterLink } from '../types';
import logoImg from '../assets/images/nyaay_sarathi_logo_1787153284213.jpg';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  actionKey: string | null;
  title: string | null;
  linkData?: FooterLink | null;
}

export function InteractiveDialogs({
  isOpen,
  onClose,
  language,
  actionKey,
  title,
  linkData,
}: DialogProps) {
  // Chat AI state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: language === 'en'
        ? 'Namaste! I am Nyaay सारथी AI. Ask me any question about Indian laws, consumer rights, tenant disputes, cyber fraud, or advocate consultations.'
        : 'नमस्ते! मैं न्याय सारथी AI हूँ। भारतीय कानून, उपभोक्ता अधिकार, किराया विवाद, साइबर ठगी या कानूनी परामर्श से संबंधित कोई भी प्रश्न पूछें।'
    }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Appointment state
  const [selectedDomain, setSelectedDomain] = useState('Consumer & E-Daakhil');
  const [selectedMode, setSelectedMode] = useState<'video' | 'phone' | 'in-person'>('video');
  const [selectedDate] = useState('Tomorrow, 3:00 PM');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Login state
  const [loginRole, setLoginRole] = useState<'citizen' | 'advocate'>('citizen');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loginSubmitted, setLoginSubmitted] = useState(false);

  // Contact form state
  const [contactSubmitted, setContactSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setChatInput('');
    setIsAiTyping(true);

    setTimeout(() => {
      let reply = '';
      const lower = userText.toLowerCase();

      if (lower.includes('deposit') || lower.includes('rent') || lower.includes('tenant') || lower.includes('किराया')) {
        reply = language === 'en'
          ? "Under the Model Tenancy Act & State Rent Control Rules, landlords must refund security deposits within 30 days after adjusting bona fide dues. If withheld unlawfully, you can send a statutory 15-day legal notice or file a petition before the Rent Authority / Consumer Forum."
          : "मॉडल किरायेदारी कानून के अनुसार मकान मालिक को 30 दिनों के भीतर सुरक्षा जमा लौटाना अनिवार्य है। यदि ऐसा नहीं होता है, तो आप 15 दिन का कानूनी नोटिस भेज सकते हैं या किराया प्राधिकरण / उपभोक्ता अदालत में शिकायत दर्ज कर सकते हैं।";
      } else if (lower.includes('cyber') || lower.includes('fraud') || lower.includes('scam') || lower.includes('1930') || lower.includes('ठगी')) {
        reply = language === 'en'
          ? "CRITICAL: Immediately call national cyber helpline 1930 within the 'Golden Hour' to trigger account freeze across beneficiary bank nodes. Simultaneously file a formal complaint at cybercrime.gov.in with transaction ID and screenshot evidence."
          : "महत्वपूर्ण: 'गोल्डन ऑवर' के भीतर तुरंत 1930 पर कॉल करें ताकि आरोपी का बैंक खाता तुरंत फ्रीज किया जा सके। इसके साथ ही cybercrime.gov.in पर ट्रांजैक्शन आईडी व स्क्रीनशॉट के साथ शिकायत दर्ज करें।";
      } else if (lower.includes('fir') || lower.includes('police') || lower.includes('थाना') || lower.includes('पुलिस')) {
        reply = language === 'en'
          ? "According to Supreme Court directives (Lalita Kumari judgment) and BNSS rules, any police station MUST register a 'Zero FIR' regardless of territorial jurisdiction for cognizable offences, and transfer it to the concerned precinct."
          : "सुप्रीम कोर्ट (ललिता कुमारी फैसला) के अनुसार संज्ञेय अपराध में किसी भी थाने को 'ज़ीरो एफआईआर' दर्ज करना अनिवार्य है, चाहे अपराध किसी भी क्षेत्र में हुआ हो।";
      } else {
        reply = language === 'en'
          ? `Thank you for asking about "${userText}". Nyaay सारथी simplifies this under Indian statutory law. For actionable procedural steps or notice drafting, you can also schedule a consultation with our verified advocate network.`
          : `आपके प्रश्न "${userText}" के लिए धन्यवाद। भारतीय कानून के अंतर्गत इसके स्पष्ट नियम हैं। कानूनी नोटिस तैयार कराने या व्यक्तिगत मार्गदर्शन के लिए आप हमारे सत्यापित वकील से भी परामर्श बुक कर सकते हैं।`;
      }

      setChatMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
      setIsAiTyping(false);
    }, 600);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
  };

  const handleQuickQuestion = (q: string) => {
    setChatInput(q);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-sky-100 max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sky-100 bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white border border-sky-100 p-0.5 flex items-center justify-center shadow-xs overflow-hidden">
              <img 
                src={logoImg} 
                alt="Nyaay सारथी Logo" 
                className="w-full h-full object-cover rounded-md"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                {title || 'Nyaay सारथी'}
              </h3>
              <p className="text-xs text-sky-600 font-medium">
                {language === 'en' ? 'Digital Legal Portal' : 'डिजिटल कानूनी पोर्टल'}
              </p>
            </div>
          </div>
          <button
            id="dialog-close-btn"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Dialog Content based on actionKey */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* CHAT AI DIALOG - Modern Sky-Blue AI Assistant Interface */}
          {(actionKey === 'chat-ai' || actionKey === 'ai-simplifier') && (
            <div className="flex flex-col h-[430px]">
              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 mb-3 bg-[#F0F7FD]/60 p-3.5 rounded-xl border border-sky-100/80">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-2.5 ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 shadow-2xs">
                        <Bot className="w-4 h-4 text-sky-600" />
                      </div>
                    )}
                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-sky-600 text-white rounded-tr-none shadow-sm shadow-sky-600/15'
                          : 'bg-white text-slate-800 rounded-tl-none border border-sky-100/90 shadow-2xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-sky-200" />
                      </div>
                    )}
                  </div>
                ))}
                {isAiTyping && (
                  <div className="flex items-center gap-2 text-xs text-sky-700 italic py-1 px-2">
                    <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-spin" />
                    <span>{language === 'en' ? 'Nyaay AI is searching statutory provisions...' : 'न्याय AI कानूनी प्रावधानों का विश्लेषण कर रहा है...'}</span>
                  </div>
                )}
              </div>

              {/* Sample Queries */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs text-slate-600">
                <span className="font-semibold text-slate-400 shrink-0">
                  {language === 'en' ? 'Try:' : 'पूछें:'}
                </span>
                <button
                  type="button"
                  onClick={() => handleQuickQuestion(language === 'en' ? 'How to recover withheld rent deposit?' : 'किराया डिपॉजिट वापस कैसे लें?')}
                  className="px-2.5 py-1 rounded-full bg-white hover:bg-sky-50 hover:text-sky-700 border border-sky-200 text-slate-600 shrink-0 transition-colors shadow-2xs"
                >
                  {language === 'en' ? 'Rent Deposit' : 'किराया डिपॉजिट'}
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickQuestion(language === 'en' ? '1930 Cyber helpline procedure' : '1930 साइबर हेल्पलाइन प्रक्रिया')}
                  className="px-2.5 py-1 rounded-full bg-white hover:bg-sky-50 hover:text-sky-700 border border-sky-200 text-slate-600 shrink-0 transition-colors shadow-2xs"
                >
                  {language === 'en' ? 'Cyber 1930' : 'साइबर 1930'}
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickQuestion(language === 'en' ? 'What are Zero FIR rules?' : 'ज़ीरो FIR नियम क्या हैं?')}
                  className="px-2.5 py-1 rounded-full bg-white hover:bg-sky-50 hover:text-sky-700 border border-sky-200 text-slate-600 shrink-0 transition-colors shadow-2xs"
                >
                  {language === 'en' ? 'Zero FIR' : 'ज़ीरो FIR'}
                </button>
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-sky-100">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={language === 'en' ? 'Ask any Indian legal query...' : 'कोई भी कानूनी सवाल लिखें...'}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-sky-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-sky-600 text-white hover:bg-sky-700 transition-colors shadow-sm shadow-sky-600/20 flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* BOOK APPOINTMENT DIALOG */}
          {(actionKey === 'book-appointment' || actionKey === 'appointment-booking') && (
            <div>
              {bookingSuccess ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">
                    {language === 'en' ? 'Appointment Request Confirmed!' : 'अपॉइंटमेंट अनुरोध स्वीकृत!'}
                  </h4>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    {language === 'en'
                      ? `Your consultation for "${selectedDomain}" (${selectedMode.toUpperCase()}) has been scheduled for ${selectedDate}. You will receive SMS/WhatsApp details.`
                      : `"${selectedDomain}" के लिए आपका परामर्श सत्र (${selectedDate}) हेतु बुक कर लिया गया है। विवरण SMS/व्हाट्सएप पर भेजा जाएगा।`}
                  </p>
                  <button
                    onClick={() => {
                      setBookingSuccess(false);
                      onClose();
                    }}
                    className="mt-4 px-6 py-2 rounded-lg bg-sky-600 text-white font-semibold text-sm hover:bg-sky-700 transition-colors shadow-sm shadow-sky-600/20"
                  >
                    {language === 'en' ? 'Done' : 'पूर्ण'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {language === 'en' ? 'Select Legal Category' : 'कानूनी श्रेणी चुनें'}
                    </label>
                    <select
                      value={selectedDomain}
                      onChange={(e) => setSelectedDomain(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sky-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white text-slate-800"
                    >
                      <option>Consumer Dispute & E-Daakhil</option>
                      <option>Cyber Crime & Financial Fraud</option>
                      <option>Tenancy & Security Deposit Refund</option>
                      <option>Property & Family Estate Matters</option>
                      <option>Police Station & Criminal Defense</option>
                      <option>NALSA Free Legal Aid Eligibility</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {language === 'en' ? 'Consultation Mode' : 'परामर्श माध्यम'}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['video', 'phone', 'in-person'] as const).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setSelectedMode(m)}
                          className={`py-2 px-3 rounded-lg text-xs font-semibold border capitalize transition-all ${
                            selectedMode === m
                              ? 'bg-sky-50 border-sky-500 text-sky-700 shadow-2xs'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                          }`}
                        >
                          {m === 'video' ? '📹 Video' : m === 'phone' ? '📞 Phone Call' : '🏛️ In-Person'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        {language === 'en' ? 'Preferred Slot' : 'पसंदीदा समय'}
                      </label>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-sky-200 bg-slate-50 text-sm text-slate-800">
                        <Clock className="w-4 h-4 text-sky-600" />
                        <span>{selectedDate}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        {language === 'en' ? 'Consultation Fee' : 'परामर्श शुल्क'}
                      </label>
                      <div className="flex items-center justify-between px-3 py-2 rounded-xl border border-sky-200 bg-slate-50 text-sm text-sky-700 font-bold">
                        <span>₹499 (Standard)</span>
                        <span className="text-[10px] bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded">
                          Free for Sec 12
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>{language === 'en' ? 'Confirm Advocate Booking' : 'अपॉइंटमेंट बुक करें'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* LOGIN / SIGNUP DIALOG */}
          {actionKey === 'login-signup' && (
            <div>
              {loginSubmitted ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mx-auto border border-sky-200">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">
                    {language === 'en' ? 'OTP Sent Successfully' : 'OTP सफलतापूर्वक भेजा गया'}
                  </h4>
                  <p className="text-sm text-slate-600">
                    {language === 'en'
                      ? `Enter the 6-digit verification code sent to +91 ${phoneNumber || '9876543210'}.`
                      : `+91 ${phoneNumber || '9876543210'} पर भेजा गया 6 अंकों का कोड दर्ज करें।`}
                  </p>
                  <div className="flex justify-center gap-2 my-4">
                    {[1, 2, 3, 4, 5, 6].map((idx) => (
                      <input
                        key={idx}
                        type="text"
                        maxLength={1}
                        className="w-9 h-11 text-center font-bold text-lg border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        defaultValue={idx === 1 ? '4' : idx === 2 ? '8' : ''}
                      />
                    ))}
                  </div>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 rounded-lg bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 shadow-sm shadow-sky-600/20"
                  >
                    {language === 'en' ? 'Verify & Enter Portal' : 'सत्यापित करें व लॉगिन करें'}
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex rounded-xl bg-slate-100 p-1 border border-sky-100">
                    <button
                      type="button"
                      onClick={() => setLoginRole('citizen')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                        loginRole === 'citizen' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      {language === 'en' ? 'Citizen Account' : 'नागरिक खाता'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginRole('advocate')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                        loginRole === 'advocate' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      {language === 'en' ? 'Bar Advocate Portal' : 'अधिवक्ता पोर्टल'}
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        {language === 'en' ? 'Mobile Number or Email' : 'मोबाइल नंबर अथवा ईमेल'}
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-sky-200 bg-slate-50 text-slate-600 text-sm">
                          +91
                        </span>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="98765 43210"
                          className="flex-1 px-3.5 py-2.5 rounded-r-xl border border-sky-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      </div>
                    </div>

                    {loginRole === 'advocate' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          {language === 'en' ? 'Bar Council Enrolment Number' : 'बार काउंसिल नामांकन संख्या'}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. D/1245/2018"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-sky-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 uppercase"
                        />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setLoginSubmitted(true)}
                      className="w-full py-3 rounded-xl bg-sky-600 text-white hover:bg-sky-700 font-bold text-sm transition-all shadow-md shadow-sky-600/20"
                    >
                      {language === 'en' ? 'Send One-Time Password (OTP)' : 'OTP प्राप्त करें'}
                    </button>
                  </div>

                  <p className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3 text-sky-500" />
                    <span>{language === 'en' ? 'Secured with 256-bit encryption' : '256-बिट सुरक्षा द्वारा सुरक्षित'}</span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* KNOW YOUR RIGHTS / RIGHTS TOPICS */}
          {(actionKey === 'know-rights' || actionKey?.startsWith('rights-') || actionKey === 'know-rights-hub') && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#F0F7FD] border border-sky-100">
                <h4 className="font-bold text-slate-900 text-base mb-1">
                  {title || (language === 'en' ? 'Citizen Rights Handbook' : 'नागरिक अधिकार संदर्शिका')}
                </h4>
                <p className="text-xs text-sky-800">
                  {linkData?.description || (language === 'en'
                    ? 'Official simplified summaries of fundamental rights, consumer protections, and statutory safeguards for every Indian.'
                    : 'मौलिक अधिकारों, उपभोक्ता संरक्षण और कानूनी सुरक्षा उपायों का सरल व प्रामाणिक विवरण।')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-sky-100 bg-white shadow-2xs">
                  <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-sky-600" />
                    <span>{language === 'en' ? 'Statutory Provision' : 'कानूनी धारा/प्रावधान'}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {actionKey === 'rights-cyber'
                      ? 'IT Act Sec 66D, 43A & Indian Cyber Crime Helpline (1930)'
                      : actionKey === 'rights-police'
                      ? 'Supreme Court Lalita Kumari Ruling & Sec 154 CrPC / BNSS Zero FIR'
                      : actionKey === 'rights-consumer'
                      ? 'Consumer Protection Act 2019 Sec 35 & E-Daakhil Rules'
                      : 'Articles 14, 19, 21 of Constitution of India & Legal Services Authorities Act (1987)'}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-sky-100 bg-white shadow-2xs">
                  <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-sky-600" />
                    <span>{language === 'en' ? 'Direct Nodal Action' : 'त्वरित कार्रवाई'}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {actionKey === 'rights-cyber'
                      ? 'Dial 1930 within 2 hours of transaction.'
                      : actionKey === 'rights-legalaid'
                      ? 'Dial 15100 for free State legal aid lawyer.'
                      : 'Consult a verified Nyaay सारथी advocate for notice drafting.'}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-sky-600 text-white font-semibold text-xs flex items-center gap-1.5 hover:bg-sky-700 shadow-sm shadow-sky-600/20"
                >
                  <span>{language === 'en' ? 'Consult an Advocate on this Topic' : 'इस विषय पर वकील से परामर्श लें'}</span>
                </button>
              </div>
            </div>
          )}

          {/* GOVT PORTAL CONFIRMATION DIALOG */}
          {actionKey?.startsWith('govt-') && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#F0F7FD] border border-sky-100">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-base mb-1">
                  <span>{title}</span>
                  <span className="text-[10px] uppercase font-bold bg-sky-100 text-sky-700 px-2 py-0.5 rounded">
                    Official Govt of India
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  {linkData?.description || (language === 'en' 
                    ? 'You are about to visit an official Government of India public portal.'
                    : 'आप भारत सरकार के आधिकारिक जन-पोर्टल पर जाने वाले हैं।')}
                </p>
              </div>

              {linkData?.externalUrl && (
                <div className="p-3 rounded-lg bg-slate-50 border border-sky-100 text-xs text-sky-700">
                  <strong>URL:</strong> <span className="font-mono text-slate-700">{linkData.externalUrl}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  {language === 'en' ? 'Cancel' : 'रद्द करें'}
                </button>
                {linkData?.externalUrl && (
                  <a
                    href={linkData.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm shadow-sky-600/20"
                  >
                    <span>{language === 'en' ? 'Open Official Portal' : 'आधिकारिक पोर्टल खोलें'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* ABOUT US DIALOG */}
          {actionKey === 'about-us' && (
            <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
              <p>
                <strong>Nyaay सारथी</strong> is an initiative dedicated to democratizing legal awareness and simplifying the justice process across India.
              </p>
              <p>
                By combining conversational AI legal guidance with a nationwide network of verified Bar Council registered advocates, we help citizens understand their statutory rights without intimidating jargon.
              </p>
              <div className="p-3.5 bg-[#F0F7FD] rounded-xl border border-sky-100 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5">Mission</span>
                  <span className="text-slate-600">Justice within reach of every citizen</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5">Compliance</span>
                  <span className="text-slate-600">Bar Council of India Ethics</span>
                </div>
              </div>
            </div>
          )}

          {/* CONTACT US / SUPPORT DIALOG */}
          {actionKey === 'contact-us' && (
            <div>
              {contactSubmitted ? (
                <div className="text-center py-8 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">
                    {language === 'en' ? 'Message Received' : 'संदेश प्राप्त हुआ'}
                  </h4>
                  <p className="text-xs text-slate-600">
                    {language === 'en'
                      ? 'Our citizen support desk will respond within 4 business hours.'
                      : 'हमारी सहायता टीम 4 कार्य घंटों के भीतर आपसे संपर्क करेगी।'}
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSubmitted(true);
                  }}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-lg bg-[#F0F7FD] border border-sky-100 text-xs flex items-center gap-2">
                      <Phone className="w-4 h-4 text-sky-600" />
                      <div>
                        <span className="text-slate-500 block">Toll-Free Support</span>
                        <strong className="text-slate-800">1800-NYAAY-IN</strong>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#F0F7FD] border border-sky-100 text-xs flex items-center gap-2">
                      <Mail className="w-4 h-4 text-sky-600" />
                      <div>
                        <span className="text-slate-500 block">Email Desk</span>
                        <strong className="text-slate-800">support@nyaaysarathi.in</strong>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      {language === 'en' ? 'Your Name' : 'आपका नाम'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full px-3.5 py-2 rounded-lg border border-sky-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      {language === 'en' ? 'Query / Assistance Required' : 'प्रश्न अथवा आवश्यक सहायता'}
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder={language === 'en' ? 'Describe your legal question or portal query...' : 'अपनी समस्या या प्रश्न का विवरण लिखें...'}
                      className="w-full px-3.5 py-2 rounded-lg border border-sky-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-sky-600 text-white font-bold text-sm hover:bg-sky-700 transition-colors shadow-sm shadow-sky-600/20"
                  >
                    {language === 'en' ? 'Submit Inquiry' : 'संदेश भेजें'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* FAQS DIALOG */}
          {actionKey === 'faqs' && (
            <div className="space-y-3 text-sm text-slate-700">
              <div className="p-3.5 bg-[#F0F7FD] rounded-xl border border-sky-100">
                <h5 className="font-bold text-slate-900 mb-1">
                  {language === 'en' ? 'Is AI legal advice legally binding?' : 'क्या AI की सलाह कानूनी रूप से बाध्यकारी है?'}
                </h5>
                <p className="text-xs text-slate-600">
                  {language === 'en'
                    ? 'No, the AI provides citizen awareness and procedural clarity. For formal representation, consult a verified advocate.'
                    : 'नहीं, AI केवल नागरिक जागरूकता और प्रक्रिया मार्गदर्शन हेतु है। अदालत में प्रतिनिधित्व हेतु अधिवक्ता से परामर्श लें।'}
                </p>
              </div>

              <div className="p-3.5 bg-[#F0F7FD] rounded-xl border border-sky-100">
                <h5 className="font-bold text-slate-900 mb-1">
                  {language === 'en' ? 'Who is eligible for free legal aid in India?' : 'भारत में मुफ्त कानूनी सहायता के लिए कौन पात्र है?'}
                </h5>
                <p className="text-xs text-slate-600">
                  {language === 'en'
                    ? 'Under Sec 12 of the Legal Services Authorities Act, women, children, SC/ST members, undertrials, and persons with annual income under statutory state limits are entitled to free lawyers.'
                    : 'विधिक सेवा प्राधिकरण अधिनियम की धारा 12 के तहत महिलाएं, बच्चे, SC/ST, विचाराधीन कैदी और आय सीमा के अंतर्गत आने वाले नागरिक मुफ्त विधिक सहायता के पात्र हैं।'}
                </p>
              </div>
            </div>
          )}

          {/* GENERIC FEATURE POPUP */}
          {(actionKey === 'verified-advocates' || actionKey === 'doc-summary' || actionKey === 'emergency-helpline') && (
            <div className="space-y-4">
              <p className="text-sm text-slate-700">
                {linkData?.description || (language === 'en' 
                  ? 'Explore our comprehensive features designed for transparent, accessible Indian justice.' 
                  : 'भारतीय न्याय व्यवस्था को सुलभ और पारदर्शी बनाने वाली हमारी सेवाओं का विवरण।')}
              </p>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700 shadow-sm shadow-sky-600/20"
                >
                  {language === 'en' ? 'Close' : 'बंद करें'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
