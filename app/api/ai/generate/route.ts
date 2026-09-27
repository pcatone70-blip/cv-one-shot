import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { optimizeSummary, optimizeExperience } from '@/lib/gemini'
import type { Language } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { type, text, language, position, company } = body

    if (!text || !type || !language) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    let result = ''
    if (type === 'summary') {
      result = await optimizeSummary(text, language as Language)
    } else if (type === 'experience') {
      result = await optimizeExperience(text, position || 'Role', company || 'Company', language as Language)
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    return NextResponse.json({ text: result })
  } catch (error) {
    console.error('AI generation error:', error)
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
  }
}
