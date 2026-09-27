import { GoogleGenerativeAI } from '@google/generative-ai'
import type { CVData, Language } from '@/lib/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

export async function optimizeSummary(text: string, language: Language): Promise<string> {
  const systemPrompt = language === 'it'
    ? `Sei un esperto redattore di curriculum vitae per il mercato del lavoro italiano. Riscrivi il seguente profilo in modo professionale e conciso (max 4 righe), in prima persona, ottimizzato per ATS, in italiano. Restituisci SOLO il testo riscritto.`
    : `You are an expert CV writer. Rewrite the following summary to be professional, concise (max 4 lines), in first person, ATS optimized, in English. Return ONLY the rewritten text.`

  const result = await model.generateContent(`${systemPrompt}\n\nTesto originale:\n${text}`)
  return result.response.text().trim() || text
}

export async function optimizeExperience(
  description: string,
  position: string,
  company: string,
  language: Language
): Promise<string> {
  const systemPrompt = language === 'it'
    ? `Sei un esperto redattore di CV. Riscrivi la descrizione dell'esperienza per il ruolo di ${position} presso ${company}. Usa bullet points (•), inizia con verbi d'azione, quantifica i risultati se possibile, max 4 punti, in italiano. Restituisci SOLO i bullet points.`
    : `You are an expert CV writer. Rewrite the experience description for ${position} at ${company}. Use bullet points (•), start with action verbs, quantify results if possible, max 4 points, in English. Return ONLY the bullet points.`

  const result = await model.generateContent(`${systemPrompt}\n\nTesto originale:\n${description}`)
  return result.response.text().trim() || description
}
