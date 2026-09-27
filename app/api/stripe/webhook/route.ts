import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Necessario perché il webhook invia raw bytes che Stripe verifica
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text()
    const sig = req.headers.get('stripe-signature')
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!sig || !webhookSecret) {
      return NextResponse.json({ error: 'Webhook secret missing or no signature' }, { status: 400 })
    }

    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

    let event
    try {
      event = stripe.webhooks.constructEvent(bodyText, sig, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: err.message }, { status: 400 })
    }

    // Usiamo la Service Role Key per bypassare la Row Level Security, dato che è un webhook server-to-server
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any
      const userId = session.metadata?.supabase_user_id
      const plan = session.metadata?.plan || 'pro' // fallback a 'pro'

      if (userId) {
        // Aggiorniamo il piano dell'utente nel database
        const { error } = await supabaseAdmin
          .from('profiles')
          .update({ plan })
          .eq('id', userId)

        if (error) {
          console.error('Error updating user plan:', error)
          return NextResponse.json({ error: 'Database error' }, { status: 500 })
        }
        
        console.log(`✅ Utente ${userId} aggiornato con successo al piano ${plan}`)
      }
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('Webhook handler failed:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
