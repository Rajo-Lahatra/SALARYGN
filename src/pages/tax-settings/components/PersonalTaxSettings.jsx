import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';


const ProfessionalTaxSettings = ({ settings, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempSettings, setTempSettings] = useState({ ...settings });
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleEdit = () => {
    setIsEditing(true);
    setTempSettings({ ...settings });
  };

  const handleSave = () => {
    onUpdate('professionalTax', tempSettings);
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

  const categoryOptions = [
    { value: 'cadre_superieur', label: 'Cadre Supérieur' },
    { value: 'cadre_moyen', label: 'Cadre Moyen' },
    { value: 'employe', label: 'Employé' },
    { value: 'ouvrier', label: 'Ouvrier' },
    { value: 'stagiaire', label: 'Stagiaire' }
  ];

  const municipalityOptions = [
    { value: 'conakry', label: 'Conakry' },
    { value: 'kankan', label: 'Kankan' },
    { value: 'labe', label: 'Labé' },
    { value: 'nzerekore', label: 'Nzérékoré' },
    { value: 'boke', label: 'Boké' },
    { value: 'mamou', label: 'Mamou' },
    { value: 'faranah', label: 'Faranah' },
    { value: 'kindia', label: 'Kindia' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Taxe Professionnelle
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Configuration des montants fixes par catégorie d'emploi et commune
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="Briefcase" size={20} className="text-secondary" />
            <span className="text-sm font-caption text-muted-foreground">
              Taxe Municipale
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
        {/* Tax Categories */}
        <div className="border border-border rounded-lg p-4">
          <h4 className="font-heading font-medium text-foreground mb-4 flex items-center space-x-2">
            <Icon name="Users" size={18} className="text-primary" />
            <span>Montants par Catégorie</span>
          </h4>

          <div className="space-y-4">
            {settings?.categories?.map((category, index) => (
              <div key={category?.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    category?.level === 'high' ? 'bg-error' :
                    category?.level === 'medium'? 'bg-warning' : 'bg-success'
                  }`}></div>
                  <div>
                    <p className="font-body font-medium text-foreground">
                      {category?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {category?.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {isEditing ? (
                    <Input
                      type="number"
                      value={tempSettings?.categories?.[index]?.amount}
                      onChange={(e) => {
                        const newCategories = [...tempSettings?.categories];
                        newCategories[index].amount = parseInt(e?.target?.value);
                        setTempSettings({
                          ...tempSettings,
                          categories: newCategories
                        });
                      }}
                      className="w-32"
                    />
                  ) : (
                    <span className="font-data text-lg font-semibold text-primary">
                      {formatCurrency(category?.amount)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Municipal Variations */}
        <div className="border border-border rounded-lg p-4">
          <h4 className="font-heading font-medium text-foreground mb-4 flex items-center space-x-2">
            <Icon name="MapPin" size={18} className="text-accent" />
            <span>Variations Municipales</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settings?.municipalVariations?.map((variation, index) => (
              <div key={variation?.municipality} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-body font-medium text-foreground">
                    {variation?.municipalityName}
                  </h5>
                  <span className={`px-2 py-1 rounded-full text-xs font-caption ${
                    variation?.multiplier > 1 ? 'bg-error/10 text-error' :
                    variation?.multiplier < 1 ? 'bg-success/10 text-success': 'bg-muted text-muted-foreground'
                  }`}>
                    {variation?.multiplier > 1 ? '+' : variation?.multiplier < 1 ? '-' : ''}
                    {Math.abs((variation?.multiplier - 1) * 100)?.toFixed(0)}%
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Multiplicateur:</span>
                    {isEditing ? (
                      <Input
                        type="number"
                        step="0.1"
                        value={tempSettings?.municipalVariations?.[index]?.multiplier}
                        onChange={(e) => {
                          const newVariations = [...tempSettings?.municipalVariations];
                          newVariations[index].multiplier = parseFloat(e?.target?.value);
                          setTempSettings({
                            ...tempSettings,
                            municipalVariations: newVariations
                          });
                        }}
                        className="w-20"
                      />
                    ) : (
                      <span className="font-data font-semibold">
                        {variation?.multiplier}x
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Exemple (Cadre Sup.):</span>
                    <span className="font-data font-semibold text-primary">
                      {formatCurrency(settings?.categories?.[0]?.amount * variation?.multiplier)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Schedule */}
        <div className="p-4 bg-muted/30 rounded-lg">
          <h4 className="font-heading font-medium text-foreground mb-4 flex items-center space-x-2">
            <Icon name="Calendar" size={18} className="text-warning" />
            <span>Calendrier de Paiement</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 border border-border rounded-lg">
              <Icon name="Clock" size={24} className="text-primary mx-auto mb-2" />
              <p className="font-body font-medium text-foreground">Fréquence</p>
              <p className="text-sm text-muted-foreground">Mensuelle</p>
            </div>
            
            <div className="text-center p-3 border border-border rounded-lg">
              <Icon name="Calendar" size={24} className="text-accent mx-auto mb-2" />
              <p className="font-body font-medium text-foreground">Échéance</p>
              <p className="text-sm text-muted-foreground">15 du mois</p>
            </div>
            
            <div className="text-center p-3 border border-border rounded-lg">
              <Icon name="AlertTriangle" size={24} className="text-warning mx-auto mb-2" />
              <p className="font-body font-medium text-foreground">Pénalité</p>
              <p className="text-sm text-muted-foreground">10% après retard</p>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={20} className="text-primary mt-0.5" />
            <div>
              <h5 className="font-body font-medium text-foreground mb-2">
                Notes Importantes
              </h5>
              <ul className="text-sm text-foreground space-y-1">
                <li>• La taxe professionnelle est calculée sur la base du salaire brut mensuel</li>
                <li>• Les montants peuvent varier selon la commune d'exercice de l'activité</li>
                <li>• Les nouveaux employés bénéficient d'une exonération de 3 mois</li>
                <li>• Les modifications prennent effet le mois suivant leur validation</li>
              </ul>
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

export default ProfessionalTaxSettings;