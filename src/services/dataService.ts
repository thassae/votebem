import type { Tema, Chapa, Perfil, Proposta } from '../types'

const base = '/data'
export async function loadAll(){
  const [temasRes, chapasRes, perfisRes, propostasRes] = await Promise.all([
    fetch(`${base}/temas.json`),
    fetch(`${base}/chapas.json`),
    fetch(`${base}/perfis.json`),
    fetch(`${base}/propostas.json`)
  ])
  if(!temasRes.ok||!chapasRes.ok||!perfisRes.ok||!propostasRes.ok) throw new Error('Falha ao carregar dados')
  const temas: Tema[] = await temasRes.json()
  const chapas: Chapa[] = await chapasRes.json()
  const perfis: Perfil[] = await perfisRes.json()
  const propostas: Proposta[] = await propostasRes.json()
  return {temas,chapas,perfis,propostas}
}
