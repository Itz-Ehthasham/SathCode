import LetterGlitch from '@/components/LetterGlitch'

/**
 * Full-viewport LetterGlitch layer for auth / hero screens.
 * Canvas fills the parent; parent is `absolute inset-0` under a `relative min-h-dvh` root.
 */
export function GlitchBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 min-h-dvh w-full"
      aria-hidden
    >
      <div className="h-full min-h-dvh w-full contrast-[1.02]">
        <LetterGlitch
          glitchColors={['#9dccb0', '#c5ffec', '#b8f0ff']}
          glitchSpeed={10}
          centerVignette={false}
          outerVignette={false}
          smooth
          backgroundColor="#121f1a"
        />
      </div>
    </div>
  )
}
