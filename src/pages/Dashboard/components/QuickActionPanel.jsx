import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const QuickActionPanel = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Nouveau Calcul',
      description: 'Calculer les taxes pour un employé',
      icon: 'Calculator',
      variant: 'default',
      path: '/employee-tax-calculator'
    },
    {
      title: 'Traitement par Lot',
      description: 'Traiter plusieurs employés',
      icon: 'FileSpreadsheet',
      variant: 'outline',
      path: '/batch-processing'
    },
    {
      title: 'Certificat Fiscal',
      description: 'Générer un certificat',
      icon: 'FileText',
      variant: 'secondary',
      path: '/tax-settings'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-lg font-heading font-semibold text-foreground mb-4">
        Actions Rapides
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions?.map((action, index) => (
          <Button
            key={index}
            variant={action?.variant}
            onClick={() => navigate(action?.path)}
            className="h-auto p-4 flex flex-col items-center text-center space-y-2"
            iconName={action?.icon}
            iconSize={24}
          >
            <div>
              <div className="font-medium text-sm mb-1">
                {action?.title}
              </div>
              <div className="text-xs opacity-80">
                {action?.description}
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionPanel;