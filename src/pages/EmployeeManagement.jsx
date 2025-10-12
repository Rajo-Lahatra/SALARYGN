import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Edit, Calculator, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    fullName: '',
    employeeId: '',
    position: '',
    department: '',
    employmentType: 'CDI',
    baseSalary: '',
    email: '',
    phone: ''
  });

  // Charger les employés depuis le localStorage au démarrage
  useEffect(() => {
    const savedEmployees = localStorage.getItem('employees');
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees));
    } else {
      // Données par défaut si aucun employé n'est sauvegardé
      setEmployees([
        {
          id: 1,
          fullName: "Mamadou Diallo",
          employeeId: "EMP001",
          position: "Développeur Senior",
          department: "IT",
          employmentType: "CDI",
          baseSalary: 5000000,
          email: "mamadou.diallo@entreprise.gn",
          phone: "+224 622 123 456"
        },
        {
          id: 2,
          fullName: "Fatoumata Camara", 
          employeeId: "EMP002",
          position: "Responsable RH",
          department: "RH",
          employmentType: "CDI",
          baseSalary: 4500000,
          email: "fatoumata.camara@entreprise.gn",
          phone: "+224 664 789 012"
        }
      ]);
    }
  }, []);

  // Sauvegarder les employés dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  const filteredEmployees = employees.filter(employee =>
    employee.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEmployee = () => {
    if (!newEmployee.fullName || !newEmployee.position || !newEmployee.baseSalary) {
      alert('Veuillez remplir les champs obligatoires');
      return;
    }

    const employee = {
      ...newEmployee,
      id: Date.now(),
      baseSalary: parseInt(newEmployee.baseSalary)
    };

    setEmployees(prev => [...prev, employee]);
    setNewEmployee({
      fullName: '',
      employeeId: '',
      position: '',
      department: '',
      employmentType: 'CDI',
      baseSalary: '',
      email: '',
      phone: ''
    });
    setShowAddForm(false);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
  };

  const handleUpdateEmployee = () => {
    if (!editingEmployee.fullName || !editingEmployee.position || !editingEmployee.baseSalary) {
      alert('Veuillez remplir les champs obligatoires');
      return;
    }

    setEmployees(prev => 
      prev.map(emp => 
        emp.id === editingEmployee.id ? editingEmployee : emp
      )
    );
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = (employeeId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
    }
  };

  const handleCalculateSalary = (employee) => {
    // Sauvegarder l'employé dans le localStorage pour le calculateur
    localStorage.setItem('currentEmployee', JSON.stringify(employee));
    // Rediriger vers le calculateur
    window.location.href = '/calculator';
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Nom,Matricule,Poste,Département,Type contrat,Salaire base,Email,Téléphone\n"
      + employees.map(emp => 
          `"${emp.fullName}","${emp.employeeId}","${emp.position}","${emp.department}","${emp.employmentType}",${emp.baseSalary},"${emp.email}","${emp.phone}"`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "employes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const departments = ['IT', 'RH', 'Finance', 'Marketing', 'Ventes', 'Production', 'Administration'];
  const employmentTypes = ['CDI', 'CDD', 'Stage', 'Consultant'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Employés</h1>
            <p className="text-gray-600">Gérez votre base de données d'employés</p>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Nouvel Employé</span>
          </Button>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un employé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filtrer</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center space-x-2"
              onClick={handleExport}
            >
              <Download className="h-4 w-4" />
              <span>Exporter</span>
            </Button>
          </div>
        </div>

        {/* Tableau des employés */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employé
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Poste
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Département
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salaire Base
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">{employee.fullName}</div>
                        <div className="text-sm text-gray-500">{employee.employeeId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {employee.employmentType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Intl.NumberFormat('fr-GN', {
                        style: 'currency',
                        currency: 'GNF',
                        minimumFractionDigits: 0
                      }).format(employee.baseSalary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditEmployee(employee)}
                        className="flex items-center space-x-1"
                      >
                        <Edit className="h-3 w-3" />
                        <span>Modifier</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCalculateSalary(employee)}
                        className="flex items-center space-x-1"
                      >
                        <Calculator className="h-3 w-3" />
                        <span>Calculer</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal d'ajout d'employé */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Nouvel Employé</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom Complet *
                  </label>
                  <Input
                    value={newEmployee.fullName}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Mamadou Diallo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Matricule
                  </label>
                  <Input
                    value={newEmployee.employeeId}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, employeeId: e.target.value }))}
                    placeholder="EMP001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Poste *
                  </label>
                  <Input
                    value={newEmployee.position}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, position: e.target.value }))}
                    placeholder="Développeur Senior"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Département
                  </label>
                  <select
                    value={newEmployee.department}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="">Sélectionner un département</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type de Contrat
                  </label>
                  <select
                    value={newEmployee.employmentType}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, employmentType: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  >
                    {employmentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salaire de Base (GNF) *
                  </label>
                  <Input
                    type="number"
                    value={newEmployee.baseSalary}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, baseSalary: e.target.value }))}
                    placeholder="5000000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@entreprise.gn"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <Input
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+224 123 45 67 89"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    onClick={handleAddEmployee}
                    className="flex-1"
                  >
                    Ajouter
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de modification d'employé */}
        {editingEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Modifier l'Employé</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom Complet *
                  </label>
                  <Input
                    value={editingEmployee.fullName}
                    onChange={(e) => setEditingEmployee(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Mamadou Diallo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Matricule
                  </label>
                  <Input
                    value={editingEmployee.employeeId}
                    onChange={(e) => setEditingEmployee(prev => ({ ...prev, employeeId: e.target.value }))}
                    placeholder="EMP001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Poste *
                  </label>
                  <Input
                    value={editingEmployee.position}
                    onChange={(e) => setEditingEmployee(prev => ({ ...prev, position: e.target.value }))}
                    placeholder="Développeur Senior"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Département
                  </label>
                  <select
                    value={editingEmployee.department}
                    onChange={(e) => setEditingEmployee(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="">Sélectionner un département</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type de Contrat
                  </label>
                  <select
                    value={editingEmployee.employmentType}
                    onChange={(e) => setEditingEmployee(prev => ({ ...prev, employmentType: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  >
                    {employmentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salaire de Base (GNF) *
                  </label>
                  <Input
                    type="number"
                    value={editingEmployee.baseSalary}
                    onChange={(e) => setEditingEmployee(prev => ({ ...prev, baseSalary: parseInt(e.target.value) || 0 }))}
                    placeholder="5000000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={editingEmployee.email}
                    onChange={(e) => setEditingEmployee(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@entreprise.gn"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <Input
                    value={editingEmployee.phone}
                    onChange={(e) => setEditingEmployee(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+224 123 45 67 89"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    onClick={handleUpdateEmployee}
                    className="flex-1"
                  >
                    Enregistrer
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditingEmployee(null)}
                    className="flex-1"
                  >
                    Annuler
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

export default EmployeeManagement;