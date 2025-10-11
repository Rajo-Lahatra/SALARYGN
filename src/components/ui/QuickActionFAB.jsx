import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const QuickActionFAB = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const quickActions = [
    {
      label: 'Nouveau Calcul',
      icon: 'Calculator',
      action: () => navigate('/employee-tax-calculator'),
      color: 'bg-primary text-primary-foreground'
    },
    {
      label: 'Recherche Employé',
      icon: 'Search',
      action: () => navigate('/employee-management'),
      color: 'bg-accent text-accent-foreground'
    }
  ];

  const handleMainAction = () => {
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
    }
  };

  const handleActionClick = (action) => {
    action();
    setIsExpanded(false);
  };

  return (
    <div className="lg:hidden fixed bottom-20 right-4 z-40">
      {/* Backdrop */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/20 -z-10"
          onClick={() => setIsExpanded(false)}
        />
      )}
      {/* Quick Actions */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 space-y-3 animate-fade-in">
          {quickActions?.map((action, index) => (
            <div
              key={action?.label}
              className="flex items-center space-x-3"
              style={{
                animationDelay: `${index * 50}ms`,
                animation: 'slide-in 0.3s ease-out forwards'
              }}
            >
              <span className="bg-card text-card-foreground px-3 py-2 rounded-lg shadow-md text-sm font-body whitespace-nowrap">
                {action?.label}
              </span>
              <Button
                size="icon"
                onClick={() => handleActionClick(action?.action)}
                className={`w-12 h-12 rounded-full shadow-lg ${action?.color} hover:scale-105 transition-transform`}
              >
                <Icon name={action?.icon} size={20} />
              </Button>
            </div>
          ))}
        </div>
      )}
      {/* Main FAB */}
      <Button
        size="icon"
        onClick={handleMainAction}
        className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
          isExpanded
            ? 'bg-secondary text-secondary-foreground rotate-45'
            : 'bg-primary text-primary-foreground hover:scale-105'
        }`}
      >
        <Icon name="Plus" size={24} />
      </Button>
    </div>
  );
};

export default QuickActionFAB;