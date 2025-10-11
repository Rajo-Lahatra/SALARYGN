import React from 'react';
import Icon from '../../../components/AppIcon';


const TrustSignals = () => {
  const certifications = [
    {
      id: 1,
      name: "Ministère des Finances",
      description: "Conforme aux réglementations fiscales guinéennes",
      icon: "Shield",
      verified: true
    },
    {
      id: 2,
      name: "Autorité Fiscale Locale",
      description: "Certifié pour le calcul des impôts sur le revenu",
      icon: "CheckCircle",
      verified: true
    },
    {
      id: 3,
      name: "CNSS Guinée",
      description: "Intégration des cotisations sociales officielles",
      icon: "Users",
      verified: true
    }
  ];

  const securityFeatures = [
    {
      icon: "Lock",
      title: "Sécurité Renforcée",
      description: "Chiffrement des données sensibles"
    },
    {
      icon: "Database",
      title: "Conformité RGPD",
      description: "Protection des données personnelles"
    },
    {
      icon: "Clock",
      title: "Mise à Jour Automatique",
      description: "Taux fiscaux toujours actualisés"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Certifications */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Award" size={20} className="text-primary" />
          <h3 className="font-heading font-semibold text-foreground">
            Certifications Officielles
          </h3>
        </div>
        
        <div className="space-y-4">
          {certifications?.map((cert) => (
            <div key={cert?.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                <Icon name={cert?.icon} size={16} className="text-success" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className="font-body font-medium text-sm text-foreground">
                    {cert?.name}
                  </h4>
                  {cert?.verified && (
                    <Icon name="BadgeCheck" size={14} className="text-success" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {cert?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Security Features */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="ShieldCheck" size={20} className="text-primary" />
          <h3 className="font-heading font-semibold text-foreground">
            Sécurité & Conformité
          </h3>
        </div>
        
        <div className="grid gap-4">
          {securityFeatures?.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name={feature?.icon} size={16} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-body font-medium text-sm text-foreground">
                  {feature?.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {feature?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Support Information */}
      <div className="bg-muted/30 border border-border rounded-lg p-6">
        <div className="text-center">
          <Icon name="Headphones" size={24} className="text-primary mx-auto mb-3" />
          <h3 className="font-heading font-medium text-foreground mb-2">
            Support Technique
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Notre équipe d'experts est disponible pour vous accompagner
          </p>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center justify-center space-x-2">
              <Icon name="Phone" size={14} />
              <span>+224 XX XX XX XX</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Icon name="Mail" size={14} />
              <span>support@taxcalc.gn</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Icon name="Clock" size={14} />
              <span>Lun-Ven: 8h-18h GMT</span>
            </div>
          </div>
        </div>
      </div>
      {/* Version Info */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground font-caption">
          TaxCalc Guinea v1.0.2 • Dernière mise à jour: Octobre 2024
        </p>
        <p className="text-xs text-muted-foreground font-caption mt-1">
          Conforme aux réglementations fiscales guinéennes en vigueur
        </p>
      </div>
    </div>
  );
};

export default TrustSignals;