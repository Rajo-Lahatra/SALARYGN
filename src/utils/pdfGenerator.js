// CORRECTION : Importation correcte
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Fonction pour générer le bulletin de paie PDF
export const generatePayslipPDF = async (employee, calculation, period, employer) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

  // En-tête du bulletin
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('BULLETIN DE PAIE', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  // Informations employeur
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Employeur: ${employer.companyName || 'Non spécifié'}`, 20, yPosition);
  doc.text(`Période: ${period}`, pageWidth - 20, yPosition, { align: 'right' });
  yPosition += 8;
  doc.text(`Adresse: ${employer.address || 'Non spécifié'}`, 20, yPosition);
  doc.text(`NIF: ${employer.nif || 'Non spécifié'}`, pageWidth - 20, yPosition, { align: 'right' });
  yPosition += 8;
  doc.text(`Téléphone: ${employer.phone || 'Non spécifié'}`, 20, yPosition);
  doc.text(`RCCM: ${employer.rccm || 'Non spécifié'}`, pageWidth - 20, yPosition, { align: 'right' });
  yPosition += 15;

  // Informations employé
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMATIONS EMPLOYÉ', 20, yPosition);
  yPosition += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nom: ${employee.fullName}`, 20, yPosition);
  doc.text(`Matricule: ${employee.employeeId || 'Non spécifié'}`, pageWidth / 2, yPosition);
  yPosition += 6;
  doc.text(`Poste: ${employee.position || 'Non spécifié'}`, 20, yPosition);
  doc.text(`Département: ${employee.department || 'Non spécifié'}`, pageWidth / 2, yPosition);
  yPosition += 15;

  // Récapitulatif des gains
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('RÉCAPITULATIF DES GAINS', 20, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const gains = [
    ['Salaire de base', calculation.baseSalary],
    ['Prime de logement', calculation.housingAllowance],
    ['Prime de transport', calculation.transportAllowance],
    ['Prime de cherté de vie', calculation.livingAllowance],
    ['Prime de nourriture', calculation.foodAllowance],
    ['Autres indemnités', calculation.allowances],
    ['Avantages en nature', calculation.bonus],
    ['Heures supplémentaires', calculation.overtimePay],
    ['13ème mois et avantages', calculation.thirteenthMonth]
  ];

  // Ajouter les avantages supplémentaires s'ils existent
  if (calculation.additionalBenefits && calculation.additionalBenefits.length > 0) {
    calculation.additionalBenefits.forEach(benefit => {
      gains.push([benefit.type, benefit.amount]);
    });
  }

  gains.forEach(([label, amount]) => {
    if (amount > 0) {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`${label}:`, 20, yPosition);
      doc.text(formatCurrencyForPDF(amount), pageWidth - 20, yPosition, { align: 'right' });
      yPosition += 6;
    }
  });

  // Total brut
  if (yPosition > 240) {
    doc.addPage();
    yPosition = 20;
  }
  yPosition += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('Total Brut:', 20, yPosition);
  doc.text(formatCurrencyForPDF(calculation.grossSalary), pageWidth - 20, yPosition, { align: 'right' });
  yPosition += 10;

  // Détail des déductions
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DÉDUCTIONS', 20, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const deductions = [
    ['Impôt sur le revenu (RTS)', calculation.incomeTax],
    ['Cotisation CNSS', calculation.socialContributions.cnss]
  ];

  deductions.forEach(([label, amount]) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(`${label}:`, 20, yPosition);
    doc.text(`- ${formatCurrencyForPDF(amount)}`, pageWidth - 20, yPosition, { align: 'right' });
    yPosition += 6;
  });

  // Total déductions
  if (yPosition > 240) {
    doc.addPage();
    yPosition = 20;
  }
  yPosition += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('Total Déductions:', 20, yPosition);
  doc.text(`- ${formatCurrencyForPDF(calculation.totalDeductions)}`, pageWidth - 20, yPosition, { align: 'right' });
  yPosition += 10;

  // Salaire net à payer
  if (yPosition > 230) {
    doc.addPage();
    yPosition = 20;
  }
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('SALAIRE NET À PAYER:', 20, yPosition);
  doc.text(formatCurrencyForPDF(calculation.netSalary), pageWidth - 20, yPosition, { align: 'right' });
  yPosition += 15;

  // Détail des charges patronales (nouvelle section)
  if (yPosition > 200) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('CHARGES PATRONALES', 20, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const employerCharges = [
    ['CNSS Patronale (18%)', calculation.employerCharges.cnssEmployer],
    ['Versement Forfaitaire (6%)', calculation.employerCharges.versementForfaitaire]
  ];

  // Ajouter la taxe appropriée
  if (calculation.employerCharges.taxeApprentissage > 0) {
    employerCharges.push(['Taxe d\'Apprentissage (3%)', calculation.employerCharges.taxeApprentissage]);
  } else if (calculation.employerCharges.onfpp > 0) {
    employerCharges.push(['ONFPP (1.5%)', calculation.employerCharges.onfpp]);
  }

  employerCharges.forEach(([label, amount]) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(`${label}:`, 20, yPosition);
    doc.text(formatCurrencyForPDF(amount), pageWidth - 20, yPosition, { align: 'right' });
    yPosition += 6;
  });

  // Total charges patronales
  if (yPosition > 240) {
    doc.addPage();
    yPosition = 20;
  }
  yPosition += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('Total Charges Patronales:', 20, yPosition);
  doc.text(formatCurrencyForPDF(calculation.employerCharges.totalCharges), pageWidth - 20, yPosition, { align: 'right' });
  yPosition += 8;

  // Coût total employeur
  doc.text('Coût Total Employeur:', 20, yPosition);
  doc.text(formatCurrencyForPDF(calculation.employerCharges.total), pageWidth - 20, yPosition, { align: 'right' });
  yPosition += 15;

  // Pied de page
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('Document généré automatiquement - Calculs conformes au barème fiscal guinéen', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 5;
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, yPosition, { align: 'center' });

  // Sauvegarder le PDF
  const fileName = `bulletin-paie-${employee.fullName.replace(/\s+/g, '-')}-${period.replace(/\s+/g, '-')}.pdf`;
  doc.save(fileName);
};

// Fonction utilitaire pour formater les montants dans le PDF
const formatCurrencyForPDF = (amount) => {
  return new Intl.NumberFormat('fr-GN', {
    style: 'currency',
    currency: 'GNF',
    minimumFractionDigits: 0
  }).format(amount);
};

// Fonction pour générer un rapport PDF détaillé
export const generateDetailedReportPDF = (reportData, company, period) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

  // En-tête du rapport
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('RAPPORT SALARIAL DÉTAILLÉ', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Période: ${period}`, 20, yPosition);
  doc.text(`Entreprise: ${company?.company_name || 'Non spécifiée'}`, pageWidth - 20, yPosition, { align: 'right' });
  yPosition += 8;
  doc.text(`Effectif: ${company?.employee_count || 'Non spécifié'} salariés`, 20, yPosition);
  doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, pageWidth - 20, yPosition, { align: 'right' });
  yPosition += 20;

  // Statistiques globales
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('STATISTIQUES GLOBALES', 20, yPosition);
  yPosition += 10;

  const stats = [
    ['Total salaires bruts', reportData.salaryStats.totalGross],
    ['Total salaires nets', reportData.salaryStats.totalNet],
    ['Total impôts RTS', reportData.salaryStats.totalTax],
    ['Total CNSS salariale', reportData.salaryStats.totalCNSS],
    ['Total charges patronales', reportData.salaryStats.totalEmployerCharges],
    ['Coût total employeur', reportData.salaryStats.totalEmployerCost],
    ['Nombre de calculs', reportData.totalCalculations]
  ];

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  stats.forEach(([label, value]) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(`${label}:`, 20, yPosition);
    
    if (typeof value === 'number') {
      doc.text(formatCurrencyForPDF(value), pageWidth - 20, yPosition, { align: 'right' });
    } else {
      doc.text(value.toString(), pageWidth - 20, yPosition, { align: 'right' });
    }
    
    yPosition += 8;
  });

  doc.save(`rapport-salarial-${period.replace(/\s+/g, '-')}.pdf`);
};