export type Language = 'en' | 'hi';

export type AppRoute = 
  | 'home'
  | 'about'
  | 'contact'
  | 'auth/role-selection'
  | 'auth/login'
  | 'auth/login/citizen'
  | 'auth/login/advocate'
  | 'auth/register'
  | 'auth/register/citizen'
  | 'auth/register/advocate'
  | 'user/home'
  | 'user/profile'
  | 'user/settings'
  | 'user/applications'
  | 'user/appointments'
  | 'user/saved'
  | 'appointments'
  | 'advocate-profile'
  | 'appointment-book'
  | 'chat'
  | 'rights'
  | 'advocate/home'
  | 'advocate-dashboard';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dob?: string;
  state?: string;
  city?: string;
  address?: string;
  profilePicture?: string;
  role: 'citizen' | 'advocate';
  barEnrollment?: string;
  stateBarCouncil?: string;
  practiceAreas?: string[];
  experience?: string;
  courts?: string;
  languages?: string;
  consultationFee?: string;
  isVerified?: boolean;
  token?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Advocate {
  id: string;
  name: string;
  email: string;
  phone: string;
  profilePicture?: string;
  isVerified: boolean;
  practiceAreas: string[];
  courtLevels: string[];
  experience: string;
  experienceYears: number;
  location: string;
  city: string;
  state: string;
  languages: string[];
  consultationFee: number;
  rating: number;
  reviewCount: number;
  availability: 'Today' | 'This Week' | 'Available Today' | 'Next Available: Tomorrow';
  about: string;
  education: string;
  barEnrollment: string;
  courts: string;
  pastCasesSummary?: string;
  reviews?: Array<{
    author: string;
    rating: number;
    date: string;
    comment: string;
  }>;
}

export interface Appointment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  advocateId: string;
  advocateName: string;
  advocatePhoto?: string;
  advocateSpecialty: string;
  advocatePhone?: string;
  category: string;
  courtLevel: string;
  date: string;
  time: string;
  consultationType: 'Video' | 'Audio' | 'In-person';
  issue: string;
  fee: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  meetingLink?: string;
  locationAddress?: string;
  createdAt: string;
  applicationId?: string;
}

export interface ApplicationTimelineItem {
  stage: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  date?: string;
}

export interface Application {
  id: string;
  applicationId: string; // e.g. NS-1024
  userId: string;
  advocateId: string;
  advocateName: string;
  advocateContact: string;
  category: string;
  description: string;
  appointmentId?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  fee: number;
  paymentStatus: 'Paid' | 'Pending' | 'Waived';
  acceptanceStatus: 'Accepted' | 'Under Review' | 'Pending' | 'Clarification Needed';
  status: 'Submitted' | 'Under Review' | 'In Progress' | 'Authority Review' | 'Resolved' | 'Action Required';
  timeline: ApplicationTimelineItem[];
  draftDocument?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LegalRight {
  id: string;
  category: 
    | 'Constitutional'
    | 'Consumer'
    | 'Tenant & Property'
    | 'Employment'
    | 'Cyber'
    | 'Women'
    | 'Children'
    | 'Senior Citizen'
    | 'Disability'
    | 'Police & Criminal Justice'
    | 'Banking & Financial'
    | 'Family & Personal';
  name: string;
  nameHi: string;
  shortDescription: string;
  shortDescriptionHi: string;
  whoItAppliesTo: string;
  whoItAppliesToHi: string;
  legalSource: string;
  exampleSituation: string;
  exampleSituationHi: string;
  possibleAction: string;
  possibleActionHi: string;
  relevantAuthority: string;
  requiredDocuments: string[];
  relatedResources?: string[];
  advocateCategoryHint: string;
}

export interface AiCaseSummary {
  title: string;
  overview: string;
  keyPoints: string[];
  riskLevel: 'Low' | 'Medium' | 'High' | 'Urgent';
  timelineUrgency: string;
  next48Hours: string[];
  advocateBrief: string;
  estimatedRemedy: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isAiGenerated?: boolean;
  structuredData?: {
    understanding?: string;
    rights?: string[];
    legalArea?: string;
    isActionable?: string;
    authority?: string;
    documents?: string[];
    nextSteps?: string[];
    legalAid?: string;
    recommendedCategory?: string;
    suggestedAdvocateSpecialty?: string;
    draftTitle?: string;
    draftBody?: string;
  };
  summary?: AiCaseSummary;
  suggestions?: string[];
}

export interface SavedResource {
  id: string;
  userId: string;
  rightId: string;
  title: string;
  category: string;
  legalSource: string;
  savedAt: string;
  notes?: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  nameHi: string;
  role: string;
  roleHi: string;
  city: string;
  cityHi: string;
  rating: number;
  topic: string;
  topicHi: string;
  comment: string;
  commentHi: string;
  date: string;
}

export interface FeatureItem {
  id: string;
  iconName: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  tag: string;
  tagHi: string;
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  labelHi: string;
  sublabel: string;
  sublabelHi: string;
  iconName: string;
}

export interface FooterLink {
  label: string;
  labelHi: string;
  actionKey: string;
  category?: 'platform' | 'rights' | 'govt';
  externalUrl?: string;
  description?: string;
  descriptionHi?: string;
}

