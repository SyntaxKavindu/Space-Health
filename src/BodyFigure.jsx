import { useEffect, useRef, useState } from 'react'
import { INDICATORS, PARTS, STATUS_LABEL, moodText } from './data'
import { COLOR, PILL } from './theme'

const VIEW_W = 200
const VIEW_H = 480
const MIRROR = 'translate(200 0) scale(-1 1)'

const SPOTS = [
  { key: 'brain', id: 'brain', x: 100, y: 34 },
  { key: 'body', id: 'body', x: 76, y: 100 },
  { key: 'heart', id: 'heart', x: 113, y: 120 },
  { key: 'metabolism', id: 'metabolism', x: 100, y: 176 },
  { key: 'bones-left', id: 'bones', x: 83, y: 300 },
  { key: 'bones-right', id: 'bones', x: 117, y: 300 },
]

const HALF =
  'M100 8 C88 8 81 17 81 30 C81 40 84 48 88 54 L92 60 C93 63 90 67 90 71 C88 74 76 76 66 80 C58 83 53 88 52 96 C49 110 46 128 44 148 C42 168 40 190 37 212 C35 222 32 232 31 244 C30 252 32 258 36 258 C40 258 42 252 44 246 C46 232 48 220 51 208 C53 190 55 172 57 156 C58 140 60 122 63 108 C65 124 67 146 69 166 C71 186 69 200 67 214 C65 226 63 238 64 250 C62 268 60 286 61 305 C62 322 64 332 66 340 C66 354 64 368 63 382 C63 396 68 410 70 422 C71 428 72 432 72 436 C72 444 68 452 63 457 L63 459 L94 459 C92 452 90 444 90 436 C90 420 89 404 90 390 C91 372 92 356 93 342 C94 322 96 300 98 278 C99 262 100 250 100 240'

const Both = ({ id }) => (
  <>
    <use href={`#${id}`} />
    <use href={`#${id}`} transform={MIRROR} />
  </>
)

function Artwork() {
  return (
    <>
      <defs>
        <linearGradient id="base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#63cbf8" />
          <stop offset="1" stopColor="#2d9fdf" />
        </linearGradient>
        <radialGradient id="floor" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#38bdf8" stopOpacity=".55" />
          <stop offset="1" stopColor="#38bdf8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity=".9" />
        </linearGradient>
        <filter id="b2"><feGaussianBlur stdDeviation="1.6" /></filter>
        <filter id="b4"><feGaussianBlur stdDeviation="3.4" /></filter>
        <filter id="glow" x="-30%" y="-10%" width="160%" height="120%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>

        <path id="half" d={HALF} />
        <clipPath id="sil"><Both id="half" /></clipPath>

        {/* muscle light and soft creases, drawn once for the left side */}
        <g id="lightL" fill="#fff" filter="url(#b4)">
          <ellipse cx="57" cy="99" rx="8" ry="12" opacity=".46" />
          <ellipse cx="79" cy="108" rx="15" ry="10" opacity=".4" />
          <ellipse cx="53" cy="130" rx="4.5" ry="15" opacity=".4" />
          <ellipse cx="46" cy="184" rx="3.5" ry="18" opacity=".34" />
          <ellipse cx="91" cy="150" rx="6.5" ry="6" opacity=".32" />
          <ellipse cx="91" cy="167" rx="6.5" ry="6" opacity=".32" />
          <ellipse cx="90" cy="184" rx="6.5" ry="6" opacity=".3" />
          <ellipse cx="78" cy="288" rx="8" ry="34" opacity=".36" />
          <ellipse cx="80" cy="340" rx="8" ry="7" opacity=".36" />
          <ellipse cx="77" cy="384" rx="5.5" ry="20" opacity=".36" />
          <ellipse cx="85" cy="400" rx="2" ry="16" opacity=".26" />
          <ellipse cx="94" cy="26" rx="7" ry="11" opacity=".45" />
        </g>
        <g id="shadeL" fill="none" stroke="#0a4f84" strokeOpacity=".4" strokeWidth="1.6" strokeLinecap="round" filter="url(#b2)">
          <path d="M68 122 C78 130 92 128 99 122" />
          <path d="M84 143 C90 145 96 145 99 143" />
          <path d="M84 160 C90 162 96 162 99 160" />
          <path d="M84 177 C90 179 96 179 99 177" />
          <path d="M72 150 C74 165 74 180 72 198" />
          <path d="M79 238 C86 244 94 246 100 244" />
          <path d="M70 322 C76 330 86 330 91 322" />
          <path d="M56 152 C56 158 55 162 54 166" />
        </g>
        <path id="lung" d="M96 88 C84 90 73 104 72 124 C72 136 78 142 88 140 C95 138 97 128 97 114Z" />
        <path id="ribs" d="M99 92 C86 94 77 103 75 116 M99 101 C85 103 76 115 75 128 M99 110 C85 113 77 125 78 138 M99 119 C87 123 80 134 81 146" />
        <path id="bones" d="M82 244 L84 334 M84 346 L80 428 M50 100 L47 152 M46 160 L40 214" />
      </defs>

      {/* glowing floor */}
      <ellipse cx="100" cy="460" rx="78" ry="12" fill="url(#floor)" />
      <ellipse cx="100" cy="460" rx="70" ry="9.5" fill="none" stroke="#38bdf8" strokeOpacity=".6" />
      <ellipse cx="100" cy="460" rx="48" ry="6.5" fill="none" stroke="#38bdf8" strokeOpacity=".4" strokeWidth=".8" />

      {/* skin */}
      <g filter="url(#glow)" fill="url(#base)"><Both id="half" /></g>

      <g clipPath="url(#sil)">
        {/* dark edges make every limb look round */}
        <g fill="none" stroke="#0a4f84" strokeWidth="7" strokeOpacity=".6" filter="url(#b2)"><Both id="half" /></g>
        <Both id="lightL" />
        <Both id="shadeL" />
        <path d="M100 86 V240" stroke="#0a4f84" strokeOpacity=".25" strokeWidth="1.2" filter="url(#b2)" />
      </g>

      {/* rim light */}
      <g fill="none" stroke="#e6f8ff" strokeOpacity=".6" strokeWidth=".7" strokeLinejoin="round"><Both id="half" /></g>

      {/* moving scan line */}
      <g clipPath="url(#sil)">
        <g className="scan">
          <rect width="200" height="50" fill="url(#scanGrad)" />
          <rect y="48" width="200" height="2" fill="#fff" />
        </g>
      </g>
    </>
  )
}

export default function BodyFigure({ status, latest }) {
  const wrap = useRef(null)
  const [box, setBox] = useState({ w: 300, h: 420 })
  const [hover, setHover] = useState(null)
  const [pinned, setPinned] = useState(null)

  useEffect(() => {
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setBox({ w: width, h: height })
    })
    ro.observe(wrap.current)
    return () => ro.disconnect()
  }, [])

  const scale = Math.min(box.w / VIEW_W, box.h / VIEW_H)
  const figW = VIEW_W * scale
  const figH = VIEW_H * scale
  const offX = (box.w - figW) / 2
  const offY = (box.h - figH) / 2

  const active = SPOTS.find((s) => s.key === (hover ?? pinned))
  const part = active && PARTS[active.id]

  let tipStyle = {}
  if (active) {
    const tipW = Math.min(224, box.w - 16)
    const sx = offX + active.x * scale
    const sy = offY + active.y * scale
    tipStyle = {
      width: tipW,
      left: Math.min(Math.max(sx, tipW / 2 + 8), box.w - tipW / 2 - 8),
      ...(sy > box.h / 2 ? { bottom: box.h - sy + 14 } : { top: sy + 14 }),
    }
  }

  const readings = active
    ? INDICATORS.filter((i) => i.part === active.id && i.id !== 'dia').map((i) => {
        if (i.id === 'mood') return latest.mood == null ? 'Mood: not logged' : `Mood: ${moodText(latest.mood)}`
        const name = i.short ?? i.label
        if (i.id === 'sys') {
          return latest.sys == null ? `${name}: not logged` : `${name}: ${latest.sys}/${latest.dia ?? '–'} ${i.unit}`
        }
        return latest[i.id] == null ? `${name}: not logged` : `${name}: ${latest[i.id]} ${i.unit}`
      })
    : []

  const togglePin = (key) => setPinned(pinned === key ? null : key)

  return (
    <div ref={wrap} className="absolute inset-0" onClick={() => setPinned(null)}>
      <svg width={figW} height={figH} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="absolute" style={{ left: offX, top: offY }}
        role="group" aria-label="Human body. Hover or select a glowing point.">
        <Artwork />

        {SPOTS.map((s) => {
          const color = COLOR[status[s.id]]
          const on = active?.key === s.key
          return (
            <g key={s.key} role="button" tabIndex={0} aria-label={PARTS[s.id].name} className="cursor-pointer"
              onMouseEnter={() => setHover(s.key)} onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(s.key)} onBlur={() => setHover(null)}
              onClick={(e) => { e.stopPropagation(); togglePin(s.key) }}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && togglePin(s.key)}>
              <circle cx={s.x} cy={s.y} r="16" fill="transparent" />
              <circle cx={s.x} cy={s.y} r="8" fill={color}>
                <animate attributeName="r" values="7;16;7" dur="2.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0;0.5" dur="2.2s" repeatCount="indefinite" />
              </circle>
              <circle cx={s.x} cy={s.y} r={on ? 8 : 5.5} fill={color} stroke="#fff" strokeWidth={on ? 3 : 2} />
            </g>
          )
        })}
      </svg>

      {active && (
        <div role="tooltip" className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-xl border border-sky-200 bg-white p-3 shadow-xl"
          style={tipStyle}>
          <div className="flex items-center justify-between gap-2">
            <strong className="text-sm text-sky-950">{part.name}</strong>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${PILL[status[active.id]]}`}>
              {STATUS_LABEL[status[active.id]]}
            </span>
          </div>
          <p className="mt-1.5 text-xs text-slate-700">{part.fn}</p>
          <p className="mt-1 text-xs text-slate-500">{part.risk}</p>
          {readings.map((line) => (
            <p key={line} className="mt-1 text-xs font-medium text-sky-900">{line}</p>
          ))}
        </div>
      )}
    </div>
  )
}