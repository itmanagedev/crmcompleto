import * as React from "react"
import { useNavigate, Link, useSearchParams } from "react-router-dom"
import { Building2, Lock, Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"

export function ResetPassword() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.")
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.")
      setIsLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      setSuccess(true)
      setIsLoading(false)
    }, 1500)
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50">
        <div className="mx-auto w-full max-w-md space-y-6 bg-white p-8 rounded-xl shadow-sm border text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-destructive">Token Inválido</h1>
          <p className="text-sm text-muted-foreground">
            O link de redefinição de senha é inválido ou expirou.
          </p>
          <Button className="w-full" onClick={() => navigate("/forgot-password")}>
            Solicitar novo link
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50">
      <div className="mx-auto w-full max-w-md space-y-6 bg-white p-8 rounded-xl shadow-sm border">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex items-center justify-center gap-2 font-bold text-2xl mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            CRM Pro
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Redefinir Senha</h1>
          <p className="text-sm text-muted-foreground">
            Crie uma nova senha para sua conta
          </p>
        </div>

        {success ? (
          <div className="space-y-4">
            <div className="p-4 text-sm text-emerald-700 bg-emerald-50 rounded-md border border-emerald-200">
              Sua senha foi redefinida com sucesso!
            </div>
            <Button className="w-full" onClick={() => navigate("/login")}>
              Ir para o Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">Nova Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Redefinir Senha
            </Button>
          </form>
        )}

        <div className="text-center">
          <Link to="/login" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  )
}
