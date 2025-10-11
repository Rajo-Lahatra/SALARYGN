import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TaxBracketSettings = ({ brackets, onUpdate }) => {
  const [editingBracket, setEditingBracket] = useState(null);
  const [tempBracket, setTempBracket] = useState({});

  const handleEdit = (bracket) => {
    setEditingBracket(bracket?.id);
    setTempBracket({ ...bracket });
  };

  const handleSave = () => {
    onUpdate('taxBrackets', brackets?.map(b => 
      b?.id === editingBracket ? tempBracket : b
    ));
    setEditingBracket(null);
    setTempBracket({});
  };

  const handleCancel = () => {
    setEditingBracket(null);
    setTempBracket({});
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
            Tranches d'Impôt sur le Revenu
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Configuration des taux d'imposition selon les tranches de revenus
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Calculator" size={20} className="text-primary" />
          <span className="text-sm font-caption text-muted-foreground">
            Dernière mise à jour: 15/09/2024
          </span>
        </div>
      </div>
      <div className="space-y-4">
        {brackets?.map((bracket) => (
          <div
            key={bracket?.id}
            className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-caption text-muted-foreground">
                    Tranche
                  </label>
                  <p className="font-body font-medium text-foreground">
                    {bracket?.name}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-caption text-muted-foreground">
                    Seuil Minimum
                  </label>
                  {editingBracket === bracket?.id ? (
                    <Input
                      type="number"
                      value={tempBracket?.minAmount}
                      onChange={(e) => setTempBracket({
                        ...tempBracket,
                        minAmount: parseInt(e?.target?.value)
                      })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-data text-foreground">
                      {formatCurrency(bracket?.minAmount)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-caption text-muted-foreground">
                    Seuil Maximum
                  </label>
                  {editingBracket === bracket?.id ? (
                    <Input
                      type="number"
                      value={tempBracket?.maxAmount}
                      onChange={(e) => setTempBracket({
                        ...tempBracket,
                        maxAmount: parseInt(e?.target?.value)
                      })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-data text-foreground">
                      {bracket?.maxAmount ? formatCurrency(bracket?.maxAmount) : 'Illimité'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-caption text-muted-foreground">
                    Taux d'Imposition
                  </label>
                  {editingBracket === bracket?.id ? (
                    <Input
                      type="number"
                      value={tempBracket?.rate}
                      onChange={(e) => setTempBracket({
                        ...tempBracket,
                        rate: parseFloat(e?.target?.value)
                      })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-data text-primary font-semibold">
                      {bracket?.rate}%
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                {editingBracket === bracket?.id ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                    >
                      Annuler
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleSave}
                    >
                      Sauvegarder
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(bracket)}
                  >
                    <Icon name="Edit" size={16} />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} className="text-primary mt-0.5" />
          <div>
            <p className="text-sm font-body text-foreground">
              <strong>Note importante:</strong> Les modifications des tranches d'imposition 
              prendront effet pour tous les nouveaux calculs. Les calculs existants ne seront 
              pas affectés automatiquement.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Conformément au Code Général des Impôts de la République de Guinée
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxBracketSettings;