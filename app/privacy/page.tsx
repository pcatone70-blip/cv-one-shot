import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-8 font-medium">
        <ArrowLeft className="w-4 h-4" /> Torna alla home
      </Link>
      
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Informativa sulla Privacy</h1>
      
      <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
        <p className="text-sm">Ultimo aggiornamento: 24 Settembre 2026</p>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Chi siamo e cosa raccogliamo</h2>
          <p>CV One Shot (by PCAT) rispetta la tua privacy e si impegna a proteggere i tuoi dati personali. Raccogliamo i seguenti dati:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Dati di Account:</strong> Indirizzo email (tramite autenticazione sicura Supabase).</li>
            <li><strong>Dati del Curriculum:</strong> Nome, esperienze, istruzione e qualsiasi altra informazione che decidi volontariamente di inserire nel tuo CV.</li>
            <li><strong>Media:</strong> La foto del profilo che decidi di caricare sui nostri server sicuri.</li>
            <li><strong>Dati di Pagamento:</strong> Gestiti interamente da Stripe (non salviamo numeri di carta di credito).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. Come utilizziamo i tuoi dati (Finalità)</h2>
          <p>I tuoi dati vengono utilizzati esclusivamente per:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Creare e gestire il tuo account.</li>
            <li>Generare e impaginare il tuo Curriculum Vitae.</li>
            <li>Inviare i testi all'Intelligenza Artificiale (Google Gemini) al solo scopo di migliorarne la sintassi e renderli più professionali.</li>
            <li>Gestire l'abbonamento e l'assistenza tecnica.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Intelligenza Artificiale e Condivisione Terze Parti</h2>
          <p>Per fornirti la funzionalità "Ottimizza con AI", i testi che inserisci vengono trasmessi in modo crittografato tramite API a provider esterni (Google). Abbiamo configurato queste API in modo che <strong>i tuoi dati non vengano utilizzati per addestrare i loro modelli di intelligenza artificiale pubblici</strong>. Non vendiamo, affittiamo o cediamo i tuoi dati personali ad agenzie di marketing o reclutatori terzi.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Sicurezza dei Dati (RLS)</h2>
          <p>I tuoi dati sono conservati su database cloud (Supabase) in server protetti. Utilizziamo la tecnologia Row Level Security (RLS) che impedisce crittograficamente a qualsiasi altro utente di accedere ai tuoi CV o alle tue informazioni personali. Solo tu, accedendo con le tue credenziali, hai i permessi per leggerli o modificarli.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. I tuoi diritti (GDPR)</h2>
          <p>In conformità con il Regolamento Generale sulla Protezione dei Dati (GDPR), hai il diritto di:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Accedere ai tuoi dati (basta entrare nella tua Dashboard).</li>
            <li>Modificarli o aggiornarli in qualsiasi momento.</li>
            <li>Richiedere la cancellazione permanente del tuo account e di tutti i CV associati cliccando sul tasto "Elimina CV" e contattando il nostro supporto per l'eliminazione dell'account root.</li>
            <li>Esportare i tuoi dati in formato strutturato (es. scaricando il PDF).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. Contatti</h2>
          <p>Per qualsiasi domanda sulla privacy o per esercitare i tuoi diritti, puoi contattarci via email (indirizzo che verrà fornito al lancio ufficiale).</p>
        </section>
      </div>
    </div>
  )
}
