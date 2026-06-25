import { NextResponse } from "next/server"
import crypto from "crypto"

const SECRET = process.env.SESSION_SECRET || "dev-secret"

function sign(value: string) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex")
}

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || ""
    const match = cookie.match(/session=([^;]+)/)

    if (!match) {
      return NextResponse.json({ loggedIn: false })
    }

    const token = match[1]
    const [encoded, signature] = token.split(".")

    if (!encoded || !signature) {
      return NextResponse.json({ loggedIn: false })
    }

    const payload = Buffer.from(encoded, "base64").toString("utf-8")

    if (sign(payload) !== signature) {
      return NextResponse.json({ loggedIn: false })
    }

    const user = JSON.parse(payload)

    return NextResponse.json({
      loggedIn: true,
      user,
    })
  } catch (error) {
    return NextResponse.json({ loggedIn: false })
  }
}
