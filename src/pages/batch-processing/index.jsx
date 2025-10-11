import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import QuickActionFAB from '../../components/ui/QuickActionFAB';
import EmployeeSelectionPanel from './components/EmployeeSelectionPanel';
import BatchSummaryPanel from './components/BatchSummaryPanel';
import ProcessingConfigPanel from './components/ProcessingConfigPanel';
import ProcessingProgressModal from './components/ProcessingProgressModal';
import ProcessingResultsPanel from './components/ProcessingResultsPanel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const BatchProcessing = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [processingProgress, setProcessingProgress] = useState({
    processedCount: 0,
    totalCount: 0,
    currentEmployee: null,
    errors: []
  });
  const [processingResults, setProcessingResults] = useState([]);
  const [activeTab, setActiveTab] = useState('selection');

  // Mock employee data
  const employees = [
    {
      id: 1,
      employeeId: 'EMP001',
      name: 'Mamadou Diallo',
      department: 'rh',
      employmentType: 'cdi',
      grossSalary: 2500000,
      lastCalculation: '2025-09-15',
      status: 'active'
    },
    {
      id: 2,
      employeeId: 'EMP002',
      name: 'Fatoumata Camara',
      department: 'finance',
      employmentType: 'cdi',
      grossSalary: 3200000,
      lastCalculation: '2025-09-15',
      status: 'active'
    },
    {
      id: 3,
      employeeId: 'EMP003',
      name: 'Alpha Condé',
      department: 'it',
      employmentType: 'cdi',
      grossSalary: 4500000,
      lastCalculation: '2025-09-10',
      status: 'active'
    },
    {
      id: 4,
      employeeId: 'EMP004',
      name: 'Aissatou Barry',
      department: 'marketing',
      employmentType: 'cdd',
      grossSalary: 1800000,
      lastCalculation: '2025-09-12',
      status: 'active'
    },
    {
      id: 5,
      employeeId: 'EMP005',
      name: 'Ibrahima Sow',
      department: 'operations',
      employmentType: 'cdi',
      grossSalary: 2800000,
      lastCalculation: '2025-09-08',
      status: 'active'
    },
    {
      id: 6,
      employeeId: 'EMP006',
      name: 'Mariama Bah',
      department: 'ventes',
      employmentType: 'cdi',
      grossSalary: 2200000,
      lastCalculation: '2025-09-14',
      status: 'active'
    },
    {
      id: 7,
      employeeId: 'EMP007',
      name: 'Ousmane Touré',
      department: 'finance',
      employmentType: 'consultant',
      grossSalary: 3800000,
      lastCalculation: '2025-09-11',
      status: 'active'
    },
    {
      id: 8,
      employeeId: 'EMP008',
      name: 'Kadiatou Diané',
      department: 'rh',
      employmentType: 'cdi',
      grossSalary: 2600000,
      lastCalculation: '2025-09-13',
      status: 'inactive'
    }
  ];

  // Processing configuration state
  const [processingConfig, setProcessingConfig] = useState({
    period: 'current',
    startDate: '',
    endDate: '',
    bonusType: 'none',
    customBonusAmount: '',
    includeOvertime: false,
    overtimeRate: '1.25',
    averageOvertimeHours: '',
    generatePayslips: true,
    sendNotifications: false,
    updateRecords: true
  });

  const handleSelectionChange = (employeeId, isSelected) => {
    setSelectedEmployees(prev => {
      if (isSelected) {
        return [...prev, employeeId];
      } else {
        return prev?.filter(id => id !== employeeId);
      }
    });
  };

  const handleSelectAll = () => {
    const allEmployeeIds = employees?.map(emp => emp?.id);
    setSelectedEmployees(allEmployeeIds);
  };

  const handleClearAll = () => {
    setSelectedEmployees([]);
  };

  const simulateProcessing = async () => {
    const selectedEmployeeData = employees?.filter(emp => selectedEmployees?.includes(emp?.id));
    const results = [];
    const errors = [];

    setProcessingProgress({
      processedCount: 0,
      totalCount: selectedEmployeeData?.length,
      currentEmployee: null,
      errors: []
    });

    for (let i = 0; i < selectedEmployeeData?.length; i++) {
      const employee = selectedEmployeeData?.[i];
      
      // Update current employee
      setProcessingProgress(prev => ({
        ...prev,
        currentEmployee: employee
      }));

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate random errors (10% chance)
      const hasError = Math.random() < 0.1;
      
      if (hasError) {
        const error = {
          employeeId: employee?.employeeId,
          employeeName: employee?.name,
          message: `Données manquantes pour le calcul fiscal de ${employee?.name}`
        };
        errors?.push(error);
        results?.push({
          employeeId: employee?.employeeId,
          employeeName: employee?.name,
          department: employee?.department,
          status: 'error',
          errorMessage: error?.message,
          processedAt: new Date()?.toISOString()
        });
      } else {
        // Calculate mock net salary (simplified calculation)
        const grossSalary = employee?.grossSalary;
        const taxRate = 0.15; // 15% tax rate
        const socialContributions = grossSalary * 0.05; // 5% social contributions
        const netSalary = grossSalary - (grossSalary * taxRate) - socialContributions;

        results?.push({
          employeeId: employee?.employeeId,
          employeeName: employee?.name,
          department: employee?.department,
          grossSalary: grossSalary,
          netSalary: netSalary,
          taxAmount: grossSalary * taxRate,
          socialContributions: socialContributions,
          status: 'success',
          processedAt: new Date()?.toISOString()
        });
      }

      // Update progress
      setProcessingProgress(prev => ({
        ...prev,
        processedCount: i + 1,
        errors: errors
      }));
    }

    // Final update
    setProcessingProgress(prev => ({
      ...prev,
      currentEmployee: null
    }));

    setProcessingResults(results);
    
    // Wait a bit before allowing close
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleStartProcessing = async () => {
    if (selectedEmployees?.length === 0) return;

    setIsProcessing(true);
    setShowProgressModal(true);
    setActiveTab('results');

    try {
      await simulateProcessing();
    } catch (error) {
      console.error('Processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleScheduleProcessing = (date, time) => {
    alert(`Traitement programmé pour le ${date} à ${time}`);
  };

  const handleCancelProcessing = () => {
    setIsProcessing(false);
    setShowProgressModal(false);
    setProcessingProgress({
      processedCount: 0,
      totalCount: 0,
      currentEmployee: null,
      errors: []
    });
  };

  const handleCloseProgressModal = () => {
    setShowProgressModal(false);
  };

  const handleExportResults = () => {
    alert('Export des résultats en cours...');
  };

  const handleViewDetails = (result) => {
    alert(`Détails pour ${result?.employeeName}`);
  };

  const handleRetryErrors = () => {
    const errorEmployeeIds = processingResults?.filter(r => r?.status === 'error')?.map(r => employees?.find(emp => emp?.employeeId === r?.employeeId)?.id)?.filter(Boolean);
    
    setSelectedEmployees(errorEmployeeIds);
    setActiveTab('selection');
  };

  const tabs = [
    { id: 'selection', label: 'Sélection', icon: 'Users' },
    { id: 'config', label: 'Configuration', icon: 'Settings' },
    { id: 'results', label: 'Résultats', icon: 'FileSpreadsheet' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      <div className={`transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
      }`}>
        <Header />
        
        <main className="p-6 pb-20 lg:pb-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <Breadcrumb />
            
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">
                  Traitement par Lot
                </h1>
                <p className="text-muted-foreground font-body mt-1">
                  Calculez les taxes et déductions pour plusieurs employés simultanément
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/employee-management')}
                  iconName="Users"
                  iconPosition="left"
                >
                  Gestion Employés
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/tax-settings')}
                  iconName="Settings"
                  iconPosition="left"
                >
                  Paramètres
                </Button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-border">
              <nav className="flex space-x-8">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-body font-medium text-sm transition-colors ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.label}</span>
                    {tab?.id === 'results' && processingResults?.length > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5 ml-1">
                        {processingResults?.length}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'selection' && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <div className="xl:col-span-2">
                    <EmployeeSelectionPanel
                      employees={employees}
                      selectedEmployees={selectedEmployees}
                      onSelectionChange={handleSelectionChange}
                      onSelectAll={handleSelectAll}
                      onClearAll={handleClearAll}
                    />
                  </div>
                  <div>
                    <BatchSummaryPanel
                      selectedEmployees={selectedEmployees}
                      employees={employees}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'config' && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <div className="xl:col-span-2">
                    <ProcessingConfigPanel
                      config={processingConfig}
                      onConfigChange={setProcessingConfig}
                      onStartProcessing={handleStartProcessing}
                      onScheduleProcessing={handleScheduleProcessing}
                      selectedCount={selectedEmployees?.length}
                      isProcessing={isProcessing}
                    />
                  </div>
                  <div>
                    <BatchSummaryPanel
                      selectedEmployees={selectedEmployees}
                      employees={employees}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'results' && (
                <ProcessingResultsPanel
                  results={processingResults}
                  onExportResults={handleExportResults}
                  onViewDetails={handleViewDetails}
                  onRetryErrors={handleRetryErrors}
                />
              )}
            </div>
          </div>
        </main>
      </div>
      <QuickActionFAB />
      <ProcessingProgressModal
        isOpen={showProgressModal}
        progress={processingProgress}
        currentEmployee={processingProgress?.currentEmployee}
        processedCount={processingProgress?.processedCount}
        totalCount={processingProgress?.totalCount}
        errors={processingProgress?.errors}
        onCancel={handleCancelProcessing}
        onClose={handleCloseProgressModal}
      />
    </div>
  );
};

export default BatchProcessing;