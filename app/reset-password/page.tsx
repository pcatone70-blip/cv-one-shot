'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
      })

      if (error) {
        toast.error(error.message)
        setLoading(false)
        return
      }

      setSent(true)
      toast.success('Email inviata con successo!')
    } catch {
      toast.error('Errore di connessione. Riprova.')
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">📧</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Controlla la posta</h1>
          <p className="text-gray-500 mb-6">Abbiamo inviato un link per reimpostare la password a <strong>{email}</strong></p>
          <Link href="/login" className="text-blue-600 font-medium hover:underline">
            Torna al login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/login" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-medium transition">
          <ArrowLeft className="w-4 h-4" /> Indietro
        </Link>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Recupera Password</h1>
          <p className="text-gray-500 mb-8">Inserisci la tua email e ti invieremo le istruzioni.</p>

          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="tu@email.com" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50">
              {loading ? 'Invio in corso...' : 'Invia link di recupero'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
