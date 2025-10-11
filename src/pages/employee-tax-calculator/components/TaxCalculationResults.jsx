import React from 'react';
import Icon from '../../../components/AppIcon';

const TaxCalculationResults = ({ results, isCalculating }) => {
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '0 GNF';
    return `${amount?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} GNF`;
  };

  const getPercentage = (amount, total) => {
    if (!total || total === 0) return '0%';
    return `${((amount / total) * 100)?.toFixed(1)}%`;
  };

  if (isCalculating) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground font-body">Calcul en cours...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="text-center py-12">
          <Icon name="Calculator" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-heading font-medium text-foreground mb-2">
            Prêt pour le Calcul
          </h3>
          <p className="text-muted-foreground font-body">
            Remplissez les informations de l'employé pour voir les résultats
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
          Résumé du Calcul
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-sm font-caption text-muted-foreground mb-1">Salaire Brut</p>
            <p className="text-xl font-heading font-semibold text-foreground">
              {formatCurrency(results?.grossTotal)}
            </p>
          </div>
          
          <div className="text-center p-4 bg-error/10 rounded-lg">
            <p className="text-sm font-caption text-muted-foreground mb-1">Total Déductions</p>
            <p className="text-xl font-heading font-semibold text-error">
              -{formatCurrency(results?.totalDeductions)}
            </p>
          </div>
          
          <div className="text-center p-4 bg-success/10 rounded-lg">
            <p className="text-sm font-caption text-muted-foreground mb-1">Salaire Net</p>
            <p className="text-2xl font-heading font-bold text-success">
              {formatCurrency(results?.netSalary)}
            </p>
          </div>
        </div>
      </div>
      {/* Detailed Breakdown */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
          Détail des Déductions
        </h3>
        
        <div className="space-y-4">
          {/* Income Tax */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-error rounded-full"></div>
              <div>
                <p className="font-body font-medium text-foreground">Impôt sur le Revenu</p>
                <p className="text-sm text-muted-foreground">
                  Taux: {results?.incomeTaxRate}% • Tranche: {results?.taxBracket}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-heading font-semibold text-foreground">
                {formatCurrency(results?.incomeTax)}
              </p>
              <p className="text-sm text-muted-foreground">
                {getPercentage(results?.incomeTax, results?.grossTotal)}
              </p>
            </div>
          </div>

          {/* CNSS Contribution */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-warning rounded-full"></div>
              <div>
                <p className="font-body font-medium text-foreground">Cotisation CNSS</p>
                <p className="text-sm text-muted-foreground">
                  Taux: {results?.cnssRate}% • Sécurité Sociale
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-heading font-semibold text-foreground">
                {formatCurrency(results?.cnssContribution)}
              </p>
              <p className="text-sm text-muted-foreground">
                {getPercentage(results?.cnssContribution, results?.grossTotal)}
              </p>
            </div>
          </div>

          {/* Medical Insurance */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <div>
                <p className="font-body font-medium text-foreground">Assurance Médicale</p>
                <p className="text-sm text-muted-foreground">
                  Taux: {results?.medicalInsuranceRate}% • Couverture Santé
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-heading font-semibold text-foreground">
                {formatCurrency(results?.medicalInsurance)}
              </p>
              <p className="text-sm text-muted-foreground">
                {getPercentage(results?.medicalInsurance, results?.grossTotal)}
              </p>
            </div>
          </div>

          {/* Professional Tax */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
              <div>
                <p className="font-body font-medium text-foreground">Taxe Professionnelle</p>
                <p className="text-sm text-muted-foreground">
                  Montant fixe selon la catégorie
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-heading font-semibold text-foreground">
                {formatCurrency(results?.professionalTax)}
              </p>
              <p className="text-sm text-muted-foreground">
                {getPercentage(results?.professionalTax, results?.grossTotal)}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Tax Bracket Information */}
      <div className="bg-muted/50 rounded-lg border border-border p-6">
        <h4 className="text-base font-heading font-medium text-foreground mb-4">
          Informations Fiscales
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Tranche Fiscale Applicable</p>
            <p className="font-body font-medium text-foreground">{results?.taxBracket}</p>
          </div>
          
          <div>
            <p className="text-muted-foreground mb-1">Taux Effectif Global</p>
            <p className="font-body font-medium text-foreground">
              {getPercentage(results?.totalDeductions, results?.grossTotal)}
            </p>
          </div>
          
          <div>
            <p className="text-muted-foreground mb-1">Base Imposable</p>
            <p className="font-body font-medium text-foreground">
              {formatCurrency(results?.taxableIncome)}
            </p>
          </div>
          
          <div>
            <p className="text-muted-foreground mb-1">Catégorie d'Emploi</p>
            <p className="font-body font-medium text-foreground">{results?.employmentCategory}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxCalculationResults;