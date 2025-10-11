import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const EmployeeSelectionPanel = ({ 
  employees, 
  selectedEmployees, 
  onSelectionChange, 
  onSelectAll, 
  onClearAll 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const departmentOptions = [
    { value: '', label: 'Tous les départements' },
    { value: 'rh', label: 'Ressources Humaines' },
    { value: 'finance', label: 'Finance' },
    { value: 'it', label: 'Informatique' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'operations', label: 'Opérations' },
    { value: 'ventes', label: 'Ventes' }
  ];

  const employmentTypeOptions = [
    { value: '', label: 'Tous les types' },
    { value: 'cdi', label: 'CDI' },
    { value: 'cdd', label: 'CDD' },
    { value: 'stage', label: 'Stage' },
    { value: 'consultant', label: 'Consultant' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Nom' },
    { value: 'department', label: 'Département' },
    { value: 'grossSalary', label: 'Salaire brut' },
    { value: 'lastCalculation', label: 'Dernière calcul' }
  ];

  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = employees?.filter(employee => {
      const matchesSearch = employee?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           employee?.employeeId?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      const matchesDepartment = !departmentFilter || employee?.department === departmentFilter;
      const matchesEmploymentType = !employmentTypeFilter || employee?.employmentType === employmentTypeFilter;
      
      return matchesSearch && matchesDepartment && matchesEmploymentType;
    });

    filtered?.sort((a, b) => {
      let aValue = a?.[sortBy];
      let bValue = b?.[sortBy];
      
      if (sortBy === 'grossSalary') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else if (sortBy === 'lastCalculation') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else {
        aValue = aValue?.toString()?.toLowerCase();
        bValue = bValue?.toString()?.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [employees, searchTerm, departmentFilter, employmentTypeFilter, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const formatSalary = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0
    })?.format(amount)?.replace('GNF', 'GNF');
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('fr-FR');
  };

  const getDepartmentLabel = (dept) => {
    const option = departmentOptions?.find(opt => opt?.value === dept);
    return option ? option?.label : dept;
  };

  const getEmploymentTypeLabel = (type) => {
    const option = employmentTypeOptions?.find(opt => opt?.value === type);
    return option ? option?.label : type;
  };

  const isAllSelected = filteredAndSortedEmployees?.length > 0 && 
    filteredAndSortedEmployees?.every(emp => selectedEmployees?.includes(emp?.id));

  const isSomeSelected = selectedEmployees?.length > 0 && !isAllSelected;

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-semibold text-foreground">
            Sélection des Employés
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onSelectAll}
              disabled={filteredAndSortedEmployees?.length === 0}
            >
              Sélectionner Tout
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              disabled={selectedEmployees?.length === 0}
            >
              Désélectionner
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            type="search"
            placeholder="Rechercher par nom ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="w-full"
          />
          
          <Select
            placeholder="Département"
            options={departmentOptions}
            value={departmentFilter}
            onChange={setDepartmentFilter}
          />
          
          <Select
            placeholder="Type d'emploi"
            options={employmentTypeOptions}
            value={employmentTypeFilter}
            onChange={setEmploymentTypeFilter}
          />
          
          <Select
            placeholder="Trier par"
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
          />
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-12 p-4">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isSomeSelected}
                  onChange={(e) => {
                    if (e?.target?.checked) {
                      onSelectAll();
                    } else {
                      onClearAll();
                    }
                  }}
                />
              </th>
              <th 
                className="text-left p-4 font-body font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Employé</span>
                  {sortBy === 'name' && (
                    <Icon 
                      name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                      size={16} 
                    />
                  )}
                </div>
              </th>
              <th 
                className="text-left p-4 font-body font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort('department')}
              >
                <div className="flex items-center space-x-1">
                  <span>Département</span>
                  {sortBy === 'department' && (
                    <Icon 
                      name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                      size={16} 
                    />
                  )}
                </div>
              </th>
              <th 
                className="text-left p-4 font-body font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort('grossSalary')}
              >
                <div className="flex items-center space-x-1">
                  <span>Salaire Brut</span>
                  {sortBy === 'grossSalary' && (
                    <Icon 
                      name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                      size={16} 
                    />
                  )}
                </div>
              </th>
              <th 
                className="text-left p-4 font-body font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort('lastCalculation')}
              >
                <div className="flex items-center space-x-1">
                  <span>Dernier Calcul</span>
                  {sortBy === 'lastCalculation' && (
                    <Icon 
                      name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                      size={16} 
                    />
                  )}
                </div>
              </th>
              <th className="text-left p-4 font-body font-medium text-muted-foreground">
                Statut
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedEmployees?.map((employee) => (
              <tr 
                key={employee?.id}
                className="border-b border-border hover:bg-muted/30 transition-colors"
              >
                <td className="p-4">
                  <Checkbox
                    checked={selectedEmployees?.includes(employee?.id)}
                    onChange={(e) => onSelectionChange(employee?.id, e?.target?.checked)}
                  />
                </td>
                <td className="p-4">
                  <div>
                    <p className="font-body font-medium text-foreground">
                      {employee?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ID: {employee?.employeeId}
                    </p>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm font-body text-foreground">
                    {getDepartmentLabel(employee?.department)}
                  </span>
                </td>
                <td className="p-4">
                  <span className="font-data font-medium text-foreground">
                    {formatSalary(employee?.grossSalary)}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-sm font-body text-foreground">
                    {formatDate(employee?.lastCalculation)}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    employee?.status === 'active' ?'bg-success/10 text-success' 
                      : employee?.status === 'inactive' ?'bg-muted text-muted-foreground' :'bg-warning/10 text-warning'
                  }`}>
                    {employee?.status === 'active' ? 'Actif' : 
                     employee?.status === 'inactive' ? 'Inactif' : 'En attente'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAndSortedEmployees?.length === 0 && (
          <div className="p-8 text-center">
            <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-body">
              Aucun employé trouvé avec les critères sélectionnés
            </p>
          </div>
        )}
      </div>
      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/20">
        <p className="text-sm text-muted-foreground font-body">
          {filteredAndSortedEmployees?.length} employé(s) affiché(s) • {selectedEmployees?.length} sélectionné(s)
        </p>
      </div>
    </div>
  );
};

export default EmployeeSelectionPanel;