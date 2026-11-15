import { INDICATORS } from './data'

export const series = (history, id) =>
  history.filter((h) => h[id] != null).map((h) => ({ t: h.t, v: h[id], e: h }))

export function latestValues(history) {
  const out = {}
  INDICATORS.forEach((i) => {
    const s = series(history, i.id)
    out[i.id] = s.length ? s[s.length - 1].v : null
  })
  return out
}

const dayNum = (t) => Math.floor((t - new Date(t).getTimezoneOffset() * 60000) / 86400000)
const avg = (a) => a.reduce((s, x) => s + x, 0) / a.length

export function dueList(history, now = Date.now()) {
  return INDICATORS.filter((i) => {
    const s = series(history, i.id)
    return !s.length || dayNum(now) - dayNum(s[s.length - 1].t) >= i.every
  })
}

export function streak(history, now = Date.now()) {
  const days = new Set(history.map((h) => dayNum(h.t)))
  let d = dayNum(now)
  let n = 0
  if (!days.has(d)) d -= 1
  while (days.has(d)) { n++; d-- }
  return n
}

export function trends(history) {
  const out = []
  const sleep = series(history, 'sleep').slice(-3)
  if (sleep.length === 3 && sleep.every((p) => p.v < 6.5)) {
    out.push({ id: 'sleep-run', title: 'Short sleep for 3 check-ins', text: 'Several short nights in a row hurt judgment and mood. Plan a recovery night, and tell the flight surgeon if it continues.' })
  }
  INDICATORS.forEach((i) => {
    if (i.id === 'sleep' && out.length) return
    const s = series(history, i.id)
    if (s.length < 8) return
    const base = avg(s.slice(0, 5).map((p) => p.v))
    const recent = avg(s.slice(-3).map((p) => p.v))
    const pct = ((recent - base) / base) * 100
    if (base > 0 && Math.abs(pct) > i.drift) {
      out.push({
        id: i.id,
        title: `${i.short ?? i.label} drifted from your baseline`,
        text: `Your recent average is ${recent.toFixed(1)} ${i.unit}, ${Math.abs(pct).toFixed(0)}% ${pct > 0 ? 'above' : 'below'} your early baseline of ${base.toFixed(1)} ${i.unit}.`,
      })
    }
  })
  return out
}

const rand = (min, max) => min + Math.random() * (max - min)
const clamp = (v, min, max) => Math.min(max, Math.max(min, v))
const pick = (list) => list[Math.floor(Math.random() * list.length)]

export function demoHistory() {
  const story = pick(['steady', 'strain', 'fever'])
  const base = {
    hr: rand(60, 76), sys: rand(108, 122), dia: rand(68, 79), temp: rand(36.4, 36.9),
    sleep: rand(7, 8), mood: rand(3.8, 4.6), exercise: rand(80, 125), glucose: rand(86, 112),
  }
  const now = Date.now()
  const out = []

  for (let d = 20; d >= 0; d--) {
    const ramp = clamp((6 - d) / 6, 0, 1)
    const strain = story === 'strain' ? ramp : 0
    const fever = story === 'fever' ? ramp : 0

    const entry = {
      t: now - d * 86400000,
      hr: Math.round(base.hr + rand(-4, 4) + strain * 14 + fever * 18),
      sys: Math.round(base.sys + rand(-5, 5) + strain * 16),
      dia: Math.round(base.dia + rand(-3, 3) + strain * 8),
      temp: +(base.temp + rand(-0.2, 0.2) + fever * rand(1.2, 1.6)).toFixed(1),
      sleep: Math.round((base.sleep + rand(-0.6, 0.6) - strain * 2.4 - fever * 1.2) * 2) / 2,
      mood: Math.round(base.mood + rand(-0.6, 0.6) - strain * 2 - fever),
      exercise: Math.round((base.exercise + rand(-25, 25) - strain * 50 - fever * 55) / 5) * 5,
    }
    if (d % 7 === 0) entry.glucose = Math.round(base.glucose + rand(-8, 8) + strain * 30)

    INDICATORS.forEach((i) => {
      if (entry[i.id] != null) entry[i.id] = clamp(entry[i.id], i.min, i.max)
    })
    if (d === 0) {
      ;['exercise', 'mood', 'glucose'].forEach((id) => {
        if (Math.random() < 0.4) delete entry[id]
      })
    }
    out.push(entry)
  }
  return out
}

export const DAILY = [
  { id: 'hr', label: 'Heart rate', needs: ['hr'] },
  { id: 'bp', label: 'Blood pressure', needs: ['sys', 'dia'] },
  { id: 'temp', label: 'Temperature', needs: ['temp'] },
  { id: 'sleep', label: 'Sleep', needs: ['sleep'] },
  { id: 'mood', label: 'Mood', needs: ['mood'] },
  { id: 'exercise', label: 'Exercise', needs: ['exercise'] },
]

export function checkin(history, now = Date.now()) {
  const today = dayNum(now)
  const loggedWithin = (id, days) => series(history, id).some((p) => today - dayNum(p.t) < days)

  const daily = DAILY.map((d) => ({ ...d, done: d.needs.every((id) => loggedWithin(id, 1)) }))

  const sugar = series(history, 'glucose')
  const since = sugar.length ? today - dayNum(sugar[sugar.length - 1].t) : null
  const weekly = { done: since !== null && since < 7, daysLeft: since === null ? 0 : Math.max(0, 7 - since) }

  return { daily, weekly, doneCount: daily.filter((d) => d.done).length }
}