"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue } from "framer-motion"
import { X } from "lucide-react"
import { DemiSprite, type DemiMood } from "@/components/demi/demi-sprite"

type RoomId = "bedroom" | "gym" | "living" | "kitchen"

// The house is drawn in an 800x600 coordinate space. Each room records its
// bounds (for the tap target), where Demi stands in it (centre x, feet y),
// and what Demi gets up to there.
const W = 800
const H = 600
const SPRITE = 84

const ROOMS: Record<
  RoomId,
  {
    name: string
    box: { x: number; y: number; w: number; h: number }
    spot: { x: number; y: number }
    mood: DemiMood
    lines: string[]
  }
> = {
  bedroom: {
    name: "Bedroom",
    box: { x: 100, y: 150, w: 300, h: 205 },
    spot: { x: 212, y: 338 },
    mood: "sleeping",
    lines: ["Zzz... five more minutes.", "Shh. Dreaming about clean code."],
  },
  gym: {
    name: "Exercise corner",
    box: { x: 400, y: 150, w: 300, h: 205 },
    spot: { x: 560, y: 350 },
    mood: "grumpy",
    lines: ["Nine hundred ninety-eight... nine hundred ninety-nine...", "Leg day. I have very small legs."],
  },
  living: {
    name: "Living room",
    box: { x: 100, y: 365, w: 300, h: 195 },
    spot: { x: 196, y: 532 },
    mood: "happy",
    lines: ["This is my favourite episode.", "Sit down, the good part's coming."],
  },
  kitchen: {
    name: "Kitchen",
    box: { x: 400, y: 365, w: 300, h: 195 },
    spot: { x: 600, y: 556 },
    mood: "love",
    lines: ["Chef Demi. Tonight's special: toast.", "Secret ingredient? More butter."],
  },
}

const INK = "#101010"
const PAPER = "#F4F0EA"
const SIGNAL = "#FF7A45"
const WOOD = "#6B4A36"
const WOOD_DARK = "#4A3226"

function isNight() {
  const hour = new Date().getHours()
  return hour >= 22 || hour < 6
}

const pct = (value: number, of: number) => `${(value / of) * 100}%`

function Bedroom() {
  return (
    <g>
      <rect x={100} y={150} width={300} height={205} fill="#2B2440" />
      {/* window with moon */}
      <rect x={300} y={185} width={64} height={64} rx={4} fill="#101633" stroke={PAPER} strokeWidth={3} />
      <path d="M332 185 V249 M300 217 H364" stroke={PAPER} strokeWidth={2} opacity={0.6} />
      <circle cx={346} cy={203} r={9} fill="#F6E7A8" />
      {/* bedside lamp */}
      <rect x={118} y={296} width={26} height={59} fill={WOOD_DARK} />
      <path d="M121 296 L141 296 L136 276 L126 276 Z" fill={SIGNAL} opacity={0.85} />
      {/* bed */}
      <rect x={150} y={270} width={12} height={85} rx={3} fill={WOOD} />
      <rect x={156} y={318} width={170} height={26} rx={6} fill={PAPER} opacity={0.9} />
      <rect x={156} y={338} width={176} height={17} fill={WOOD} />
      <rect x={164} y={304} width={46} height={20} rx={9} fill="#FFFFFF" />
      {/* rug */}
      <ellipse cx={330} cy={350} rx={44} ry={5} fill={SIGNAL} opacity={0.35} />
    </g>
  )
}

function Gym({ active }: { active: boolean }) {
  return (
    <g>
      <rect x={400} y={150} width={300} height={205} fill="#1D2E2B" />
      {/* poster */}
      <rect x={430} y={180} width={74} height={50} fill={INK} stroke={PAPER} strokeWidth={2} />
      <text x={467} y={203} textAnchor="middle" fontSize={13} fontWeight={700} fill={SIGNAL} fontFamily="sans-serif">
        NO NAPS
      </text>
      <text x={467} y={220} textAnchor="middle" fontSize={9} fill={PAPER} opacity={0.7} fontFamily="sans-serif">
        (some naps)
      </text>
      {/* mat */}
      <rect x={480} y={346} width={170} height={9} rx={4} fill="#3F6B63" />
      {/* dumbbell rack */}
      <rect x={640} y={300} width={44} height={55} fill={WOOD_DARK} />
      {[312, 332].map((y) => (
        <g key={y}>
          <rect x={648} y={y} width={28} height={4} fill="#9AA3A8" />
          <rect x={645} y={y - 4} width={6} height={12} rx={2} fill="#555D62" />
          <rect x={673} y={y - 4} width={6} height={12} rx={2} fill="#555D62" />
        </g>
      ))}
      {/* the barbell Demi is lifting */}
      {active && (
        <motion.g
          animate={{ y: [0, -26, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <rect x={506} y={262} width={108} height={5} rx={2} fill="#9AA3A8" />
          <rect x={496} y={249} width={12} height={31} rx={4} fill="#555D62" />
          <rect x={612} y={249} width={12} height={31} rx={4} fill="#555D62" />
        </motion.g>
      )}
    </g>
  )
}

function Living({ active }: { active: boolean }) {
  return (
    <g>
      <rect x={100} y={365} width={300} height={195} fill="#33261F" />
      {/* framed portrait */}
      <rect x={128} y={392} width={46} height={52} fill={INK} stroke={WOOD} strokeWidth={4} />
      <circle cx={151} cy={420} r={13} fill={SIGNAL} />
      <circle cx={147} cy={418} r={2} fill={INK} />
      <circle cx={155} cy={418} r={2} fill={INK} />
      {/* sofa */}
      <rect x={130} y={486} width={132} height={42} rx={10} fill="#8A4B3A" />
      <rect x={122} y={506} width={148} height={40} rx={10} fill="#A85B45" />
      <rect x={130} y={546} width={8} height={14} fill={WOOD_DARK} />
      <rect x={254} y={546} width={8} height={14} fill={WOOD_DARK} />
      {/* tv */}
      <rect x={318} y={520} width={62} height={40} fill={WOOD_DARK} />
      <rect x={306} y={452} width={84} height={58} rx={4} fill={INK} stroke="#555D62" strokeWidth={3} />
      <motion.rect
        x={312}
        y={458}
        width={72}
        height={46}
        rx={2}
        fill="#7FB6FF"
        animate={active ? { opacity: [0.5, 0.9, 0.6, 1, 0.55] } : { opacity: 0.12 }}
        transition={{ duration: 1.8, repeat: active ? Infinity : 0 }}
      />
      <rect x={342} y={510} width={12} height={10} fill="#555D62" />
      {/* plant */}
      <rect x={278} y={540} width={18} height={20} fill="#C8693F" />
      <path d="M287 540 Q272 520 280 506 M287 540 Q290 516 287 500 M287 540 Q302 522 296 508" stroke="#5E9E6B" strokeWidth={5} strokeLinecap="round" fill="none" />
    </g>
  )
}

function Kitchen({ active }: { active: boolean }) {
  return (
    <g>
      <rect x={400} y={365} width={300} height={195} fill="#2C2A22" />
      {/* tiled splashback */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={430 + i * 24} y={452} width={22} height={22} fill={PAPER} opacity={i % 2 ? 0.14 : 0.07} />
      ))}
      {/* shelf */}
      <rect x={430} y={410} width={110} height={5} fill={WOOD} />
      <rect x={440} y={392} width={14} height={18} fill={SIGNAL} opacity={0.8} />
      <rect x={462} y={396} width={12} height={14} fill="#5E9E6B" />
      <circle cx={498} cy={402} r={8} fill={PAPER} opacity={0.8} />
      {/* fridge */}
      <rect x={632} y={420} width={54} height={140} rx={4} fill="#C9D1D6" />
      <path d="M632 474 H686" stroke="#8A949A" strokeWidth={2} />
      <rect x={640} y={440} width={4} height={22} rx={2} fill="#8A949A" />
      <rect x={640} y={486} width={4} height={30} rx={2} fill="#8A949A" />
      {/* counter and stove */}
      <rect x={420} y={500} width={150} height={60} fill={WOOD_DARK} />
      <rect x={416} y={494} width={158} height={8} fill="#B8A999" />
      <rect x={476} y={512} width={40} height={34} rx={3} fill={INK} opacity={0.6} />
      {/* pot */}
      <rect x={460} y={474} width={46} height={20} rx={4} fill="#555D62" />
      <rect x={452} y={478} width={8} height={4} fill="#555D62" />
      <rect x={506} y={478} width={8} height={4} fill="#555D62" />
      {active &&
        [0, 1, 2].map((i) => (
          <motion.path
            key={i}
            d={`M${470 + i * 13} 470 q-5 -8 0 -15 q5 -8 0 -15`}
            stroke={PAPER}
            strokeWidth={3}
            strokeLinecap="round"
            fill="none"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 0.7, 0], y: -14 }}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.45 }}
          />
        ))}
    </g>
  )
}

export function DemiHome({ onClose }: { onClose: () => void }) {
  const [night] = useState(isNight)
  // Demi is in bed at night and on the sofa otherwise when you arrive.
  const [room, setRoom] = useState<RoomId>(() => (isNight() ? "bedroom" : "living"))
  const [moving, setMoving] = useState(false)
  const [lineIndex, setLineIndex] = useState(0)
  const still = useMotionValue(0)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  function visit(next: RoomId) {
    if (next === room) {
      // Tapping the room Demi is already in gets a different remark.
      setLineIndex((i) => i + 1)
      return
    }
    setLineIndex(0)
    setMoving(true)
    setRoom(next)
  }

  const current = ROOMS[room]
  const settled = !moving
  const mood: DemiMood = moving ? "excited" : current.mood
  const line = moving ? "On my way!" : current.lines[lineIndex % current.lines.length]

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Demi's home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[60] flex flex-col items-center overflow-y-auto px-4 pt-16 pb-6 sm:px-8 text-paper"
      style={{
        background: night
          ? "linear-gradient(to bottom, #0B1026 0%, #141A33 55%, #101010 100%)"
          : "linear-gradient(to bottom, #3A2A22 0%, #241F1C 55%, #101010 100%)",
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Leave Demi's home"
        className="absolute right-4 top-4 sm:right-6 sm:top-6 flex items-center gap-2 border border-paper/20 px-3 py-2 text-sm text-paper/80 hover:border-signal hover:text-signal transition-colors"
      >
        <X className="h-4 w-4" /> Leave
      </button>

      <div className="mt-auto mb-3 text-center">
        <h2 className="font-serif text-3xl sm:text-4xl">Demi&apos;s home</h2>
        <p className="mt-1 text-sm text-paper/50">Tap a room and Demi will head there.</p>
      </div>

      <motion.div
        initial={{ y: 24, scale: 0.96 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative w-full shrink-0"
        // Sized so the title, the house and the caption all fit the viewport.
        style={{ aspectRatio: `${W} / ${H}`, maxWidth: "min(48rem, calc((100dvh - 14rem) * 1.333))", minWidth: "min(100%, 17rem)" }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
          {/* sky */}
          {night ? (
            <>
              <circle cx={90} cy={70} r={22} fill="#F6E7A8" />
              <circle cx={100} cy={64} r={20} fill="#0E1430" />
              {[
                [200, 40], [650, 60], [740, 130], [40, 170], [300, 20], [520, 24], [760, 40],
              ].map(([x, y], i) => (
                <motion.circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={2}
                  fill={PAPER}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </>
          ) : (
            <circle cx={90} cy={70} r={26} fill={SIGNAL} opacity={0.85} />
          )}

          {/* ground */}
          <rect x={0} y={560} width={W} height={40} fill="#1B2A1E" />

          {/* chimney and roof */}
          <rect x={560} y={58} width={44} height={80} fill={WOOD_DARK} />
          <motion.circle
            cx={582}
            r={10}
            fill={PAPER}
            initial={{ cy: 50, opacity: 0 }}
            animate={{ cy: 10, opacity: [0, 0.35, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <path d="M70 152 L400 28 L730 152 Z" fill="#8A3F26" />
          <path d="M70 152 L400 28 L730 152" stroke={WOOD_DARK} strokeWidth={8} strokeLinejoin="round" fill="none" />
          <circle cx={400} cy={98} r={22} fill="#101633" stroke={PAPER} strokeWidth={3} />

          <Bedroom />
          <Gym active={settled && room === "gym"} />
          <Living active={settled && room === "living"} />
          <Kitchen active={settled && room === "kitchen"} />

          {/* structure: floors, dividing wall, outline */}
          <rect x={100} y={355} width={600} height={10} fill={WOOD} />
          <rect x={395} y={150} width={10} height={410} fill={WOOD} />
          <rect x={100} y={150} width={600} height={410} fill="none" stroke={WOOD_DARK} strokeWidth={8} />

          {(Object.keys(ROOMS) as RoomId[]).map((id) => (
            <text
              key={id}
              x={ROOMS[id].box.x + 14}
              y={ROOMS[id].box.y + 24}
              fontSize={13}
              fill={PAPER}
              opacity={id === room ? 0.9 : 0.45}
              fontFamily="sans-serif"
              letterSpacing={1}
            >
              {ROOMS[id].name.toUpperCase()}
            </text>
          ))}
        </svg>

        {/* Demi: positioned by its feet, walks between rooms */}
        <motion.div
          className="pointer-events-none absolute"
          style={{ width: pct(SPRITE, W) }}
          initial={false}
          animate={{
            left: pct(current.spot.x - SPRITE / 2, W),
            top: pct(current.spot.y - SPRITE, H),
          }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          onAnimationComplete={() => setMoving(false)}
        >
          <div className="aspect-square w-full">
            <DemiSprite mood={mood} night={room === "bedroom" && settled} moving={moving} eyeX={still} eyeY={still} />
          </div>
        </motion.div>

        {/* one tap target per room */}
        {(Object.keys(ROOMS) as RoomId[]).map((id) => {
          const { box, name } = ROOMS[id]
          return (
            <button
              key={id}
              type="button"
              onClick={() => visit(id)}
              aria-label={`${name}${id === room ? " (Demi is here)" : ""}`}
              aria-pressed={id === room}
              className="absolute border-2 border-transparent outline-none transition-colors hover:border-signal/70 focus-visible:border-signal"
              style={{
                left: pct(box.x, W),
                top: pct(box.y, H),
                width: pct(box.w, W),
                height: pct(box.h, H),
              }}
            />
          )
        })}
      </motion.div>

      <p role="status" className="mt-4 mb-auto min-h-[2.5rem] max-w-md text-center text-sm text-paper/80">
        <span className="text-signal">{current.name}:</span> {line}
      </p>
    </motion.div>
  )
}
