import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Send, Sparkles, ShieldCheck, Scale, FileText, 
  ArrowRight, Copy, Check, RefreshCw, Bookmark, Calendar,
  AlertCircle, HelpCircle, ChevronRight, User, FileCode, X
} from 'lucide-react';
import { Language, AppRoute, ChatMessage, AuthUser, LegalRight } from '../../types';
import { 
  getStoredChatMessages, saveChatMessages, clearChatMessages, 
  analyzeAndGenerateLegalGuidance, toggleSavedResource, DEFAULT_CITIZEN_AVATAR 
} from '../../data/portalData';

interface AiAssistantPageProps {
  user: AuthUser;
  language: Language;
  onNavigate: (route: AppRoute, params?: any) => void;
}

export function AiAssistantPage({
  user,
  language,
  onNavigate,
}: AiAssistantPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = getStoredChatMessages();
    if (saved.length > 0) return saved;
    return [
      {
        id: 'msg_welcome',
        sender: 'assistant',
        text: language === 'en'
          ? 'Hello! I am Nyaay सारथी, your AI Legal Assistant. How can I help you today? You can describe any legal problem or consumer dispute in simple words.'
          : 'नमस्ते! मैं न्याय सारथी, आपका AI कानूनी सहायक हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ? आप अपनी किसी भी कानूनी समस्या को अपनी सरल भाषा में लिख सकते हैं।',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedDraftMessage, setSelectedDraftMessage] = useState<ChatMessage | null>(null);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Quick chips
  const quickPrompts = [
    {
      en: 'My landlord is withholding my security deposit',
      hi: 'मकान मालिक मेरा सिक्योरिटी डिपॉजिट वापस नहीं कर रहा है'
    },
    {
      en: 'I was scammed in an online UPI transaction (Cyber fraud)',
      hi: 'मेरे बैंक खाते से ऑनलाइन UPI फ्रॉड में पैसे कट गए हैं'
    },
    {
      en: 'I received a defective product and seller refused replacement',
      hi: 'ऑनलाइन मंगाया गया सामान खराब निकला और कंपनी बदल नहीं रही है'
    },
    {
      en: 'Police refused to register my complaint (Zero FIR)',
      hi: 'थाने में पुलिस ने शिकायत दर्ज करने से मना कर दिया'
    },
    {
      en: 'My employer has withheld my salary and F&F settlement',
      hi: 'कंपनी ने मेरा 2 महीने का वेतन और अंतिम हिसाब रोक लिया है'
    },
    {
      en: 'Am I eligible for free legal aid under Section 12 NALSA?',
      hi: 'क्या मुझे मुफ्त सरकारी वकील और विधिक सहायता मिल सकती है?'
    }
  ];

  // Auto scroll to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg_user_' + Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    saveChatMessages(newHistory);
    setInputQuery('');
    setIsTyping(true);

    // Simulate AI analysis delay
    setTimeout(() => {
      const aiResponse = analyzeAndGenerateLegalGuidance(text, language);
      const updated = [...newHistory, aiResponse];
      setMessages(updated);
      saveChatMessages(updated);
      setIsTyping(false);
    }, 600);
  };

  const handleClearHistory = () => {
    clearChatMessages();
    setMessages([
      {
        id: 'msg_welcome',
        sender: 'assistant',
        text: language === 'en'
          ? 'Chat reset. How can Nyaay सारथी assist you today?'
          : 'बातचीत रीसेट की गई। आज न्याय सारथी आपकी क्या सहायता कर सकता है?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleSaveToResources = (structuredData: NonNullable<ChatMessage['structuredData']>) => {
    const mockRight: LegalRight = {
      id: 'ai_right_' + Date.now(),
      category: (structuredData.legalArea as LegalRight['category']) || 'Consumer',
      name: structuredData.draftTitle || structuredData.legalArea || 'Legal Guidance',
      nameHi: structuredData.draftTitle || structuredData.legalArea || 'कानूनी परामर्श',
      shortDescription: structuredData.understanding || '',
      shortDescriptionHi: structuredData.understanding || '',
      whoItAppliesTo: 'Citizen facing ' + structuredData.legalArea,
      whoItAppliesToHi: 'नागरिक',
      legalSource: structuredData.rights?.[0] || 'Indian Statutory Law Provisions',
      exampleSituation: structuredData.understanding || '',
      exampleSituationHi: structuredData.understanding || '',
      possibleAction: structuredData.nextSteps?.[0] || 'Issue statutory notice',
      possibleActionHi: 'कानूनी नोटिस भेजें',
      relevantAuthority: structuredData.authority || 'District Legal Services Authority',
      requiredDocuments: structuredData.documents || [],
      advocateCategoryHint: structuredData.recommendedCategory || 'Civil Law'
    };
    toggleSavedResource(user.id, mockRight);
    alert(language === 'en' ? 'Saved to your Saved Resources!' : 'सहेजे गए अधिकारों में जोड़ा गया!');
  };

  const handleCopyDraft = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-sky-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-700 uppercase tracking-wider">
            <Bot className="w-4 h-4 text-sky-600" />
            <span>{language === 'en' ? 'AI Legal Assistant & Notice Drafter' : 'AI कानूनी सहायक व ड्राफ्टिंग'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {language === 'en' ? 'Chat with Nyaay सारथी' : 'न्याय सारथी AI से पूछें'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'en'
              ? 'Receive structured legal analysis, relevant sections, next steps, and draft applications.'
              : 'कानूनी प्रावधानों, उपयुक्त प्राधिकरण, आवश्यक दस्तावेजों व नोटिस ड्राफ्ट का विश्लेषण प्राप्त करें।'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearHistory}
            className="py-2 px-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Reset Chat' : 'रीसेट'}</span>
          </button>
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="bg-white rounded-3xl border border-sky-100 shadow-xs overflow-hidden flex flex-col h-[640px]">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 bg-slate-50/40">
          
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shrink-0 mt-1 shadow-2xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-2xl space-y-3 ${isUser ? 'items-end' : 'items-start'}`}>
                  
                  {/* User Bubble */}
                  {isUser ? (
                    <div className="bg-sky-600 text-white p-4 rounded-2xl rounded-tr-none shadow-xs text-xs sm:text-sm leading-relaxed">
                      <p>{msg.text}</p>
                      <span className="text-[10px] text-sky-200 block text-right mt-1 font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                  ) : (
                    /* Assistant Structured Bubble (Section 26 & Section 27) */
                    <div className="bg-white border border-sky-100 p-5 rounded-2xl rounded-tl-none shadow-2xs space-y-4 text-xs sm:text-sm">
                      <p className="text-slate-800 font-medium leading-relaxed">{msg.text}</p>

                      {msg.structuredData && (
                        <div className="space-y-3.5 pt-2 border-t border-slate-100 text-xs">
                          
                          {/* 1. Understanding Your Situation */}
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              1. Understanding Your Situation
                            </span>
                            <p className="text-slate-800 font-semibold">{msg.structuredData.understanding}</p>
                          </div>

                          {/* 2. Possible Rights & 3. Legal Area */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-150 space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800">
                                2. Key Statutory Rights
                              </span>
                              <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                                {msg.structuredData.rights.map((r, i) => (
                                  <li key={i} className="text-[11px] leading-tight">{r}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-150 space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800">
                                3. Legal Domain & Category
                              </span>
                              <p className="font-bold text-indigo-950 text-xs">{msg.structuredData.legalArea}</p>
                              <p className="text-[11px] text-indigo-900/80 pt-0.5">
                                <strong>Actionable Assessment:</strong> {msg.structuredData.isActionable}
                              </p>
                            </div>
                          </div>

                          {/* 4. Authority & Documents Checklist */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                4. Competent Forum / Authority
                              </span>
                              <p className="font-bold text-slate-900 text-[11px]">{msg.structuredData.authority}</p>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                5. Required Evidence & Documents
                              </span>
                              <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-[11px]">
                                {msg.structuredData.documents.map((d, i) => (
                                  <li key={i}>{d}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* 6. Recommended Next Steps */}
                          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                              6. Recommended Next Steps
                            </span>
                            <ol className="list-decimal list-inside space-y-1 text-slate-700 text-[11px]">
                              {msg.structuredData.nextSteps.map((step, i) => (
                                <li key={i}>{step}</li>
                              ))}
                            </ol>
                          </div>

                          {/* 7. Legal Aid Note */}
                          {msg.structuredData.legalAid && (
                            <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                              <Scale className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                              <span>{msg.structuredData.legalAid}</span>
                            </div>
                          )}

                          {/* Section 27: Smart Lawyer Recommendation Card */}
                          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2.5 shadow-sm">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-sky-400" />
                              <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                                Recommended Advocate Category
                              </span>
                            </div>

                            <p className="text-xs text-slate-200 leading-relaxed">
                              Based on the information you provided, an advocate experienced in{' '}
                              <strong className="text-white font-bold">{msg.structuredData.suggestedAdvocateSpecialty}</strong>{' '}
                              can assist you in issuing statutory notices and representing you before {msg.structuredData.authority}.
                            </p>

                            <div className="pt-1 flex flex-wrap items-center gap-2">
                              <button
                                onClick={() => onNavigate('appointments', { category: msg.structuredData?.recommendedCategory })}
                                className="py-2 px-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer"
                              >
                                <span>Find Suitable Advocates</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => setSelectedDraftMessage(msg)}
                                className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                              >
                                <FileCode className="w-3.5 h-3.5 text-sky-400" />
                                <span>View Legal Draft Notice</span>
                              </button>

                              <button
                                onClick={() => handleSaveToResources(msg.structuredData!)}
                                className="py-2 px-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <Bookmark className="w-3.5 h-3.5 text-sky-400" />
                                <span>Save</span>
                              </button>
                            </div>
                          </div>

                        </div>
                      )}

                      <span className="text-[10px] text-slate-400 block font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                  )}

                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-sky-100 py-3 px-4 rounded-2xl text-xs font-medium text-slate-500 flex items-center gap-2 shadow-2xs">
                <Sparkles className="w-4 h-4 text-sky-600 animate-spin" />
                <span>Nyaay सारथी is analyzing legal provisions and drafting guidance...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2.5 bg-white border-t border-slate-100 overflow-x-auto flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            {language === 'en' ? 'Quick Inquiries:' : 'त्वरित प्रश्न:'}
          </span>
          {quickPrompts.map((qp, idx) => {
            const label = language === 'en' ? qp.en : qp.hi;
            return (
              <button
                key={idx}
                onClick={() => handleSendMessage(label)}
                className="py-1 px-3 rounded-full bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-700 text-xs font-semibold border border-slate-200/80 whitespace-nowrap cursor-pointer transition-colors shrink-0"
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-sky-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={language === 'en'
                ? 'Describe your legal situation or ask a question in simple Hindi/English...'
                : 'अपनी कानूनी स्थिति या समस्या को यहां लिखें...'}
              className="flex-1 py-3 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="py-3 px-5 rounded-2xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-95 shrink-0"
            >
              <span>{language === 'en' ? 'Send' : 'भेजें'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>

      {/* Draft Legal Notice Modal */}
      {selectedDraftMessage && selectedDraftMessage.structuredData && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-sky-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {selectedDraftMessage.structuredData.draftTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDraftMessage(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              This draft notice is ready for inspection. You can copy the text, attach it to an application, or discuss it during your advocate consultation.
            </p>

            <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed whitespace-pre-wrap border border-slate-800">
              {selectedDraftMessage.structuredData.draftBody}
            </div>

            <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
              <button
                onClick={() => handleCopyDraft(selectedDraftMessage.structuredData!.draftBody!)}
                className="py-2.5 px-4 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold hover:bg-sky-100 flex items-center gap-1.5 cursor-pointer"
              >
                {copiedDraft ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedDraft ? 'Copied to Clipboard' : 'Copy Notice Text'}</span>
              </button>

              <button
                onClick={() => setSelectedDraftMessage(null)}
                className="py-2.5 px-5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
