import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationsPanel = () => {
  const navigate = useNavigate();

  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Échéance Fiscale Approche',
      message: 'Déclaration mensuelle due le 15 octobre 2025',
      date: '2025-10-10',
      priority: 'high',
      action: () => navigate('/tax-settings')
    },
    {
      id: 2,
      type: 'info',
      title: 'Mise à Jour des Taux',
      message: 'Nouveaux taux CNSS applicables depuis octobre 2025',
      date: '2025-10-08',
      priority: 'medium',
      action: () => navigate('/tax-settings')
    },
    {
      id: 3,
      type: 'success',
      title: 'Conformité Vérifiée',
      message: 'Tous les calculs sont conformes aux réglementations guinéennes',
      date: '2025-10-07',
      priority: 'low',
      action: null
    },
    {
      id: 4,
      type: 'error',
      title: 'Attention Requise',
      message: '3 employés nécessitent une vérification des données',
      date: '2025-10-06',
      priority: 'high',
      action: () => navigate('/employee-management')
    }
  ];

  const getNotificationIcon = (type) => {
    const icons = {
      warning: 'AlertTriangle',
      info: 'Info',
      success: 'CheckCircle',
      error: 'XCircle'
    };
    return icons?.[type] || 'Bell';
  };

  const getNotificationColor = (type) => {
    const colors = {
      warning: 'text-warning bg-warning/10 border-warning/20',
      info: 'text-primary bg-primary/10 border-primary/20',
      success: 'text-success bg-success/10 border-success/20',
      error: 'text-error bg-error/10 border-error/20'
    };
    return colors?.[type] || 'text-muted-foreground bg-muted/10 border-border';
  };

  const getPriorityIndicator = (priority) => {
    const indicators = {
      high: 'w-2 h-2 bg-error rounded-full',
      medium: 'w-2 h-2 bg-warning rounded-full',
      low: 'w-2 h-2 bg-success rounded-full'
    };
    return indicators?.[priority] || 'w-2 h-2 bg-muted-foreground rounded-full';
  };

  return (
    <div className="space-y-6">
      {/* Tax Rate Updates */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-semibold text-foreground">
            Mises à Jour Fiscales
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/tax-settings')}
            iconName="Settings"
          >
            Gérer
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-md">
            <div className="flex items-center space-x-3">
              <Icon name="TrendingUp" size={20} className="text-primary" />
              <div>
                <p className="font-medium text-sm text-foreground">
                  Taux CNSS Mis à Jour
                </p>
                <p className="text-xs text-muted-foreground">
                  Nouveau taux: 5.5% (précédent: 5.0%)
                </p>
              </div>
            </div>
            <span className="text-xs text-primary font-medium">
              Actif
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 border border-border rounded-md">
            <div className="flex items-center space-x-3">
              <Icon name="Calendar" size={20} className="text-muted-foreground" />
              <div>
                <p className="font-medium text-sm text-foreground">
                  Barème Impôt sur Salaire
                </p>
                <p className="text-xs text-muted-foreground">
                  Dernière mise à jour: Janvier 2025
                </p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">
              À jour
            </span>
          </div>
        </div>
      </div>
      {/* Compliance Reminders */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-semibold text-foreground">
            Rappels de Conformité
          </h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
            <span className="text-xs text-muted-foreground">
              {notifications?.filter(n => n?.priority === 'high')?.length} urgent(s)
            </span>
          </div>
        </div>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {notifications?.map((notification) => (
            <div
              key={notification?.id}
              className={`p-3 border rounded-md transition-colors hover:bg-muted/50 ${getNotificationColor(notification?.type)}`}
            >
              <div className="flex items-start space-x-3">
                <Icon 
                  name={getNotificationIcon(notification?.type)} 
                  size={18} 
                  className="mt-0.5 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm text-foreground truncate">
                      {notification?.title}
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className={getPriorityIndicator(notification?.priority)}></div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(notification.date)?.toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {notification?.message}
                  </p>
                  {notification?.action && (
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={notification?.action}
                      className="text-xs h-6"
                    >
                      Voir détails
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;