import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, Users, Calculator, Table, X } from 'lucide-react';
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
  
  // État pour le mapping colonne par colonne
  const [columnMapping, setColumnMapping] = useState({
    matricule: { file: null, data: [], preview: [] },
    nom: { file: null, data: [], preview: [] },
    prenom: { file: null, data: [], preview: [] },
    salaireBase: { file: null, data: [], preview: [] },
    primeLogement: { file: null, data: [], preview: [] },
    primeChereteVie: { file: null, data: [], preview: [] },
    primeTransport: { file: null, data: [], preview: [] },
    primeNourriture: { file: null, data: [], preview: [] },
    autresPrimes: { file: null, data: [], preview: [] },
    heuresSupplementaires: { file: null, data: [], preview: [] },
    avantagesNature: { file: null, data: [], preview: [] }
  });

  // Références pour les inputs file de chaque colonne
  const fileInputRefs = useRef({});

  // Fonction pour l'importation globale (existante)
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

  // Nouvelle fonction pour l'importation colonne par colonne
  const handleColumnFileUpload = (columnName, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Vérification du type de fichier
    const validExtensions = ['.csv', '.txt'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      setError(`Format de fichier non supporté pour ${columnName}. Utilisez CSV ou TXT.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const fileData = e.target.result;
        const lines = fileData.split('\n').filter(line => line.trim());
        
        if (lines.length === 0) {
          setError(`Le fichier pour ${columnName} est vide`);
          return;
        }

        // Pour les fichiers colonne par colonne, on suppose qu'il n'y a qu'une seule colonne de données
        const columnData = lines.map(line => line.trim().replace(/"/g, ''));
        
        setColumnMapping(prev => ({
          ...prev,
          [columnName]: {
            file: file.name,
            data: columnData,
            preview: columnData.slice(0, 5) // Aperçu des 5 premières valeurs
          }
        }));

        setError(`✅ Colonne "${columnName}" importée: ${columnData.length} valeurs`);
        
        // Réinitialiser l'input file
        if (fileInputRefs.current[columnName]) {
          fileInputRefs.current[columnName].value = '';
        }
      } catch (err) {
        setError(`Erreur lors de la lecture du fichier pour ${columnName}: ${err.message}`);
      }
    };

    reader.readAsText(file);
  };

  // Fonction pour supprimer une colonne importée
  const removeColumnData = (columnName) => {
    setColumnMapping(prev => ({
      ...prev,
      [columnName]: { file: null, data: [], preview: [] }
    }));
  };

  // Fonction pour combiner toutes les colonnes importées en un seul dataset
  const combineColumnData = () => {
    const columns = Object.keys(columnMapping);
    const columnLengths = columns.map(col => columnMapping[col].data.length);
    const maxLength = Math.max(...columnLengths);
    
    // Vérifier qu'au moins une colonne a été importée
    if (maxLength === 0) {
      setError('Aucune donnée colonne à combiner');
      return;
    }

    // Vérifier que les colonnes critiques sont présentes
    const criticalColumns = ['nom', 'salaireBase'];
    const missingCritical = criticalColumns.filter(col => columnMapping[col].data.length === 0);
    
    if (missingCritical.length > 0) {
      setError(`Colonnes critiques manquantes: ${missingCritical.join(', ')}`);
      return;
    }

    const combinedData = [];
    
    for (let i = 0; i < maxLength; i++) {
      const employee = {};
      columns.forEach(col => {
        if (columnMapping[col].data[i] !== undefined) {
          employee[col] = columnMapping[col].data[i];
        } else {
          employee[col] = ''; // Valeur vide pour les données manquantes
        }
      });
      combinedData.push(employee);
    }

    setImportData(combinedData);
    setError(`✅ Données combinées avec succès: ${combinedData.length} employé(s)`);
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
          
          if (!fullName || !employeeData.salaireBase) {
            console.warn(`Données incomplètes pour l'employé: ${fullName}`);
            continue;
          }

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
              position: '',
              department: '',
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
        `"${item.employee.fullName.split(' ')[0]}"`,
        `"${item.employee.fullName.split(' ').slice(1).join(' ')}"`,
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

  // Fonction pour télécharger un template de colonne individuelle
  const downloadColumnTemplate = (columnName) => {
    const examples = {
      matricule: 'EMP001\nEMP002\nEMP003',
      nom: 'Diallo\nConde\nBah',
      prenom: 'Mamadou\nFatou\nIbrahima',
      salaireBase: '5000000\n4500000\n6000000',
      primeLogement: '250000\n200000\n300000',
      primeChereteVie: '150000\n120000\n180000',
      primeTransport: '100000\n80000\n120000',
      primeNourriture: '80000\n60000\n100000',
      autresPrimes: '100000\n80000\n120000',
      heuresSupplementaires: '50000\n40000\n60000',
      avantagesNature: '0\n0\n0'
    };

    const content = examples[columnName] || 'Valeur1\nValeur2\nValeur3';
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `template-${columnName}.txt`);
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
              Importez un fichier complet ou colonne par colonne pour calculer les salaires de plusieurs employés
            </p>
          </div>
        </div>

        {error && (
          <div className={`mb-6 p-4 rounded-lg ${
            error.includes('✅') 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <p>{error}</p>
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
            {/* Importation Globale */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Upload className="h-5 w-5 text-blue-600" />
                <span>Importation Globale</span>
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Télécharger le Template Complet
                  </label>
                  <Button
                    onClick={downloadTemplate}
                    variant="outline"
                    className="w-full flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Télécharger Template CSV Complet</span>
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    Utilisez ce template si vous avez toutes les données dans un seul fichier
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Importer le Fichier CSV Complet
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
              </div>
            </div>

            {/* Importation Colonne par Colonne - NOUVELLE SECTION */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Table className="h-5 w-5 text-green-600" />
                <span>Importation Colonne par Colonne</span>
              </h2>
              
              <div className="mb-4 p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">📋 Instructions d'importation colonne par colonne</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• <strong>Formats acceptés:</strong> CSV, TXT (une valeur par ligne)</li>
                  <li>• <strong>Pas d'en-têtes</strong> dans les fichiers de colonnes</li>
                  <li>• Les fichiers doivent contenir <strong>une seule colonne de données</strong></li>
                  <li>• L'ordre des lignes doit correspondre entre les différentes colonnes</li>
                  <li>• <strong>Colonnes obligatoires:</strong> nom, salaireBase</li>
                </ul>
              </div>

              {/* Tableau d'importation colonne par colonne */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(columnMapping).map(([columnName, columnData]) => (
                    <div key={columnName} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-800 capitalize">
                            {columnName.replace(/([A-Z])/g, ' $1')}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {columnData.data.length > 0 
                              ? `${columnData.data.length} valeurs` 
                              : 'Non importé'
                            }
                          </p>
                        </div>
                        {columnData.data.length > 0 && (
                          <button
                            onClick={() => removeColumnData(columnName)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <div className="space-y-2">
                        <input
                          type="file"
                          accept=".csv,.txt"
                          onChange={(e) => handleColumnFileUpload(columnName, e)}
                          ref={el => fileInputRefs.current[columnName] = el}
                          className="hidden"
                          id={`file-${columnName}`}
                        />
                        <label htmlFor={`file-${columnName}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full flex items-center space-x-2"
                          >
                            <Upload className="h-3 w-3" />
                            <span>Importer {columnName}</span>
                          </Button>
                        </label>

                        <Button
                          onClick={() => downloadColumnTemplate(columnName)}
                          variant="ghost"
                          size="sm"
                          className="w-full text-xs"
                        >
                          Télécharger template
                        </Button>
                      </div>

                      {/* Aperçu des données importées */}
                      {columnData.preview.length > 0 && (
                        <div className="mt-3 p-2 bg-white rounded border text-xs">
                          <p className="font-medium mb-1">Aperçu:</p>
                          {columnData.preview.map((value, index) => (
                            <div key={index} className="truncate text-gray-600">
                              {value || <span className="text-gray-400">(vide)</span>}
                            </div>
                          ))}
                          {columnData.data.length > 5 && (
                            <p className="text-gray-500 text-center mt-1">
                              ... et {columnData.data.length - 5} autres
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Bouton pour combiner les colonnes */}
                <div className="flex justify-center mt-6">
                  <Button
                    onClick={combineColumnData}
                    disabled={Object.values(columnMapping).every(col => col.data.length === 0)}
                    className="flex items-center space-x-2"
                  >
                    <Table className="h-4 w-4" />
                    <span>Combiner toutes les colonnes</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Structure du Fichier */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">Structure du Fichier</h2>
              <div className="space-y-3">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="border border-gray-300 px-3 py-2 text-left font-medium">Colonne</th>
                        <th className="border border-gray-300 px-3 py-2 text-left font-medium">Description</th>
                        <th className="border border-gray-300 px-3 py-2 text-left font-medium">Obligatoire</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2 bg-gray-50 font-medium">matricule</td>
                        <td className="border border-gray-300 px-3 py-2">Numéro matricule de l'employé</td>
                        <td className="border border-gray-300 px-3 py-2 bg-yellow-50 text-center">Optionnel</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2 bg-gray-50 font-medium">nom</td>
                        <td className="border border-gray-300 px-3 py-2">Nom de famille</td>
                        <td className="border border-gray-300 px-3 py-2 bg-red-50 text-center">Obligatoire</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2 bg-gray-50 font-medium">prenom</td>
                        <td className="border border-gray-300 px-3 py-2">Prénom</td>
                        <td className="border border-gray-300 px-3 py-2 bg-yellow-50 text-center">Optionnel</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2 bg-gray-50 font-medium">salaireBase</td>
                        <td className="border border-gray-300 px-3 py-2">Salaire de base (GNF)</td>
                        <td className="border border-gray-300 px-3 py-2 bg-red-50 text-center">Obligatoire</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2 bg-gray-50 font-medium">primeLogement</td>
                        <td className="border border-gray-300 px-3 py-2">Prime de logement (GNF)</td>
                        <td className="border border-gray-300 px-3 py-2 bg-green-50 text-center">Optionnel</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2 bg-gray-50 font-medium">primeChereteVie</td>
                        <td className="border border-gray-300 px-3 py-2">Prime de cherté de vie (GNF)</td>
                        <td className="border border-gray-300 px-3 py-2 bg-green-50 text-center">Optionnel</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2 bg-gray-50 font-medium">primeTransport</td>
                        <td className="border border-gray-300 px-3 py-2">Prime de transport (GNF)</td>
                        <td className="border border-gray-300 px-3 py-2 bg-green-50 text-center">Optionnel</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2 bg-gray-50 font-medium">primeNourriture</td>
                        <td className="border border-gray-300 px-3 py-2">Prime de nourriture (GNF)</td>
                        <td className="border border-gray-300 px-3 py-2 bg-green-50 text-center">Optionnel</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2 bg-gray-50 font-medium">autresPrimes</td>
                        <td className="border border-gray-300 px-3 py-2">Autres primes non-exonérées (GNF)</td>
                        <td className="border border-gray-300 px-3 py-2 bg-green-50 text-center">Optionnel</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2 bg-gray-50 font-medium">heuresSupplementaires</td>
                        <td className="border border-gray-300 px-3 py-2">Montant heures supplémentaires (GNF)</td>
                        <td className="border border-gray-300 px-3 py-2 bg-green-50 text-center">Optionnel</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2 bg-gray-50 font-medium">avantagesNature</td>
                        <td className="border border-gray-300 px-3 py-2">Avantages en nature (GNF)</td>
                        <td className="border border-gray-300 px-3 py-2 bg-green-50 text-center">Optionnel</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Bouton de calcul */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <Button
                onClick={processBatchCalculation}
                disabled={loading || importData.length === 0 || !company}
                className="w-full flex items-center space-x-2"
                size="lg"
              >
                <Calculator className="h-5 w-5" />
                <span>
                  {loading ? 'Traitement en cours...' : `Calculer ${importData.length} salarié(s)`}
                </span>
              </Button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                {importData.length > 0 
                  ? `✅ ${importData.length} employé(s) prêt(s) pour le calcul` 
                  : 'Aucune donnée à calculer'
                }
              </p>
            </div>

            {/* Aperçu des données importées */}
            {importData.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
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
                          <td className="px-4 py-2">{employee.matricule || '-'}</td>
                          <td className="px-4 py-2">{employee.nom || '-'}</td>
                          <td className="px-4 py-2">{employee.prenom || '-'}</td>
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

          {/* Section Résultats (inchangée) */}
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