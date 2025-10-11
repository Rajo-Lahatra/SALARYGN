import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import QuickActionFAB from '../../components/ui/QuickActionFAB';
import MetricsCard from './components/MetricsCard';
import QuickActionPanel from './components/QuickActionPanel';
import RecentCalculationsTable from './components/RecentCalculationsTable';
import NotificationsPanel from './components/NotificationsPanel';
import NavigationShortcuts from './components/NavigationShortcuts';

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  const metricsData = [
    {
      title: 'Calculs Mensuels',
      value: '1,247',
      subtitle: 'Octobre 2025',
      icon: 'Calculator',
      color: 'primary',
      trend: { type: 'up', value: '+12%' }
    },
    {
      title: 'Employés Gérés',
      value: '247',
      subtitle: 'Actifs dans le système',
      icon: 'Users',
      color: 'success',
      trend: { type: 'up', value: '+5' }
    },
    {
      title: 'Certificats en Attente',
      value: '23',
      subtitle: 'À générer cette semaine',
      icon: 'FileText',
      color: 'warning',
      trend: { type: 'down', value: '-8' }
    },
    {
      title: 'Échéances Fiscales',
      value: '3',
      subtitle: 'Dans les 7 prochains jours',
      icon: 'Calendar',
      color: 'error',
      trend: { type: 'neutral', value: 'Urgent' }
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`}>
        <Header />
        
        <main className="p-6 pb-20 lg:pb-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb />

            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
                    Bienvenue sur TaxCalc Guinea
                  </h1>
                  <p className="text-muted-foreground font-body">
                    Tableau de bord centralisé pour la gestion fiscale et paie en Guinée Conakry
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Dernière connexion: {new Date()?.toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🇬🇳</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metricsData?.map((metric, index) => (
                <MetricsCard
                  key={index}
                  title={metric?.title}
                  value={metric?.value}
                  subtitle={metric?.subtitle}
                  icon={metric?.icon}
                  color={metric?.color}
                  trend={metric?.trend}
                />
              ))}
            </div>

            {/* Quick Actions */}
            <QuickActionPanel />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Calculations - Takes 2 columns */}
              <div className="lg:col-span-2">
                <RecentCalculationsTable />
              </div>

              {/* Notifications Panel - Takes 1 column */}
              <div className="lg:col-span-1">
                <NotificationsPanel />
              </div>
            </div>

            {/* Navigation Shortcuts */}
            <NavigationShortcuts />

            {/* System Status Footer */}
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-muted-foreground">Système opérationnel</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-muted-foreground">Base de données synchronisée</span>
                  </div>
                </div>
                <div className="text-muted-foreground">
                  TaxCalc Guinea v1.0 - Conforme aux réglementations guinéennes {new Date()?.getFullYear()}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <QuickActionFAB />
    </div>
  );
};

export default Dashboard;