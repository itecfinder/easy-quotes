"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
async function handleContinue() {
  const cleanEmail = email.trim()

  if (!isValidEmail(cleanEmail)) {
    setError("Enter a valid email")
    return
  }

  if (loading) return

  setLoading(true)
  setError(null)

  try {
    localStorage.setItem("pending_email", cleanEmail)

    const res = await fetch("/api/verify-membership", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: cleanEmail,
      }),
    })

   const data = await res.json().catch(() => null)

if (!res.ok) {
  throw new Error(
    data?.message || "Unable to verify account"
  )
}

    console.log("ACCESS:", data)

    if (
      data.access === "paid" ||
      data.access === "free" ||
      data.access === "lead"
    ) {
      document.cookie = `token=${cleanEmail}; path=/; max-age=2592000`
      document.cookie = `access=${data.access}; path=/; max-age=2592000`

      router.push("/dashboard")
      return
    }

    throw new Error("Unknown access level")
  } catch (err: any) {
    console.error(err)
    setError(
      err.message || "Unable to continue"
    )
  } finally {
    setLoading(false)
  }
}

  const valid = isValidEmail(email.trim())

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm space-y-6">

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">Welcome</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to continue
          </p>
        </div>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="w-full rounded-md border px-3 py-2 text-sm"
        />

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <Button
          onClick={handleContinue}
          disabled={!valid || loading}
          className="w-full"
        >
          {loading ? "Continuing..." : "Continue"}
        </Button>
      </div>
    </div>
  )
}
