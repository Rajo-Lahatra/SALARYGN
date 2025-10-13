// Configuration des tranches d'imposition
export const TAX_BRACKETS = [
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
];

// Taux des cotisations sociales (CNSS et ONFPP)
export const SOCIAL_CONTRIBUTIONS = {
  CNSS_EMPLOYEE_RATE: 0.05, // 5% part salariale
  CNSS_EMPLOYER_RATE: 0.18, // 18% part patronale
  ONFPP_EMPLOYER_RATE: 0.015, // 1.5% ONFPP part patronale
};

// Calcul de la CNSS part salariale selon les règles guinéennes
export const calculateCNSSEmployee = (grossSalary) => {
  if (!grossSalary || grossSalary <= 0) return 0;
  
  let base = grossSalary;
  
  // Application des plafonds
  if (grossSalary > 2500000) {
    base = 2500000;
  } else if (grossSalary > 550000) {
    base = grossSalary;
  } else {
    base = 550000;
  }
  
  return base * SOCIAL_CONTRIBUTIONS.CNSS_EMPLOYEE_RATE;
};

// Calcul de la CNSS part patronale selon les règles guinéennes
export const calculateCNSSEmployer = (grossSalary) => {
  if (!grossSalary || grossSalary <= 0) return 0;
  
  let base = grossSalary;
  
  // Application des plafonds
  if (grossSalary > 2500000) {
    base = 2500000;
  } else if (grossSalary > 550000) {
    base = grossSalary;
  } else {
    base = 550000;
  }
  
  return base * SOCIAL_CONTRIBUTIONS.CNSS_EMPLOYER_RATE;
};

// Calcul de la cotisation ONFPP (1.5% du salaire brut)
export const calculateONFPP = (grossSalary) => {
  if (!grossSalary || grossSalary <= 0) return 0;
  return grossSalary * SOCIAL_CONTRIBUTIONS.ONFPP_EMPLOYER_RATE;
};

// Calcul de la base VF selon la formule Excel
export const calculateVFBase = (grossSalary) => {
  if (grossSalary < 2500000) {
    return grossSalary - (grossSalary * 0.06);
  } else {
    return grossSalary - (2500000 * 0.06);
  }
};

// Calcul du versement forfaitaire (6% de la base VF)
export const calculateVersementForfaitaire = (grossSalary) => {
  const vfBase = calculateVFBase(grossSalary);
  return vfBase * 0.06;
};

// Calcul de l'impôt sur le revenu progressif
export const calculateIncomeTax = (taxableIncome) => {
  let remainingIncome = taxableIncome;
  let totalTax = 0;

  for (const bracket of TAX_BRACKETS) {
    if (remainingIncome <= 0) break;

    const bracketRange = bracket.maxAmount ? 
      Math.min(bracket.maxAmount - bracket.minAmount + 1, remainingIncome) : 
      remainingIncome;

    const incomeInBracket = Math.min(bracketRange, remainingIncome);
    
    if (incomeInBracket > 0) {
      totalTax += incomeInBracket * (bracket.rate / 100);
      remainingIncome -= incomeInBracket;
    }
  }

  return Math.round(totalTax);
};

// Calcul des cotisations sociales (CNSS seulement)
export const calculateSocialContributions = (grossSalary) => {
  const cnss = calculateCNSSEmployee(grossSalary);

  return {
    cnss: Math.round(cnss),
    total: Math.round(cnss)
  };
};

// Calcul des charges employeur (MISE À JOUR AVEC ONFPP)
export const calculateEmployerCharges = (grossSalary) => {
  const cnssEmployer = calculateCNSSEmployer(grossSalary);
  const versementForfaitaire = calculateVersementForfaitaire(grossSalary);
  const onfpp = calculateONFPP(grossSalary);
  
  return {
    cnssEmployer: Math.round(cnssEmployer),
    versementForfaitaire: Math.round(versementForfaitaire),
    onfpp: Math.round(onfpp),
    vfBase: Math.round(calculateVFBase(grossSalary)),
    total: Math.round(grossSalary + cnssEmployer + versementForfaitaire + onfpp)
  };
};

// Calcul du salaire imposable pour la RTS
export const calculateTaxableIncome = (grossSalary, cnssEmployee, exemptAllowances) => {
  const exemptAllowancesCap = grossSalary * 0.25; // 25% du salaire brut
  const exemptAllowancesTotal = Math.min(exemptAllowances, exemptAllowancesCap);
  
  return grossSalary - cnssEmployee - exemptAllowancesTotal;
};

// Calcul des heures supplémentaires selon les taux légaux
export const calculateOvertimePay = (baseSalary, overtimeData) => {
  const {
    normal1to4 = 0,    // Heures 1-4 à 30%
    normal5plus = 0,   // Heures 5+ à 60%
    night1to4 = 0,     // Heures de nuit 1-4 à 50% (30%+20%)
    night5plus = 0     // Heures de nuit 5+ à 80% (60%+20%)
  } = overtimeData;

  const hourlyRate = baseSalary / 173; // Heures mensuelles standard

  const normal1to4Pay = normal1to4 * hourlyRate * 1.30; // 30% de majoration
  const normal5plusPay = normal5plus * hourlyRate * 1.60; // 60% de majoration
  const night1to4Pay = night1to4 * hourlyRate * 1.50; // 50% de majoration (30%+20%)
  const night5plusPay = night5plus * hourlyRate * 1.80; // 80% de majoration (60%+20%)

  const totalOvertimePay = normal1to4Pay + normal5plusPay + night1to4Pay + night5plusPay;
  const totalOvertimeHours = normal1to4 + normal5plus + night1to4 + night5plus;

  return {
    total: Math.round(totalOvertimePay),
    hours: totalOvertimeHours,
    breakdown: {
      normal1to4: Math.round(normal1to4Pay),
      normal5plus: Math.round(normal5plusPay),
      night1to4: Math.round(night1to4Pay),
      night5plus: Math.round(night5plusPay)
    }
  };
};

// Calcul du salaire net complet
export const calculateNetSalary = (employeeData) => {
  const {
    baseSalary = 0,
    allowances = 0,
    bonus = 0,
    overtimeData = {},
    thirteenthMonth = 0,
    housingAllowance = 0,
    transportAllowance = 0,
    livingAllowance = 0,
    foodAllowance = 0
  } = employeeData;

  // Validation des données
  if (!baseSalary || baseSalary <= 0) {
    throw new Error("Le salaire de base est requis et doit être positif");
  }

  // Calcul des primes exonérées totales
  const exemptAllowances = housingAllowance + transportAllowance + livingAllowance + foodAllowance;

  // Calcul des heures supplémentaires
  const overtimeCalculation = calculateOvertimePay(baseSalary, overtimeData);

  // Calcul du salaire brut total
  const grossSalary = baseSalary + allowances + bonus + thirteenthMonth + overtimeCalculation.total + exemptAllowances;

  // Calcul des cotisations (CNSS seulement)
  const socialContributions = calculateSocialContributions(grossSalary);
  
  // Calcul du salaire imposable pour la RTS
  const taxableIncome = calculateTaxableIncome(
    grossSalary, 
    socialContributions.cnss, 
    exemptAllowances
  );
  
  // Calcul de l'impôt sur le revenu (RTS)
  const incomeTax = calculateIncomeTax(taxableIncome);

  // Total des déductions
  const totalDeductions = incomeTax + socialContributions.total;

  // Salaire net
  const netSalary = grossSalary - totalDeductions;

  // Charges employeur (MAINTENANT AVEC ONFPP)
  const employerCharges = calculateEmployerCharges(grossSalary);

  return {
    grossSalary: Math.round(grossSalary),
    baseSalary: Math.round(baseSalary),
    allowances: Math.round(allowances),
    bonus: Math.round(bonus),
    overtimePay: overtimeCalculation.total,
    overtimeHours: overtimeCalculation.hours,
    overtimeBreakdown: overtimeCalculation.breakdown,
    thirteenthMonth: Math.round(thirteenthMonth),
    housingAllowance: Math.round(housingAllowance),
    transportAllowance: Math.round(transportAllowance),
    livingAllowance: Math.round(livingAllowance),
    foodAllowance: Math.round(foodAllowance),
    exemptAllowances: Math.round(exemptAllowances),
    incomeTax,
    socialContributions,
    totalDeductions: Math.round(totalDeductions),
    netSalary: Math.round(netSalary),
    taxableIncome: Math.round(taxableIncome),
    employerCharges,
    exemptAllowancesCap: Math.round(grossSalary * 0.25),
    exemptAllowancesTotal: Math.round(Math.min(exemptAllowances, grossSalary * 0.25))
  };
};

// Formatage des montants
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-GN', {
    style: 'currency',
    currency: 'GNF',
    minimumFractionDigits: 0
  }).format(amount);
};

// Détermination de la tranche fiscale
export const getTaxBracket = (taxableIncome) => {
  return TAX_BRACKETS.find(bracket => 
    taxableIncome >= bracket.minAmount && 
    (bracket.maxAmount === null || taxableIncome <= bracket.maxAmount)
  ) || TAX_BRACKETS[TAX_BRACKETS.length - 1];
};