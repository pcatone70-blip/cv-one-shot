'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function DeleteCVButton({ cvId }: { cvId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = useCallback(async () => {
    if (!confirm('Sei sicuro di voler eliminare questo CV?')) return

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('cvs').delete().eq('id', cvId)

    if (error) {
      toast.error('Errore durante l\'eliminazione')
      setLoading(false)
      return
    }

    toast.success('CV eliminato')
    router.refresh()
  }, [cvId, router])

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
      title="Elimina CV"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
