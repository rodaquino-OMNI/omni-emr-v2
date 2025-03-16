
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Users, Stethoscope, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageToggle from '@/components/auth/LanguageToggle';
import { useAuth } from '@/context/AuthContext';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">{t('appName')}</span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageToggle />
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="sm">{t('dashboard')}</Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">{t('login')}</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">{t('register')}</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container pt-24 pb-12 md:pt-32 md:pb-20">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            {t('heroTitle', 'Modern Healthcare Management')}
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-muted-foreground">
            {t('heroSubtitle', 'A comprehensive solution for healthcare professionals to manage patients, medications, and clinical workflows in one secure platform.')}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to={isAuthenticated ? '/dashboard' : '/login'}>
              <Button size="lg" className="gap-2">
                {isAuthenticated ? t('dashboard') : t('getStarted', 'Get Started')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg">
                {t('learnMore', 'Learn More')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-12 md:py-20">
        <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
          {t('features', 'Key Features')}
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <Users className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-bold">{t('patientManagement', 'Patient Management')}</h3>
            <p className="mt-2 text-muted-foreground">
              {t('patientManagementDesc', 'Comprehensive patient records with easy access to medical history.')}
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <Stethoscope className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-bold">{t('clinicalDocumentation', 'Clinical Documentation')}</h3>
            <p className="mt-2 text-muted-foreground">
              {t('clinicalDocumentationDesc', 'Streamlined notes and documentation for healthcare professionals.')}
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <Clock className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-bold">{t('medicationManagement', 'Medication Management')}</h3>
            <p className="mt-2 text-muted-foreground">
              {t('medicationManagementDesc', 'Effortless medication ordering, prescribing, and administration.')}
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <FileText className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-bold">{t('hospitalWorkflows', 'Hospital Workflows')}</h3>
            <p className="mt-2 text-muted-foreground">
              {t('hospitalWorkflowsDesc', 'Optimized clinical workflows from admission to discharge.')}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-12">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-medium">{t('appName')}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {t('appName')}. {t('allRightsReserved', 'All rights reserved.')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
