import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ActionButtons = ({ 
  onCalculate, 
  onSave, 
  onGeneratePayslip, 
  onReset,
  isCalculating, 
  hasResults, 
  formData 
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  };

  const handleGeneratePayslip = async () => {
    setIsGenerating(true);
    try {
      await onGeneratePayslip();
    } finally {
      setIsGenerating(false);
    }
  };

  const isFormValid = formData?.fullName && formData?.position && formData?.grossSalary && formData?.employmentCategory;

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
        Actions
      </h3>
      
      <div className="space-y-4">
        {/* Primary Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="default"
            onClick={onCalculate}
            loading={isCalculating}
            disabled={!isFormValid || isCalculating}
            iconName="Calculator"
            iconPosition="left"
            fullWidth
          >
            {isCalculating ? 'Calcul en cours...' : 'Calculer'}
          </Button>

          <Button
            variant="outline"
            onClick={onReset}
            disabled={isCalculating}
            iconName="RotateCcw"
            iconPosition="left"
            fullWidth
          >
            Réinitialiser
          </Button>
        </div>

        {/* Secondary Actions */}
        {hasResults && (
          <div className="pt-4 border-t border-border space-y-3">
            <Button
              variant="success"
              onClick={handleSave}
              loading={isSaving}
              disabled={isCalculating || isSaving}
              iconName="Save"
              iconPosition="left"
              fullWidth
            >
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder le Calcul'}
            </Button>

            <Button
              variant="secondary"
              onClick={handleGeneratePayslip}
              loading={isGenerating}
              disabled={isCalculating || isGenerating}
              iconName="FileText"
              iconPosition="left"
              fullWidth
            >
              {isGenerating ? 'Génération...' : 'Générer Fiche de Paie'}
            </Button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm font-caption text-muted-foreground mb-3">Actions Rapides</p>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="ghost"
              size="sm"
              iconName="Users"
              iconPosition="left"
              onClick={() => window.location.href = '/employee-management'}
            >
              Employés
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              iconName="FileSpreadsheet"
              iconPosition="left"
              onClick={() => window.location.href = '/batch-processing'}
            >
              Traitement Lot
            </Button>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-primary mt-0.5" />
          <div>
            <p className="text-sm font-body font-medium text-foreground mb-1">
              Aide au Calcul
            </p>
            <p className="text-xs text-muted-foreground">
              Les calculs sont basés sur les taux fiscaux guinéens en vigueur. 
              Pour des situations complexes, consultez un expert fiscal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionButtons;