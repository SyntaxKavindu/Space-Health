import { useState, useEffect } from 'react'

export default function Instructions({ indicator, onClose }) {
  const slides = [
    ...indicator.steps.map((text, n) => ({ title: `Step ${n + 1}`, text })),
    { title: 'Why it matters in space', text: indicator.why },
  ]
  const [n, setN] = useState(0)
  const last = n === slides.length - 1

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setN((x) => Math.min(x + 1, slides.length - 1))
      if (e.key === 'ArrowLeft') setN((x) => Math.max(x - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, slides.length])

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-sky-950/60 p-4" onClick={onClose}>
      <div
        role="dialog" aria-label={`How to measure ${indicator.label}`}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl border-2 border-sky-300 bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-sky-600">How to measure</p>
            <h3 className="text-xl font-semibold text-sky-950">{indicator.label}</h3>
          </div>
          <button type="button" aria-label="Close" onClick={onClose}
            className="rounded-full px-2.5 py-1 text-slate-500 hover:bg-sky-100 hover:text-sky-900">✕</button>
        </div>

        <div className="mt-5 flex gap-1.5">
          {slides.map((_, i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= n ? 'bg-sky-500' : 'bg-sky-100'}`} />
          ))}
        </div>

        <div className="mt-6 min-h-32">
          <p className="text-sm text-slate-500">{n + 1} of {slides.length}</p>
          <h4 className="mt-1 text-lg font-semibold text-sky-600">{slides[n].title}</h4>
          <p className="mt-2 text-lg leading-snug text-slate-800">{slides[n].text}</p>
        </div>

        <div className="mt-4 flex justify-between gap-3">
          <button type="button" disabled={n === 0} onClick={() => setN(n - 1)}
            className="rounded-full border border-sky-300 px-5 py-2 text-sm font-medium text-sky-700 hover:bg-sky-50 disabled:opacity-40">
            Previous
          </button>
          <button type="button" onClick={() => (last ? onClose() : setN(n + 1))}
            className="rounded-full bg-sky-500 px-6 py-2 text-sm font-semibold text-white hover:bg-sky-600">
            {last ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}