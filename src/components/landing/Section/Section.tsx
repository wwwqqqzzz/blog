import Link from "@docusaurus/Link";
import React, { useRef, useState } from "react";
import { Icon } from "@iconify/react";

export function Section({
  title,
  icon,
  href,
  children,
}: {
  title?: React.ReactNode;
  icon?: string;
  href?: string;
  children: React.ReactNode;
}) {
  function CreepyLinkButton({
    href,
    children = "查看更多",
  }: {
    href: string;
    children?: React.ReactNode;
  }) {
    const eyesRef = useRef<HTMLSpanElement | null>(null);
    const [eyeCoords, setEyeCoords] = useState({ x: 0, y: 0 });
    const translateX = `${-50 + eyeCoords.x * 50}%`;
    const translateY = `${-50 + eyeCoords.y * 50}%`;
    const eyeStyle: React.CSSProperties = {
      transform: `translate(${translateX}, ${translateY})`,
    };
    const updateEyes = (e: any) => {
      const userEvent = "touches" in e ? e.touches[0] : e;
      const rect = eyesRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = userEvent.clientX - cx;
      const dy = userEvent.clientY - cy;
      const angle = Math.atan2(-dy, dx) + Math.PI / 2;
      const rangeX = 180;
      const rangeY = 75;
      const dist = Math.hypot(dx, dy);
      const x = (Math.sin(angle) * dist) / rangeX;
      const y = (Math.cos(angle) * dist) / rangeY;
      setEyeCoords({ x, y });
    };
    return (
      <Link
        href={href}
        className="creepy-btn"
        onMouseMove={updateEyes}
        onTouchMove={updateEyes}
        style={{
          backgroundColor: "var(--ifm-background-color)",
          borderRadius: "1.25em",
          color: "hsl(223deg 10% 95%)",
          letterSpacing: "1px",
          minWidth: "9em",
          outline: "0.1875em solid transparent",
          transition: "outline 0.1s linear",
          position: "relative",
          fontSize: "0.875rem",
          border: "none",
          padding: 0,
          display: "inline-block",
          textAlign: "center",
        }}
      >
        <span
          className="creepy-btn__eyes"
          ref={eyesRef}
          style={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            gap: "0.375em",
            right: "1em",
            bottom: "0.5em",
            height: "0.75em",
          }}
        >
          <span
            className="creepy-btn__eye"
            style={{
              position: "relative",
              animation: "eye-blink 3s infinite",
              backgroundColor: "hsl(223deg 10% 95%)",
              borderRadius: "50%",
              overflow: "hidden",
              width: "0.75em",
              height: "0.75em",
            }}
          >
            <span
              className="creepy-btn__pupil"
              style={{
                ...eyeStyle,
                position: "absolute",
                backgroundColor: "hsl(0 0% 0%)",
                borderRadius: "50%",
                display: "block",
                aspectRatio: "1",
                top: "50%",
                left: "50%",
                width: "0.375em",
              }}
            ></span>
          </span>
          <span
            className="creepy-btn__eye"
            style={{
              position: "relative",
              animation: "eye-blink 3s infinite",
              backgroundColor: "hsl(223deg 10% 95%)",
              borderRadius: "50%",
              overflow: "hidden",
              width: "0.75em",
              height: "0.75em",
            }}
          >
            <span
              className="creepy-btn__pupil"
              style={{
                ...eyeStyle,
                position: "absolute",
                backgroundColor: "hsl(0 0% 0%)",
                borderRadius: "50%",
                display: "block",
                aspectRatio: "1",
                top: "50%",
                left: "50%",
                width: "0.375em",
              }}
            ></span>
          </span>
        </span>
        <span
          className="creepy-btn__cover"
          style={{
            position: "relative",
            backgroundColor: "var(--ifm-color-primary)",
            boxShadow: "0 0 0 0.125em hsl(0 0% 0%) inset",
            padding: "0.5em 1em",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            borderRadius: "1.25em",
            transformOrigin: "1.25em 50%",
            transition:
              "background-color 0.3s, transform 0.3s cubic-bezier(0.65, 0, 0.35, 1)",
            color: "white",
          }}
        >
          {children}
        </span>
        <style>{`
          @keyframes eye-blink { 0%, 92%, 100% { height: 0.75em; } 96% { height: 0; } }
          .creepy-btn:hover .creepy-btn__cover { background-color: var(--ifm-color-primary-dark); transform: rotate(-18deg); }
          .creepy-btn:focus-visible { outline: 0.1875em solid var(--ifm-color-primary-light); }
          .creepy-btn:focus-visible .creepy-btn__cover { transform: rotate(-8deg); }
          .creepy-btn:active .creepy-btn__cover { transform: rotate(0); }
        `}</style>
      </Link>
    );
  }
  return (
    <section className="relative w-full">
      {(title || icon) && (
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon && <Icon icon={icon} className="text-[#096248]" />}
            {title && (
              <h2 className="text-2xl font-bold tracking-tight text-card-foreground">
                {title}
              </h2>
            )}
          </div>
          {href && <CreepyLinkButton href={href}>查看更多</CreepyLinkButton>}
        </div>
      )}
      {children}
    </section>
  );
}
