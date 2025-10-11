import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentCalculationsTable = () => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  const recentCalculations = [
    {
      id: 1,
      employeeName: "Mamadou Diallo",
      employeeId: "EMP001",
      calculationDate: "2025-10-09",
      grossSalary: 2500000,
      netSalary: 2125000,
      status: "completed",
      taxAmount: 375000
    },
    {
      id: 2,
      employeeName: "Fatoumata Camara",
      employeeId: "EMP002",
      calculationDate: "2025-10-09",
      grossSalary: 1800000,
      netSalary: 1575000,
      status: "completed",
      taxAmount: 225000
    },
    {
      id: 3,
      employeeName: "Alpha Condé",
      employeeId: "EMP003",
      calculationDate: "2025-10-08",
      grossSalary: 3200000,
      netSalary: 2640000,
      status: "pending",
      taxAmount: 560000
    },
    {
      id: 4,
      employeeName: "Aissatou Barry",
      employeeId: "EMP004",
      calculationDate: "2025-10-08",
      grossSalary: 2100000,
      netSalary: 1827000,
      status: "completed",
      taxAmount: 273000
    },
    {
      id: 5,
      employeeName: "Ibrahima Sow",
      employeeId: "EMP005",
      calculationDate: "2025-10-07",
      grossSalary: 2800000,
      netSalary: 2352000,
      status: "error",
      taxAmount: 448000
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-GN', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0
    })?.format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'text-success bg-success/10', label: 'Terminé', icon: 'CheckCircle' },
      pending: { color: 'text-warning bg-warning/10', label: 'En attente', icon: 'Clock' },
      error: { color: 'text-error bg-error/10', label: 'Erreur', icon: 'XCircle' }
    };

    const config = statusConfig?.[status];
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} />
        <span>{config?.label}</span>
      </span>
    );
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCalculations = [...recentCalculations]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];

    if (sortField === 'calculationDate') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const SortableHeader = ({ field, children }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <Icon 
          name={sortField === field ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
          size={14} 
        />
      </div>
    </th>
  );

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-heading font-semibold text-foreground">
          Calculs Récents
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/employee-management')}
          iconName="Eye"
          iconPosition="left"
        >
          Voir tout
        </Button>
      </div>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <SortableHeader field="employeeName">Employé</SortableHeader>
              <SortableHeader field="calculationDate">Date</SortableHeader>
              <SortableHeader field="grossSalary">Salaire Brut</SortableHeader>
              <SortableHeader field="netSalary">Salaire Net</SortableHeader>
              <SortableHeader field="status">Statut</SortableHeader>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {sortedCalculations?.map((calculation) => (
              <tr key={calculation?.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {calculation?.employeeName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {calculation?.employeeId}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {new Date(calculation.calculationDate)?.toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-data text-foreground">
                  {formatCurrency(calculation?.grossSalary)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-data text-foreground">
                  {formatCurrency(calculation?.netSalary)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(calculation?.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/employee-tax-calculator?id=${calculation?.employeeId}`)}
                    iconName="Eye"
                  >
                    Voir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-border">
        {sortedCalculations?.map((calculation) => (
          <div key={calculation?.id} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">
                  {calculation?.employeeName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {calculation?.employeeId}
                </p>
              </div>
              {getStatusBadge(calculation?.status)}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Date</p>
                <p className="font-medium text-foreground">
                  {new Date(calculation.calculationDate)?.toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Salaire Brut</p>
                <p className="font-data font-medium text-foreground">
                  {formatCurrency(calculation?.grossSalary)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Salaire Net</p>
                <p className="font-data font-medium text-foreground">
                  {formatCurrency(calculation?.netSalary)}
                </p>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/employee-tax-calculator?id=${calculation?.employeeId}`)}
                  iconName="Eye"
                >
                  Voir
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentCalculationsTable;