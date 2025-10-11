import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NavigationShortcuts = () => {
  const navigate = useNavigate();

  const shortcuts = [
    {
      title: 'Gestion Employés',
      description: 'Base de données complète des employés',
      icon: 'Users',
      path: '/employee-management',
      color: 'bg-accent/10 text-accent border-accent/20',
      stats: '247 employés actifs'
    },
    {
      title: 'Rapports Fiscaux',
      description: 'Générer et consulter les rapports',
      icon: 'FileBarChart',
      path: '/tax-settings',
      color: 'bg-primary/10 text-primary border-primary/20',
      stats: '12 rapports ce mois'
    },
    {
      title: 'Paramètres Système',
      description: 'Configuration et préférences',
      icon: 'Settings',
      path: '/tax-settings',
      color: 'bg-secondary/10 text-secondary border-secondary/20',
      stats: 'Dernière MAJ: 08/10'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-lg font-heading font-semibold text-foreground mb-4">
        Raccourcis Navigation
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {shortcuts?.map((shortcut, index) => (
          <div
            key={index}
            onClick={() => navigate(shortcut?.path)}
            className="group cursor-pointer p-4 border border-border rounded-md hover:shadow-md transition-all duration-200 hover:border-primary/30"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className={`p-2 rounded-md ${shortcut?.color}`}>
                <Icon name={shortcut?.icon} size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                  {shortcut?.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {shortcut?.stats}
                </p>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground mb-3">
              {shortcut?.description}
            </p>
            
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="xs"
                className="text-xs h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Accéder
              </Button>
              <Icon 
                name="ArrowRight" 
                size={14} 
                className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NavigationShortcuts;