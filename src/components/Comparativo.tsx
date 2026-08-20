import React, { useEffect, useMemo, useState } from 'react'
import { Bookmark, Check, ExternalLink, Share2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Tema, Chapa, Proposta } from '../types'

type SavedComparison = { chapas: string[]; temas: string[]; savedAt?: string }

const STORAGE_KEY = 'vb-comparison'

function sortSlates(chapas: Chapa[]){
  return [...chapas].sort((a, b) =>
    a.partidoPrincipal.localeCompare(b.partidoPrincipal, 'pt-BR') || a.numeroUrna - b.numeroUrna
  )
}

function validIds(raw: string | null, valid: Set<string>, limit?: number){
  const ids = (raw || '').split(',').filter(id => valid.has(id))
  return limit === undefined ? ids : ids.slice(0, limit)
}

function initialSelection(chapas: Chapa[], temas: Tema[]): SavedComparison{
  const orderedSlates = sortSlates(chapas)
  const slateIds = new Set(chapas.map(chapa => chapa.id))
  const themeIds = new Set(temas.map(tema => tema.id))
  const params = new URLSearchParams(window.location.search)
  const hasUrlSelection = params.has('chapas') || params.has('temas')

  if(hasUrlSelection){
    const selectedSlates = validIds(params.get('chapas'), slateIds, 5)
    const selectedThemes = validIds(params.get('temas'), themeIds)
    return {
      chapas: selectedSlates.length ? selectedSlates : orderedSlates.slice(0, 2).map(chapa => chapa.id),
      temas: selectedThemes.length ? selectedThemes : temas.slice(0, 3).map(tema => tema.id)
    }
  }

  try{
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') as SavedComparison | null
    if(saved){
      const selectedSlates = saved.chapas.filter(id => slateIds.has(id)).slice(0, 5)
      const selectedThemes = saved.temas.filter(id => themeIds.has(id))
      if(selectedSlates.length >= 2 && selectedThemes.length){
        return { ...saved, chapas: selectedSlates, temas: selectedThemes }
      }
    }
  }catch(e){}

  return {
    chapas: orderedSlates.slice(0, 2).map(chapa => chapa.id),
    temas: temas.slice(0, 3).map(tema => tema.id)
  }
}

export default function Comparativo({temas, chapas, propostas}:{temas: Tema[]; chapas: Chapa[]; propostas: Proposta[]}){
  const initial = useMemo(() => initialSelection(chapas, temas), [chapas, temas])
  const [temasSelecionados, setTemasSelecionados] = useState<string[]>(initial.temas)
  const [chapasSelecionadas, setChapasSelecionadas] = useState<string[]>(initial.chapas)
  const [savedAt, setSavedAt] = useState(initial.savedAt)
  const [status, setStatus] = useState('')

  const chapasOrdenadas = useMemo(() => sortSlates(chapas), [chapas])
  const temasFiltrados = temas.filter(tema => temasSelecionados.includes(tema.id))
  const chapasFiltradas = chapasOrdenadas.filter(chapa => chapasSelecionadas.includes(chapa.id))
  const podeComparar = chapasFiltradas.length >= 2 && temasFiltrados.length > 0

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('chapas', chapasSelecionadas.join(','))
    params.set('temas', temasSelecionados.join(','))
    const nextUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`
    window.history.replaceState(null, '', nextUrl)
  }, [chapasSelecionadas, temasSelecionados])

  useEffect(() => {
    if(!window.location.hash) return
    const target = document.getElementById(window.location.hash.slice(1))
    if(target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const toggleChapa = (id: string) => {
    setStatus('')
    setChapasSelecionadas(current => current.includes(id)
      ? current.filter(item => item !== id)
      : current.length < 5 ? [...current, id] : current
    )
  }

  const toggleTema = (id: string) => {
    setStatus('')
    setTemasSelecionados(current => current.includes(id)
      ? current.filter(item => item !== id)
      : [...current, id]
    )
  }

  const saveComparison = () => {
    const saved: SavedComparison = { chapas: chapasSelecionadas, temas: temasSelecionados, savedAt: new Date().toISOString() }
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
      setSavedAt(saved.savedAt)
      setStatus('Análise salva neste navegador.')
    }catch(e){
      setStatus('Não foi possível salvar a análise neste navegador.')
    }
  }

  const comparisonUrl = (themeIds = temasSelecionados) => {
    const url = new URL('/comparativo', window.location.origin)
    url.searchParams.set('chapas', chapasSelecionadas.join(','))
    url.searchParams.set('temas', themeIds.join(','))
    return url.toString()
  }

  const shareComparison = async (theme?: Tema) => {
    const title = theme ? `Propostas sobre ${theme.nome} no VoteBem` : 'Minha comparação no VoteBem'
    const url = comparisonUrl(theme ? [theme.id] : temasSelecionados)
    try{
      if(navigator.share){
        await navigator.share({ title, text: 'Compare as propostas no VoteBem. Sem ranking ou recomendação eleitoral.', url })
        setStatus('Comparação compartilhada.')
      }else{
        await navigator.clipboard.writeText(url)
        setStatus('Link da comparação copiado.')
      }
    }catch(error){
      if(error instanceof DOMException && error.name === 'AbortError') return
      try{
        await navigator.clipboard.writeText(url)
        setStatus('Link da comparação copiado.')
      }catch(e){
        setStatus('Não foi possível compartilhar. Copie o endereço da página no navegador.')
      }
    }
  }

  return (
    <section aria-labelledby="titulo-comparacao">
      <div className="mb-8">
        <p className="section-kicker">Sua matriz de comparação</p>
        <h1 id="titulo-comparacao" className="section-title">Compare o que importa para você</h1>
        <p className="mt-3 max-w-3xl text-slate-500 dark:text-slate-400">
          Escolha um ou mais temas e compare de duas a cinco chapas. O VoteBem organiza as fontes; não indica em quem votar.
        </p>
      </div>

      <div className="filter-panel space-y-7">
        <fieldset id="prioridades" className="scroll-mt-28">
          <legend className="text-lg font-bold">1. Quais temas são prioridade?</legend>
          <p id="ajuda-temas" className="mt-1 text-sm text-slate-500 dark:text-slate-400">Selecione um ou quantos temas quiser.</p>
          <div id="temas" className="mt-4 flex scroll-mt-28 flex-wrap gap-2" aria-describedby="ajuda-temas">
            {temas.map(tema => {
              const selected = temasSelecionados.includes(tema.id)
              return (
                <label key={tema.id} className={`selection-chip ${selected ? 'selection-chip-active' : ''}`}>
                  <input type="checkbox" className="sr-only" checked={selected} onChange={() => toggleTema(tema.id)} />
                  {selected && <Check size={15} aria-hidden="true" />}{tema.nome}
                </label>
              )
            })}
          </div>
        </fieldset>

        <fieldset id="chapas" className="scroll-mt-28 border-t border-slate-200 pt-6 dark:border-white/10">
          <legend className="text-lg font-bold">2. Quais chapas você quer comparar?</legend>
          <p id="ajuda-chapas" className="mt-1 text-sm text-slate-500 dark:text-slate-400">Selecione de duas a cinco chapas.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3" aria-describedby="ajuda-chapas">
            {chapasOrdenadas.map(chapa => {
              const selected = chapasSelecionadas.includes(chapa.id)
              return (
                <label key={chapa.id} className={`selection-option ${selected ? 'selection-option-active' : ''} ${!selected && chapasSelecionadas.length >= 5 ? 'opacity-50' : ''}`}>
                  <input type="checkbox" className="sr-only" checked={selected} disabled={!selected && chapasSelecionadas.length >= 5} onChange={() => toggleChapa(chapa.id)} />
                  <span><strong>{chapa.partidoPrincipal}</strong> <span className="text-slate-500 dark:text-slate-400">({chapa.numeroUrna})</span></span>
                  {selected && <Check size={17} aria-hidden="true" />}
                </label>
              )
            })}
          </div>
        </fieldset>

        <div className="flex justify-end border-t border-slate-200 pt-6 dark:border-white/10">
          <span className="text-sm text-slate-500 dark:text-slate-400" aria-live="polite">
            {temasSelecionados.length} {temasSelecionados.length === 1 ? 'tema' : 'temas'} · {chapasSelecionadas.length} de 5 chapas
          </span>
        </div>
      </div>

      {!podeComparar ? (
        <div className="status-message mt-6" role="status">Selecione ao menos um tema e duas chapas para montar a comparação.</div>
      ) : (
        <div className="mt-8">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <div>
              <p className="section-kicker">Resultado</p>
              <h2 className="text-2xl font-extrabold">Propostas selecionadas</h2>
            </div>
            <div className="ml-auto flex flex-wrap gap-2">
              <button type="button" onClick={saveComparison} className="button-secondary"><Bookmark size={17} aria-hidden="true" /> Salvar minha análise</button>
              <button type="button" onClick={() => shareComparison()} className="button-primary"><Share2 size={17} aria-hidden="true" /> Compartilhar</button>
            </div>
          </div>

          {savedAt && <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">Análise salva em {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(savedAt))}.</p>}
          {status && <p className="mb-4 rounded-xl bg-accent-50 px-4 py-3 text-sm text-accent-800 dark:bg-accent-400/10 dark:text-accent-200" role="status">{status}</p>}

          <div className="hidden space-y-4 md:block">
            {temasFiltrados.map(tema => (
              <section key={tema.id} className="table-shell" aria-labelledby={`tema-desktop-${tema.id}`}>
                <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-white/10">
                  <h3 id={`tema-desktop-${tema.id}`} className="text-lg font-bold">{tema.nome}</h3>
                  <button type="button" onClick={() => shareComparison(tema)} className="inline-flex items-center gap-2 text-sm font-semibold text-accent-700 hover:underline dark:text-accent-300"><Share2 size={15} aria-hidden="true" /> Compartilhar este tema</button>
                </div>
                <div className="grid overflow-x-auto divide-x divide-slate-200 dark:divide-white/10" style={{ gridTemplateColumns: `repeat(${chapasFiltradas.length}, minmax(16rem, 1fr))` }}>
                  {chapasFiltradas.map(chapa => (
                    <article key={chapa.id} className="min-w-0 p-5">
                      <h4 className="font-bold"><Link to={`/chapa/${chapa.id}`} className="hover:underline">{chapa.partidoPrincipal} <span className="text-sm text-slate-500 dark:text-slate-400">({chapa.numeroUrna})</span></Link></h4>
                      <ProposalContent proposta={propostas.find(item => item.chapaId === chapa.id && item.temaId === tema.id)} chapa={chapa} />
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="space-y-5 md:hidden">
            {temasFiltrados.map(tema => (
              <section key={tema.id} className="card" aria-labelledby={`tema-mobile-${tema.id}`}>
                <div className="flex items-center justify-between gap-3">
                  <h3 id={`tema-mobile-${tema.id}`} className="text-lg font-bold">{tema.nome}</h3>
                  <button type="button" onClick={() => shareComparison(tema)} className="icon-button" aria-label={`Compartilhar comparação sobre ${tema.nome}`}><Share2 size={16} /></button>
                </div>
                <div className="mt-4 space-y-4">
                  {chapasFiltradas.map(chapa => (
                    <article key={chapa.id} className="rounded-2xl border border-slate-200 p-4 dark:border-white/10">
                      <h4 className="font-bold"><Link to={`/chapa/${chapa.id}`} className="hover:underline">{chapa.partidoPrincipal} <span className="text-sm text-slate-500 dark:text-slate-400">({chapa.numeroUrna})</span></Link></h4>
                      <ProposalContent proposta={propostas.find(item => item.chapaId === chapa.id && item.temaId === tema.id)} chapa={chapa} />
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function ProposalContent({proposta, chapa}:{proposta: Proposta|undefined; chapa: Chapa}){
  if(!proposta){
    return (
      <div className="mt-3 rounded-xl bg-slate-100 p-3 text-sm dark:bg-white/5">
        <strong>Não abordado no plano</strong>
        <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">Não encontramos uma proposta identificável sobre este tema no material analisado. Isso não significa oposição à pauta.</p>
      </div>
    )
  }

  return (
    <div className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
      <p>{proposta.resumo}</p>
      <a
        href={`${chapa.linkPlanoGovernoPdf}#page=${proposta.paginaFontePdf}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 font-semibold text-accent-700 underline underline-offset-2 dark:text-accent-300"
        aria-label={`Ver fonte na página ${proposta.paginaFontePdf} do plano de governo de ${chapa.partidoPrincipal} (abre em nova aba)`}
      >
        Ver fonte <ExternalLink size={14} aria-hidden="true" />
      </a>
    </div>
  )
}
