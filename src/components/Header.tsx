import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Sun, Moon, Menu, X } from 'lucide-react'

export default function Header(): JSX.Element{
  const [dark, setDark] = useState<boolean>(()=>{
    try{ return localStorage.getItem('vb-theme')==='dark' }catch(e){return false}
  })
  const [open, setOpen] = useState(false)

  useEffect(()=>{
    const root = document.documentElement
    if(dark) root.classList.add('dark')
    else root.classList.remove('dark')
    try{ localStorage.setItem('vb-theme', dark?'dark':'light') }catch(e){}
  },[dark])

  const navLinkClass = (isActive:boolean) => `nav-link ${isActive ? 'nav-link-active' : ''}`

  return (
    <header className="site-header">
      <div className="page-container flex h-[72px] items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button className="icon-button md:hidden" onClick={()=>setOpen(o=>!o)} aria-label={open ? 'Fechar menu' : 'Abrir menu'}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
          <Link to="/" className="brand" aria-label="VoteBem — página inicial">
            <span className="font-extrabold">Vote</span><span className="font-medium">Bem</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-2">
          <NavLink to="/" className={({isActive})=>navLinkClass(isActive)}>Chapas</NavLink>
          <NavLink to="/comparativo" className={({isActive})=>navLinkClass(isActive)}>Comparativo</NavLink>
        </nav>

        <div className="flex items-center gap-3">          
          <button onClick={()=>setDark(d=>!d)} aria-label={dark ? 'Ativar tema claro' : 'Ativar tema escuro'} className="icon-button">
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="page-container pb-4 md:hidden">
          <nav className="mobile-drawer flex flex-col gap-2 rounded-2xl border p-3 shadow-soft">
            <NavLink to="/" onClick={()=>setOpen(false)} className={({isActive})=>navLinkClass(isActive)}>Chapas</NavLink>
            <NavLink to="/comparativo" onClick={()=>setOpen(false)} className={({isActive})=>navLinkClass(isActive)}>Comparativo</NavLink>
            <button onClick={()=>{ setDark(d=>!d); setOpen(false) }} className="button-primary mt-2 justify-center">{dark ? <Sun size={16}/> : <Moon size={16}/> } <span>Alternar tema</span></button>
          </nav>
        </div>
      )}
    </header>
  )
}
