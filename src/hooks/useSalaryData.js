// src/hooks/useSalaryData.js
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

export const useSalaryData = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [company, setCompany] = useState(null);
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Charger les données employés
  const loadEmployees = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Erreur chargement employés:', error.message);
    }
  };

  // Charger les données entreprise
  const loadCompany = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = aucun résultat
      setCompany(data || null);
    } catch (error) {
      console.error('Erreur chargement entreprise:', error.message);
    }
  };

  // Charger les calculs
  const loadCalculations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('salary_calculations')
        .select(`
          *,
          employees (full_name, employee_id)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCalculations(data || []);
    } catch (error) {
      console.error('Erreur chargement calculs:', error.message);
    }
  };

  // Charger toutes les données
  const loadUserData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await Promise.all([
        loadEmployees(),
        loadCompany(),
        loadCalculations()
      ]);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      // Réinitialiser les données si l'utilisateur se déconnecte
      setEmployees([]);
      setCompany(null);
      setCalculations([]);
    }
  }, [user]);

  // Sauvegarder un employé
  const saveEmployee = async (employeeData) => {
    if (!user) {
      return { success: false, error: 'Utilisateur non connecté' };
    }

    try {
      const employeeToSave = {
        user_id: user.id,
        full_name: employeeData.fullName,
        employee_id: employeeData.employeeId,
        position: employeeData.position,
        department: employeeData.department,
        employment_type: employeeData.employmentType,
        base_salary: employeeData.baseSalary ? parseFloat(employeeData.baseSalary) : null,
        updated_at: new Date().toISOString()
      };

      let data, error;

      if (employeeData.id) {
        // Mise à jour
        ({ data, error } = await supabase
          .from('employees')
          .update(employeeToSave)
          .eq('id', employeeData.id)
          .eq('user_id', user.id)
          .select()
          .single());
      } else {
        // Création
        employeeToSave.created_at = new Date().toISOString();
        ({ data, error } = await supabase
          .from('employees')
          .insert([employeeToSave])
          .select()
          .single());
      }

      if (error) throw error;

      // Mettre à jour le state local
      setEmployees(prev => {
        const filtered = prev.filter(emp => emp.id !== data.id);
        return [data, ...filtered];
      });

      return { success: true, employee: data };
    } catch (error) {
      console.error('Erreur sauvegarde employé:', error.message);
      return { success: false, error: error.message };
    }
  };

  // Sauvegarder l'entreprise
  const saveCompany = async (companyData) => {
    if (!user) {
      return { success: false, error: 'Utilisateur non connecté' };
    }

    try {
      const companyToSave = {
        user_id: user.id,
        company_name: companyData.companyName,
        address: companyData.address,
        city: companyData.city,
        phone: companyData.phone,
        email: companyData.email,
        rccm: companyData.rccm,
        nif: companyData.nif,
        cnss_number: companyData.cnssNumber,
        updated_at: new Date().toISOString()
      };

      // Vérifier si une entreprise existe déjà
      const { data: existing } = await supabase
        .from('companies')
        .select('id')
        .eq('user_id', user.id)
        .single();

      let data, error;

      if (existing) {
        // Mise à jour
        ({ data, error } = await supabase
          .from('companies')
          .update(companyToSave)
          .eq('user_id', user.id)
          .select()
          .single());
      } else {
        // Création
        companyToSave.created_at = new Date().toISOString();
        ({ data, error } = await supabase
          .from('companies')
          .insert([companyToSave])
          .select()
          .single());
      }

      if (error) throw error;
      setCompany(data);
      return { success: true, company: data };
    } catch (error) {
      console.error('Erreur sauvegarde entreprise:', error.message);
      return { success: false, error: error.message };
    }
  };

  // Sauvegarder un calcul
  const saveCalculation = async (calculationData) => {
    if (!user) {
      return { success: false, error: 'Utilisateur non connecté' };
    }

    try {
      const { data, error } = await supabase
        .from('salary_calculations')
        .insert([
          {
            user_id: user.id,
            title: calculationData.title,
            input_data: calculationData.input,
            result_data: calculationData.result,
            period: calculationData.period,
            employee_id: calculationData.employeeId || null
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Mettre à jour le state local
      setCalculations(prev => [data, ...prev]);

      return { success: true, calculation: data };
    } catch (error) {
      console.error('Erreur sauvegarde calcul:', error.message);
      return { success: false, error: error.message };
    }
  };

  return {
    employees,
    company,
    calculations,
    loading,
    saveEmployee,
    saveCompany,
    saveCalculation,
    refreshData: loadUserData
  };
};