import React, { useState } from 'react';
import SalaryCalculator from './pages/SalaryCalculator';
import EmployeeManagement from './pages/EmployeeManagement';

function App() {
  const [currentPage, setCurrentPage] = useState('calculator');

  const navigation = [
    { id: 'calculator', name: 'Calculateur', icon: '🧮' },
    { id: 'employees', name: 'Employés', icon: '👥' },
    { id: 'reports', name: 'Rapports', icon: '📊' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">💰</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">SALARYGN</h1>
            </div>
            
            <div className="flex space-x-1">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main>
        {currentPage === 'calculator' && <SalaryCalculator />}
        {currentPage === 'employees' && <EmployeeManagement />}
        {currentPage === 'reports' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Rapports</h1>
            <p className="text-gray-600">Module de rapports en développement...</p>
          </div>
        )}
      </main>

      {/* Pied de page */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>© 2024 SALARYGN - Conforme au barème fiscal guinéen</p>
            <p className="mt-1">Tranches: 0% (0-1M), 5% (1M-3M), 8% (3M-5M), 10% (5M-10M), 15% (10M-20M), 20% (20M+)</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
