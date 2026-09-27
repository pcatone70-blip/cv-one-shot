'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 6) {
      toast.error('La password deve avere almeno 6 caratteri')
      return
    }
    setLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { 
          data: { full_name: name },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`
        },
      })

      if (error) {
        toast.error(error.message)
        setLoading(false)
        return
      }

      if (!data.session) {
        toast.success('Account creato! Controlla la tua email per confermare.')
        router.push('/login')
        router.refresh()
      } else {
        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email: data.user.email,
            full_name: name,
            plan: 'free'
          })
        }
        toast.success('Account creato! Benvenuto 🎉')
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      toast.error('Errore di connessione. Riprova.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-blue-600">CV One Shot ⚡</Link>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Crea il tuo account</h1>
          <p className="text-gray-500 mb-8">Gratis, nessuna carta richiesta</p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mario Rossi" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="tu@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Min. 6 caratteri" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50">
              {loading ? 'Creazione account...' : 'Crea account gratis'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Hai già un account?{' '}
            <Link href="/login" className="text-blue-600 font-medium hover:underline">Accedi</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
