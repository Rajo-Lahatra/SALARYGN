import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const location = useLocation();

  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Échéance fiscale',
      message: 'Déclaration mensuelle due dans 3 jours',
      time: '2h',
      unread: true
    },
    {
      id: 2,
      type: 'success',
      title: 'Calcul terminé',
      message: 'Traitement par lot de 45 employés complété',
      time: '1h',
      unread: true
    },
    {
      id: 3,
      type: 'error',
      title: 'Erreur de validation',
      message: 'Données manquantes pour 3 employés',
      time: '30min',
      unread: false
    }
  ];

  const unreadCount = notifications?.filter(n => n?.unread)?.length;

  const getPageTitle = () => {
    const titles = {
      '/dashboard': 'Tableau de Bord',
      '/employee-tax-calculator': 'Calcul Individuel',
      '/employee-management': 'Gestion Employés',
      '/batch-processing': 'Traitement par Lot',
      '/tax-settings': 'Paramètres Fiscaux'
    };
    return titles?.[location?.pathname] || 'TaxCalc Guinea';
  };

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      // Handle logout logic
      window.location.href = '/login';
    }
  };

  return (
    <header className="bg-card border-b border-border h-16 flex items-center justify-between px-6 relative z-50">
      {/* Page Title */}
      <div className="flex items-center">
        <h1 className="text-xl font-heading font-semibold text-foreground">
          {getPageTitle()}
        </h1>
      </div>
      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="relative"
          >
            <Icon name="Bell" size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {unreadCount}
              </span>
            )}
          </Button>

          {/* Notifications Dropdown */}
          {isNotificationOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-md shadow-lg z-50">
              <div className="p-4 border-b border-border">
                <h3 className="font-heading font-medium text-popover-foreground">
                  Notifications
                </h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications?.map((notification) => (
                  <div
                    key={notification?.id}
                    className={`p-4 border-b border-border last:border-b-0 hover:bg-muted transition-colors ${
                      notification?.unread ? 'bg-muted/50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`mt-1 p-1 rounded-full ${
                        notification?.type === 'warning' ? 'bg-warning/10' :
                        notification?.type === 'success'? 'bg-success/10' : 'bg-error/10'
                      }`}>
                        <Icon
                          name={
                            notification?.type === 'warning' ? 'AlertTriangle' :
                            notification?.type === 'success'? 'CheckCircle' : 'XCircle'
                          }
                          size={16}
                          className={
                            notification?.type === 'warning' ? 'text-warning' :
                            notification?.type === 'success'? 'text-success' : 'text-error'
                          }
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-body font-medium text-sm text-popover-foreground">
                            {notification?.title}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {notification?.time}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification?.message}
                        </p>
                      </div>
                      {notification?.unread && (
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-border">
                <Button variant="ghost" size="sm" className="w-full">
                  Voir toutes les notifications
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <Button
            variant="ghost"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 px-3"
          >
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-heading font-medium text-sm">
              AM
            </div>
            <div className="hidden md:block text-left">
              <p className="font-body font-medium text-sm text-foreground">
                Admin Manager
              </p>
              <p className="text-xs text-muted-foreground">
                admin@taxcalc.gn
              </p>
            </div>
            <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
          </Button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-md shadow-lg z-50">
              <div className="p-3 border-b border-border">
                <p className="font-body font-medium text-popover-foreground">
                  Admin Manager
                </p>
                <p className="text-sm text-muted-foreground">
                  admin@taxcalc.gn
                </p>
              </div>
              <div className="py-2">
                <button className="w-full px-3 py-2 text-left text-sm text-popover-foreground hover:bg-muted transition-colors flex items-center space-x-2">
                  <Icon name="User" size={16} />
                  <span>Mon Profil</span>
                </button>
                <button className="w-full px-3 py-2 text-left text-sm text-popover-foreground hover:bg-muted transition-colors flex items-center space-x-2">
                  <Icon name="Settings" size={16} />
                  <span>Paramètres</span>
                </button>
                <button className="w-full px-3 py-2 text-left text-sm text-popover-foreground hover:bg-muted transition-colors flex items-center space-x-2">
                  <Icon name="HelpCircle" size={16} />
                  <span>Aide</span>
                </button>
              </div>
              <div className="border-t border-border py-2">
                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2 text-left text-sm text-error hover:bg-error/10 transition-colors flex items-center space-x-2"
                >
                  <Icon name="LogOut" size={16} />
                  <span>Se Déconnecter</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Click outside handlers */}
      {(isProfileOpen || isNotificationOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsProfileOpen(false);
            setIsNotificationOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;