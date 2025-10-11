import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RegulatoryUpdates = ({ updates, onMarkAsRead, onViewDetails }) => {
  const [filter, setFilter] = useState('all');

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success border-success/20';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'draft':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'tax_rate':
        return 'TrendingUp';
      case 'regulation':
        return 'FileText';
      case 'deadline':
        return 'Calendar';
      case 'exemption':
        return 'Shield';
      default:
        return 'Info';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'tax_rate':
        return 'Taux d\'Imposition';
      case 'regulation':
        return 'Réglementation';
      case 'deadline':
        return 'Échéance';
      case 'exemption':
        return 'Exonération';
      default:
        return 'Information';
    }
  };

  const filteredUpdates = updates?.filter(update => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !update?.isRead;
    if (filter === 'active') return update?.status === 'active';
    return update?.type === filter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Mises à Jour Réglementaires
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Dernières modifications des autorités fiscales guinéennes
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Bell" size={20} className="text-primary" />
          <span className="text-sm font-caption text-muted-foreground">
            {updates?.filter(u => !u?.isRead)?.length} non lues
          </span>
        </div>
      </div>
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6 p-1 bg-muted rounded-lg">
        {[
          { key: 'all', label: 'Toutes', count: updates?.length },
          { key: 'unread', label: 'Non lues', count: updates?.filter(u => !u?.isRead)?.length },
          { key: 'active', label: 'Actives', count: updates?.filter(u => u?.status === 'active')?.length },
          { key: 'tax_rate', label: 'Taux', count: updates?.filter(u => u?.type === 'tax_rate')?.length }
        ]?.map((tab) => (
          <button
            key={tab?.key}
            onClick={() => setFilter(tab?.key)}
            className={`px-3 py-2 rounded-md text-sm font-body transition-colors ${
              filter === tab?.key
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab?.label}
            {tab?.count > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                {tab?.count}
              </span>
            )}
          </button>
        ))}
      </div>
      {/* Updates List */}
      <div className="space-y-4">
        {filteredUpdates?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="FileX" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-body">
              Aucune mise à jour trouvée pour ce filtre
            </p>
          </div>
        ) : (
          filteredUpdates?.map((update) => (
            <div
              key={update?.id}
              className={`border rounded-lg p-4 transition-colors hover:bg-muted/50 ${
                !update?.isRead ? 'border-primary/30 bg-primary/5' : 'border-border'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg ${
                  update?.type === 'tax_rate' ? 'bg-primary/10' :
                  update?.type === 'regulation' ? 'bg-accent/10' :
                  update?.type === 'deadline'? 'bg-warning/10' : 'bg-success/10'
                }`}>
                  <Icon
                    name={getTypeIcon(update?.type)}
                    size={20}
                    className={
                      update?.type === 'tax_rate' ? 'text-primary' :
                      update?.type === 'regulation' ? 'text-accent' :
                      update?.type === 'deadline'? 'text-warning' : 'text-success'
                    }
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-body font-medium text-foreground">
                        {update?.title}
                        {!update?.isRead && (
                          <span className="ml-2 w-2 h-2 bg-primary rounded-full inline-block"></span>
                        )}
                      </h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-caption border ${getStatusColor(update?.status)}`}>
                          {update?.status === 'active' ? 'Actif' :
                           update?.status === 'pending' ? 'En attente' : 'Brouillon'}
                        </span>
                        <span className="text-xs text-muted-foreground font-caption">
                          {getTypeLabel(update?.type)}
                        </span>
                        <span className="text-xs text-muted-foreground font-caption">
                          {formatDate(update?.publishDate)}
                        </span>
                      </div>
                    </div>
                    
                    {update?.effectiveDate && (
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Effectif le</p>
                        <p className="text-sm font-data font-semibold text-foreground">
                          {formatDate(update?.effectiveDate)}
                        </p>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {update?.description}
                  </p>

                  {update?.changes && update?.changes?.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-caption text-muted-foreground mb-2">
                        Principales modifications:
                      </p>
                      <ul className="space-y-1">
                        {update?.changes?.slice(0, 2)?.map((change, index) => (
                          <li key={index} className="text-sm text-foreground flex items-start space-x-2">
                            <Icon name="ArrowRight" size={14} className="text-primary mt-0.5 flex-shrink-0" />
                            <span>{change}</span>
                          </li>
                        ))}
                        {update?.changes?.length > 2 && (
                          <li className="text-xs text-muted-foreground">
                            +{update?.changes?.length - 2} autres modifications...
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon name="Building2" size={14} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground font-caption">
                        {update?.authority}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {!update?.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onMarkAsRead(update?.id)}
                        >
                          Marquer comme lu
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(update?.id)}
                        iconName="ExternalLink"
                        iconPosition="right"
                      >
                        Voir détails
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Load More */}
      {filteredUpdates?.length > 0 && (
        <div className="text-center mt-6">
          <Button variant="outline">
            Charger plus de mises à jour
          </Button>
        </div>
      )}
    </div>
  );
};

export default RegulatoryUpdates;