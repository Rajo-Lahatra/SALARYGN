// services/supabaseService.js
import { supabase } from '../supabaseClient';

class SupabaseService {
  // ===== GESTION DES EMPLOYÉS =====
  
  async saveEmployee(employeeData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const employeeToSave = {
        user_id: user.id,
        full_name: employeeData.fullName,
        employee_id: employeeData.employeeId,
        position: employeeData.position,
        department: employeeData.department,
        employment_type: employeeData.employmentType,
        base_salary: employeeData.baseSalary ? parseFloat(employeeData.baseSalary) : null,
        created_at: new Date().toISOString(),
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
        ({ data, error } = await supabase
          .from('employees')
          .insert([employeeToSave])
          .select()
          .single());
      }

      if (error) throw error;
      return { success: true, employee: data };
    } catch (error) {
      console.error('Erreur sauvegarde employé:', error);
      return { success: false, error: error.message };
    }
  }

  async getEmployees() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, employees: data || [] };
    } catch (error) {
      console.error('Erreur récupération employés:', error);
      return { success: false, error: error.message, employees: [] };
    }
  }

  async deleteEmployee(employeeId) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employeeId)
        .eq('user_id', user.id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ===== GESTION DES ENTREPRISES =====

  async saveCompany(companyData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

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
      return { success: true, company: data };
    } catch (error) {
      console.error('Erreur sauvegarde entreprise:', error);
      return { success: false, error: error.message };
    }
  }

  async getCompany() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return { success: true, company: data };
    } catch (error) {
      console.error('Erreur récupération entreprise:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== GESTION DES CALCULS =====

  async saveCalculation(calculationData, employeeId = null) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const { data, error } = await supabase
        .from('salary_calculations')
        .insert([
          {
            user_id: user.id,
            employee_id: employeeId,
            title: calculationData.title || `Calcul ${new Date().toLocaleDateString('fr-FR')}`,
            input_data: calculationData.input,
            result_data: calculationData.result,
            period: calculationData.period || new Date().toISOString().slice(0, 7)
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return { success: true, calculation: data };
    } catch (error) {
      console.error('Erreur sauvegarde calcul:', error);
      return { success: false, error: error.message };
    }
  }

  async getCalculations(employeeId = null) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      let query = supabase
        .from('salary_calculations')
        .select(`
          *,
          employees (full_name, employee_id)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (employeeId) {
        query = query.eq('employee_id', employeeId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { success: true, calculations: data || [] };
    } catch (error) {
      console.error('Erreur récupération calculs:', error);
      return { success: false, error: error.message, calculations: [] };
    }
  }

  async deleteCalculation(calculationId) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const { error } = await supabase
        .from('salary_calculations')
        .delete()
        .eq('id', calculationId)
        .eq('user_id', user.id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ===== EXPORT DES DONNÉES =====

  async exportUserData() {
    try {
      const [employeesRes, calculationsRes, companyRes] = await Promise.all([
        this.getEmployees(),
        this.getCalculations(),
        this.getCompany()
      ]);

      return {
        success: true,
        data: {
          employees: employeesRes.employees || [],
          calculations: calculationsRes.calculations || [],
          company: companyRes.company || null,
          exportDate: new Date().toISOString(),
          version: '1.0'
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export const supabaseService = new SupabaseService();