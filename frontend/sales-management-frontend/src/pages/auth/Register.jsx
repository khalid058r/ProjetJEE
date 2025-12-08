// src/pages/auth/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Alert } from '../../components/ui/Alert';
import { User, Mail, Lock, UserPlus, ShoppingCart, Shield } from 'lucide-react';

export const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const roleOptions = [
    { value: 'ACHETEUR', label: '🛒 Acheteur' },
    { value: 'VENDEUR', label: '💼 Vendeur' },
    { value: 'ANALYSTE', label: '📊 Analyste' },
    { value: 'INVESTISSEUR', label: '💰 Investisseur' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Effacer les erreurs pour ce champ
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
    if (serverError) setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};

    // Validation du nom d'utilisateur
    if (!formData.username.trim()) {
      newErrors.username = 'Le nom d\'utilisateur est requis';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    // Validation du mot de passe
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    // Validation de la confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    // Validation du rôle
    if (!formData.role) {
      newErrors.role = 'Veuillez sélectionner un rôle';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    // Valider le formulaire
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userData = await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      setSuccess(true);

      // Si le compte est actif, connecter directement
      if (userData.active) {
        login(userData);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        // Sinon, rediriger vers la page de connexion après 3 secondes
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      console.error('Erreur d\'inscription:', err);
      setServerError(err.message || 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  // Si l'inscription a réussi, afficher un message de succès
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 via-emerald-600 to-teal-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <Shield className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Inscription réussie ! 🎉
          </h2>
          <p className="text-gray-600 mb-4">
            Votre compte a été créé avec succès.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
            ⚠️ Votre compte doit être activé par un administrateur avant de pouvoir vous connecter.
            Vous serez redirigé vers la page de connexion...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-600 to-red-500 flex items-center justify-center p-4">
      {/* Décoration d'arrière-plan */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-4">
            <ShoppingCart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Créer un compte
          </h1>
          <p className="text-gray-600">
            Rejoignez notre plateforme de gestion de ventes
          </p>
        </div>
        
        {/* Alerte d'erreur serveur */}
        {serverError && (
          <Alert 
            type="error" 
            message={serverError} 
            onClose={() => setServerError('')}
          />
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nom d'utilisateur"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="johndoe"
            icon={<User size={20} />}
            error={errors.username}
            required
            disabled={loading}
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="votre@email.com"
            icon={<Mail size={20} />}
            error={errors.email}
            required
            disabled={loading}
          />

          <Input
            label="Mot de passe"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            icon={<Lock size={20} />}
            error={errors.password}
            required
            disabled={loading}
          />

          <Input
            label="Confirmer le mot de passe"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            icon={<Lock size={20} />}
            error={errors.confirmPassword}
            required
            disabled={loading}
          />

          <Select
            label="Rôle"
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={roleOptions}
            error={errors.role}
            placeholder="Sélectionnez votre rôle"
            required
            disabled={loading}
          />

          {/* Description des rôles */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
            <p className="font-semibold mb-1">ℹ️ À propos des rôles :</p>
            <ul className="space-y-1 ml-4">
              <li><strong>Acheteur:</strong> Consulter les produits et passer des commandes</li>
              <li><strong>Vendeur:</strong> Gérer les ventes et les stocks</li>
              <li><strong>Analyste:</strong> Accéder aux statistiques et analyses</li>
              <li><strong>Investisseur:</strong> Consulter les performances financières</li>
            </ul>
          </div>

          <Button
            type="submit"
            fullWidth
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Création en cours...
              </>
            ) : (
              <>
                <UserPlus size={20} />
                Créer mon compte
              </>
            )}
          </Button>
        </form>

        {/* Lien vers connexion */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Vous avez déjà un compte ?{' '}
            <Link to="/login" className="text-purple-600 hover:underline font-semibold">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};