'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Menu, X, Sun, Moon, User, LogOut } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Usuario } from '../types';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [usuario] = useLocalStorage<Usuario | null>('usuario_actual', null);

  const handleLogout = () => {
    localStorage.removeItem('usuario_actual');
    window.location.href = '/';
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-primary-500 rounded-lg group-hover:bg-primary-600 transition-colors">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              ReservaHoras
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/reservas" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium"
            >
              Reservar
            </Link>
            
            {usuario && (
              <Link 
                href="/perfil" 
                className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium"
              >
                Mi Perfil
              </Link>
            )}
            
            {usuario?.esAdmin && (
              <Link 
                href="/admin" 
                className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium"
              >
                Administración
              </Link>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Cambiar tema"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>

            {/* User Menu */}
            {usuario ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {usuario.nombre}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="h-5 w-5 text-red-600 dark:text-red-400" />
                </button>
              </div>
            ) : (
              <Link 
                href="/auth" 
                className="btn-primary"
              >
                Iniciar Sesión
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/reservas" 
                className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Reservar
              </Link>
              
              {usuario && (
                <Link 
                  href="/perfil" 
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mi Perfil
                </Link>
              )}
              
              {usuario?.esAdmin && (
                <Link 
                  href="/admin" 
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Administración
                </Link>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={toggleTheme}
                  className="flex items-center space-x-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {theme === 'light' ? (
                    <>
                      <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Modo Oscuro</span>
                    </>
                  ) : (
                    <>
                      <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Modo Claro</span>
                    </>
                  )}
                </button>

                {usuario ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 p-2 rounded-lg bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                  >
                    <LogOut className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <span className="text-sm text-red-600 dark:text-red-400">Cerrar Sesión</span>
                  </button>
                ) : (
                  <Link 
                    href="/auth" 
                    className="btn-primary text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}