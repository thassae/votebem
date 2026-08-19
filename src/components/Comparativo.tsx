import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { Tema, Chapa, Proposta } from '../types'

export default function Comparativo({temas, chapas, propostas}:{temas: Tema[]; chapas: Chapa[]; propostas: Proposta[]}){
  const [temasSelecionados, setTemasSelecionados] = useState<string[]>([])
  const [chapasSelecionadas, setChapasSelecionadas] = useState<string[]>([])
  const topScrollRef = useRef<HTMLDivElement>(null)
  const tableScrollRef = useRef<HTMLDivElement>(null)
  const topScrollContentRef = useRef<HTMLDivElement>(null)

  const temasFiltrados = useMemo(
    () => temasSelecionados.length > 0
      ? temas.filter(tema => temasSelecionados.includes(tema.id))
      : temas,
    [temasSelecionados, temas]
  )
  const chapasOrdenadas = useMemo(
    () => [...chapas].sort((chapaA, chapaB) =>
      chapaA.partidoPrincipal.localeCompare(chapaB.partidoPrincipal, 'pt-BR')
      || chapaA.numeroUrna - chapaB.numeroUrna
    ),
    [chapas]
  )
  const chapasFiltradas = useMemo(
    () => chapasSelecionadas.length > 0
      ? chapasOrdenadas.filter(chapa => chapasSelecionadas.includes(chapa.id))
      : chapasOrdenadas,
    [chapasSelecionadas, chapasOrdenadas]
  )

  useEffect(() => {
    const tableScroll = tableScrollRef.current
    const topScrollContent = topScrollContentRef.current
    if (!tableScroll || !topScrollContent) return

    const updateScrollWidth = () => {
      topScrollContent.style.width = `${tableScroll.scrollWidth}px`
    }

    tableScroll.scrollLeft = 0
    if (topScrollRef.current) topScrollRef.current.scrollLeft = 0
    updateScrollWidth()
    const resizeObserver = new ResizeObserver(updateScrollWidth)
    resizeObserver.observe(tableScroll)
    const table = tableScroll.querySelector('table')
    if (table) resizeObserver.observe(table)

    return () => resizeObserver.disconnect()
  }, [chapasFiltradas, temasFiltrados])

  const syncScroll = (source: 'top' | 'table') => {
    const topScroll = topScrollRef.current
    const tableScroll = tableScrollRef.current
    if (!topScroll || !tableScroll) return

    if (source === 'top') tableScroll.scrollLeft = topScroll.scrollLeft
    else topScroll.scrollLeft = tableScroll.scrollLeft
  }

  const temFiltrosAtivos = temasSelecionados.length > 0 || chapasSelecionadas.length > 0

  return (
    <section aria-label="Comparação de propostas">
      <div className="mb-8">
        <p className="section-kicker">Lado a lado</p>
        <h1 className="section-title">Compare as propostas</h1>
        <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-400">Selecione temas e chapas para encontrar diferenças com mais clareza.</p>
      </div>
      <div className="filter-panel mb-6 flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex-1">
          <label htmlFor="filtro-tema" className="mb-1 block text-sm font-semibold">Filtrar por tema</label>
          <select
            id="filtro-tema"
            multiple
            size={5}
            value={temasSelecionados.length > 0 ? temasSelecionados : ['']}
            onChange={event => setTemasSelecionados(
              Array.from(event.target.selectedOptions, option => option.value).filter(Boolean)
            )}
            aria-describedby="ajuda-filtro-tema"
            className="form-select"
          >
            <option value="">Todos os temas</option>
            {temas.map(tema => <option key={tema.id} value={tema.id}>{tema.nome}</option>)}
          </select>
          <p id="ajuda-filtro-tema" className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Selecione um ou mais temas. Use Ctrl ou Command para alterar itens individualmente.
          </p>
        </div>

        <div className="flex-1">
          <label htmlFor="filtro-chapa" className="mb-1 block text-sm font-semibold">Filtrar por chapa</label>
          <select
            id="filtro-chapa"
            multiple
            size={5}
            value={chapasSelecionadas.length > 0 ? chapasSelecionadas : ['']}
            onChange={event => setChapasSelecionadas(
              Array.from(event.target.selectedOptions, option => option.value).filter(Boolean)
            )}
            aria-describedby="ajuda-filtro-chapa"
            className="form-select"
          >
            <option value="">Todas as chapas</option>
            {chapasOrdenadas.map(chapa => (
              <option key={chapa.id} value={chapa.id}>{chapa.partidoPrincipal} ({chapa.numeroUrna})</option>
            ))}
          </select>
          <p id="ajuda-filtro-chapa" className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Selecione uma ou mais chapas. Use Ctrl ou Command para alterar itens individualmente.
          </p>
        </div>

        {temFiltrosAtivos && (
          <button
            type="button"
            onClick={() => { setTemasSelecionados([]); setChapasSelecionadas([]) }}
            className="button-secondary justify-center sm:mt-6"
          >
            Limpar filtros
          </button>
        )}
      </div>

      <div className="table-shell viewport-wide">
        <div
          ref={topScrollRef}
          onScroll={() => syncScroll('top')}
          className="h-4 overflow-x-auto overflow-y-hidden bg-slate-100 dark:bg-white/5"
          aria-label="Rolagem horizontal da tabela"
          role="region"
          tabIndex={0}
        >
          <div ref={topScrollContentRef} className="h-px" />
        </div>

        <div ref={tableScrollRef} onScroll={() => syncScroll('table')} className="overflow-x-auto">
          <table
            className="min-w-full table-fixed border-collapse"
            style={{ width: `${180 + (chapasFiltradas.length * 288)}px` }}
          >
            <thead className="sticky top-0 z-20 bg-accent-700 text-white dark:bg-accent-800">
              <tr>
                <th className="sticky left-0 z-30 w-[180px] min-w-[180px] break-all border border-accent-600 bg-accent-700 p-4 text-left dark:border-accent-700 dark:bg-accent-800">Tema</th>
                {chapasFiltradas.map(chapa => (
                  <th key={chapa.id} className="min-w-72 border border-accent-600 p-4 text-left dark:border-accent-700">
                    <a href={`/chapa/${chapa.id}`}>{chapa.partidoPrincipal} <span className="text-sm text-accent-100">({chapa.numeroUrna})</span></a>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {temasFiltrados.map(tema => (
                <tr key={tema.id} className="group align-top even:bg-slate-50 dark:even:bg-slate-900">
                  <th className="sticky left-0 z-10 w-[180px] min-w-[180px] break-word border bg-white p-3 text-left align-top group-even:bg-slate-50 dark:bg-slate-900 dark:group-even:bg-slate-900">
                    {tema.nome}
                  </th>
                  {chapasFiltradas.map(chapa => {
                    const proposta = propostas.find(item => item.chapaId === chapa.id && item.temaId === tema.id)
                    return (
                      <td key={`${tema.id}-${chapa.id}`} className="min-w-72 break-words border p-3 align-top">
                        {proposta ? proposta.resumo : <em className="text-slate-500">Não abordado no plano</em>}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
