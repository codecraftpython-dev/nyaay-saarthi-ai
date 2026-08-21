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
import { CitizenDashboardPage } from './components/dashboard/CitizenDashboardPage';
import { AdvocateDashboardPage } from './components/dashboard/AdvocateDashboardPage';
import { Language, AppRoute, AuthUser, FooterLink } from './types';

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
  if (target === 'user/home' || target === 'user-dashboard') return 'user/home';
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
    return null;
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

  // Modal / Interactive Dialog State
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

  const navigateTo = (route: AppRoute) => {
    let resolvedRoute: AppRoute = route;

    // Default aliases
    if (route === 'auth/login') resolvedRoute = 'auth/login/citizen';
    if (route === 'auth/register') resolvedRoute = 'auth/register/citizen';

    // Route Protection
    if (resolvedRoute === 'user/home') {
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

  // 6. Protected Citizen Dashboard View
  if (currentRoute === 'user/home') {
    const activeCitizen = currentUser && currentUser.role === 'citizen' ? currentUser : {
      id: 'demo_citizen',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@gmail.com',
      role: 'citizen' as const,
    };

    return (
      <>
        <CitizenDashboardPage
          user={activeCitizen}
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
