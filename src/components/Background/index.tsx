import React, { useEffect, useRef } from 'react'

export default function Background(): JSX.Element {
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {}, [])
  return (
    <div
      ref={ref}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden
    >
      <div className="absolute top-[-12%] left-[-12%] w-[50vw] h-[50vw] rounded-full bg-[color:var(--ifm-color-primary)]/10 mix-blend-plus-lighter blur-[90px] animate-blob-1" />
      <div className="absolute top-[-10%] right-[-12%] w-[40vw] h-[40vw] rounded-full bg-emerald-500/10 mix-blend-plus-lighter blur-[90px] animate-blob-2" />
      <div className="absolute bottom-[-18%] left-[18%] w-[60vw] h-[60vw] rounded-full bg-teal-400/10 mix-blend-plus-lighter blur-[90px] animate-blob-3" />
      <div className="absolute bottom-[8%] right-[8%] w-[30vw] h-[30vw] rounded-full bg-lime-400/10 mix-blend-plus-lighter blur-[80px] animate-blob-4" />
      <style>{`
        @keyframes blob1 { 0%{transform:translate(0,0) scale(1)} 50%{transform:translate(40px,-30px) scale(1.08)} 100%{transform:translate(0,0) scale(1)} }
        @keyframes blob2 { 0%{transform:translate(0,0) scale(1)} 50%{transform:translate(-30px,30px) scale(0.92)} 100%{transform:translate(0,0) scale(1)} }
        @keyframes blob3 { 0%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,20px) scale(1.06)} 100%{transform:translate(0,0) scale(1)} }
        @keyframes blob4 { 0%{transform:translate(0,0) scale(1)} 50%{transform:translate(-20px,-20px) scale(0.96)} 100%{transform:translate(0,0) scale(1)} }
        .animate-blob-1{animation:blob1 16s ease-in-out infinite}
        .animate-blob-2{animation:blob2 18s ease-in-out infinite}
        .animate-blob-3{animation:blob3 20s ease-in-out infinite}
        .animate-blob-4{animation:blob4 22s ease-in-out infinite}
      `}</style>
    </div>
  )
}
