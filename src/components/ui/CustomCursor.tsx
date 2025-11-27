import React, { useEffect, useRef, useState } from 'react'

type CursorState = 'default' | 'button' | 'link' | 'marquee'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<CursorState>('default')
  const [enabled, setEnabled] = useState(false)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const isCoarsePointer = () => {
      const coarse = window.matchMedia('(pointer: coarse)').matches
      const anyCoarse = window.matchMedia('(any-pointer: coarse)').matches
      const hoverNone = window.matchMedia('(hover: none)').matches
      const touchPoints = (navigator as any)?.maxTouchPoints > 0
      const hasTouch = 'ontouchstart' in window
      const smallViewport = window.innerWidth < 768
      return coarse || anyCoarse || hoverNone || touchPoints || hasTouch || smallViewport
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isCoarsePointer() || reduced) {
      setEnabled(false)
      return
    }
    setEnabled(true)

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let tx = x
    let ty = y

    const onMove = (e: MouseEvent) => {
      x = e.clientX
      y = e.clientY
    }

    const onEnter = (e: Event) => {
      const t = e.target as HTMLElement
      const attr = t.closest('[data-cursor]')?.getAttribute('data-cursor') as CursorState | null
      if (attr) setState(attr)
      else if (t.closest('a, button, [role="button"]')) setState('link')
      else setState('default')
    }

    const onLeave = () => setState('default')

    const loop = () => {
      tx += (x - tx) * 0.2
      ty += (y - ty) * 0.2
      const dot = dotRef.current
      const ring = ringRef.current
      if (dot) dot.style.transform = `translate3d(${x}px, ${y}px, 0)`
      if (ring) ring.style.transform = `translate3d(${tx}px, ${ty}px, 0)`
      raf.current = requestAnimationFrame(loop)
    }

    const onResize = () => {
      if (isCoarsePointer() || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setEnabled(false)
      } else {
        setEnabled(true)
      }
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onEnter)
    document.addEventListener('mouseout', onLeave)
    window.addEventListener('resize', onResize)
    raf.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onEnter)
      document.removeEventListener('mouseout', onLeave)
      window.removeEventListener('resize', onResize)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [])

  const ringStyle: React.CSSProperties = {
    position: 'fixed',
    left: 0,
    top: 0,
    width: state === 'button' || state === 'link' ? 44 : state === 'marquee' ? 52 : 36,
    height: state === 'button' || state === 'link' ? 44 : state === 'marquee' ? 52 : 36,
    marginLeft: -((state === 'button' || state === 'link' ? 44 : state === 'marquee' ? 52 : 36) / 2),
    marginTop: -((state === 'button' || state === 'link' ? 44 : state === 'marquee' ? 52 : 36) / 2),
    borderRadius: '9999px',
    border: '1.5px solid var(--ifm-color-primary)',
    background: state === 'button' ? 'rgba(16,185,129,0.12)' : state === 'marquee' ? 'rgba(16,185,129,0.08)' : 'transparent',
    boxShadow: state === 'button' ? '0 0 24px rgba(16,185,129,0.25)' : 'none',
    pointerEvents: 'none',
    zIndex: 9999,
    transition: 'width 120ms ease, height 120ms ease, background 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
  }

  const dotStyle: React.CSSProperties = {
    position: 'fixed',
    left: 0,
    top: 0,
    width: state === 'button' || state === 'link' ? 6 : 8,
    height: state === 'button' || state === 'link' ? 6 : 8,
    marginLeft: -((state === 'button' || state === 'link' ? 6 : 8) / 2),
    marginTop: -((state === 'button' || state === 'link' ? 6 : 8) / 2),
    borderRadius: '9999px',
    background: 'var(--ifm-color-primary)',
    opacity: state === 'marquee' ? 0.7 : 1,
    pointerEvents: 'none',
    zIndex: 10000,
    transition: 'width 120ms ease, height 120ms ease, opacity 120ms ease',
  }

  if (!enabled) return null
  return (
    <>
      <div ref={ringRef} style={ringStyle} />
      <div ref={dotRef} style={dotStyle} />
    </>
  )
}
