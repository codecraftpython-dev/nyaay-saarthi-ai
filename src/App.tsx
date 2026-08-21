import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { StatsSection } from './components/StatsSection';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { InteractiveDialogs } from './components/InteractiveDialogs';
import { AboutUsPage } from './components/AboutUsPage';
import { ContactUsPage } from './components/ContactUsPage';
import { RoleSelectionPage } from './components/auth/RoleSelectionPage';
import { CitizenLoginPage } from './components/auth/CitizenLoginPage';
import { AdvocateLoginPage } from './components/auth/AdvocateLoginPage';
import { CitizenRegisterPage } from './components/auth/CitizenRegisterPage';
import { AdvocateRegisterPage } from './components/auth/AdvocateRegisterPage';
import { AdvocateDashboardPage } from './components/dashboard/AdvocateDashboardPage';

// Citizen Portal Component Suite
import { CitizenNavbar } from './components/citizen/CitizenNavbar';
import { CitizenHomePage } from './components/citizen/CitizenHomePage';
import { AdvocateDiscoveryPage } from './components/citizen/AdvocateDiscoveryPage';
import { AdvocateProfilePage } from './components/citizen/AdvocateProfilePage';
import { AppointmentBookingFlow } from './components/citizen/AppointmentBookingFlow';
import { MyAppointmentsPage } from './components/citizen/MyAppointmentsPage';
import { MyApplicationsPage } from './components/citizen/MyApplicationsPage';
import { AiAssistantPage } from './components/citizen/AiAssistantPage';
import { KnowYourRightsPage } from './components/citizen/KnowYourRightsPage';
import { UserProfilePage } from './components/citizen/UserProfilePage';
import { SavedResourcesPage } from './components/citizen/SavedResourcesPage';
import { UserSettingsPage } from './components/citizen/UserSettingsPage';

import { Language, AppRoute, AuthUser, FooterLink, Advocate } from './types';
import { MOCK_ADVOCATES, getStoredAppointments, getStoredApplications } from './data/portalData';

function parseCurrentRoute(): AppRoute {
  if (typeof window === 'undefined') return 'home';

  const hash = window.location.hash.replace(/^#\/?/, '');
  const pathname = window.location.pathname.replace(/^\//, '');

  const target = hash || pathname;

  if (target === 'about' || target === 'about-us') return 'about';
  if (target === 'contact' || target === 'contact-us') return 'contact';
  if (target === 'auth/role-selection' || target === 'role-selection') return 'auth/role-selection';
  if (target === 'auth/login' || target === 'login') return 'auth/login/citizen';
  if (target === 'auth/login/citizen' || target === 'login/citizen') return 'auth/login/citizen';
  if (target === 'auth/login/advocate' || target === 'login/advocate') return 'auth/login/advocate';
  if (target === 'auth/register' || target === 'register') return 'auth/register/citizen';
  if (target === 'auth/register/citizen' || target === 'register/citizen') return 'auth/register/citizen';
  if (target === 'auth/register/advocate' || target === 'register/advocate') return 'auth/register/advocate';
  
  // Citizen Portal Routes
  if (target === 'user/home' || target === 'user-dashboard') return 'user/home';
  if (target === 'user/profile' || target === 'profile') return 'user/profile';
  if (target === 'user/applications' || target === 'applications') return 'user/applications';
  if (target === 'user/appointments' || target === 'my-appointments') return 'user/appointments';
  if (target === 'user/saved' || target === 'saved') return 'user/saved';
  if (target === 'user/settings' || target === 'settings') return 'user/settings';
  if (target === 'chat' || target === 'assistant' || target === 'ai-assistant') return 'chat';
  if (target === 'rights' || target === 'know-your-rights') return 'rights';
  if (target === 'appointments' || target === 'advocates' || target === 'find-advocate') return 'appointments';
  if (target === 'advocate-profile') return 'advocate-profile';
  if (target === 'appointment-book') return 'appointment-book';

  // Advocate Portal Routes
  if (target === 'advocate-dashboard' || target === 'advocate/home' || target === 'advocate') return 'advocate-dashboard';

  return 'home';
}

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(parseCurrentRoute);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('nyay_saathi_user');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user:', e);
      }
    }
    // Default fallback demo citizen account for instant testability
    return {
      id: 'usr_rajesh_101',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@gmail.com',
      phone: '+91 98765 43210',
      dob: '1992-05-14',
      state: 'Delhi',
      city: 'New Delhi',
      address: 'B-42, Pocket 1, Mayur Vihar Phase 1, New Delhi - 110091',
      role: 'citizen',
      createdAt: '2025-01-10',
    };
  });

  // Portal auxiliary state: selected advocate and pre-filled category
  const [selectedAdvocate, setSelectedAdvocate] = useState<Advocate | null>(() => MOCK_ADVOCATES[0]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);

  // Modal / Interactive Dialog State for footer links
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    actionKey: string | null;
    title: string | null;
    linkData?: FooterLink | null;
  }>({
    isOpen: false,
    actionKey: null,
    title: null,
    linkData: null,
  });

  // Listen to hash changes (browser Back/Forward navigation)
  useEffect(() => {
    const handleLocationChange = () => {
      const parsed = parseCurrentRoute();
      setCurrentRoute(parsed);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const navigateTo = (route: AppRoute, params?: any) => {
    let resolvedRoute: AppRoute = route;

    // Default aliases
    if (route === 'auth/login') resolvedRoute = 'auth/login/citizen';
    if (route === 'auth/register') resolvedRoute = 'auth/register/citizen';

    // Handle extra params (e.g. advocate or category)
    if (params?.advocate) {
      setSelectedAdvocate(params.advocate);
    }
    if (params?.category) {
      setActiveCategoryFilter(params.category);
    } else if (route === 'appointments' && !params?.category) {
      setActiveCategoryFilter(null);
    }

    // Route Protection for Citizen Portal
    const citizenProtectedRoutes: AppRoute[] = [
      'user/home', 'user/profile', 'user/settings', 
      'user/applications', 'user/appointments', 'user/saved'
    ];

    if (citizenProtectedRoutes.includes(resolvedRoute)) {
      if (!currentUser) {
        resolvedRoute = 'auth/login/citizen';
      } else if (currentUser.role !== 'citizen') {
        resolvedRoute = 'advocate-dashboard';
      }
    } else if (resolvedRoute === 'advocate-dashboard' || resolvedRoute === 'advocate/home') {
      if (!currentUser) {
        resolvedRoute = 'auth/login/advocate';
      } else if (currentUser.role !== 'advocate') {
        resolvedRoute = 'user/home';
      } else {
        resolvedRoute = 'advocate-dashboard';
      }
    }

    setCurrentRoute(resolvedRoute);
    window.location.hash = resolvedRoute === 'home' ? '' : resolvedRoute;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('nyay_saathi_user', JSON.stringify(user));
    } catch (e) {
      console.error('Error saving user to localStorage:', e);
    }
    if (user.role === 'citizen') {
      navigateTo('user/home');
    } else {
      navigateTo('advocate-dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('nyay_saathi_user');
    } catch (e) {
      console.error('Error clearing user localStorage:', e);
    }
    navigateTo('home');
  };

  const handleActionClick = (action: string, title?: string, linkData?: FooterLink) => {
    if (action === 'about-us' || action === 'about') {
      navigateTo('about');
      return;
    }

    if (action === 'contact-us' || action === 'contact') {
      navigateTo('contact');
      return;
    }

    if (action === 'home') {
      navigateTo('home');
      return;
    }

    if (action === 'chat' || action === 'chat-ai') {
      navigateTo('chat');
      return;
    }

    if (action === 'appointments' || action === 'book-appointment') {
      navigateTo('appointments');
      return;
    }

    if (action === 'rights') {
      navigateTo('rights');
      return;
    }

    if (action === 'login-signup') {
      if (currentUser) {
        navigateTo(currentUser.role === 'citizen' ? 'user/home' : 'advocate-dashboard');
      } else {
        navigateTo('auth/login/citizen');
      }
      return;
    }

    setDialogState({
      isOpen: true,
      actionKey: action,
      title: title || null,
      linkData: linkData || null,
    });
  };

  const closeDialog = () => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  };

  // 1. Role Selection View
  if (currentRoute === 'auth/role-selection') {
    return (
      <RoleSelectionPage
        language={language}
        onLanguageChange={setLanguage}
        onNavigate={navigateTo}
      />
    );
  }

  // 2. Citizen Login View
  if (currentRoute === 'auth/login/citizen') {
    return (
      <CitizenLoginPage
        language={language}
        onLanguageChange={setLanguage}
        onNavigate={navigateTo}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  // 3. Advocate Login View
  if (currentRoute === 'auth/login/advocate') {
    return (
      <AdvocateLoginPage
        language={language}
        onLanguageChange={setLanguage}
        onNavigate={navigateTo}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  // 4. Citizen Register View
  if (currentRoute === 'auth/register/citizen') {
    return (
      <CitizenRegisterPage
        language={language}
        onLanguageChange={setLanguage}
        onNavigate={navigateTo}
        onRegisterSuccess={handleLoginSuccess}
      />
    );
  }

  // 5. Advocate Register View
  if (currentRoute === 'auth/register/advocate') {
    return (
      <AdvocateRegisterPage
        language={language}
        onLanguageChange={setLanguage}
        onNavigate={navigateTo}
        onRegisterSuccess={handleLoginSuccess}
      />
    );
  }

  // 6. Citizen Portal Suite (Shared Layout)
  const isCitizenPortalRoute = [
    'user/home',
    'user/profile',
    'user/settings',
    'user/applications',
    'user/appointments',
    'user/saved',
    'chat',
    'rights',
    'appointments',
    'advocate-profile',
    'appointment-book'
  ].includes(currentRoute);

  if (isCitizenPortalRoute) {
    const activeCitizen = (currentUser && currentUser.role === 'citizen') ? currentUser : {
      id: 'usr_rajesh_101',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@gmail.com',
      phone: '+91 98765 43210',
      dob: '1992-05-14',
      state: 'Delhi',
      city: 'New Delhi',
      address: 'B-42, Pocket 1, Mayur Vihar Phase 1, New Delhi - 110091',
      role: 'citizen' as const,
      createdAt: '2025-01-10',
    };

    const appointments = getStoredAppointments();
    const upcomingCount = appointments.filter(a => a.status === 'upcoming').length;

    return (
      <div className="min-h-screen bg-[#F4F9FD] text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-sky-200 selection:text-sky-950">
        
        {/* Citizen Portal Header */}
        <CitizenNavbar
          user={activeCitizen}
          language={language}
          currentRoute={currentRoute}
          onLanguageChange={setLanguage}
          onNavigate={navigateTo}
          onLogout={handleLogout}
          notificationCount={upcomingCount}
        />

        {/* Main Citizen Content Area */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
          {currentRoute === 'user/home' && (
            <CitizenHomePage
              user={activeCitizen}
              language={language}
              onNavigate={navigateTo}
            />
          )}

          {currentRoute === 'appointments' && (
            <AdvocateDiscoveryPage
              language={language}
              onNavigate={navigateTo}
              initialCategory={activeCategoryFilter || undefined}
            />
          )}

          {currentRoute === 'advocate-profile' && selectedAdvocate && (
            <AdvocateProfilePage
              advocate={selectedAdvocate}
              language={language}
              onNavigate={navigateTo}
            />
          )}

          {currentRoute === 'appointment-book' && selectedAdvocate && (
            <AppointmentBookingFlow
              user={activeCitizen}
              advocate={selectedAdvocate}
              language={language}
              onNavigate={navigateTo}
            />
          )}

          {currentRoute === 'user/appointments' && (
            <MyAppointmentsPage
              language={language}
              onNavigate={navigateTo}
            />
          )}

          {currentRoute === 'user/applications' && (
            <MyApplicationsPage
              language={language}
              onNavigate={navigateTo}
            />
          )}

          {currentRoute === 'chat' && (
            <AiAssistantPage
              user={activeCitizen}
              language={language}
              onNavigate={navigateTo}
            />
          )}

          {currentRoute === 'rights' && (
            <KnowYourRightsPage
              user={activeCitizen}
              language={language}
              onNavigate={navigateTo}
            />
          )}

          {currentRoute === 'user/profile' && (
            <UserProfilePage
              user={activeCitizen}
              language={language}
              onNavigate={navigateTo}
              onUpdateUser={(updated) => {
                setCurrentUser(updated);
              }}
            />
          )}

          {currentRoute === 'user/saved' && (
            <SavedResourcesPage
              user={activeCitizen}
              language={language}
              onNavigate={navigateTo}
            />
          )}

          {currentRoute === 'user/settings' && (
            <UserSettingsPage
              user={activeCitizen}
              language={language}
              onLanguageChange={setLanguage}
              onNavigate={navigateTo}
              onLogout={handleLogout}
            />
          )}
        </main>

        {/* Footer */}
        <Footer
          language={language}
          onActionClick={handleActionClick}
        />

        {/* Modal Dialog System */}
        <InteractiveDialogs
          isOpen={dialogState.isOpen}
          onClose={closeDialog}
          language={language}
          actionKey={dialogState.actionKey}
          title={dialogState.title}
          linkData={dialogState.linkData}
        />
      </div>
    );
  }

  // 7. Protected Advocate Dashboard View at /advocate-dashboard
  if (currentRoute === 'advocate-dashboard' || currentRoute === 'advocate/home') {
    const activeAdvocate = currentUser && currentUser.role === 'advocate' ? currentUser : {
      id: 'demo_advocate',
      name: 'Adv. Vikram Sharma',
      email: 'adv.vikram.sharma@delhibar.org',
      role: 'advocate' as const,
      barEnrollment: 'D/1842/2016',
      stateBarCouncil: 'Bar Council of Delhi',
      isVerified: true,
    };

    return (
      <>
        <AdvocateDashboardPage
          user={activeAdvocate}
          language={language}
          onLanguageChange={setLanguage}
          onNavigate={navigateTo}
          onLogout={handleLogout}
          onOpenDialog={(actionKey, topic) => handleActionClick(actionKey, topic)}
        />

        <InteractiveDialogs
          isOpen={dialogState.isOpen}
          onClose={closeDialog}
          language={language}
          actionKey={dialogState.actionKey}
          title={dialogState.title}
          linkData={dialogState.linkData}
        />
      </>
    );
  }

  // 8. About Us Page
  if (currentRoute === 'about') {
    return (
      <>
        <AboutUsPage
          language={language}
          onLanguageChange={setLanguage}
          onBackToHome={() => navigateTo('home')}
          onActionClick={handleActionClick}
        />

        <InteractiveDialogs
          isOpen={dialogState.isOpen}
          onClose={closeDialog}
          language={language}
          actionKey={dialogState.actionKey}
          title={dialogState.title}
          linkData={dialogState.linkData}
        />
      </>
    );
  }

  // 9. Contact Us Page
  if (currentRoute === 'contact') {
    return (
      <>
        <ContactUsPage
          language={language}
          onLanguageChange={setLanguage}
          onBackToHome={() => navigateTo('home')}
          onActionClick={handleActionClick}
        />

        <InteractiveDialogs
          isOpen={dialogState.isOpen}
          onClose={closeDialog}
          language={language}
          actionKey={dialogState.actionKey}
          title={dialogState.title}
          linkData={dialogState.linkData}
        />
      </>
    );
  }

  // 10. Default Homepage View
  return (
    <div className="min-h-screen bg-[#F4F9FD] text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navigation Bar */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        onActionClick={handleActionClick}
        currentUser={currentUser}
        onLogout={handleLogout}
        onNavigate={navigateTo}
      />

      {/* Main Body */}
      <main className="flex-1 flex flex-col">
        {/* 1. What is it / Hero Section */}
        <HeroSection
          language={language}
          onActionClick={handleActionClick}
        />

        {/* 2. Features We Have */}
        <FeaturesSection
          language={language}
        />

        {/* 3. Stats Section */}
        <StatsSection
          language={language}
        />

        {/* 4. Reviews by User */}
        <ReviewsSection
          language={language}
          onActionClick={handleActionClick}
        />
      </main>

      {/* Footer Section */}
      <Footer
        language={language}
        onActionClick={handleActionClick}
      />

      {/* Interactive Modal System */}
      <InteractiveDialogs
        isOpen={dialogState.isOpen}
        onClose={closeDialog}
        language={language}
        actionKey={dialogState.actionKey}
        title={dialogState.title}
        linkData={dialogState.linkData}
      />
    </div>
  );
}
