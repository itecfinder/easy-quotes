import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)

    const email = body?.email?.trim()

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { message: "Invalid email" },
        { status: 400 }
      )
    }

    // OPTIONAL: normalize email
    const normalizedEmail = email.toLowerCase()

    //  Example: pretend "login"
    // In real apps: check DB / send OTP / create session

    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    )

    //  Example session cookie (replace with real auth later)
    response.cookies.set("session", normalizedEmail, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("LOGIN_ROUTE_ERROR:", error)

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    )
  }
}

