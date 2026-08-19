import React from 'react'
import { Link } from 'react-router-dom'
import type { Chapa, Perfil } from '../types'

export default function Home({chapas, perfis}:{chapas: Chapa[]; perfis: Perfil[]}){
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 mt-4">Chapas</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {chapas.map(c=> (
          <div key={c.id} className="card">
            <h3 className="font-medium">{c.partidoPrincipal} — #{c.numeroUrna}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <strong>PRESIDENTE:</strong> {perfis.find(p=>p.id===c.presidenteId)?.nomeUrna || perfis.find(p=>p.id===c.presidenteId)?.nomeCompleto || 'Não informado'}<br />
              <strong>VICE-PRESIDENTE:</strong> {perfis.find(p=>p.id===c.viceId)?.nomeUrna || perfis.find(p=>p.id===c.viceId)?.nomeCompleto || 'Não informado'}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300"><strong>COLIGAÇÃO:</strong> {c.coligacao.join(', ')}</p>
            <div className="mt-3 flex gap-2">
              <Link to={`/chapa/${c.id}`} className="text-sm px-3 py-1 bg-accent-600 text-white rounded dark:bg-accent-500">Ver propostas</Link>              
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
