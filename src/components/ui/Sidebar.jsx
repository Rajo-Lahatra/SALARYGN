import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Tableau de Bord',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      description: 'Vue d\'ensemble et métriques'
    },
    {
      label: 'Calcul Individuel',
      path: '/employee-tax-calculator',
      icon: 'Calculator',
      description: 'Calcul fiscal pour un employé'
    },
    {
      label: 'Gestion Employés',
      path: '/employee-management',
      icon: 'Users',
      description: 'Base de données employés'
    },
    {
      label: 'Traitement par Lot',
      path: '/batch-processing',
      icon: 'FileSpreadsheet',
      description: 'Calculs en masse'
    },
    {
      label: 'Paramètres Fiscaux',
      path: '/tax-settings',
      icon: 'Settings',
      description: 'Configuration fiscale'
    }
  ];

  const isActive = (path) => location?.pathname === path;

  const Logo = () => (
    <div className="flex items-center space-x-3 px-4 py-6">
      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
        <Icon name="Calculator" size={24} className="text-primary-foreground" />
      </div>
      {!isCollapsed && (
        <div>
          <h1 className="font-heading font-semibold text-lg text-foreground">
            TaxCalc
          </h1>
          <p className="text-xs text-muted-foreground font-caption">
            Guinea
          </p>
        </div>
      )}
    </div>
  );

  const NavigationItem = ({ item, isMobile = false }) => (
    <Link
      to={item?.path}
      onClick={() => isMobile && setIsMobileOpen(false)}
      className={`group flex items-center space-x-3 px-4 py-3 mx-2 rounded-md transition-all duration-200 hover:bg-muted ${
        isActive(item?.path)
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-foreground hover:text-foreground'
      }`}
      title={isCollapsed ? item?.label : item?.description}
    >
      <Icon
        name={item?.icon}
        size={20}
        className={`flex-shrink-0 ${
          isActive(item?.path)
            ? 'text-primary-foreground'
            : 'text-muted-foreground group-hover:text-foreground'
        }`}
      />
      {(!isCollapsed || isMobile) && (
        <div className="flex-1 min-w-0">
          <p className="font-body font-medium text-sm truncate">
            {item?.label}
          </p>
          {!isActive(item?.path) && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {item?.description}
            </p>
          )}
        </div>
      )}
    </Link>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex-col bg-card border-r border-border transition-all duration-300 ${
          isCollapsed ? 'lg:w-16' : 'lg:w-60'
        }`}
      >
        {/* Logo */}
        <Logo />

        {/* Navigation */}
        <nav className="flex-1 px-2 pb-4 space-y-1">
          {navigationItems?.map((item) => (
            <NavigationItem key={item?.path} item={item} />
          ))}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="w-full justify-center"
            title={isCollapsed ? 'Étendre la barre latérale' : 'Réduire la barre latérale'}
          >
            <Icon
              name={isCollapsed ? 'ChevronRight' : 'ChevronLeft'}
              size={16}
            />
            {!isCollapsed && (
              <span className="ml-2 font-body text-sm">Réduire</span>
            )}
          </Button>
        </div>
      </aside>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileOpen(true)}
          className="bg-card shadow-md"
        >
          <Icon name="Menu" size={20} />
        </Button>
      </div>
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Sidebar */}
          <aside className="relative flex flex-col w-64 bg-card border-r border-border shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-border">
              <Logo />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileOpen(false)}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
              {navigationItems?.map((item) => (
                <NavigationItem key={item?.path} item={item} isMobile />
              ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border">
              <div className="text-center">
                <p className="text-xs text-muted-foreground font-caption">
                  TaxCalc Guinea v1.0
                </p>
                <p className="text-xs text-muted-foreground font-caption">
                  Conforme aux réglementations guinéennes
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}
      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40">
        <div className="flex items-center justify-around py-2">
          {navigationItems?.slice(0, 4)?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-md transition-colors ${
                isActive(item?.path)
                  ? 'text-primary' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon
                name={item?.icon}
                size={20}
                className={isActive(item?.path) ? 'text-primary' : 'text-muted-foreground'}
              />
              <span className="text-xs font-caption truncate max-w-16">
                {item?.label?.split(' ')?.[0]}
              </span>
            </Link>
          ))}
          
          {/* More Menu */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="flex flex-col items-center space-y-1 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="MoreHorizontal" size={20} />
            <span className="text-xs font-caption">Plus</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;