import {
  layoutWithLines,
  prepareWithSegments,
  type LayoutLine,
  type PreparedTextWithSegments,
} from '@chenglou/pretext'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

/** Match Pretext `font` string with DOM (avoid generic `system-ui` per Pretext docs). */
const CODE_FONT_FAMILY =
  '"JetBrains Mono", "Cascadia Code", Menlo, Monaco, Consolas, monospace'
const CODE_FONT = `13px 400 ${CODE_FONT_FAMILY}`

const LINE_HEIGHT_PX = 22
const MAX_LINES = 20
const H_PADDING = 48

const CODE_SNIPPETS: readonly string[] = [
  'const debounce = <T extends unknown[]>(fn: (...a: T) => void, ms: number) => {',
  '  let id: ReturnType<typeof setTimeout> | undefined;',
  '  return (...args: T) => { clearTimeout(id); id = setTimeout(() => fn(...args), ms); };',
  '};',
  "export async function getUser(id: string) {",
  "  const res = await fetch(`/api/users/${id}`);",
  '  if (!res.ok) throw new Error(await res.text());',
  '  return res.json() as Promise<{ id: string; streak: number }>;',
  '}',
  'type Topic = { slug: string; lang: "js" | "py"; difficulty: 1 | 2 | 3 };',
  'const scores = topics.map(t => ({ ...t, score: weights[t.difficulty] ?? 0 }));',
  'const total = scores.reduce((acc, x) => acc + x.score, 0);',
  'function pickNext(seed: number) { return (seed * 9301 + 49297) % 233280; }',
  "const memo = new Map<string, Promise<string>>();",
  'function runCase(input: unknown) { return JSON.stringify(input, null, 0); }',
  '// TODO: stream hints from model + validate against sandbox',
  'export default { debounce, getUser, pickNext };',
]

function buildPrepared(): PreparedTextWithSegments {
  return prepareWithSegments(CODE_SNIPPETS.join('\n'), CODE_FONT, {
    whiteSpace: 'pre-wrap',
  })
}

export function CodeBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [layoutLines, setLayoutLines] = useState<readonly LayoutLine[]>([])
  const prefersReducedMotion = usePrefersReducedMotion()

  const prepared = useMemo(() => buildPrepared(), [])

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return

    const measure = () => {
      const w = el.clientWidth
      if (w <= H_PADDING) {
        setLayoutLines([])
        return
      }
      const { lines } = layoutWithLines(
        prepared,
        Math.max(1, w - H_PADDING),
        LINE_HEIGHT_PX,
      )
      setLayoutLines(lines.slice(0, MAX_LINES))
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [prepared])

  const n = layoutLines.length

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-zinc-950"
      aria-hidden
    >
      <div
        className={
          prefersReducedMotion
            ? 'absolute inset-0'
            : 'animate-code-bg-drift absolute inset-0 will-change-transform'
        }
      >
        {layoutLines.map((line, i) => (
          <div
            key={`${i}-${line.text.slice(0, 24)}`}
            className="absolute whitespace-pre text-[13px] leading-[22px] text-emerald-400/[0.17]"
            style={{
              fontFamily: CODE_FONT_FAMILY,
              top:
                n <= 1
                  ? '50%'
                  : `calc(${(100 * (i + 0.5)) / n}% - ${LINE_HEIGHT_PX / 2}px)`,
              left: `${12 + (i % 5) * 18}px`,
              maxWidth: `calc(100% - ${24 + (i % 5) * 18}px)`,
            }}
          >
            {line.text}
          </div>
        ))}
      </div>
    </div>
  )
}
