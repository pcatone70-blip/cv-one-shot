const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const env = fs.readFileSync('.env.local', 'utf-8')
const getEnv = (key) => {
  const line = env.split('\n').find(l => l.startsWith(key + '='))
  return line ? line.substring(key.length + 1).trim() : ''
}

const supabase = createClient(getEnv('NEXT_PUBLIC_SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY'))

async function setup() {
  console.log('🔧 Configurazione Storage per le foto...')
  
  // Create storage bucket for CV photos
  const { error: bucketError } = await supabase.storage.createBucket('cv-photos', {
    public: true,
    fileSizeLimit: 2 * 1024 * 1024, // 2MB max
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
  })
  
  if (bucketError && !bucketError.message.includes('already exists')) {
    console.error('Errore creazione bucket:', bucketError.message)
  } else {
    console.log('✅ Bucket "cv-photos" pronto!')
  }

  console.log('\n✅ Setup completo! Le foto dei CV sono ora abilitate.')
}

setup()
