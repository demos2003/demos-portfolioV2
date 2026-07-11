// Usage: node scripts/hash-password.mjs <your-password>
// Prints a bcrypt hash to put in ADMIN_PASSWORD_HASH in .env.local
import bcrypt from "bcryptjs"

const password = process.argv[2]

if (!password) {
  console.error("Usage: node scripts/hash-password.mjs <your-password>")
  process.exit(1)
}

const hash = bcrypt.hashSync(password, 12)

// Next.js's env loader (@next/env) expands unescaped `$` in .env values as
// variable references, which mangles a raw bcrypt hash. Escaping each `$` as
// `\$` is the only form that survives Next's loader unchanged (surrounding
// the value in quotes does NOT protect it -- Next strips the quotes before
// expanding). Paste the line below into .env.local as-is, unquoted.
const escaped = hash.replace(/\$/g, "\\$")
console.log(`ADMIN_PASSWORD_HASH=${escaped}`)
