import { GoogleGenAI, Type } from "@google/genai";

function getGenAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.API_KEY || "";
  if (apiKey) {
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return new GoogleGenAI({
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

function cleanJsonText(raw: string): string {
  let cleaned = (raw || '').trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
}

/**
 * Resilient helper that attempts calls across available Gemini models
 * with automatic fallback if a model is temporarily unavailable (503 / high demand)
 */
async function callGeminiWithFallback(params: {
  contents: string;
  config: any;
  models?: string[];
}): Promise<string> {
  const ai = getGenAI();
  const modelList = params.models || [
    "gemini-3.6-flash",
    "gemini-3.7-flash",
    "gemini-3.1-flash-lite",
    "gemini-3.1-pro-preview"
  ];
  let lastError: any = null;

  for (const model of modelList) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config
      });
      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || JSON.stringify(err);
      const isTransient = err?.status === 503 || err?.code === 503 || errMsg.includes('503') || errMsg.includes('UNAVAILABLE') || errMsg.includes('high demand') || errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED');
      
      if (isTransient) {
        console.warn(`Gemini model ${model} temporarily busy/unavailable, failing over to next model in cascade...`);
        // Short pause with backoff before next model
        await new Promise((res) => setTimeout(res, 350));
        continue;
      } else {
        console.warn(`Gemini model ${model} error (${err?.status || err?.code || 'unknown'}):`, err?.message || err);
      }
    }
  }

  throw lastError || new Error("All Gemini models in cascade were unavailable");
}

export interface AiLegalAnalysisResult {
  text: string;
  understanding: string;
  rights: string[];
  legalArea: string;
  isActionable: string;
  authority: string;
  documents: string[];
  nextSteps: string[];
  legalAid: string;
  recommendedCategory: string;
  suggestedAdvocateSpecialty: string;
  draftTitle: string;
  draftBody: string;
  summary: {
    title: string;
    overview: string;
    keyPoints: string[];
    riskLevel: 'Low' | 'Medium' | 'High' | 'Urgent';
    timelineUrgency: string;
    next48Hours: string[];
    advocateBrief: string;
    estimatedRemedy: string;
  };
  suggestions: string[];
}

export interface AiSummaryResult {
  title: string;
  overview: string;
  keyPoints: string[];
  riskLevel: 'Low' | 'Medium' | 'High' | 'Urgent';
  timelineUrgency: string;
  next48Hours: string[];
  advocateBrief: string;
  estimatedRemedy: string;
}

const SYSTEM_INSTRUCTION = `You are "Nyaay सारथी" (Nyay Sarathi), an empathetic, deeply knowledgeable, verified AI Indian Legal and Citizen Empowerment Assistant powered by Gemini.
Your mission is to directly answer whatever question, grievance, scenario, or legal dilemma the citizen asks—whether specific or broad, civil or criminal, procedural or theoretical.

Core Rules for AI Generation & Verification:
1. ALWAYS DIRECTLY ANSWER ANY QUESTION ASKED: Pay close attention to what the user asks (e.g., consumer rights, cyber frauds, tenancy disputes, employment/labour law, criminal proceedings/FIRs, arrest procedures, cheque bounce, matrimonial/family law, RTI queries, constitutional rights, property, contracts, or general law queries). Provide a comprehensive, accurate, empathetic, and legally verified response in "text".
2. Ground all legal advice in current Indian statutes and landmark precedents:
   - Bharatiya Nyaya Sanhita (BNS, 2023) / Indian Penal Code (IPC)
   - Bharatiya Nagarik Suraksha Sanhita (BNSS, 2023) / Code of Criminal Procedure (CrPC) (including Zero FIR provisions under Section 173 BNSS, arrest guidelines under Section 35 BNSS, bail provisions)
   - Bharatiya Sakshya Adhiniyam (BSA, 2023) / Indian Evidence Act (electronic evidence admissibility under Section 63)
   - Consumer Protection Act, 2019 (Deficiency in service, unfair trade practices, e-Daakhil filing, National Consumer Helpline 1915)
   - Information Technology Act, 2000 (Section 43A, 66D) & National Cyber Crime Portal (cybercrime.gov.in, 24x7 Helpline 1930)
   - Legal Services Authorities Act, 1987 (Section 12 free legal aid through NALSA / SLSA / DLSA, Helpline 15100)
   - Right to Information (RTI) Act, 2005 (30-day timeline, first & second appeals)
   - Real Estate (Regulation and Development) Act (RERA, 2016) / State Rent Control / Model Tenancy Act
   - Negotiable Instruments Act, 1881 (Section 138 statutory demand notice & 30-day filing rule)
   - Labour Codes, Payment of Gratuity Act, Industrial Disputes Act, POSH Act 2013
   - Family Laws: Hindu Marriage Act, Special Marriage Act, Protection of Women from Domestic Violence Act (PWDVA 2005), Maintenance under Section 144 BNSS / 125 CrPC
   - Motor Vehicles Act (MACT claims, third-party insurance)
3. Clarity and Tone: Write in warm, encouraging, plain language. Avoid excessive Latin jargon; clearly explain complex legal terminology.
4. Categorization: Accurately classify the inquiry into one of the platform categories: 'Cyber Crime', 'Consumer Dispute', 'Civil Law', 'Criminal Law', 'Labour & Employment', 'Family & Matrimonial', 'Property & Real Estate', 'Banking & Cheque Bounce', 'Constitutional & RTI', 'Corporate & Commercial'.
5. Practical Evidentiary Checklist & Action Plan: Provide realistic next steps with realistic timelines and necessary evidentiary records to preserve.
6. Ready-to-Use Legal Draft: Generate a complete, ready-to-use formal legal notice, representation, or police petition tailored to the exact facts and figures mentioned by the citizen.
7. Dynamic Suggestions: Provide 3-4 intelligent follow-up suggestions tailored to what they might need next.
8. Output strictly valid JSON matching the schema.`;

export async function generateLegalGuidance(params: {
  message: string;
  history?: Array<{ sender: 'user' | 'assistant'; text: string }>;
  language?: 'en' | 'hi';
  citizenContext?: { name?: string; state?: string; city?: string };
}): Promise<AiLegalAnalysisResult> {
  const { message, history = [], language = 'en', citizenContext } = params;

  const conversationContext = history
    .slice(-8)
    .map(h => `${h.sender === 'user' ? 'Citizen' : 'Nyaay Sarathi'}: ${h.text}`)
    .join('\n');

  const prompt = `Citizen's Question / Grievance:
"${message}"

Language preference: ${language === 'hi' ? 'Hindi (हिंदी)' : 'English (with Hindi legal terms where helpful)'}
Citizen Profile Context: ${citizenContext ? `Name: ${citizenContext.name || 'Citizen'}, Location: ${citizenContext.city ? `${citizenContext.city}, ` : ''}${citizenContext.state || 'India'}` : 'Indian Citizen'}

Previous Conversation History:
${conversationContext || 'This is the start of the conversation.'}

Instructions:
1. Provide a comprehensive, direct, and empathetic conversational response in "text" answering the citizen's exact question and explaining their rights and remedies under Indian law.
2. Summarize their core grievance concisely in "understanding".
3. List 2-4 applicable Indian Acts, sections, or statutory rights in "rights".
4. Identify the precise "legalArea", "authority", and "isActionable" urgency.
5. Provide a realistic checklist of necessary evidentiary documents in "documents".
6. Outline chronological next steps in "nextSteps".
7. Detail free legal aid options under NALSA in "legalAid".
8. Choose matching "recommendedCategory" and "suggestedAdvocateSpecialty".
9. Draft a formal legal notice, representation, or police petition tailored to this exact grievance in "draftTitle" and "draftBody".
10. Generate an executive case brief in "summary".
11. Provide 3-4 dynamic follow-up questions in "suggestions".

Return strictly valid JSON adhering to the schema.`;

  try {
    const rawText = await callGeminiWithFallback({
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: {
              type: Type.STRING,
              description: "Empathetic, clear, and comprehensive conversational legal response directly answering the user's specific question."
            },
            understanding: {
              type: Type.STRING,
              description: "1-2 sentence crisp synopsis of the citizen's specific inquiry or grievance."
            },
            rights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 2-4 key Indian statutory sections, Acts, and constitutional rights applicable."
            },
            legalArea: {
              type: Type.STRING,
              description: "Specific legal field (e.g., 'Cyber Crime & Financial Recovery', 'Consumer Protection', 'Tenancy & Property Dispute', 'Criminal Law & FIR', 'Labour & Employment')."
            },
            isActionable: {
              type: Type.STRING,
              description: "Actionability rating and urgency timeline (e.g. 'High - 24-hour golden hour banking freeze applicable')."
            },
            authority: {
              type: Type.STRING,
              description: "The exact forum, commission, tribunal, DLSA, or police station with jurisdiction."
            },
            documents: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Checklist of 3-5 necessary evidentiary documents the citizen must preserve."
            },
            nextSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-5 chronological, actionable steps the citizen should take right now."
            },
            legalAid: {
              type: Type.STRING,
              description: "NALSA / DLSA Section 12 free legal aid eligibility guidance."
            },
            recommendedCategory: {
              type: Type.STRING,
              description: "Matching category from platform: 'Cyber Crime', 'Consumer Dispute', 'Civil Law', 'Criminal Law', 'Labour & Employment', 'Family & Matrimonial', 'Property & Real Estate', 'Banking & Cheque Bounce', 'Constitutional & RTI'."
            },
            suggestedAdvocateSpecialty: {
              type: Type.STRING,
              description: "Advocate title and specialization needed (e.g., 'Cyber Crime & Recovery Advocate', 'Consumer Rights Specialist')."
            },
            draftTitle: {
              type: Type.STRING,
              description: "Title for formal legal notice, representation, or police petition."
            },
            draftBody: {
              type: Type.STRING,
              description: "Complete formal legal notice or complaint draft with proper legal formatting and placeholders."
            },
            summary: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "Short title of the case brief" },
                overview: { type: Type.STRING, description: "2-3 sentence executive synopsis of the grievance and legal stance" },
                keyPoints: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "3-4 bullet points highlighting statutory merits and claims"
                },
                riskLevel: {
                  type: Type.STRING,
                  enum: ["Low", "Medium", "High", "Urgent"],
                  description: "Urgency assessment"
                },
                timelineUrgency: { type: Type.STRING, description: "Statutory limitation period or deadline notice window" },
                next48Hours: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "2-3 immediate checklist actions for the citizen within 48 hours"
                },
                advocateBrief: { type: Type.STRING, description: "A concise 3-line briefing the citizen can present directly to an advocate" },
                estimatedRemedy: { type: Type.STRING, description: "Likely legal remedies, refunds, damages, or injunctive relief" }
              },
              required: ["title", "overview", "keyPoints", "riskLevel", "timelineUrgency", "next48Hours", "advocateBrief", "estimatedRemedy"]
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-4 dynamic follow-up questions or next actions the citizen can click on."
            }
          },
          required: [
            "text", "understanding", "rights", "legalArea", "isActionable", 
            "authority", "documents", "nextSteps", "legalAid", 
            "recommendedCategory", "suggestedAdvocateSpecialty", 
            "draftTitle", "draftBody", "summary", "suggestions"
          ]
        }
      }
    });

    const jsonText = cleanJsonText(rawText || "{}");
    const parsed = JSON.parse(jsonText) as AiLegalAnalysisResult;
    
    // Ensure all critical fallback structures
    if (!parsed.summary) {
      parsed.summary = {
        title: parsed.understanding || "Legal Case Brief",
        overview: parsed.text?.slice(0, 160) || "Comprehensive statutory legal assessment.",
        keyPoints: parsed.rights || ["Statutory rights under Indian law apply"],
        riskLevel: "Medium",
        timelineUrgency: "Action recommended within 15-30 days",
        next48Hours: parsed.nextSteps?.slice(0, 3) || ["Preserve evidence", "Send notice", "Consult advocate"],
        advocateBrief: `Citizen requires guidance regarding ${parsed.legalArea || 'legal matter'}.`,
        estimatedRemedy: "Statutory remedy & damages"
      };
    }
    if (!parsed.suggestions || !Array.isArray(parsed.suggestions) || parsed.suggestions.length === 0) {
      parsed.suggestions = language === 'hi' ? [
        "सबूत के तौर पर कौन से दस्तावेज सुरक्षित रखने चाहिए?",
        "क्या मैं खुद कानूनी नोटिस भेज सकता हूँ?",
        "इस मामले में मुफ्त कानूनी सहायता कैसे मिलेगी?",
        "संबंधित विशेषज्ञ वकील से परामर्श कैसे करें?"
      ] : [
        "What documents should I preserve as evidence?",
        "Can I issue this legal notice myself?",
        "How do I apply for free legal aid under NALSA?",
        "How do I schedule a consultation with an advocate?"
      ];
    }

    return parsed;
  } catch (error) {
    console.error("Gemini API Error in generateLegalGuidance, utilizing contextual legal reasoning:", error);
    return generateFallbackGuidance(message, language);
  }
}

export async function summarizeLegalDiscussion(params: {
  text?: string;
  messages?: Array<{ sender: 'user' | 'assistant'; text: string }>;
  language?: 'en' | 'hi';
}): Promise<AiSummaryResult> {
  const { text, messages = [], language = 'en' } = params;

  let combinedContent = text || '';
  if (!combinedContent && messages.length > 0) {
    combinedContent = messages
      .map(m => `${m.sender === 'user' ? 'Citizen' : 'Legal Assistant'}: ${m.text}`)
      .join('\n\n');
  }

  const prompt = `Please summarize this Indian legal consultation/grievance into an executive case brief for the citizen:

Content:
${combinedContent}

Language: ${language === 'hi' ? 'Hindi (हिंदी)' : 'English'}

Provide a structured, practical, and highly scannable case brief.`;

  try {
    const rawText = await callGeminiWithFallback({
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Concise title for the case summary" },
            overview: { type: Type.STRING, description: "2-3 sentence executive synopsis of the issue" },
            keyPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-4 key legal rights, statutes, and facts"
            },
            riskLevel: {
              type: Type.STRING,
              enum: ["Low", "Medium", "High", "Urgent"],
              description: "Urgency assessment"
            },
            timelineUrgency: { type: Type.STRING, description: "Limitation period or notice window" },
            next48Hours: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 concrete actions for the next 48 hours"
            },
            advocateBrief: { type: Type.STRING, description: "3-sentence pitch for an advocate consultation" },
            estimatedRemedy: { type: Type.STRING, description: "Potential relief, refunds, or compensation" }
          },
          required: ["title", "overview", "keyPoints", "riskLevel", "timelineUrgency", "next48Hours", "advocateBrief", "estimatedRemedy"]
        }
      }
    });

    const jsonText = cleanJsonText(rawText || "{}");
    return JSON.parse(jsonText) as AiSummaryResult;
  } catch (error) {
    console.error("Gemini API Error in summarizeLegalDiscussion:", error);
    return {
      title: language === 'en' ? "Legal Case Summary & Action Brief" : "कानूनी सारांश व कार्य योजना",
      overview: language === 'en' 
        ? "Summary of your legal matter detailing the core dispute, relevant statutory protections under Indian law, and recommended immediate measures."
        : "आपके मामले का संक्षिप्त कानूनी सारांश, लागू भारतीय कानून और तुरंत उठाए जाने वाले कदम।",
      keyPoints: [
        language === 'en' ? "Formal documentation and proof of communication are crucial" : "लिखित साक्ष्य और संचार रिकॉर्ड सुरक्षित रखें",
        language === 'en' ? "Statutory notice serves as mandatory pre-litigation step" : "वैधानिक नोटिस मुकदमे से पूर्व आवश्यक कदम है",
        language === 'en' ? "Competent forum has jurisdiction over financial or service relief" : "संबंधित प्राधिकरण या न्यायालय से राहत प्राप्त की जा सकती है"
      ],
      riskLevel: "Medium",
      timelineUrgency: language === 'en' ? "Action recommended within 15 to 30 days" : "15 से 30 दिनों के भीतर कार्रवाई अनुशंसित",
      next48Hours: [
        language === 'en' ? "Collate all receipts, transaction IDs, emails, and WhatsApp records" : "सभी रसीदें, बैंक स्टेटमेंट और संदेश सुरक्षित करें",
        language === 'en' ? "Send written statutory communication/notice to opposing party" : "विपक्षी पक्ष को लिखित सूचना/नोटिस प्रेषित करें",
        language === 'en' ? "Consult a verified advocate in this specific practice area" : "संबंधित क्षेत्र के विशेषज्ञ वकील से परामर्श करें"
      ],
      advocateBrief: language === 'en'
        ? "Citizen seeks recovery and statutory compensation for dispute; requires assistance drafting notice and filing petition before competent forum."
        : "नागरिक अपने कानूनी अधिकारों की रक्षा एवं उचित मुआवजे हेतु कानूनी नोटिस व याचिका दायर करने हेतु परामर्श चाहते हैं।",
      estimatedRemedy: language === 'en' ? "Full relief/refund with statutory interest and damages" : "पूर्ण समाधान, ब्याज व क्षतिपूर्ति"
    };
  }
}

export async function generateFollowUpSuggestions(params: {
  message: string;
  context?: string;
  language?: 'en' | 'hi';
}): Promise<string[]> {
  const { message, context = '', language = 'en' } = params;

  const prompt = `Based on this legal inquiry: "${message}" and context: "${context}", generate 4 highly relevant, insightful follow-up questions or actions a citizen would want to ask next.
Language: ${language === 'hi' ? 'Hindi (हिंदी)' : 'English'}`;

  try {
    const rawText = await callGeminiWithFallback({
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "4 follow up questions"
            }
          },
          required: ["suggestions"]
        }
      }
    });

    const jsonText = cleanJsonText(rawText || "{}");
    const parsed = JSON.parse(jsonText);
    return parsed.suggestions || [];
  } catch (error) {
    console.error("Gemini API Error in generateFollowUpSuggestions:", error);
    return language === 'en' ? [
      "What documents do I need to preserve as evidence?",
      "Can I send a legal notice myself or do I need a lawyer?",
      "What is the limitation period for filing this complaint?",
      "Am I entitled to compensation for harassment or delay?"
    ] : [
      "सबूत के तौर पर कौन से दस्तावेज सुरक्षित रखने चाहिए?",
      "क्या मैं खुद कानूनी नोटिस भेज सकता हूँ या वकील की जरूरत होगी?",
      "इस शिकायत को दर्ज कराने की समय सीमा क्या है?",
      "क्या मुझे मानसिक परेशानी और नुकसान का हर्जाना मिल सकता है?"
    ];
  }
}

// Resilient legal domain reasoner for fallback
function generateFallbackGuidance(query: string, language: 'en' | 'hi'): AiLegalAnalysisResult {
  const q = query.toLowerCase();
  
  // 1. Cyber Fraud / UPI / Online Banking
  if (q.includes('cyber') || q.includes('upi') || q.includes('fraud') || q.includes('scam') || q.includes('bank') || q.includes('otp') || q.includes('1930') || q.includes('साइबर') || q.includes('धोखा') || q.includes('पैसे कट')) {
    return {
      text: language === 'en'
        ? `Regarding your query on cyber financial fraud: Under the Information Technology Act, 2000 and RBI circulars on limited customer liability, you are protected against unauthorized electronic transactions if reported promptly. Immediately report to the National Cyber Crime Helpline (1930) within the "Golden Hour" to freeze fund trails across beneficiary payment gateways. You should also register an acknowledgment on cybercrime.gov.in.`
        : `साइबर व बैंक फ्रॉड के संबंध में: सूचना प्रौद्योगिकी अधिनियम (IT Act 2000) और RBI के दिशा-निर्देशों के अनुसार यदि आप तुरंत सूचना देते हैं तो ग्राहक की देयता शून्य होती है। 'गोल्डन ऑवर' (पहले कुछ घंटों) के भीतर तुरंत 1930 पर कॉल करें ताकि आरोपी बैंक खातों को फ्रीज किया जा सके और cybercrime.gov.in पर रिपोर्ट दर्ज करें।`,
      understanding: language === 'en'
        ? "Unauthorized financial cyber transaction and digital fraud requiring urgent account freeze and cybercell FIR."
        : "अनधिकृत ऑनलाइन वित्तीय धोखाधड़ी जिसके लिए तुरंत 1930 हेल्पलाइन व साइबर क्राइम पोर्टल पर शिकायत आवश्यक है।",
      rights: [
        "RBI Master Circular on Customer Protection (Zero Liability for prompt reporting)",
        "Information Technology Act, 2000 - Section 43A & Section 66D (Cheating by impersonation)",
        "Bharatiya Nyaya Sanhita, 2023 - Section 318(4) (Cheating) / Section 319"
      ],
      legalArea: "Cyber Crime",
      isActionable: "Urgent - Golden Hour 24h bank freeze action recommended",
      authority: "National Cyber Crime Reporting Portal (1930) / State Cyber Crime Police Station",
      documents: [
        "Bank account statement / UPI transaction screenshot with UTR / Reference ID",
        "SMS transaction alert and email notifications",
        "WhatsApp / Telegram / Call logs of the fraudulent sender",
        "Copy of written complaint submitted to your home bank branch"
      ],
      nextSteps: [
        "Call National Cyber Helpline 1930 immediately to freeze beneficiary bank accounts",
        "Register a formal incident report on cybercrime.gov.in with all transaction proofs",
        "Submit a written dispute letter to your bank branch within 3 days to invoke RBI Zero Liability",
        "Consult a verified Cyber Law Advocate on Nyaay सारथी for follow-up"
      ],
      legalAid: "Free legal assistance is provided through NALSA (15100) and DLSA helpdesks.",
      recommendedCategory: "Cyber Crime",
      suggestedAdvocateSpecialty: "Cyber Crime & Financial Recovery Advocate",
      draftTitle: "POLICE & CYBER CRIME COMPLAINT FOR FINANCIAL FRAUD",
      draftBody: `TO:
THE OFFICER-IN-CHARGE,
CYBER CRIME POLICE STATION,
[City / District Name]

SUBJECT: COMPLAINT UNDER SECTIONS 43A, 66D IT ACT 2000 & SECTION 318 BNS 2023 REGARDING UNAUTHORIZED TRANSACTION OF INR [Amount].

Respected Sir/Madam,

I, [Citizen Name], residing at [Address], Mobile No. [Phone], hereby lodge this formal complaint:

1. That I hold a savings account bearing No. [Account No.] with [Bank Name], [Branch].
2. That on [Date] at [Time], an unauthorized fraudulent deduction of INR [Amount] occurred from my account via UPI/Netbanking with Transaction Ref / UTR No. [UTR Number].
3. That I did not authorize this transaction, nor did I voluntarily share my secret credentials.
4. That I have already lodged an initial grievance on the National Cyber Crime Portal with Acknowledgement No. [Ack No. / 1930 Ticket].

I earnestly request your good office to register an FIR under Section 66D IT Act and Section 318 BNS 2023, issue statutory notices to the beneficiary bank for immediate lien marking/freeze, and recover my hard-earned funds.

Yours faithfully,
[Citizen Name]
Date: [Current Date]`,
      summary: {
        title: "Cyber Financial Fraud Recovery Brief",
        overview: "Unauthorized digital deduction reported; priority focus on 1930 helpline freeze and invoking RBI customer protection guidelines.",
        keyPoints: [
          "1930 helpline can trigger automatic transaction lien across beneficiary banks",
          "RBI guidelines limit citizen liability if reported within 3 days",
          "Cyber portal acknowledgement serves as formal police document"
        ],
        riskLevel: "Urgent",
        timelineUrgency: "Immediate (within 24-72 hours for recovery)",
        next48Hours: [
          "Call 1930 and obtain cyber crime acknowledgement ticket",
          "Submit physical dispute letter to home bank branch manager",
          "Follow up on bank lien status and consult a cyber lawyer"
        ],
        advocateBrief: "Citizen defrauded of funds through electronic transaction; seeking assistance with police follow-up and Banking Ombudsman representation.",
        estimatedRemedy: "Full refund / reversal under RBI Zero-Liability framework"
      },
      suggestions: [
        "What is the RBI 3-day zero liability rule for unauthorized transactions?",
        "How do I check if the beneficiary account was frozen by 1930?",
        "How do I file a complaint with the RBI Banking Ombudsman?",
        "Connect me with a Cyber Crime Advocate"
      ]
    };
  }

  // 2. Consumer Disputes / E-Commerce / Defective Products
  if (q.includes('consumer') || q.includes('refund') || q.includes('defective') || q.includes('warranty') || q.includes('amazon') || q.includes('flipkart') || q.includes('order') || q.includes('उपभोक्ता') || q.includes('रिफंड') || q.includes('सामान')) {
    return {
      text: language === 'en'
        ? `Under the Consumer Protection Act, 2019, consumers have the legal right to receive defect-free goods and deficiency-free services. E-commerce platforms and manufacturers cannot refuse refunds or replacement for defective items or misleading advertisements. You can file a grievance on the National Consumer Helpline (1915), issue a 15-day legal notice, or file a complaint online through e-Daakhil without physical court visits.`
        : `उपभोक्ता संरक्षण अधिनियम 2019 के अंतर्गत प्रत्येक उपभोक्ता को सही सामान व सेवा का कानूनी अधिकार है। यदि कोई कंपनी या ई-कॉमर्स विक्रेता खराब सामान देता है या रिफंड से मना करता है, तो आप राष्ट्रीय उपभोक्ता हेल्पलाइन (1915) पर शिकायत कर सकते हैं और ई-दाखिल (e-Daakhil) पोर्टल के माध्यम से उपभोक्ता आयोग में केस दायर कर सकते हैं।`,
      understanding: language === 'en'
        ? "Deficiency in service / delivery of defective product with refusal to provide refund or replacement."
        : "दोषपूर्ण सामान या सेवा में कमी, विक्रेता द्वारा रिफंड या रिप्लेसमेंट से इनकार।",
      rights: [
        "Consumer Protection Act, 2019 - Section 2(11) (Deficiency in Service)",
        "Consumer Protection Act, 2019 - Section 2(47) (Unfair Trade Practice)",
        "Right to Product Liability Claim under Chapter VI of CPA 2019"
      ],
      legalArea: "Consumer Dispute",
      isActionable: "High - Issue 15-day legal notice followed by e-Daakhil petition",
      authority: "District Consumer Disputes Redressal Commission / e-Daakhil / NCH 1915",
      documents: [
        "Purchase Invoice / Bill and Order Confirmation",
        "Photographs/Videos showing defect or unboxing",
        "Customer support emails, chat transcripts, and ticket numbers",
        "Payment receipt or credit card / UPI statement"
      ],
      nextSteps: [
        "Call National Consumer Helpline (1915) or register on consumerhelpline.gov.in",
        "Send a formal 15-day Statutory Demand Notice to the seller & platform",
        "File a consumer complaint on the e-Daakhil portal if refund is not issued",
        "Consult a Consumer Law Advocate on Nyaay सारथी"
      ],
      legalAid: "Consumers can represent themselves in Consumer Commissions without mandatory lawyer fees, or access DLSA aid.",
      recommendedCategory: "Consumer Dispute",
      suggestedAdvocateSpecialty: "Consumer Rights & E-Daakhil Specialist",
      draftTitle: "FORMAL LEGAL NOTICE FOR CONSUMER GRIEVANCE & REFUND",
      draftBody: `LEGAL NOTICE

To:
[Seller / Company Name]
[Registered Address]
[Customer Support Email]

SUBJECT: LEGAL NOTICE UNDER CONSUMER PROTECTION ACT, 2019 FOR DEFICIENCY IN SERVICE AND REFUND OF INR [Amount] (Order ID: [Order ID]).

Sir/Madam,

Under instructions from my client, [Citizen Name], I hereby serve you with this Legal Notice:

1. That my client purchased [Product/Service Name] on [Date] against Invoice No. [Invoice No.] for a sum of INR [Amount].
2. That upon delivery, the product was found to be [Describe Defect / Non-functional], which was immediately reported to your customer support on [Date].
3. That despite multiple assurances and complaint tickets, you have wrongfully refused to replace the defective unit or process a full refund.
4. That your actions constitute "Deficiency in Service" under Section 2(11) and "Unfair Trade Practice" under Section 2(47) of the Consumer Protection Act, 2019.

You are hereby called upon to refund the full purchase amount of INR [Amount] along with INR [Compensation Amount] towards mental agony within 15 (fifteen) days of receipt of this notice, failing which my client shall file a formal complaint before the District Consumer Commission via e-Daakhil at your sole risk and costs.

[Citizen / Authorized Advocate Name]
Date: [Current Date]`,
      summary: {
        title: "Consumer Dispute & Refund Action Brief",
        overview: "Actionable claim against seller for defective merchandise and unfair refusal of refund under CPA 2019.",
        keyPoints: [
          "CPA 2019 provides statutory claim for product replacement, refund, and damages",
          "e-Daakhil enables complete online filing without physical court appearance",
          "15-day notice creates strong evidentiary foundation for court award"
        ],
        riskLevel: "Medium",
        timelineUrgency: "2-year limitation period from date of defect; Notice recommended within 15 days",
        next48Hours: [
          "Log complaint on NCH Helpline 1915",
          "Send drafted 15-day notice via email and speed post",
          "Prepare e-Daakhil draft with a consumer lawyer"
        ],
        advocateBrief: "Client supplied defective goods; seller refusing refund; seeking consumer commission filing for refund, statutory interest, and mental agony damages.",
        estimatedRemedy: "Full refund + statutory interest + compensation for mental harassment"
      },
      suggestions: [
        "How do I file a case on the e-Daakhil portal?",
        "Can I claim compensation for mental harassment in Consumer Court?",
        "What is the National Consumer Helpline 1915 resolution time?",
        "Connect me with a Consumer Rights Advocate"
      ]
    };
  }

  // 3. Tenancy / Rent / Security Deposit
  if (q.includes('landlord') || q.includes('rent') || q.includes('deposit') || q.includes('tenant') || q.includes('मकान मालिक') || q.includes('किराया')) {
    return {
      text: language === 'en'
        ? "Under Indian tenancy jurisprudence and Model Tenancy principles, your landlord cannot arbitrarily withhold or forfeit your security deposit without providing an itemized bill of bona fide damages. Security deposits must be refunded within 30 days of peaceful handover after adjusting legitimate dues. You can issue a formal 15-day demand notice followed by Rent Court / Civil Court proceedings."
        : "भारतीय किरायेदारी कानून व मॉडल टेनेंसी एक्ट के अनुसार मकान मालिक बिना किसी उचित कारण या लिखित बिल के आपकी जमानत राशि (सिक्योरिटी डिपॉजिट) जब्त नहीं कर सकता। मकान खाली करने के ३० दिनों के भीतर वैध कटौती कर शेष राशि लौटाना अनिवार्य है।",
      understanding: language === 'en'
        ? "Landlord unlawfully withholding security deposit post-tenancy without furnishing itemized deductions."
        : "मकान खाली करने के बाद मकान मालिक द्वारा बिना किसी उचित कारण सिक्योरिटी डिपॉजिट वापस न करना।",
      rights: [
        "Model Tenancy Act - 30-day statutory refund mandate",
        "Civil Procedure Code - Recovery Suit for Money under Order 37",
        "Indian Contract Act, 1872 - Section 73 (Breach of Contract)"
      ],
      legalArea: "Property & Real Estate",
      isActionable: "High - Issue a 15-day statutory Demand Notice before civil suit",
      authority: "Rent Authority / Rent Court / Civil Court",
      documents: [
        "Original Rent Agreement / Lease Deed",
        "Bank statements / UPI transaction slips showing deposit payment",
        "Handover inspection record / WhatsApp chat confirming vacant possession",
        "Notice to vacate and postal receipts"
      ],
      nextSteps: [
        "Send a formal Legal Demand Notice granting 15 days for full refund",
        "Keep bank proofs and written communications documented",
        "File a petition before the Rent Authority or a Summary Suit (Order 37 CPC) if unpaid",
        "Consult a verified Civil / Tenancy Advocate on Nyaay सारथी"
      ],
      legalAid: "Free legal aid is available under Section 12 NALSA if your annual income is within state threshold.",
      recommendedCategory: "Property & Real Estate",
      suggestedAdvocateSpecialty: "Tenancy & Civil Recovery Advocate",
      draftTitle: "FORMAL DEMAND NOTICE FOR RETURN OF SECURITY DEPOSIT",
      draftBody: `LEGAL NOTICE

To:
[Landlord Name / Owner]
[Address / Contact Details]

Subject: Formal Statutory Notice for Immediate Refund of Security Deposit of INR [Amount] for Premises [Property Address].

Sir/Madam,

Under instructions from my client, [Citizen Name], residing at [Current Address], I hereby serve you with this formal Legal Notice:

1. That my client was the lawful tenant of premises [Flat/House No., Address] from [Start Date] to [End Date] pursuant to the Rent Agreement dated [Agreement Date].
2. That at the inception of the tenancy, my client deposited an interest-free refundable security deposit of INR [Amount] via [Bank Transfer/UPI/Cheque Details].
3. That my client peacefully handed over vacant and unencumbered possession of the said premises on [Vacating Date] with all electricity, water, and maintenance dues fully cleared.
4. That despite lapse of more than 30 days and repeated requests, you have failed and neglected to refund the said security deposit without any lawful justification.

You are hereby called upon to refund the entire security deposit of INR [Amount] along with statutory interest @18% per annum within 15 (fifteen) days from the receipt of this notice, failing which my client shall be constrained to initiate appropriate civil proceedings under Order 37 CPC and criminal proceedings for breach of trust, holding you liable for all costs and consequences.

Dated: [Today's Date]
Place: [City]

[Citizen / Advocate Signature]`,
      summary: {
        title: "Tenancy Security Deposit Dispute Brief",
        overview: "Dispute regarding unlawful retention of rental security deposit upon smooth handover of premises.",
        keyPoints: [
          "Security deposit is refundable within 30 days under tenancy principles",
          "Landlord must furnish verified bills for any claimed damages",
          "Legal notice sets mandatory 15-day cure period"
        ],
        riskLevel: "Medium",
        timelineUrgency: "3-year limitation period from date of vacating; Notice advised immediately",
        next48Hours: [
          "Compile rent agreement and deposit transfer receipts",
          "Send the drafted formal demand notice via Registered Post / Email",
          "Book a consultation with a Civil Advocate if landlord does not comply"
        ],
        advocateBrief: "Client vacated rented property on agreed terms; landlord withholding deposit without cause; issued notice and seeking summary recovery suit.",
        estimatedRemedy: "Full refund of deposit amount + statutory interest @12-18% + legal costs"
      },
      suggestions: [
        "How can I calculate statutory interest on my deposit?",
        "Can I file a consumer complaint against the landlord?",
        "What if the rent agreement was not registered?",
        "Help me book an advocate for civil recovery"
      ]
    };
  }

  // 4. Cheque Bounce / Section 138 NI Act
  if (q.includes('cheque') || q.includes('check') || q.includes('138') || q.includes('bounce') || q.includes('चेक बाउंस')) {
    return {
      text: language === 'en'
        ? "Under Section 138 of the Negotiable Instruments Act, 1881, dishonour of a cheque for insufficiency of funds or exceeding arrangements is a criminal offence punishable with imprisonment up to 2 years or fine up to twice the cheque amount. You must dispatch a statutory Legal Notice within 30 days of receiving the bank memo, giving the drawer 15 days to pay. If they fail, a complaint must be filed within 1 month before the Judicial Magistrate."
        : "परक्राम्य लिखत अधिनियम (NI Act) की धारा 138 के तहत चेक बाउंस होना एक दंडनीय अपराध है जिसमें 2 साल तक की जेल या चेक राशि का दोगुना जुर्माना हो सकता है। बैंक से मेमो मिलने के 30 दिनों के भीतर कानूनी नोटिस भेजना अनिवार्य है। 15 दिन का समय देने के बाद भी भुगतान न होने पर 1 माह के भीतर न्यायालय में केस दायर करना होता है।",
      understanding: language === 'en'
        ? "Cheque dishonoured due to insufficient funds; strict statutory limitation timelines under Section 138 NI Act apply."
        : "खाते में पर्याप्त राशि न होने के कारण चेक बाउंस; धारा 138 एनआई एक्ट के तहत 30 दिवसीय नोटिस समय सीमा लागू।",
      rights: [
        "Negotiable Instruments Act, 1881 - Section 138 (Dishonour of Cheque)",
        "Section 143A NI Act - Right to Interim Compensation up to 20% of cheque amount",
        "Section 139 NI Act - Statutory presumption of legally enforceable debt"
      ],
      legalArea: "Banking & Cheque Bounce",
      isActionable: "High - Mandatory 30-day statutory notice clock ticking from bank memo date",
      authority: "Court of Judicial Magistrate First Class / Metropolitan Magistrate",
      documents: [
        "Original Cheque and Bank Return Memo stating 'Funds Insufficient'",
        "Underlying bill, agreement, loan promissory note or proof of liability",
        "Statutory Legal Demand Notice copy and Speed Post / Tracking Receipt",
        "Bank account statement proving deposit and dishonour"
      ],
      nextSteps: [
        "Send Statutory Legal Demand Notice within 30 days of bank memo date",
        "Allow 15 statutory cure days from receipt of notice for payment",
        "File Section 138 Criminal Complaint within 30 days post-cure window",
        "Engage a Cheque Bounce Specialist Advocate on Nyaay सारथी"
      ],
      legalAid: "Free legal aid is available via DLSA for eligible individuals.",
      recommendedCategory: "Banking & Cheque Bounce",
      suggestedAdvocateSpecialty: "NI Act & Financial Recovery Advocate",
      draftTitle: "STATUTORY DEMAND NOTICE UNDER SECTION 138 NI ACT 1881",
      draftBody: `STATUTORY DEMAND NOTICE UNDER SECTION 138 NEGOTIABLE INSTRUMENTS ACT, 1881

To:
[Drawer / Accused Name]
[Address]

Sir/Madam,

Under instructions from my client, [Citizen Name], I hereby serve you with this Statutory Notice:

1. That in discharge of your legally enforceable debt/liability of INR [Amount], you issued Cheque No. [Cheque No.] dated [Date] drawn on [Bank Name].
2. That my client presented the said cheque for encashment, but it was returned unpaid with remark "Funds Insufficient" vide Bank Return Memo dated [Memo Date].
3. That you have intentionally failed to maintain sufficient balance to honour the commitment.

You are hereby called upon to pay the cheque amount of INR [Amount] within 15 (fifteen) days from the receipt of this notice. If you fail to do so, my client will initiate criminal proceedings against you under Section 138 of the NI Act 1881, holding you liable for imprisonment up to 2 years and fine up to twice the cheque amount.

[Citizen / Advocate Signature]
Date: [Current Date]`,
      summary: {
        title: "Section 138 Cheque Dishonour Case Brief",
        overview: "Criminal and financial recovery matter under NI Act 1881; requires strict adherence to 30-day notice and 1-month filing deadlines.",
        keyPoints: [
          "30-day notice from bank memo date is mandatory",
          "Court can award 20% interim compensation under Sec 143A",
          "Criminal trial carries penalty up to 2x cheque value"
        ],
        riskLevel: "High",
        timelineUrgency: "30 days from Bank Return Memo date (Strict Limitation)",
        next48Hours: [
          "Preserve original cheque and bank memo safely",
          "Issue Section 138 Statutory Notice via Registered Speed Post",
          "Consult an NI Act advocate for drafting Magistrate complaint"
        ],
        advocateBrief: "Client holds dishonoured cheque for legally enforceable debt; bank memo received; issuing 15-day statutory notice and preparing Sec 138 petition.",
        estimatedRemedy: "Full cheque recovery + 20% interim compensation + penalty damages"
      },
      suggestions: [
        "What is the exact 30-day timeline for sending a 138 notice?",
        "Can I claim 20% interim compensation during the trial?",
        "What if the recipient deliberately refuses to accept the postal notice?",
        "Connect me with a Cheque Bounce Advocate"
      ]
    };
  }

  // 5. Criminal / Police / FIR / Zero FIR
  if (q.includes('fir') || q.includes('police') || q.includes('arrest') || q.includes('bail') || q.includes('complaint') || q.includes('थाना') || q.includes('पुलिस') || q.includes('एफआईआर')) {
    return {
      text: language === 'en'
        ? "Under Indian Criminal Jurisprudence and the Bharatiya Nagarik Suraksha Sanhita (BNSS, 2023) Section 173 (and landmark Supreme Court ruling in Lalita Kumari), registration of an FIR is mandatory for any cognizable offence. If a local police station refuses jurisdiction, you have the statutory right to demand a 'Zero FIR', which must be registered and transferred to the jurisdictional station. If police refuse to register, you can submit a written complaint to the Superintendent of Police (SP) or file a Section 175(3) BNSS application before the Magistrate."
        : "भारतीय नागरिक सुरक्षा संहिता (BNSS 2023) की धारा 173 और सुप्रीम कोर्ट के ललिता कुमारी फैसले के तहत संज्ञेय अपराध की स्थिति में एफआईआर (FIR) दर्ज करना पुलिस के लिए अनिवार्य है। यदि थाना क्षेत्र का बहाना बनाकर मना करे तो आप 'ज़ीरो एफआईआर' दर्ज करवा सकते हैं। पुलिस के मना करने पर पुलिस अधीक्षक (SP) को डाक से शिकायत या मजिस्ट्रेट के समक्ष धारा 175(3) BNSS के तहत आवेदन दिया जा सकता है।",
      understanding: language === 'en'
        ? "Police grievance / refusal to register FIR for cognizable offence; remedies include Zero FIR, SP representation, and Magistrate petition."
        : "संज्ञेय अपराध में पुलिस द्वारा प्राथमिकी (FIR) दर्ज करने में आनाकानी; ज़ीरो एफआईआर व मजिस्ट्रेट न्यायालय में आवेदन का अधिकार।",
      rights: [
        "Section 173 BNSS 2023 - Mandatory FIR registration for cognizable offences",
        "Mandatory Zero FIR directive (Supreme Court Lalita Kumari judgment)",
        "Section 175(3) BNSS 2023 - Power of Magistrate to order police investigation",
        "Section 35 BNSS 2023 - Arrest procedural guidelines and right to legal counsel"
      ],
      legalArea: "Criminal Law",
      isActionable: "High - Escalate to SP or Magistrate if local precinct refuses FIR",
      authority: "Superintendent of Police / Judicial Magistrate Court / DLSA",
      documents: [
        "Written signed complaint detailing date, time, location, and accused names",
        "Medical Examination Report (MLC) if physical harm occurred",
        "Audio/video recordings, CCTV clips, or photos as electronic evidence (Sec 63 BSA)",
        "Postal receipt/acknowledgement of complaint sent to SP/DCP"
      ],
      nextSteps: [
        "Demand registration of a Zero FIR at the nearest police station",
        "If refused, send a signed written complaint to the District SP/DCP by Registered Post",
        "File an application under Section 175(3) BNSS before the Judicial Magistrate",
        "Consult a Criminal Defense & Police Procedure Advocate on Nyaay सारथी"
      ],
      legalAid: "Free legal representation is guaranteed under NALSA for any arrested or indigent person.",
      recommendedCategory: "Criminal Law",
      suggestedAdvocateSpecialty: "Criminal Defense & Trial Advocate",
      draftTitle: "FORMAL POLICE COMPLAINT / REPRESENTATION TO SUPERINTENDENT OF POLICE",
      draftBody: `TO:
THE SUPERINTENDENT OF POLICE / DEPUTY COMMISSIONER OF POLICE,
[District / City Name]

SUBJECT: COMPLAINT UNDER SECTION 173(4) BNSS 2023 REGARDING COGNIZABLE OFFENCE AND NON-REGISTRATION OF FIR BY POLICE STATION [PS Name].

Respected Sir/Madam,

I, [Citizen Name], S/o / D/o [Parent Name], residing at [Address], Mobile: [Phone], bring the following facts to your urgent notice:

1. That on [Date] at [Time], at [Location], the following incident occurred: [Brief description of incident and names/descriptions of culprits].
2. That the said acts constitute serious cognizable offences under the Bharatiya Nyaya Sanhita (BNS), 2023.
3. That I approached Police Station [PS Name] on [Date] to lodge an FIR, but the Duty Officer refused to register the complaint, in direct contravention of Section 173 BNSS and the Hon'ble Supreme Court directions.

I therefore request you to direct the registration of an FIR, initiate an impartial investigation, and take appropriate legal action against the offenders.

Yours faithfully,
[Citizen Name]
Date: [Current Date]`,
      summary: {
        title: "Police Complaint & Zero FIR Action Plan",
        overview: "Statutory rights against non-registration of FIR and procedural escalation to higher police authorities and Magistrate.",
        keyPoints: [
          "FIR registration is mandatory for cognizable offences under Sec 173 BNSS",
          "Zero FIR can be registered at any police station across India",
          "Magistrate can direct investigation under Sec 175(3) BNSS"
        ],
        riskLevel: "High",
        timelineUrgency: "Immediate action required for evidentiary preservation",
        next48Hours: [
          "Submit written representation to SP/DCP with speed post receipt",
          "Preserve all CCTV footage and electronic evidence",
          "Draft Sec 175(3) BNSS petition with a criminal lawyer"
        ],
        advocateBrief: "Police precinct refused FIR for cognizable offence; seeking advocate representation for SP representation and Section 175(3) BNSS Magistrate petition.",
        estimatedRemedy: "Registration of FIR, protection order, and court-monitored investigation"
      },
      suggestions: [
        "What is a Zero FIR and can any police station register it?",
        "What can I do if the local police officer refuses to take my complaint?",
        "How do I file a petition before the Judicial Magistrate under BNSS?",
        "Connect me with a Criminal Law Advocate"
      ]
    };
  }

  // Default universal intelligent legal response
  return {
    text: language === 'en'
      ? `Regarding your inquiry: "${query}". Under Indian Law and constitutional principles, every citizen is entitled to legal remedies, statutory protection, and natural justice. To safeguard your position, all documentary evidence (transaction logs, agreements, notices, messages) must be systematically cataloged. A pre-litigation statutory notice should be issued to establish cause of action before approaching the competent authority.`
      : `आपके प्रश्न: "${query}" के संबंध में: भारतीय कानून और संविधान के अंतर्गत प्रत्येक नागरिक को अपने अधिकारों की रक्षा, न्याय व उचित कानूनी समाधान का पूरा अधिकार है। सबसे पहले सभी संबंधित दस्तावेज, लिखित प्रमाण व संचार सुरक्षित करें और विरोधी पक्ष को कानूनी नोटिस भेजें।`,
    understanding: language === 'en' ? `Legal inquiry regarding: ${query}` : `कानूनी परामर्श: ${query}`,
    rights: [
      "Right to Fair Legal Remedy and Natural Justice (Constitution of India)",
      "Statutory pre-litigation notice rights under applicable Indian Acts",
      "Right to free legal aid under Section 12 Legal Services Authorities Act, 1987"
    ],
    legalArea: "Civil & Statutory Law",
    isActionable: "Moderate to High - Immediate formal communication advised",
    authority: "Appropriate District Commission / Civil Court / DLSA",
    documents: [
      "Identity Proof (Aadhaar / Voter ID / PAN)",
      "Written agreements, bills, invoices or transaction slips",
      "Email, WhatsApp, or postal communications record",
      "Formal representation / Notice acknowledgement"
    ],
    nextSteps: [
      "Preserve all physical and digital evidence securely",
      "Issue a formal written notice setting a clear 15-day deadline",
      "File a formal petition before the competent authority if unresolved",
      "Schedule a consultation with a verified Bar Council advocate on Nyaay सारथी"
    ],
    legalAid: "Free legal aid is available through NALSA (Toll-Free 15100) and District Legal Services Authorities for eligible citizens.",
    recommendedCategory: "Civil Law",
    suggestedAdvocateSpecialty: "Civil & Dispute Resolution Advocate",
    draftTitle: "FORMAL LEGAL NOTICE / REPRESENTATION",
    draftBody: `LEGAL NOTICE / FORMAL REPRESENTATION

To:
[Opposite Party Name / Organization]
[Address / Registered Office]

Subject: Formal Notice for Redressal of Grievance regarding [Brief Subject].

Sir/Madam,

Under instructions from my client, [Citizen Name], I hereby bring to your notice the following facts:

1. That my client entered into a transaction / relationship with you regarding [Subject Matter] on [Date].
2. That despite fulfilling all obligations on my client's part, you have failed to perform your statutory and contractual duties, causing financial loss and hardship to my client.
3. That your acts constitute a clear breach of statutory obligations under applicable Indian laws.

You are hereby called upon to rectify the said grievance and pay [Specific Relief / Amount] within 15 (fifteen) days of receipt of this notice, failing which legal proceedings shall be initiated against you at your sole cost and risk.

Dated: [Today's Date]
Place: [City]

[Citizen / Authorized Advocate]`,
    summary: {
      title: "Legal Grievance & Action Brief",
      overview: "Structured case brief summarizing your legal situation, merits, and statutory timeline under Indian law.",
      keyPoints: [
        "Clear documentation establishes prima facie merit",
        "Pre-litigation legal notice establishes formal cause of action",
        "Multiple remedies available through regulatory and judicial forums"
      ],
      riskLevel: "Medium",
      timelineUrgency: "Statutory notice within 15-30 days recommended",
      next48Hours: [
        "Gather all supporting documents and proof of payment",
        "Dispatch formal legal notice with delivery confirmation",
        "Engage verified legal counsel on Nyaay सारथी for petition filing"
      ],
      advocateBrief: "Citizen has actionable claim with documentary proof; seeking advocate representation for notice issuance and filing before appropriate forum.",
      estimatedRemedy: "Full restitution of damages, statutory interest, and litigation expenses"
    },
    suggestions: [
      "What are the court fees for filing this petition?",
      "How do I apply for free legal aid under NALSA?",
      "Can this matter be resolved through mediation / Lok Adalat?",
      "Connect me with a verified advocate"
    ]
  };
}

