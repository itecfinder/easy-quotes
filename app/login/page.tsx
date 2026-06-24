"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleContinue() {
    if (!email.includes("@")) return

    setLoading(true)

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        throw new Error("Login failed")
      }

      router.push("/dashboard")
    } catch (error) {
      console.error(error)
      alert("Unable to login")
    } finally {
      setLoading(false)
    }
  }

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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="w-full rounded-md border px-3 py-2 text-sm"
        />

        <Button
          onClick={handleContinue}
          disabled={!email.includes("@") || loading}
          className="w-full"
        >
          {loading ? "Continuing..." : "Continue"}
        </Button>
      </div>
    </div>
  )
}
