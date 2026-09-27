import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Plus, User, Crown, Zap } from 'lucide-react'
import { Suspense } from 'react'
import { PaymentSuccess } from '@/components/ui/PaymentSuccess'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, plan')
    .eq('id', user.id)
    .maybeSingle()

  const plan = profile?.plan || 'free'
  const isPro = plan === 'pro' || plan === 'lifetime'

  const planConfig = {
    free: { label: 'Free', icon: User, color: 'bg-gray-100 text-gray-600', border: 'border-gray-200' },
    pro: { label: 'Pro', icon: Zap, color: 'bg-blue-100 text-blue-700', border: 'border-blue-200' },
    lifetime: { label: 'Lifetime ⚡', icon: Crown, color: 'bg-amber-100 text-amber-700', border: 'border-amber-200' },
  }[plan] || { label: 'Free', icon: User, color: 'bg-gray-100 text-gray-600', border: 'border-gray-200' }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-xl border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CV One Shot ⚡
          </Link>

          <div className="flex items-center gap-3">
            {!isPro && (
              <Link href="/dashboard/upgrade"
                className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-blue-200 transition-all">
                <Crown className="w-3.5 h-3.5" /> Passa a Pro
              </Link>
            )}

            <Link href="/dashboard/cv/new"
              className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Nuovo CV
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {(profile?.full_name || user.email || 'U')[0].toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium text-gray-900 leading-tight">
                  {profile?.full_name || user.email?.split('@')[0]}
                </div>
                <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${planConfig.color}`}>
                  {plan === 'pro' && <Zap className="w-3 h-3" />}
                  {plan === 'lifetime' && <Crown className="w-3 h-3" />}
                  {planConfig.label}
                </span>
              </div>
            </div>

            <form action="/auth/logout" method="post">
              <button type="submit" className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition" title="Esci">
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Suspense fallback={null}>
          <PaymentSuccess />
        </Suspense>
        {children}
      </main>
    </div>
  )
}
