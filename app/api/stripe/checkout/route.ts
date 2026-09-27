import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    // Check auth
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

    // Check if Stripe is configured
    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey || stripeKey === 'sk_live_...') {
      return NextResponse.json({ 
        error: 'Pagamenti non ancora configurati. Aggiungi le chiavi Stripe nel file .env.local.' 
      }, { status: 503 })
    }

    const { plan } = await request.json()
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeKey)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Get or create customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .maybeSingle()

    let customerId = profile?.stripe_customer_id
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id
      await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id)
    }

    // Determine price
    const priceId = plan === 'lifetime' 
      ? process.env.STRIPE_PRICE_LIFETIME 
      : process.env.STRIPE_PRICE_PRO_MONTHLY

    if (!priceId) {
      return NextResponse.json({ 
        error: 'Prezzi Stripe non configurati. Crea i prodotti su stripe.com e aggiungi i price_id nel file .env.local.' 
      }, { status: 503 })
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: plan === 'lifetime' ? 'payment' : 'subscription',
      success_url: `${appUrl}/dashboard?success=${plan}`,
      cancel_url: `${appUrl}/dashboard/upgrade?canceled=true`,
      metadata: { supabase_user_id: user.id, plan },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: error.message || 'Errore Stripe' }, { status: 500 })
  }
}
