import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CV One Shot — Crea il tuo CV con AI in 5 minuti',
  description: "Crea curriculum vitae professionali in italiano e inglese con l'aiuto dell'intelligenza artificiale. Gratis, veloce, professionale.",
  keywords: ['curriculum vitae', 'cv', 'ai', 'intelligenza artificiale', 'lavoro', 'resume'],
  openGraph: {
    title: 'CV One Shot — AI per il tuo CV',
    description: 'Crea il tuo CV professionale in 5 minuti con AI',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body className={inter.className}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
