import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'ReservaHoras - Sistema de Reservas Profesional',
  description: 'Plataforma moderna para gestionar reservas de horas de manera eficiente. Ideal para profesionales independientes y pequeños negocios.',
  keywords: 'reservas, citas, agenda, profesional, peluquería, estética, bienestar',
  authors: [{ name: 'ReservaHoras Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'ReservaHoras - Sistema de Reservas Profesional',
    description: 'Gestiona tus reservas de manera profesional y eficiente',
    type: 'website',
    locale: 'es_ES',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}