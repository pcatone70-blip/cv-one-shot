import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, FileText, Edit, Download, Crown, Lock, Sparkles, PenTool } from 'lucide-react'
import { DeleteCVButton } from '@/components/cv/DeleteCVButton'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: cvs }, { data: profile }] = await Promise.all([
    supabase.from('cvs').select('*').eq('user_id', user!.id).order('updated_at', { ascending: false }),
    supabase.from('profiles').select('plan').eq('id', user!.id).maybeSingle(),
  ])

  const plan = profile?.plan || 'free'
  const isPro = plan === 'pro' || plan === 'lifetime'
  const cvCount = cvs?.length || 0
  const canCreate = isPro || cvCount < 1

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">I tuoi CV</h1>
          <p className="text-gray-500 mt-1">
            {cvCount} CV creat{cvCount === 1 ? 'o' : 'i'}
            {!isPro && <span className="text-orange-500 font-medium"> · 1 max nel piano Free</span>}
          </p>
        </div>
        {canCreate ? (
          <Link href="/dashboard/cv/new"
            className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition flex items-center gap-2 shadow-lg">
            <Plus className="w-5 h-5" /> Nuovo CV
          </Link>
        ) : (
          <Link href="/dashboard/upgrade"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-blue-200 transition-all flex items-center gap-2">
            <Crown className="w-5 h-5" /> Sblocca CV illimitati
          </Link>
        )}
      </div>

      {/* Upgrade Banner for Free */}
      {!isPro && (
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white rounded-2xl p-6 mb-8 shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Passa a Pro e crea CV illimitati</h3>
                <p className="text-blue-100 text-sm mt-1">
                  5 template premium · Foto profilo · AI avanzata · PDF senza watermark
                </p>
              </div>
            </div>
            <Link href="/dashboard/upgrade"
              className="bg-white text-blue-700 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition shrink-0 shadow-lg">
              Scopri Pro →
            </Link>
          </div>
        </div>
      )}

      {/* CV Grid */}
      {cvCount === 0 ? (
        <div className="max-w-4xl mx-auto py-12">
           <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-2 duration-500">
             <h2 className="text-3xl font-bold text-gray-900 mb-4">Benvenuto in CV One Shot ⚡</h2>
             <p className="text-gray-500 text-lg max-w-xl mx-auto">
               Crea un curriculum a prova di recruiter in 3 semplici passaggi, guidato dalla nostra Intelligenza Artificiale.
             </p>
           </div>
           
           <div className="grid md:grid-cols-3 gap-8 relative mb-16">
              <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-blue-100 via-indigo-200 to-blue-100 z-0"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center group animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                 <div className="w-24 h-24 bg-white border-2 border-blue-50 shadow-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300 group-hover:shadow-blue-100 group-hover:shadow-lg">
                    <PenTool className="w-10 h-10 text-blue-500" />
                 </div>
                 <h3 className="font-semibold text-gray-900 mb-2">1. Compila i dati</h3>
                 <p className="text-sm text-gray-500">Inserisci le tue esperienze e l'istruzione. Concentrati sui fatti, alla forma pensiamo noi.</p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center group animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                 <div className="w-24 h-24 bg-white border-2 border-indigo-50 shadow-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300 group-hover:shadow-indigo-100 group-hover:shadow-lg">
                    <Sparkles className="w-10 h-10 text-indigo-500" />
                 </div>
                 <h3 className="font-semibold text-gray-900 mb-2">2. Usa il "Radar AI"</h3>
                 <p className="text-sm text-gray-500">Usa il bottone "Ottimizza" per scrivere i testi e il Radar per scoprire le Skill più richieste dal mercato.</p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center group animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                 <div className="w-24 h-24 bg-white border-2 border-emerald-50 shadow-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300 group-hover:shadow-emerald-100 group-hover:shadow-lg">
                    <Download className="w-10 h-10 text-emerald-500" />
                 </div>
                 <h3 className="font-semibold text-gray-900 mb-2">3. Scegli e Scarica</h3>
                 <p className="text-sm text-gray-500">Seleziona uno dei template premium. Il sistema impaginerà tutto alla perfezione nel PDF finale.</p>
              </div>
           </div>

           <div className="text-center animate-in fade-in slide-in-from-bottom-2 duration-500 delay-500">
             <Link href="/dashboard/cv/new"
               className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-medium hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
               <Plus className="w-5 h-5" /> Inizia il tuo primo CV
             </Link>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cvs!.map((cv) => (
            <div key={cv.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all group">
              {/* Thumbnail */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl h-48 mb-4 flex items-center justify-center border border-gray-100 relative overflow-hidden">
                <FileText className="w-12 h-12 text-gray-300 group-hover:scale-110 transition-transform" />
                {!isPro && (
                  <div className="absolute bottom-2 right-2 bg-gray-900/70 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full font-medium">
                    Watermark
                  </div>
                )}
              </div>

              {/* Info */}
              <h3 className="font-semibold text-gray-900 mb-1.5 truncate">{cv.title}</h3>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">
                  {cv.language === 'it' ? '🇮🇹 Italiano' : '🇬🇧 English'}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(cv.updated_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link href={`/dashboard/cv/${cv.id}`}
                  className="flex-1 text-center border border-gray-200 text-gray-700 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition flex items-center justify-center gap-1.5">
                  <Edit className="w-3.5 h-3.5" /> Modifica
                </Link>
                <Link href={`/dashboard/cv/${cv.id}/download`}
                  className="flex-1 text-center bg-gray-900 text-white px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition flex items-center justify-center gap-1.5">
                  <Download className="w-3.5 h-3.5" /> PDF
                </Link>
                <DeleteCVButton cvId={cv.id} />
              </div>
            </div>
          ))}

          {/* Add card */}
          {canCreate && (
            <Link href="/dashboard/cv/new"
              className="border-2 border-dashed border-gray-200 rounded-2xl p-6 hover:border-blue-400 hover:bg-blue-50/50 transition-all flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-blue-500 min-h-[280px]">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center group-hover:bg-blue-100 transition">
                <Plus className="w-7 h-7" />
              </div>
              <span className="font-medium">Nuovo CV</span>
            </Link>
          )}

          {/* Locked card for free */}
          {!isPro && !canCreate && (
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-gray-300 min-h-[280px] relative">
              <Lock className="w-10 h-10" />
              <span className="font-medium text-gray-400">Limite raggiunto</span>
              <Link href="/dashboard/upgrade" className="text-sm text-blue-600 font-medium hover:underline">
                Sblocca con Pro →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
