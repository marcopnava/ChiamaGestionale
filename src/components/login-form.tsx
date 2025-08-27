"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FlipButton } from "@/components/ui/shadcn-io/flip-button"
import { Input } from "@/components/ui/input"
import LoginEffect from "@/components/login/LoginEffect"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showEffect, setShowEffect] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        setShowEffect(true)
        setTimeout(() => {
          router.push("/")
        }, 2000)
      } else {
        alert("Credenziali non valide")
      }
    } catch (error) {
      console.error("Errore login:", error)
      alert("Errore durante il login")
    } finally {
      setLoading(false)
    }
  }

  if (showEffect) {
    return <LoginEffect />
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Accedi al tuo account
        </h1>
        <p className="text-sm text-muted-foreground">
          Inserisci le tue credenziali per accedere
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="mario@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FlipButton
              type="button"
              frontText={showPassword ? "Nascondi" : "Mostra"}
              backText={showPassword ? "Nascondi" : "Mostra"}
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>

        <FlipButton
          type="submit"
          frontText={loading ? "Accesso in corso..." : "Accedi"}
          backText={loading ? "Accesso in corso..." : "Accedi"}
          className="w-full"
          disabled={loading}
        />
      </form>

      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Credenziali demo: admin@chiama.io / admin123
        </p>
      </div>
    </div>
  )
} 