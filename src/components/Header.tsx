import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Sun, Moon, Menu, X, Search } from 'lucide-react'

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

  const navLinkClass = (isActive:boolean) => `px-3 py-2 rounded ${isActive? 'text-accent-600 bg-accent-50 dark:bg-accent-800':''}`

  return (
    <header className="bg-white dark:bg-slate-900 border-b dark:border-slate-800">
      <div className="container flex items-center justify-between gap-4 py-3">
        <div className="flex items-center gap-4">
          <button className="md:hidden p-2 rounded border dark:border-slate-700" onClick={()=>setOpen(o=>!o)} aria-label="Toggle menu">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
          <Link to="/" className="flex items-baseline gap-3 no-underline">
            <div className="text-accent-600 font-bold text-xl" style={{fontFamily:'Roboto Condensed'}}>VoteBem</div>
            <span className="text-sm text-slate-500 dark:text-slate-400">Comparador 2026</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-2">
          <NavLink to="/" className={({isActive})=>navLinkClass(isActive)}>Chapas</NavLink>
          <NavLink to="/comparativo" className={({isActive})=>navLinkClass(isActive)}>Comparativo</NavLink>
        </nav>

        <div className="flex items-center gap-3">          
          <button onClick={()=>setDark(d=>!d)} aria-label="Toggle theme" className="p-2 rounded border dark:border-slate-700 bg-accent-600 text-white hover:bg-accent-500">
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-4 pb-4">
          <nav className="flex flex-col gap-2 bg-white dark:bg-slate-900 p-3 rounded shadow-sm border dark:border-slate-700">
            <NavLink to="/" onClick={()=>setOpen(false)} className={({isActive})=>navLinkClass(isActive)}>Chapas</NavLink>
            <NavLink to="/comparativo" onClick={()=>setOpen(false)} className={({isActive})=>navLinkClass(isActive)}>Comparativo</NavLink>
            <button onClick={()=>{ setDark(d=>!d); setOpen(false) }} className="mt-2 flex items-center gap-2 px-3 py-2 bg-accent-600 text-white rounded">{dark ? <Sun size={16}/> : <Moon size={16}/> } <span className="ml-2">Alternar tema</span></button>
          </nav>
        </div>
      )}
    </header>
  )
}
