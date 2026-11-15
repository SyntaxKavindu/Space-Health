import { useEffect, useId, useRef, useState } from 'react'

const num = (v) => (Number.isInteger(v) ? String(v) : v.toFixed(1))
const fullDate = (t) => new Date(t).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
const shortDate = (t) => new Date(t).toLocaleDateString([], { month: 'short', day: 'numeric' })

function smoothPath(p) {
  const n = p.length
  if (n === 1) return `M${p[0].x},${p[0].y}`
  const dx = []
  const m = []
  for (let i = 0; i < n - 1; i++) {
    dx[i] = p[i + 1].x - p[i].x
    m[i] = (p[i + 1].y - p[i].y) / dx[i]
  }
  const s = [m[0]]
  for (let i = 1; i < n - 1; i++) {
    s[i] = m[i - 1] * m[i] <= 0 ? 0 : (2 * m[i - 1] * m[i]) / (m[i - 1] + m[i])
  }
  s[n - 1] = m[n - 2]

  let d = `M${p[0].x},${p[0].y}`
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3
    d += ` C${p[i].x + h},${p[i].y + s[i] * h} ${p[i + 1].x - h},${p[i + 1].y - s[i + 1] * h} ${p[i + 1].x},${p[i + 1].y}`
  }
  return d
}

export default function Chart({ points, normal, unit, format, range, hideTicks }) {
  const box = useRef(null)
  const gradientId = useId().replace(/:/g, '')
  const [size, setSize] = useState({ w: 300, h: 100 })
  const [hover, setHover] = useState(null)

  const pad = { left: hideTicks ? 8 : 34, right: 8, top: 8, bottom: 20 }

  useEffect(() => {
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ w: Math.max(120, width), h: Math.max(60, height) })
    })
    ro.observe(box.current)
    return () => ro.disconnect()
  }, [])

  const { w, h } = size
  const n = points.length
  const values = points.map((p) => p.v)

  let low
  let high
  if (range) {
    ;[low, high] = range
  } else {
    const low0 = Math.min(...values, normal[0])
    const high0 = Math.max(...values, normal[1])
    const margin = (high0 - low0) * 0.12
    low = Math.max(0, low0 - margin)
    high = high0 + margin
  }

  const innerW = w - pad.left - pad.right
  const innerH = h - pad.top - pad.bottom
  const x = (i) => pad.left + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW)
  const y = (v) => pad.top + innerH - ((v - low) / (high - low)) * innerH
  const xy = points.map((p, i) => ({ x: x(i), y: y(p.v) }))

  const ticks = [0, 0.5, 1].map((k) => low + (high - low) * k)
  const tickText = (t) => num(high - low > 20 ? Math.round(t) : Math.round(t * 10) / 10)
  const dateIdx = n ? [...new Set([0, Math.floor((n - 1) / 2), n - 1])] : []

  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const i = n === 1 ? 0 : Math.round(((e.clientX - r.left - pad.left) / innerW) * (n - 1))
    setHover(Math.min(n - 1, Math.max(0, i)))
  }

  const tipText = (p) => p.label ?? (format ? format(p.v) : `${num(p.v)} ${unit}`)

  return (
    <div ref={box} className="absolute inset-0">
      {n === 0 ? (
        <div className="grid h-full place-items-center rounded-xl bg-sky-50 text-xs text-slate-400">No readings yet</div>
      ) : (
        <>
          <svg width={w} height={h} className="block" style={{ touchAction: 'pan-y' }}
            onPointerMove={handleMove} onPointerDown={handleMove} onPointerLeave={() => setHover(null)}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#38bdf8" stopOpacity=".4" />
                <stop offset="1" stopColor="#38bdf8" stopOpacity=".02" />
              </linearGradient>
            </defs>

            <rect x={pad.left} width={innerW} y={y(Math.min(normal[1], high))}
              height={Math.max(0, y(Math.max(normal[0], low)) - y(Math.min(normal[1], high)))}
              fill="#6ee7b7" opacity=".22" />

            {ticks.map((t, k) => (
              <g key={k}>
                <line x1={pad.left} x2={w - pad.right} y1={y(t)} y2={y(t)} className="stroke-sky-100" />
                {!hideTicks && (
                  <text x={pad.left - 6} y={y(t) + 4} textAnchor="end" fontSize="10" className="fill-slate-500">{tickText(t)}</text>
                )}
              </g>
            ))}

            {n > 1 && (
              <path d={`${smoothPath(xy)} L${xy[n - 1].x},${pad.top + innerH} L${xy[0].x},${pad.top + innerH} Z`}
                fill={`url(#${gradientId})`} />
            )}
            <path d={smoothPath(xy)} fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx={xy[n - 1].x} cy={xy[n - 1].y} r="4" fill="#0ea5e9" className="stroke-white" strokeWidth="2" />

            {dateIdx.map((i) => (
              <text key={i} x={xy[i].x} y={h - 5} fontSize="10" className="fill-slate-500"
                textAnchor={n > 1 && i === 0 ? 'start' : n > 1 && i === n - 1 ? 'end' : 'middle'}>
                {shortDate(points[i].t)}
              </text>
            ))}

            {hover != null && (
              <g>
                <line x1={xy[hover].x} x2={xy[hover].x} y1={pad.top} y2={pad.top + innerH} stroke="#0ea5e9" strokeDasharray="3 3" />
                <circle cx={xy[hover].x} cy={xy[hover].y} r="5" className="fill-white" stroke="#0ea5e9" strokeWidth="3" />
              </g>
            )}
          </svg>

          {hover != null && (
            <div className="pointer-events-none absolute z-10 -translate-x-1/2 whitespace-nowrap rounded-lg border border-sky-200 bg-white px-2.5 py-1.5 shadow-lg"
              style={{
                left: Math.min(Math.max(xy[hover].x, 64), w - 64),
                top: xy[hover].y > 56 ? xy[hover].y - 52 : xy[hover].y + 12,
              }}>
              <div className="text-[11px] text-slate-500">{fullDate(points[hover].t)}</div>
              <div className="text-sm font-semibold text-sky-950">{tipText(points[hover])}</div>
            </div>
          )}
        </>
      )}
    </div>
  )
}