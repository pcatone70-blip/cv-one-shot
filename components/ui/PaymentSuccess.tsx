'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'

export function PaymentSuccess() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    const successPlan = searchParams.get('success')

    if (successPlan && !triggered) {
      setTriggered(true)
      
      // Spara i coriandoli!
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }))
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }))
      }, 250)

      toast.success(`🎉 Pagamento completato! Sei ufficialmente utente ${successPlan.toUpperCase()}`, { duration: 5000 })
      
      // Pulisce l'URL per non rifarlo
      router.replace('/dashboard')
    }
  }, [searchParams, router, triggered])

  return null
}
