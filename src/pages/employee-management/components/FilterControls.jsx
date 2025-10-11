import React from 'react';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FilterControls = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  employeeCount,
  selectedCount,
  onBulkAction 
}) => {
  const departmentOptions = [
    { value: '', label: 'Tous les départements' },
    { value: 'Ressources Humaines', label: 'Ressources Humaines' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Informatique', label: 'Informatique' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Ventes', label: 'Ventes' },
    { value: 'Production', label: 'Production' },
    { value: 'Administration', label: 'Administration' }
  ];

  const employmentTypeOptions = [
    { value: '', label: 'Tous les types' },
    { value: 'CDI', label: 'CDI (Contrat à Durée Indéterminée)' },
    { value: 'CDD', label: 'CDD (Contrat à Durée Déterminée)' },
    { value: 'Stage', label: 'Stage' },
    { value: 'Consultant', label: 'Consultant' },
    { value: 'Freelance', label: 'Freelance' }
  ];

  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'Actif', label: 'Actif' },
    { value: 'Inactif', label: 'Inactif' },
    { value: 'Congé', label: 'En congé' },
    { value: 'Suspendu', label: 'Suspendu' }
  ];

  const bulkActionOptions = [
    { value: '', label: 'Actions en lot', disabled: true },
    { value: 'calculate', label: 'Calculer les taxes' },
    { value: 'export', label: 'Exporter les données' },
    { value: 'activate', label: 'Activer les employés' },
    { value: 'deactivate', label: 'Désactiver les employés' },
    { value: 'delete', label: 'Supprimer les employés' }
  ];

  const hasActiveFilters = filters?.department || filters?.employmentType || filters?.status;

  return (
    <div className="bg-card rounded-lg border border-border p-4 mb-6">
      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        <Select
          placeholder="Filtrer par département"
          options={departmentOptions}
          value={filters?.department}
          onChange={(value) => onFilterChange('department', value)}
          className="w-full"
        />
        
        <Select
          placeholder="Type d'emploi"
          options={employmentTypeOptions}
          value={filters?.employmentType}
          onChange={(value) => onFilterChange('employmentType', value)}
          className="w-full"
        />
        
        <Select
          placeholder="Statut"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => onFilterChange('status', value)}
          className="w-full"
        />

        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
            >
              Effacer
            </Button>
          )}
        </div>
      </div>
      {/* Stats and Bulk Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Employee Count */}
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span className="flex items-center space-x-1">
            <Icon name="Users" size={16} />
            <span>{employeeCount} employé{employeeCount !== 1 ? 's' : ''}</span>
          </span>
          
          {selectedCount > 0 && (
            <span className="flex items-center space-x-1 text-primary">
              <Icon name="CheckSquare" size={16} />
              <span>{selectedCount} sélectionné{selectedCount !== 1 ? 's' : ''}</span>
            </span>
          )}

          {hasActiveFilters && (
            <span className="flex items-center space-x-1 text-accent">
              <Icon name="Filter" size={16} />
              <span>Filtres actifs</span>
            </span>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedCount > 0 && (
          <div className="flex items-center space-x-2">
            <Select
              placeholder="Actions en lot"
              options={bulkActionOptions}
              value=""
              onChange={(value) => {
                if (value) {
                  onBulkAction(value);
                }
              }}
              className="min-w-48"
            />
          </div>
        )}
      </div>
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Filtres actifs:</span>
            
            {filters?.department && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                Département: {filters?.department}
                <button
                  onClick={() => onFilterChange('department', '')}
                  className="ml-1 hover:text-primary/80"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {filters?.employmentType && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-accent/10 text-accent">
                Type: {filters?.employmentType}
                <button
                  onClick={() => onFilterChange('employmentType', '')}
                  className="ml-1 hover:text-accent/80"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {filters?.status && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary/10 text-secondary">
                Statut: {filters?.status}
                <button
                  onClick={() => onFilterChange('status', '')}
                  className="ml-1 hover:text-secondary/80"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterControls;