import React, { useState } from 'react';
import { Upload, Download, FileText, Users, Calculator } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useSalaryData } from '../hooks/useSalaryData';
import { calculateNetSalary } from '../utils/taxCalculator';

const BatchSalaryImport = () => {
  const { user } = useAuth();
  const { company, saveEmployee } = useSalaryData();
  const [importData, setImportData] = useState([]);
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvData = e.target.result;
        const lines = csvData.split('\n');
        const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
        
        const parsedData = lines.slice(1).filter(line => line.trim()).map(line => {
          const values = line.split(',').map(value => value.trim().replace(/"/g, ''));
          const employee = {};
          
          headers.forEach((header, index) => {
            employee[header] = values[index] || '';
          });
          
          return employee;
        });

        setImportData(parsedData);
        setError('');
      } catch (err) {
        setError('Erreur lors de la lecture du fichier CSV');
        console.error(err);
      }
    };

    reader.readAsText(file);
  };

  const processBatchCalculation = async () => {
    if (!company) {
      setError('Veuillez d\'abord sauvegarder les informations de l\'entreprise');
      return;
    }

    if (importData.length === 0) {
      setError('Aucune donnée à traiter');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const results = [];
      const employeeCount = parseInt(company.employee_count) || 0;

      for (const employeeData of importData) {
        try {
          // Construction du nom complet
          const fullName = `${employeeData.nom || ''} ${employeeData.prenom || ''}`.trim();
          
          // Calcul des autres primes (non-exonérées) qui incluent heures supplémentaires et avantages en nature
          const autresPrimes = parseFloat(employeeData.autresPrimes) || 0;
          const heuresSupplementaires = parseFloat(employeeData.heuresSupplementaires) || 0;
          const avantagesNature = parseFloat(employeeData.avantagesNature) || 0;
          
          const totalAllowances = autresPrimes + heuresSupplementaires + avantagesNature;

          const salaryData = {
            baseSalary: parseFloat(employeeData.salaireBase) || 0,
            housingAllowance: parseFloat(employeeData.primeLogement) || 0,
            livingAllowance: parseFloat(employeeData.primeChereteVie) || 0,
            transportAllowance: parseFloat(employeeData.primeTransport) || 0,
            foodAllowance: parseFloat(employeeData.primeNourriture) || 0,
            allowances: totalAllowances,
            bonus: 0,
            thirteenthMonth: 0,
            overtimeData: {
              normal1to4: 0,
              normal5plus: 0,
              night1to4: 0,
              night5plus: 0
            }
          };

          const calculation = calculateNetSalary(salaryData, employeeCount);

          results.push({
            employee: {
              fullName: fullName,
              employeeId: employeeData.matricule || '',
              position: '', // À définir si nécessaire
              department: '', // À définir si nécessaire
              employmentType: 'CDI'
            },
            salaryData,
            calculation,
            details: {
              autresPrimes,
              heuresSupplementaires,
              avantagesNature
            }
          });

          // Sauvegarder l'employé si l'utilisateur est connecté
          if (user && fullName) {
            await saveEmployee({
              fullName: fullName,
              employeeId: employeeData.matricule || '',
              position: '',
              department: '',
              employmentType: 'CDI',
              baseSalary: employeeData.salaireBase
            });
          }
        } catch (err) {
          console.error(`Erreur avec l'employé ${employeeData.nom} ${employeeData.prenom}:`, err);
        }
      }

      setCalculations(results);
    } catch (err) {
      setError('Erreur lors du traitement par lot: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportResults = () => {
    if (calculations.length === 0) return;

    const headers = [
      'Matricule',
      'Nom',
      'Prénom',
      'Salaire Base',
      'Prime Logement',
      'Prime Cherté Vie',
      'Prime Transport',
      'Prime Nourriture',
      'Autres Primes',
      'Heures Supplémentaires',
      'Avantages Nature',
      'Salaire Brut',
      'Salaire Net',
      'Impôt RTS',
      'CNSS Salariale',
      'Total Déductions',
      'Coût Employeur'
    ];

    const csvContent = [
      headers.join(','),
      ...calculations.map(item => [
        `"${item.employee.employeeId}"`,
        `"${item.employee.fullName.split(' ')[0]}"`, // Nom
        `"${item.employee.fullName.split(' ').slice(1).join(' ')}"`, // Prénom
        item.salaryData.baseSalary,
        item.salaryData.housingAllowance,
        item.salaryData.livingAllowance,
        item.salaryData.transportAllowance,
        item.salaryData.foodAllowance,
        item.details.autresPrimes,
        item.details.heuresSupplementaires,
        item.details.avantagesNature,
        item.calculation.grossSalary,
        item.calculation.netSalary,
        item.calculation.incomeTax,
        item.calculation.socialContributions.cnss,
        item.calculation.totalDeductions,
        item.calculation.employerCharges.total
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `calculs-salaires-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadTemplate = () => {
    const templateHeaders = [
      'matricule',
      'nom',
      'prenom',
      'salaireBase',
      'primeLogement',
      'primeChereteVie',
      'primeTransport',
      'primeNourriture',
      'autresPrimes',
      'heuresSupplementaires',
      'avantagesNature'
    ];

    const templateContent = [
      templateHeaders.join(','),
      'EMP001,Diallo,Mamadou,5000000,250000,150000,100000,80000,100000,50000,0',
      'EMP002,Conde,Fatou,4500000,200000,120000,80000,60000,80000,40000,0',
      'EMP003,Bah,Ibrahima,6000000,300000,180000,120000,100000,120000,60000,0'
    ].join('\n');

    const blob = new Blob([templateContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'template-import-salaires.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Importation par Lot</h1>
            <p className="text-gray-600">
              Importez un fichier Excel/CSV pour calculer les salaires de plusieurs employés en une seule fois
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {!company && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700">
              <strong>Information :</strong> Vous devez d'abord sauvegarder les informations de votre entreprise dans le calculateur de salaire.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Section Import */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Upload className="h-5 w-5 text-blue-600" />
                <span>Importation des Données</span>
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Télécharger le Template
                  </label>
                  <Button
                    onClick={downloadTemplate}
                    variant="outline"
                    className="w-full flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Télécharger Template CSV</span>
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    Utilisez ce template avec les colonnes adaptées à votre structure
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Importer le Fichier CSV
                  </label>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Formats supportés: CSV, Excel (.xlsx, .xls)
                  </p>
                </div>

                <Button
                  onClick={processBatchCalculation}
                  disabled={loading || importData.length === 0 || !company}
                  className="w-full flex items-center space-x-2"
                >
                  <Calculator className="h-4 w-4" />
                  <span>
                    {loading ? 'Traitement en cours...' : `Calculer ${importData.length} salarié(s)`}
                  </span>
                </Button>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">Structure du Fichier</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">Colonne</div>
                  <div className="font-medium">Description</div>
                  
                  <div className="bg-gray-50 p-2">matricule</div>
                  <div className="bg-gray-50 p-2">Numéro matricule de l'employé</div>
                  
                  <div className="bg-gray-50 p-2">nom</div>
                  <div className="bg-gray-50 p-2">Nom de famille</div>
                  
                  <div className="bg-gray-50 p-2">prenom</div>
                  <div className="bg-gray-50 p-2">Prénom</div>
                  
                  <div className="bg-gray-50 p-2">salaireBase</div>
                  <div className="bg-gray-50 p-2">Salaire de base (GNF)</div>
                  
                  <div className="bg-gray-50 p-2">primeLogement</div>
                  <div className="bg-gray-50 p-2">Prime de logement (GNF)</div>
                  
                  <div className="bg-gray-50 p-2">primeChereteVie</div>
                  <div className="bg-gray-50 p-2">Prime de cherté de vie (GNF)</div>
                  
                  <div className="bg-gray-50 p-2">primeTransport</div>
                  <div className="bg-gray-50 p-2">Prime de transport (GNF)</div>
                  
                  <div className="bg-gray-50 p-2">primeNourriture</div>
                  <div className="bg-gray-50 p-2">Prime de nourriture (GNF)</div>
                  
                  <div className="bg-gray-50 p-2">autresPrimes</div>
                  <div className="bg-gray-50 p-2">Autres primes non-exonérées (GNF)</div>
                  
                  <div className="bg-gray-50 p-2">heuresSupplementaires</div>
                  <div className="bg-gray-50 p-2">Montant heures supplémentaires (GNF)</div>
                  
                  <div className="bg-gray-50 p-2">avantagesNature</div>
                  <div className="bg-gray-50 p-2">Avantages en nature (GNF)</div>
                </div>
              </div>
            </div>

            {/* Aperçu des données importées */}
            {importData.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <span>Aperçu des Données Importées ({importData.length} salariés)</span>
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Matricule</th>
                        <th className="px-4 py-2 text-left">Nom</th>
                        <th className="px-4 py-2 text-left">Prénom</th>
                        <th className="px-4 py-2 text-left">Salaire Base</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {importData.slice(0, 5).map((employee, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">{employee.matricule}</td>
                          <td className="px-4 py-2">{employee.nom}</td>
                          <td className="px-4 py-2">{employee.prenom}</td>
                          <td className="px-4 py-2">
                            {parseFloat(employee.salaireBase || 0).toLocaleString('fr-GN')} FG
                          </td>
                        </tr>
                      ))}
                      {importData.length > 5 && (
                        <tr>
                          <td colSpan="4" className="px-4 py-2 text-center text-gray-500">
                            ... et {importData.length - 5} autres salariés
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Section Résultats */}
          <div className="space-y-6">
            {calculations.length > 0 && (
              <>
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-green-600" />
                      <span>Résultats du Calcul</span>
                    </h2>
                    <Button
                      onClick={exportResults}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Exporter</span>
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600">Total Salariés</p>
                        <p className="text-2xl font-bold text-blue-600">{calculations.length}</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600">Masse Salariale Nette</p>
                        <p className="text-xl font-bold text-green-600">
                          {calculations.reduce((sum, item) => sum + item.calculation.netSalary, 0).toLocaleString('fr-GN')} FG
                        </p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left">Employé</th>
                            <th className="px-4 py-2 text-right">Brut</th>
                            <th className="px-4 py-2 text-right">Net</th>
                            <th className="px-4 py-2 text-right">Coût Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {calculations.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2">
                                <div>
                                  <p className="font-medium">{item.employee.fullName}</p>
                                  <p className="text-xs text-gray-500">{item.employee.employeeId}</p>
                                </div>
                              </td>
                              <td className="px-4 py-2 text-right">
                                {item.calculation.grossSalary.toLocaleString('fr-GN')} FG
                              </td>
                              <td className="px-4 py-2 text-right">
                                {item.calculation.netSalary.toLocaleString('fr-GN')} FG
                              </td>
                              <td className="px-4 py-2 text-right">
                                {item.calculation.employerCharges.total.toLocaleString('fr-GN')} FG
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Détails des calculs */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold mb-4">Détails des Primes et Suppléments</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left">Employé</th>
                          <th className="px-4 py-2 text-right">Prime Logement</th>
                          <th className="px-4 py-2 text-right">Prime Transport</th>
                          <th className="px-4 py-2 text-right">Heures Supp</th>
                          <th className="px-4 py-2 text-right">Autres Primes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {calculations.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2">
                              <p className="font-medium">{item.employee.fullName}</p>
                            </td>
                            <td className="px-4 py-2 text-right">
                              {item.salaryData.housingAllowance.toLocaleString('fr-GN')} FG
                            </td>
                            <td className="px-4 py-2 text-right">
                              {item.salaryData.transportAllowance.toLocaleString('fr-GN')} FG
                            </td>
                            <td className="px-4 py-2 text-right">
                              {item.details.heuresSupplementaires.toLocaleString('fr-GN')} FG
                            </td>
                            <td className="px-4 py-2 text-right">
                              {item.details.autresPrimes.toLocaleString('fr-GN')} FG
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchSalaryImport;