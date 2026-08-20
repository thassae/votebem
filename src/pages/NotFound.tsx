import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound(){
  return (
    <section className="mx-auto max-w-2xl py-12 text-center" aria-labelledby="titulo-nao-encontrada">
      <p className="section-kicker">Erro 404</p>
      <h1 id="titulo-nao-encontrada" className="section-title">Esta página não foi encontrada</h1>
      <p className="mt-4 text-slate-500 dark:text-slate-400">
        Sua decisão pode continuar. Volte às chapas ou monte uma comparação com os temas que importam para você.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/chapas" className="button-secondary">Conhecer chapas</Link>
        <Link to="/comparativo" className="button-primary">Montar comparação</Link>
      </div>
    </section>
  )
}
