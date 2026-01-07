/**
 * Login - Pantalla de acceso administrativo
 * Diseño profesional con gradientes
 */

import React, { useState } from 'react';
import { Lock, ArrowLeft, Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import DevBadge from './DevBadge';

interface LoginProps {
  onLogin: () => void;
  onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onBack }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simular proceso de autenticación
    await new Promise(resolve => setTimeout(resolve, 800));

    if (password === 'admin123' || password === 'admin' || password === 'terraviva2024') {
      onLogin();
    } else {
      setError('Contraseña incorrecta. Intente nuevamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 relative overflow-hidden">
      <DevBadge name="Login" description="Acceso administrativo" />

      {/* Fondo sólido */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

      {/* Decoración de fondo */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Tarjeta de login */}
        <div className="bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-700 shadow-2xl">

          {/* Logo/Icono */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Shield size={40} className="text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-4 border-slate-900">
                <Lock size={12} className="text-white" />
              </div>
            </div>
          </div>

          {/* Título */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Panel Administrativo</h2>
            <p className="text-slate-400 text-sm">Terra Viva Grupo Inmobiliario</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Contraseña de Acceso
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Ingrese su contraseña..."
                  autoFocus
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {/* Botón de ingreso */}
            <button
              type="submit"
              disabled={isLoading || !password}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${isLoading || !password
                  ? 'bg-slate-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/30 hover:shadow-xl'
                }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <Lock size={20} />
                  Ingresar al Panel
                </>
              )}
            </button>
          </form>

          {/* Volver al sitio */}
          <div className="mt-6 text-center">
            <button
              onClick={onBack}
              className="text-slate-400 hover:text-white text-sm flex items-center justify-center gap-2 mx-auto transition-colors"
            >
              <ArrowLeft size={16} />
              Volver al sitio web
            </button>
          </div>
        </div>

        {/* Info de demo */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            <span className="text-yellow-400 text-xs">Demo: admin</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;