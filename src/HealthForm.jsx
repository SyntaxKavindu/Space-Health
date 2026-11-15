import { useState, useEffect } from 'react'
import { INDICATORS, MOOD_LABELS } from './data'
import Instructions from './Instructions'

const BLOCKED = ['-', '+', 'e', 'E']
const field = 'min-w-0 flex-1 rounded-xl border border-sky-300 bg-white px-3 py-2 text-sm text-sky-950 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200'

export default function HealthForm({ onSave, onClose }) {
  const [draft, setDraft] = useState(() => Object.fromEntries(INDICATORS.map((i) => [i.id, ''])))
  const [errors, setErrors] = useState({})
  const [guide, setGuide] = useState(null)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && !guide && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [guide, onClose])

  function submit(e) {
    e.preventDefault()
    const errs = {}
    const entry = { t: Date.now() }
    INDICATORS.forEach((i) => {
      const v = draft[i.id]
      if (v === '') return
      const n = Number(v)
      if (Number.isNaN(n) || n < i.min || n > i.max) errs[i.id] = `Enter a value from ${i.min} to ${i.max} ${i.unit}.`
      else entry[i.id] = n
    })
    if (Object.keys(errs).length === 0 && Object.keys(entry).length === 1) errs.form = 'Enter at least one measurement.'
    setErrors(errs)
    if (Object.keys(errs).length === 0) onSave(entry)
  }

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-sky-950/60 p-3 backdrop-blur-sm" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Health form"
        className="max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-3xl border-2 border-sky-200 bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-sky-950">Health form</h2>
            <p className="mt-0.5 text-xs text-slate-500">Enter the measurements you took now. Leave a field empty to skip it.</p>
          </div>
          <button type="button" aria-label="Close" onClick={onClose}
            className="rounded-full px-2.5 py-1 text-slate-500 hover:bg-sky-100 hover:text-sky-900">✕</button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {INDICATORS.map((i) => (
            <div key={i.id} className="rounded-2xl border border-sky-200 bg-sky-50 p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <label htmlFor={i.id} className="text-[13px] font-medium leading-tight text-sky-900">{i.label}</label>
                  <p className="text-[11px] text-slate-500">{i.every === 1 ? 'Required daily' : 'Weekly'}</p>
                </div>
                <button type="button" onClick={() => setGuide(i)}
                  className="shrink-0 rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-semibold text-sky-700 hover:bg-sky-200">Instructions</button>
              </div>
              <div className="mt-2 flex items-center gap-2">
                {i.id === 'mood' ? (
                  <select id={i.id} value={draft.mood} className={field}
                    onChange={(e) => setDraft({ ...draft, mood: e.target.value })}>
                    <option value="">Select mood</option>
                    {Object.entries(MOOD_LABELS).map(([value, text]) => (
                      <option key={value} value={value}>{text}</option>
                    ))}
                  </select>
                ) : (
                  <>
                    <input id={i.id} type="number" inputMode="decimal" min={i.min} max={i.max} step={i.step ?? 1}
                      value={draft[i.id]} className={field}
                      onKeyDown={(e) => BLOCKED.includes(e.key) && e.preventDefault()}
                      onChange={(e) => !e.target.value.includes('-') && setDraft({ ...draft, [i.id]: e.target.value })} />
                    <span className="shrink-0 text-xs text-slate-500">{i.unit}</span>
                  </>
                )}
              </div>
              {errors[i.id] && <p className="mt-1.5 text-xs text-red-600">{errors[i.id]}</p>}
            </div>
          ))}
        </div>

        {errors.form && <p className="mt-3 text-sm text-red-600">{errors.form}</p>}
        <div className="mt-5 flex justify-end gap-3">
          <button type="button" onClick={onClose}
            className="rounded-full border border-sky-300 px-5 py-2 text-sm font-medium text-sky-700 hover:bg-sky-50">Cancel</button>
          <button type="submit" className="rounded-full bg-sky-500 px-6 py-2 text-sm font-semibold text-white hover:bg-sky-600">Save readings</button>
        </div>
      </form>
      {guide && <Instructions indicator={guide} onClose={() => setGuide(null)} />}
    </div>
  )
}