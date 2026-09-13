import { Advocate, LegalRight, Application, Appointment, SavedResource, ChatMessage, AuthUser, Language, AdvocateFeedback } from '../types';

export const DEFAULT_CITIZEN_AVATAR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%230284C7"><circle cx="50" cy="50" r="50" fill="%23E0F2FE"/><circle cx="50" cy="38" r="18" fill="%230284C7"/><path d="M18 85 C22 64 36 58 50 58 C64 58 78 64 82 85 Z" fill="%230284C7"/></svg>`;

export const INITIAL_ADVOCATES: Advocate[] = [
  {
    id: "adv-1",
    name: "Adv. Priya Sharma",
    email: "priya.sharma.adv@delhibar.in",
    phone: "+91 98101 23456",
    isVerified: true,
    practiceAreas: ["Consumer Law", "Civil Law", "Cyber Law"],
    courtLevels: ["High Court", "District Court", "Consumer Forum"],
    experience: "9+ Years Experience",
    experienceYears: 9,
    location: "New Delhi, Delhi NCR",
    city: "New Delhi",
    state: "Delhi",
    languages: ["Hindi", "English", "Punjabi"],
    consultationFee: 750,
    rating: 4.9,
    reviewCount: 142,
    availability: "Available Today",
    about: "Senior Associate with extensive experience in the Delhi High Court and National Consumer Commission (NCDRC). Specializes in defective product liability, cyber financial fraud disputes, and tenancy agreements.",
    education: "LL.B. (Campus Law Centre, University of Delhi), LL.M. (Cyber Law)",
    barEnrollment: "D/1420/2015 (Bar Council of Delhi)",
    courts: "Delhi High Court, Patiala House Courts, Saket District Court, NCDRC",
    pastCasesSummary: "Resolved over 210+ consumer compensation claims and recovered ₹1.8 Cr for defrauded retail clients.",
    reviews: []
  },
  {
    id: "adv-2",
    name: "Adv. Rajesh Iyer",
    email: "rajesh.iyer.law@gmail.com",
    phone: "+91 98400 11223",
    isVerified: true,
    practiceAreas: ["Family Law", "Property Law", "Civil Law"],
    courtLevels: ["High Court", "District Court", "Family Court"],
    experience: "15+ Years Experience",
    experienceYears: 15,
    location: "Mumbai, Maharashtra",
    city: "Mumbai",
    state: "Maharashtra",
    languages: ["English", "Marathi", "Hindi"],
    consultationFee: 1200,
    rating: 4.8,
    reviewCount: 89,
    availability: "Next Available: Tomorrow",
    about: "Expert in family disputes, divorce settlements, child custody, and ancestral property partition. Focuses on out-of-court settlements and mediation.",
    education: "LL.B. (Government Law College, Mumbai)",
    barEnrollment: "MAH/789/2008 (Bar Council of Maharashtra & Goa)",
    courts: "Bombay High Court, Bandra Family Court",
    pastCasesSummary: "Successfully mediated 300+ family disputes and property partitions.",
    reviews: []
  },
  {
    id: "adv-3",
    name: "Adv. Arvind Swaminathan",
    email: "arvind.swami.legal@yahoo.com",
    phone: "+91 94440 11223",
    isVerified: true,
    practiceAreas: ["Cyber Law", "Labour & Wages", "Corporate Law"],
    courtLevels: ["Supreme Court", "High Court", "Tribunals"],
    experience: "12+ Years Experience",
    experienceYears: 12,
    location: "Chennai, Tamil Nadu",
    city: "Chennai",
    state: "Tamil Nadu",
    languages: ["English", "Tamil"],
    consultationFee: 1500,
    rating: 4.7,
    reviewCount: 215,
    availability: "Available Today",
    about: "Leading cyber security and labour law advocate. Specializes in employment termination disputes, PF/gratuity claims, and corporate digital fraud.",
    education: "LL.B., PGD in Cyber Law (NALSAR)",
    barEnrollment: "MS/1122/2011 (Bar Council of Tamil Nadu)",
    courts: "Madras High Court, Labour Courts Chennai",
    pastCasesSummary: "Represented major IT unions and secured unpaid dues for over 500 tech workers.",
    reviews: []
  }
];

export const MOCK_ADVOCATES = INITIAL_ADVOCATES;

export const INITIAL_LEGAL_RIGHTS: LegalRight[] = [
  {
    id: "r-1",
    category: "Police & Criminal Justice",
    name: "Zero FIR & Mandatory Registration",
    nameHi: "ज़ीरो एफआईआर और अनिवार्य पंजीकरण अधिकार",
    shortDescription: "A Zero FIR can be lodged in any police station in India, irrespective of jurisdiction or place of crime occurrence.",
    shortDescriptionHi: "घटना चाहे कहीं भी हुई हो, किसी भी नजदीकी पुलिस स्टेशन में ज़ीरो एफआईआर दर्ज कराई जा सकती है।",
    whoItAppliesTo: "Every Indian citizen reporting a cognizable crime (theft, assault, cyber fraud, sexual offences).",
    whoItAppliesToHi: "हर नागरिक जो संज्ञेय अपराध की शिकायत दर्ज कराना चाहता है।",
    legalSource: "Section 173(1) Bharatiya Nagarik Suraksha Sanhita (BNSS 2023) / Lalita Kumari vs. Govt of UP (2014) SC",
    exampleSituation: "You were robbed during a train journey between Lucknow and Delhi. The New Delhi railway police station cannot refuse your complaint claiming it occurred in UP.",
    exampleSituationHi: "यात्रा के दौरान सामान चोरी होने पर दिल्ली का थाना यह कहकर मना नहीं कर सकता कि घटना उत्तर प्रदेश में हुई थी।",
    possibleAction: "Demand immediate Zero FIR number. If refused, escalate in writing to ACP/DCP or file online on state police portal.",
    possibleActionHi: "तुरंत ज़ीरो FIR नंबर मांगें। मना करने पर उच्चाधिकारी (DCP/SP) को लिखित शिकायत दें।",
    relevantAuthority: "Nearest Police Station / SP or Commissioner of Police / State Online Citizen Portal",
    requiredDocuments: ["ID Proof (Aadhaar / Voter ID)", "Written complaint describing date, time, and incident sequence", "List of lost items/evidence"],
    advocateCategoryHint: "Criminal Law"
  },
  {
    id: "r-2",
    category: "Consumer",
    name: "Defective Product & Unfair Trade Remedy (E-Daakhil)",
    nameHi: "दोषपूर्ण उत्पाद और ई-दाखिल उपभोक्ता अधिकार",
    shortDescription: "Consumers are entitled to full refund, replacement, or compensation for defective products or deficient services.",
    shortDescriptionHi: "दोषपूर्ण सामान या सेवा में कमी होने पर उपभोक्ता पूर्ण धनवापसी व मुआवजे का हकदार है।",
    whoItAppliesTo: "Anyone who purchased goods/services for personal consideration (offline or online e-commerce).",
    whoItAppliesToHi: "कोई भी व्यक्ति जिसने व्यक्तिगत उपयोग हेतु सामान या सेवा खरीदी हो।",
    legalSource: "Consumer Protection Act 2019 (Sections 2(9), 35 & 84 - Product Liability)",
    exampleSituation: "An online platform delivered a damaged refrigerator and customer care refused replacement citing return window expired.",
    exampleSituationHi: "ऑनलाइन मंगवाया गया फ्रिज खराब निकला और कंपनी ने रिटर्न विंडो खत्म होने का बहाना बनाकर बदलने से मना कर दिया।",
    possibleAction: "Send a 15-day formal Legal Notice to the seller & manufacturer. If unresolved, file an e-complaint on edaakhil.nic.in with zero physical paperwork.",
    possibleActionHi: "कंपनी को 15 दिन का कानूनी नोटिस भेजें। समाधान न होने पर ई-दाखिल पोर्टल पर ऑनलाइन वाद दायर करें।",
    relevantAuthority: "District Consumer Disputes Redressal Commission / National Consumer Helpline (1915)",
    requiredDocuments: ["Purchase Invoice / Bill", "Delivery proof & warranty card", "Photos/Videos of defect", "Customer care emails/chat transcripts"],
    advocateCategoryHint: "Consumer Law"
  },
  {
    id: "r-3",
    category: "Cyber",
    name: "Financial Cyber Fraud & Golden Hour 1930 Freeze",
    nameHi: "साइबर वित्तीय धोखाधड़ी और 1930 गोल्डन ऑवर फ्रीज",
    shortDescription: "Reporting online bank/UPI scams within 1-2 hours triggers automated bank lien freezes to safeguard your money.",
    shortDescriptionHi: "ऑनलाइन धोखाधड़ी के 1-2 घंटे के भीतर सूचना देने पर ठगी की राशि बैंक में फ्रीज कराई जा सकती है।",
    whoItAppliesTo: "Victims of unauthorized UPI, credit card, net banking, OTP, or APK phishing scams.",
    whoItAppliesToHi: "UPI, नेट बैंकिंग, लॉटरी या फर्जी ऐप फ्रॉड के शिकार सभी नागरिक।",
    legalSource: "Information Technology Act 2000 (Section 66D) & MHA Indian Cybercrime Coordination Centre (I4C)",
    exampleSituation: "You received a fake electricity bill SMS, clicked an APK link, and ₹45,000 was debited from your bank account without your authorization.",
    exampleSituationHi: "बिजली बिल के नाम पर आए फर्जी लिंक से खाते से ₹45,000 कट गए।",
    possibleAction: "Immediately dial 1930 to trigger the Citizen Financial Cyber Fraud Reporting System. File an acknowledgement report on cybercrime.gov.in and submit to your bank.",
    possibleActionHi: "तुरंत 1930 पर कॉल करें और cybercrime.gov.in पर पावती दर्ज कर बैंक में सबमिट करें।",
    relevantAuthority: "National Cyber Crime Helpline (1930) / Citizen Portal cybercrime.gov.in / Cyber Police Station",
    requiredDocuments: ["Bank account statement highlighting debits", "Transaction UTR / Ref numbers", "Screenshots of SMS / WhatsApp chats / APK files"],
    advocateCategoryHint: "Cyber Law"
  },
  {
    id: "r-4",
    category: "Tenant & Property",
    name: "Tenant Security Deposit Refund & Protection from Unlawful Eviction",
    nameHi: "किरायेदार सुरक्षा जमा (Security Deposit) व बेदखली से संरक्षण",
    shortDescription: "Landlords cannot arbitrarily withhold security deposits or evict tenants without statutory notice and legitimate grounds.",
    shortDescriptionHi: "मकान मालिक बिना वैध कारण और कानूनी नोटिस के सिक्योरिटी डिपॉजिट नहीं रोक सकता और न ही जबरन निकाल सकता है।",
    whoItAppliesTo: "Tenants in residential and commercial leased properties across India.",
    whoItAppliesToHi: "किराए के मकान, फ्लैट या दुकान में रहने वाले सभी नागरिक।",
    legalSource: "Model Tenancy Act 2021 / State Rent Control Acts / Transfer of Property Act 1882 (Sec 106)",
    exampleSituation: "Your tenancy ended, you vacated and cleaned the flat, but the landlord refuses to return your ₹60,000 deposit citing normal wall paint wear.",
    exampleSituationHi: "फ्लैट खाली करने के बाद मकान मालिक ने सामान्य टूट-फूट के नाम पर ₹60,000 का डिपॉजिट वापस करने से मना कर दिया।",
    possibleAction: "Send a statutory Demand Notice under Section 106. File an application before the Rent Authority or Civil Court for recovery with 18% interest.",
    possibleActionHi: "वकील के माध्यम से कानूनी डिमांड नोटिस भेजें तथा रेंट अथॉरिटी में ब्याज सहित वसूली का आवेदन करें।",
    relevantAuthority: "Rent Authority / Rent Court / District Civil Court",
    requiredDocuments: ["Registered / Notarized Rent Agreement", "Security deposit bank transfer receipts", "Photos/videos of property handover", "NOC / Key handover acknowledgement"],
    advocateCategoryHint: "Property & Tenancy"
  },
  {
    id: "r-5",
    category: "Constitutional",
    name: "Free Legal Aid & Court Fee Exemption (Sec 12 LSA Act)",
    nameHi: "मुफ्त कानूनी सहायता व वकील का अधिकार (धारा 12 विधिक सेवा प्राधिकरण)",
    shortDescription: "Free advocate representation, document preparation, and court fee waivers are guaranteed by law for eligible citizens.",
    shortDescriptionHi: "पात्र नागरिकों के लिए मुफ्त वकील, दस्तावेजीकरण और कोर्ट फीस माफी का कानूनी अधिकार।",
    whoItAppliesTo: "Women, children, SC/ST members, persons with disability, victims of trafficking, undertrial prisoners, and individuals earning under statutory state income ceilings (usually ₹3 Lakh/yr).",
    whoItAppliesToHi: "महिलाएं, बच्चे, अनुसूचित जाति/जनजाति, दिव्यांग, जेल में बंद विचाराधीन कैदी और सीमित आय वर्ग के नागरिक।",
    legalSource: "Article 39A Constitution of India & Section 12 Legal Services Authorities Act 1987",
    exampleSituation: "A domestic worker earning ₹1.2 Lakh annually needs representation in an unfair eviction and property boundary dispute but cannot afford private counsel.",
    exampleSituationHi: "कम आय वर्ग की महिला जिसे पारिवारिक या संपत्ति मामले में वकील की आवश्यकता है लेकिन वह निजी फीस नहीं दे सकती।",
    possibleAction: "Apply online at nalsa.gov.in or visit the District Legal Services Authority (DLSA) at the local district court complex for immediate assigned advocate.",
    possibleActionHi: "nalsa.gov.in पर ऑनलाइन या जिला न्यायालय में DLSA कार्यालय जाकर निःशुल्क अधिवक्ता आवंटित करवाएं।",
    relevantAuthority: "NALSA (National Legal Services Authority Helpline 15100) / State & District DLSA",
    requiredDocuments: ["Income certificate or self-declaration affidavit", "ID & address proof", "Case documents / summons if already received"],
    advocateCategoryHint: "Constitutional Law"
  },
  {
    id: "r-6",
    category: "Employment",
    name: "Recovery of Unpaid Wages, Severance & Gratuity",
    nameHi: "बकाया वेतन, ग्रेच्युटी व अनुचित बर्खास्तगी के विरुद्ध अधिकार",
    shortDescription: "Employers are legally bound to disburse earned salary, accrued leaves, notice period pay, and gratuity upon departure.",
    shortDescriptionHi: "कंपनी या नियोक्ता द्वारा बकाया वेतन, नोटिस अवधि का भुगतान व ग्रेच्युटी रोकना गैरकानूनी है।",
    whoItAppliesTo: "Full-time, contract, and probationary employees in commercial establishments, startups, and factories.",
    whoItAppliesToHi: "निजी कंपनियों, दुकानों, कारखानों व स्टार्टअप्स में कार्यरत सभी कर्मचारी।",
    legalSource: "Payment of Wages Act 1936, Industrial Disputes Act 1947, Payment of Gratuity Act 1972, Code on Wages",
    exampleSituation: "An employee resigned after serving full 30-day notice, but the employer withheld 2 months salary and Full & Final (F&F) settlement for 90+ days.",
    exampleSituationHi: "कर्मचारी ने नोटिस सर्व कर इस्तीफा दिया लेकिन कंपनी ने 3 महीने तक अंतिम हिसाब (F&F) और वेतन रोक लिया।",
    possibleAction: "Issue a 15-day Legal Notice for unpaid dues with 18% penal interest. If unpaid, file a complaint before the Labour Commissioner / Labour Court.",
    possibleActionHi: "ब्याज सहित वेतन भुगतान का कानूनी नोटिस भेजें व श्रम आयुक्त (Labour Commissioner) के समक्ष वाद दायर करें।",
    relevantAuthority: "Office of the Labour Commissioner / Labour Court / National Company Law Tribunal (for insolvency defaults)",
    requiredDocuments: ["Employment Offer Letter / Contract", "Salary slips & bank statements", "Resignation & acceptance email threads", "Relieving request copies"],
    advocateCategoryHint: "Labour & Employment"
  },
  {
    id: "r-7",
    category: "Women",
    name: "Right to Residence & Protection from Domestic Violence",
    nameHi: "घरेलू हिंसा से सुरक्षा और साझा घर में रहने का अधिकार",
    shortDescription: "Women have an absolute right to reside in the shared household and seek interim financial maintenance and protection orders.",
    shortDescriptionHi: "महिलाओं को साझा घर में रहने, भरण-पोषण और सुरक्षा आदेश प्राप्त करने का कानूनी अधिकार प्राप्त है।",
    whoItAppliesTo: "Wives, mothers, sisters, or women living in a domestic relationship.",
    whoItAppliesToHi: "घरेलू संबंध में रहने वाली सभी महिलाएं (पत्नी, मां, बहन, बहू)।",
    legalSource: "Protection of Women from Domestic Violence Act 2005 (Sections 12, 17, 18, 19, 20)",
    exampleSituation: "A woman facing verbal and physical abuse is threatened with forceful expulsion from her marital home without maintenance.",
    exampleSituationHi: "ससुराल में उत्पीड़न का सामना कर रही महिला को घर से बाहर निकालने की धमकी दी जा रही है।",
    possibleAction: "Call Emergency Helpline 1091 or 112. File an application under Section 12 of DV Act before Judicial Magistrate for immediate protection order and monthly maintenance.",
    possibleActionHi: "महिला हेल्पलाइन 1091 पर संपर्क करें और मजिस्ट्रेट के समक्ष धारा 12 DV Act का आवेदन देकर तुरंत संरक्षण व खर्च पाएं।",
    relevantAuthority: "Protection Officer / Mahila Police Station / Judicial Magistrate First Class / Women Helpline (1091 / 181)",
    requiredDocuments: ["Marriage proof / Photos", "Medical records in case of physical injury", "Details of shared household & husband's income sources"],
    advocateCategoryHint: "Family & Matrimonial"
  },
  {
    id: "r-8",
    category: "Senior Citizen",
    name: "Right to Monthly Maintenance & Revocation of Gifted Property",
    nameHi: "वरिष्ठ नागरिक भरण-पोषण व उपहार में दी गई संपत्ति वापसी का अधिकार",
    shortDescription: "Senior citizens can claim statutory monthly maintenance from children/heirs and void property transfers if neglected.",
    shortDescriptionHi: "वरिष्ठ नागरिक अपनी संतानों से भरण-पोषण मांग सकते हैं और उपेक्षा होने पर नाम की गई संपत्ति वापस ले सकते हैं।",
    whoItAppliesTo: "Indian citizens aged 60 years and above.",
    whoItAppliesToHi: "60 वर्ष या उससे अधिक आयु के सभी भारतीय नागरिक।",
    legalSource: "Maintenance and Welfare of Parents and Senior Citizens Act 2007 (Sections 4, 5, 23)",
    exampleSituation: "An elderly father gifted his house to his son on the condition of care, but the son later neglected food and medical expenses.",
    exampleSituationHi: "बुजुर्ग पिता ने देखभाल की शर्त पर मकान बेटे के नाम किया, लेकिन बाद में बेटे ने दवा और भोजन का खर्च देने से मना कर दिया।",
    possibleAction: "Apply before the Sub-Divisional Magistrate (SDM) Maintenance Tribunal under Section 23 to declare the property transfer void and mandate monthly maintenance.",
    possibleActionHi: "एसडीएम (SDM) वरिष्ठ नागरिक ट्रिब्यूनल में धारा 23 का आवेदन देकर रजिस्ट्री शून्य घोषित करवाएं और मासिक खर्च पाएं।",
    relevantAuthority: "Maintenance Tribunal presided by Sub-Divisional Magistrate (SDM) / Elderline Helpline (14567)",
    requiredDocuments: ["Age proof (Aadhaar / Senior Citizen Card)", "Property Gift Deed / Title documents", "Medical expense receipts & bank account details"],
    advocateCategoryHint: "Family & Matrimonial"
  }
];

export const INITIAL_APPLICATIONS: Application[] = [];

export const INITIAL_APPOINTMENTS: Appointment[] = [];

// LocalStorage helpers
const USER_KEY = 'nyay_saathi_user';
const APPOINTMENTS_KEY = 'nyay_saathi_appointments';
const APPLICATIONS_KEY = 'nyay_saathi_applications';
const SAVED_KEY = 'nyay_saathi_saved_resources';
const CHAT_KEY = 'nyay_saathi_chat_history';
const FEEDBACK_KEY = 'nyay_saathi_feedback';

export const INITIAL_FEEDBACKS: AdvocateFeedback[] = [];

export function getStoredFeedback(): AdvocateFeedback[] {
  if (typeof window === 'undefined') return INITIAL_FEEDBACKS;
  try {
    const data = localStorage.getItem(FEEDBACK_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse feedback', e);
  }
  return INITIAL_FEEDBACKS;
}

export function saveFeedback(feedback: AdvocateFeedback): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getStoredFeedback();
    const updated = [feedback, ...list.filter(f => f.id !== feedback.id)];
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save feedback', e);
  }
}

export function getStoredUser(fallback?: AuthUser | null): AuthUser {
  if (typeof window === 'undefined') {
    return fallback || {
      id: 'demo_citizen',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@gmail.com',
      phone: '+91 9876543210',
      dob: '1992-05-14',
      state: 'Delhi',
      city: 'New Delhi',
      address: 'B-42, Pocket 1, Mayur Vihar Phase 1, New Delhi - 110091',
      role: 'citizen',
    };
  }
  try {
    const data = localStorage.getItem(USER_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load stored user', e);
  }
  return fallback || {
    id: 'demo_citizen',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@gmail.com',
    phone: '+91 9876543210',
    dob: '1992-05-14',
    state: 'Delhi',
    city: 'New Delhi',
    address: 'B-42, Pocket 1, Mayur Vihar Phase 1, New Delhi - 110091',
    role: 'citizen',
  };
}

export function saveStoredUser(user: AuthUser): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save user', e);
  }
}

export interface ResponseCountdown {
  totalMs: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  formatted: string;
}

export function calculateResponseCountdown(createdAt: string, windowHours = 24): ResponseCountdown {
  const createdTime = new Date(createdAt).getTime();
  const expiryTime = createdTime + windowHours * 60 * 60 * 1000;
  const now = Date.now();
  const totalMs = expiryTime - now;

  if (isNaN(createdTime) || totalMs <= 0) {
    return {
      totalMs: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
      formatted: '00h 00m 00s remaining',
    };
  }

  const totalSeconds = Math.floor(totalMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');
  const formatted = `${hours}h ${pad(minutes)}m ${pad(seconds)}s remaining`;

  return {
    totalMs,
    hours,
    minutes,
    seconds,
    isExpired: false,
    formatted,
  };
}

export function getStoredAppointments(): Appointment[] {
  if (typeof window === 'undefined') return INITIAL_APPOINTMENTS;
  try {
    const data = localStorage.getItem(APPOINTMENTS_KEY);
    let list: Appointment[] = data ? JSON.parse(data) : INITIAL_APPOINTMENTS;

    // Check and automatically transition any expired pending appointments
    let modified = false;
    list = list.map((item) => {
      if (item.status === 'pending') {
        const countdown = calculateResponseCountdown(item.createdAt, 24);
        if (countdown.isExpired) {
          modified = true;
          return {
            ...item,
            status: 'expired',
            expiredAt: item.expiredAt || new Date().toISOString(),
          };
        }
      }
      return item;
    });

    if (modified) {
      localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(list));
    }

    return list;
  } catch (e) {
    console.error('Failed to parse appointments', e);
  }
  return INITIAL_APPOINTMENTS;
}

export function saveAppointment(appointment: Appointment): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getStoredAppointments();
    const updated = [appointment, ...list.filter(a => a.id !== appointment.id)];
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save appointment', e);
  }
}

export function updateAppointmentStatus(
  id: string, 
  status: 'pending' | 'upcoming' | 'confirmed' | 'completed' | 'cancelled' | 'expired' | 'no-response'
): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getStoredAppointments();
    const updated = list.map(item => {
      if (item.id === id) {
        return { 
          ...item, 
          status,
          ...(status === 'upcoming' || status === 'confirmed' ? { acceptedAt: new Date().toISOString() } : {}),
          ...(status === 'expired' || status === 'no-response' ? { expiredAt: new Date().toISOString() } : {})
        };
      }
      return item;
    });
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update appointment status', e);
  }
}

export function acceptAppointment(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getStoredAppointments();
    const updated = list.map(item => {
      if (item.id === id) {
        const meetingLink = item.meetingLink || (item.consultationType === 'Video' 
          ? `https://meet.google.com/nyaay-sarathi-session-${item.id.toLowerCase().slice(-6)}` 
          : undefined);
        return {
          ...item,
          status: 'upcoming' as const,
          acceptedAt: new Date().toISOString(),
          meetingLink,
        };
      }
      return item;
    });
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));

    // Also update any matching application status to Accepted
    const appList = getStoredApplications();
    const matchingApp = appList.find(a => a.appointmentId === id);
    if (matchingApp) {
      const updatedApps = appList.map(a => a.id === matchingApp.id ? { ...a, acceptanceStatus: 'Accepted' as const, status: 'Under Review' as const } : a);
      localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(updatedApps));
    }
  } catch (e) {
    console.error('Failed to accept appointment', e);
  }
}

export function expireAppointment(id: string): void {
  updateAppointmentStatus(id, 'expired');
}

export function getStoredApplications(): Application[] {
  if (typeof window === 'undefined') return INITIAL_APPLICATIONS;
  try {
    const data = localStorage.getItem(APPLICATIONS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse applications', e);
  }
  return INITIAL_APPLICATIONS;
}

export function saveApplication(app: Application): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getStoredApplications();
    const updated = [app, ...list.filter(a => a.id !== app.id)];
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save application', e);
  }
}

export function getStoredSavedResources(): SavedResource[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(SAVED_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse saved resources', e);
  }
  return [];
}

export function toggleSavedResource(userId: string, right: LegalRight): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const current = getStoredSavedResources();
    const exists = current.some(item => item.rightId === right.id);
    let updated: SavedResource[];
    if (exists) {
      updated = current.filter(item => item.rightId !== right.id);
      localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
      return false; // un-saved
    } else {
      const newItem: SavedResource = {
        id: 'sv_' + Date.now().toString(),
        userId,
        rightId: right.id,
        title: right.name,
        category: right.category,
        legalSource: right.legalSource,
        savedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      };
      updated = [newItem, ...current];
      localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
      return true; // saved
    }
  } catch (e) {
    console.error('Failed to toggle saved resource', e);
    return false;
  }
}

export function getStoredChatMessages(): ChatMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(CHAT_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse chat messages', e);
  }
  return [];
}

export function saveChatMessages(messages: ChatMessage[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
  } catch (e) {
    console.error('Failed to save chat messages', e);
  }
}

export function clearChatMessages(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CHAT_KEY);
  } catch (e) {
    console.error('Failed to clear chat messages', e);
  }
}

// AI response generator with high domain precision for Indian law & Section 26 structure
export function analyzeAndGenerateLegalGuidance(query: string, language: Language): ChatMessage {
  const q = query.toLowerCase();

  let category = "General Legal Information";
  let recommendedAdvocateType = "Civil & General Practice Advocate";
  let filterCategoryParam = "Civil Law";
  let understanding = "You have shared a legal situation regarding your rights and appropriate remedies under Indian law.";
  let rights = [
    "Right to fair procedure and natural justice under Article 14 of the Constitution of India.",
    "Right to seek statutory remedy before appropriate tribunals or competent civil forums."
  ];
  let isActionable = "Yes, based on the details provided, formal statutory communication followed by grievance filing or dispute resolution is potentially actionable.";
  let authority = "District Civil Court / Appropriate Sectoral Regulatory Authority";
  let documents = [
    "Identity & address verification (Aadhaar / Voter Card)",
    "Written record of all communications, payments, receipts, or agreements",
    "Dated chronology of events and previous representations"
  ];
  let nextSteps = [
    "Consolidate all supporting documentary evidence into chronological order.",
    "Issue a formal written notice detailing your claim and specifying a 15-day timeline for resolution.",
    "Consult a verified advocate if the counterparty fails to respond or disputes liability."
  ];
  let legalAid = "Eligible citizens (women, children, SC/ST, custody undertrials, or annual income < ₹3 Lakh) can access 100% free legal representation via NALSA (Helpline: 15100).";
  let draftTitle = "General Statutory Demand & Representation Notice";

  if (q.includes("landlord") || q.includes("deposit") || q.includes("rent") || q.includes("evict") || q.includes("tenant") || q.includes("किराया") || q.includes("मकान")) {
    category = "Property & Tenancy Matter";
    recommendedAdvocateType = "Property & Tenancy Law Advocate";
    filterCategoryParam = "Property & Tenancy";
    understanding = "Your inquiry concerns a tenancy dispute regarding wrongful withholding of security deposit or eviction issues.";
    rights = [
      "Right to full security deposit refund under the Model Tenancy Act / Section 106 Transfer of Property Act, minus genuine verifiable damage.",
      "Protection from unlawful eviction without statutory notice period.",
      "Right to basic amenities (water, electricity) which cannot be severed by the landlord arbitrarily."
    ];
    isActionable = "Highly actionable. Arbitrary deduction of security deposit without itemized repair bills constitutes unlawful enrichment.";
    authority = "Rent Authority / Rent Court / District Civil Court";
    documents = [
      "Signed Rent Agreement / Lease Deed",
      "Bank payment receipts / UPI transaction proof of original security deposit",
      "Property handover acknowledgement / photos of flat at vacation",
      "WhatsApp / email communication demanding refund"
    ];
    nextSteps = [
      "Send a 15-day Legal Notice demanding refund with interest.",
      "File a petition before the local Rent Authority or Small Causes Civil Court.",
      "Keep photographic evidence demonstrating the premise was left in good condition."
    ];
    draftTitle = "Statutory Demand Notice for Refund of Tenancy Security Deposit";
  } else if (q.includes("cyber") || q.includes("upi") || q.includes("fraud") || q.includes("scam") || q.includes("phishing") || q.includes("1930") || q.includes("धोखा") || q.includes("खाता")) {
    category = "Cyber Law & Financial Fraud";
    recommendedAdvocateType = "Cyber Crime & Digital Law Advocate";
    filterCategoryParam = "Cyber Law";
    understanding = "You have experienced or suspect an online financial fraud or unauthorized digital transaction.";
    rights = [
      "Right to immediate bank lien freeze under the National Cyber Crime Reporting Portal (1930).",
      "Limited liability for unauthorized electronic banking transactions under RBI Circular (DBR.No.Leg.BC.78/09.07.005/2017-18). Zero liability if reported within 3 working days.",
      "Protection under Section 66D of Information Technology Act, 2000."
    ];
    isActionable = "Urgent and actionable. Reporting within the 'Golden Hour' allows the cyber cell to block the recipient bank account.";
    authority = "National Cyber Crime Reporting Helpline (1930) / cybercrime.gov.in / Bank Nodal Officer";
    documents = [
      "Bank statement reflecting debit transactions",
      "Transaction UTR number / Reference ID / UPI payment screenshots",
      "Screenshots of suspicious SMS, caller numbers, or phishing links"
    ];
    nextSteps = [
      "Dial 1930 immediately to log transaction details on the I4C portal.",
      "File formal complaint on cybercrime.gov.in and submit copy to your home bank branch.",
      "Request your bank in writing to freeze the beneficiary account and reverse charges."
    ];
    draftTitle = "Representation to Bank Nodal Officer for Unauthorized Transaction Reversal";
  } else if (q.includes("consumer") || q.includes("product") || q.includes("refund") || q.includes("defective") || q.includes("seller") || q.includes("warranty") || q.includes("खरीद") || q.includes("सामान")) {
    category = "Consumer Law";
    recommendedAdvocateType = "Consumer Protection Law Advocate";
    filterCategoryParam = "Consumer Law";
    understanding = "You have received a defective product or deficient service and the seller/service provider is refusing a refund or replacement.";
    rights = [
      "Right to product liability compensation under Section 84 of Consumer Protection Act, 2019.",
      "Right to be protected against unfair contract terms and misleading advertisements.",
      "Right to file online consumer complaints directly via E-Daakhil without physical presence."
    ];
    isActionable = "Actionable. The law holds manufacturers and e-commerce sellers strictly liable for goods that fail standard merchantability.";
    authority = "District Consumer Disputes Redressal Commission / National Consumer Helpline (1915)";
    documents = [
      "Original tax invoice / purchase receipt",
      "Warranty card & service inspection report",
      "Photographs / video proof of product defect",
      "Customer care emails and refusal records"
    ];
    nextSteps = [
      "Call National Consumer Helpline (1915) or register on consumerhelpline.gov.in.",
      "Serve a 15-day formal Legal Notice to the vendor & manufacturer.",
      "If unresolved, file an e-complaint on edaakhil.nic.in seeking refund plus compensation."
    ];
    draftTitle = "Legal Notice under Section 35 of Consumer Protection Act 2019";
  } else if (q.includes("police") || q.includes("fir") || q.includes("arrest") || q.includes("bns") || q.includes("police station") || q.includes("थाना") || q.includes("गिरफ्तार")) {
    category = "Criminal Justice & Police Law";
    recommendedAdvocateType = "Criminal Defence & Police Procedure Advocate";
    filterCategoryParam = "Criminal Law";
    understanding = "Your question relates to criminal law procedures, police reporting, or FIR rights under the Bharatiya Nagarik Suraksha Sanhita (BNSS).";
    rights = [
      "Right to register a Zero FIR at any police station across India irrespective of jurisdiction (Sec 173 BNSS).",
      "Right to receive a free copy of the registered FIR immediately (Sec 173(2) BNSS).",
      "Protection from arbitrary arrest without Section 35(3) BNSS notice for offences with punishment under 7 years (Arnesh Kumar guidelines).",
      "Right of an arrested person to consult an advocate of choice and inform family (Sec 40 BNSS)."
    ];
    isActionable = "Yes. If police refuse to register a cognizable complaint, you have the right to send the complaint to the Superintendent of Police (SP/DCP) under Sec 173(3) BNSS.";
    authority = "Area Police Station / Superintendent of Police (SP) / Judicial Magistrate Court";
    documents = [
      "Written complaint with signature, date, and exact chronological details",
      "Identity proof of complainant",
      "Medical examination report (in case of physical injury/assault)",
      "Any electronic audio/video/CCTV evidence"
    ];
    nextSteps = [
      "Submit written complaint in duplicate and obtain stamped receipt.",
      "If station refuses, dispatch complaint via registered post to District SP/DCP.",
      "File an application under Section 175(3) BNSS before Magistrate for court-directed FIR."
    ];
    draftTitle = "Formal Complaint to Superintendent of Police for Registration of FIR";
  } else if (q.includes("salary") || q.includes("job") || q.includes("employer") || q.includes("wages") || q.includes("termination") || q.includes("नौकरी") || q.includes("वेतन")) {
    category = "Labour & Employment Matter";
    recommendedAdvocateType = "Labour & Employment Law Advocate";
    filterCategoryParam = "Labour & Employment";
    understanding = "You are inquiring about unpaid salary, unlawful termination, or employment dues withholding by an employer.";
    rights = [
      "Right to timely payment of wages without unauthorized deductions under Payment of Wages Act & Code on Wages.",
      "Right to statutory notice period or salary in lieu of notice upon termination.",
      "Right to Full & Final settlement including earned leave encashment and gratuity (if 5+ years of service)."
    ];
    isActionable = "Highly actionable. Withholding earned wages constitutes a statutory offence and civil debt.";
    authority = "Labour Commissioner's Office / Industrial & Labour Court / Civil Court";
    documents = [
      "Employment appointment letter and employment contract",
      "Past salary slips and bank salary credit statements",
      "Resignation/Termination correspondence and notice period proof",
      "Attendance records / timesheets / email records confirming work done"
    ];
    nextSteps = [
      "Issue a formal demand letter to HR and Company Directors giving 15 days.",
      "File a wage recovery claim before the Deputy Labour Commissioner.",
      "If company is in corporate default, consider formal insolvency/commercial notice."
    ];
    draftTitle = "Legal Demand Notice for Unpaid Wages and Statutory Dues";
  } else if (q.includes("aid") || q.includes("free lawyer") || q.includes("nalsa") || q.includes("मुफ्त") || q.includes("वकील")) {
    category = "Free Legal Aid & Constitutional Rights";
    recommendedAdvocateType = "Legal Aid & Pro Bono Panel Advocate";
    filterCategoryParam = "Constitutional Law";
    understanding = "You are inquiring about eligibility for free legal aid and court representation in India.";
    rights = [
      "Constitutional guarantee of free legal aid under Article 39A.",
      "Statutory entitlement under Section 12 of the Legal Services Authorities Act 1987 for women, children, SC/ST, custody undertrials, and low-income citizens.",
      "Waiver of court fees, process fees, and free certified copies of documents."
    ];
    isActionable = "Directly accessible. You do not need to pay any private advocate fee.";
    authority = "NALSA (National Legal Services Authority Helpline 15100) / District DLSA located at every District Court";
    documents = [
      "Income proof / BPL Card / Self-declaration income affidavit",
      "Aadhaar card / Community certificate (if applicable)",
      "Copies of court notices or dispute papers"
    ];
    nextSteps = [
      "Visit the Front Office of your District Legal Services Authority (DLSA) at the local court complex.",
      "Submit an application requesting assigned legal counsel.",
      "Or apply online at https://nalsa.gov.in."
    ];
    draftTitle = "Application for Assignment of Free Legal Aid Counsel under Section 12 LSA Act";
  }

  const responseText = language === 'hi'
    ? `### 🏷️ मुख्य विषय: ${category.toUpperCase()} विवाद
**प्रत्यक्ष समाधान:** ${understanding}

---

### ⚖️ प्रमुख कानूनी अधिकार व धाराएं
${rights.map(r => `* 📜 ${r}`).join('\n')}

---

### 📋 3-चरणीय कार्ययोजना
${nextSteps.slice(0, 3).map((s, idx) => `* ${idx + 1}️⃣ **चरण ${idx + 1}:** ${s}`).join('\n')}

---

### 🏛️ फोरम एवं आधिकारिक हेल्पलाइन
* 🌐 **प्राधिकरण / पोर्टल:** ${authority}
* 📞 **विधिक सहायता:** ${legalAid}

---
*ℹ️ यह सामान्य कानूनी मार्गदर्शन है। न्यायालयीन प्रतिनिधित्व हेतु DLSA या पंजीकृत अधिवक्ता से संपर्क करें।*`
    : `### 🏷️ Main Topic: ${category.toUpperCase()} Dispute
**Direct Summary:** ${understanding}

---

### ⚖️ Key Legal Rights & Statutory Provisions
${rights.map(r => `* 📜 ${r}`).join('\n')}

---

### 📋 3-Step Action Checklist
${nextSteps.slice(0, 3).map((s, idx) => `* ${idx + 1}️⃣ **Step ${idx + 1}:** ${s}`).join('\n')}

---

### 🏛️ Forum & Official Helplines
* 🌐 **Competent Forum / Portal:** ${authority}
* 📞 **Free Legal Aid Helpline:** ${legalAid}

---
*ℹ️ Educational legal guidance under Indian law. Consult a registered advocate or DLSA clinic for representation.*`;

  return {
    id: "msg_" + Date.now().toString(),
    sender: "assistant",
    text: responseText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    structuredData: {
      understanding,
      rights,
      legalArea: category,
      isActionable,
      authority,
      documents,
      nextSteps,
      legalAid,
      recommendedCategory: filterCategoryParam,
      suggestedAdvocateSpecialty: recommendedAdvocateType,
      draftTitle,
      draftBody: `TO WHOMSOEVER IT MAY CONCERN / BEFORE THE COMPETENT AUTHORITY\n\nSUBJECT: ${draftTitle.toUpperCase()} IN RESPECT OF ${category.toUpperCase()}\n\n1. Complainant / Applicant: Rajesh Kumar, Citizen of India.\n2. Grounds: ${understanding}\n3. Relevant Provisions: ${rights[0]}\n4. Prayer: The addressee is called upon to redress the grievance within 15 days of notice, failing which legal proceedings before ${authority} shall be instituted.\n\nDate: ${new Date().toLocaleDateString('en-IN')}\nSignature / Verification`
    }
  };
}
