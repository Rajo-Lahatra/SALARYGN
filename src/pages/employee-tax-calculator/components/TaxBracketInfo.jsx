import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TaxBracketInfo = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const taxBrackets = [
    {
      range: "0 - 1 000 000 GNF",
      rate: "0%",
      description: "Exonération totale"
    },
    {
      range: "1 000 001 - 3 000 000 GNF",
      rate: "5%",
      description: "Tranche faible"
    },
    {
      range: "3 000 001 - 6 000 000 GNF",
      rate: "10%",
      description: "Tranche moyenne"
    },
    {
      range: "6 000 001 - 12 000 000 GNF",
      rate: "15%",
      description: "Tranche élevée"
    },
    {
      range: "12 000 001 GNF et plus",
      rate: "20%",
      description: "Tranche maximale"
    }
  ];

  const socialContributions = [
    {
      type: "CNSS (Employé)",
      rate: "2.5%",
      description: "Cotisation sécurité sociale"
    },
    {
      type: "CNSS (Employeur)",
      rate: "16%",
      description: "Part employeur (non déduite du salaire)"
    },
    {
      type: "Assurance Médicale",
      rate: "1.5%",
      description: "Couverture santé obligatoire"
    },
    {
      type: "Taxe Professionnelle",
      rate: "Variable",
      description: "Selon la catégorie d\'emploi"
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="BookOpen" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-semibold text-foreground">
                Barème Fiscal Guinéen
              </h3>
              <p className="text-sm text-muted-foreground">
                Taux et tranches d'imposition en vigueur
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            {isExpanded ? 'Masquer' : 'Voir Détails'}
          </Button>
        </div>
      </div>
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Income Tax Brackets */}
          <div>
            <h4 className="text-base font-heading font-medium text-foreground mb-4">
              Tranches d'Impôt sur le Revenu
            </h4>
            
            <div className="space-y-3">
              {taxBrackets?.map((bracket, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="font-body font-medium text-foreground">
                      {bracket?.range}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {bracket?.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-semibold text-lg text-primary">
                      {bracket?.rate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Contributions */}
          <div>
            <h4 className="text-base font-heading font-medium text-foreground mb-4">
              Cotisations Sociales
            </h4>
            
            <div className="space-y-3">
              {socialContributions?.map((contribution, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="font-body font-medium text-foreground">
                      {contribution?.type}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {contribution?.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-semibold text-lg text-accent">
                      {contribution?.rate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Important Notes */}
          <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
              <div>
                <p className="text-sm font-body font-medium text-foreground mb-2">
                  Notes Importantes
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Les taux sont applicables aux revenus mensuels</li>
                  <li>• L'impôt est calculé de manière progressive par tranche</li>
                  <li>• Les cotisations sociales sont calculées sur le salaire brut</li>
                  <li>• La taxe professionnelle varie selon le secteur d'activité</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Last Update */}
          <div className="text-center pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Dernière mise à jour: Octobre 2025 • 
              <span className="text-primary cursor-pointer hover:underline ml-1">
                Voir les modifications récentes
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxBracketInfo;