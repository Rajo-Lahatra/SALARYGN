import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import QuickActionFAB from '../../components/ui/QuickActionFAB';

// Import components
import TaxBracketSettings from './components/TaxBracketSettings';
import SocialSecuritySettings from './components/SocialSecuritySettings';
import MedicalInsuranceSettings from './components/MedicalInsuranceSettings';
import ProfessionalTaxSettings from './components/ProfessionalTaxSettings';
import RegulatoryUpdates from './components/RegulatoryUpdates';
import CurrencySettings from './components/CurrencySettings';
import AuditTrail from './components/AuditTrail';

const TaxSettings = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('tax-brackets');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Mock data for tax brackets
  const [taxBrackets] = useState([
    {
      id: 1,
      name: "Tranche 1",
      minAmount: 0,
      maxAmount: 1000000,
      rate: 0
    },
    {
      id: 2,
      name: "Tranche 2", 
      minAmount: 1000001,
      maxAmount: 3000000,
      rate: 5
    },
    {
      id: 3,
      name: "Tranche 3",
      minAmount: 3000001,
      maxAmount: 5000000,
      rate: 8
    },
    {
      id: 4,
      name: "Tranche 4",
      minAmount: 5000001,
      maxAmount: 10000000,
      rate: 10
    },
    {
      id: 5,
      name: "Tranche 5",
      minAmount: 10000001,
      maxAmount: 20000000,
      rate: 15
    },
    {
      id: 6,
      name: "Tranche 6",
      minAmount: 20000001,
      maxAmount: null,
      rate: 20
    }
  ]);

  // Mock data for social security settings
  const [socialSecuritySettings] = useState({
    employee: {
      retirement: 2.5,
      familyAllowance: 1.0
    },
    employer: {
      retirement: 4.0,
      familyAllowance: 7.0,
      workAccident: 1.5
    },
    maxSalaryBase: 10000000
  });

  // Mock data for medical insurance settings
  const [medicalInsuranceSettings] = useState({
    employeeRate: 1.5,
    employerRate: 2.5,
    minContribution: 15000,
    maxContribution: 150000,
    coverageOptions: [
      {
        id: 1,
        name: "Couverture Familiale",
        description: "Extension aux membres de la famille",
        enabled: true,
        additionalRate: 0.5
      },
      {
        id: 2,
        name: "Soins Dentaires",
        description: "Couverture dentaire étendue",
        enabled: false,
        additionalRate: 0.3
      },
      {
        id: 3,
        name: "Optique",
        description: "Remboursement lunettes et lentilles",
        enabled: true,
        additionalRate: 0.2
      }
    ]
  });

  // Mock data for professional tax settings
  const [professionalTaxSettings] = useState({
    categories: [
      {
        id: 1,
        name: "Cadre Supérieur",
        description: "Directeurs, managers de haut niveau",
        amount: 50000,
        level: "high"
      },
      {
        id: 2,
        name: "Cadre Moyen",
        description: "Superviseurs, chefs d'équipe",
        amount: 30000,
        level: "medium"
      },
      {
        id: 3,
        name: "Employé",
        description: "Personnel administratif et technique",
        amount: 20000,
        level: "low"
      },
      {
        id: 4,
        name: "Ouvrier",
        description: "Personnel de production et maintenance",
        amount: 15000,
        level: "low"
      },
      {
        id: 5,
        name: "Stagiaire",
        description: "Stagiaires et apprentis",
        amount: 5000,
        level: "low"
      }
    ],
    municipalVariations: [
      {
        municipality: "conakry",
        municipalityName: "Conakry",
        multiplier: 1.2
      },
      {
        municipality: "kankan",
        municipalityName: "Kankan",
        multiplier: 1.0
      },
      {
        municipality: "labe",
        municipalityName: "Labé",
        multiplier: 0.9
      },
      {
        municipality: "nzerekore",
        municipalityName: "Nzérékoré",
        multiplier: 0.8
      }
    ]
  });

  // Mock data for regulatory updates
  const [regulatoryUpdates] = useState([
    {
      id: 1,
      title: "Nouvelle tranche d'imposition pour les hauts revenus",
      description: "Introduction d'une tranche supplémentaire à 25% pour les revenus supérieurs à 10 millions GNF mensuels, applicable à partir du 1er janvier 2025.",
      type: "tax_rate",
      status: "pending",
      publishDate: "2024-10-01",
      effectiveDate: "2025-01-01",
      authority: "Direction Générale des Impôts",
      isRead: false,
      changes: [
        "Ajout d'une 6ème tranche d'imposition à 25%",
        "Seuil minimum fixé à 10 000 001 GNF",
        "Application rétroactive interdite"
      ]
    },
    {
      id: 2,
      title: "Mise à jour des cotisations CNSS",
      description: "Augmentation du plafond de cotisation sociale de 10 millions à 12 millions GNF pour tenir compte de l'inflation.",
      type: "regulation",
      status: "active",
      publishDate: "2024-09-15",
      effectiveDate: "2024-10-01",
      authority: "Caisse Nationale de Sécurité Sociale",
      isRead: true,
      changes: [
        "Plafond CNSS porté à 12 000 000 GNF",
        "Cotisation maximum mensuelle: 360 000 GNF",
        "Période de transition de 3 mois"
      ]
    },
    {
      id: 3,
      title: "Exonération fiscale pour les startups technologiques",
      description: "Nouvelle mesure d'exonération d'impôt sur le revenu pendant 2 ans pour les entreprises technologiques créées en 2024.",
      type: "exemption",
      status: "active",
      publishDate: "2024-08-20",
      effectiveDate: "2024-09-01",
      authority: "Ministère de l'Économie Numérique",
      isRead: false,
      changes: [
        "Exonération totale pendant 24 mois",
        "Critères d'éligibilité définis",
        "Demande à déposer avant le 31/12/2024"
      ]
    },
    {
      id: 4,
      title: "Report de l'échéance fiscale de novembre",
      description: "En raison des fêtes nationales, l'échéance de déclaration fiscale du 15 novembre est reportée au 20 novembre 2024.",
      type: "deadline",
      status: "active",
      publishDate: "2024-10-05",
      effectiveDate: "2024-11-01",
      authority: "Direction Générale des Impôts",
      isRead: true,
      changes: [
        "Nouvelle échéance: 20 novembre 2024",
        "Pas de pénalité jusqu'au 20/11",
        "Déclarations électroniques privilégiées"
      ]
    }
  ]);

  // Mock data for currency settings
  const [currencySettings] = useState({
    thousandSeparator: "space",
    symbolPosition: "after",
    decimalPlaces: 0,
    showCurrencySymbol: true
  });

  // Mock data for audit trail
  const [auditLogs] = useState([
    {
      id: 1,
      action: "tax_rate_change",
      description: "Modification du taux de la tranche 4 de 15% à 18%",
      user: "Admin Manager",
      timestamp: "2024-10-10T14:30:00Z",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome/Windows",
      severity: "high",
      hasDetails: true,
      changes: [
        {
          field: "Taux Tranche 4",
          oldValue: "15%",
          newValue: "18%"
        }
      ]
    },
    {
      id: 2,
      action: "settings_update",
      description: "Mise à jour des paramètres d'affichage monétaire",
      user: "Admin Manager",
      timestamp: "2024-10-09T16:45:00Z",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome/Windows",
      severity: "medium",
      hasDetails: true,
      changes: [
        {
          field: "Séparateur milliers",
          oldValue: "Virgule",
          newValue: "Espace"
        }
      ]
    },
    {
      id: 3,
      action: "user_access",
      description: "Accès à la section paramètres fiscaux",
      user: "Admin Manager",
      timestamp: "2024-10-09T09:15:00Z",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome/Windows",
      severity: "low",
      hasDetails: false,
      changes: []
    },
    {
      id: 4,
      action: "export",
      description: "Export du journal d'audit (format PDF)",
      user: "Admin Manager",
      timestamp: "2024-10-08T11:20:00Z",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome/Windows",
      severity: "medium",
      hasDetails: false,
      changes: []
    }
  ]);

  const tabs = [
    {
      id: 'tax-brackets',
      label: 'Tranches d\'Impôt',
      icon: 'TrendingUp',
      description: 'Configuration des taux d\'imposition'
    },
    {
      id: 'social-security',
      label: 'Cotisations Sociales',
      icon: 'Shield',
      description: 'Paramètres CNSS'
    },
    {
      id: 'medical-insurance',
      label: 'Assurance Maladie',
      icon: 'Heart',
      description: 'Couverture médicale'
    },
    {
      id: 'professional-tax',
      label: 'Taxe Professionnelle',
      icon: 'Briefcase',
      description: 'Montants par catégorie'
    },
    {
      id: 'regulatory-updates',
      label: 'Mises à Jour',
      icon: 'Bell',
      description: 'Actualités réglementaires'
    },
    {
      id: 'currency-settings',
      label: 'Format Monétaire',
      icon: 'Banknote',
      description: 'Affichage GNF'
    },
    {
      id: 'audit-trail',
      label: 'Journal d\'Audit',
      icon: 'FileText',
      description: 'Historique des modifications'
    }
  ];

  const handleSettingsUpdate = (section, newSettings) => {
    console.log(`Updating ${section}:`, newSettings);
    setHasUnsavedChanges(true);
    // Here you would typically update the state and make an API call
  };

  const handleSaveAll = () => {
    if (window.confirm('Êtes-vous sûr de vouloir sauvegarder toutes les modifications ?')) {
      setHasUnsavedChanges(false);
      // Handle save all logic
      console.log('Saving all changes...');
    }
  };

  const handleRestoreDefaults = () => {
    if (window.confirm('Êtes-vous sûr de vouloir restaurer les paramètres par défaut ? Cette action est irréversible.')) {
      setHasUnsavedChanges(false);
      // Handle restore defaults logic
      console.log('Restoring defaults...');
    }
  };

  const handleExportAudit = () => {
    console.log('Exporting audit trail...');
    // Handle export logic
  };

  const handleViewAuditDetails = (logId) => {
    console.log('Viewing audit details for:', logId);
    // Handle view details logic
  };

  const handleMarkAsRead = (updateId) => {
    console.log('Marking update as read:', updateId);
    // Handle mark as read logic
  };

  const handleViewUpdateDetails = (updateId) => {
    console.log('Viewing update details:', updateId);
    // Handle view update details logic
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tax-brackets':
        return (
          <TaxBracketSettings
            brackets={taxBrackets}
            onUpdate={handleSettingsUpdate}
          />
        );
      case 'social-security':
        return (
          <SocialSecuritySettings
            settings={socialSecuritySettings}
            onUpdate={handleSettingsUpdate}
          />
        );
      case 'medical-insurance':
        return (
          <MedicalInsuranceSettings
            settings={medicalInsuranceSettings}
            onUpdate={handleSettingsUpdate}
          />
        );
      case 'professional-tax':
        return (
          <ProfessionalTaxSettings
            settings={professionalTaxSettings}
            onUpdate={handleSettingsUpdate}
          />
        );
      case 'regulatory-updates':
        return (
          <RegulatoryUpdates
            updates={regulatoryUpdates}
            onMarkAsRead={handleMarkAsRead}
            onViewDetails={handleViewUpdateDetails}
          />
        );
      case 'currency-settings':
        return (
          <CurrencySettings
            settings={currencySettings}
            onUpdate={handleSettingsUpdate}
          />
        );
      case 'audit-trail':
        return (
          <AuditTrail
            auditLogs={auditLogs}
            onExport={handleExportAudit}
            onViewDetails={handleViewAuditDetails}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Paramètres Fiscaux - TaxCalc Guinea</title>
        <meta name="description" content="Configuration des paramètres fiscaux et réglementaires pour la République de Guinée" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <div className={`transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
        }`}>
          <Header />
          
          <main className="p-6 pb-20 lg:pb-6">
            <div className="max-w-7xl mx-auto">
              <Breadcrumb />
              
              {/* Page Header */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                    Paramètres Fiscaux
                  </h1>
                  <p className="text-muted-foreground font-body">
                    Configuration des taux d'imposition et paramètres réglementaires pour la République de Guinée
                  </p>
                </div>
                
                <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                  {hasUnsavedChanges && (
                    <div className="flex items-center space-x-2 px-3 py-2 bg-warning/10 border border-warning/20 rounded-lg">
                      <Icon name="AlertCircle" size={16} className="text-warning" />
                      <span className="text-sm font-body text-warning">
                        Modifications non sauvegardées
                      </span>
                    </div>
                  )}
                  
                  <Button
                    variant="outline"
                    onClick={handleRestoreDefaults}
                    iconName="RotateCcw"
                    iconPosition="left"
                  >
                    Restaurer Défauts
                  </Button>
                  
                  <Button
                    variant="default"
                    onClick={handleSaveAll}
                    iconName="Save"
                    iconPosition="left"
                    disabled={!hasUnsavedChanges}
                  >
                    Sauvegarder Modifications
                  </Button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="border-b border-border mb-8">
                <div className="flex flex-wrap gap-1">
                  {tabs?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-t-lg font-body text-sm transition-colors ${
                        activeTab === tab?.id
                          ? 'bg-card text-foreground border-b-2 border-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <Icon name={tab?.icon} size={16} />
                      <span className="hidden sm:inline">{tab?.label}</span>
                      <span className="sm:hidden">{tab?.label?.split(' ')?.[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="space-y-8">
                {renderTabContent()}
              </div>

              {/* Compliance Footer */}
              <div className="mt-12 p-6 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-start space-x-4">
                  <Icon name="Shield" size={24} className="text-primary mt-1" />
                  <div>
                    <h3 className="font-heading font-semibold text-foreground mb-2">
                      Conformité Réglementaire
                    </h3>
                    <p className="text-sm text-foreground mb-3">
                      Cette application est conçue pour être conforme aux réglementations fiscales 
                      de la République de Guinée en vigueur au {new Date()?.toLocaleDateString('fr-FR')}.
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span>• Code Général des Impôts de Guinée</span>
                      <span>• Loi de Finances {new Date()?.getFullYear()}</span>
                      <span>• Réglementations CNSS</span>
                      <span>• Directives du Ministère des Finances</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <QuickActionFAB />
    </>
  );
};

export default TaxSettings;