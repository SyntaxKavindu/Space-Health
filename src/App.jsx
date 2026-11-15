import { useState, useEffect } from 'react'
import { INDICATORS, PARTS, HAZARDS, CONTACT_MESSAGE, STATUS_LABEL, evaluate, worst, moodText } from './data'
import { series, latestValues, dueList, streak, trends, checkin, demoHistory } from './analysis'
import { COLOR, PILL } from './theme'
import BodyFigure from './BodyFigure'
import HealthForm from './HealthForm'
import MetricCard from './MetricCard'

const box = 'rounded-2xl border border-sky-200 bg-white shadow-sm shadow-sky-100'
const needsAttention = (s) => s === 'watch' || s === 'alert'
const metricName = (i) => (i.id === 'sys' || i.id === 'dia' ? 'Blood pressure' : i.short ?? i.label)
const normalText = (i) =>
  i.id === 'mood'
    ? `Normal: ${moodText(i.normal[0])} to ${moodText(i.normal[1])}`
    : `Normal ${i.normal[0]} to ${i.normal[1]} ${i.unit}`

export default function App() {
  const [history, setHistory] = useState(demoHistory)
  const [showForm, setShowForm] = useState(false)
  const [alertsOpen, setAlertsOpen] = useState(false)

  useEffect(() => {
    if (!alertsOpen) return
    const onKey = (e) => e.key === 'Escape' && setAlertsOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [alertsOpen])

  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const by = Object.fromEntries(INDICATORS.map((i) => [i.id, i]))
  const latest = latestValues(history)
  const results = Object.fromEntries(INDICATORS.map((i) => [i.id, evaluate(i, latest[i.id])]))
  const partStatus = Object.fromEntries(
    Object.keys(PARTS).map((p) => [p, worst(INDICATORS.filter((i) => i.part === p).map((i) => results[i.id].status))])
  )
  const overall = worst(Object.values(results).map((r) => r.status))
  const flagged = INDICATORS.filter((i) => needsAttention(results[i.id].status))
  const flaggedNames = [...new Set(flagged.map(metricName))]

  const trendList = trends(history)
  const reviewCount = flaggedNames.length + trendList.length
  const dueIds = dueList(history).map((i) => i.id)
  const days = streak(history)
  const check = checkin(history)

  let headline = 'All logged indicators are normal.'
  if (overall === 'none') headline = 'No readings yet. Open the Health form to log a check-in.'
  else if (flaggedNames.length) headline = `${overall === 'alert' ? 'Alert' : 'Watch'}: ${flaggedNames.join(', ')}`

  const chipTone =
    overall === 'alert' ? 'border-red-300 bg-red-50 text-red-700'
      : reviewCount ? 'border-amber-300 bg-amber-50 text-amber-800'
        : 'border-sky-300 bg-white text-sky-700'

  const valueText = (i) => (i.id === 'mood' ? moodText(latest.mood) : `${latest[i.id]} ${i.unit}`)
  const points = (id) => series(history, id).slice(-30).map((p) => ({ t: p.t, v: p.v }))

  const metric = (id) => {
    const i = by[id]
    const isMood = id === 'mood'
    return (
      <MetricCard label={i.label} status={results[id].status} points={points(id)} normal={i.normal}
        due={dueIds.includes(id)} note={normalText(i)}
        display={latest[id] == null ? '–' : isMood ? moodText(latest[id]) : latest[id]}
        unit={isMood ? '' : i.unit}
        format={isMood ? moodText : undefined} range={isMood ? [0.5, 5.5] : undefined} hideTicks={isMood} />
    )
  }

  const bpStatus = worst([results.sys.status, results.dia.status])
  const bpPoints = series(history, 'sys').slice(-30).map((p) => ({
    t: p.t, v: p.v, label: `${p.e.sys}/${p.e.dia ?? '–'} mmHg`,
  }))

  return (
    <div className="flex min-h-dvh flex-col gap-2 p-2 font-sans xl:h-dvh xl:min-h-[680px]">
      <header className={`${box} relative z-20 flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 xl:h-14 xl:flex-nowrap xl:py-0`}>
        <h1 className="shrink-0 text-lg font-semibold text-sky-950">Crew Health Monitor</h1>

        <div className="order-last flex h-7 min-w-0 basis-full items-center gap-2 xl:order-none xl:flex-1 xl:basis-auto">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: COLOR[overall] }} />
          <span className="min-w-0 truncate text-sm font-medium text-sky-950" title={headline}>{headline}</span>
          {overall === 'alert' && (
            <span className="hidden shrink-0 text-sm font-semibold text-red-700 md:inline">{CONTACT_MESSAGE}</span>
          )}
        </div>

        {alertsOpen && <div className="fixed inset-0 z-10" onClick={() => setAlertsOpen(false)} />}

        <div className="relative z-20 ml-auto flex shrink-0 items-center gap-2">
          <button type="button" onClick={() => setDark(!dark)} aria-pressed={dark}
            aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
            title={dark ? 'Light theme' : 'Dark theme'}
            className="grid h-9 w-9 place-items-center rounded-full border border-sky-300 text-sky-700 hover:bg-sky-50">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {dark ? (
                <>
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </>
              ) : (
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              )}
            </svg>
          </button>
          <button type="button" aria-expanded={alertsOpen} onClick={() => setAlertsOpen(!alertsOpen)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold ${chipTone}`}>
            {reviewCount ? `${reviewCount} to review` : 'All clear'}
          </button>
          <button onClick={() => setShowForm(true)}
            className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-sky-300/60 hover:bg-sky-600">
            Health form
          </button>

          {alertsOpen && (
            <div role="dialog" aria-label="Alerts and guidance"
              className="absolute right-0 top-full z-30 mt-2 max-h-[70vh] w-[min(92vw,440px)] overflow-y-auto rounded-2xl border border-sky-200 bg-white p-4 shadow-2xl">
              <h2 className="text-sm font-semibold text-sky-950">Alerts and guidance</h2>
              {reviewCount === 0 && (
                <p className="mt-2 text-sm text-slate-600">Nothing needs your attention right now.</p>
              )}
              {overall === 'alert' && (
                <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{CONTACT_MESSAGE}</p>
              )}
              <div className="mt-3 space-y-2">
                {flagged.map((i) => (
                  <div key={i.id} className="rounded-xl border border-sky-200 bg-sky-50 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <strong className="text-sm text-sky-950">{i.label}: {valueText(i)}</strong>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${PILL[results[i.id].status]}`}>
                        {STATUS_LABEL[results[i.id].status]}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{i[results[i.id].dir]}</p>
                  </div>
                ))}
                {trendList.map((t) => (
                  <div key={t.id} className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                    <strong className="text-sm text-amber-800">Trend: {t.title}</strong>
                    <p className="mt-1 text-sm text-slate-600">{t.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="grid gap-2 md:grid-cols-2 xl:min-h-0 xl:flex-1 xl:grid-cols-[1fr_clamp(300px,24vw,420px)_1fr] xl:grid-rows-[minmax(0,1fr)]">
        <div className="grid gap-2 xl:min-h-0 xl:grid-rows-4">
          {metric('hr')}
          <MetricCard label="Blood pressure" display={`${latest.sys ?? '–'}/${latest.dia ?? '–'}`} unit="mmHg"
            status={bpStatus} points={bpPoints} normal={by.sys.normal}
            due={dueIds.includes('sys') || dueIds.includes('dia')}
            note="Normal 90 to 129 over 60 to 84 mmHg" />
          {metric('glucose')}
          {metric('temp')}
        </div>

        <div className="order-first flex flex-col gap-2 md:col-span-2 xl:order-none xl:col-span-1 xl:min-h-0">
          <section className={`${box} flex min-h-[420px] flex-1 flex-col p-3 xl:min-h-0`}>
            <div className="flex items-baseline justify-between">
              <h2 className="text-sm font-semibold text-sky-800">Body scan</h2>
              <span className="text-xs text-slate-500">Hover or tap a point</span>
            </div>
            <div className="relative min-h-0 flex-1">
              <BodyFigure status={partStatus} latest={latest} />
            </div>
          </section>

          <section className={`${box} px-4 py-3`}>
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-sky-800">Today's check-in</h2>
              <span className="text-xs text-slate-500">{check.doneCount} of {check.daily.length} required done</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-sky-100">
              <div className="h-1.5 rounded-full bg-sky-500 transition-all"
                style={{ width: `${(check.doneCount / check.daily.length) * 100}%` }} />
            </div>
            <ul className="mt-2 grid grid-cols-2 gap-1.5 md:grid-cols-3 xl:grid-cols-2">
              {check.daily.map((d) => (
                <li key={d.id}
                  className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs ${d.done ? 'bg-emerald-50 text-emerald-800' : 'bg-sky-50 text-sky-900'}`}>
                  <span aria-hidden="true"
                    className={`grid h-4 w-4 shrink-0 place-items-center rounded-full text-[10px] font-bold ${d.done ? 'bg-emerald-500 text-white' : 'border border-sky-300 text-transparent'}`}>
                    ✓
                  </span>
                  {d.label}
                  <span className="sr-only">{d.done ? 'done' : 'not done yet'}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex items-center justify-between gap-2 text-xs text-slate-500">
              <span>
                Weekly: Blood sugar,{' '}
                {check.weekly.done
                  ? `next in ${check.weekly.daysLeft} day${check.weekly.daysLeft === 1 ? '' : 's'}`
                  : 'due now'}
              </span>
              <span className="shrink-0 font-semibold text-sky-800">{days}-day streak</span>
            </div>
          </section>
        </div>

        <div className="grid gap-2 xl:min-h-0 xl:grid-rows-4">
          {metric('sleep')}
          {metric('mood')}
          {metric('exercise')}

          <section className={`${box} flex min-h-[170px] flex-col px-4 py-3 xl:min-h-0 xl:overflow-hidden`}>
            <h2 className="text-sm font-medium text-sky-800">Spaceflight hazards</h2>
            <ul className="mt-1 flex flex-1 flex-col justify-between gap-1">
              {Object.entries(HAZARDS).map(([key, hazard]) => (
                <li key={key} title={hazard.desc} className="flex flex-wrap items-center justify-between gap-x-3 text-xs">
                  <span className="font-medium text-sky-950">{hazard.label}</span>
                  <span className="flex flex-wrap gap-x-2">
                    {INDICATORS.filter((i) => i.hazards.includes(key)).map((i) => (
                      <span key={i.id} title={STATUS_LABEL[results[i.id].status]}
                        className="inline-flex items-center gap-1 text-[11px] text-slate-600">
                        <span className="h-2 w-2 rounded-full" style={{ background: COLOR[results[i.id].status] }} />
                        {metricName(i)}
                      </span>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      {showForm && (
        <HealthForm onClose={() => setShowForm(false)}
          onSave={(entry) => { setHistory((h) => [...h, entry].slice(-120)); setShowForm(false) }} />
      )}
    </div>
  )
}