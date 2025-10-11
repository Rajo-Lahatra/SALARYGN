import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const EmployeeModal = ({ isOpen, onClose, employee, onSave, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    employmentType: '',
    status: 'Actif',
    salary: '',
    startDate: '',
    address: '',
    socialSecurityNumber: '',
    taxId: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (employee && mode === 'edit') {
      setFormData({
        name: employee?.name || '',
        email: employee?.email || '',
        phone: employee?.phone || '',
        department: employee?.department || '',
        position: employee?.position || '',
        employmentType: employee?.employmentType || '',
        status: employee?.status || 'Actif',
        salary: employee?.salary || '',
        startDate: employee?.startDate || '',
        address: employee?.address || '',
        socialSecurityNumber: employee?.socialSecurityNumber || '',
        taxId: employee?.taxId || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: '',
        position: '',
        employmentType: '',
        status: 'Actif',
        salary: '',
        startDate: '',
        address: '',
        socialSecurityNumber: '',
        taxId: ''
      });
    }
    setErrors({});
  }, [employee, mode, isOpen]);

  const departmentOptions = [
    { value: 'Ressources Humaines', label: 'Ressources Humaines' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Informatique', label: 'Informatique' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Ventes', label: 'Ventes' },
    { value: 'Production', label: 'Production' },
    { value: 'Administration', label: 'Administration' }
  ];

  const employmentTypeOptions = [
    { value: 'CDI', label: 'CDI (Contrat à Durée Indéterminée)' },
    { value: 'CDD', label: 'CDD (Contrat à Durée Déterminée)' },
    { value: 'Stage', label: 'Stage' },
    { value: 'Consultant', label: 'Consultant' },
    { value: 'Freelance', label: 'Freelance' }
  ];

  const statusOptions = [
    { value: 'Actif', label: 'Actif' },
    { value: 'Inactif', label: 'Inactif' },
    { value: 'Congé', label: 'En congé' },
    { value: 'Suspendu', label: 'Suspendu' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) newErrors.name = 'Le nom est requis';
    if (!formData?.email?.trim()) newErrors.email = 'L\'email est requis';
    else if (!/\S+@\S+\.\S+/?.test(formData?.email)) newErrors.email = 'Format d\'email invalide';
    if (!formData?.department) newErrors.department = 'Le département est requis';
    if (!formData?.position?.trim()) newErrors.position = 'Le poste est requis';
    if (!formData?.employmentType) newErrors.employmentType = 'Le type d\'emploi est requis';
    if (!formData?.salary || formData?.salary <= 0) newErrors.salary = 'Le salaire doit être supérieur à 0';
    if (!formData?.startDate) newErrors.startDate = 'La date de début est requise';

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onSave({
        ...formData,
        id: employee?.id || Date.now(),
        salary: parseFloat(formData?.salary)
      });
      onClose();
    } catch (error) {
      console.error('Error saving employee:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name={mode === 'edit' ? 'Edit' : 'UserPlus'} size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-lg text-foreground">
                {mode === 'edit' ? 'Modifier l\'Employé' : 'Ajouter un Employé'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {mode === 'edit' ? 'Mettre à jour les informations' : 'Créer un nouveau profil employé'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="font-heading font-medium text-foreground mb-4 flex items-center space-x-2">
                <Icon name="User" size={16} className="text-primary" />
                <span>Informations Personnelles</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nom Complet"
                  type="text"
                  value={formData?.name}
                  onChange={(e) => handleInputChange('name', e?.target?.value)}
                  error={errors?.name}
                  required
                  placeholder="Ex: Mamadou Diallo"
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData?.email}
                  onChange={(e) => handleInputChange('email', e?.target?.value)}
                  error={errors?.email}
                  required
                  placeholder="mamadou.diallo@entreprise.gn"
                />
                <Input
                  label="Téléphone"
                  type="tel"
                  value={formData?.phone}
                  onChange={(e) => handleInputChange('phone', e?.target?.value)}
                  error={errors?.phone}
                  placeholder="+224 XXX XX XX XX"
                />
                <Input
                  label="Adresse"
                  type="text"
                  value={formData?.address}
                  onChange={(e) => handleInputChange('address', e?.target?.value)}
                  error={errors?.address}
                  placeholder="Adresse complète"
                />
              </div>
            </div>

            {/* Employment Information */}
            <div>
              <h3 className="font-heading font-medium text-foreground mb-4 flex items-center space-x-2">
                <Icon name="Briefcase" size={16} className="text-accent" />
                <span>Informations Professionnelles</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Département"
                  options={departmentOptions}
                  value={formData?.department}
                  onChange={(value) => handleInputChange('department', value)}
                  error={errors?.department}
                  required
                  placeholder="Sélectionner un département"
                />
                <Input
                  label="Poste"
                  type="text"
                  value={formData?.position}
                  onChange={(e) => handleInputChange('position', e?.target?.value)}
                  error={errors?.position}
                  required
                  placeholder="Ex: Développeur Senior"
                />
                <Select
                  label="Type d'Emploi"
                  options={employmentTypeOptions}
                  value={formData?.employmentType}
                  onChange={(value) => handleInputChange('employmentType', value)}
                  error={errors?.employmentType}
                  required
                  placeholder="Sélectionner le type"
                />
                <Select
                  label="Statut"
                  options={statusOptions}
                  value={formData?.status}
                  onChange={(value) => handleInputChange('status', value)}
                  error={errors?.status}
                  required
                />
              </div>
            </div>

            {/* Financial Information */}
            <div>
              <h3 className="font-heading font-medium text-foreground mb-4 flex items-center space-x-2">
                <Icon name="DollarSign" size={16} className="text-success" />
                <span>Informations Financières</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Salaire Mensuel (GNF)"
                  type="number"
                  value={formData?.salary}
                  onChange={(e) => handleInputChange('salary', e?.target?.value)}
                  error={errors?.salary}
                  required
                  placeholder="Ex: 5000000"
                  min="0"
                />
                <Input
                  label="Date de Début"
                  type="date"
                  value={formData?.startDate}
                  onChange={(e) => handleInputChange('startDate', e?.target?.value)}
                  error={errors?.startDate}
                  required
                />
              </div>
            </div>

            {/* Tax Information */}
            <div>
              <h3 className="font-heading font-medium text-foreground mb-4 flex items-center space-x-2">
                <Icon name="FileText" size={16} className="text-secondary" />
                <span>Informations Fiscales</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Numéro de Sécurité Sociale"
                  type="text"
                  value={formData?.socialSecurityNumber}
                  onChange={(e) => handleInputChange('socialSecurityNumber', e?.target?.value)}
                  error={errors?.socialSecurityNumber}
                  placeholder="CNSS-XXXXXXXXX"
                />
                <Input
                  label="Numéro d'Identification Fiscale"
                  type="text"
                  value={formData?.taxId}
                  onChange={(e) => handleInputChange('taxId', e?.target?.value)}
                  error={errors?.taxId}
                  placeholder="NIF-XXXXXXXXX"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-muted/30">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            loading={isLoading}
            iconName={mode === 'edit' ? 'Save' : 'UserPlus'}
            iconPosition="left"
          >
            {mode === 'edit' ? 'Mettre à Jour' : 'Ajouter l\'Employé'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;