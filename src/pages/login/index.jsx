import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import TrustSignals from './components/TrustSignals';
import LanguageSelector from './components/LanguageSelector';
import RegistrationLink from './components/RegistrationLink';
import Icon from '../../components/AppIcon';


const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('taxcalc_user');
    if (user) {
      navigate('/dashboard');
    }

    // Set page title
    document.title = 'Connexion - TaxCalc Guinea';
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Language Selector - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSelector />
      </div>
      <div className="min-h-screen flex">
        {/* Left Side - Login Form (Mobile: Full Width, Desktop: 1/2) */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>

        {/* Right Side - Trust Signals & Registration (Desktop Only) */}
        <div className="hidden lg:flex lg:w-1/2 bg-muted/30 p-8 items-center justify-center">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                TaxCalc Guinea
              </h2>
              <p className="text-lg text-muted-foreground font-body">
                Solution professionnelle de calcul fiscal pour la République de Guinée
              </p>
            </div>

            {/* Trust Signals */}
            <TrustSignals />

            {/* Registration Link */}
            <RegistrationLink />
          </div>
        </div>
      </div>
      {/* Mobile Trust Signals - Bottom Section */}
      <div className="lg:hidden bg-muted/30 p-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-xl font-heading font-bold text-foreground mb-2">
              TaxCalc Guinea
            </h2>
            <p className="text-sm text-muted-foreground font-body">
              Solution professionnelle de calcul fiscal
            </p>
          </div>
          
          {/* Compact Trust Signals */}
          <div className="bg-card border border-border rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center space-x-6">
              <div className="text-center">
                <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-1">
                  <Icon name="Shield" size={16} className="text-success" />
                </div>
                <p className="text-xs text-muted-foreground font-body">Certifié</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-1">
                  <Icon name="Lock" size={16} className="text-primary" />
                </div>
                <p className="text-xs text-muted-foreground font-body">Sécurisé</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-1">
                  <Icon name="CheckCircle" size={16} className="text-accent" />
                </div>
                <p className="text-xs text-muted-foreground font-body">Conforme</p>
              </div>
            </div>
          </div>

          <RegistrationLink />
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-card border-t border-border p-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-muted-foreground font-caption">
            © {new Date()?.getFullYear()} TaxCalc Guinea. Tous droits réservés.
          </p>
          <p className="text-xs text-muted-foreground font-caption mt-1">
            Conforme aux réglementations fiscales de la République de Guinée
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Login;