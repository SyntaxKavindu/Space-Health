import { STATUS_LABEL } from './data'
import { PILL } from './theme'
import Chart from './Chart'

export default function MetricCard({ label, display, unit, status, points, normal, due, note, format, range, hideTicks }) {
  const size = String(display).length > 6 ? 'text-lg' : 'text-2xl'

  return (
    <div className="flex min-h-[170px] flex-col rounded-2xl border border-sky-200 bg-white px-4 py-3 shadow-sm shadow-sky-100 xl:min-h-0">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-sky-800">{label}</span>
          {due && <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-semibold text-sky-700">Due</span>}
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${PILL[status]}`}>{STATUS_LABEL[status]}</span>
      </div>

      <div className="mt-1 flex min-h-0 flex-1 gap-3">
        <div className="flex shrink-0 flex-col justify-center">
          <span className={`${size} font-semibold leading-none text-sky-950`}>{display}</span>
          {unit && <span className="mt-1 text-xs text-slate-500">{unit}</span>}
        </div>
        <div className="relative min-h-[70px] min-w-0 flex-1">
          <Chart points={points} normal={normal} unit={unit} format={format} range={range} hideTicks={hideTicks} />
        </div>
      </div>

      <p className="mt-1 truncate text-xs text-slate-500" title={note}>{note}</p>
    </div>
  )
}