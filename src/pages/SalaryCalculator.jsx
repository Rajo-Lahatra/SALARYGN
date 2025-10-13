import React, { useState, useEffect } from 'react';
import { Calculator, Download, Users, FileText, Building, Sun, Moon, Briefcase, Save, History, Calendar } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { calculateNetSalary, formatCurrency, TAX_BRACKETS } from '../utils/taxCalculator';
import { generatePayslipPDF } from '../utils/pdfGenerator';
import { useAuth } from '../contexts/AuthContext';
import { useSalaryData } from '../hooks/useSalaryData';

const SalaryCalculator = () => {
  const { user } = useAuth();
  const { employees, company, saveEmployee, saveCompany, saveCalculation, loading } = useSalaryData();

  const [employee, setEmployee] = useState({
    fullName: '',
    employeeId: '',
    position: '',
    department: '',
    employmentType: 'CDI'
  });

  const [employer, setEmployer] = useState({
    companyName: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    rccm: '',
    nif: '',
    cnssNumber: '',
    employeeCount: ''
  });

  const [salaryData, setSalaryData] = useState({
    baseSalary: '',
    allowances: '',
    bonus: '',
    thirteenthMonth: '',
    housingAllowance: '',
    transportAllowance: '',
    livingAllowance: '',
    foodAllowance: '',
    overtimeNormal1to4: '',
    overtimeNormal5plus: '',
    overtimeNight1to4: '',
    overtimeNight5plus: ''
  });

  // NOUVEAU : État pour la période de paie
  const [payPeriod, setPayPeriod] = useState({
    month: new Date().getMonth() + 1, // Mois actuel (1-12)
    year: new Date().getFullYear() // Année actuelle
  });

  const [calculation, setCalculation] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  // Charger les données de l'entreprise au démarrage
  useEffect(() => {
    if (company) {
      setEmployer({
        companyName: company.company_name || '',
        address: company.address || '',
        city: company.city || '',
        phone: company.phone || '',
        email: company.email || '',
        rccm: company.rccm || '',
        nif: company.nif || '',
        cnssNumber: company.cnss_number || '',
        employeeCount: company.employee_count || ''
      });
    }
  }, [company]);

  // Charger les données depuis le localStorage comme fallback
  useEffect(() => {
    const savedEmployee = localStorage.getItem('currentEmployee');
    const savedEmployer = localStorage.getItem('employer');
    
    if (savedEmployee && !user) {
      const employeeData = JSON.parse(savedEmployee);
      setEmployee(prev => ({
        ...prev,
        fullName: employeeData.fullName || '',
        employeeId: employeeData.employeeId || '',
        position: employeeData.position || '',
        department: employeeData.department || '',
        employmentType: employeeData.employmentType || 'CDI'
      }));
      
      if (employeeData.baseSalary) {
        setSalaryData(prev => ({
          ...prev,
          baseSalary: employeeData.baseSalary.toString()
        }));
      }
      
      localStorage.removeItem('currentEmployee');
    }
    
    if (savedEmployer && !user) {
      setEmployer(JSON.parse(savedEmployer));
    }
  }, [user]);

  const handleEmployeeChange = (field, value) => {
    setEmployee(prev => ({ ...prev, [field]: value }));
  };

  const handleEmployerChange = (field, value) => {
    setEmployer(prev => ({ ...prev, [field]: value }));
  };

  const handleSalaryChange = (field, value) => {
    setSalaryData(prev => ({ ...prev, [field]: value }));
  };

  // NOUVEAU : Gestion du changement de période
  const handlePeriodChange = (field, value) => {
    setPayPeriod(prev => ({ 
      ...prev, 
      [field]: field === 'month' ? parseInt(value) : parseInt(value) 
    }));
  };

  const handleSaveCompany = async () => {
    if (!employer.companyName) {
      setError('Le nom de l\'entreprise est requis');
      return;
    }

    const result = await saveCompany(employer);
    if (result.success) {
      setSaveMessage('Entreprise sauvegardée avec succès');
      setTimeout(() => setSaveMessage(''), 3000);
    } else {
      setError('Erreur sauvegarde entreprise: ' + result.error);
    }
  };

  const handleSaveEmployee = async () => {
    if (!employee.fullName) {
      setError('Le nom complet est requis');
      return;
    }

    const employeeToSave = {
      ...employee,
      baseSalary: salaryData.baseSalary ? parseFloat(salaryData.baseSalary) : null
    };

    const result = await saveEmployee(employeeToSave);
    if (result.success) {
      setSaveMessage('Employé sauvegardé avec succès');
      setTimeout(() => setSaveMessage(''), 3000);
    } else {
      setError('Erreur sauvegarde employé: ' + result.error);
    }
  };

  const handleCalculate = async () => {
    setError('');
    setIsCalculating(true);
    
    try {
      setTimeout(() => {
        try {
          const result = calculateNetSalary({
            baseSalary: parseFloat(salaryData.baseSalary) || 0,
            allowances: parseFloat(salaryData.allowances) || 0,
            bonus: parseFloat(salaryData.bonus) || 0,
            thirteenthMonth: parseFloat(salaryData.thirteenthMonth) || 0,
            housingAllowance: parseFloat(salaryData.housingAllowance) || 0,
            transportAllowance: parseFloat(salaryData.transportAllowance) || 0,
            livingAllowance: parseFloat(salaryData.livingAllowance) || 0,
            foodAllowance: parseFloat(salaryData.foodAllowance) || 0,
            overtimeData: {
              normal1to4: parseFloat(salaryData.overtimeNormal1to4) || 0,
              normal5plus: parseFloat(salaryData.overtimeNormal5plus) || 0,
              night1to4: parseFloat(salaryData.overtimeNight1to4) || 0,
              night5plus: parseFloat(salaryData.overtimeNight5plus) || 0
            }
          }, parseInt(employer.employeeCount) || 0);

          setCalculation(result);

          // Sauvegarder automatiquement le calcul si l'utilisateur est connecté
          if (user) {
            saveCalculation({
              title: `Calcul ${employee.fullName || 'Sans nom'} - ${getFormattedPeriod()}`,
              input: {
                employee,
                salaryData,
                employer,
                payPeriod // NOUVEAU : inclure la période
              },
              result,
              period: `${payPeriod.year}-${payPeriod.month.toString().padStart(2, '0')}`
            });
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setIsCalculating(false);
        }
      }, 1000);
    } catch (err) {
      setError('Erreur lors du calcul: ' + err.message);
      setIsCalculating(false);
    }
  };

  const handleGeneratePayslip = async () => {
    if (!calculation || !employee.fullName) {
      alert('Veuillez d\'abord calculer le salaire et renseigner le nom de l\'employé');
      return;
    }

    try {
      await generatePayslipPDF(employee, calculation, getFormattedPeriod(), employer);
    } catch (err) {
      setError('Erreur lors de la génération du bulletin: ' + err.message);
    }
  };

  // NOUVEAU : Formater la période pour l'affichage
  const getFormattedPeriod = () => {
    const monthNames = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return `${monthNames[payPeriod.month - 1]} ${payPeriod.year}`;
  };

  const handleReset = () => {
    setEmployee({
      fullName: '',
      employeeId: '',
      position: '',
      department: '',
      employmentType: 'CDI'
    });
    setSalaryData({
      baseSalary: '',
      allowances: '',
      bonus: '',
      thirteenthMonth: '',
      housingAllowance: '',
      transportAllowance: '',
      livingAllowance: '',
      foodAllowance: '',
      overtimeNormal1to4: '',
      overtimeNormal5plus: '',
      overtimeNight1to4: '',
      overtimeNight5plus: ''
    });
    setCalculation(null);
    setError('');
  };

  // Charger un employé existant depuis la liste
  const handleLoadEmployee = (selectedEmployee) => {
    setEmployee({
      fullName: selectedEmployee.full_name,
      employeeId: selectedEmployee.employee_id,
      position: selectedEmployee.position,
      department: selectedEmployee.department,
      employmentType: selectedEmployee.employment_type
    });
    
    if (selectedEmployee.base_salary) {
      setSalaryData(prev => ({
        ...prev,
        baseSalary: selectedEmployee.base_salary.toString()
      }));
    }
  };

  // Déterminer quelle taxe s'applique
  const getAppliedTax = () => {
    const employeeCount = parseInt(employer.employeeCount) || 0;
    if (employeeCount > 0 && employeeCount < 30) {
      return { name: 'Taxe d\'Apprentissage', rate: '3%' };
    } else if (employeeCount >= 30) {
      return { name: 'ONFPP', rate: '1.5%' };
    }
    return null;
  };

  const appliedTax = getAppliedTax();

  // NOUVEAU : Générer les options pour les mois et années
  const monthOptions = [
    { value: 1, label: 'Janvier' },
    { value: 2, label: 'Février' },
    { value: 3, label: 'Mars' },
    { value: 4, label: 'Avril' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Juin' },
    { value: 7, label: 'Juillet' },
    { value: 8, label: 'Août' },
    { value: 9, label: 'Septembre' },
    { value: 10, label: 'Octobre' },
    { value: 11, label: 'Novembre' },
    { value: 12, label: 'Décembre' }
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Calculator className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Calculateur de Salaire Guinéen</h1>
          </div>
          <p className="text-gray-600 mb-2">
            Calculez les salaires nets selon le barème fiscal guinéen et générez des bulletins de paie
          </p>
          {user && (
            <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Connecté en tant que {user.email}
            </div>
          )}
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {saveMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700">{saveMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche - Formulaire */}
          <div className="lg:col-span-2 space-y-6">
            {/* NOUVEAU : Sélection de période */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Période de Paie</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mois
                  </label>
                  <select
                    value={payPeriod.month}
                    onChange={(e) => handlePeriodChange('month', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  >
                    {monthOptions.map(month => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Année
                  </label>
                  <select
                    value={payPeriod.year}
                    onChange={(e) => handlePeriodChange('year', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  >
                    {yearOptions.map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700 text-center font-medium">
                  Période sélectionnée : <strong>{getFormattedPeriod()}</strong>
                </p>
              </div>
            </div>

            {/* Le reste du code reste inchangé */}
            {/* Informations employeur */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center space-x-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  <span>Informations Employeur</span>
                </h2>
                {user && (
                  <Button
                    onClick={handleSaveCompany}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Sauvegarder</span>
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Raison Sociale *
                  </label>
                  <Input
                    value={employer.companyName}
                    onChange={(e) => handleEmployerChange('companyName', e.target.value)}
                    placeholder="Ex: SARL Entreprise Guinéenne"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Effectif des salariés *
                  </label>
                  <Input
                    type="number"
                    value={employer.employeeCount}
                    onChange={(e) => handleEmployerChange('employeeCount', e.target.value)}
                    placeholder="Ex: 25"
                    min="1"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Détermine l'application de la Taxe d'Apprentissage (3%) ou ONFPP (1.5%)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NIF
                  </label>
                  <Input
                    value={employer.nif}
                    onChange={(e) => handleEmployerChange('nif', e.target.value)}
                    placeholder="Ex: 1234567890"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <Input
                    value={employer.address}
                    onChange={(e) => handleEmployerChange('address', e.target.value)}
                    placeholder="Ex: Rue KA 008, Kaloum"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ville
                  </label>
                  <Input
                    value={employer.city}
                    onChange={(e) => handleEmployerChange('city', e.target.value)}
                    placeholder="Ex: Conakry"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <Input
                    value={employer.phone}
                    onChange={(e) => handleEmployerChange('phone', e.target.value)}
                    placeholder="Ex: +224 123 45 67 89"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={employer.email}
                    onChange={(e) => handleEmployerChange('email', e.target.value)}
                    placeholder="Ex: contact@entreprise.gn"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RCCM
                  </label>
                  <Input
                    value={employer.rccm}
                    onChange={(e) => handleEmployerChange('rccm', e.target.value)}
                    placeholder="Ex: RCCM-G-1234A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro CNSS
                  </label>
                  <Input
                    value={employer.cnssNumber}
                    onChange={(e) => handleEmployerChange('cnssNumber', e.target.value)}
                    placeholder="Ex: CNSS-123456"
                  />
                </div>
              </div>

              {appliedTax && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-blue-800">Taxe applicable :</p>
                      <p className="text-sm text-blue-700">
                        {appliedTax.name} ({appliedTax.rate}) - 
                        {appliedTax.name === 'Taxe d\'Apprentissage' 
                          ? ' Effectif inférieur à 30 salariés'
                          : ' Effectif de 30 salariés ou plus'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!user && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    <strong>Note :</strong> Connectez-vous pour sauvegarder les informations de votre entreprise.
                  </p>
                </div>
              )}
            </div>

                        {/* Informations employé */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>Informations Employé</span>
                </h2>
                <div className="flex space-x-2">
                  {user && employees.length > 0 && (
                    <select 
                      onChange={(e) => {
                        const selected = employees.find(emp => emp.id === e.target.value);
                        if (selected) handleLoadEmployee(selected);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      defaultValue=""
                    >
                      <option value="">Charger un employé...</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>
                          {emp.full_name} {emp.employee_id ? `(${emp.employee_id})` : ''}
                        </option>
                      ))}
                    </select>
                  )}
                  {user && (
                    <Button
                      onClick={handleSaveEmployee}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Sauvegarder</span>
                    </Button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom Complet *
                  </label>
                  <Input
                    value={employee.fullName}
                    onChange={(e) => handleEmployeeChange('fullName', e.target.value)}
                    placeholder="Ex: Mamadou Diallo"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Matricule
                  </label>
                  <Input
                    value={employee.employeeId}
                    onChange={(e) => handleEmployeeChange('employeeId', e.target.value)}
                    placeholder="EMP001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Poste *
                  </label>
                  <Input
                    value={employee.position}
                    onChange={(e) => handleEmployeeChange('position', e.target.value)}
                    placeholder="Ex: Comptable Senior"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Département
                  </label>
                  <Input
                    value={employee.department}
                    onChange={(e) => handleEmployeeChange('department', e.target.value)}
                    placeholder="Ex: Finance"
                  />
                </div>
              </div>
              {!user && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    <strong>Note :</strong> Connectez-vous pour sauvegarder les profils employés et charger des employés existants.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Colonne droite - Résultats et Actions */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">Actions</h2>
              <div className="space-y-3">
                <Button
                  onClick={handleCalculate}
                  disabled={isCalculating || !employee.fullName || !salaryData.baseSalary || !employer.companyName || !employer.employeeCount}
                  className="w-full"
                >
                  {isCalculating ? 'Calcul en cours...' : 'Calculer le Salaire'}
                </Button>
                
                <Button
                  onClick={handleGeneratePayslip}
                  disabled={!calculation}
                  variant="outline"
                  className="w-full flex items-center space-x-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>Générer Bulletin</span>
                </Button>

                <Button
                  onClick={handleReset}
                  variant="ghost"
                  className="w-full"
                >
                  Réinitialiser
                </Button>

                {user && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600 text-center">
                      ✓ Calculs sauvegardés automatiquement
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Résultats - Le code reste inchangé */}
            {/* ... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryCalculator;