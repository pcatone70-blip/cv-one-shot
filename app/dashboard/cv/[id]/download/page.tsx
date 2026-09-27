import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import TemplateRenderer from '@/components/cv/TemplateRenderer'
import type { CVData } from '@/lib/types'

export default async function DownloadCVPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: cv }, { data: profile }] = await Promise.all([
    supabase.from('cvs').select('*').eq('id', params.id).eq('user_id', user.id).maybeSingle(),
    supabase.from('profiles').select('plan').eq('id', user.id).maybeSingle(),
  ])

  if (!cv) notFound()

  const isPro = profile?.plan === 'pro' || profile?.plan === 'lifetime'

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Anteprima e Download</h1>
          <p className="text-gray-500 mt-1">{cv.title}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/cv/${cv.id}`} className="text-blue-600 hover:underline font-medium text-sm">
            ← Modifica
          </Link>
          <Link href="/dashboard" className="text-gray-500 hover:underline text-sm">
            Dashboard
          </Link>
        </div>
      </div>

      {!isPro && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-medium text-amber-800">Il PDF avrà un watermark</p>
              <p className="text-amber-600 text-sm">Passa a Pro per rimuoverlo e scaricare in HD</p>
            </div>
          </div>
          <Link href="/dashboard/upgrade" className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition shrink-0">
            Rimuovi watermark
          </Link>
        </div>
      )}

      <div className="bg-gray-100 p-8 rounded-3xl overflow-auto flex justify-center">
        <TemplateRenderer data={cv.data as CVData} isPro={isPro} />
      </div>
    </div>
  )
}
