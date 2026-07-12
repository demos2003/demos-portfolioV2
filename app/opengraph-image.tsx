export { size, contentType, runtime } from "./og-shared"
import { generateOgImage } from "./og-shared"

export default async function Image() {
  return generateOgImage()
}
