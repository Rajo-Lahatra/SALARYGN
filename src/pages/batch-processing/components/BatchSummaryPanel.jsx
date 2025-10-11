import React from 'react';
import Icon from '../../../components/AppIcon';

const BatchSummaryPanel = ({ selectedEmployees, employees }) => {
  const selectedEmployeeData = employees?.filter(emp => selectedEmployees?.includes(emp?.id));
  
  const totalGrossSalary = selectedEmployeeData?.reduce((sum, emp) => sum + emp?.grossSalary, 0);
  const averageSalary = selectedEmployeeData?.length > 0 ? totalGrossSalary / selectedEmployeeData?.length : 0;
  
  // Estimated processing time (2 seconds per employee)
  const estimatedTime = selectedEmployeeData?.length * 2;
  const timeMinutes = Math.floor(estimatedTime / 60);
  const timeSeconds = estimatedTime % 60;

  const formatSalary = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0
    })?.format(amount)?.replace('GNF', 'GNF');
  };

  const formatTime = (minutes, seconds) => {
    if (minutes > 0) {
      return `${minutes}min ${seconds}s`;
    }
    return `${seconds}s`;
  };

  const departmentBreakdown = selectedEmployeeData?.reduce((acc, emp) => {
    acc[emp.department] = (acc?.[emp?.department] || 0) + 1;
    return acc;
  }, {});

  const getDepartmentLabel = (dept) => {
    const labels = {
      'rh': 'RH',
      'finance': 'Finance',
      'it': 'IT',
      'marketing': 'Marketing',
      'operations': 'Opérations',
      'ventes': 'Ventes'
    };
    return labels?.[dept] || dept;
  };

  if (selectedEmployees?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Résumé du Lot
        </h3>
        <div className="text-center py-8">
          <Icon name="FileSpreadsheet" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-body">
            Sélectionnez des employés pour voir le résumé
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
        Résumé du Lot
      </h3>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Users" size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-body">Employés sélectionnés</p>
              <p className="text-2xl font-heading font-bold text-foreground">
                {selectedEmployees?.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="Clock" size={20} className="text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-body">Temps estimé</p>
              <p className="text-2xl font-heading font-bold text-foreground">
                {formatTime(timeMinutes, timeSeconds)}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Financial Summary */}
      <div className="space-y-4 mb-6">
        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="font-body font-medium text-foreground mb-3">Résumé Financier</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground font-body">Total Salaire Brut:</span>
              <span className="font-data font-semibold text-foreground">
                {formatSalary(totalGrossSalary)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground font-body">Salaire Moyen:</span>
              <span className="font-data font-semibold text-foreground">
                {formatSalary(averageSalary)}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Department Breakdown */}
      <div className="space-y-4">
        <h4 className="font-body font-medium text-foreground">Répartition par Département</h4>
        <div className="space-y-2">
          {Object.entries(departmentBreakdown)?.map(([dept, count]) => (
            <div key={dept} className="flex items-center justify-between py-2">
              <span className="text-sm font-body text-foreground">
                {getDepartmentLabel(dept)}
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(count / selectedEmployees?.length) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-data font-medium text-foreground w-8 text-right">
                  {count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Processing Info */}
      <div className="mt-6 p-4 bg-warning/5 border border-warning/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} className="text-warning mt-0.5" />
          <div>
            <p className="text-sm font-body font-medium text-foreground">
              Information de Traitement
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Le calcul sera effectué selon les paramètres fiscaux actuels. 
              Assurez-vous que tous les paramètres sont à jour avant de commencer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchSummaryPanel;