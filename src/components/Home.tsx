import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Columns, FileSearch, ListChecks } from 'lucide-react'
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
          <p className="hero-copy">Escolha o que importa para você e compare propostas lado a lado, sempre com acesso à fonte original.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/comparativo#prioridades" className="button-primary">Montar minha comparação <ArrowRight size={18} /></Link>
            <Link to="/comparativo#chapas" className="button-secondary">Comparar duas chapas</Link>
          </div>
        </div>

        <div className="hero-card">
          <p className="hero-card-label text-accent-700 dark:text-accent-300">Sua matriz de comparação</p>
          <ol className="mt-6 space-y-5">
            <li className="flex gap-4"><ListChecks className="shrink-0 text-accent-500" aria-hidden="true" /><div><strong>1. Escolha prioridades</strong><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Selecione os temas mais relevantes para sua decisão.</p></div></li>
            <li className="flex gap-4"><Columns className="shrink-0 text-accent-500" aria-hidden="true" /><div><strong>2. Compare propostas</strong><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Veja de duas a cinco chapas por vez, sem ranking.</p></div></li>
            <li className="flex gap-4"><FileSearch className="shrink-0 text-accent-500" aria-hidden="true" /><div><strong>3. Consulte as fontes</strong><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Abra o plano oficial diretamente na página citada.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="border-t border-slate-200/80 py-12 dark:border-white/10" aria-labelledby="titulo-caminho">
        <p className="section-kicker">Escolha seu caminho</p>
        <h2 id="titulo-caminho" className="section-title">Por onde você quer começar?</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Link to="/comparativo#prioridades" className="candidate-card group">
            <ListChecks className="text-accent-600 dark:text-accent-300" aria-hidden="true" />
            <h3 className="mt-4 text-lg font-bold">Estou em dúvida</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Comece pelos temas que importam para você.</p>
            <span className="card-link">Escolher prioridades <ArrowRight size={16} /></span>
          </Link>
          <Link to="/comparativo#chapas" className="candidate-card group">
            <Columns className="text-accent-600 dark:text-accent-300" aria-hidden="true" />
            <h3 className="mt-4 text-lg font-bold">Já tenho nomes em mente</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Selecione duas chapas e veja as diferenças.</p>
            <span className="card-link">Comparar chapas <ArrowRight size={16} /></span>
          </Link>
          <Link to="/comparativo#temas" className="candidate-card group">
            <FileSearch className="text-accent-600 dark:text-accent-300" aria-hidden="true" />
            <h3 className="mt-4 text-lg font-bold">Quero entender um tema</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Explore como diferentes planos tratam uma prioridade.</p>
            <span className="card-link">Explorar temas <ArrowRight size={16} /></span>
          </Link>
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
                    className="h-28 w-24 shrink-0 rounded-2xl bg-slate-100 object-contain grayscale-[15%] transition group-hover:grayscale-0 dark:bg-white/5"
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
