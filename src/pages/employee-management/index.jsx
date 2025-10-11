import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import QuickActionFAB from '../../components/ui/QuickActionFAB';
import Button from '../../components/ui/Button';


// Import components
import EmployeeTable from './components/EmployeeTable';
import FilterControls from './components/FilterControls';
import EmployeeStats from './components/EmployeeStats';
import EmployeeModal from './components/EmployeeModal';
import HistoryModal from './components/HistoryModal';

const EmployeeManagement = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalMode, setModalMode] = useState('add');

  // Mock employee data
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Mamadou Diallo",
      email: "mamadou.diallo@entreprise.gn",
      phone: "+224 622 123 456",
      department: "Informatique",
      position: "Développeur Senior",
      employmentType: "CDI",
      status: "Actif",
      salary: 5000000,
      startDate: "2023-01-15",
      lastCalculation: "01/10/2024",
      lastCalculationDate: "2024-10-01",
      address: "Kaloum, Conakry",
      socialSecurityNumber: "CNSS-123456789",
      taxId: "NIF-987654321"
    },
    {
      id: 2,
      name: "Fatoumata Camara",
      email: "fatoumata.camara@entreprise.gn",
      phone: "+224 664 789 012",
      department: "Ressources Humaines",
      position: "Responsable RH",
      employmentType: "CDI",
      status: "Actif",
      salary: 4500000,
      startDate: "2022-03-10",
      lastCalculation: "28/09/2024",
      lastCalculationDate: "2024-09-28",
      address: "Matam, Conakry",
      socialSecurityNumber: "CNSS-234567890",
      taxId: "NIF-876543210"
    },
    {
      id: 3,
      name: "Alpha Condé",
      email: "alpha.conde@entreprise.gn",
      phone: "+224 655 345 678",
      department: "Finance",
      position: "Comptable",
      employmentType: "CDD",
      status: "Congé",
      salary: 3500000,
      startDate: "2023-06-01",
      lastCalculation: "15/09/2024",
      lastCalculationDate: "2024-09-15",
      address: "Dixinn, Conakry",
      socialSecurityNumber: "CNSS-345678901",
      taxId: "NIF-765432109"
    },
    {
      id: 4,
      name: "Mariama Bah",
      email: "mariama.bah@entreprise.gn",
      phone: "+224 666 901 234",
      department: "Marketing",
      position: "Chef de Projet",
      employmentType: "CDI",
      status: "Actif",
      salary: 4000000,
      startDate: "2022-11-20",
      lastCalculation: "30/09/2024",
      lastCalculationDate: "2024-09-30",
      address: "Ratoma, Conakry",
      socialSecurityNumber: "CNSS-456789012",
      taxId: "NIF-654321098"
    },
    {
      id: 5,
      name: "Ibrahima Sow",
      email: "ibrahima.sow@entreprise.gn",
      phone: "+224 677 567 890",
      department: "Ventes",
      position: "Commercial Senior",
      employmentType: "CDI",
      status: "Actif",
      salary: 3800000,
      startDate: "2023-02-14",
      lastCalculation: "02/10/2024",
      lastCalculationDate: "2024-10-02",
      address: "Lambandji, Conakry",
      socialSecurityNumber: "CNSS-567890123",
      taxId: "NIF-543210987"
    },
    {
      id: 6,
      name: "Aminata Touré",
      email: "aminata.toure@entreprise.gn",
      phone: "+224 688 123 456",
      department: "Production",
      position: "Superviseur",
      employmentType: "CDI",
      status: "Inactif",
      salary: 3200000,
      startDate: "2021-08-30",
      lastCalculation: "20/08/2024",
      lastCalculationDate: "2024-08-20",
      address: "Hamdallaye, Conakry",
      socialSecurityNumber: "CNSS-678901234",
      taxId: "NIF-432109876"
    },
    {
      id: 7,
      name: "Ousmane Barry",
      email: "ousmane.barry@entreprise.gn",
      phone: "+224 699 789 012",
      department: "Administration",
      position: "Assistant Administratif",
      employmentType: "Stage",
      status: "Actif",
      salary: 1500000,
      startDate: "2024-07-01",
      lastCalculation: "01/10/2024",
      lastCalculationDate: "2024-10-01",
      address: "Kipé, Conakry",
      socialSecurityNumber: "CNSS-789012345",
      taxId: "NIF-321098765"
    },
    {
      id: 8,
      name: "Kadiatou Diané",
      email: "kadiatou.diane@entreprise.gn",
      phone: "+224 610 345 678",
      department: "Finance",
      position: "Analyste Financier",
      employmentType: "CDI",
      status: "Suspendu",
      salary: 4200000,
      startDate: "2022-05-15",
      lastCalculation: "10/09/2024",
      lastCalculationDate: "2024-09-10",
      address: "Koloma, Conakry",
      socialSecurityNumber: "CNSS-890123456",
      taxId: "NIF-210987654"
    }
  ]);

  // Filter state
  const [filters, setFilters] = useState({
    department: '',
    employmentType: '',
    status: ''
  });

  // Filter employees based on current filters
  const filteredEmployees = useMemo(() => {
    return employees?.filter(employee => {
      const departmentMatch = !filters?.department || employee?.department === filters?.department;
      const typeMatch = !filters?.employmentType || employee?.employmentType === filters?.employmentType;
      const statusMatch = !filters?.status || employee?.status === filters?.status;
      
      return departmentMatch && typeMatch && statusMatch;
    });
  }, [employees, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      department: '',
      employmentType: '',
      status: ''
    });
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setModalMode('add');
    setIsEmployeeModalOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setModalMode('edit');
    setIsEmployeeModalOpen(true);
  };

  const handleViewHistory = (employee) => {
    setSelectedEmployee(employee);
    setIsHistoryModalOpen(true);
  };

  const handleSaveEmployee = (employeeData) => {
    if (modalMode === 'add') {
      setEmployees(prev => [...prev, {
        ...employeeData,
        id: Date.now(),
        lastCalculation: 'Jamais',
        lastCalculationDate: null
      }]);
    } else {
      setEmployees(prev => prev?.map(emp => 
        emp?.id === employeeData?.id ? employeeData : emp
      ));
    }
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case 'calculate': navigate('/batch-processing', { 
          state: { 
            selectedEmployees: employees?.filter(emp => selectedEmployees?.includes(emp?.id))
          }
        });
        break;
      case 'export':
        // Mock export functionality
        console.log('Exporting employees:', selectedEmployees);
        alert('Export en cours... (Fonctionnalité simulée)');
        break;
      case 'activate':
        setEmployees(prev => prev?.map(emp => 
          selectedEmployees?.includes(emp?.id) ? { ...emp, status: 'Actif' } : emp
        ));
        setSelectedEmployees([]);
        break;
      case 'deactivate':
        setEmployees(prev => prev?.map(emp => 
          selectedEmployees?.includes(emp?.id) ? { ...emp, status: 'Inactif' } : emp
        ));
        setSelectedEmployees([]);
        break;
      case 'delete':
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedEmployees?.length} employé(s) ?`)) {
          setEmployees(prev => prev?.filter(emp => !selectedEmployees?.includes(emp?.id)));
          setSelectedEmployees([]);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`}>
        <Header />
        
        <main className="p-6 pb-20 lg:pb-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb />

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">
                  Gestion des Employés
                </h1>
                <p className="text-muted-foreground font-body">
                  Gérez les profils employés et accédez aux calculs fiscaux individuels
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowStats(!showStats)}
                  iconName={showStats ? 'EyeOff' : 'BarChart3'}
                  iconPosition="left"
                >
                  {showStats ? 'Masquer Stats' : 'Voir Stats'}
                </Button>
                <Button
                  onClick={handleAddEmployee}
                  iconName="UserPlus"
                  iconPosition="left"
                >
                  Ajouter Employé
                </Button>
              </div>
            </div>

            {/* Stats Panel */}
            {showStats && (
              <div className="lg:hidden xl:block">
                <EmployeeStats employees={employees} />
              </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Main Content */}
              <div className="xl:col-span-3 space-y-6">
                {/* Filter Controls */}
                <FilterControls
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                  employeeCount={filteredEmployees?.length}
                  selectedCount={selectedEmployees?.length}
                  onBulkAction={handleBulkAction}
                />

                {/* Employee Table */}
                <EmployeeTable
                  employees={filteredEmployees}
                  onEdit={handleEditEmployee}
                  onViewHistory={handleViewHistory}
                  selectedEmployees={selectedEmployees}
                  onSelectionChange={setSelectedEmployees}
                />
              </div>

              {/* Stats Sidebar - Desktop Only */}
              <div className="hidden xl:block">
                <div className="sticky top-6">
                  <EmployeeStats employees={employees} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* Modals */}
      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        employee={selectedEmployee}
        onSave={handleSaveEmployee}
        mode={modalMode}
      />
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        employee={selectedEmployee}
      />
      {/* Quick Action FAB */}
      <QuickActionFAB />
    </div>
  );
};

export default EmployeeManagement;