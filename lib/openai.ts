import OpenAI from 'openai'
import type { CVData, Language } from '@/lib/types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// ─── Ottimizza il profilo professionale ─────────────────────
export async function optimizeSummary(text: string, language: Language): Promise<string> {
  const systemPrompt = language === 'it'
    ? `Sei un esperto redattore di curriculum vitae per il mercato del lavoro italiano.
Riscrivi il profilo professionale fornito in modo:
- Professionale e conciso (max 4 righe)
- In prima persona
- Con parole chiave ATS rilevanti
- In italiano formale
Restituisci SOLO il testo riscritto, nessun commento.`
    : `You are an expert CV writer for the international job market.
Rewrite the provided professional summary:
- Professional and concise (max 4 lines)
- In first person
- With relevant ATS keywords
- In formal English
Return ONLY the rewritten text, no comments.`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: text },
    ],
    max_tokens: 300,
    temperature: 0.7,
  })

  return completion.choices[0].message.content?.trim() || text
}

// ─── Ottimizza descrizione esperienza lavorativa ────────────
export async function optimizeExperience(
  description: string,
  position: string,
  company: string,
  language: Language
): Promise<string> {
  const systemPrompt = language === 'it'
    ? `Sei un esperto redattore di curriculum vitae.
Riscrivi la descrizione dell'esperienza lavorativa fornita come ${position} presso ${company}.
Regole:
- Usa bullet points (•)
- Inizia ogni punto con un verbo di azione forte (es: Gestito, Sviluppato, Aumentato...)
- Quantifica i risultati dove possibile
- Max 4 bullet points
- In italiano professionale
Restituisci SOLO i bullet points, nessun altro testo.`
    : `You are an expert CV writer.
Rewrite the work experience description for ${position} at ${company}.
Rules:
- Use bullet points (•)
- Start each point with a strong action verb (e.g. Managed, Developed, Increased...)
- Quantify results where possible
- Max 4 bullet points
- In professional English
Return ONLY the bullet points, no other text.`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: description },
    ],
    max_tokens: 400,
    temperature: 0.7,
  })

  return completion.choices[0].message.content?.trim() || description
}

// ─── Genera lettera di presentazione (Pro) ──────────────────
export async function generateCoverLetter(
  cvData: CVData,
  jobTitle: string,
  companyName: string,
  language: Language
): Promise<string> {
  const cvSummary = `
Nome: ${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}
Profilo: ${cvData.personalInfo.summary}
Ultima esperienza: ${cvData.experience[0]?.position} presso ${cvData.experience[0]?.company}
Competenze principali: ${cvData.skills.slice(0, 5).map(s => s.name).join(', ')}
  `.trim()

  const systemPrompt = language === 'it'
    ? `Sei un esperto redattore di lettere di presentazione per il mercato italiano.
Scrivi una lettera di presentazione professionale per ${jobTitle} presso ${companyName}.
- Tono professionale ma personale
- 3 paragrafi: introduzione, valore aggiunto, chiusura
- Max 250 parole
- In italiano`
    : `You are an expert cover letter writer.
Write a professional cover letter for ${jobTitle} at ${companyName}.
- Professional but personal tone
- 3 paragraphs: introduction, value proposition, closing
- Max 250 words
- In English`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Dati del candidato:\n${cvSummary}` },
    ],
    max_tokens: 600,
    temperature: 0.8,
  })

  return completion.choices[0].message.content?.trim() || ''
}

export default openai
