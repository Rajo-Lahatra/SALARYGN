import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Download, Filter, Users, DollarSign, TrendingUp, PieChart as PieChartIcon,
  Building, Calendar, FileText 
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useSalaryData } from '../hooks/useSalaryData';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency } from '../utils/taxCalculator';

const Reports = () => {
  const { user } = useAuth();
  const { calculations, employees, company, loading } = useSalaryData();
  const [timeRange, setTimeRange] = useState('month'); // month, quarter, year
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [reportData, setReportData] = useState(null);

  // Couleurs pour les graphiques
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  // Générer les données de rapport
  useEffect(() => {
    if (calculations.length > 0) {
      generateReportData();
    }
  }, [calculations, timeRange, selectedYear, selectedMonth]);

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
        count: acc.count + 1
      };
    }, {
      totalGross: 0,
      totalNet: 0,
      totalTax: 0,
      totalCNSS: 0,
      totalEmployerCost: 0,
      totalEmployerCharges: 0,
      count: 0
    });

    // Données par département
    const departmentData = filteredCalculations.reduce((acc, calc) => {
      const dept = calc.input_data?.employee?.department || 'Non spécifié';
      if (!acc[dept]) {
        acc[dept] = { totalGross: 0, totalNet: 0, count: 0 };
      }
      acc[dept].totalGross += calc.result_data.grossSalary;
      acc[dept].totalNet += calc.result_data.netSalary;
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
        count: acc.count + 1
      }), { totalGross: 0, totalNet: 0, totalTax: 0, count: 0 });

      return {
        name: date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
        brut: monthStats.totalGross,
        net: monthStats.totalNet,
        impots: monthStats.totalTax,
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

    // Top 5 des salaires
    const topSalaries = [...filteredCalculations]
      .sort((a, b) => b.result_data.grossSalary - a.result_data.grossSalary)
      .slice(0, 5)
      .map(calc => ({
        name: calc.input_data?.employee?.fullName || 'Non spécifié',
        brut: calc.result_data.grossSalary,
        net: calc.result_data.netSalary
      }));

    setReportData({
      salaryStats,
      departmentData: Object.entries(departmentData).map(([name, data]) => ({
        name,
        ...data,
        avgGross: data.totalGross / data.count
      })),
      monthlyData,
      chargesData,
      topSalaries,
      totalEmployees,
      totalCalculations
    });
  };

  const exportToCSV = () => {
    if (!reportData) return;

    const headers = [
      'Rapport Salarial',
      `Période: ${getFormattedPeriod()}`,
      `Entreprise: ${company?.company_name || 'Non spécifiée'}`,
      '',
      'Statistique,Valeur'
    ];

    const stats = [
      ['Total salaires bruts', formatCurrency(reportData.salaryStats.totalGross)],
      ['Total salaires nets', formatCurrency(reportData.salaryStats.totalNet)],
      ['Total impôts RTS', formatCurrency(reportData.salaryStats.totalTax)],
      ['Total CNSS salariale', formatCurrency(reportData.salaryStats.totalCNSS)],
      ['Total charges patronales', formatCurrency(reportData.salaryStats.totalEmployerCharges)],
      ['Coût total employeur', formatCurrency(reportData.salaryStats.totalEmployerCost)],
      ['Nombre de calculs', reportData.totalCalculations],
      ['Nombre d\'employés', reportData.totalEmployees]
    ];

    const csvContent = [
      ...headers,
      ...stats.map(row => row.join(',')),
      '',
      'Département,Salaires bruts,Salaires nets,Nombre employés,Moyenne brut',
      ...reportData.departmentData.map(dept => [
        dept.name,
        dept.totalGross,
        dept.totalNet,
        dept.count,
        dept.avgGross
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `rapport-salarial-${getFormattedPeriod().replace(' ', '-')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <Button
            onClick={exportToCSV}
            disabled={!reportData}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Exporter CSV</span>
          </Button>
        </div>

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

            <Button
              onClick={generateReportData}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Appliquer</span>
            </Button>
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
                        <th className="px-4 py-2 text-right">Moyenne Brut</th>
                        <th className="px-4 py-2 text-right">Employés</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {reportData.departmentData.map((dept, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 font-medium">{dept.name}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(dept.totalGross)}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(dept.avgGross)}</td>
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
                          Net: {formatCurrency(emp.net)}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;