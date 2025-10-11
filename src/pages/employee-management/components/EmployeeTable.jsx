import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { useNavigate } from 'react-router-dom';

const EmployeeTable = ({ employees, onEdit, onViewHistory, selectedEmployees, onSelectionChange }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const sortedAndFilteredEmployees = useMemo(() => {
    let filtered = employees?.filter(employee =>
      employee?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      employee?.position?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      employee?.department?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );

    if (sortConfig?.key) {
      filtered?.sort((a, b) => {
        if (a?.[sortConfig?.key] < b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (a?.[sortConfig?.key] > b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [employees, sortConfig, searchTerm]);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig?.key === key && prevConfig?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(sortedAndFilteredEmployees?.map(emp => emp?.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectEmployee = (employeeId, checked) => {
    if (checked) {
      onSelectionChange([...selectedEmployees, employeeId]);
    } else {
      onSelectionChange(selectedEmployees?.filter(id => id !== employeeId));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Actif': { bg: 'bg-success/10', text: 'text-success', icon: 'CheckCircle' },
      'Inactif': { bg: 'bg-error/10', text: 'text-error', icon: 'XCircle' },
      'Congé': { bg: 'bg-warning/10', text: 'text-warning', icon: 'Clock' },
      'Suspendu': { bg: 'bg-secondary/10', text: 'text-secondary', icon: 'Pause' }
    };

    const config = statusConfig?.[status] || statusConfig?.['Actif'];

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.bg} ${config?.text}`}>
        <Icon name={config?.icon} size={12} className="mr-1" />
        {status}
      </span>
    );
  };

  const getSortIcon = (key) => {
    if (sortConfig?.key !== key) {
      return <Icon name="ArrowUpDown" size={14} className="text-muted-foreground" />;
    }
    return sortConfig?.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-primary" />
      : <Icon name="ArrowDown" size={14} className="text-primary" />;
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Search Bar */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Input
            type="search"
            placeholder="Rechercher par nom, poste ou département..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="pl-10"
          />
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedEmployees?.length === sortedAndFilteredEmployees?.length && sortedAndFilteredEmployees?.length > 0}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                  className="rounded border-border"
                />
              </th>
              <th className="text-left px-4 py-3 font-medium text-foreground">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 hover:text-primary transition-colors"
                >
                  <span>Nom</span>
                  {getSortIcon('name')}
                </button>
              </th>
              <th className="text-left px-4 py-3 font-medium text-foreground">
                <button
                  onClick={() => handleSort('department')}
                  className="flex items-center space-x-1 hover:text-primary transition-colors"
                >
                  <span>Département</span>
                  {getSortIcon('department')}
                </button>
              </th>
              <th className="text-left px-4 py-3 font-medium text-foreground">
                <button
                  onClick={() => handleSort('position')}
                  className="flex items-center space-x-1 hover:text-primary transition-colors"
                >
                  <span>Poste</span>
                  {getSortIcon('position')}
                </button>
              </th>
              <th className="text-left px-4 py-3 font-medium text-foreground">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 hover:text-primary transition-colors"
                >
                  <span>Statut</span>
                  {getSortIcon('status')}
                </button>
              </th>
              <th className="text-left px-4 py-3 font-medium text-foreground">
                <button
                  onClick={() => handleSort('lastCalculation')}
                  className="flex items-center space-x-1 hover:text-primary transition-colors"
                >
                  <span>Dernier Calcul</span>
                  {getSortIcon('lastCalculation')}
                </button>
              </th>
              <th className="text-right px-4 py-3 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredEmployees?.map((employee) => (
              <tr key={employee?.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedEmployees?.includes(employee?.id)}
                    onChange={(e) => handleSelectEmployee(employee?.id, e?.target?.checked)}
                    className="rounded border-border"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {employee?.name?.split(' ')?.map(n => n?.[0])?.join('')?.slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{employee?.name}</p>
                      <p className="text-sm text-muted-foreground">{employee?.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-foreground">{employee?.department}</td>
                <td className="px-4 py-3 text-foreground">{employee?.position}</td>
                <td className="px-4 py-3">{getStatusBadge(employee?.status)}</td>
                <td className="px-4 py-3 text-muted-foreground">{employee?.lastCalculation}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/employee-tax-calculator', { state: { employee } })}
                      title="Calculer les taxes"
                    >
                      <Icon name="Calculator" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewHistory(employee)}
                      title="Voir l'historique"
                    >
                      <Icon name="History" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(employee)}
                      title="Modifier"
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden">
        {sortedAndFilteredEmployees?.map((employee) => (
          <div key={employee?.id} className="p-4 border-b border-border last:border-b-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedEmployees?.includes(employee?.id)}
                  onChange={(e) => handleSelectEmployee(employee?.id, e?.target?.checked)}
                  className="rounded border-border"
                />
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {employee?.name?.split(' ')?.map(n => n?.[0])?.join('')?.slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{employee?.name}</p>
                  <p className="text-sm text-muted-foreground">{employee?.email}</p>
                </div>
              </div>
              {getStatusBadge(employee?.status)}
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
              <div>
                <p className="text-muted-foreground">Département</p>
                <p className="font-medium text-foreground">{employee?.department}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Poste</p>
                <p className="font-medium text-foreground">{employee?.position}</p>
              </div>
            </div>
            
            <div className="mb-3 text-sm">
              <p className="text-muted-foreground">Dernier calcul</p>
              <p className="font-medium text-foreground">{employee?.lastCalculation}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/employee-tax-calculator', { state: { employee } })}
                iconName="Calculator"
                iconPosition="left"
                className="flex-1"
              >
                Calculer
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewHistory(employee)}
                title="Historique"
              >
                <Icon name="History" size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(employee)}
                title="Modifier"
              >
                <Icon name="Edit" size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
      {/* Empty State */}
      {sortedAndFilteredEmployees?.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="font-heading font-medium text-foreground mb-2">
            Aucun employé trouvé
          </h3>
          <p className="text-muted-foreground">
            {searchTerm ? 'Aucun résultat pour votre recherche.' : 'Commencez par ajouter des employés.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;