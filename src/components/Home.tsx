import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Scale } from 'lucide-react'
import type { Chapa, Perfil } from '../types'

export default function Home({chapas, perfis}:{chapas: Chapa[]; perfis: Perfil[]}){
  const chapasOrdenadas = useMemo(
    () => [...chapas].sort((chapaA, chapaB) =>
      chapaA.partidoPrincipal.localeCompare(chapaB.partidoPrincipal, 'pt-BR')
      || chapaA.numeroUrna - chapaB.numeroUrna
    ),
    [chapas]
  )

  return (
    <div>
      <section className="hero-grid pb-16 pt-4 sm:pb-20 sm:pt-10">
        <div className="max-w-3xl">
          <div className="eyebrow"><span className="eyebrow-dot" /> Eleições 2026</div>
          <h1 className="hero-title">Compare antes<br />de decidir<br className="sm:hidden" /> seu voto<span className="text-accent-500">.</span></h1>
          <p className="hero-copy">Candidatos e propostas lado a lado, com informação clara para uma escolha consciente.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/comparativo" className="button-primary">Comparar propostas <ArrowRight size={18} /></Link>
            <a href="#chapas" className="button-secondary">Conhecer chapas</a>
          </div>
        </div>

        <div className="hero-card" aria-hidden="true">
          <div className="flex items-center justify-between">
            <span className="hero-card-label text-accent-600 dark:text-accent-300">Candidato A</span>
            <Scale className="text-accent-500" size={24} />
            <span className="hero-card-label text-amber-600 dark:text-amber-300">Candidato B</span>
          </div>
          {['Saúde', 'Educação', 'Economia'].map((tema, index) => (
            <div key={tema} className="mt-7">
              <p className="mb-2 text-center text-sm font-semibold">{tema}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="meter"><span className="meter-accent" style={{width: `${[82, 57, 69][index]}%`}} /></div>
                <div className="meter"><span className="meter-amber" style={{width: `${[45, 79, 62][index]}%`}} /></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="chapas" className="scroll-mt-28 border-t border-slate-200/80 pt-12 dark:border-white/10">
        <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-kicker">Quem está na disputa</p>
            <h2 className="section-title">Conheça as chapas</h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">Perfis, coligações e planos de governo reunidos em um só lugar.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {chapasOrdenadas.map(c => {
          const presidente = perfis.find(perfil => perfil.id === c.presidenteId)
          const vice = perfis.find(perfil => perfil.id === c.viceId)

          return (
            <article key={c.id} className="candidate-card group">
              <div className="flex items-start gap-4">
                {presidente?.fotoUrl && (
                  <img
                    src={presidente.fotoUrl}
                    alt={`Foto de ${presidente.nomeCompleto}`}
                    className="h-28 w-24 shrink-0 rounded-2xl object-cover object-top grayscale-[15%] transition group-hover:grayscale-0"
                  />
                )}

                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-2"><span className="party-pill">{c.partidoPrincipal}</span><span className="text-sm font-bold text-slate-400">#{c.numeroUrna}</span></div>
                  <h3 className="text-lg font-bold leading-tight">{presidente?.nomeUrna || presidente?.nomeCompleto || 'Não informado'}</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Vice: {vice?.nomeUrna || vice?.nomeCompleto || 'Não informado'}</p>
                </div>
              </div>
              <p className="mt-5 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400"><strong className="font-semibold text-slate-700 dark:text-slate-300">Coligação:</strong> {c.coligacao.join(', ')}</p>
              <Link to={`/chapa/${c.id}`} className="card-link">Ver perfil e propostas <ArrowRight size={16} /></Link>
            </article>
          )
        })}
        </div>
      </section>
    </div>
  )
}
