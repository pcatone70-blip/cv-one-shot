'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 6) {
      toast.error('La password deve avere almeno 6 caratteri')
      return
    }
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        toast.error('Errore. Il link potrebbe essere scaduto.')
        setLoading(false)
        return
      }

      toast.success('Password aggiornata con successo! Bentornato.')
      router.push('/dashboard')
      router.refresh()
    } catch {
      toast.error('Errore di connessione. Riprova.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Nuova Password</h1>
        <p className="text-gray-500 mb-8">Inserisci la tua nuova password sicura.</p>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nuova Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Min. 6 caratteri" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition disabled:opacity-50 shadow-lg shadow-green-200">
            {loading ? 'Aggiornamento...' : 'Salva nuova password'}
          </button>
        </form>
      </div>
    </div>
  )
}
