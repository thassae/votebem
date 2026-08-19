import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Comparativo from './components/Comparativo'
import Home from './components/Home'
import Perfil from './pages/Perfil'
import { loadAll } from './services/dataService'
import type { Tema, Chapa, Perfil as PerfilT, Proposta } from './types'

export default function App(){
  const [temas, setTemas] = useState<Tema[]>([])
  const [chapas, setChapas] = useState<Chapa[]>([])
  const [perfis, setPerfis] = useState<PerfilT[]>([])
  const [propostas, setPropostas] = useState<Proposta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string|undefined>()

  useEffect(()=>{
    loadAll().then(d=>{
      setTemas(d.temas.sort((a,b)=>a.ordem-b.ordem))
      setChapas(d.chapas)
      setPerfis(d.perfis)
      setPropostas(d.propostas)
      setLoading(false)
    }).catch(e=>{ setError(String(e)); setLoading(false) })
  },[])

  return (
    <BrowserRouter>
      <div className="app-shell flex min-h-screen flex-col">
        <Header />
        <div className="page-container flex-1 py-8 sm:py-12">
          {loading && <p className="status-message">Carregando dados…</p>}
          {error && <p className="status-message text-red-600">Erro: {error}</p>}
          {!loading && !error && (
            <Routes>
              <Route path="/" element={<Home chapas={chapas} perfis={perfis} />} />
              <Route path="/comparativo" element={<Comparativo temas={temas} chapas={chapas} propostas={propostas} />} />
              <Route path="/chapa/:id" element={<PerfilWrapper chapas={chapas} perfis={perfis} temas={temas} propostas={propostas} />} />
            </Routes>
          )}
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

function PerfilWrapper({chapas, perfis, temas, propostas}:{chapas:Chapa[]; perfis:PerfilT[]; temas:Tema[]; propostas:Proposta[]}){
  const { id } = useParams<{id:string}>()
  const chapa = chapas.find(c=>c.id===id)
  if(!chapa) return <Navigate to="/" replace />
  const presidente = perfis.find(p=>p.id===chapa?.presidenteId)
  const vice = perfis.find(p=>p.id===chapa?.viceId)
  const propostasDaChapa = propostas.filter(p=>p.chapaId===chapa?.id)
  return <Perfil chapa={chapa} presidente={presidente} vice={vice} temas={temas} propostas={propostasDaChapa} />
}
