import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Download, Filter, Users, DollarSign, TrendingUp, PieChart as PieChartIcon,
  Building, Calendar, FileText, Save, Edit, Eye, Trash2
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useSalaryData } from '../hooks/useSalaryData';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency } from '../utils/taxCalculator';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Reports = () => {
  const { user } = useAuth();
  const { calculations, employees, company, loading, saveCalculation, deleteCalculation } = useSalaryData();
  const [timeRange, setTimeRange] = useState('month');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [reportData, setReportData] = useState(null);
  const [detailedView, setDetailedView] = useState(false);
  const [savedReports, setSavedReports] = useState([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [reportName, setReportName] = useState('');

  // Couleurs pour les graphiques
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  // Générer les données de rapport
  useEffect(() => {
    if (calculations.length > 0) {
      generateReportData();
    }
  }, [calculations, timeRange, selectedYear, selectedMonth]);

  // Charger les rapports sauvegardés
  useEffect(() => {
    loadSavedReports();
  }, []);

  const loadSavedReports = () => {
    try {
      const saved = localStorage.getItem('savedReports');
      if (saved) {
        setSavedReports(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Erreur chargement rapports sauvegardés:', error);
    }
  };

  const saveCurrentReport = () => {
    if (!reportData || !reportName.trim()) return;

    const newReport = {
      id: Date.now().toString(),
      name: reportName,
      period: getFormattedPeriod(),
      data: reportData,
      filters: {
        timeRange,
        selectedYear,
        selectedMonth
      },
      createdAt: new Date().toISOString(),
      calculationsCount: reportData.totalCalculations
    };

    const updatedReports = [...savedReports, newReport];
    setSavedReports(updatedReports);
    localStorage.setItem('savedReports', JSON.stringify(updatedReports));
    
    setShowSaveDialog(false);
    setReportName('');
  };

  const deleteSavedReport = (reportId) => {
    const updatedReports = savedReports.filter(report => report.id !== reportId);
    setSavedReports(updatedReports);
    localStorage.setItem('savedReports', JSON.stringify(updatedReports));
  };

  const loadSavedReport = (report) => {
    setReportData(report.data);
    setTimeRange(report.filters.timeRange);
    setSelectedYear(report.filters.selectedYear);
    setSelectedMonth(report.filters.selectedMonth);
  };

  const generateReportData = () => {
    // Filtrer les calculs selon la période sélectionnée
    const filteredCalculations = calculations.filter(calc => {
      if (!calc.period) return false;
      
      const [year, month] = calc.period.split('-').map(Number);
      
      if (timeRange === 'month') {
        return year === selectedYear && month === selectedMonth;
      } else if (timeRange === 'quarter') {
        const quarter = Math.ceil(month / 3);
        const selectedQuarter = Math.ceil(selectedMonth / 3);
        return year === selectedYear && quarter === selectedQuarter;
      } else {
        return year === selectedYear;
      }
    });

    if (filteredCalculations.length === 0) {
      setReportData(null);
      return;
    }

    // Statistiques de base
    const totalEmployees = employees.length;
    const totalCalculations = filteredCalculations.length;
    
    // Agrégation des données salariales
    const salaryStats = filteredCalculations.reduce((acc, calc) => {
      const result = calc.result_data;
      return {
        totalGross: acc.totalGross + result.grossSalary,
        totalNet: acc.totalNet + result.netSalary,
        totalTax: acc.totalTax + result.incomeTax,
        totalCNSS: acc.totalCNSS + result.socialContributions.cnss,
        totalEmployerCost: acc.totalEmployerCost + result.employerCharges.total,
        totalEmployerCharges: acc.totalEmployerCharges + result.employerCharges.totalCharges,
        totalVersementForfaitaire: acc.totalVersementForfaitaire + result.employerCharges.versementForfaitaire,
        totalCNSSEmployer: acc.totalCNSSEmployer + result.employerCharges.cnssEmployer,
        totalTaxeApprentissage: acc.totalTaxeApprentissage + result.employerCharges.taxeApprentissage,
        totalONFPP: acc.totalONFPP + result.employerCharges.onfpp,
        count: acc.count + 1
      };
    }, {
      totalGross: 0,
      totalNet: 0,
      totalTax: 0,
      totalCNSS: 0,
      totalEmployerCost: 0,
      totalEmployerCharges: 0,
      totalVersementForfaitaire: 0,
      totalCNSSEmployer: 0,
      totalTaxeApprentissage: 0,
      totalONFPP: 0,
      count: 0
    });

    // Données par département
    const departmentData = filteredCalculations.reduce((acc, calc) => {
      const dept = calc.input_data?.employee?.department || 'Non spécifié';
      if (!acc[dept]) {
        acc[dept] = { 
          totalGross: 0, 
          totalNet: 0, 
          totalTax: 0,
          totalCNSS: 0,
          totalEmployerCharges: 0,
          count: 0 
        };
      }
      acc[dept].totalGross += calc.result_data.grossSalary;
      acc[dept].totalNet += calc.result_data.netSalary;
      acc[dept].totalTax += calc.result_data.incomeTax;
      acc[dept].totalCNSS += calc.result_data.socialContributions.cnss;
      acc[dept].totalEmployerCharges += calc.result_data.employerCharges.totalCharges;
      acc[dept].count += 1;
      return acc;
    }, {});

    // Données pour graphique temporel (12 derniers mois)
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(selectedYear, selectedMonth - 1 - i, 1);
      const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      const monthCalculations = calculations.filter(calc => calc.period === monthYear);
      
      const monthStats = monthCalculations.reduce((acc, calc) => ({
        totalGross: acc.totalGross + calc.result_data.grossSalary,
        totalNet: acc.totalNet + calc.result_data.netSalary,
        totalTax: acc.totalTax + calc.result_data.incomeTax,
        totalCNSS: acc.totalCNSS + calc.result_data.socialContributions.cnss,
        totalEmployerCharges: acc.totalEmployerCharges + calc.result_data.employerCharges.totalCharges,
        count: acc.count + 1
      }), { 
        totalGross: 0, 
        totalNet: 0, 
        totalTax: 0, 
        totalCNSS: 0,
        totalEmployerCharges: 0,
        count: 0 
      });

      return {
        name: date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
        brut: monthStats.totalGross,
        net: monthStats.totalNet,
        impots: monthStats.totalTax,
        cnss: monthStats.totalCNSS,
        charges_patronales: monthStats.totalEmployerCharges,
        employés: monthStats.count
      };
    }).reverse();

    // Répartition des charges
    const chargesData = [
      { name: 'Salaire Net', value: salaryStats.totalNet },
      { name: 'Impôt RTS', value: salaryStats.totalTax },
      { name: 'CNSS Salariale', value: salaryStats.totalCNSS },
      { name: 'Charges Patronales', value: salaryStats.totalEmployerCharges }
    ];

    // Répartition des charges patronales
    const employerChargesData = [
      { name: 'CNSS Patronale', value: salaryStats.totalCNSSEmployer },
      { name: 'Versement Forfaitaire', value: salaryStats.totalVersementForfaitaire },
      { name: company?.employee_count < 30 ? 'Taxe Apprentissage' : 'ONFPP', 
        value: company?.employee_count < 30 ? salaryStats.totalTaxeApprentissage : salaryStats.totalONFPP }
    ];

    // Top 5 des salaires
    const topSalaries = [...filteredCalculations]
      .sort((a, b) => b.result_data.grossSalary - a.result_data.grossSalary)
      .slice(0, 5)
      .map(calc => ({
        name: calc.input_data?.employee?.fullName || 'Non spécifié',
        brut: calc.result_data.grossSalary,
        net: calc.result_data.netSalary,
        impots: calc.result_data.incomeTax,
        cnss: calc.result_data.socialContributions.cnss,
        charges_patronales: calc.result_data.employerCharges.totalCharges
      }));

    // Détails par employé (pour la vue détaillée)
    const employeeDetails = filteredCalculations.map(calc => ({
      id: calc.id,
      name: calc.input_data?.employee?.fullName || 'Non spécifié',
      matricule: calc.input_data?.employee?.employeeId || '-',
      department: calc.input_data?.employee?.department || 'Non spécifié',
      brut: calc.result_data.grossSalary,
      net: calc.result_data.netSalary,
      impots: calc.result_data.incomeTax,
      cnss_salariale: calc.result_data.socialContributions.cnss,
      cnss_patronale: calc.result_data.employerCharges.cnssEmployer,
      versement_forfaitaire: calc.result_data.employerCharges.versementForfaitaire,
      taxe_apprentissage: calc.result_data.employerCharges.taxeApprentissage,
      onfpp: calc.result_data.employerCharges.onfpp,
      total_charges_patronales: calc.result_data.employerCharges.totalCharges,
      cout_total_employeur: calc.result_data.employerCharges.total
    }));

    setReportData({
      salaryStats,
      departmentData: Object.entries(departmentData).map(([name, data]) => ({
        name,
        ...data,
        avgGross: data.totalGross / data.count,
        avgNet: data.totalNet / data.count,
        avgTax: data.totalTax / data.count
      })),
      monthlyData,
      chargesData,
      employerChargesData,
      topSalaries,
      employeeDetails,
      totalEmployees,
      totalCalculations,
      filteredCalculations
    });
  };

  const exportToCSV = () => {
    if (!reportData) return;

    const headers = [
      'Rapport Salarial Détaillé',
      `Période: ${getFormattedPeriod()}`,
      `Entreprise: ${company?.company_name || 'Non spécifiée'}`,
      `Effectif: ${company?.employee_count || 'Non spécifié'}`,
      '',
      'STATISTIQUES GLOBALES',
      'Libellé,Valeur'
    ];

    const stats = [
      ['Total salaires bruts', reportData.salaryStats.totalGross],
      ['Total salaires nets', reportData.salaryStats.totalNet],
      ['Total impôts RTS', reportData.salaryStats.totalTax],
      ['Total CNSS salariale', reportData.salaryStats.totalCNSS],
      ['Total CNSS patronale', reportData.salaryStats.totalCNSSEmployer],
      ['Total versement forfaitaire', reportData.salaryStats.totalVersementForfaitaire],
      ['Total taxe apprentissage', reportData.salaryStats.totalTaxeApprentissage],
      ['Total ONFPP', reportData.salaryStats.totalONFPP],
      ['Total charges patronales', reportData.salaryStats.totalEmployerCharges],
      ['Coût total employeur', reportData.salaryStats.totalEmployerCost],
      ['Nombre de calculs', reportData.totalCalculations],
      ['Nombre d\'employés', reportData.totalEmployees]
    ];

    const departmentHeaders = [
      '',
      'RÉPARTITION PAR DÉPARTEMENT',
      'Département,Salaires bruts,Salaires nets,Impôts RTS,CNSS Salariale,Charges Patronales,Nombre employés,Moyenne brut'
    ];

    const departmentRows = reportData.departmentData.map(dept => [
      dept.name,
      dept.totalGross,
      dept.totalNet,
      dept.totalTax,
      dept.totalCNSS,
      dept.totalEmployerCharges,
      dept.count,
      dept.avgGross
    ]);

    const employeeHeaders = [
      '',
      'DÉTAIL PAR EMPLOYÉ',
      'Nom,Matricule,Département,Salaire Brut,Salaire Net,Impôt RTS,CNSS Salariale,CNSS Patronale,Versement Forfaitaire,' +
      'Taxe Apprentissage,ONFPP,Total Charges Patronales,Coût Total Employeur'
    ];

    const employeeRows = reportData.employeeDetails.map(emp => [
      emp.name,
      emp.matricule,
      emp.department,
      emp.brut,
      emp.net,
      emp.impots,
      emp.cnss_salariale,
      emp.cnss_patronale,
      emp.versement_forfaitaire,
      emp.taxe_apprentissage,
      emp.onfpp,
      emp.total_charges_patronales,
      emp.cout_total_employeur
    ]);

    const csvContent = [
      ...headers,
      ...stats.map(row => row.join(',')),
      ...departmentHeaders,
      ...departmentRows.map(row => row.join(',')),
      ...employeeHeaders,
      ...employeeRows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `rapport-salarial-detail-${getFormattedPeriod().replace(/ /g, '-')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    if (!reportData) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    // En-tête
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('RAPPORT SALARIAL DÉTAILLÉ', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Période: ${getFormattedPeriod()}`, 20, yPosition);
    doc.text(`Entreprise: ${company?.company_name || 'Non spécifiée'}`, pageWidth - 20, yPosition, { align: 'right' });
    yPosition += 8;
    doc.text(`Effectif: ${company?.employee_count || 'Non spécifié'} salariés`, 20, yPosition);
    doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, pageWidth - 20, yPosition, { align: 'right' });
    yPosition += 20;

    // Statistiques globales
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('STATISTIQUES GLOBALES', 20, yPosition);
    yPosition += 10;

    const statsData = [
      ['Total salaires bruts', formatCurrency(reportData.salaryStats.totalGross)],
      ['Total salaires nets', formatCurrency(reportData.salaryStats.totalNet)],
      ['Total impôts RTS', formatCurrency(reportData.salaryStats.totalTax)],
      ['Total CNSS salariale', formatCurrency(reportData.salaryStats.totalCNSS)],
      ['Total charges patronales', formatCurrency(reportData.salaryStats.totalEmployerCharges)],
      ['Coût total employeur', formatCurrency(reportData.salaryStats.totalEmployerCost)],
      ['Nombre de calculs', reportData.totalCalculations.toString()]
    ];

    doc.autoTable({
      startY: yPosition,
      head: [['Libellé', 'Valeur']],
      body: statsData,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [0, 100, 0] }
    });

    yPosition = doc.lastAutoTable.finalY + 15;

    // Répartition par département
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('RÉPARTITION PAR DÉPARTEMENT', 20, yPosition);
    yPosition += 10;

    const deptData = reportData.departmentData.map(dept => [
      dept.name,
      formatCurrency(dept.totalGross),
      formatCurrency(dept.totalNet),
      formatCurrency(dept.totalTax),
      dept.count.toString()
    ]);

    doc.autoTable({
      startY: yPosition,
      head: [['Département', 'Total Brut', 'Total Net', 'Total Impôts', 'Employés']],
      body: deptData,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 100, 0] }
    });

    yPosition = doc.lastAutoTable.finalY + 15;

    // Détail des charges patronales
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DÉTAIL DES CHARGES PATRONALES', 20, yPosition);
    yPosition += 10;

    const chargesData = [
      ['CNSS Patronale', formatCurrency(reportData.salaryStats.totalCNSSEmployer)],
      ['Versement Forfaitaire', formatCurrency(reportData.salaryStats.totalVersementForfaitaire)],
      [company?.employee_count < 30 ? 'Taxe Apprentissage' : 'ONFPP', 
       company?.employee_count < 30 ? 
         formatCurrency(reportData.salaryStats.totalTaxeApprentissage) : 
         formatCurrency(reportData.salaryStats.totalONFPP)],
      ['Total Charges Patronales', formatCurrency(reportData.salaryStats.totalEmployerCharges)]
    ];

    doc.autoTable({
      startY: yPosition,
      head: [['Type de Charge', 'Montant']],
      body: chargesData,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [0, 100, 0] }
    });

    // Nouvelle page pour le détail des employés
    doc.addPage();
    yPosition = 20;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DÉTAIL PAR EMPLOYÉ', 20, yPosition);
    yPosition += 10;

    const employeeData = reportData.employeeDetails.map(emp => [
      emp.name,
      emp.matricule,
      formatCurrency(emp.brut),
      formatCurrency(emp.net),
      formatCurrency(emp.impots),
      formatCurrency(emp.cnss_salariale),
      formatCurrency(emp.total_charges_patronales)
    ]);

    doc.autoTable({
      startY: yPosition,
      head: [['Employé', 'Matricule', 'Brut', 'Net', 'Impôts', 'CNSS Sal', 'Charges Pat']],
      body: employeeData,
      theme: 'grid',
      styles: { fontSize: 7 },
      headStyles: { fillColor: [0, 100, 0] }
    });

    doc.save(`rapport-salarial-${getFormattedPeriod().replace(/ /g, '-')}.pdf`);
  };

  const getFormattedPeriod = () => {
    const monthNames = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    
    if (timeRange === 'month') {
      return `${monthNames[selectedMonth - 1]} ${selectedYear}`;
    } else if (timeRange === 'quarter') {
      const quarter = Math.ceil(selectedMonth / 3);
      return `T${quarter} ${selectedYear}`;
    } else {
      return `Année ${selectedYear}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des données...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-8">
            <p className="text-gray-600">Veuillez vous connecter pour accéder aux rapports.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* En-tête */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Rapports et Statistiques</h1>
            <p className="text-gray-600">
              Analysez vos données salariales et générez des rapports détaillés
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={exportToCSV}
              disabled={!reportData}
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </Button>
            <Button
              onClick={exportToPDF}
              disabled={!reportData}
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export PDF</span>
            </Button>
            <Button
              onClick={() => setShowSaveDialog(true)}
              disabled={!reportData}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Sauvegarder</span>
            </Button>
          </div>
        </div>

        {/* Rapports sauvegardés */}
        {savedReports.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Rapports Sauvegardés</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedReports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800">{report.name}</h3>
                      <p className="text-sm text-gray-600">{report.period}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(report.createdAt).toLocaleDateString('fr-FR')} • {report.calculationsCount} calculs
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => loadSavedReport(report)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Charger ce rapport"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteSavedReport(report.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Supprimer ce rapport"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Période
                </label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="month">Mensuel</option>
                  <option value="quarter">Trimestriel</option>
                  <option value="year">Annuel</option>
                </select>
              </div>

              {timeRange !== 'year' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mois
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <option key={month} value={month}>
                        {new Date(selectedYear, month - 1).toLocaleDateString('fr-FR', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Année
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={generateReportData}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Appliquer</span>
              </Button>
              <Button
                onClick={() => setDetailedView(!detailedView)}
                variant={detailedView ? "default" : "outline"}
                className="flex items-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>{detailedView ? 'Vue Standard' : 'Vue Détaillée'}</span>
              </Button>
            </div>
          </div>

          {company && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Entreprise :</strong> {company.company_name} | 
                <strong> Effectif :</strong> {company.employee_count || 'Non spécifié'} salariés | 
                <strong> Période :</strong> {getFormattedPeriod()}
              </p>
            </div>
          )}
        </div>

        {!reportData ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune donnée disponible</h3>
            <p className="text-gray-500">
              {calculations.length === 0 
                ? 'Commencez par effectuer des calculs de salaire pour générer des rapports.'
                : 'Aucune donnée ne correspond aux critères de filtrage sélectionnés.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Masse Salariale Brut</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(reportData.salaryStats.totalGross)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {reportData.totalCalculations} paie(s) traitée(s)
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Masse Salariale Net</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(reportData.salaryStats.totalNet)}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {((reportData.salaryStats.totalNet / reportData.salaryStats.totalGross) * 100).toFixed(1)}% du brut
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Charges</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {formatCurrency(reportData.salaryStats.totalEmployerCharges)}
                    </p>
                  </div>
                  <Building className="h-8 w-8 text-orange-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  CNSS + VF + {company?.employee_count < 30 ? 'Taxe Apprentissage' : 'ONFPP'}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Impôts RTS</p>
                    <p className="text-2xl font-bold text-red-600">
                      {formatCurrency(reportData.salaryStats.totalTax)}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-red-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {((reportData.salaryStats.totalTax / reportData.salaryStats.totalGross) * 100).toFixed(1)}% du brut
                </p>
              </div>
            </div>

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Évolution mensuelle */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span>Évolution sur 12 mois</span>
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={reportData.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                      <Line type="monotone" dataKey="brut" stroke="#0088FE" name="Salaire Brut" />
                      <Line type="monotone" dataKey="net" stroke="#00C49F" name="Salaire Net" />
                      <Line type="monotone" dataKey="impots" stroke="#FF8042" name="Impôts RTS" />
                      <Line type="monotone" dataKey="charges_patronales" stroke="#8884D8" name="Charges Patronales" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Répartition des charges */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <PieChartIcon className="h-5 w-5 text-green-600" />
                  <span>Répartition des Coûts</span>
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={reportData.chargesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {reportData.chargesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Répartition des charges patronales */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Détail des Charges Patronales</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">CNSS Patronale</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(reportData.salaryStats.totalCNSSEmployer)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">18% du salaire brut plafonné</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Versement Forfaitaire</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(reportData.salaryStats.totalVersementForfaitaire)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">6% de la base VF</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    {company?.employee_count < 30 ? 'Taxe Apprentissage' : 'ONFPP'}
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {company?.employee_count < 30 
                      ? formatCurrency(reportData.salaryStats.totalTaxeApprentissage)
                      : formatCurrency(reportData.salaryStats.totalONFPP)
                    }
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {company?.employee_count < 30 ? '3% du brut' : '1.5% du brut'}
                  </p>
                </div>
              </div>
            </div>

            {/* Tableaux détaillés */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Par département */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4">Par Département</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Département</th>
                        <th className="px-4 py-2 text-right">Salaires Bruts</th>
                        <th className="px-4 py-2 text-right">Salaires Nets</th>
                        <th className="px-4 py-2 text-right">Impôts RTS</th>
                        <th className="px-4 py-2 text-right">Employés</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {reportData.departmentData.map((dept, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 font-medium">{dept.name}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(dept.totalGross)}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(dept.totalNet)}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(dept.totalTax)}</td>
                          <td className="px-4 py-2 text-right">{dept.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top 5 salaires */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4">Top 5 Salaires Bruts</h3>
                <div className="space-y-3">
                  {reportData.topSalaries.map((emp, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{emp.name}</p>
                        <p className="text-sm text-gray-500">
                          Net: {formatCurrency(emp.net)} | Impôts: {formatCurrency(emp.impots)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">{formatCurrency(emp.brut)}</p>
                        <p className="text-xs text-gray-500">
                          {((emp.net / emp.brut) * 100).toFixed(1)}% net
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Vue détaillée des impôts et taxes par employé */}
            {detailedView && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4">Détail des Impôts et Taxes par Employé</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Employé</th>
                        <th className="px-4 py-2 text-left">Matricule</th>
                        <th className="px-4 py-2 text-left">Département</th>
                        <th className="px-4 py-2 text-right">Salaire Brut</th>
                        <th className="px-4 py-2 text-right">Salaire Net</th>
                        <th className="px-4 py-2 text-right">Impôt RTS</th>
                        <th className="px-4 py-2 text-right">CNSS Salariale</th>
                        <th className="px-4 py-2 text-right">CNSS Patronale</th>
                        <th className="px-4 py-2 text-right">Versement Forfaitaire</th>
                        <th className="px-4 py-2 text-right">
                          {company?.employee_count < 30 ? 'Taxe Apprentissage' : 'ONFPP'}
                        </th>
                        <th className="px-4 py-2 text-right">Total Charges</th>
                        <th className="px-4 py-2 text-right">Coût Employeur</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {reportData.employeeDetails.map((emp, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 font-medium">{emp.name}</td>
                          <td className="px-4 py-2">{emp.matricule}</td>
                          <td className="px-4 py-2">{emp.department}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(emp.brut)}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(emp.net)}</td>
                          <td className="px-4 py-2 text-right text-red-600">{formatCurrency(emp.impots)}</td>
                          <td className="px-4 py-2 text-right text-orange-600">{formatCurrency(emp.cnss_salariale)}</td>
                          <td className="px-4 py-2 text-right text-purple-600">{formatCurrency(emp.cnss_patronale)}</td>
                          <td className="px-4 py-2 text-right text-blue-600">{formatCurrency(emp.versement_forfaitaire)}</td>
                          <td className="px-4 py-2 text-right text-green-600">
                            {company?.employee_count < 30 
                              ? formatCurrency(emp.taxe_apprentissage)
                              : formatCurrency(emp.onfpp)
                            }
                          </td>
                          <td className="px-4 py-2 text-right font-medium">{formatCurrency(emp.total_charges_patronales)}</td>
                          <td className="px-4 py-2 text-right font-bold">{formatCurrency(emp.cout_total_employeur)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal de sauvegarde */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Sauvegarder le rapport</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du rapport
                  </label>
                  <input
                    type="text"
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                    placeholder="Ex: Rapport Mensuel Mars 2024"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    onClick={() => setShowSaveDialog(false)}
                    variant="outline"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={saveCurrentReport}
                    disabled={!reportName.trim()}
                  >
                    Sauvegarder
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;