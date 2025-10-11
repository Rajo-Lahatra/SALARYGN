import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const CurrencySettings = ({ settings, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempSettings, setTempSettings] = useState({ ...settings });

  const handleEdit = () => {
    setIsEditing(true);
    setTempSettings({ ...settings });
  };

  const handleSave = () => {
    onUpdate('currency', tempSettings);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempSettings({ ...settings });
    setIsEditing(false);
  };

  const formatOptions = [
    { value: 'space', label: '1 000 000 GNF (Espace)' },
    { value: 'comma', label: '1,000,000 GNF (Virgule)' },
    { value: 'dot', label: '1.000.000 GNF (Point)' },
    { value: 'none', label: '1000000 GNF (Aucun)' }
  ];

  const positionOptions = [
    { value: 'before', label: 'GNF 1 000 000 (Avant)' },
    { value: 'after', label: '1 000 000 GNF (Après)' }
  ];

  const decimalOptions = [
    { value: 0, label: '1 000 000 (Aucune)' },
    { value: 2, label: '1 000 000,00 (2 décimales)' }
  ];

  const previewAmount = 1234567.89;

  const formatPreview = (amount, format) => {
    const { separator, position, decimals, showSymbol } = format;
    
    let formattedNumber = amount?.toFixed(decimals);
    let [integer, decimal] = formattedNumber?.split('.');
    
    // Apply thousand separator
    if (separator === 'space') {
      integer = integer?.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    } else if (separator === 'comma') {
      integer = integer?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else if (separator === 'dot') {
      integer = integer?.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    
    // Combine integer and decimal parts
    let result = integer;
    if (decimals > 0 && decimal) {
      result += ',' + decimal;
    }
    
    // Add currency symbol
    if (showSymbol) {
      result = position === 'before' ? 'GNF ' + result : result + ' GNF';
    }
    
    return result;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Format Monétaire
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Configuration de l'affichage des montants en Franc Guinéen (GNF)
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="Banknote" size={20} className="text-success" />
            <span className="text-sm font-caption text-muted-foreground">
              Franc Guinéen
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
        {/* Format Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-heading font-medium text-foreground flex items-center space-x-2">
              <Icon name="Settings" size={18} className="text-primary" />
              <span>Configuration</span>
            </h4>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-caption text-muted-foreground mb-2 block">
                  Séparateur de milliers
                </label>
                {isEditing ? (
                  <Select
                    options={formatOptions}
                    value={tempSettings?.thousandSeparator}
                    onChange={(value) => setTempSettings({
                      ...tempSettings,
                      thousandSeparator: value
                    })}
                  />
                ) : (
                  <p className="font-body text-foreground">
                    {formatOptions?.find(opt => opt?.value === settings?.thousandSeparator)?.label}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-caption text-muted-foreground mb-2 block">
                  Position du symbole
                </label>
                {isEditing ? (
                  <Select
                    options={positionOptions}
                    value={tempSettings?.symbolPosition}
                    onChange={(value) => setTempSettings({
                      ...tempSettings,
                      symbolPosition: value
                    })}
                  />
                ) : (
                  <p className="font-body text-foreground">
                    {positionOptions?.find(opt => opt?.value === settings?.symbolPosition)?.label}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-caption text-muted-foreground mb-2 block">
                  Décimales
                </label>
                {isEditing ? (
                  <Select
                    options={decimalOptions}
                    value={tempSettings?.decimalPlaces}
                    onChange={(value) => setTempSettings({
                      ...tempSettings,
                      decimalPlaces: parseInt(value)
                    })}
                  />
                ) : (
                  <p className="font-body text-foreground">
                    {decimalOptions?.find(opt => opt?.value === settings?.decimalPlaces)?.label}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-3">
                {isEditing ? (
                  <Checkbox
                    checked={tempSettings?.showCurrencySymbol}
                    onChange={(e) => setTempSettings({
                      ...tempSettings,
                      showCurrencySymbol: e?.target?.checked
                    })}
                    label="Afficher le symbole GNF"
                  />
                ) : (
                  <>
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      settings?.showCurrencySymbol ? 'bg-primary border-primary' : 'border-border'
                    }`}>
                      {settings?.showCurrencySymbol && (
                        <Icon name="Check" size={12} className="text-primary-foreground" />
                      )}
                    </div>
                    <span className="text-sm font-body text-foreground">
                      Afficher le symbole GNF
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-heading font-medium text-foreground flex items-center space-x-2">
              <Icon name="Eye" size={18} className="text-accent" />
              <span>Aperçu</span>
            </h4>

            <div className="p-4 border border-border rounded-lg bg-muted/30">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Petit montant:</span>
                  <span className="font-data text-lg font-semibold text-foreground">
                    {formatPreview(1500, isEditing ? tempSettings : settings)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Montant moyen:</span>
                  <span className="font-data text-lg font-semibold text-foreground">
                    {formatPreview(125000, isEditing ? tempSettings : settings)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Grand montant:</span>
                  <span className="font-data text-lg font-semibold text-foreground">
                    {formatPreview(previewAmount, isEditing ? tempSettings : settings)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Icon name="Info" size={16} className="text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-body text-foreground">
                    <strong>Format recommandé pour la Guinée:</strong>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    1 000 000 GNF avec espaces comme séparateurs, conformément aux standards locaux.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Exchange Rate Information */}
        <div className="border border-border rounded-lg p-4">
          <h4 className="font-heading font-medium text-foreground mb-4 flex items-center space-x-2">
            <Icon name="TrendingUp" size={18} className="text-warning" />
            <span>Informations de Change</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 border border-border rounded-lg">
              <Icon name="DollarSign" size={24} className="text-success mx-auto mb-2" />
              <p className="font-body font-medium text-foreground">USD → GNF</p>
              <p className="text-sm text-muted-foreground">≈ 8 600 GNF</p>
              <p className="text-xs text-muted-foreground mt-1">Indicatif</p>
            </div>
            
            <div className="text-center p-3 border border-border rounded-lg">
              <Icon name="Euro" size={24} className="text-primary mx-auto mb-2" />
              <p className="font-body font-medium text-foreground">EUR → GNF</p>
              <p className="text-sm text-muted-foreground">≈ 9 200 GNF</p>
              <p className="text-xs text-muted-foreground mt-1">Indicatif</p>
            </div>
            
            <div className="text-center p-3 border border-border rounded-lg">
              <Icon name="Banknote" size={24} className="text-accent mx-auto mb-2" />
              <p className="font-body font-medium text-foreground">Inflation</p>
              <p className="text-sm text-muted-foreground">≈ 12% annuel</p>
              <p className="text-xs text-muted-foreground mt-1">Estimation 2024</p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
              <p className="text-sm text-foreground">
                <strong>Note:</strong> Les taux de change sont fournis à titre indicatif uniquement. 
                Pour les calculs officiels, référez-vous aux taux de la Banque Centrale de Guinée.
              </p>
            </div>
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

export default CurrencySettings;