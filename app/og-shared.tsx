import { readFile } from "node:fs/promises"
import path from "node:path"
import { ImageResponse } from "next/og"

export const runtime = "nodejs"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const fontsDir = path.join(process.cwd(), "app", "fonts")

export async function generateOgImage() {
  const [fraunces, interRegular, interMedium] = await Promise.all([
    readFile(path.join(fontsDir, "Fraunces-SemiBold.woff")),
    readFile(path.join(fontsDir, "Inter-Regular.woff")),
    readFile(path.join(fontsDir, "Inter-Medium.woff")),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#101010",
          padding: "90px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -160,
            width: 560,
            height: 560,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(181,113,75,0.18), rgba(16,16,16,0) 70%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 40 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 9,
              backgroundColor: "#2A1B12",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Fraunces",
              fontSize: 26,
              color: "#B5714B",
            }}
          >
            D
          </div>
          <div
            style={{
              fontFamily: "Inter",
              fontSize: 22,
              letterSpacing: 3,
              color: "rgba(244,240,234,0.5)",
            }}
          >
            DEMOS
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: "Fraunces",
            fontWeight: 600,
            fontSize: 116,
            lineHeight: 0.95,
            color: "#F4F0EA",
          }}
        >
          <span>Software</span>
          <span style={{ color: "#B5714B" }}>Engineer</span>
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "Inter",
            fontWeight: 400,
            fontSize: 30,
            color: "rgba(244,240,234,0.6)",
            marginTop: 40,
            maxWidth: 760,
          }}
        >
          Full-stack software engineer building thoughtful, fast, well-crafted products.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: fraunces, style: "normal", weight: 600 },
        { name: "Inter", data: interRegular, style: "normal", weight: 400 },
        { name: "Inter", data: interMedium, style: "normal", weight: 500 },
      ],
    }
  )
}
