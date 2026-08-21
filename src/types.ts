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
  | 'advocate/home';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
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
