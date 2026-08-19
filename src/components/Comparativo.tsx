import React from 'react'
import type { Tema, Chapa, Proposta } from '../types'

export default function Comparativo({temas, chapas, propostas}:{temas: Tema[]; chapas: Chapa[]; propostas: Proposta[]}){
  return (
    <div className="overflow-auto shadow-sm border rounded">
      <table className="min-w-full w-full table-fixed border-collapse">
        <thead className="bg-accent-600 text-white sticky top-0 dark:bg-accent-700">
          <tr>
            <th className="p-3 border w-56 text-left">Tema</th>
            {chapas.map(c=> <th key={c.id} className="p-3 border text-left">{c.partidoPrincipal} <span className="text-sm text-accent-100">({c.numeroUrna})</span></th>)}
          </tr>
        </thead>
        <tbody>
          {temas.map(t=> (
            <tr key={t.id} className="align-top even:bg-slate-50 dark:even:bg-slate-900">
              <th className="p-3 border align-top text-left align-top w-56">{t.nome}</th>
              {chapas.map(c=>{
                const p = propostas.find(x=>x.chapaId===c.id && x.temaId===t.id)
                return (<td key={`${t.id}-${c.id}`} className="p-3 border align-top">{p? p.resumo : <em className="text-slate-500">Não abordado no plano</em>}</td>)
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
