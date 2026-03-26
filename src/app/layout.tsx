import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Suspense } from 'react';
import { Navbar } from '@/components/Navbar';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Six Man — Bench Player Rankings',
  description:
    'Descubra os melhores jogadores que vêm do banco na NBA. Rankings, métricas de eficiência e o badge Spark Plug para quem incendeia o jogo.',
  keywords: ['NBA', 'bench players', 'basketball', 'sixth man', 'statistics'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} min-h-screen bg-[#0A0A0F] text-slate-100 antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Suspense>
              <Navbar />
            </Suspense>
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">{children}</main>
            <footer className="border-t border-slate-800/50 py-8 text-center text-xs text-slate-600">
              <p>Six Man · Dados via NBA Stats API · Não afiliado à NBA</p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
