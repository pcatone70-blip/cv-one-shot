import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import CVForm from '@/components/cv/CVForm'
import type { CVData } from '@/lib/types'

export default async function EditCVPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: cv } = await supabase
    .from('cvs')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!cv) notFound()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">✏️ Modifica CV</h1>
        <p className="text-gray-500 mt-1">{cv.title}</p>
      </div>
      <CVForm
        existingCV={{ id: cv.id, title: cv.title, data: cv.data as CVData }}
        userId={user.id}
        plan="free"
      />
    </div>
  )
}
