import React, { useState, useEffect } from 'react';
import { Calculator, Download, Users, FileText, Building, Sun, Moon, Briefcase, Save, History } from 'lucide-react';
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
    cnssNumber: ''
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
        cnssNumber: company.cnss_number || ''
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
          });

          setCalculation(result);

          // Sauvegarder automatiquement le calcul si l'utilisateur est connecté
          if (user) {
            saveCalculation({
              title: `Calcul ${employee.fullName || 'Sans nom'} - ${new Date().toLocaleDateString('fr-FR')}`,
              input: {
                employee,
                salaryData,
                employer
              },
              result,
              period: new Date().toISOString().slice(0, 7)
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

    const period = new Date().toLocaleDateString('fr-FR', { 
      month: 'long', 
      year: 'numeric' 
    });

    try {
      await generatePayslipPDF(employee, calculation, period, employer);
    } catch (err) {
      setError('Erreur lors de la génération du bulletin: ' + err.message);
    }
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
                    NIF
                  </label>
                  <Input
                    value={employer.nif}
                    onChange={(e) => handleEmployerChange('nif', e.target.value)}
                    placeholder="Ex: 1234567890"
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

            {/* Données salariales */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">Données Salariales</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salaire de Base (GNF) *
                  </label>
                  <Input
                    type="number"
                    value={salaryData.baseSalary}
                    onChange={(e) => handleSalaryChange('baseSalary', e.target.value)}
                    placeholder="5000000"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prime de Logement (GNF)
                  </label>
                  <Input
                    type="number"
                    value={salaryData.housingAllowance}
                    onChange={(e) => handleSalaryChange('housingAllowance', e.target.value)}
                    placeholder="250000"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prime de Transport (GNF)
                  </label>
                  <Input
                    type="number"
                    value={salaryData.transportAllowance}
                    onChange={(e) => handleSalaryChange('transportAllowance', e.target.value)}
                    placeholder="100000"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prime de Cherté de Vie (GNF)
                  </label>
                  <Input
                    type="number"
                    value={salaryData.livingAllowance}
                    onChange={(e) => handleSalaryChange('livingAllowance', e.target.value)}
                    placeholder="150000"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prime de Nourriture (GNF)
                  </label>
                  <Input
                    type="number"
                    value={salaryData.foodAllowance}
                    onChange={(e) => handleSalaryChange('foodAllowance', e.target.value)}
                    placeholder="80000"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Autres Indemnités (GNF)
                  </label>
                  <Input
                    type="number"
                    value={salaryData.allowances}
                    onChange={(e) => handleSalaryChange('allowances', e.target.value)}
                    placeholder="100000"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prime/Bonus (GNF)
                  </label>
                  <Input
                    type="number"
                    value={salaryData.bonus}
                    onChange={(e) => handleSalaryChange('bonus', e.target.value)}
                    placeholder="500000"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    13ème Mois (Prorata GNF)
                  </label>
                  <Input
                    type="number"
                    value={salaryData.thirteenthMonth}
                    onChange={(e) => handleSalaryChange('thirteenthMonth', e.target.value)}
                    placeholder="416667"
                    min="0"
                  />
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Note :</strong> Les primes de logement, transport, cherté de vie et nourriture sont exonérées d'impôt (dans la limite de 25% du salaire brut total).
                </p>
              </div>
            </div>

            {/* Heures supplémentaires détaillées */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Sun className="h-5 w-5 text-orange-600" />
                <span>Heures Supplémentaires</span>
              </h2>
              
              <div className="mb-4 p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-2">Taux légaux des heures supplémentaires</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span>Heures 1-4 (jour):</span>
                    <span className="font-semibold">130% (30% majoration)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Heures 5+ (jour):</span>
                    <span className="font-semibold">160% (60% majoration)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Heures 1-4 (nuit):</span>
                    <span className="font-semibold">150% (50% majoration)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Heures 5+ (nuit):</span>
                    <span className="font-semibold">180% (80% majoration)</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heures sup. normales 1-4
                  </label>
                  <Input
                    type="number"
                    value={salaryData.overtimeNormal1to4}
                    onChange={(e) => handleSalaryChange('overtimeNormal1to4', e.target.value)}
                    placeholder="0"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Majoration: 30%</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heures sup. normales 5+
                  </label>
                  <Input
                    type="number"
                    value={salaryData.overtimeNormal5plus}
                    onChange={(e) => handleSalaryChange('overtimeNormal5plus', e.target.value)}
                    placeholder="0"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Majoration: 60%</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heures sup. nuit 1-4
                  </label>
                  <Input
                    type="number"
                    value={salaryData.overtimeNight1to4}
                    onChange={(e) => handleSalaryChange('overtimeNight1to4', e.target.value)}
                    placeholder="0"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Majoration: 50% (30%+20%)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heures sup. nuit 5+
                  </label>
                  <Input
                    type="number"
                    value={salaryData.overtimeNight5plus}
                    onChange={(e) => handleSalaryChange('overtimeNight5plus', e.target.value)}
                    placeholder="0"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Majoration: 80% (60%+20%)</p>
                </div>
              </div>
            </div>

            {/* Barème fiscal */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">Barème Fiscal en Vigueur</h2>
              <div className="space-y-3">
                {TAX_BRACKETS.map((bracket) => (
                  <div key={bracket.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">{bracket.name}</span>
                      <p className="text-sm text-gray-600">
                        {bracket.minAmount.toLocaleString()} - {bracket.maxAmount ? bracket.maxAmount.toLocaleString() : '+'} GNF
                      </p>
                    </div>
                    <span className="font-bold text-blue-600">{bracket.rate}%</span>
                  </div>
                ))}
              </div>
              
              {/* Information CNSS */}
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Building className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-800">Cotisations CNSS</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Part salariale: 5% (plafond: 2.500.000 GNF, minimum: 550.000 GNF)
                    </p>
                    <p className="text-sm text-blue-700">
                      Part patronale: 18% (mêmes plafonds)
                    </p>
                  </div>
                </div>
              </div>

              {/* Information Versement Forfaitaire */}
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Building className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">Versement Forfaitaire</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Base VF = SI(Salaire {'<'} 2.500.000; Salaire-(Salaire*6%); Salaire-(2.500.000*6%))
                    </p>
                    <p className="text-sm text-yellow-700">
                      VF = 6% de la base VF
                    </p>
                  </div>
                </div>
              </div>
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
                  disabled={isCalculating || !employee.fullName || !salaryData.baseSalary || !employer.companyName}
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

            {/* Résultats */}
            {calculation && (
              <div className="space-y-6">
                {/* Résumé Employé */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold mb-4">Résultats du Calcul</h2>
                  
                  {/* Résumé */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Salaire Brut</p>
                      <p className="text-lg font-bold text-blue-600">
                        {formatCurrency(calculation.grossSalary)}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">Salaire Net</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(calculation.netSalary)}
                      </p>
                    </div>
                  </div>

                  {/* Détails des gains */}
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Gains</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Salaire de base:</span>
                        <span>{formatCurrency(calculation.baseSalary)}</span>
                      </div>
                      
                      {/* Affichage individuel des primes exonérées */}
                      {calculation.housingAllowance > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Prime de logement:</span>
                          <span>{formatCurrency(calculation.housingAllowance)}</span>
                        </div>
                      )}
                      {calculation.transportAllowance > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Prime de transport:</span>
                          <span>{formatCurrency(calculation.transportAllowance)}</span>
                        </div>
                      )}
                      {calculation.livingAllowance > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Prime de cherté de vie:</span>
                          <span>{formatCurrency(calculation.livingAllowance)}</span>
                        </div>
                      )}
                      {calculation.foodAllowance > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Prime de nourriture:</span>
                          <span>{formatCurrency(calculation.foodAllowance)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span>Autres indemnités:</span>
                        <span>{formatCurrency(calculation.allowances)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Prime/Bonus:</span>
                        <span>{formatCurrency(calculation.bonus)}</span>
                      </div>
                      
                      {/* Détail des heures supplémentaires */}
                      {calculation.overtimeHours > 0 && (
                        <>
                          <div className="flex justify-between text-orange-600">
                            <span>Heures supplémentaires total:</span>
                            <span>{formatCurrency(calculation.overtimePay)}</span>
                          </div>
                          {calculation.overtimeBreakdown.normal1to4 > 0 && (
                            <div className="flex justify-between text-orange-600 pl-4">
                              <span className="text-xs">Heures 1-4 (30%):</span>
                              <span className="text-xs">{formatCurrency(calculation.overtimeBreakdown.normal1to4)}</span>
                            </div>
                          )}
                          {calculation.overtimeBreakdown.normal5plus > 0 && (
                            <div className="flex justify-between text-orange-600 pl-4">
                              <span className="text-xs">Heures 5+ (60%):</span>
                              <span className="text-xs">{formatCurrency(calculation.overtimeBreakdown.normal5plus)}</span>
                            </div>
                          )}
                          {calculation.overtimeBreakdown.night1to4 > 0 && (
                            <div className="flex justify-between text-orange-600 pl-4">
                              <span className="text-xs">Heures nuit 1-4 (50%):</span>
                              <span className="text-xs">{formatCurrency(calculation.overtimeBreakdown.night1to4)}</span>
                            </div>
                          )}
                          {calculation.overtimeBreakdown.night5plus > 0 && (
                            <div className="flex justify-between text-orange-600 pl-4">
                              <span className="text-xs">Heures nuit 5+ (80%):</span>
                              <span className="text-xs">{formatCurrency(calculation.overtimeBreakdown.night5plus)}</span>
                            </div>
                          )}
                        </>
                      )}
                      
                      <div className="flex justify-between">
                        <span>13ème mois:</span>
                        <span>{formatCurrency(calculation.thirteenthMonth)}</span>
                      </div>
                      
                      {/* Résumé des primes exonérées */}
                      {(calculation.housingAllowance > 0 || calculation.transportAllowance > 0 || calculation.livingAllowance > 0 || calculation.foodAllowance > 0) && (
                        <>
                          <div className="flex justify-between text-green-600 border-t pt-2">
                            <span className="font-medium">Total primes exonérées:</span>
                            <span className="font-medium">{formatCurrency(calculation.exemptAllowances)}</span>
                          </div>
                          <div className="flex justify-between text-green-600 text-xs">
                            <span>Plafond utilisé (25% du brut):</span>
                            <span>{formatCurrency(calculation.exemptAllowancesTotal)} / {formatCurrency(calculation.exemptAllowancesCap)}</span>
                          </div>
                        </>
                      )}
                      
                      <div className="flex justify-between border-t pt-2 font-medium">
                        <span>Total brut:</span>
                        <span>{formatCurrency(calculation.grossSalary)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Détails du calcul RTS */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Calcul du Salaire Imposable (RTS)</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Salaire brut:</span>
                        <span>{formatCurrency(calculation.grossSalary)}</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>CNSS salariale:</span>
                        <span>- {formatCurrency(calculation.socialContributions.cnss)}</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>Primes exonérées (max 25%):</span>
                        <span>- {formatCurrency(calculation.exemptAllowancesTotal)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-1 font-medium">
                        <span>Salaire imposable:</span>
                        <span>{formatCurrency(calculation.taxableIncome)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Détails des déductions */}
                  <div>
                    <h3 className="font-semibold mb-2">Déductions Salariales</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-red-600">
                        <span>Impôt sur le revenu (RTS):</span>
                        <span>- {formatCurrency(calculation.incomeTax)}</span>
                      </div>
                      <div className="flex justify-between text-orange-600">
                        <span>Cotisation CNSS:</span>
                        <span>- {formatCurrency(calculation.socialContributions.cnss)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 font-medium text-red-600">
                        <span>Total déductions:</span>
                        <span>- {formatCurrency(calculation.totalDeductions)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charges Employeur */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                    <Building className="h-5 w-5 text-yellow-600" />
                    <span>Charges Patronales</span>
                  </h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium text-blue-800">CNSS Patronale</p>
                        <p className="text-sm text-blue-700">18% (plafonnée)</p>
                      </div>
                      <p className="text-lg font-bold text-blue-600">
                        {formatCurrency(calculation.employerCharges.cnssEmployer)}
                      </p>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="font-medium text-yellow-800">Versement Forfaitaire</p>
                        <p className="text-sm text-yellow-700">6% de la base VF</p>
                      </div>
                      <p className="text-lg font-bold text-yellow-600">
                        {formatCurrency(calculation.employerCharges.versementForfaitaire)}
                      </p>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-green-800">Total Charges Patronales</p>
                        <p className="text-sm text-green-700">CNSS + VF</p>
                      </div>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(calculation.employerCharges.cnssEmployer + calculation.employerCharges.versementForfaitaire)}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Salaire Brut</p>
                        <p className="font-bold text-gray-800">
                          {formatCurrency(calculation.grossSalary)}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-gray-600">Coût Total Employeur</p>
                        <p className="text-lg font-bold text-yellow-600">
                          {formatCurrency(calculation.employerCharges.total)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700 text-center">
                        <strong>Coût total = Salaire brut + CNSS patronale + Versement Forfaitaire</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryCalculator;