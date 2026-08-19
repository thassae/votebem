import React from 'react'
import { Link } from 'react-router-dom'
import type { Chapa, Perfil } from '../types'

export default function Home({chapas, perfis}:{chapas: Chapa[]; perfis: Perfil[]}){
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 mt-4">Chapas</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {chapas.map(c => {
          const presidente = perfis.find(perfil => perfil.id === c.presidenteId)
          const vice = perfis.find(perfil => perfil.id === c.viceId)

          return (
            <div key={c.id} className="card">
              <div className="flex items-start gap-3">
                {presidente?.fotoUrl && (
                  <img
                    src={presidente.fotoUrl}
                    alt={`Foto de ${presidente.nomeCompleto}`}
                    className="h-auto w-full max-w-[90px] shrink-0 rounded"
                  />
                )}

                <div className="min-w-0 flex-1">
                  <h3 className="font-medium">{c.partidoPrincipal} — #{c.numeroUrna}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    <strong>PRESIDENTE:</strong> {presidente?.nomeUrna || presidente?.nomeCompleto || 'Não informado'}<br />
                    <strong>VICE-PRESIDENTE:</strong> {vice?.nomeUrna || vice?.nomeCompleto || 'Não informado'}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300"><strong>COLIGAÇÃO:</strong> {c.coligacao.join(', ')}</p>
                  <div className="mt-3 flex gap-2">
                    <Link to={`/chapa/${c.id}`} className="text-sm px-3 py-1 bg-accent-600 text-white rounded dark:bg-accent-500">Ver propostas</Link>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
