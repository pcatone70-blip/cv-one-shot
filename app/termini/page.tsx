import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TerminiPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-8 font-medium">
        <ArrowLeft className="w-4 h-4" /> Torna alla home
      </Link>
      
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Termini e Condizioni di Servizio</h1>
      
      <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
        <p className="text-sm">Ultimo aggiornamento: 24 Settembre 2026</p>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Accettazione dei Termini</h2>
          <p>Utilizzando CV One Shot (by PCAT) ("il Servizio"), l'utente accetta di essere vincolato dai presenti Termini e Condizioni. Se non si accettano questi termini, si prega di non utilizzare il Servizio.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. Descrizione del Servizio</h2>
          <p>CV One Shot (by PCAT) è un software as a service (SaaS) che permette agli utenti di creare, ottimizzare tramite Intelligenza Artificiale e scaricare il proprio Curriculum Vitae. Il servizio è offerto sia in forma gratuita con limitazioni, sia tramite piani a pagamento (Pro/Lifetime).</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Account e Sicurezza</h2>
          <p>L'utente è responsabile del mantenimento della riservatezza delle proprie credenziali di accesso. L'utente si impegna a fornire informazioni veritiere durante la registrazione e solleva i gestori di CV One Shot (by PCAT) da qualsiasi responsabilità derivante da accessi non autorizzati causati da negligenza dell'utente.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Pagamenti e Rimborsi</h2>
          <p>I pagamenti sono elaborati in modo sicuro tramite Stripe. L'abbonamento mensile si rinnova automaticamente fino a cancellazione. È possibile annullare l'abbonamento in qualsiasi momento. I rimborsi sono concessi a nostra esclusiva discrezione, generalmente solo per difetti tecnici del servizio che impediscano la generazione del CV.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. Utilizzo dell'Intelligenza Artificiale</h2>
          <p>Il servizio fa uso di tecnologie di Intelligenza Artificiale di terze parti (es. Google Gemini) per ottimizzare i testi. L'utente comprende e accetta che i testi generati dall'AI potrebbero contenere inesattezze. È esclusiva responsabilità dell'utente verificare e correggere il contenuto del proprio CV prima di utilizzarlo per scopi professionali o legali.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. Proprietà Intellettuale</h2>
          <p>I template, il design, il codice e l'architettura di CV One Shot (by PCAT) sono di proprietà esclusiva dei creatori del servizio. I dati e i testi inseriti nel CV (le informazioni personali) rimangono di esclusiva proprietà dell'utente.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">7. Limitazione di Responsabilità</h2>
          <p>CV One Shot (by PCAT) è fornito "così com'è". Non garantiamo in alcun modo che l'uso del nostro servizio porterà all'assunzione o all'ottenimento di un colloquio di lavoro. Non siamo responsabili per alcun danno diretto o indiretto derivante dall'uso o dall'impossibilità di usare il servizio.</p>
        </section>
      </div>
    </div>
  )
}
