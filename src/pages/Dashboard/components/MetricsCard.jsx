import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, subtitle, icon, trend, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    error: 'bg-error/10 text-error border-error/20'
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses?.[color]}`}>
          <Icon name={icon} size={24} />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${
            trend?.type === 'up' ? 'text-success' : 
            trend?.type === 'down' ? 'text-error' : 'text-muted-foreground'
          }`}>
            <Icon 
              name={trend?.type === 'up' ? 'TrendingUp' : trend?.type === 'down' ? 'TrendingDown' : 'Minus'} 
              size={16} 
            />
            <span className="font-medium">{trend?.value}</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-heading font-bold text-foreground mb-1">
          {value}
        </h3>
        <p className="text-sm font-body text-muted-foreground mb-1">
          {title}
        </p>
        {subtitle && (
          <p className="text-xs text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default MetricsCard;