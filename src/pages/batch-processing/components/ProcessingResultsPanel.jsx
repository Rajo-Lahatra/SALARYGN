import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ProcessingResultsPanel = ({ 
  results, 
  onExportResults, 
  onViewDetails, 
  onRetryErrors 
}) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const statusOptions = [
    { value: 'all', label: 'Tous les résultats' },
    { value: 'success', label: 'Réussis uniquement' },
    { value: 'error', label: 'Erreurs uniquement' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Nom' },
    { value: 'department', label: 'Département' },
    { value: 'status', label: 'Statut' },
    { value: 'netSalary', label: 'Salaire net' }
  ];

  const filteredResults = results?.filter(result => {
    if (filterStatus === 'all') return true;
    return result?.status === filterStatus;
  });

  const sortedResults = [...filteredResults]?.sort((a, b) => {
    if (sortBy === 'name') {
      return a?.employeeName?.localeCompare(b?.employeeName);
    } else if (sortBy === 'department') {
      return a?.department?.localeCompare(b?.department);
    } else if (sortBy === 'status') {
      return a?.status?.localeCompare(b?.status);
    } else if (sortBy === 'netSalary') {
      return (b?.netSalary || 0) - (a?.netSalary || 0);
    }
    return 0;
  });

  const successCount = results?.filter(r => r?.status === 'success')?.length;
  const errorCount = results?.filter(r => r?.status === 'error')?.length;
  const totalNetSalary = results?.filter(r => r?.status === 'success')?.reduce((sum, r) => sum + (r?.netSalary || 0), 0);

  const formatSalary = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0
    })?.format(amount)?.replace('GNF', 'GNF');
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (results?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Résultats du Traitement
        </h3>
        <div className="text-center py-8">
          <Icon name="FileSpreadsheet" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-body">
            Aucun résultat disponible
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Lancez un traitement pour voir les résultats ici
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Résultats du Traitement
          </h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExportResults}
              iconName="Download"
              iconPosition="left"
            >
              Exporter
            </Button>
            {errorCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetryErrors}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Réessayer Erreurs
              </Button>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-success/5 border border-success/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                <Icon name="CheckCircle" size={16} className="text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-body">Réussis</p>
                <p className="text-xl font-heading font-bold text-success">
                  {successCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-error/5 border border-error/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-error/10 rounded-lg flex items-center justify-center">
                <Icon name="XCircle" size={16} className="text-error" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-body">Erreurs</p>
                <p className="text-xl font-heading font-bold text-error">
                  {errorCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="DollarSign" size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-body">Total Net</p>
                <p className="text-lg font-data font-bold text-primary">
                  {formatSalary(totalNetSalary)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            options={statusOptions}
            value={filterStatus}
            onChange={setFilterStatus}
            placeholder="Filtrer par statut"
          />
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            placeholder="Trier par"
          />
        </div>
      </div>
      {/* Results Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-body font-medium text-muted-foreground">
                Employé
              </th>
              <th className="text-left p-4 font-body font-medium text-muted-foreground">
                Département
              </th>
              <th className="text-left p-4 font-body font-medium text-muted-foreground">
                Salaire Net
              </th>
              <th className="text-left p-4 font-body font-medium text-muted-foreground">
                Statut
              </th>
              <th className="text-left p-4 font-body font-medium text-muted-foreground">
                Date
              </th>
              <th className="text-left p-4 font-body font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedResults?.map((result) => (
              <tr 
                key={result?.employeeId}
                className="border-b border-border hover:bg-muted/30 transition-colors"
              >
                <td className="p-4">
                  <div>
                    <p className="font-body font-medium text-foreground">
                      {result?.employeeName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ID: {result?.employeeId}
                    </p>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm font-body text-foreground">
                    {result?.department}
                  </span>
                </td>
                <td className="p-4">
                  {result?.status === 'success' ? (
                    <span className="font-data font-medium text-foreground">
                      {formatSalary(result?.netSalary)}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    result?.status === 'success' ?'bg-success/10 text-success' :'bg-error/10 text-error'
                  }`}>
                    <Icon 
                      name={result?.status === 'success' ? 'CheckCircle' : 'XCircle'} 
                      size={12} 
                      className="mr-1" 
                    />
                    {result?.status === 'success' ? 'Réussi' : 'Erreur'}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-sm font-body text-foreground">
                    {formatDate(result?.processedAt)}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(result)}
                      iconName="Eye"
                      iconPosition="left"
                    >
                      Détails
                    </Button>
                    {result?.status === 'success' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Download"
                      >
                        PDF
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Error Details */}
      {errorCount > 0 && (
        <div className="p-6 border-t border-border">
          <h4 className="font-body font-medium text-foreground mb-3">
            Erreurs Détaillées
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {results?.filter(r => r?.status === 'error')?.map((result) => (
                <div key={result?.employeeId} className="bg-error/5 border border-error/20 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-body font-medium text-foreground">
                        {result?.employeeName}
                      </p>
                      <p className="text-xs text-error mt-1">
                        {result?.errorMessage}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="RefreshCw"
                    >
                      Réessayer
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessingResultsPanel;