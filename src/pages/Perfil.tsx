import React from 'react'
import type { Perfil, Chapa, Tema, Proposta } from '../types'
import { Link } from 'react-router-dom'

export default function Perfil({chapa, presidente, vice, temas, propostas}:{chapa:Chapa; presidente:Perfil|undefined; vice:Perfil|undefined; temas:Tema[]; propostas:Proposta[]}){
  return (
    <div>
      <h2 className="mt-4 text-xl font-semibold">Perfil da Chapa</h2>

      <div className="mt-4 grid grid-cols-1 items-start gap-6 md:grid-cols-[minmax(16rem,1fr)_minmax(0,2fr)]">
        <aside className="card md:sticky md:top-4" aria-label="Informações da chapa">
          <div>
            {presidente?.fotoUrl && (
              <img
                src={presidente.fotoUrl}
                alt={`Foto de ${presidente.nomeCompleto}`}
                className="h-auto w-full max-w-[180px] rounded"
              />
            )}
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-accent-700 dark:text-accent-300">Presidente</p>
            <h3 className="text-lg font-semibold">{presidente?.nomeCompleto}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{presidente?.resumoBiografico}</p>
          </div>

          {vice && (
            <div className="mt-5 border-t border-slate-200 pt-5 dark:border-slate-700">
              <div className="flex items-start gap-3">
                {vice.fotoUrl && (
                  <img
                    src={vice.fotoUrl}
                    alt={`Foto de ${vice.nomeCompleto}`}
                    className="h-24 w-20 shrink-0 rounded object-cover"
                  />
                )}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent-700 dark:text-accent-300">Vice</p>
                  <h4 className="font-semibold">{vice.nomeCompleto}</h4>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{vice.resumoBiografico}</p>
                </div>
              </div>
            </div>
          )}

          <dl className="mt-5 border-t border-slate-200 pt-5 text-sm dark:border-slate-700">
            <div>
              <dt className="font-semibold">Partido</dt>
              <dd className="text-slate-600 dark:text-slate-300">{chapa.partidoPrincipal}</dd>
            </div>
            <div className="mt-3">
              <dt className="font-semibold">Número da chapa</dt>
              <dd className="text-slate-600 dark:text-slate-300">{chapa.numeroUrna}</dd>
            </div>
          </dl>

          <div className="mt-5 flex flex-col gap-2 border-t border-slate-200 pt-5 text-sm dark:border-slate-700">
            <a href={chapa.linkPlanoGovernoPdf} target="_blank" rel="noopener noreferrer" className="underline">Plano de Governo (PDF)</a>
            <a href={chapa.linkCandidaturaTSE} target="_blank" rel="noopener noreferrer" className="underline">Candidatura no TSE</a>
          </div>
        </aside>

        <main className="min-w-0">
          <section aria-labelledby="titulo-propostas">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <h3 id="titulo-propostas" className="text-lg font-semibold">Propostas</h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {propostas.length} {propostas.length === 1 ? 'tema abordado' : 'temas abordados'}
              </span>
            </div>

          {propostas.length===0 && <p className="text-slate-500">Nenhuma proposta encontrada para esta chapa.</p>}
          <div className="grid gap-3">
            {propostas.map(p=>{
              const tema = temas.find(t=>t.id===p.temaId)
              return (
                <article key={p.id} className="p-3 border rounded bg-white dark:bg-slate-900">
                  <h4 className="font-medium">{tema?.nome}</h4>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{p.resumo}</p>
                  {p.compromissoCitado && (
                    <blockquote className="mt-3 border-l-2 border-accent-400 pl-3 text-sm italic text-slate-600 dark:text-slate-300">
                      “{p.compromissoCitado}”
                    </blockquote>
                  )}
                  <p className="mt-2 text-xs text-slate-500">Página {p.paginaFontePdf} do plano de governo</p>
                </article>
              )
            })}
          </div>

            <div className="mt-6">
              <Link to="/comparativo" className="underline">Ver tabela comparativa</Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
