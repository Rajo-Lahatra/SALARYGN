import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Mock credentials for authentication
  const mockCredentials = {
    admin: { email: 'admin@taxcalc.gn', password: 'Admin123!' },
    hr: { email: 'hr@taxcalc.gn', password: 'HR2024!' },
    accountant: { email: 'comptable@taxcalc.gn', password: 'Compta2024!' }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email) {
      newErrors.email = 'L\'adresse email est requise';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData?.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      // Check credentials
      const isValidCredentials = Object.values(mockCredentials)?.some(
        cred => cred?.email === formData?.email && cred?.password === formData?.password
      );

      if (isValidCredentials) {
        // Store user session
        localStorage.setItem('taxcalc_user', JSON.stringify({
          email: formData?.email,
          loginTime: new Date()?.toISOString()
        }));
        
        navigate('/dashboard');
      } else {
        setErrors({
          general: 'Email ou mot de passe incorrect. Veuillez utiliser les identifiants fournis.'
        });
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const handleForgotPassword = () => {
    alert('Fonctionnalité de récupération de mot de passe à venir. Contactez l\'administrateur système.');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card border border-border rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <Icon name="Calculator" size={32} className="text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-heading font-semibold text-foreground mb-2">
            Connexion
          </h1>
          <p className="text-muted-foreground font-body">
            Accédez à votre espace de calcul fiscal
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Error */}
          {errors?.general && (
            <div className="bg-error/10 border border-error/20 rounded-md p-3 flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-error flex-shrink-0" />
              <p className="text-sm text-error font-body">{errors?.general}</p>
            </div>
          )}

          {/* Email Field */}
          <Input
            label="Adresse Email"
            type="email"
            name="email"
            placeholder="votre.email@entreprise.gn"
            value={formData?.email}
            onChange={handleInputChange}
            error={errors?.email}
            required
            disabled={isLoading}
          />

          {/* Password Field */}
          <div className="relative">
            <Input
              label="Mot de Passe"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Entrez votre mot de passe"
              value={formData?.password}
              onChange={handleInputChange}
              error={errors?.password}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
              disabled={isLoading}
            >
              <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
            </button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="default"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
            iconName="LogIn"
            iconPosition="left"
          >
            {isLoading ? 'Connexion en cours...' : 'Se Connecter'}
          </Button>

          {/* Forgot Password */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-primary hover:text-primary/80 font-body transition-colors"
              disabled={isLoading}
            >
              Mot de passe oublié ?
            </button>
          </div>
        </form>

        {/* Demo Credentials Info */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="bg-muted/50 rounded-md p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Icon name="Info" size={16} className="text-primary" />
              <h3 className="text-sm font-heading font-medium text-foreground">
                Identifiants de démonstration
              </h3>
            </div>
            <div className="space-y-2 text-xs font-body text-muted-foreground">
              <div>
                <span className="font-medium">Administrateur:</span> admin@taxcalc.gn / Admin123!
              </div>
              <div>
                <span className="font-medium">RH:</span> hr@taxcalc.gn / HR2024!
              </div>
              <div>
                <span className="font-medium">Comptable:</span> comptable@taxcalc.gn / Compta2024!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;