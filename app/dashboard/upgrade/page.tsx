'use client'

import { useState } from 'react'
import { Check, Lock, Zap, Crown, Star, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function UpgradePage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'lifetime'>('monthly')

  const handleSubscribe = async (plan: 'pro' | 'lifetime') => {
    try {
      setLoading(plan)
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      
      if (data.error) {
        toast.error(data.error)
        setLoading(null)
        return
      }
      
      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error('Stripe non ancora configurato. Aggiungi le chiavi API.')
        setLoading(null)
      }
    } catch {
      toast.error('Errore di connessione. Riprova.')
      setLoading(null)
    }
  }

  const freeFeatures = [
    { text: '1 CV', included: true },
    { text: '2 template (Modern, Classic)', included: true },
    { text: 'Ottimizzazione AI base', included: true },
    { text: 'PDF con watermark', included: true },
    { text: 'Foto profilo', included: false },
    { text: 'Lettera di presentazione AI', included: false },
    { text: 'Template premium', included: false },
    { text: 'PDF HD senza watermark', included: false },
  ]

  const proFeatures = [
    { text: 'CV illimitati', included: true },
    { text: 'Tutti e 5 i template', included: true },
    { text: 'AI avanzata (GPT-level)', included: true },
    { text: 'PDF HD senza watermark', included: true },
    { text: 'Foto profilo sul CV', included: true },
    { text: 'Lettera di presentazione AI', included: true },
    { text: 'Template Executive & Creative', included: true },
    { text: 'Supporto prioritario', included: true },
  ]

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Crown className="w-4 h-4" /> Passa a Pro
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Sblocca il tuo <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">potenziale completo</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Crea CV illimitati, usa tutti i template premium e rimuovi il watermark. Investi nella tua carriera.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Free Plan */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 relative">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Free</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-extrabold text-gray-900">€0</span>
              <span className="text-gray-500">/per sempre</span>
            </div>
            <p className="text-gray-500 mt-2 text-sm">Perfetto per iniziare.</p>
          </div>

          <ul className="space-y-3 mb-8">
            {freeFeatures.map((f) => (
              <li key={f.text} className="flex items-center gap-3">
                {f.included ? (
                  <Check className="w-5 h-5 text-green-500 shrink-0" />
                ) : (
                  <Lock className="w-5 h-5 text-gray-300 shrink-0" />
                )}
                <span className={f.included ? 'text-gray-700' : 'text-gray-400'}>{f.text}</span>
              </li>
            ))}
          </ul>

          <Link href="/dashboard"
            className="block text-center border-2 border-gray-200 text-gray-600 py-3.5 rounded-2xl font-semibold hover:bg-gray-50 transition">
            Piano attuale
          </Link>
        </div>

        {/* Pro Plan */}
        <div className="bg-gradient-to-b from-blue-600 via-blue-700 to-purple-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
          {/* Glow effect */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl" />
          
          <div className="relative">
            <div className="flex items-center gap-2 mb-6">
              <h3 className="text-lg font-bold">Pro</h3>
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                ⚡ CONSIGLIATO
              </span>
            </div>

            {/* Price toggle */}
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`text-sm font-medium px-3 py-1 rounded-full transition ${billingCycle === 'monthly' ? 'bg-white/20' : 'opacity-60 hover:opacity-100'}`}>
                Mensile
              </button>
              <button
                onClick={() => setBillingCycle('lifetime')}
                className={`text-sm font-medium px-3 py-1 rounded-full transition flex items-center gap-1 ${billingCycle === 'lifetime' ? 'bg-white/20' : 'opacity-60 hover:opacity-100'}`}>
                Lifetime <span className="text-xs bg-amber-400 text-amber-900 px-1.5 py-0.5 rounded-full font-bold">-58%</span>
              </button>
            </div>

            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-5xl font-extrabold">{billingCycle === 'monthly' ? '€9' : '€49'}</span>
              <span className="text-blue-200">{billingCycle === 'monthly' ? '/mese' : ' una tantum'}</span>
            </div>
            {billingCycle === 'lifetime' && (
              <p className="text-blue-200 text-sm mb-4">Paga una volta, usalo per sempre ✨</p>
            )}
            {billingCycle === 'monthly' && (
              <p className="text-blue-200 text-sm mb-4">Annulla quando vuoi, senza vincoli</p>
            )}

            <ul className="space-y-3 mb-8">
              {proFeatures.map((f) => (
                <li key={f.text} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-white/90">{f.text}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(billingCycle === 'monthly' ? 'pro' : 'lifetime')}
              disabled={loading !== null}
              className="w-full bg-white text-blue-700 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg">
              {loading ? (
                'Caricamento...'
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  {billingCycle === 'monthly' ? 'Abbonati a Pro' : 'Ottieni Lifetime'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Domande frequenti</h2>
        <div className="space-y-4">
          {[
            { q: 'Posso annullare quando voglio?', a: 'Sì! L\'abbonamento mensile si può annullare in qualsiasi momento con un clic. Nessun vincolo.' },
            { q: 'Cos\'è il watermark?', a: 'I CV del piano Free hanno una piccola scritta "Made with CV One Shot" sul PDF. Il piano Pro la rimuove completamente.' },
            { q: 'Conviene il piano Lifetime?', a: 'Se pensi di usare CV One Shot per più di 6 mesi, il Lifetime si ripaga da solo. Paghi una volta e lo usi per sempre, inclusi tutti gli aggiornamenti futuri.' },
            { q: 'Posso cambiare template dopo?', a: 'Certo! Puoi cambiare template e riscaricare il PDF quante volte vuoi.' },
          ].map(({ q, a }) => (
            <details key={q} className="bg-white rounded-2xl border border-gray-200 p-5 group cursor-pointer">
              <summary className="font-semibold text-gray-900 flex items-center justify-between list-none">
                {q}
                <span className="text-gray-400 group-open:rotate-45 transition-transform text-xl">+</span>
              </summary>
              <p className="text-gray-600 mt-3 text-sm leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}
