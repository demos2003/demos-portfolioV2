// Shared motion constants so easing/timing feels consistent (not ad hoc)
// across every animated element on the public site.

// A bespoke ease -- gentle acceleration, soft settle. Used for entrance
// reveals instead of the default linear/ease-in-out curves.
export const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const

export const SPRING_SOFT = {
  type: "spring" as const,
  stiffness: 120,
  damping: 20,
  mass: 0.6,
}

export const SPRING_SNAPPY = {
  type: "spring" as const,
  stiffness: 260,
  damping: 20,
}

export const REVEAL_DISTANCE = 24
