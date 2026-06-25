import { NextResponse } from "next/server"
import crypto from "crypto"

const SECRET = process.env.SESSION_SECRET || "dev-secret"

function sign(value: string) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex")
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email" },
        { status: 400 }
      )
    }

    const payload = JSON.stringify({ email, loggedIn: true })
    const signature = sign(payload)

    const token = Buffer.from(payload).toString("base64") + "." + signature

    const response = NextResponse.json({
      success: true,
      user: { email },
    })

    response.cookies.set({
      name: "session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    console.error("Login error:", error)

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

