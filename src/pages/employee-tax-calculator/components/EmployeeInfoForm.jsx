import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const EmployeeInfoForm = ({ formData, onFormChange, errors }) => {
  const employmentCategories = [
    { value: 'permanent', label: 'Employé Permanent' },
    { value: 'contract', label: 'Contractuel' },
    { value: 'temporary', label: 'Temporaire' },
    { value: 'consultant', label: 'Consultant' }
  ];

  const handleInputChange = (field, value) => {
    onFormChange({ ...formData, [field]: value });
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    return value?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const handleCurrencyChange = (field, value) => {
    const numericValue = value?.replace(/\s/g, '');
    if (/^\d*$/?.test(numericValue)) {
      handleInputChange(field, numericValue);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
        Informations Employé
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nom Complet"
          type="text"
          placeholder="Ex: Mamadou Diallo"
          value={formData?.fullName || ''}
          onChange={(e) => handleInputChange('fullName', e?.target?.value)}
          error={errors?.fullName}
          required
          className="col-span-1 md:col-span-2"
        />

        <Input
          label="Poste"
          type="text"
          placeholder="Ex: Comptable Senior"
          value={formData?.position || ''}
          onChange={(e) => handleInputChange('position', e?.target?.value)}
          error={errors?.position}
          required
        />

        <Select
          label="Catégorie d'Emploi"
          options={employmentCategories}
          value={formData?.employmentCategory || ''}
          onChange={(value) => handleInputChange('employmentCategory', value)}
          placeholder="Sélectionner une catégorie"
          error={errors?.employmentCategory}
          required
        />

        <Input
          label="Salaire Brut Mensuel"
          type="text"
          placeholder="Ex: 5 000 000"
          value={formatCurrency(formData?.grossSalary)}
          onChange={(e) => handleCurrencyChange('grossSalary', e?.target?.value)}
          error={errors?.grossSalary}
          description="Montant en Francs Guinéens (GNF)"
          required
        />

        <Input
          label="Indemnités"
          type="text"
          placeholder="Ex: 500 000"
          value={formatCurrency(formData?.allowances)}
          onChange={(e) => handleCurrencyChange('allowances', e?.target?.value)}
          error={errors?.allowances}
          description="Indemnités diverses (GNF)"
        />

        <Input
          label="Heures Supplémentaires"
          type="number"
          placeholder="Ex: 10"
          value={formData?.overtimeHours || ''}
          onChange={(e) => handleInputChange('overtimeHours', e?.target?.value)}
          error={errors?.overtimeHours}
          description="Nombre d'heures par mois"
        />

        <Input
          label="Prime/Bonus"
          type="text"
          placeholder="Ex: 1 000 000"
          value={formatCurrency(formData?.bonus)}
          onChange={(e) => handleCurrencyChange('bonus', e?.target?.value)}
          error={errors?.bonus}
          description="Prime mensuelle (GNF)"
        />

        <Input
          label="13ème Mois (Prorata)"
          type="text"
          placeholder="Ex: 416 667"
          value={formatCurrency(formData?.thirteenthMonth)}
          onChange={(e) => handleCurrencyChange('thirteenthMonth', e?.target?.value)}
          error={errors?.thirteenthMonth}
          description="Montant mensuel proratisé (GNF)"
        />
      </div>
    </div>
  );
};

export default EmployeeInfoForm;