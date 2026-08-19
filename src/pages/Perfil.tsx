import React from 'react'
import type { Perfil, Chapa, Tema, Proposta } from '../types'
import { Link } from 'react-router-dom'

export default function Perfil({chapa, presidente, vice, temas, propostas}:{chapa:Chapa; presidente:Perfil|undefined; vice:Perfil|undefined; temas:Tema[]; propostas:Proposta[]}){
  return (
    <div>
      <h2 className="text-xl font-semibold mt-4">Perfil da Chapa</h2>
      <div className="mt-4 card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1 flex flex-row gap-2">
            <img src={presidente?.fotoUrl} alt={presidente?.nomeCompleto} className="w-180 h-auto rounded" />
            <img src={vice?.fotoUrl} alt={vice?.nomeCompleto} className="w-120 h-auto rounded" />
          </div>
          <div className="md:col-span-2">
            <h3 className="font-medium text-lg">{presidente?.nomeCompleto} — Presidente</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">{presidente?.resumoBiografico}</p>
            <h4 className="mt-3 font-medium">Vice: {vice?.nomeCompleto}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">{vice?.resumoBiografico}</p>
            <p className="mt-3">Partido: {chapa.partidoPrincipal} — Nº {chapa.numeroUrna}</p>
            <p className="mt-2 flex gap-3">
              <a href={chapa.linkPlanoGovernoPdf} target="_blank" rel="noopener noreferrer" className="underline">Plano de Governo (PDF)</a>
              <a href={chapa.linkCandidaturaTSE} target="_blank" rel="noopener noreferrer" className="underline">Candidatura no TSE</a>
            </p>
          </div>
        </div>

        <section className="mt-6">
          <h3 className="font-semibold mb-2">Propostas</h3>
          {propostas.length===0 && <p className="text-slate-500">Nenhuma proposta encontrada para esta chapa.</p>}
          <div className="grid gap-3">
            {propostas.map(p=>{
              const tema = temas.find(t=>t.id===p.temaId)
              return (
                <article key={p.id} className="p-3 border rounded bg-white dark:bg-slate-900">
                  <h4 className="font-medium">{tema?.nome}</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{p.resumo}</p>
                  <br />
                  <p className="text-sm text-slate-700 dark:text-slate-300"><i>"{p.compromissoCitado}"</i></p>
                  <p className="text-xs text-slate-500 mt-1">Página {p.paginaFontePdf} do plano de governo</p>
                </article>
              )
            })}
          </div>
        </section>

        <div className="mt-6">
          <Link to="/comparativo" className="underline">Ver tabela comparativa</Link>
        </div>
      </div>
    </div>
  )
}
