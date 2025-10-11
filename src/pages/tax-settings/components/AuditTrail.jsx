import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const AuditTrail = ({ auditLogs, onExport, onViewDetails }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');

  const actionTypeOptions = [
    { value: 'all', label: 'Toutes les actions' },
    { value: 'tax_rate_change', label: 'Modification taux' },
    { value: 'settings_update', label: 'Mise à jour paramètres' },
    { value: 'user_access', label: 'Accès utilisateur' },
    { value: 'export', label: 'Export données' }
  ];

  const sortOptions = [
    { value: 'date_desc', label: 'Plus récent d\'abord' },
    { value: 'date_asc', label: 'Plus ancien d\'abord' },
    { value: 'user_asc', label: 'Par utilisateur A-Z' },
    { value: 'action_asc', label: 'Par action A-Z' }
  ];

  const getActionIcon = (action) => {
    switch (action) {
      case 'tax_rate_change':
        return 'TrendingUp';
      case 'settings_update':
        return 'Settings';
      case 'user_access':
        return 'User';
      case 'export':
        return 'Download';
      case 'delete':
        return 'Trash2';
      default:
        return 'Activity';
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'tax_rate_change':
        return 'text-primary';
      case 'settings_update':
        return 'text-accent';
      case 'user_access':
        return 'text-success';
      case 'export':
        return 'text-warning';
      case 'delete':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getActionLabel = (action) => {
    switch (action) {
      case 'tax_rate_change':
        return 'Modification Taux';
      case 'settings_update':
        return 'Mise à Jour';
      case 'user_access':
        return 'Accès Utilisateur';
      case 'export':
        return 'Export';
      case 'delete':
        return 'Suppression';
      default:
        return 'Action';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-error/10 text-error border-error/20';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'low':
        return 'bg-success/10 text-success border-success/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const filteredLogs = auditLogs?.filter(log => {
    if (filter === 'all') return true;
    return log?.action === filter;
  });

  const sortedLogs = [...filteredLogs]?.sort((a, b) => {
    switch (sortBy) {
      case 'date_desc':
        return new Date(b.timestamp) - new Date(a.timestamp);
      case 'date_asc':
        return new Date(a.timestamp) - new Date(b.timestamp);
      case 'user_asc':
        return a?.user?.localeCompare(b?.user);
      case 'action_asc':
        return a?.action?.localeCompare(b?.action);
      default:
        return 0;
    }
  });

  const formatDateTime = (timestamp) => {
    return new Date(timestamp)?.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Journal d'Audit
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Historique complet des modifications et accès aux paramètres fiscaux
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={20} className="text-primary" />
            <span className="text-sm font-caption text-muted-foreground">
              {auditLogs?.length} entrées
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            iconName="Download"
            iconPosition="left"
          >
            Exporter
          </Button>
        </div>
      </div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Select
            label="Filtrer par action"
            options={actionTypeOptions}
            value={filter}
            onChange={setFilter}
          />
        </div>
        <div className="flex-1">
          <Select
            label="Trier par"
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
          />
        </div>
      </div>
      {/* Audit Logs */}
      <div className="space-y-3">
        {sortedLogs?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="FileX" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-body">
              Aucune entrée d'audit trouvée pour ce filtre
            </p>
          </div>
        ) : (
          sortedLogs?.map((log) => (
            <div
              key={log?.id}
              className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg ${
                  log?.action === 'tax_rate_change' ? 'bg-primary/10' :
                  log?.action === 'settings_update' ? 'bg-accent/10' :
                  log?.action === 'user_access' ? 'bg-success/10' :
                  log?.action === 'export'? 'bg-warning/10' : 'bg-muted'
                }`}>
                  <Icon
                    name={getActionIcon(log?.action)}
                    size={20}
                    className={getActionColor(log?.action)}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-body font-medium text-foreground">
                        {log?.description}
                      </h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-caption border ${getSeverityColor(log?.severity)}`}>
                          {log?.severity === 'high' ? 'Critique' :
                           log?.severity === 'medium' ? 'Important' : 'Normal'}
                        </span>
                        <span className="text-xs text-muted-foreground font-caption">
                          {getActionLabel(log?.action)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-data font-semibold text-foreground">
                        {formatDateTime(log?.timestamp)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {log?.ipAddress}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Icon name="User" size={14} className="text-muted-foreground" />
                        <span className="text-sm font-body text-foreground">
                          {log?.user}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Icon name="Monitor" size={14} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground font-caption">
                          {log?.userAgent}
                        </span>
                      </div>
                    </div>
                    
                    {log?.hasDetails && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(log?.id)}
                        iconName="Eye"
                        iconPosition="left"
                      >
                        Détails
                      </Button>
                    )}
                  </div>

                  {log?.changes && log?.changes?.length > 0 && (
                    <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                      <p className="text-xs font-caption text-muted-foreground mb-2">
                        Modifications apportées:
                      </p>
                      <div className="space-y-1">
                        {log?.changes?.map((change, index) => (
                          <div key={index} className="text-sm text-foreground flex items-center space-x-2">
                            <Icon name="ArrowRight" size={12} className="text-primary" />
                            <span>
                              <strong>{change?.field}:</strong> {change?.oldValue} → {change?.newValue}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Load More */}
      {sortedLogs?.length > 0 && (
        <div className="text-center mt-6">
          <Button variant="outline">
            Charger plus d'entrées
          </Button>
        </div>
      )}
      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-heading font-bold text-primary">
              {auditLogs?.filter(log => log?.action === 'tax_rate_change')?.length}
            </p>
            <p className="text-sm text-muted-foreground">Modifications taux</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-heading font-bold text-accent">
              {auditLogs?.filter(log => log?.action === 'settings_update')?.length}
            </p>
            <p className="text-sm text-muted-foreground">Mises à jour</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-heading font-bold text-success">
              {auditLogs?.filter(log => log?.action === 'user_access')?.length}
            </p>
            <p className="text-sm text-muted-foreground">Accès utilisateur</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-heading font-bold text-warning">
              {auditLogs?.filter(log => log?.severity === 'high')?.length}
            </p>
            <p className="text-sm text-muted-foreground">Actions critiques</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditTrail;