import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Input from '../../../components/ui/Input';

const ProcessingConfigPanel = ({ 
  config, 
  onConfigChange, 
  onStartProcessing, 
  onScheduleProcessing,
  selectedCount,
  isProcessing 
}) => {
  const [showScheduleOptions, setShowScheduleOptions] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const periodOptions = [
    { value: 'current', label: 'Mois Actuel (Octobre 2025)' },
    { value: 'previous', label: 'Mois Précédent (Septembre 2025)' },
    { value: 'custom', label: 'Période Personnalisée' }
  ];

  const bonusTypeOptions = [
    { value: 'none', label: 'Aucun bonus' },
    { value: 'performance', label: 'Prime de performance' },
    { value: 'annual', label: 'Prime annuelle' },
    { value: 'custom', label: 'Montant personnalisé' }
  ];

  const overtimeRateOptions = [
    { value: '1.25', label: '125% (Heures supplémentaires normales)' },
    { value: '1.5', label: '150% (Heures supplémentaires majorées)' },
    { value: '2.0', label: '200% (Jours fériés/Dimanche)' }
  ];

  const handleConfigUpdate = (key, value) => {
    onConfigChange({
      ...config,
      [key]: value
    });
  };

  const handleStartProcessing = () => {
    if (selectedCount === 0) {
      alert('Veuillez sélectionner au moins un employé');
      return;
    }
    onStartProcessing();
  };

  const handleScheduleProcessing = () => {
    if (selectedCount === 0) {
      alert('Veuillez sélectionner au moins un employé');
      return;
    }
    if (!scheduleDate || !scheduleTime) {
      alert('Veuillez sélectionner une date et une heure');
      return;
    }
    onScheduleProcessing(scheduleDate, scheduleTime);
    setShowScheduleOptions(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Configuration du Traitement
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Définissez les paramètres pour le calcul en lot
        </p>
      </div>
      <div className="p-6 space-y-6">
        {/* Calculation Period */}
        <div className="space-y-3">
          <label className="text-sm font-body font-medium text-foreground">
            Période de Calcul
          </label>
          <Select
            options={periodOptions}
            value={config?.period}
            onChange={(value) => handleConfigUpdate('period', value)}
            placeholder="Sélectionner la période"
          />
        </div>

        {/* Custom Period Inputs */}
        {config?.period === 'custom' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/20 rounded-lg">
            <Input
              type="date"
              label="Date de début"
              value={config?.startDate}
              onChange={(e) => handleConfigUpdate('startDate', e?.target?.value)}
            />
            <Input
              type="date"
              label="Date de fin"
              value={config?.endDate}
              onChange={(e) => handleConfigUpdate('endDate', e?.target?.value)}
            />
          </div>
        )}

        {/* Bonus Configuration */}
        <div className="space-y-3">
          <label className="text-sm font-body font-medium text-foreground">
            Gestion des Primes
          </label>
          <Select
            options={bonusTypeOptions}
            value={config?.bonusType}
            onChange={(value) => handleConfigUpdate('bonusType', value)}
            placeholder="Type de prime"
          />
          
          {config?.bonusType === 'custom' && (
            <Input
              type="number"
              label="Montant de la prime (GNF)"
              placeholder="0"
              value={config?.customBonusAmount}
              onChange={(e) => handleConfigUpdate('customBonusAmount', e?.target?.value)}
            />
          )}
        </div>

        {/* Overtime Configuration */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-body font-medium text-foreground">
              Heures Supplémentaires
            </label>
            <Checkbox
              checked={config?.includeOvertime}
              onChange={(e) => handleConfigUpdate('includeOvertime', e?.target?.checked)}
              label="Inclure les heures sup."
            />
          </div>
          
          {config?.includeOvertime && (
            <div className="space-y-3 p-4 bg-muted/20 rounded-lg">
              <Select
                options={overtimeRateOptions}
                value={config?.overtimeRate}
                onChange={(value) => handleConfigUpdate('overtimeRate', value)}
                placeholder="Taux des heures supplémentaires"
              />
              <Input
                type="number"
                label="Heures supplémentaires moyennes"
                placeholder="0"
                value={config?.averageOvertimeHours}
                onChange={(e) => handleConfigUpdate('averageOvertimeHours', e?.target?.value)}
              />
            </div>
          )}
        </div>

        {/* Additional Options */}
        <div className="space-y-3">
          <label className="text-sm font-body font-medium text-foreground">
            Options Additionnelles
          </label>
          <div className="space-y-2">
            <Checkbox
              checked={config?.generatePayslips}
              onChange={(e) => handleConfigUpdate('generatePayslips', e?.target?.checked)}
              label="Générer les bulletins de paie"
              description="Créer automatiquement les bulletins PDF"
            />
            <Checkbox
              checked={config?.sendNotifications}
              onChange={(e) => handleConfigUpdate('sendNotifications', e?.target?.checked)}
              label="Envoyer les notifications"
              description="Notifier les employés par email"
            />
            <Checkbox
              checked={config?.updateRecords}
              onChange={(e) => handleConfigUpdate('updateRecords', e?.target?.checked)}
              label="Mettre à jour les dossiers"
              description="Sauvegarder dans la base de données"
            />
          </div>
        </div>

        {/* Processing Actions */}
        <div className="pt-4 border-t border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="default"
              onClick={handleStartProcessing}
              disabled={selectedCount === 0 || isProcessing}
              loading={isProcessing}
              iconName="Play"
              iconPosition="left"
              className="flex-1"
            >
              {isProcessing ? 'Traitement en cours...' : 'Démarrer le Calcul'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowScheduleOptions(!showScheduleOptions)}
              disabled={selectedCount === 0 || isProcessing}
              iconName="Calendar"
              iconPosition="left"
            >
              Programmer
            </Button>
          </div>

          {/* Schedule Options */}
          {showScheduleOptions && (
            <div className="mt-4 p-4 bg-muted/20 rounded-lg space-y-3">
              <h4 className="font-body font-medium text-foreground">
                Programmer le Traitement
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  type="date"
                  label="Date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e?.target?.value)}
                  min={new Date()?.toISOString()?.split('T')?.[0]}
                />
                <Input
                  type="time"
                  label="Heure"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e?.target?.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleScheduleProcessing}
                  iconName="Check"
                  iconPosition="left"
                >
                  Confirmer
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowScheduleOptions(false)}
                >
                  Annuler
                </Button>
              </div>
            </div>
          )}

          {/* Selection Info */}
          <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="Info" size={16} className="text-primary" />
              <span className="text-sm font-body text-foreground">
                {selectedCount} employé(s) sélectionné(s) pour le traitement
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingConfigPanel;