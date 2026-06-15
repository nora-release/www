"use client";

import { useEffect, useState } from "react";
import type { FeatureCardsCopy } from "../lib/translations";

const bridgeCardVisuals = [
  {
    fallbackLabel: "Calendar",
    visual: <CalendarPreview />,
  },
  {
    fallbackLabel: "Files",
    visual: <FilesPreview />,
  },
  {
    fallbackLabel: "Browser",
    visual: <BrowserPreview />,
  },
] as const;

export function FeatureCardsSection({ copy }: { copy: FeatureCardsCopy }) {
  return (
    <section
      data-landing-section="section-four"
      className="relative overflow-hidden bg-background py-28 md:py-32"
    >
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.025) 42%, transparent 100%)",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.16]" />

      <div className="relative mx-auto w-full max-w-[1024px] px-6">
        <div className="mb-10 max-w-3xl md:mb-12">
          <p className="mb-4 text-sm uppercase text-accent">{copy.eyebrow}</p>
          <h2 className="text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.08] text-foreground text-balance">
            {copy.title}
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {copy.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {bridgeCardVisuals.map((card, index) => (
            <div
              key={card.fallbackLabel}
              className="bridge-card-container"
            >
              <article className="bridge-execution-card">
                <div className="bridge-preview-shell">
                  <div className="bridge-preview">{card.visual}</div>
                </div>
                <p className="relative z-10 text-[20px] font-medium leading-[1.2] tracking-normal text-[#111111]">
                  {copy.items[index]?.title ?? card.fallbackLabel}
                </p>
              </article>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        [data-landing-section="section-four"] {
          --bridge-accent: #006fe6;
          --bridge-card: #f0f0ef;
          --bridge-card-border: rgba(0, 0, 0, 0.1);
        }

        .bridge-card-container {
          container-type: inline-size;
        }

        .bridge-execution-card {
          position: relative;
          display: flex;
          aspect-ratio: 384 / 400;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          border: 1px solid var(--bridge-card-border);
          border-radius: 6.25cqw;
          padding: 8.33333cqw 5.20833cqw 5.72917cqw;
          background: var(--bridge-card);
          color: #111111;
          box-shadow: 0 22px 70px rgba(0, 0, 0, 0.08);
          isolation: isolate;
        }

        .bridge-preview-shell {
          position: relative;
          z-index: 10;
          aspect-ratio: 345 / 260;
          width: 100%;
          flex-shrink: 0;
          overflow: hidden;
          border-radius: 4.6875cqw;
          box-shadow: rgba(0, 0, 0, 0.13) 0 8px 64px;
        }

        .bridge-preview {
          height: 100%;
          width: 100%;
          overflow: hidden;
          border: 1px solid var(--bridge-card-border);
          border-radius: inherit;
          background: #ffffff;
          box-shadow: rgba(0, 0, 0, 0.13) 0 8px 64px;
        }

        .bridge-calendar-fill {
          animation: bridge-calendar-fill 3200ms ease-in-out infinite;
          transform-origin: center top;
        }

        .bridge-calendar-cursor {
          animation: bridge-calendar-cursor 3200ms cubic-bezier(0.22, 1, 0.36, 1) infinite;
          backface-visibility: hidden;
        }

        .bridge-file {
          backface-visibility: hidden;
          transition:
            left 620ms cubic-bezier(0.22, 1, 0.36, 1),
            top 620ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: left, top;
        }

        .bridge-skeleton {
          animation: bridge-skeleton-breathe 2600ms ease-in-out infinite both;
        }

        .bridge-skeleton-soft {
          animation-delay: -1300ms;
        }

        .bridge-browser-cursor {
          animation: bridge-browser-cursor-path 5600ms cubic-bezier(0.22, 1, 0.36, 1) infinite both;
          backface-visibility: hidden;
        }

        @keyframes bridge-calendar-fill {
          0%,
          16%,
          100% {
            opacity: 0;
            transform: scaleY(0.18);
          }

          34%,
          72% {
            opacity: 1;
            transform: scaleY(1);
          }
        }

        @keyframes bridge-calendar-cursor {
          0%,
          12%,
          100% {
            transform: translate3d(0, -6px, 0);
          }

          36%,
          74% {
            transform: translate3d(20px, 12px, 0);
          }
        }

        @keyframes bridge-skeleton-breathe {
          0%,
          100% {
            opacity: 1;
          }

          50% {
            opacity: 0.58;
          }
        }

        @keyframes bridge-browser-cursor-path {
          0%,
          16% {
            transform: translate3d(8%, -24%, 0);
          }

          28%,
          40% {
            transform: translate3d(-12%, 8%, 0);
          }

          56%,
          68% {
            transform: translate3d(17%, 14%, 0);
          }

          84%,
          100% {
            transform: translate3d(8%, -24%, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bridge-calendar-fill,
          .bridge-calendar-cursor,
          .bridge-skeleton,
          .bridge-browser-cursor {
            animation: none !important;
          }

          .bridge-file {
            transition: none !important;
          }

          .bridge-calendar-fill {
            opacity: 1;
            transform: scaleY(1);
          }
        }
      `}</style>
    </section>
  );
}

function CalendarPreview() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[inherit] bg-white">
      <svg viewBox="20 32 344 260" preserveAspectRatio="none" className="block h-full w-full" fill="none">
        <path
          d="M20 42.7996C20 36.8351 24.8351 32 30.7996 32H353.437C359.402 32 364.237 36.8351 364.237 42.7996V281.2C364.237 287.165 359.402 292 353.437 292H30.7996C24.8352 292 20 287.165 20 281.2V42.7996Z"
          fill="white"
        />
        <rect x="20" y="32" width="344" height="260" rx="10.8" stroke="rgba(0,0,0,0.08)" />
        <CalendarLabel x={49} label="SAT" muted />
        <CalendarLabel x={117} label="SUN" muted />
        <CalendarLabel x={187} label="MON" />
        <rect x="243.5" y="51.5" width="36" height="18" rx="9" fill="#EA580C" />
        <text x="261.5" y="64" textAnchor="middle" fontSize="10" fontWeight="700" fill="white">
          TUE
        </text>
        <CalendarLabel x={324} label="WED" />

        <path d="M19.2 76.5H365.9" stroke="#E5E5E5" strokeWidth="0.81" />
        {[88.8, 157.7, 226.5, 295.4, 364.2].map((x) => (
          <path key={x} d={`M${x} 76.5V423.2`} stroke="#E5E5E5" strokeWidth="0.81" />
        ))}

        <rect x="20" y="216.7" width="68.8" height="29.2" rx="3.2" fill="#FCE7F3" />
        <rect x="88.8" y="108.1" width="68.8" height="17.8" rx="3.2" fill="#DBEAFE" />
        <rect x="88.8" y="183.5" width="68.8" height="17.8" rx="3.2" fill="#DBEAFE" />
        <rect x="157.7" y="121.1" width="68.8" height="17.8" rx="3.2" fill="#DBEAFE" />
        <path d="M159.1 131.6H227.4" stroke="#EA580C" strokeWidth="0.81" />
        <circle cx="157.7" cy="131.6" r="1.62" fill="#EA580C" />
        <rect x="227" y="141" width="68" height="18" rx="3.2" fill="#DBEAFE" />
        <rect x="226.5" y="237" width="68.8" height="17.8" rx="3.2" fill="#DDD6FE" />
      </svg>

      <div
        aria-hidden="true"
        className="bridge-calendar-fill pointer-events-none absolute z-10"
        style={{
          left: "40.1163%",
          top: "46.5385%",
          width: "20.0581%",
          height: "13.0769%",
          borderRadius: "0.9391cqw",
          background: "linear-gradient(180deg, #DBEAFE 0%, var(--bridge-accent) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="bridge-calendar-cursor pointer-events-none absolute left-[36%] top-[37%] z-20 h-[15.3562%] w-[43.8375%]"
      >
        <CursorSvg className="absolute left-0 top-0 h-[65.1195%] w-[17.2406%]" fill="var(--bridge-accent)" />
        <div
          className="absolute left-[14.4561%] top-[52.408%] flex h-[47.592%] items-center justify-center whitespace-nowrap rounded-full px-2 text-white"
          style={{
            background: "var(--bridge-accent)",
            fontSize: "min(3.5cqw, 14.5px)",
            fontWeight: 500,
            lineHeight: 1,
          }}
        >
          Creating the event
        </div>
      </div>
    </div>
  );
}

function CalendarLabel({ x, label, muted = false }: { x: number; label: string; muted?: boolean }) {
  return (
    <text x={x} y="64" textAnchor="middle" fontSize="10" fontWeight="700" fill={muted ? "#7A7A7A" : "#111111"} opacity={muted ? 0.52 : 0.8}>
      {label}
    </text>
  );
}

function FilesPreview() {
  const [cycleStep, setCycleStep] = useState(0);
  const fileSlots = [
    { x: 32.5, y: 67.125 },
    { x: 103.5, y: 67.125 },
    { x: 174.5, y: 67.125 },
    { x: 246, y: 67 },
    { x: 33, y: 150 },
    { x: 103.5, y: 150.125 },
    { x: 174.5, y: 150.125 },
    { x: 245.5, y: 150.125 },
  ] as const;
  const fileCycle = [0, 1, 2, 3, 7, 6, 5, 4] as const;
  const files = [
    { id: "image-a", type: "image", slot: 0 },
    { id: "doc-a", type: "doc", slot: 1 },
    { id: "text-a", type: "text", slot: 2 },
    { id: "doc-b", type: "doc", slot: 3 },
    { id: "text-b", type: "text", slot: 4 },
    { id: "doc-c", type: "doc", slot: 5 },
    { id: "doc-d", type: "doc", slot: 6 },
    { id: "image-b", type: "image", slot: 7 },
  ] as const;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const interval = window.setInterval(() => {
      setCycleStep((step) => (step + 1) % fileCycle.length);
    }, 1500);

    return () => window.clearInterval(interval);
  }, [fileCycle.length]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-white">
      <svg viewBox="20 32 344 260" preserveAspectRatio="none" className="absolute inset-0 block h-full w-full" fill="none">
        <path
          d="M20 42.7996C20 36.8351 24.8351 32 30.7996 32H353.437C359.402 32 364.237 36.8351 364.237 42.7996V281.2C364.237 287.165 359.402 292 353.437 292H30.7996C24.8352 292 20 287.165 20 281.2V42.7996Z"
          fill="white"
        />
        <circle cx="36" cy="57" r="5" fill="#FF5C60" />
        <circle cx="51" cy="57" r="5" fill="#FAC800" />
        <circle cx="66" cy="57" r="5" fill="#35C759" />
      </svg>
      <div
        aria-hidden="true"
        className="absolute left-0 top-0 z-10"
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        {files.map((file) => {
          const cyclePosition = fileCycle.indexOf(file.slot);
          const slotIndex = fileCycle[(cyclePosition + cycleStep) % fileCycle.length];
          const slot = fileSlots[slotIndex];

          return (
            <div
              key={file.id}
              className="bridge-file pointer-events-none absolute left-0 top-0 select-none"
              style={{
                width: `${(58 / 344) * 100}%`,
                height: `${(58 / 260) * 100}%`,
                left: `${(slot.x / 344) * 100}%`,
                top: `${(slot.y / 260) * 100}%`,
              }}
            >
              <FileIcon type={file.type} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FileIcon({ type }: { type: "doc" | "image" | "text" }) {
  return (
    <svg viewBox="0 0 58 58" className="block h-full w-full" fill="none" aria-hidden="true">
      <path d="M13 8H34L45 19V48C45 49.66 43.66 51 42 51H16C14.34 51 13 49.66 13 48V11C13 9.34 14.34 8 16 8Z" fill="white" stroke="#A8A8A8" strokeWidth="3" />
      <path d="M34 8V19H45" stroke="#A8A8A8" strokeWidth="3" strokeLinejoin="round" />
      {type === "image" ? (
        <>
          <circle cx="35.5" cy="29" r="3.8" fill="#A8A8A8" />
          <path d="M19 43L27 32L33 39L37 34L43 43H19Z" fill="#A8A8A8" />
        </>
      ) : null}
      {type === "text" ? (
        <>
          <path d="M20 27H37" stroke="#A8A8A8" strokeWidth="3" strokeLinecap="round" />
          <path d="M20 35H38" stroke="#A8A8A8" strokeWidth="3" strokeLinecap="round" />
          <path d="M20 43H32" stroke="#A8A8A8" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : null}
    </svg>
  );
}

function BrowserPreview() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[inherit] bg-white">
      <svg viewBox="20 32 344 260" preserveAspectRatio="none" className="absolute inset-0 block h-full w-full" fill="none">
        <path
          d="M20 42.7996C20 36.8351 24.8351 32 30.7996 32H353.437C359.402 32 364.237 36.8351 364.237 42.7996V281.2C364.237 287.165 359.402 292 353.437 292H30.7996C24.8352 292 20 287.165 20 281.2V42.7996Z"
          fill="white"
        />
        <circle cx="36" cy="57" r="5" fill="#FF5C60" />
        <circle cx="51" cy="57" r="5" fill="#FAC800" />
        <circle cx="66" cy="57" r="5" fill="#35C759" />

        <rect x="92" y="46" width="201" height="21" rx="3" className="bridge-skeleton bridge-skeleton-soft" fill="#F5F5F5" />
        <text x="192" y="60.5" textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#9A9A9A">
          https://elonehoo.me
        </text>
        <path d="M18 82H364" className="bridge-skeleton bridge-skeleton-soft" stroke="#F3F3F3" />

        <rect x="47" y="97" width="88" height="80" rx="4" className="bridge-skeleton" fill="#EFEFEF" />
        <rect x="47" y="186" width="192" height="80" rx="4" className="bridge-skeleton" fill="#EFEFEF" />
        <rect x="145" y="97" width="193" height="16" rx="4" className="bridge-skeleton" fill="#EFEFEF" />
        <rect x="145" y="121" width="193" height="16" rx="4" className="bridge-skeleton" fill="#EFEFEF" />
        <rect x="145" y="145" width="193" height="16" rx="4" className="bridge-skeleton" fill="#EFEFEF" />
        <rect x="246" y="186" width="92" height="16" rx="4" className="bridge-skeleton" fill="#EFEFEF" />
        <rect x="246" y="210" width="92" height="16" rx="4" className="bridge-skeleton" fill="#EFEFEF" />
        <rect x="246" y="234" width="92" height="16" rx="4" className="bridge-skeleton" fill="#EFEFEF" />
      </svg>

      <div aria-hidden="true" className="bridge-browser-cursor pointer-events-none absolute inset-0 z-10">
        <svg viewBox="20 32 344 260" preserveAspectRatio="none" className="block h-full w-full" fill="none">
          <path
            d="M114.882 138.094C114.142 136.091 116.091 134.142 118.094 134.882L133.583 140.605C136.027 141.508 135.633 145.079 133.051 145.428L128.223 146.08C127.107 146.23 126.23 147.107 126.08 148.223L125.428 153.051C125.079 155.633 121.508 156.027 120.605 153.583L114.882 138.094Z"
            fill="#4F46E5"
            stroke="white"
            strokeWidth="1.66667"
          />
          <rect x="131" y="152" width="158" height="19" rx="9.5" fill="#4F46E5" />
          <text x="210" y="165.5" textAnchor="middle" fontSize="10" fontWeight="700" fill="white">
            Browsing &amp; analyzing...
          </text>
        </svg>
      </div>
    </div>
  );
}

function CursorSvg({ className, fill }: { className?: string; fill: string }) {
  return (
    <svg viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg" className={className} style={{ filter: "drop-shadow(rgba(0, 0, 0, 0.45) 0 1.875px 4.6875px)" }} aria-hidden="true">
      <path
        d="M2.85 3.02C2.16 1.15 3.98 -0.67 5.85 0.02L20.31 5.37C22.59 6.22 22.22 9.55 19.82 9.87L15.31 10.48C14.27 10.62 13.45 11.44 13.31 12.48L12.7 16.99C12.38 19.39 9.05 19.76 8.2 17.48L2.85 3.02Z"
        stroke="white"
        fill={fill}
        strokeWidth="1.25"
      />
    </svg>
  );
}
