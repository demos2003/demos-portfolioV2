"use client"

import { motion, type MotionValue } from "framer-motion"

export type DemiMood =
  | "happy"
  | "curious"
  | "excited"
  | "love"
  | "thinking"
  | "talking"
  | "sad"
  | "sleepy"
  | "sleeping"

const INK = "#101010"
const PAPER = "#F4F0EA"
const SHADE = "#D95A2B"
const NIGHT = "#3B4A7A"

const fillBox = { transformBox: "fill-box", transformOrigin: "center" } as const

function Eyes({ mood }: { mood: DemiMood }) {
  const stroke = { stroke: INK, strokeWidth: 2.6, strokeLinecap: "round", fill: "none" } as const

  if (mood === "sleeping") {
    return (
      <>
        <path d="M31 51 Q37 56 43 51" {...stroke} />
        <path d="M57 51 Q63 56 69 51" {...stroke} />
      </>
    )
  }
  if (mood === "love" || mood === "excited") {
    return (
      <>
        <path d="M31 53 Q37 45 43 53" {...stroke} />
        <path d="M57 53 Q63 45 69 53" {...stroke} />
      </>
    )
  }

  const ry = mood === "sleepy" ? 3 : mood === "curious" ? 8 : 7
  return (
    // Blink every few seconds.
    <motion.g
      style={fillBox}
      animate={{ scaleY: [1, 1, 0.1, 1] }}
      transition={{ duration: 0.3, times: [0, 0.4, 0.7, 1], repeat: Infinity, repeatDelay: 3.4 }}
    >
      {[37, 63].map((cx) => (
        <g key={cx}>
          <ellipse cx={cx} cy={50} rx={5.5} ry={ry} fill={INK} />
          {mood !== "sleepy" && <circle cx={cx - 1.6} cy={47.4} r={2} fill={PAPER} />}
        </g>
      ))}
      {mood === "sad" && (
        <>
          <path d="M30 41 L42 44" {...stroke} strokeWidth={2.2} />
          <path d="M70 41 L58 44" {...stroke} strokeWidth={2.2} />
        </>
      )}
    </motion.g>
  )
}

function Mouth({ mood }: { mood: DemiMood }) {
  const stroke = { stroke: INK, strokeWidth: 2.6, strokeLinecap: "round", fill: "none" } as const

  switch (mood) {
    case "excited":
    case "love":
      return (
        <>
          <path d="M42 61 Q50 75 58 61 Z" fill={INK} />
          <ellipse cx={50} cy={68} rx={3.2} ry={2} fill="#FF9FA8" />
        </>
      )
    case "curious":
      return <circle cx={50} cy={65} r={3} fill={INK} />
    case "thinking":
      return <path d="M44 65 Q47 62 50 65 T56 65" {...stroke} />
    case "talking":
      return (
        <motion.ellipse
          cx={50}
          cy={65}
          rx={4}
          fill={INK}
          animate={{ ry: [1.5, 5, 2, 4.5, 1.5] }}
          transition={{ duration: 0.55, repeat: Infinity }}
        />
      )
    case "sleepy":
      return <ellipse cx={50} cy={66} rx={4.5} ry={6} fill={INK} />
    case "sleeping":
      return <circle cx={50} cy={65} r={2} fill={INK} />
    case "sad":
      return <path d="M43 68 Q50 61 57 68" {...stroke} />
    default:
      return <path d="M43 62 Q50 69 57 62" {...stroke} />
  }
}

export function DemiSprite({
  mood,
  night,
  moving,
  eyeX,
  eyeY,
}: {
  mood: DemiMood
  night: boolean
  moving: boolean
  eyeX: MotionValue<number>
  eyeY: MotionValue<number>
}) {
  const asleep = mood === "sleeping"
  const tucked = asleep && night

  return (
    <div className="relative h-full w-full select-none">
      <motion.svg
        viewBox="0 0 100 100"
        className="h-full w-full overflow-visible"
        // Hop while travelling, breathe while still, slow right down asleep.
        animate={
          moving
            ? { y: [0, -7, 0], scaleY: [1, 1.04, 0.96] }
            : { y: 0, scaleY: asleep ? [1, 1.035, 1] : [1, 1.02, 1] }
        }
        transition={
          moving
            ? { duration: 0.42, repeat: Infinity, ease: "easeOut" }
            : { duration: asleep ? 3.2 : 2.4, repeat: Infinity, ease: "easeInOut" }
        }
        style={{ transformOrigin: "50% 95%" }}
      >
        <ellipse cx={50} cy={94} rx={27} ry={4.5} fill="#000" opacity={0.35} />

        {/* feet */}
        <ellipse cx={36} cy={90} rx={9} ry={5} fill={SHADE} />
        <ellipse cx={64} cy={90} rx={9} ry={5} fill={SHADE} />

        {/* antenna, tucked away under the nightcap */}
        {!tucked && (
          <>
            <path d="M50 16 Q47 7 54 5" stroke={SHADE} strokeWidth={3} strokeLinecap="round" fill="none" />
            <motion.circle
              cx={55}
              cy={5}
              r={3.6}
              fill={PAPER}
              animate={mood === "thinking" ? { opacity: [1, 0.3, 1], scale: [1, 1.35, 1] } : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, repeat: mood === "thinking" ? Infinity : 0 }}
              style={fillBox}
            />
          </>
        )}

        {/* body */}
        <path
          d="M50 14 C74 14 88 34 88 58 C88 80 72 90 50 90 C28 90 12 80 12 58 C12 34 26 14 50 14Z"
          className="fill-signal"
        />
        <ellipse cx={50} cy={70} rx={22} ry={15} fill={PAPER} opacity={0.16} />

        {/* arms */}
        <ellipse cx={13} cy={62} rx={5} ry={8} fill={SHADE} />
        <ellipse cx={87} cy={62} rx={5} ry={8} fill={SHADE} />

        {/* face: the whole thing drifts toward whatever Demi is looking at */}
        <motion.g style={{ x: eyeX, y: eyeY }}>
          <Eyes mood={mood} />
          <circle cx={27} cy={60} r={4.6} fill="#FF4D6D" opacity={mood === "love" ? 0.6 : 0.32} />
          <circle cx={73} cy={60} r={4.6} fill="#FF4D6D" opacity={mood === "love" ? 0.6 : 0.32} />
          <Mouth mood={mood} />
        </motion.g>

        {tucked && (
          <>
            {/* nightcap */}
            <path d="M22 32 Q50 -6 78 32 Q50 21 22 32Z" fill={NIGHT} />
            <path d="M64 15 Q83 12 85 31" stroke={NIGHT} strokeWidth={7} strokeLinecap="round" fill="none" />
            <circle cx={85} cy={34} r={4.5} fill={PAPER} />
            {/* blanket */}
            <path d="M6 70 Q50 60 94 70 L94 92 Q50 99 6 92 Z" fill={NIGHT} />
            <path d="M6 70 Q50 60 94 70" stroke={PAPER} strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.7} />
          </>
        )}
      </motion.svg>

      {asleep && (
        <div aria-hidden="true" className="pointer-events-none absolute -top-2 right-0 font-serif text-paper/70">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute right-0"
              style={{ fontSize: 13 + i * 5 }}
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{ opacity: [0, 1, 0], x: 6 + i * 7, y: -10 - i * 12 }}
              transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.7, ease: "easeOut" }}
            >
              z
            </motion.span>
          ))}
        </div>
      )}

      {mood === "love" && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-1 text-[#FF4D6D]">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute text-sm"
              style={{ left: `${18 + i * 28}%` }}
              initial={{ opacity: 0, y: 0, scale: 0.6 }}
              animate={{ opacity: [0, 1, 0], y: -26 - i * 5, scale: 1 }}
              transition={{ duration: 1.3, repeat: Infinity, delay: i * 0.3, ease: "easeOut" }}
            >
              ♥
            </motion.span>
          ))}
        </div>
      )}

      {mood === "thinking" && (
        <div aria-hidden="true" className="pointer-events-none absolute -top-4 left-1/2 flex -translate-x-1/2 gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-paper/70"
              animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
