import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SocialSecuritySettings = ({ settings, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempSettings, setTempSettings] = useState({ ...settings });

  const handleEdit = () => {
    setIsEditing(true);
    setTempSettings({ ...settings });
  };

  const handleSave = () => {
    onUpdate('socialSecurity', tempSettings);
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
            Cotisations Sociales (CNSS)
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Configuration des taux de cotisation à la Caisse Nationale de Sécurité Sociale
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={20} className="text-accent" />
            <span className="text-sm font-caption text-muted-foreground">
              CNSS Guinée
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Contributions */}
        <div className="space-y-4">
          <h4 className="font-heading font-medium text-foreground flex items-center space-x-2">
            <Icon name="User" size={18} className="text-primary" />
            <span>Cotisations Employé</span>
          </h4>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p className="font-body font-medium text-foreground">
                  Retraite
                </p>
                <p className="text-sm text-muted-foreground">
                  Cotisation retraite employé
                </p>
              </div>
              <div className="text-right">
                {isEditing ? (
                  <Input
                    type="number"
                    value={tempSettings?.employee?.retirement}
                    onChange={(e) => setTempSettings({
                      ...tempSettings,
                      employee: {
                        ...tempSettings?.employee,
                        retirement: parseFloat(e?.target?.value)
                      }
                    })}
                    className="w-20"
                  />
                ) : (
                  <span className="font-data text-lg font-semibold text-primary">
                    {settings?.employee?.retirement}%
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p className="font-body font-medium text-foreground">
                  Prestations Familiales
                </p>
                <p className="text-sm text-muted-foreground">
                  Allocations familiales
                </p>
              </div>
              <div className="text-right">
                {isEditing ? (
                  <Input
                    type="number"
                    value={tempSettings?.employee?.familyAllowance}
                    onChange={(e) => setTempSettings({
                      ...tempSettings,
                      employee: {
                        ...tempSettings?.employee,
                        familyAllowance: parseFloat(e?.target?.value)
                      }
                    })}
                    className="w-20"
                  />
                ) : (
                  <span className="font-data text-lg font-semibold text-primary">
                    {settings?.employee?.familyAllowance}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Employer Contributions */}
        <div className="space-y-4">
          <h4 className="font-heading font-medium text-foreground flex items-center space-x-2">
            <Icon name="Building2" size={18} className="text-accent" />
            <span>Cotisations Employeur</span>
          </h4>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p className="font-body font-medium text-foreground">
                  Retraite
                </p>
                <p className="text-sm text-muted-foreground">
                  Cotisation retraite employeur
                </p>
              </div>
              <div className="text-right">
                {isEditing ? (
                  <Input
                    type="number"
                    value={tempSettings?.employer?.retirement}
                    onChange={(e) => setTempSettings({
                      ...tempSettings,
                      employer: {
                        ...tempSettings?.employer,
                        retirement: parseFloat(e?.target?.value)
                      }
                    })}
                    className="w-20"
                  />
                ) : (
                  <span className="font-data text-lg font-semibold text-accent">
                    {settings?.employer?.retirement}%
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p className="font-body font-medium text-foreground">
                  Prestations Familiales
                </p>
                <p className="text-sm text-muted-foreground">
                  Allocations familiales employeur
                </p>
              </div>
              <div className="text-right">
                {isEditing ? (
                  <Input
                    type="number"
                    value={tempSettings?.employer?.familyAllowance}
                    onChange={(e) => setTempSettings({
                      ...tempSettings,
                      employer: {
                        ...tempSettings?.employer,
                        familyAllowance: parseFloat(e?.target?.value)
                      }
                    })}
                    className="w-20"
                  />
                ) : (
                  <span className="font-data text-lg font-semibold text-accent">
                    {settings?.employer?.familyAllowance}%
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p className="font-body font-medium text-foreground">
                  Accidents du Travail
                </p>
                <p className="text-sm text-muted-foreground">
                  Assurance accidents professionnels
                </p>
              </div>
              <div className="text-right">
                {isEditing ? (
                  <Input
                    type="number"
                    value={tempSettings?.employer?.workAccident}
                    onChange={(e) => setTempSettings({
                      ...tempSettings,
                      employer: {
                        ...tempSettings?.employer,
                        workAccident: parseFloat(e?.target?.value)
                      }
                    })}
                    className="w-20"
                  />
                ) : (
                  <span className="font-data text-lg font-semibold text-accent">
                    {settings?.employer?.workAccident}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Maximum Contribution Limits */}
      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
        <h4 className="font-heading font-medium text-foreground mb-4 flex items-center space-x-2">
          <Icon name="TrendingUp" size={18} className="text-warning" />
          <span>Plafonds de Cotisation</span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-body text-foreground">
              Salaire maximum cotisable:
            </span>
            {isEditing ? (
              <Input
                type="number"
                value={tempSettings?.maxSalaryBase}
                onChange={(e) => setTempSettings({
                  ...tempSettings,
                  maxSalaryBase: parseInt(e?.target?.value)
                })}
                className="w-32"
              />
            ) : (
              <span className="font-data font-semibold text-warning">
                {formatCurrency(settings?.maxSalaryBase)}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-body text-foreground">
              Cotisation mensuelle maximum:
            </span>
            <span className="font-data font-semibold text-warning">
              {formatCurrency(settings?.maxSalaryBase * (settings?.employee?.retirement + settings?.employee?.familyAllowance) / 100)}
            </span>
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

export default SocialSecuritySettings;