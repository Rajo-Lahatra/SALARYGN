import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import QuickActionFAB from '../../components/ui/QuickActionFAB';
import EmployeeInfoForm from './components/EmployeeInfoForm';
import TaxCalculationResults from './components/TaxCalculationResults';
import ActionButtons from './components/ActionButtons';
import TaxBracketInfo from './components/TaxBracketInfo';
import Icon from '../../components/AppIcon';

const EmployeeTaxCalculator = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationResults, setCalculationResults] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    position: '',
    employmentCategory: '',
    grossSalary: '',
    allowances: '',
    overtimeHours: '',
    bonus: '',
    thirteenthMonth: ''
  });
  const [errors, setErrors] = useState({});

  // Tax calculation engine
  const calculateTaxes = (data) => {
    const grossSalary = parseFloat(data?.grossSalary) || 0;
    const allowances = parseFloat(data?.allowances) || 0;
    const bonus = parseFloat(data?.bonus) || 0;
    const thirteenthMonth = parseFloat(data?.thirteenthMonth) || 0;
    const overtimeHours = parseFloat(data?.overtimeHours) || 0;
    
    // Calculate overtime pay (assuming 1.5x hourly rate)
    const hourlyRate = grossSalary / 173; // Standard monthly hours in Guinea
    const overtimePay = overtimeHours * hourlyRate * 1.5;
    
    const grossTotal = grossSalary + allowances + bonus + thirteenthMonth + overtimePay;
    
    // Income tax calculation (progressive brackets)
    let incomeTax = 0;
    let taxBracket = '';
    let incomeTaxRate = 0;
    
    if (grossTotal <= 1000000) {
      incomeTax = 0;
      taxBracket = 'Exonération (0 - 1M GNF)';
      incomeTaxRate = 0;
    } else if (grossTotal <= 3000000) {
      incomeTax = (grossTotal - 1000000) * 0.05;
      taxBracket = 'Tranche 1 (1M - 3M GNF)';
      incomeTaxRate = 5;
    } else if (grossTotal <= 6000000) {
      incomeTax = 2000000 * 0.05 + (grossTotal - 3000000) * 0.10;
      taxBracket = 'Tranche 2 (3M - 6M GNF)';
      incomeTaxRate = 10;
    } else if (grossTotal <= 12000000) {
      incomeTax = 2000000 * 0.05 + 3000000 * 0.10 + (grossTotal - 6000000) * 0.15;
      taxBracket = 'Tranche 3 (6M - 12M GNF)';
      incomeTaxRate = 15;
    } else {
      incomeTax = 2000000 * 0.05 + 3000000 * 0.10 + 6000000 * 0.15 + (grossTotal - 12000000) * 0.20;
      taxBracket = 'Tranche 4 (12M+ GNF)';
      incomeTaxRate = 20;
    }
    
    // CNSS contribution (2.5% of gross salary)
    const cnssContribution = grossTotal * 0.025;
    const cnssRate = 2.5;
    
    // Medical insurance (1.5% of gross salary)
    const medicalInsurance = grossTotal * 0.015;
    const medicalInsuranceRate = 1.5;
    
    // Professional tax (varies by employment category)
    let professionalTax = 0;
    switch (data?.employmentCategory) {
      case 'permanent':
        professionalTax = 50000;
        break;
      case 'contract':
        professionalTax = 30000;
        break;
      case 'temporary':
        professionalTax = 20000;
        break;
      case 'consultant':
        professionalTax = 75000;
        break;
      default:
        professionalTax = 50000;
    }
    
    const totalDeductions = incomeTax + cnssContribution + medicalInsurance + professionalTax;
    const netSalary = grossTotal - totalDeductions;
    const taxableIncome = grossTotal;
    
    const employmentCategoryLabels = {
      'permanent': 'Employé Permanent',
      'contract': 'Contractuel',
      'temporary': 'Temporaire',
      'consultant': 'Consultant'
    };
    
    return {
      grossTotal: Math.round(grossTotal),
      incomeTax: Math.round(incomeTax),
      incomeTaxRate,
      taxBracket,
      cnssContribution: Math.round(cnssContribution),
      cnssRate,
      medicalInsurance: Math.round(medicalInsurance),
      medicalInsuranceRate,
      professionalTax,
      totalDeductions: Math.round(totalDeductions),
      netSalary: Math.round(netSalary),
      taxableIncome: Math.round(taxableIncome),
      employmentCategory: employmentCategoryLabels?.[data?.employmentCategory] || data?.employmentCategory
    };
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Le nom complet est requis';
    }
    
    if (!formData?.position?.trim()) {
      newErrors.position = 'Le poste est requis';
    }
    
    if (!formData?.employmentCategory) {
      newErrors.employmentCategory = 'La catégorie d\'emploi est requise';
    }
    
    if (!formData?.grossSalary || parseFloat(formData?.grossSalary) <= 0) {
      newErrors.grossSalary = 'Le salaire brut doit être supérieur à 0';
    }
    
    if (formData?.overtimeHours && parseFloat(formData?.overtimeHours) < 0) {
      newErrors.overtimeHours = 'Les heures supplémentaires ne peuvent pas être négatives';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleCalculate = async () => {
    if (!validateForm()) return;
    
    setIsCalculating(true);
    
    // Simulate calculation delay for better UX
    setTimeout(() => {
      const results = calculateTaxes(formData);
      setCalculationResults(results);
      setIsCalculating(false);
    }, 1500);
  };

  const handleSave = async () => {
    if (!calculationResults) return;
    
    // Mock save functionality
    const calculationData = {
      ...formData,
      ...calculationResults,
      savedAt: new Date()?.toISOString(),
      id: Date.now()
    };
    
    // In real app, this would save to backend
    console.log('Saving calculation:', calculationData);
    
    // Show success message (in real app, use toast notification)
    alert('Calcul sauvegardé avec succès!');
  };

  const handleGeneratePayslip = async () => {
    if (!calculationResults) return;
    
    // Mock payslip generation
    const payslipData = {
      employee: formData,
      calculations: calculationResults,
      generatedAt: new Date()?.toISOString()
    };
    
    console.log('Generating payslip:', payslipData);
    
    // In real app, this would generate and download PDF
    alert('Fiche de paie générée! (Fonctionnalité de téléchargement à venir)');
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      position: '',
      employmentCategory: '',
      grossSalary: '',
      allowances: '',
      overtimeHours: '',
      bonus: '',
      thirteenthMonth: ''
    });
    setCalculationResults(null);
    setErrors({});
  };

  const handleFormChange = (newFormData) => {
    setFormData(newFormData);
    // Clear errors when user starts typing
    if (errors?.fullName && newFormData?.fullName) {
      setErrors(prev => ({ ...prev, fullName: '' }));
    }
    if (errors?.position && newFormData?.position) {
      setErrors(prev => ({ ...prev, position: '' }));
    }
    if (errors?.employmentCategory && newFormData?.employmentCategory) {
      setErrors(prev => ({ ...prev, employmentCategory: '' }));
    }
    if (errors?.grossSalary && newFormData?.grossSalary) {
      setErrors(prev => ({ ...prev, grossSalary: '' }));
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
          <div className="max-w-7xl mx-auto">
            <Breadcrumb />
            
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Calculator" size={24} className="text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-heading font-bold text-foreground">
                    Calculateur Fiscal Individuel
                  </h1>
                  <p className="text-muted-foreground font-body">
                    Calcul précis des impôts et cotisations pour un employé en Guinée Conakry
                  </p>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-center space-x-3">
                    <Icon name="TrendingUp" size={20} className="text-success" />
                    <div>
                      <p className="text-sm text-muted-foreground">Taux Minimum</p>
                      <p className="font-heading font-semibold text-foreground">0%</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-center space-x-3">
                    <Icon name="TrendingDown" size={20} className="text-error" />
                    <div>
                      <p className="text-sm text-muted-foreground">Taux Maximum</p>
                      <p className="font-heading font-semibold text-foreground">20%</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-center space-x-3">
                    <Icon name="Shield" size={20} className="text-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">CNSS</p>
                      <p className="font-heading font-semibold text-foreground">2.5%</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-center space-x-3">
                    <Icon name="Heart" size={20} className="text-warning" />
                    <div>
                      <p className="text-sm text-muted-foreground">Assurance</p>
                      <p className="font-heading font-semibold text-foreground">1.5%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column - Input Forms */}
              <div className="xl:col-span-2 space-y-8">
                <EmployeeInfoForm
                  formData={formData}
                  onFormChange={handleFormChange}
                  errors={errors}
                />
                
                <TaxBracketInfo />
              </div>

              {/* Right Column - Results and Actions */}
              <div className="space-y-8">
                <ActionButtons
                  onCalculate={handleCalculate}
                  onSave={handleSave}
                  onGeneratePayslip={handleGeneratePayslip}
                  onReset={handleReset}
                  isCalculating={isCalculating}
                  hasResults={!!calculationResults}
                  formData={formData}
                />
                
                <TaxCalculationResults
                  results={calculationResults}
                  isCalculating={isCalculating}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <QuickActionFAB />
    </div>
  );
};

export default EmployeeTaxCalculator;