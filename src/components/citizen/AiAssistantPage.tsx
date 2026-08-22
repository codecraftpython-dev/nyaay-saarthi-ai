import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Send, Sparkles, ShieldCheck, Scale, FileText, 
  ArrowRight, Copy, Check, RefreshCw, Bookmark, Calendar,
  AlertCircle, HelpCircle, ChevronRight, User, FileCode, X,
  Download, Volume2, VolumeX, ListChecks, Clock, Compass, FileCheck,
  Mic, MicOff
} from 'lucide-react';
import { Language, AppRoute, ChatMessage, AuthUser, LegalRight, AiCaseSummary } from '../../types';
import { 
  getStoredChatMessages, saveChatMessages, clearChatMessages, 
  toggleSavedResource 
} from '../../data/portalData';
import { requestAiLegalGuidance, requestAiCaseSummary } from '../../services/aiService';

interface AiAssistantPageProps {
  user: AuthUser;
  language: Language;
  onNavigate: (route: AppRoute, params?: any) => void;
}

function renderFormattedLegalText(text: string) {
  if (!text) return null;

  const lines = text.split('\n');
  return (
    <div className="space-y-2">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={lineIdx} className="h-1" />;

        const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*');
        const content = isBullet ? trimmed.replace(/^[\s•\-\*]+/, '') : trimmed;

        const parts = content.split(/(\*\*[^*]+\*\*)/g);

        const renderedLine = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pIdx} className="font-bold text-slate-900 bg-sky-500/15 px-1.5 py-0.5 rounded-lg border border-sky-300/40">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return <span key={pIdx}>{part}</span>;
        });

        if (isBullet) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-2">
              <span className="text-sky-600 font-bold mt-0.5 text-xs">•</span>
              <p className="flex-1 leading-relaxed text-slate-800 font-medium">{renderedLine}</p>
            </div>
          );
        }

        return (
          <p key={lineIdx} className="leading-relaxed text-slate-800 font-medium">
            {renderedLine}
          </p>
        );
      })}
    </div>
  );
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
          ? 'Namaste! I am Nyaay सारथी, your AI Legal Assistant powered by Indian Law intelligence. Describe any legal problem, police matter, tenancy issue, financial cyber fraud, or consumer dispute in simple words. I will analyze your rights, generate legal notices, provide executive summaries, and suggest next steps.'
          : 'नमस्ते! मैं न्याय सारथी, आपका AI कानूनी सहायक हूँ। आप अपनी किसी भी कानूनी समस्या, साइबर फ्रॉड, पुलिस शिकायत, उपभोक्ता विवाद या मकान मालिक से जुड़े मामले को सरल भाषा में लिख सकते हैं। मैं आपको कानूनी अधिकार, नोटिस ड्राफ्ट, सारांश और सुझाव प्रदान करूँगा।',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: language === 'en' ? [
          'Landlord is withholding my security deposit',
          'Cyber fraud: unauthorized UPI deduction from bank',
          'Defective laptop delivered & e-commerce refusing return',
          'Police refused to file my complaint (Zero FIR)'
        ] : [
          'मकान मालिक सिक्योरिटी डिपॉजिट वापस नहीं कर रहा',
          'ऑनलाइन बैंक खाते से बिना अनुमति UPI पैसे कट गए',
          'ऑनलाइन मंगाया गया सामान खराब है और कंपनी बदल नहीं रही',
          'थाने में पुलिस ने शिकायत दर्ज करने से मना कर दिया'
        ]
      }
    ];
  });

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedDraftMessage, setSelectedDraftMessage] = useState<ChatMessage | null>(null);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState<AiCaseSummary | null>(null);
  const [isSummarizingThread, setIsSummarizingThread] = useState(false);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputQuery((prev) => (prev ? `${prev} ${transcript}` : transcript));
          }
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [language]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert(language === 'en' ? 'Voice recognition is not supported in your browser.' : 'आपके ब्राउज़र में वॉइस इनपुट उपलब्ध नहीं है।');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
        setIsListening(false);
      }
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickPrompts = [
    { en: 'Landlord deposit dispute', hi: 'मकान मालिक डिपॉजिट विवाद' },
    { en: 'Defective product refund', hi: 'दोषपूर्ण सामान रिफंड' },
    { en: 'Unauthorized bank UPI fraud', hi: 'बैंक UPI फ्रॉड शिकायत' },
    { en: 'Wrongful employment termination', hi: 'नौकरी से गलत निष्कासन' },
    { en: 'Cheque bounce 138 NI Act', hi: 'चेक बाउंस नोटिस' },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim() || isTyping) return;

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

    try {
      const aiResponse = await requestAiLegalGuidance({
        message: text.trim(),
        history: newHistory,
        language,
        user
      });

      const updated = [...newHistory, aiResponse];
      setMessages(updated);
      saveChatMessages(updated);
    } catch (err) {
      console.error('Failed to receive AI guidance:', err);
      showToast(language === 'en' ? 'Error generating response. Please try again.' : 'उत्तर प्राप्त करने में त्रुटि हुई।');
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = () => {
    clearChatMessages();
    window.speechSynthesis?.cancel();
    setIsSpeakingId(null);
    setMessages([
      {
        id: 'msg_welcome',
        sender: 'assistant',
        text: language === 'en'
          ? 'Chat reset. How can Nyaay सारथी assist you today? You can describe any legal grievance.'
          : 'बातचीत रीसेट की गई। आज न्याय सारथी आपकी क्या सहायता कर सकता है? आप अपनी किसी भी कानूनी समस्या को लिख सकते हैं।',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: language === 'en' ? [
          'Landlord is withholding my security deposit',
          'Defective product & seller refused refund',
          'Cyber UPI transaction fraud'
        ] : [
          'मकान मालिक सिक्योरिटी डिपॉजिट नहीं दे रहा',
          'खराब सामान मिला व रिफंड नहीं दिया',
          'ऑनलाइन UPI फ्रॉड'
        ]
      }
    ]);
    showToast(language === 'en' ? 'Chat cleared' : 'बातचीत रीसेट हो गई');
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
    showToast(language === 'en' ? 'Saved to your Saved Resources!' : 'सहेजे गए अधिकारों में जोड़ा गया!');
  };

  const handleCopyDraft = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDraft(true);
    showToast(language === 'en' ? 'Notice draft copied to clipboard!' : 'नोटिस का ड्राफ्ट कॉपी कर लिया गया!');
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  const handleDownloadDraft = (title: string, body: string) => {
    const element = document.createElement('a');
    const file = new Blob([body], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${title.replace(/\s+/g, '_')}_Draft.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast(language === 'en' ? 'Draft downloaded successfully!' : 'ड्राफ्ट डाउनलोड हो गया!');
  };

  const handleSummarizeEntireThread = async () => {
    const userAndAiMsgs = messages.filter(m => m.id !== 'msg_welcome');
    if (userAndAiMsgs.length === 0) {
      showToast(language === 'en' ? 'Please ask a legal question first to generate a summary.' : 'कृपया पहले एक कानूनी प्रश्न पूछें।');
      return;
    }

    setIsSummarizingThread(true);
    try {
      const summary = await requestAiCaseSummary({
        messages: userAndAiMsgs,
        language
      });
      setSelectedSummary(summary);
    } catch (err) {
      console.error('Failed to summarize thread:', err);
      showToast(language === 'en' ? 'Failed to generate summary.' : 'सारांश बनाने में त्रुटि हुई।');
    } finally {
      setIsSummarizingThread(false);
    }
  };

  const handleSpeakText = (msgId: string, text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeakingId === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeakingId(null);
    utterance.onerror = () => setIsSpeakingId(null);
    setIsSpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900/90 backdrop-blur-xl text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-[0_8px_32px_rgba(15,23,42,0.2)] border border-white/20 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner - Frosted Glass Card */}
      <div className="glass-panel bg-white/65 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-white/85 shadow-[0_12px_40px_rgba(31,38,135,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-900 uppercase tracking-wider">
            <Bot className="w-4 h-4 text-sky-600" />
            <span>{language === 'en' ? 'AI Legal Advisory, Drafter & Case Summarizer' : 'AI कानूनी सलाहकार, ड्राफ्टर व सारांशकर्ता'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {language === 'en' ? 'Chat with Nyaay सारथी AI' : 'न्याय सारथी AI से पूछें'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            {language === 'en'
              ? 'Real-time Indian law analysis, automated executive case summaries, legal notice drafts, and smart advocate recommendations.'
              : 'भारतीय कानूनों का विश्लेषण, AI केस सारांश, नोटिस ड्राफ्ट व उपयुक्त वकील सिफारिश प्राप्त करें।'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSummarizeEntireThread}
            disabled={isSummarizingThread}
            className="glass-btn-sky py-2 px-3.5 rounded-2xl bg-white/70 hover:bg-white/95 text-sky-900 border border-white/80 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-97 transition-all"
          >
            <Sparkles className={`w-3.5 h-3.5 text-sky-600 ${isSummarizingThread ? 'animate-spin' : ''}`} />
            <span>{isSummarizingThread ? (language === 'en' ? 'Summarizing...' : 'सारांश बन रहा है...') : (language === 'en' ? 'Case Summary' : 'केस सारांश')}</span>
          </button>

          <button
            onClick={handleClearHistory}
            className="glass-btn py-2 px-3 rounded-2xl border border-white/80 bg-white/50 text-slate-700 hover:bg-white/80 text-xs font-semibold flex items-center gap-1.5 cursor-pointer active:scale-97 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Reset' : 'रीसेट'}</span>
          </button>
        </div>
      </div>

      {/* Main Chat Box - Frosted Glass Container */}
      <div className="glass-panel bg-white/60 backdrop-blur-2xl rounded-3xl border border-white/80 shadow-[0_16px_48px_rgba(31,38,135,0.08)] overflow-hidden flex flex-col h-[700px]">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 bg-transparent">
          
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-9 h-9 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-bold shrink-0 mt-1 shadow-[0_4px_16px_rgba(37,99,235,0.3)] border border-white/40">
                    <Bot className="w-4.5 h-4.5" />
                  </div>
                )}

                <div className={`max-w-2xl space-y-3 ${isUser ? 'items-end' : 'items-start'}`}>
                  
                  {/* User Bubble - Frosted Blue Glass Panel */}
                  {isUser ? (
                    <div className="glass-btn-primary bg-gradient-to-r from-sky-500 to-blue-600 text-white p-4 rounded-3xl rounded-tr-none shadow-[0_6px_20px_rgba(37,99,235,0.25)] border border-white/30 text-xs sm:text-sm leading-relaxed">
                      <p className="font-medium">{msg.text}</p>
                      <span className="text-[10px] text-sky-100/90 block text-right mt-1 font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                  ) : (
                    /* Assistant Structured Bubble with AI Summaries & Suggestions */
                    <div className="glass-card bg-white/75 backdrop-blur-xl border border-white/90 p-5 sm:p-6 rounded-3xl rounded-tl-none shadow-[0_4px_24px_rgba(31,38,135,0.06)] space-y-4 text-xs sm:text-sm">
                      
                      {/* Top Header with Voice read & Verified Gemini AI Badge */}
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-sky-100/60">
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-sky-900 bg-sky-500/15 px-2.5 py-0.5 rounded-full border border-sky-300/40">
                            <Sparkles className="w-3 h-3 text-sky-600 animate-pulse" />
                            {language === 'en' ? 'Verified by Gemini AI' : 'Gemini AI द्वारा सत्यापित'}
                          </span>
                          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-300/40 flex items-center gap-1">
                            <Check className="w-2.5 h-2.5 text-emerald-600" />
                            {language === 'en' ? 'Indian Law Grounded' : 'भारतीय कानून अनुसार'}
                          </span>
                        </div>
                        <button
                          onClick={() => handleSpeakText(msg.id, msg.text)}
                          title="Listen to legal guidance"
                          className="p-1.5 text-slate-500 hover:text-sky-700 rounded-xl hover:bg-sky-500/15 cursor-pointer transition-colors"
                        >
                          {isSpeakingId === msg.id ? (
                            <VolumeX className="w-4 h-4 text-rose-500 animate-pulse" />
                          ) : (
                            <Volume2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Main Conversational Advice */}
                      <div className="text-slate-800 font-medium">
                        {renderFormattedLegalText(msg.text)}
                      </div>

                      {/* AI Executive Summary Quick View (if available) */}
                      {msg.summary && (
                        <div className="p-4 rounded-2xl bg-amber-500/10 backdrop-blur-md border border-amber-300/50 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-amber-950 font-bold text-xs">
                              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                              <span>{language === 'en' ? 'AI Case Brief & Executive Summary' : 'AI केस सारांश'}</span>
                            </div>
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                              msg.summary.riskLevel === 'Urgent' ? 'bg-rose-500/15 text-rose-900 border border-rose-300/40' :
                              msg.summary.riskLevel === 'High' ? 'bg-orange-500/15 text-orange-900 border border-orange-300/40' :
                              'bg-amber-500/15 text-amber-900 border border-amber-300/40'
                            }`}>
                              {msg.summary.riskLevel} Urgency
                            </span>
                          </div>
                          <p className="text-xs text-amber-950 font-medium leading-relaxed">
                            {msg.summary.overview}
                          </p>
                          <div className="pt-1 flex items-center justify-between">
                            <span className="text-[11px] text-amber-900 font-semibold">
                              ⏱ {msg.summary.timelineUrgency}
                            </span>
                            <button
                              onClick={() => setSelectedSummary(msg.summary!)}
                              className="text-xs font-bold text-amber-950 hover:text-sky-900 underline cursor-pointer"
                            >
                              {language === 'en' ? 'View Full Summary →' : 'विस्तृत सारांश देखें →'}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Structured Analysis Cards */}
                      {msg.structuredData && (
                        <div className="space-y-3 pt-2 border-t border-sky-100/60 text-xs">
                          
                          {/* 1. Understanding Situation */}
                          <div className="p-3.5 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 space-y-1 shadow-2xs">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              1. Core Legal Issue
                            </span>
                            <p className="text-slate-900 font-bold">{msg.structuredData.understanding}</p>
                          </div>

                          {/* 2. Key Statutory Rights & 3. Domain */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div className="p-3.5 rounded-2xl bg-sky-500/10 backdrop-blur-md border border-sky-300/40 space-y-1 shadow-2xs">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-900">
                                2. Statutory Provisions & Sections
                              </span>
                              <ul className="list-disc list-inside space-y-0.5 text-slate-800">
                                {msg.structuredData.rights?.map((r, i) => (
                                  <li key={i} className="text-[11px] leading-tight font-medium">{r}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-indigo-500/10 backdrop-blur-md border border-indigo-300/40 space-y-1 shadow-2xs">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900">
                                3. Legal Domain & Urgency
                              </span>
                              <p className="font-bold text-indigo-950 text-xs">{msg.structuredData.legalArea}</p>
                              <p className="text-[11px] text-indigo-900/90 pt-0.5 font-medium">
                                <strong>Assessment:</strong> {msg.structuredData.isActionable}
                              </p>
                            </div>
                          </div>

                          {/* 4. Authority & Documents Checklist */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div className="p-3.5 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 space-y-1 shadow-2xs">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                4. Competent Forum / Authority
                              </span>
                              <p className="font-bold text-slate-900 text-[11px]">{msg.structuredData.authority}</p>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 space-y-1 shadow-2xs">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                5. Required Evidence & Records
                              </span>
                              <ul className="list-disc list-inside space-y-0.5 text-slate-800 text-[11px] font-medium">
                                {msg.structuredData.documents?.map((d, i) => (
                                  <li key={i}>{d}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* 6. Recommended Next Steps */}
                          <div className="p-3.5 rounded-2xl bg-emerald-500/10 backdrop-blur-md border border-emerald-300/40 space-y-1 shadow-2xs">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900">
                              6. Immediate Action Steps
                            </span>
                            <ol className="list-decimal list-inside space-y-1 text-slate-800 text-[11px]">
                              {msg.structuredData.nextSteps?.map((step, i) => (
                                <li key={i} className="font-semibold">{step}</li>
                              ))}
                            </ol>
                          </div>

                          {/* 7. Legal Aid Note */}
                          {msg.structuredData.legalAid && (
                            <div className="p-3 rounded-2xl bg-amber-500/10 backdrop-blur-md border border-amber-300/40 text-[11px] text-amber-950 flex items-start gap-2 shadow-2xs">
                              <Scale className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                              <span className="font-medium">{msg.structuredData.legalAid}</span>
                            </div>
                          )}

                          {/* Smart Lawyer Recommendation & Action Card */}
                          <div className="p-5 rounded-3xl bg-slate-900/90 backdrop-blur-xl text-white space-y-3 shadow-[0_8px_32px_rgba(15,23,42,0.15)] border border-white/20">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-sky-400" />
                                <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                                  Advocate Recommendation
                                </span>
                              </div>
                              <span className="text-[10px] font-bold text-sky-200 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
                                Bar Council Verified
                              </span>
                            </div>

                            <p className="text-xs text-slate-200 leading-relaxed font-medium">
                              An advocate experienced in{' '}
                              <strong className="text-white font-bold">{msg.structuredData.suggestedAdvocateSpecialty || msg.structuredData.legalArea}</strong>{' '}
                              can issue statutory notices and file your petition before {msg.structuredData.authority}.
                            </p>

                            <div className="pt-1 flex flex-wrap items-center gap-2">
                              <button
                                onClick={() => onNavigate('appointments', { category: msg.structuredData?.recommendedCategory })}
                                className="glass-btn-primary py-2 px-4 rounded-xl text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-97 transition-all"
                              >
                                <span>Find Verified Advocates</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>

                              {msg.structuredData.draftBody && (
                                <button
                                  onClick={() => setSelectedDraftMessage(msg)}
                                  className="py-2 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 border border-white/20 cursor-pointer active:scale-97 transition-all"
                                >
                                  <FileCode className="w-3.5 h-3.5 text-sky-300" />
                                  <span>View Notice Draft</span>
                                </button>
                              )}

                              <button
                                onClick={() => handleSaveToResources(msg.structuredData!)}
                                className="py-2 px-3 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 text-xs font-semibold flex items-center gap-1 cursor-pointer active:scale-97 transition-all"
                              >
                                <Bookmark className="w-3.5 h-3.5 text-sky-400" />
                                <span>Save</span>
                              </button>
                            </div>
                          </div>

                        </div>
                      )}

                      {/* Dynamic Contextual AI Suggestions Chips */}
                      {msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="pt-3 border-t border-sky-100/60 space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                            <Compass className="w-3 h-3 text-sky-600" />
                            {language === 'en' ? 'AI Follow-up Suggestions:' : 'AI सुझाव:'}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.suggestions.map((sug, i) => (
                              <button
                                key={i}
                                onClick={() => handleSendMessage(sug)}
                                className="py-1 px-3 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-950 border border-sky-300/40 text-[11px] font-semibold text-left transition-all active:scale-97 cursor-pointer"
                              >
                                💬 {sug}
                              </button>
                            ))}
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
                  <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shrink-0 mt-1 shadow-xs border border-white/20">
                    <User className="w-4.5 h-4.5" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 items-center animate-in fade-in duration-200">
              <div className="w-9 h-9 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                <Bot className="w-4.5 h-4.5" />
              </div>
              <div className="glass-card bg-white/75 backdrop-blur-md border border-white/90 py-3 px-4 rounded-2xl text-xs font-semibold text-sky-900 flex items-center gap-2.5 shadow-xs">
                <Sparkles className="w-4 h-4 text-sky-600 animate-spin" />
                <span>
                  {language === 'en' 
                    ? 'Nyaay सारथी is analyzing statutes, case provisions, and drafting legal notice...' 
                    : 'न्याय सारथी AI कानूनों का विश्लेषण कर रहा है व ड्राफ्ट तैयार कर रहा है...'}
                </span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2.5 bg-white/45 backdrop-blur-md border-t border-white/70 overflow-x-auto flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
            {language === 'en' ? 'Quick Topics:' : 'त्वरित विषय:'}
          </span>
          {quickPrompts.map((qp, idx) => {
            const label = language === 'en' ? qp.en : qp.hi;
            return (
              <button
                key={idx}
                onClick={() => handleSendMessage(label)}
                disabled={isTyping}
                className="py-1 px-3 rounded-full bg-white/70 hover:bg-white text-slate-800 hover:text-sky-900 text-xs font-semibold border border-white/80 whitespace-nowrap cursor-pointer transition-all active:scale-95 shrink-0 disabled:opacity-50 shadow-2xs"
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Input Bar with Voice input & Send */}
        <div className="p-3 sm:p-4 bg-white/60 backdrop-blur-xl border-t border-white/80 shrink-0">
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
                ? 'Describe your legal dispute or question in plain Hindi or English...'
                : 'अपनी कानूनी स्थिति या समस्या को यहां लिखें (हिंदी या अंग्रेजी)...'}
              disabled={isTyping}
              className="flex-1 py-3 px-4 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 text-xs sm:text-sm text-slate-900 focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-400 font-medium disabled:opacity-60 shadow-inner"
            />

            <button
              type="button"
              onClick={toggleVoiceInput}
              title={isListening ? 'Stop listening' : 'Voice input'}
              className={`p-3 rounded-2xl border transition-all cursor-pointer active:scale-95 ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse shadow-[0_0_18px_rgba(244,63,94,0.5)]'
                  : 'bg-white/70 text-slate-700 hover:text-sky-700 hover:bg-white border-white/80 shadow-xs'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="glass-btn-primary py-3 px-5 rounded-2xl text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-[0_4px_16px_rgba(37,99,235,0.25)] transition-all active:scale-95 shrink-0 disabled:opacity-50"
            >
              <span>{language === 'en' ? 'Send' : 'भेजें'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>

      {/* Draft Legal Notice Modal */}
      {selectedDraftMessage && selectedDraftMessage.structuredData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 space-y-5 shadow-[0_24px_64px_rgba(31,38,135,0.2)] border border-white/85 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-sky-100/60">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-sky-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {selectedDraftMessage.structuredData.draftTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDraftMessage(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              {language === 'en'
                ? 'This formal legal notice draft is prepared according to Indian statutory practice. Fill in the bracketed placeholders [ ] with your specific transaction details.'
                : 'यह वैधानिक नोटिस प्रारूप तैयार है। कोष्ठक [ ] वाले स्थानों में अपनी सटीक जानकारी भरें।'}
            </p>

            <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-slate-900/90 text-slate-100 font-mono text-xs leading-relaxed whitespace-pre-wrap border border-white/20 shadow-inner">
              {selectedDraftMessage.structuredData.draftBody}
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-sky-100/60">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyDraft(selectedDraftMessage.structuredData!.draftBody!)}
                  className="glass-btn-sky py-2 px-3.5 rounded-xl bg-white/80 text-sky-800 border border-white/80 text-xs font-bold hover:bg-white flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-97"
                >
                  {copiedDraft ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedDraft ? 'Copied!' : 'Copy Notice'}</span>
                </button>

                <button
                  onClick={() => handleDownloadDraft(
                    selectedDraftMessage.structuredData!.draftTitle || 'Legal_Notice',
                    selectedDraftMessage.structuredData!.draftBody!
                  )}
                  className="glass-btn py-2 px-3.5 rounded-xl bg-white/60 text-slate-700 border border-white/80 text-xs font-bold hover:bg-white flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-97"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .txt</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedDraftMessage(null)}
                className="py-2 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer active:scale-97 shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Case Summary & Executive Brief Modal */}
      {selectedSummary && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 space-y-5 shadow-[0_24px_64px_rgba(31,38,135,0.2)] border border-white/85 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-sky-100/60">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {selectedSummary.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSummary(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              
              {/* Overview & Urgency */}
              <div className="p-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Executive Synopsis
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    selectedSummary.riskLevel === 'Urgent' ? 'bg-rose-500/15 text-rose-900 border border-rose-300/40' :
                    selectedSummary.riskLevel === 'High' ? 'bg-orange-500/15 text-orange-900 border border-orange-300/40' :
                    'bg-amber-500/15 text-amber-900 border border-amber-300/40'
                  }`}>
                    {selectedSummary.riskLevel} Risk & Urgency
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                  {selectedSummary.overview}
                </p>
                <p className="text-xs text-slate-600 pt-1 font-medium">
                  <strong>Statutory Window:</strong> {selectedSummary.timelineUrgency}
                </p>
              </div>

              {/* Key Grounds */}
              <div className="p-4 rounded-2xl bg-sky-500/10 backdrop-blur-md border border-sky-300/40 space-y-2 shadow-xs">
                <span className="text-[11px] font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ListChecks className="w-4 h-4 text-sky-700" />
                  Key Legal Merits & Statutory Grounds
                </span>
                <ul className="space-y-1.5 text-xs text-slate-800 font-medium">
                  {selectedSummary.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-sky-600 font-bold">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 48-Hour Checklist */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 backdrop-blur-md border border-emerald-300/40 space-y-2 shadow-xs">
                <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  Immediate 48-Hour Citizen Checklist
                </span>
                <ul className="space-y-1.5 text-xs text-slate-800">
                  {selectedSummary.next48Hours.map((task, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-semibold">{task}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Advocate Consultation Pitch / Brief */}
              <div className="p-4 rounded-2xl bg-slate-900/90 text-white space-y-2 border border-white/20 shadow-xs">
                <span className="text-[11px] font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  What to Tell Your Advocate (Consultation Brief)
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-mono bg-white/5 p-3 rounded-xl border border-white/10">
                  "{selectedSummary.advocateBrief}"
                </p>
                <p className="text-[11px] text-sky-200 pt-1 font-medium">
                  <strong>Expected Relief / Remedy:</strong> {selectedSummary.estimatedRemedy}
                </p>
              </div>

            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-sky-100/60">
              <button
                onClick={() => {
                  const summaryText = `AI CASE SUMMARY - ${selectedSummary.title}\n\nOVERVIEW:\n${selectedSummary.overview}\n\nKEY MERITS:\n${selectedSummary.keyPoints.join('\n')}\n\nNEXT 48 HOURS:\n${selectedSummary.next48Hours.join('\n')}\n\nADVOCATE BRIEF:\n${selectedSummary.advocateBrief}\n\nESTIMATED REMEDY:\n${selectedSummary.estimatedRemedy}`;
                  handleDownloadDraft(selectedSummary.title, summaryText);
                }}
                className="glass-btn py-2 px-3.5 rounded-xl bg-white/70 hover:bg-white text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-97"
              >
                <Download className="w-4 h-4" />
                <span>Export Brief (.txt)</span>
              </button>

              <button
                onClick={() => setSelectedSummary(null)}
                className="py-2 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer active:scale-97 shadow-xs"
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
