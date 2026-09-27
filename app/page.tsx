"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Check, 
  Sparkles, 
  Wand2, 
  FileText, 
  Download, 
  Star, 
  Users, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  Github,
  Twitter,
  Linkedin
} from "lucide-react";

export default function LandingPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: "-100px" },
    transition: { staggerChildren: 0.2 }
  };

  const stepItem = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                C
              </div>
              <span className="font-bold text-xl tracking-tight">CV One Shot (by PCAT)</span>
            </div>
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
              <Link href="#features" className="hover:text-blue-600 transition-colors">Funzionalità</Link>
              <Link href="#how-it-works" className="hover:text-blue-600 transition-colors">Come Funziona</Link>
              <Link href="#pricing" className="hover:text-blue-600 transition-colors">Prezzi</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Accedi</Link>
              <Link href="/register" className="text-sm font-medium bg-slate-900 text-white px-4 py-2 rounded-full hover:bg-slate-800 transition-colors shadow-sm">
                Inizia Gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>
        <div className="absolute right-0 top-20 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-purple-500 opacity-20 blur-[100px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              <span>La nuova era della creazione dei CV</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-900">
              Il tuo prossimo lavoro inizia con un <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                CV perfetto, in un istante.
              </span>
            </h1>
            <p className="mt-6 text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Dimentica ore passate a formattare documenti. CV One Shot (by PCAT) usa l'intelligenza artificiale per creare un curriculum professionale, ottimizzato per superare i filtri ATS e impressionare i recruiter.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-full font-semibold text-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all hover:scale-105 flex items-center justify-center gap-2">
                Crea il tuo CV ora <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#demo" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-semibold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                Guarda l'anteprima
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-500 flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-green-500" /> Nessuna carta di credito richiesta
            </p>
          </motion.div>

          {/* Abstract App Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-16 relative max-w-5xl mx-auto"
          >
            <div className="rounded-2xl border border-slate-200 bg-white/50 backdrop-blur-xl p-2 shadow-2xl">
              <div className="rounded-xl overflow-hidden bg-slate-900 aspect-[16/9] relative flex items-center justify-center border border-slate-800">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
                <div className="text-white/50 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                    <Wand2 className="w-8 h-8 text-blue-400" />
                  </div>
                  <p className="text-xl font-medium">Interfaccia Editor Intuitiva</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>



      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeIn} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Come funziona?</h2>
            <p className="text-lg text-slate-600">Tre semplici passi per trasformare la tua esperienza nel tuo miglior biglietto da visita.</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid md:grid-cols-3 gap-8 relative"
          >
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200"></div>

            <motion.div variants={stepItem} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">1. Inserisci i tuoi dati</h3>
              <p className="text-slate-600">Importa da LinkedIn o compila i campi in modo guidato. Ci vuole un attimo.</p>
            </motion.div>

            <motion.div variants={stepItem} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 flex items-center justify-center mb-6">
                <Wand2 className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">2. L'AI fa la magia</h3>
              <p className="text-slate-600">La nostra AI riscrive i tuoi punti di forza per renderli più incisivi e professionali.</p>
            </motion.div>

            <motion.div variants={stepItem} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 flex items-center justify-center mb-6">
                <Download className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">3. Esporta e candidati</h3>
              <p className="text-slate-600">Scarica un PDF perfetto o invialo direttamente. Sei pronto per il colloquio.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white relative">
        <div className="absolute inset-0 bg-slate-50/50 -z-10 skew-y-3 transform origin-bottom-left"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeIn} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Prezzi semplici, nessun trucco</h2>
            <p className="text-lg text-slate-600">Scegli il piano perfetto per dare una spinta alla tua carriera.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <motion.div 
              {...fadeIn}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col"
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Free</h3>
                <div className="text-4xl font-bold text-slate-900 mb-2">€0<span className="text-lg text-slate-500 font-normal">/mese</span></div>
                <p className="text-slate-500 text-sm">Perfetto per iniziare e testare la piattaforma.</p>
              </div>
              <div className="flex-1">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3"><Check className="w-5 h-5 text-blue-600 shrink-0" /><span className="text-slate-600">1 CV</span></li>
                  <li className="flex items-start gap-3"><Check className="w-5 h-5 text-blue-600 shrink-0" /><span className="text-slate-600">2 Template (Modern, Classic)</span></li>
                  <li className="flex items-start gap-3"><Check className="w-5 h-5 text-blue-600 shrink-0" /><span className="text-slate-600">Correzione AI Base</span></li>
                  <li className="flex items-start gap-3"><Check className="w-5 h-5 text-blue-600 shrink-0" /><span className="text-slate-600">Esportazione PDF (con watermark)</span></li>
                </ul>
              </div>
              <Link href="/register" className="w-full py-3 px-4 rounded-xl font-medium text-center border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
                Inizia Gratis
              </Link>
            </motion.div>

            {/* Pro Tier */}
            <motion.div 
              {...fadeIn}
              className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl relative flex flex-col transform md:-translate-y-4"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                Più Popolare
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">Pro</h3>
                <div className="text-4xl font-bold text-white mb-2">€9<span className="text-lg text-slate-400 font-normal">/mese</span></div>
                <p className="text-slate-400 text-sm">Per professionisti che vogliono massimizzare le opportunità.</p>
              </div>
              <div className="flex-1">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3"><Check className="w-5 h-5 text-blue-400 shrink-0" /><span className="text-slate-300">CV Illimitati</span></li>
                  <li className="flex items-start gap-3"><Check className="w-5 h-5 text-blue-400 shrink-0" /><span className="text-slate-300">Tutti i 5 Template Premium</span></li>
                  <li className="flex items-start gap-3"><Check className="w-5 h-5 text-purple-400 shrink-0" /><span className="text-white font-medium">AI Avanzata (Scrittura & Ottimizzazione)</span></li>
                  <li className="flex items-start gap-3"><Check className="w-5 h-5 text-blue-400 shrink-0" /><span className="text-slate-300">Integrazione Foto Profilo</span></li>
                  <li className="flex items-start gap-3"><Check className="w-5 h-5 text-blue-400 shrink-0" /><span className="text-slate-300">Generatore Lettera di Presentazione</span></li>
                  <li className="flex items-start gap-3"><Check className="w-5 h-5 text-blue-400 shrink-0" /><span className="text-slate-300">Nessun Watermark, PDF HD</span></li>
                </ul>
              </div>
              <Link href="/register?plan=pro" className="w-full py-3 px-4 rounded-xl font-medium text-center bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/50">
                Scegli Pro
              </Link>
            </motion.div>

            {/* Lifetime Tier */}
            <motion.div 
              {...fadeIn}
              className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-8 border border-purple-100 shadow-sm flex flex-col"
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Lifetime</h3>
                <div className="text-4xl font-bold text-slate-900 mb-2">€49<span className="text-lg text-slate-500 font-normal"> una tantum</span></div>
                <p className="text-slate-500 text-sm">Paga una volta, usa per sempre. L'investimento migliore.</p>
              </div>
              <div className="flex-1">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3"><Check className="w-5 h-5 text-purple-600 shrink-0" /><span className="text-slate-800 font-medium">Tutto quello che c'è nel piano Pro</span></li>
                  <li className="flex items-start gap-3"><Check className="w-5 h-5 text-purple-600 shrink-0" /><span className="text-slate-600">Accesso a vita</span></li>
                  <li className="flex items-start gap-3"><Check className="w-5 h-5 text-purple-600 shrink-0" /><span className="text-slate-600">Aggiornamenti futuri inclusi</span></li>
                  <li className="flex items-start gap-3"><Check className="w-5 h-5 text-purple-600 shrink-0" /><span className="text-slate-600">Supporto prioritario</span></li>
                </ul>
              </div>
              <Link href="/register?plan=lifetime" className="w-full py-3 px-4 rounded-xl font-medium text-center border border-purple-200 bg-white text-purple-700 hover:bg-purple-50 transition-colors">
                Acquista Ora
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600 -z-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 -z-10 opacity-90"></div>
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div {...fadeIn}>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Pronto a svoltare la tua carriera?</h2>
            <p className="text-xl text-blue-100 mb-10">Unisciti a migliaia di persone che hanno già trovato il lavoro dei loro sogni grazie a un CV impeccabile.</p>
            <Link href="/register" className="inline-flex px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-blue-50 shadow-xl transition-transform hover:scale-105">
              Crea il tuo CV Gratuitamente
            </Link>
            <p className="mt-6 text-sm text-blue-200 opacity-80">Ci vogliono meno di 5 minuti.</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4 text-white">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-bold text-xl">
                  C
                </div>
                <span className="font-bold text-xl tracking-tight">CV One Shot (by PCAT)</span>
              </div>
              <p className="text-sm">L'intelligenza artificiale al servizio della tua carriera. Crea CV perfetti in pochi minuti.</p>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-4">Prodotto</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#features" className="hover:text-white transition-colors">Funzionalità</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Prezzi</Link></li>
                <li><Link href="/templates" className="hover:text-white transition-colors">Template CV</Link></li>
                <li><Link href="/examples" className="hover:text-white transition-colors">Esempi di CV</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-medium mb-4">Risorse</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/guide" className="hover:text-white transition-colors">Guida ai Colloqui</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contattaci</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-medium mb-4">Legale</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/termini" className="hover:text-white transition-colors">Termini di Servizio</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© {new Date().getFullYear()} CV One Shot (by PCAT). Tutti i diritti riservati.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
