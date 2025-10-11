import React from 'react';
import Icon from '../../../components/AppIcon';

const EmployeeStats = ({ employees }) => {
  const stats = {
    total: employees?.length,
    active: employees?.filter(emp => emp?.status === 'Actif')?.length,
    inactive: employees?.filter(emp => emp?.status === 'Inactif')?.length,
    onLeave: employees?.filter(emp => emp?.status === 'Congé')?.length,
    suspended: employees?.filter(emp => emp?.status === 'Suspendu')?.length
  };

  const departmentStats = employees?.reduce((acc, emp) => {
    acc[emp.department] = (acc?.[emp?.department] || 0) + 1;
    return acc;
  }, {});

  const employmentTypeStats = employees?.reduce((acc, emp) => {
    acc[emp.employmentType] = (acc?.[emp?.employmentType] || 0) + 1;
    return acc;
  }, {});

  const recentCalculations = employees?.filter(emp => {
    const lastCalc = new Date(emp.lastCalculationDate);
    const weekAgo = new Date();
    weekAgo?.setDate(weekAgo?.getDate() - 7);
    return lastCalc >= weekAgo;
  })?.length;

  const StatCard = ({ title, value, icon, color = 'primary', subtitle }) => (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-body">{title}</p>
          <p className="text-2xl font-heading font-semibold text-foreground mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg bg-${color}/10 flex items-center justify-center`}>
          <Icon name={icon} size={24} className={`text-${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Employés"
          value={stats?.total}
          icon="Users"
          color="primary"
          subtitle="Tous statuts confondus"
        />
        <StatCard
          title="Employés Actifs"
          value={stats?.active}
          icon="CheckCircle"
          color="success"
          subtitle={`${((stats?.active / stats?.total) * 100)?.toFixed(1)}% du total`}
        />
        <StatCard
          title="En Congé"
          value={stats?.onLeave}
          icon="Clock"
          color="warning"
          subtitle="Congés temporaires"
        />
        <StatCard
          title="Calculs Récents"
          value={recentCalculations}
          icon="Calculator"
          color="accent"
          subtitle="Cette semaine"
        />
      </div>
      {/* Department Breakdown */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Building" size={20} className="text-primary" />
          <h3 className="font-heading font-semibold text-foreground">Répartition par Département</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(departmentStats)?.map(([department, count]) => (
            <div key={department} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
              <span className="font-body text-foreground">{department}</span>
              <div className="flex items-center space-x-2">
                <span className="font-heading font-medium text-foreground">{count}</span>
                <div className="w-16 bg-border rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(count / stats?.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Employment Type Stats */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Briefcase" size={20} className="text-accent" />
          <h3 className="font-heading font-semibold text-foreground">Types d'Emploi</h3>
        </div>
        
        <div className="space-y-3">
          {Object.entries(employmentTypeStats)?.map(([type, count]) => (
            <div key={type} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  type === 'CDI' ? 'bg-success' :
                  type === 'CDD' ? 'bg-warning' :
                  type === 'Stage'? 'bg-accent' : 'bg-secondary'
                }`} />
                <span className="font-body text-foreground">{type}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-heading font-medium text-foreground">{count}</span>
                <span className="text-sm text-muted-foreground">
                  ({((count / stats?.total) * 100)?.toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Status Overview */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Activity" size={20} className="text-secondary" />
          <h3 className="font-heading font-semibold text-foreground">État des Employés</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-success/5 rounded-lg border border-success/20">
            <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
            </div>
            <p className="font-heading font-semibold text-success text-lg">{stats?.active}</p>
            <p className="text-xs text-muted-foreground">Actifs</p>
          </div>
          
          <div className="text-center p-3 bg-error/5 rounded-lg border border-error/20">
            <div className="w-8 h-8 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Icon name="XCircle" size={16} className="text-error" />
            </div>
            <p className="font-heading font-semibold text-error text-lg">{stats?.inactive}</p>
            <p className="text-xs text-muted-foreground">Inactifs</p>
          </div>
          
          <div className="text-center p-3 bg-warning/5 rounded-lg border border-warning/20">
            <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Icon name="Clock" size={16} className="text-warning" />
            </div>
            <p className="font-heading font-semibold text-warning text-lg">{stats?.onLeave}</p>
            <p className="text-xs text-muted-foreground">En congé</p>
          </div>
          
          <div className="text-center p-3 bg-secondary/5 rounded-lg border border-secondary/20">
            <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Icon name="Pause" size={16} className="text-secondary" />
            </div>
            <p className="font-heading font-semibold text-secondary text-lg">{stats?.suspended}</p>
            <p className="text-xs text-muted-foreground">Suspendus</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeStats;