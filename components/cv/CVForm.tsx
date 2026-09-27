'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'
import { createClient } from '@/lib/supabase/client'
import type { CVData, Language, CVTemplate, SkillLevel, LanguageLevel } from '@/lib/types'
import { CareerRadar } from './CareerRadar'

// ─── Steps ──────────────────────────────────────────────────
const STEPS = ['personal', 'experience', 'education', 'skills', 'languages', 'template'] as const
type Step = typeof STEPS[number]

const STEP_LABELS: Record<Step, string> = {
  personal: '👤 Informazioni',
  experience: '💼 Esperienza',
  education: '🎓 Istruzione',
  skills: '⚡ Competenze',
  languages: '🌍 Lingue',
  template: '🎨 Template',
}

// ─── Initial Data ────────────────────────────────────────────
const initialData: CVData = {
  personalInfo: {
    firstName: '', lastName: '', email: '', phone: '',
    location: '', website: '', linkedin: '', github: '', summary: '', photoUrl: ''
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  template: 'modern' as CVTemplate,
  language: 'it',
  accentColor: '#2563EB',
}

const TEMPLATES: { id: CVTemplate; label: string; desc: string; isPro: boolean; gradient: string }[] = [
  { id: 'modern' as CVTemplate, label: 'Moderno', desc: 'Colorato e dinamico', isPro: false, gradient: 'bg-gradient-to-br from-blue-500 to-blue-700' },
  { id: 'classic' as CVTemplate, label: 'Classico', desc: 'Professionale e sobrio', isPro: false, gradient: 'bg-gradient-to-br from-gray-700 to-gray-900' },
  { id: 'minimal' as CVTemplate, label: 'Minimal', desc: 'Pulito ed essenziale', isPro: true, gradient: 'bg-gradient-to-br from-gray-100 to-gray-200' },
  { id: 'executive' as CVTemplate, label: 'Executive', desc: 'Per ruoli dirigenziali', isPro: true, gradient: 'bg-gradient-to-br from-indigo-700 to-indigo-900' },
  { id: 'creative' as CVTemplate, label: 'Creativo', desc: 'Design unico e audace', isPro: true, gradient: 'bg-gradient-to-br from-pink-500 to-orange-400' },
]

interface CVFormProps {
  existingCV?: { id: string; title: string; data: CVData }
  userId: string
  plan: string
}

export default function CVForm({ existingCV, userId, plan }: CVFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [cvTitle, setCvTitle] = useState(existingCV?.title || '')
  const [cvLang, setCvLang] = useState<Language>(existingCV?.data?.language || 'it')
  const [data, setData] = useState<CVData>(existingCV?.data || { ...initialData, language: 'it' })
  const [saving, setSaving] = useState(false)
  const [aiLoading, setAiLoading] = useState<string | null>(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  const isPro = plan === 'pro' || plan === 'lifetime'
  const step = STEPS[currentStep]

  // ── Photo Upload ───────────────────────────────────────────
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error("L'immagine è troppo grande. Massimo 2MB consentiti.")
      return
    }

    setUploadingPhoto(true)
    try {
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}-${uuidv4()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('cv-photos')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from('cv-photos')
        .getPublicUrl(fileName)

      setData(d => ({
        ...d,
        personalInfo: { ...d.personalInfo, photoUrl: publicUrlData.publicUrl }
      }))
      toast.success("Foto caricata con successo! 📸")
    } catch (error) {
      console.error(error)
      toast.error("Errore durante il caricamento della foto.")
    } finally {
      setUploadingPhoto(false)
    }
  }

  // ── AI Optimization ────────────────────────────────────────
  const optimizeWithAI = useCallback(async (type: 'summary' | 'experience', index?: number) => {
    setAiLoading(type + (index ?? ''))
    try {
      const body: Record<string, unknown> = { type, language: data.language }
      if (type === 'summary') body.text = data.personalInfo.summary
      if (type === 'experience' && index !== undefined) {
        body.text = data.experience[index].description
        body.position = data.experience[index].position
        body.company = data.experience[index].company
      }

      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const result = await res.json()

      if (result.text) {
        if (type === 'summary') {
          setData(d => ({ ...d, personalInfo: { ...d.personalInfo, summary: result.text } }))
        } else if (type === 'experience' && index !== undefined) {
          setData(d => {
            const exp = [...d.experience]
            exp[index] = { ...exp[index], description: result.text }
            return { ...d, experience: exp }
          })
        }
        toast.success('✨ Testo ottimizzato dall\'AI!')
      }
    } catch {
      toast.error('Errore AI. Riprova.')
    }
    setAiLoading(null)
  }, [data])

  // ── Save ───────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (!cvTitle.trim()) {
      toast.error('Inserisci un nome per il CV')
      return
    }
    setSaving(true)
    const supabase = createClient()
    const cvPayload = { user_id: userId, title: cvTitle, language: cvLang, data: { ...data, language: cvLang } }

    let error
    if (existingCV?.id) {
      ;({ error } = await supabase.from('cvs').update(cvPayload).eq('id', existingCV.id))
    } else {
      ;({ error } = await supabase.from('cvs').insert(cvPayload))
    }

    setSaving(false)
    if (error) {
      toast.error('Errore nel salvataggio. Riprova.')
      return
    }
    toast.success('CV salvato con successo! 🎉')
    router.push('/dashboard')
    router.refresh()
  }, [cvTitle, cvLang, data, existingCV, userId, router])

  const addExperience = () => setData(d => ({
    ...d, experience: [...d.experience, {
      id: uuidv4(), company: '', position: '', location: '',
      startDate: '', endDate: '', current: false, description: '',
    }]
  }))
  const removeExperience = (id: string) => setData(d => ({ ...d, experience: d.experience.filter(e => e.id !== id) }))

  const addEducation = () => setData(d => ({
    ...d, education: [...d.education, {
      id: uuidv4(), institution: '', degree: '', field: '',
      startDate: '', endDate: '', grade: '', description: '',
    }]
  }))
  const removeEducation = (id: string) => setData(d => ({ ...d, education: d.education.filter(e => e.id !== id) }))

  const addSkill = () => setData(d => ({ ...d, skills: [...d.skills, { id: uuidv4(), name: '', level: 'intermedio' as SkillLevel }] }))
  const removeSkill = (id: string) => setData(d => ({ ...d, skills: d.skills.filter(s => s.id !== id) }))

  const addLanguage = () => setData(d => ({ ...d, languages: [...d.languages, { id: uuidv4(), name: '', level: 'B2' as LanguageLevel }] }))
  const removeLanguage = (id: string) => setData(d => ({ ...d, languages: d.languages.filter(l => l.id !== id) }))

  return (
    <div className="max-w-5xl mx-auto pb-12 transition-all duration-300">
      {/* ── CV Meta ─────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 flex flex-col sm:flex-row gap-4 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nome del CV</label>
          <input
            value={cvTitle}
            onChange={e => setCvTitle(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            placeholder="Es. CV Marketing Manager 2024"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Lingua CV</label>
          <select
            value={cvLang}
            onChange={e => setCvLang(e.target.value as Language)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all duration-300"
          >
            <option value="it">🇮🇹 Italiano</option>
            <option value="en">🇬🇧 English</option>
          </select>
        </div>
      </div>

      {/* ── Career Radar ─────────────────────────────────── */}
      <CareerRadar jobTitle={cvTitle || 'Il tuo ruolo'} />

      {/* ── Step Navigation ──────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 mb-6 overflow-x-auto shadow-sm">
        <div className="flex min-w-max">
          {STEPS.map((s, i) => (
            <button
              key={s}
              onClick={() => setCurrentStep(i)}
              className={`flex-1 min-w-[120px] px-4 py-4 text-sm font-semibold border-b-[3px] transition-all duration-300 ${
                i === currentStep
                  ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                  : i < currentStep
                  ? 'border-green-500 text-green-600 bg-green-50/20'
                  : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
            >
              {STEP_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Step Content ─────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 mb-6 shadow-sm">

        {/* STEP 1: Personal Info */}
        {step === 'personal' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">👤 Informazioni personali</h2>
            
            {/* ── Photo Upload ── */}
            <div className="mb-10 flex justify-center">
              <div className="relative w-[150px] h-[150px] group rounded-full">
                {data.personalInfo.photoUrl ? (
                  <img src={data.personalInfo.photoUrl} alt="Profilo" className="w-full h-full object-cover rounded-full shadow-md border-4 border-white transition-all duration-300 group-hover:brightness-75" />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-50 flex items-center justify-center shadow-inner border-4 border-white">
                    <span className="text-5xl text-gray-300">👤</span>
                  </div>
                )}
                
                {!isPro ? (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center transition-all opacity-100 backdrop-blur-[2px]">
                    <span className="text-3xl mb-2">🔒</span>
                    <span className="text-white text-xs font-bold px-3 py-1.5 bg-black/60 rounded-full shadow-sm">Solo Pro</span>
                  </div>
                ) : (
                  <label className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300">
                    {uploadingPhoto ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <svg className="w-8 h-8 text-white mb-1.5 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-white text-xs font-semibold drop-shadow-md">Carica foto</span>
                      </>
                    )}
                    <input type="file" accept="image/jpeg, image/png, image/webp" className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
                  </label>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Nome" value={data.personalInfo.firstName}
                onChange={v => setData(d => ({ ...d, personalInfo: { ...d.personalInfo, firstName: v } }))}
                placeholder="Mario" />
              <Field label="Cognome" value={data.personalInfo.lastName}
                onChange={v => setData(d => ({ ...d, personalInfo: { ...d.personalInfo, lastName: v } }))}
                placeholder="Rossi" />
              <Field label="Email" value={data.personalInfo.email} type="email"
                onChange={v => setData(d => ({ ...d, personalInfo: { ...d.personalInfo, email: v } }))}
                placeholder="mario@email.com" />
              <Field label="Telefono" value={data.personalInfo.phone}
                onChange={v => setData(d => ({ ...d, personalInfo: { ...d.personalInfo, phone: v } }))}
                placeholder="+39 333 123 4567" />
              <Field label="Città, Paese" value={data.personalInfo.location}
                onChange={v => setData(d => ({ ...d, personalInfo: { ...d.personalInfo, location: v } }))}
                placeholder="Milano, Italia" />
              <Field label="Sito web (opzionale)" value={data.personalInfo.website || ''}
                onChange={v => setData(d => ({ ...d, personalInfo: { ...d.personalInfo, website: v } }))}
                placeholder="https://tuosito.com" />
              <Field label="LinkedIn (opzionale)" value={data.personalInfo.linkedin || ''}
                onChange={v => setData(d => ({ ...d, personalInfo: { ...d.personalInfo, linkedin: v } }))}
                placeholder="linkedin.com/in/mario-rossi" />
              <Field label="GitHub (opzionale)" value={data.personalInfo.github || ''}
                onChange={v => setData(d => ({ ...d, personalInfo: { ...d.personalInfo, github: v } }))}
                placeholder="github.com/mario-rossi" />
            </div>
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Profilo professionale</label>
              <textarea
                value={data.personalInfo.summary}
                onChange={e => setData(d => ({ ...d, personalInfo: { ...d.personalInfo, summary: e.target.value } }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all duration-300"
                rows={4}
                placeholder="Descrivi brevemente chi sei e cosa stai cercando. L'AI migliorerà questo testo."
              />
              <button
                onClick={() => optimizeWithAI('summary')}
                disabled={!data.personalInfo.summary || aiLoading === 'summary'}
                className="mt-3 text-sm bg-purple-50 text-purple-700 border border-purple-200 px-5 py-2.5 rounded-xl hover:bg-purple-100 transition-all font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {aiLoading === 'summary' ? '⏳ Ottimizzazione...' : (isPro ? '✨ Pro: AI Avanzata' : '✨ Ottimizza con AI')}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Experience */}
        {step === 'experience' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">💼 Esperienze lavorative</h2>
            {data.experience.length === 0 && (
              <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <div className="text-5xl mb-4 opacity-50">💼</div>
                <p className="font-medium text-gray-500">Nessuna esperienza aggiunta</p>
              </div>
            )}
            <div className="space-y-6">
              {data.experience.map((exp, i) => (
                <div key={exp.id} className="border border-gray-200 rounded-2xl p-6 relative bg-white shadow-sm hover:shadow-md transition-shadow">
                  <button onClick={() => removeExperience(exp.id)} className="absolute top-5 right-5 text-red-400 hover:text-red-600 text-sm font-semibold transition-colors bg-red-50 px-3 py-1.5 rounded-lg">✕ Rimuovi</button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
                    <Field label="Azienda" value={exp.company}
                      onChange={v => setData(d => { const e = [...d.experience]; e[i] = { ...e[i], company: v }; return { ...d, experience: e } })}
                      placeholder="Google" />
                    <Field label="Ruolo" value={exp.position}
                      onChange={v => setData(d => { const e = [...d.experience]; e[i] = { ...e[i], position: v }; return { ...d, experience: e } })}
                      placeholder="Software Engineer" />
                    <Field label="Data inizio" value={exp.startDate} type="month"
                      onChange={v => setData(d => { const e = [...d.experience]; e[i] = { ...e[i], startDate: v }; return { ...d, experience: e } })} />
                    <div>
                      <Field label="Data fine" value={exp.endDate} type="month"
                        onChange={v => setData(d => { const e = [...d.experience]; e[i] = { ...e[i], endDate: v }; return { ...d, experience: e } })}
                        disabled={exp.current} />
                      <label className="flex items-center gap-2 mt-3 text-sm text-gray-700 cursor-pointer font-medium">
                        <input type="checkbox" checked={exp.current}
                          onChange={ev => setData(d => { const e = [...d.experience]; e[i] = { ...e[i], current: ev.target.checked, endDate: ev.target.checked ? '' : e[i].endDate }; return { ...d, experience: e } })}
                          className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4" />
                        Lavoro attuale
                      </label>
                    </div>
                  </div>
                  <div className="mt-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Descrizione</label>
                    <textarea
                      value={exp.description}
                      onChange={ev => setData(d => { const e = [...d.experience]; e[i] = { ...e[i], description: ev.target.value }; return { ...d, experience: e } })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
                      rows={3}
                      placeholder="Descrivi le tue responsabilità. L'AI ottimizzerà il testo con bullet points professionali."
                    />
                    <button
                      onClick={() => optimizeWithAI('experience', i)}
                      disabled={!exp.description || aiLoading === `experience${i}`}
                      className="mt-3 text-sm bg-purple-50 text-purple-700 border border-purple-200 px-5 py-2.5 rounded-xl hover:bg-purple-100 transition-all font-semibold shadow-sm disabled:opacity-50 flex items-center gap-2"
                    >
                      {aiLoading === `experience${i}` ? '⏳ Ottimizzazione...' : (isPro ? '✨ Pro: AI Avanzata' : '✨ Ottimizza con AI')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={addExperience}
              className="mt-6 w-full border-2 border-dashed border-gray-200 bg-gray-50 text-gray-600 py-4 rounded-2xl hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all font-bold"
            >
              + Aggiungi esperienza
            </button>
          </div>
        )}

        {/* STEP 3: Education */}
        {step === 'education' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">🎓 Istruzione</h2>
            {data.education.length === 0 && (
              <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <div className="text-5xl mb-4 opacity-50">🎓</div>
                <p className="font-medium text-gray-500">Nessuna istruzione aggiunta</p>
              </div>
            )}
            <div className="space-y-6">
              {data.education.map((edu, i) => (
                <div key={edu.id} className="border border-gray-200 rounded-2xl p-6 relative bg-white shadow-sm hover:shadow-md transition-shadow">
                  <button onClick={() => removeEducation(edu.id)} className="absolute top-5 right-5 text-red-400 hover:text-red-600 text-sm font-semibold transition-colors bg-red-50 px-3 py-1.5 rounded-lg">✕ Rimuovi</button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
                    <Field label="Istituto / Università" value={edu.institution}
                      onChange={v => setData(d => { const e = [...d.education]; e[i] = { ...e[i], institution: v }; return { ...d, education: e } })}
                      placeholder="Università di Milano" />
                    <Field label="Titolo di studio" value={edu.degree}
                      onChange={v => setData(d => { const e = [...d.education]; e[i] = { ...e[i], degree: v }; return { ...d, education: e } })}
                      placeholder="Laurea Magistrale" />
                    <Field label="Campo di studi" value={edu.field}
                      onChange={v => setData(d => { const e = [...d.education]; e[i] = { ...e[i], field: v }; return { ...d, education: e } })}
                      placeholder="Informatica" />
                    <Field label="Voto (opzionale)" value={edu.grade || ''}
                      onChange={v => setData(d => { const e = [...d.education]; e[i] = { ...e[i], grade: v }; return { ...d, education: e } })}
                      placeholder="110/110" />
                    <Field label="Anno inizio" value={edu.startDate}
                      onChange={v => setData(d => { const e = [...d.education]; e[i] = { ...e[i], startDate: v }; return { ...d, education: e } })}
                      placeholder="2018" />
                    <Field label="Anno fine" value={edu.endDate}
                      onChange={v => setData(d => { const e = [...d.education]; e[i] = { ...e[i], endDate: v }; return { ...d, education: e } })}
                      placeholder="2023" />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={addEducation} className="mt-6 w-full border-2 border-dashed border-gray-200 bg-gray-50 text-gray-600 py-4 rounded-2xl hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all font-bold">
              + Aggiungi istruzione
            </button>
          </div>
        )}

        {/* STEP 4: Skills */}
        {step === 'skills' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">⚡ Competenze</h2>
            {data.skills.length === 0 && (
              <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <div className="text-5xl mb-4 opacity-50">⚡</div>
                <p className="font-medium text-gray-500">Nessuna competenza aggiunta</p>
              </div>
            )}
            <div className="space-y-4">
              {data.skills.map((skill, i) => (
                <div key={skill.id} className="flex gap-4 items-center bg-white border border-gray-100 p-3 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <input
                    value={skill.name}
                    onChange={e => setData(d => { const s = [...d.skills]; s[i] = { ...s[i], name: e.target.value }; return { ...d, skills: s } })}
                    className="flex-1 border-none bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    placeholder="Es. Microsoft Excel"
                  />
                  <select
                    value={skill.level}
                    onChange={e => setData(d => { const s = [...d.skills]; s[i] = { ...s[i], level: e.target.value as typeof skill.level }; return { ...d, skills: s } })}
                    className="border-none bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="base">Base</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzato">Avanzato</option>
                    <option value="esperto">Esperto</option>
                  </select>
                  <button onClick={() => removeSkill(skill.id)} className="text-red-400 hover:text-red-600 bg-red-50 p-3 rounded-xl transition-colors">✕</button>
                </div>
              ))}
            </div>
            <button onClick={addSkill} className="mt-6 w-full border-2 border-dashed border-gray-200 bg-gray-50 text-gray-600 py-4 rounded-2xl hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all font-bold">
              + Aggiungi competenza
            </button>
          </div>
        )}

        {/* STEP 5: Languages */}
        {step === 'languages' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">🌍 Lingue</h2>
            {data.languages.length === 0 && (
              <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <div className="text-5xl mb-4 opacity-50">🌍</div>
                <p className="font-medium text-gray-500">Nessuna lingua aggiunta</p>
              </div>
            )}
            <div className="space-y-4">
              {data.languages.map((lang, i) => (
                <div key={lang.id} className="flex gap-4 items-center bg-white border border-gray-100 p-3 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <input
                    value={lang.name}
                    onChange={e => setData(d => { const l = [...d.languages]; l[i] = { ...l[i], name: e.target.value }; return { ...d, languages: l } })}
                    className="flex-1 border-none bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    placeholder="Es. Inglese"
                  />
                  <select
                    value={lang.level}
                    onChange={e => setData(d => { const l = [...d.languages]; l[i] = { ...l[i], level: e.target.value as typeof lang.level }; return { ...d, languages: l } })}
                    className="border-none bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    {['A1','A2','B1','B2','C1','C2','madrelingua'].map(lv => (
                      <option key={lv} value={lv}>{lv === 'madrelingua' ? 'Madrelingua' : lv}</option>
                    ))}
                  </select>
                  <button onClick={() => removeLanguage(lang.id)} className="text-red-400 hover:text-red-600 bg-red-50 p-3 rounded-xl transition-colors">✕</button>
                </div>
              ))}
            </div>
            <button onClick={addLanguage} className="mt-6 w-full border-2 border-dashed border-gray-200 bg-gray-50 text-gray-600 py-4 rounded-2xl hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all font-bold">
              + Aggiungi lingua
            </button>
          </div>
        )}

        {/* STEP 6: Template */}
        {step === 'template' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">🎨 Scegli il template</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-8">
              {TEMPLATES.map(tmpl => {
                const isLocked = !isPro && tmpl.isPro
                return (
                  <button
                    key={tmpl.id}
                    disabled={isLocked}
                    onClick={() => setData(d => ({ ...d, template: tmpl.id }))}
                    className={`relative border-2 rounded-2xl p-5 text-left transition-all duration-300 ${
                      data.template === tmpl.id 
                        ? 'border-blue-600 bg-blue-50/50 shadow-md ring-4 ring-blue-50' 
                        : isLocked 
                          ? 'border-gray-100 bg-gray-50 opacity-70 cursor-not-allowed'
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                    }`}
                  >
                    <div className={`w-full h-36 rounded-xl mb-4 shadow-sm ${tmpl.gradient}`} />
                    
                    <div className="font-bold text-gray-900 capitalize text-lg">{tmpl.label}</div>
                    <div className="text-sm text-gray-500 mt-1">{tmpl.desc}</div>
                    
                    {data.template === tmpl.id && (
                      <div className="absolute top-4 right-4 bg-blue-600 text-white rounded-full p-1.5 shadow-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    
                    {isLocked && (
                      <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] rounded-2xl flex flex-col items-center justify-center border border-transparent">
                        <div className="bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                          <span>🔒</span> PRO
                        </div>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <label className="block text-sm font-bold text-gray-800 mb-3">Colore principale</label>
              <div className="flex gap-3 flex-wrap">
                {['#2563EB','#7C3AED','#059669','#DC2626','#D97706','#0891B2','#111827'].map(color => (
                  <button
                    key={color}
                    onClick={() => setData(d => ({ ...d, accentColor: color }))}
                    className={`w-12 h-12 rounded-full shadow-sm transition-all duration-300 ${
                      data.accentColor === color 
                        ? 'ring-4 ring-offset-2 ring-gray-900 scale-110' 
                        : 'hover:scale-110 border-2 border-white/20'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
                <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-sm border-2 border-gray-200 hover:scale-110 transition-all duration-300">
                  <input
                    type="color"
                    value={data.accentColor}
                    onChange={e => setData(d => ({ ...d, accentColor: e.target.value }))}
                    className="absolute inset-[-10px] w-20 h-20 cursor-pointer"
                    title="Colore personalizzato"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Upgrade Banner ───────────────────────────────── */}
      {!isPro && (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between shadow-sm hover:shadow-md transition-all duration-300">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <h3 className="font-extrabold text-indigo-900 text-lg mb-1 flex items-center justify-center sm:justify-start gap-2">
              <span>🚀</span> Sblocca tutto il potenziale con Pro
            </h3>
            <p className="text-sm text-indigo-700 font-medium">Accedi a template premium, foto profilo e AI illimitata per il tuo CV.</p>
          </div>
          <button onClick={() => router.push('/pricing')} className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm whitespace-nowrap">
            Scopri i piani
          </button>
        </div>
      )}

      {/* ── Navigation Buttons ───────────────────────────── */}
      <div className="flex justify-between gap-4">
        <button
          onClick={() => setCurrentStep(i => Math.max(0, i - 1))}
          disabled={currentStep === 0}
          className="px-6 py-3 border border-gray-200 bg-white text-gray-700 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm disabled:opacity-30 disabled:hover:bg-white"
        >
          ← Indietro
        </button>

        <div className="flex gap-3">
          {currentStep < STEPS.length - 1 ? (
            <button
              onClick={() => setCurrentStep(i => i + 1)}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              Avanti →
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Salvataggio...
                </>
              ) : (
                '✅ Salva CV'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Helper component ─────────────────────────────────────────
function Field({
  label, value, onChange, placeholder, type = 'text', disabled = false,
}: {
  label: string; value: string; onChange?: (v: string) => void;
  placeholder?: string; type?: string; disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <input
        type={type} value={value}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder} disabled={disabled}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400 transition-all duration-300"
      />
    </div>
  )
}
