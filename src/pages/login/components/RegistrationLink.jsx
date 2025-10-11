import React from 'react';

import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RegistrationLink = () => {
  const handleRegisterClick = () => {
    alert('La création de nouveaux comptes est actuellement gérée par l\'administrateur système. Contactez votre responsable IT pour obtenir un accès.');
  };

  const benefits = [
    {
      icon: "Calculator",
      title: "Calculs Automatisés",
      description: "Calcul précis des impôts et cotisations sociales"
    },
    {
      icon: "Users",
      title: "Gestion Multi-Employés",
      description: "Traitement en lot pour toute votre équipe"
    },
    {
      icon: "FileText",
      title: "Rapports Détaillés",
      description: "Génération de bulletins de paie et certificats fiscaux"
    },
    {
      icon: "Shield",
      title: "Conformité Garantie",
      description: "Respect des réglementations guinéennes en vigueur"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Registration CTA */}
      <div className="bg-card border border-border rounded-lg p-6 text-center">
        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="UserPlus" size={24} className="text-accent" />
        </div>
        
        <h3 className="font-heading font-semibold text-foreground mb-2">
          Nouveau sur TaxCalc Guinea ?
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4 font-body">
          Rejoignez des centaines d'entreprises qui font confiance à notre solution de calcul fiscal
        </p>
        
        <Button
          variant="outline"
          onClick={handleRegisterClick}
          iconName="ArrowRight"
          iconPosition="right"
          className="mb-4"
        >
          Demander un Accès
        </Button>
        
        <p className="text-xs text-muted-foreground font-body">
          Contactez votre administrateur système pour créer un compte
        </p>
      </div>
      {/* Benefits */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="font-heading font-medium text-foreground mb-4 text-center">
          Pourquoi choisir TaxCalc Guinea ?
        </h4>
        
        <div className="grid gap-4">
          {benefits?.map((benefit, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name={benefit?.icon} size={16} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-body font-medium text-sm text-foreground">
                  {benefit?.title}
                </h5>
                <p className="text-xs text-muted-foreground mt-1">
                  {benefit?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Contact Information */}
      <div className="bg-muted/30 border border-border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="MessageCircle" size={16} className="text-primary" />
          <h4 className="font-body font-medium text-sm text-foreground">
            Besoin d'aide ?
          </h4>
        </div>
        
        <div className="space-y-2 text-xs text-muted-foreground font-body">
          <div className="flex items-center space-x-2">
            <Icon name="Mail" size={12} />
            <span>commercial@taxcalc.gn</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Phone" size={12} />
            <span>+224 XX XX XX XX</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="MapPin" size={12} />
            <span>Conakry, République de Guinée</span>
          </div>
        </div>
      </div>
      {/* Demo Access */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground font-body mb-2">
          Vous souhaitez tester l'application ?
        </p>
        <p className="text-xs text-primary font-body">
          Utilisez les identifiants de démonstration ci-dessus
        </p>
      </div>
    </div>
  );
};

export default RegistrationLink;