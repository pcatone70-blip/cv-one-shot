import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CVForm from '@/components/cv/CVForm'

export default async function NewCVPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">✨ Nuovo CV</h1>
        <p className="text-gray-500 mt-1">Compila i campi e lascia che l&apos;AI faccia il resto</p>
      </div>
      <CVForm userId={user.id} plan="free" />
    </div>
  )
}
