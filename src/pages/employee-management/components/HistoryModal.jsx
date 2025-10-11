import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const HistoryModal = ({ isOpen, onClose, employee }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  if (!employee) return null;

  const mockHistory = [
    {
      id: 1,
      date: '2024-10-01',
      type: 'Calcul Mensuel',
      grossSalary: 5000000,
      netSalary: 4125000,
      incomeTax: 625000,
      cnssContribution: 200000,
      medicalInsurance: 50000,
      status: 'Complété',
      calculatedBy: 'Admin Manager'
    },
    {
      id: 2,
      date: '2024-09-01',
      type: 'Calcul Mensuel',
      grossSalary: 5000000,
      netSalary: 4125000,
      incomeTax: 625000,
      cnssContribution: 200000,
      medicalInsurance: 50000,
      status: 'Complété',
      calculatedBy: 'Admin Manager'
    },
    {
      id: 3,
      date: '2024-08-15',
      type: 'Prime 13ème Mois',
      grossSalary: 5000000,
      netSalary: 3875000,
      incomeTax: 875000,
      cnssContribution: 200000,
      medicalInsurance: 50000,
      status: 'Complété',
      calculatedBy: 'HR Manager'
    },
    {
      id: 4,
      date: '2024-08-01',
      type: 'Calcul Mensuel',
      grossSalary: 5000000,
      netSalary: 4125000,
      incomeTax: 625000,
      cnssContribution: 200000,
      medicalInsurance: 50000,
      status: 'Complété',
      calculatedBy: 'Admin Manager'
    },
    {
      id: 5,
      date: '2024-07-01',
      type: 'Heures Supplémentaires',
      grossSalary: 5500000,
      netSalary: 4537500,
      incomeTax: 687500,
      cnssContribution: 220000,
      medicalInsurance: 55000,
      status: 'Complété',
      calculatedBy: 'Admin Manager'
    }
  ];

  const periodOptions = [
    { value: 'all', label: 'Toute la période' },
    { value: '3months', label: '3 derniers mois' },
    { value: '6months', label: '6 derniers mois' },
    { value: '1year', label: 'Dernière année' }
  ];

  const typeOptions = [
    { value: 'all', label: 'Tous les types' },
    { value: 'Calcul Mensuel', label: 'Calculs mensuels' },
    { value: 'Prime 13ème Mois', label: 'Primes 13ème mois' },
    { value: 'Heures Supplémentaires', label: 'Heures supplémentaires' },
    { value: 'Bonus', label: 'Bonus' }
  ];

  const filteredHistory = mockHistory?.filter(item => {
    const typeMatch = selectedType === 'all' || item?.type === selectedType;
    
    let periodMatch = true;
    if (selectedPeriod !== 'all') {
      const itemDate = new Date(item.date);
      const now = new Date();
      const monthsBack = selectedPeriod === '3months' ? 3 : selectedPeriod === '6months' ? 6 : 12;
      const cutoffDate = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1);
      periodMatch = itemDate >= cutoffDate;
    }
    
    return typeMatch && periodMatch;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-GN', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0
    })?.format(amount);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Calcul Mensuel': return 'Calendar';
      case 'Prime 13ème Mois': return 'Gift';
      case 'Heures Supplémentaires': return 'Clock';
      case 'Bonus': return 'Award';
      default: return 'Calculator';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Calcul Mensuel': return 'text-primary';
      case 'Prime 13ème Mois': return 'text-success';
      case 'Heures Supplémentaires': return 'text-warning';
      case 'Bonus': return 'text-accent';
      default: return 'text-secondary';
    }
  };

  const totalGross = filteredHistory?.reduce((sum, item) => sum + item?.grossSalary, 0);
  const totalNet = filteredHistory?.reduce((sum, item) => sum + item?.netSalary, 0);
  const totalTax = filteredHistory?.reduce((sum, item) => sum + item?.incomeTax, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="History" size={20} className="text-accent" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-lg text-foreground">
                Historique des Calculs
              </h2>
              <p className="text-sm text-muted-foreground">
                {employee?.name} - {employee?.position}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-border bg-muted/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Select
              label="Période"
              options={periodOptions}
              value={selectedPeriod}
              onChange={setSelectedPeriod}
            />
            <Select
              label="Type de Calcul"
              options={typeOptions}
              value={selectedType}
              onChange={setSelectedType}
            />
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card rounded-lg p-4 border border-border">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="TrendingUp" size={16} className="text-primary" />
                <span className="text-sm text-muted-foreground">Total Brut</span>
              </div>
              <p className="font-heading font-semibold text-lg text-foreground">
                {formatCurrency(totalGross)}
              </p>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="DollarSign" size={16} className="text-success" />
                <span className="text-sm text-muted-foreground">Total Net</span>
              </div>
              <p className="font-heading font-semibold text-lg text-foreground">
                {formatCurrency(totalNet)}
              </p>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Receipt" size={16} className="text-error" />
                <span className="text-sm text-muted-foreground">Total Impôts</span>
              </div>
              <p className="font-heading font-semibold text-lg text-foreground">
                {formatCurrency(totalTax)}
              </p>
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="overflow-y-auto max-h-[calc(90vh-300px)]">
          {filteredHistory?.length === 0 ? (
            <div className="p-8 text-center">
              <Icon name="FileX" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="font-heading font-medium text-foreground mb-2">
                Aucun historique trouvé
              </h3>
              <p className="text-muted-foreground">
                Aucun calcul ne correspond aux filtres sélectionnés.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredHistory?.map((item) => (
                <div key={item?.id} className="p-6 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-muted rounded-lg flex items-center justify-center`}>
                        <Icon name={getTypeIcon(item?.type)} size={20} className={getTypeColor(item?.type)} />
                      </div>
                      <div>
                        <h4 className="font-heading font-medium text-foreground">{item?.type}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(item.date)?.toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-success/10 text-success">
                        <Icon name="CheckCircle" size={12} className="mr-1" />
                        {item?.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Salaire Brut</p>
                      <p className="font-heading font-medium text-foreground">
                        {formatCurrency(item?.grossSalary)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Salaire Net</p>
                      <p className="font-heading font-medium text-success">
                        {formatCurrency(item?.netSalary)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Impôt sur Revenu</p>
                      <p className="font-heading font-medium text-error">
                        {formatCurrency(item?.incomeTax)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">CNSS</p>
                      <p className="font-heading font-medium text-warning">
                        {formatCurrency(item?.cnssContribution)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Calculé par: {item?.calculatedBy}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Icon name="Download" size={14} className="mr-1" />
                        Télécharger
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Icon name="Eye" size={14} className="mr-1" />
                        Détails
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <p className="text-sm text-muted-foreground">
            {filteredHistory?.length} calcul{filteredHistory?.length !== 1 ? 's' : ''} trouvé{filteredHistory?.length !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" iconName="Download" iconPosition="left">
              Exporter Tout
            </Button>
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;