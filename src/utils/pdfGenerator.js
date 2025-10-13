import jsPDF from 'jspdf';

// Génération du bulletin de paie PDF
export const generatePayslipPDF = async (employee, calculation, period, employer) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // En-tête avec informations employeur
  pdf.setFillColor(41, 128, 185);
  pdf.rect(0, 0, pageWidth, 40, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.text(employer.companyName.toUpperCase(), pageWidth / 2, 15, { align: 'center' });
  pdf.setFontSize(20);
  pdf.text('BULLETIN DE PAIE', pageWidth / 2, 25, { align: 'center' });
  pdf.setFontSize(12);
  pdf.text(`Période: ${period}`, pageWidth / 2, 32, { align: 'center' });

  // Informations employeur
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(10);
  let yPosition = 50;
  
  if (employer.address || employer.city) {
    pdf.text(`Adresse: ${employer.address || ''} ${employer.city || ''}`, 20, yPosition);
    yPosition += 5;
  }
  
  if (employer.phone) {
    pdf.text(`Téléphone: ${employer.phone}`, 20, yPosition);
    yPosition += 5;
  }
  
  if (employer.email) {
    pdf.text(`Email: ${employer.email}`, 20, yPosition);
    yPosition += 5;
  }
  
  if (employer.rccm || employer.nif) {
    const rccmText = employer.rccm ? `RCCM: ${employer.rccm}` : '';
    const nifText = employer.nif ? `NIF: ${employer.nif}` : '';
    const separator = employer.rccm && employer.nif ? ' | ' : '';
    pdf.text(`${rccmText}${separator}${nifText}`, 20, yPosition);
    yPosition += 5;
  }
  
  if (employer.cnssNumber) {
    pdf.text(`CNSS: ${employer.cnssNumber}`, 20, yPosition);
    yPosition += 5;
  }

  // NOUVEAU : Affichage de l'effectif
  if (employer.employeeCount) {
    pdf.text(`Effectif: ${employer.employeeCount} salariés`, 20, yPosition);
    yPosition += 5;
  }

  // Ligne séparatrice
  pdf.setDrawColor(200, 200, 200);
  pdf.line(20, yPosition, pageWidth - 20, yPosition);
  yPosition += 10;

  // Informations employé
  pdf.setFontSize(14);
  pdf.text('INFORMATIONS EMPLOYÉ', 20, yPosition);
  
  yPosition += 10;
  pdf.setFontSize(10);
  pdf.text(`Nom: ${employee.fullName}`, 20, yPosition);
  pdf.text(`Poste: ${employee.position}`, 20, yPosition + 7);
  pdf.text(`Matricule: ${employee.employeeId || 'N/A'}`, 20, yPosition + 14);
  pdf.text(`Département: ${employee.department || 'N/A'}`, 100, yPosition);
  pdf.text(`Type contrat: ${employee.employmentType || 'CDI'}`, 100, yPosition + 7);

  // Détails du salaire
  yPosition += 30;
  pdf.setFontSize(14);
  pdf.text('DÉTAIL DU SALAIRE', 20, yPosition);
  
  yPosition += 10;
  pdf.setFontSize(10);
  
  // Gains - Filtrer les éléments à 0
  const gains = [
    { label: 'Salaire de base', value: calculation.baseSalary },
    { label: 'Prime de logement', value: calculation.housingAllowance },
    { label: 'Prime de transport', value: calculation.transportAllowance },
    { label: 'Prime de cherté de vie', value: calculation.livingAllowance },
    { label: 'Prime de nourriture', value: calculation.foodAllowance },
    { label: 'Autres indemnités', value: calculation.allowances },
    { label: 'Prime/Bonus', value: calculation.bonus },
    { label: '13ème mois (prorata)', value: calculation.thirteenthMonth }
  ].filter(item => item.value > 0);

  gains.forEach((item, index) => {
    pdf.text(item.label, 20, yPosition + (index * 7));
    pdf.text(formatCurrencyForPDF(item.value), 150, yPosition + (index * 7), { align: 'right' });
  });

  // Heures supplémentaires détaillées - Filtrer les éléments à 0
  if (calculation.overtimeHours > 0) {
    yPosition += (gains.length * 7) + 5;
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.text('HEURES SUPPLÉMENTAIRES', 20, yPosition);
    
    yPosition += 10;
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    
    const overtimeDetails = [
      { label: 'Total heures supplémentaires', value: calculation.overtimePay },
      { label: 'Heures 1-4 (30% majoration)', value: calculation.overtimeBreakdown.normal1to4 },
      { label: 'Heures 5+ (60% majoration)', value: calculation.overtimeBreakdown.normal5plus },
      { label: 'Heures nuit 1-4 (50% majoration)', value: calculation.overtimeBreakdown.night1to4 },
      { label: 'Heures nuit 5+ (80% majoration)', value: calculation.overtimeBreakdown.night5plus }
    ].filter(item => item.value > 0);

    overtimeDetails.forEach((item, index) => {
      pdf.text(item.label, 20, yPosition + (index * 7));
      pdf.text(formatCurrencyForPDF(item.value), 150, yPosition + (index * 7), { align: 'right' });
    });
    
    yPosition += (overtimeDetails.length * 7) + 5;
  } else {
    yPosition += (gains.length * 7) + 5;
  }

  // Total brut
  pdf.text('Total Brut', 20, yPosition);
  pdf.text(formatCurrencyForPDF(calculation.grossSalary), 150, yPosition, { align: 'right' });

  // Calcul RTS
  yPosition += 15;
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'bold');
  pdf.text('CALCUL SALAIRE IMPOSABLE (RTS)', 20, yPosition);
  
  yPosition += 10;
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  
  const rtsCalculation = [
    { label: 'Salaire brut', value: calculation.grossSalary },
    { label: 'CNSS salariale', value: -calculation.socialContributions.cnss },
    { label: 'Primes exonérées (max 25%)', value: -calculation.exemptAllowancesTotal },
    { label: 'SALAIRE IMPOSABLE RTS', value: calculation.taxableIncome }
  ];

  rtsCalculation.forEach((item, index) => {
    pdf.text(item.label, 20, yPosition + (index * 7));
    const value = item.value >= 0 ? 
      formatCurrencyForPDF(item.value) : 
      `- ${formatCurrencyForPDF(Math.abs(item.value))}`;
    pdf.text(value, 150, yPosition + (index * 7), { align: 'right' });
  });

  // Déductions - Filtrer les éléments à 0
  yPosition += 35;
  const deductions = [
    { label: 'Impôt sur le revenu (RTS)', value: calculation.incomeTax },
    { label: 'Cotisation CNSS', value: calculation.socialContributions.cnss }
  ].filter(item => item.value > 0);

  deductions.forEach((item, index) => {
    pdf.text(item.label, 20, yPosition + (index * 7));
    pdf.text(formatCurrencyForPDF(item.value), 150, yPosition + (index * 7), { align: 'right' });
  });

  // Total déductions
  if (deductions.length > 0) {
    yPosition += (deductions.length * 7) + 5;
    pdf.text('Total Déductions', 20, yPosition);
    pdf.text(formatCurrencyForPDF(calculation.totalDeductions), 150, yPosition, { align: 'right' });
  } else {
    yPosition += 5;
  }

  // Salaire net
  yPosition += 15;
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'bold');
  pdf.text('SALAIRE NET À PAYER', 20, yPosition);
  pdf.text(formatCurrencyForPDF(calculation.netSalary), 150, yPosition, { align: 'right' });

  // Vérifier si on a assez d'espace pour les charges employeur
  const remainingSpace = pageHeight - yPosition - 40;
  const employerChargesHeight = 60; // Augmenté pour inclure la logique conditionnelle
  
  if (remainingSpace < employerChargesHeight) {
    pdf.addPage();
    yPosition = 20;
  } else {
    yPosition += 20;
  }

  // CHARGES PATRONALES - MIS À JOUR AVEC TAXE D'APPRENTISSAGE/ONFPP
  pdf.setFontSize(12);
  pdf.setTextColor(139, 69, 19);
  pdf.text('CHARGES PATRONALES', 20, yPosition);
  
  yPosition += 10;
  pdf.setFontSize(10);
  
  // CNSS Patronale
  pdf.text('CNSS Patronale (18%):', 20, yPosition);
  pdf.text(formatCurrencyForPDF(calculation.employerCharges.cnssEmployer), 150, yPosition, { align: 'right' });
  
  yPosition += 7;
  
  // Versement Forfaitaire (VF)
  pdf.text('Versement Forfaitaire (6% base VF):', 20, yPosition);
  pdf.text(formatCurrencyForPDF(calculation.employerCharges.versementForfaitaire), 150, yPosition, { align: 'right' });
  
  yPosition += 7;
  
  // AFFICHAGE CONDITIONNEL : Taxe d'Apprentissage ou ONFPP
  if (calculation.employerCharges.taxeApprentissage > 0) {
    pdf.text('Taxe d\'Apprentissage (3% du brut):', 20, yPosition);
    pdf.text(formatCurrencyForPDF(calculation.employerCharges.taxeApprentissage), 150, yPosition, { align: 'right' });
  } else {
    pdf.text('ONFPP (1.5% du brut):', 20, yPosition);
    pdf.text(formatCurrencyForPDF(calculation.employerCharges.onfpp), 150, yPosition, { align: 'right' });
  }
  
  yPosition += 7;
  
  // Total charges patronales
  pdf.setFont(undefined, 'bold');
  pdf.text('Total charges patronales:', 20, yPosition);
  pdf.text(formatCurrencyForPDF(calculation.employerCharges.totalCharges), 150, yPosition, { align: 'right' });
  
  yPosition += 10;
  pdf.setFont(undefined, 'normal');
  
  // Coût total pour l'employeur
  pdf.text('Salaire brut:', 20, yPosition);
  pdf.text(formatCurrencyForPDF(calculation.grossSalary), 150, yPosition, { align: 'right' });
  
  yPosition += 7;
  pdf.text('Charges patronales:', 20, yPosition);
  pdf.text(formatCurrencyForPDF(calculation.employerCharges.totalCharges), 150, yPosition, { align: 'right' });
  
  yPosition += 7;
  pdf.setFont(undefined, 'bold');
  pdf.text('COÛT TOTAL EMPLOYEUR:', 20, yPosition);
  pdf.text(formatCurrencyForPDF(calculation.employerCharges.total), 150, yPosition, { align: 'right' });

  // Notes
  yPosition += 15;
  pdf.setFontSize(8);
  pdf.setTextColor(128, 128, 128);
  
  const notes = [
    '* CNSS salariale: 5% (plafond 2.500.000 GNF, minimum 550.000 GNF)',
    '* CNSS patronale: 18% (mêmes plafonds)',
  ];

  // NOUVEAU : Note conditionnelle pour Taxe d'Apprentissage ou ONFPP
  if (calculation.employerCharges.taxeApprentissage > 0) {
    notes.push('* Taxe d\'Apprentissage: 3% du salaire brut (entreprises de moins de 30 salariés)');
  } else {
    notes.push('* ONFPP: 1.5% du salaire brut (entreprises de 30 salariés ou plus)');
  }

  notes.push(
    '* Primes exonérées: logement, transport, cherté de vie, nourriture (max 25% du brut)',
    '* Base VF = SI(Salaire<2.500.000; Salaire-(Salaire*6%); Salaire-(2.500.000*6%))',
    '* VF = 6% de la base VF'
  );
  
  if (calculation.overtimeHours > 0) {
    notes.push('* Heures sup. 1-4: 30% majoration, Heures sup. 5+: 60% majoration');
    notes.push('* Heures de nuit: +20% majoration supplémentaire (cumulable)');
  }

  // Vérifier l'espace pour les notes
  const notesHeight = notes.length * 4;
  const footerY = pageHeight - 20;
  
  if (yPosition + notesHeight > footerY - 10) {
    pdf.addPage();
    yPosition = 20;
  }

  // Afficher les notes
  notes.forEach((note, index) => {
    pdf.text(note, 20, yPosition + (index * 4));
  });

  // Pied de page
  const finalY = Math.max(yPosition + (notes.length * 4) + 10, footerY - 20);
  pdf.setFontSize(8);
  pdf.setTextColor(128, 128, 128);
  
  // Vérifier si on est sur la dernière page
  const currentPage = pdf.internal.getCurrentPageInfo().pageNumber;
  const totalPages = pdf.internal.getNumberOfPages();
  
  if (currentPage === totalPages) {
    pdf.text('Document généré le ' + new Date().toLocaleDateString('fr-FR'), pageWidth / 2, finalY, { align: 'center' });
    pdf.text('Signature employé', 20, finalY);
    pdf.text('Cachet et signature employeur', pageWidth - 20, finalY, { align: 'right' });
  }
  
  // Sauvegarde du PDF
  const fileName = `bulletin-paie-${employee.fullName.replace(/\s+/g, '-')}-${period.replace(/\s+/g, '-')}.pdf`;
  pdf.save(fileName);
};

// Fonction pour le formatage des montants
const formatCurrencyForPDF = (amount) => {
  const numberString = Math.round(amount).toString();
  
  let formatted = '';
  let count = 0;
  
  for (let i = numberString.length - 1; i >= 0; i--) {
    if (count > 0 && count % 3 === 0) {
      formatted = ' ' + formatted;
    }
    formatted = numberString[i] + formatted;
    count++;
  }
  
  return `${formatted} FG`;
};