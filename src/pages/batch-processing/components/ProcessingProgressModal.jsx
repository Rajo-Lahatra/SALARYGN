import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProcessingProgressModal = ({ 
  isOpen, 
  progress, 
  currentEmployee, 
  processedCount, 
  totalCount, 
  errors,
  onCancel,
  onClose 
}) => {
  if (!isOpen) return null;

  const progressPercentage = Math.round((processedCount / totalCount) * 100);
  const isComplete = processedCount === totalCount;
  const hasErrors = errors?.length > 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-heading font-semibold text-foreground">
              {isComplete ? 'Traitement Terminé' : 'Traitement en Cours'}
            </h3>
            {!isComplete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onCancel}
              >
                <Icon name="X" size={20} />
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-body text-foreground">
                Progression
              </span>
              <span className="text-sm font-data font-medium text-foreground">
                {progressPercentage}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${
                  isComplete 
                    ? hasErrors ? 'bg-warning' : 'bg-success' :'bg-primary'
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{processedCount} traité(s)</span>
              <span>{totalCount} total</span>
            </div>
          </div>

          {/* Current Status */}
          {!isComplete && currentEmployee && (
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
                <div>
                  <p className="text-sm font-body font-medium text-foreground">
                    Traitement en cours...
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {currentEmployee?.name} - {currentEmployee?.department}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Completion Status */}
          {isComplete && (
            <div className={`rounded-lg p-4 ${
              hasErrors 
                ? 'bg-warning/5 border border-warning/20' :'bg-success/5 border border-success/20'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  hasErrors ? 'bg-warning/10' : 'bg-success/10'
                }`}>
                  <Icon 
                    name={hasErrors ? 'AlertTriangle' : 'CheckCircle'} 
                    size={20} 
                    className={hasErrors ? 'text-warning' : 'text-success'} 
                  />
                </div>
                <div>
                  <p className="text-sm font-body font-medium text-foreground">
                    {hasErrors ? 'Terminé avec des erreurs' : 'Traitement réussi'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {processedCount - errors?.length} succès, {errors?.length} erreur(s)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Summary */}
          {errors?.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-body font-medium text-foreground">
                Erreurs Détectées ({errors?.length})
              </h4>
              <div className="max-h-32 overflow-y-auto space-y-2">
                {errors?.slice(0, 3)?.map((error, index) => (
                  <div key={index} className="bg-error/5 border border-error/20 rounded-lg p-3">
                    <p className="text-sm font-body font-medium text-foreground">
                      {error?.employeeName}
                    </p>
                    <p className="text-xs text-error mt-1">
                      {error?.message}
                    </p>
                  </div>
                ))}
                {errors?.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{errors?.length - 3} autres erreurs...
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Processing Stats */}
          {isComplete && (
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/20 rounded-lg">
                <p className="text-lg font-heading font-bold text-success">
                  {processedCount - errors?.length}
                </p>
                <p className="text-xs text-muted-foreground">Réussis</p>
              </div>
              <div className="text-center p-3 bg-muted/20 rounded-lg">
                <p className="text-lg font-heading font-bold text-error">
                  {errors?.length}
                </p>
                <p className="text-xs text-muted-foreground">Erreurs</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          {isComplete ? (
            <div className="flex gap-3">
              <Button
                variant="default"
                onClick={onClose}
                className="flex-1"
              >
                Fermer
              </Button>
              {hasErrors && (
                <Button
                  variant="outline"
                  iconName="FileText"
                  iconPosition="left"
                >
                  Rapport
                </Button>
              )}
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={onCancel}
              className="w-full"
            >
              Annuler le Traitement
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessingProgressModal;