'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Usuario } from '../types';
import { generarId } from '../lib/utils';

const esquemaLogin = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const esquemaRegistro = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefono: z.string().min(8, 'Teléfono inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type LoginData = z.infer<typeof esquemaLogin>;
type RegistroData = z.infer<typeof esquemaRegistro>;

export default function AuthPage() {
  const [esLogin, setEsLogin] = useState(true);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [usuarios, setUsuarios] = useLocalStorage<Usuario[]>('usuarios', []);
  const [, setUsuarioActual] = useLocalStorage<Usuario | null>('usuario_actual', null);

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: errorsLogin }
  } = useForm<LoginData>({
    resolver: zodResolver(esquemaLogin)
  });

  const {
    register: registerRegistro,
    handleSubmit: handleSubmitRegistro,
    formState: { errors: errorsRegistro }
  } = useForm<RegistroData>({
    resolver: zodResolver(esquemaRegistro)
  });

  const onLogin = (data: LoginData) => {
    // Verificar credenciales de admin
    if (data.email === 'admin@reservas.com' && data.password === 'admin123') {
      const adminUser: Usuario = {
        id: 'admin',
        nombre: 'Administrador',
        email: 'admin@reservas.com',
        telefono: '+56912345678',
        esAdmin: true,
        fechaRegistro: new Date()
      };
      setUsuarioActual(adminUser);
      toast.success('¡Bienvenido Administrador!');
      window.location.href = '/admin';
      return;
    }

    // Verificar usuario regular
    const usuario = usuarios.find(u => u.email === data.email);
    if (usuario) {
      setUsuarioActual(usuario);
      toast.success(`¡Bienvenido ${usuario.nombre}!`);
      window.location.href = '/perfil';
    } else {
      toast.error('Credenciales inválidas');
    }
  };

  const onRegistro = (data: RegistroData) => {
    // Verificar si el email ya existe
    if (usuarios.some(u => u.email === data.email)) {
      toast.error('Este email ya está registrado');
      return;
    }

    const nuevoUsuario: Usuario = {
      id: generarId(),
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono,
      esAdmin: false,
      fechaRegistro: new Date()
    };

    setUsuarios(prev => [...prev, nuevoUsuario]);
    setUsuarioActual(nuevoUsuario);
    toast.success('¡Cuenta creada exitosamente!');
    window.location.href = '/perfil';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="card"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {esLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {esLogin 
                ? 'Accede a tu cuenta para gestionar tus reservas' 
                : 'Únete para comenzar a reservar tus citas'
              }
            </p>
          </div>

          {/* Tabs */}
          <div className="flex mb-8 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setEsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                esLogin
                  ? 'bg-white dark:bg-gray-800 text-primary-500 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => setEsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                !esLogin
                  ? 'bg-white dark:bg-gray-800 text-primary-500 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Registrarse
            </button>
          </div>

          {/* Login Form */}
          {esLogin ? (
            <form onSubmit={handleSubmitLogin(onLogin)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email
                </label>
                <input
                  {...registerLogin('email')}
                  type="email"
                  className="input-field"
                  placeholder="tu@email.com"
                />
                {errorsLogin.email && (
                  <p className="mt-1 text-sm text-red-600">{errorsLogin.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Lock className="inline h-4 w-4 mr-1" />
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    {...registerLogin('password')}
                    type={mostrarPassword ? 'text' : 'password'}
                    className="input-field pr-10"
                    placeholder="Tu contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarPassword(!mostrarPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {mostrarPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errorsLogin.password && (
                  <p className="mt-1 text-sm text-red-600">{errorsLogin.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full btn-primary"
              >
                Iniciar Sesión
              </button>

              {/* Demo credentials */}
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-2">
                  Credenciales de prueba:
                </p>
                <div className="text-xs text-blue-600 dark:text-blue-300 space-y-1">
                  <div>Admin: admin@reservas.com / admin123</div>
                  <div>Usuario: Crea una cuenta nueva</div>
                </div>
              </div>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleSubmitRegistro(onRegistro)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <User className="inline h-4 w-4 mr-1" />
                  Nombre Completo
                </label>
                <input
                  {...registerRegistro('nombre')}
                  type="text"
                  className="input-field"
                  placeholder="Tu nombre completo"
                />
                {errorsRegistro.nombre && (
                  <p className="mt-1 text-sm text-red-600">{errorsRegistro.nombre.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email
                </label>
                <input
                  {...registerRegistro('email')}
                  type="email"
                  className="input-field"
                  placeholder="tu@email.com"
                />
                {errorsRegistro.email && (
                  <p className="mt-1 text-sm text-red-600">{errorsRegistro.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Teléfono
                </label>
                <input
                  {...registerRegistro('telefono')}
                  type="tel"
                  className="input-field"
                  placeholder="+56 9 1234 5678"
                />
                {errorsRegistro.telefono && (
                  <p className="mt-1 text-sm text-red-600">{errorsRegistro.telefono.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Lock className="inline h-4 w-4 mr-1" />
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    {...registerRegistro('password')}
                    type={mostrarPassword ? 'text' : 'password'}
                    className="input-field pr-10"
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarPassword(!mostrarPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {mostrarPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errorsRegistro.password && (
                  <p className="mt-1 text-sm text-red-600">{errorsRegistro.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Lock className="inline h-4 w-4 mr-1" />
                  Confirmar Contraseña
                </label>
                <input
                  {...registerRegistro('confirmPassword')}
                  type={mostrarPassword ? 'text' : 'password'}
                  className="input-field"
                  placeholder="Repite tu contraseña"
                />
                {errorsRegistro.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errorsRegistro.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full btn-primary"
              >
                Crear Cuenta
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {esLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
              <button
                onClick={() => setEsLogin(!esLogin)}
                className="ml-1 text-primary-500 hover:text-primary-600 font-medium"
              >
                {esLogin ? 'Regístrate aquí' : 'Inicia sesión'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}