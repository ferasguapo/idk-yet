// src/Header.jsx
import { Wrench } from 'lucide-react'

export default function Header() {
  return (
    <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-5 px-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight inline-flex items-center gap-3">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl brand-gradient text-white shadow-lg">
          <Wrench className="w-5 h-5" />
        </span>
        <span><span className="text-brand">o</span>buddy5000</span>
      </h1>
      <span className="text-xs sm:text-sm text-slate-400 italic">made by Feras</span>
    </header>
  )
}
