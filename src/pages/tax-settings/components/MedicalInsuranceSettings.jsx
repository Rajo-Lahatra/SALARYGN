import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const MedicalInsuranceSettings = ({ settings, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempSettings, setTempSettings] = useState({ ...settings });

  const handleEdit = () => {
    setIsEditing(true);
    setTempSettings({ ...settings });
  };

  const handleSave = () => {
    onUpdate('medicalInsurance', tempSettings);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempSettings({ ...settings });
    setIsEditing(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-GN', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0
    })?.format(amount);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Assurance Maladie
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Configuration des déductions pour l'assurance maladie obligatoire
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="Heart" size={20} className="text-error" />
            <span className="text-sm font-caption text-muted-foreground">
              Assurance Obligatoire
            </span>
          </div>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              iconName="Edit"
              iconPosition="left"
            >
              Modifier
            </Button>
          )}
        </div>
      </div>
      <div className="space-y-6">
        {/* Basic Coverage */}
        <div className="border border-border rounded-lg p-4">
          <h4 className="font-heading font-medium text-foreground mb-4 flex items-center space-x-2">
            <Icon name="Shield" size={18} className="text-primary" />
            <span>Couverture de Base</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body font-medium text-foreground">
                    Taux de Cotisation Employé
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Pourcentage du salaire brut
                  </p>
                </div>
                <div className="text-right">
                  {isEditing ? (
                    <Input
                      type="number"
                      value={tempSettings?.employeeRate}
                      onChange={(e) => setTempSettings({
                        ...tempSettings,
                        employeeRate: parseFloat(e?.target?.value)
                      })}
                      className="w-20"
                    />
                  ) : (
                    <span className="font-data text-lg font-semibold text-primary">
                      {settings?.employeeRate}%
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body font-medium text-foreground">
                    Taux de Cotisation Employeur
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Contribution patronale
                  </p>
                </div>
                <div className="text-right">
                  {isEditing ? (
                    <Input
                      type="number"
                      value={tempSettings?.employerRate}
                      onChange={(e) => setTempSettings({
                        ...tempSettings,
                        employerRate: parseFloat(e?.target?.value)
                      })}
                      className="w-20"
                    />
                  ) : (
                    <span className="font-data text-lg font-semibold text-accent">
                      {settings?.employerRate}%
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body font-medium text-foreground">
                    Cotisation Minimum
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Montant minimum mensuel
                  </p>
                </div>
                <div className="text-right">
                  {isEditing ? (
                    <Input
                      type="number"
                      value={tempSettings?.minContribution}
                      onChange={(e) => setTempSettings({
                        ...tempSettings,
                        minContribution: parseInt(e?.target?.value)
                      })}
                      className="w-32"
                    />
                  ) : (
                    <span className="font-data font-semibold text-warning">
                      {formatCurrency(settings?.minContribution)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body font-medium text-foreground">
                    Cotisation Maximum
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Plafond mensuel
                  </p>
                </div>
                <div className="text-right">
                  {isEditing ? (
                    <Input
                      type="number"
                      value={tempSettings?.maxContribution}
                      onChange={(e) => setTempSettings({
                        ...tempSettings,
                        maxContribution: parseInt(e?.target?.value)
                      })}
                      className="w-32"
                    />
                  ) : (
                    <span className="font-data font-semibold text-warning">
                      {formatCurrency(settings?.maxContribution)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coverage Options */}
        <div className="border border-border rounded-lg p-4">
          <h4 className="font-heading font-medium text-foreground mb-4 flex items-center space-x-2">
            <Icon name="Users" size={18} className="text-accent" />
            <span>Options de Couverture</span>
          </h4>

          <div className="space-y-4">
            {settings?.coverageOptions?.map((option, index) => (
              <div key={option?.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  {isEditing ? (
                    <Checkbox
                      checked={tempSettings?.coverageOptions?.[index]?.enabled}
                      onChange={(e) => {
                        const newOptions = [...tempSettings?.coverageOptions];
                        newOptions[index].enabled = e?.target?.checked;
                        setTempSettings({
                          ...tempSettings,
                          coverageOptions: newOptions
                        });
                      }}
                    />
                  ) : (
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      option?.enabled ? 'bg-primary border-primary' : 'border-border'
                    }`}>
                      {option?.enabled && (
                        <Icon name="Check" size={12} className="text-primary-foreground" />
                      )}
                    </div>
                  )}
                  <div>
                    <p className="font-body font-medium text-foreground">
                      {option?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {option?.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {isEditing ? (
                    <Input
                      type="number"
                      value={tempSettings?.coverageOptions?.[index]?.additionalRate}
                      onChange={(e) => {
                        const newOptions = [...tempSettings?.coverageOptions];
                        newOptions[index].additionalRate = parseFloat(e?.target?.value);
                        setTempSettings({
                          ...tempSettings,
                          coverageOptions: newOptions
                        });
                      }}
                      className="w-20"
                      disabled={!tempSettings?.coverageOptions?.[index]?.enabled}
                    />
                  ) : (
                    <span className={`font-data font-semibold ${
                      option?.enabled ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      +{option?.additionalRate}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exemptions */}
        <div className="p-4 bg-muted/30 rounded-lg">
          <h4 className="font-heading font-medium text-foreground mb-3 flex items-center space-x-2">
            <Icon name="AlertCircle" size={18} className="text-warning" />
            <span>Exemptions et Conditions Spéciales</span>
          </h4>
          
          <div className="space-y-2 text-sm text-foreground">
            <p>• Les employés en période d'essai peuvent être exemptés pendant les 3 premiers mois</p>
            <p>• Les stagiaires non rémunérés ne sont pas soumis à cette cotisation</p>
            <p>• Les expatriés avec assurance internationale peuvent demander une exemption</p>
            <p>• Les employés à temps partiel (&lt; 20h/semaine) bénéficient d'un taux réduit</p>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      {isEditing && (
        <div className="flex items-center justify-end space-x-4 mt-6 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={handleCancel}
          >
            Annuler
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            iconName="Save"
            iconPosition="left"
          >
            Sauvegarder les Modifications
          </Button>
        </div>
      )}
    </div>
  );
};

export default MedicalInsuranceSettings;