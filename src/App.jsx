import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SalaryCalculator from './pages/SalaryCalculator';
import EmployeeManagement from './pages/EmployeeManagement';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';

// Composant de navigation qui utilise le hook useAuth
function Navigation() {
  const [currentPage, setCurrentPage] = useState('calculator');
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { id: 'calculator', name: 'Calculateur', icon: '🧮', path: '/' },
    { id: 'employees', name: 'Employés', icon: '👥', path: '/employees' },
    { id: 'reports', name: 'Rapports', icon: '📊', path: '/reports' }
  ];

  const handleNavigation = (item) => {
    setCurrentPage(item.id);
    navigate(item.path);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Si nous sommes sur la page de login, ne pas afficher la navigation
  if (location.pathname === '/login') {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">💰</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">SALARYGN</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Navigation principale */}
            <div className="flex space-x-1">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </div>

            {/* Section utilisateur */}
            {user ? (
              <div className="flex items-center space-x-3 border-l pl-4 ml-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm font-medium">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-700">
                      {user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
              >
                Connexion
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// Composant de layout principal
function MainLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main>
        <Routes>
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <SalaryCalculator />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employees" 
            element={
              <ProtectedRoute>
                <EmployeeManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute>
                <div className="max-w-7xl mx-auto px-4 py-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">Rapports</h1>
                  <p className="text-gray-600">Module de rapports en développement...</p>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route path="/login" element={<Login />} />
          
          {/* Route de fallback - redirection vers la page de connexion ou calculateur */}
          <Route 
            path="*" 
            element={
              <ProtectedRoute>
                <SalaryCalculator />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>

      {/* Pied de page - seulement sur les pages principales */}
      {location.pathname !== '/login' && (
        <footer className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="text-center text-sm text-gray-600">
              <p>© 2024 SALARYGN - Conforme au barème fiscal guinéen</p>
              <p className="mt-1">Tranches: 0% (0-1M), 5% (1M-3M), 8% (3M-5M), 10% (5M-10M), 15% (10M-20M), 20% (20M+)</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

// Composant App principal
function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;