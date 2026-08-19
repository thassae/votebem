import React from 'react'
import { Instagram } from 'lucide-react'

export default function Footer(){
  return (
    <footer className="mt-16 border-t border-slate-200/80 py-8 dark:border-white/10">
      <div className="page-container flex flex-col gap-6 text-xs leading-relaxed text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-4xl">
          Todas as informações presentes neste site se encontram disponíveis na plataforma do TSE e foram geradas com base nas informações previstas nos planos de governo dos candidatos. Utilize as referências e compare-as com o material original fornecido pelas campanhas.
        </p>

        <a
          href="https://www.instagram.com/thassae/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 font-bold text-accent-700 hover:underline dark:text-accent-300"
          aria-label="Perfil @thassae no Instagram"
        >
          <Instagram size={22} aria-hidden="true" />
          <span>@thassae</span>
        </a>
      </div>
    </footer>
  )
}
