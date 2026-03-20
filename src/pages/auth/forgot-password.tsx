import * as React from "react"
import { useNavigate, Link } from "react-router-dom"
import { Building2, Mail, Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"

export function ForgotPassword() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [success, setSuccess] = React.useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setSuccess(true)
      setIsLoading(false)
    }, 1500)
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
          <h1 className="text-2xl font-semibold tracking-tight">Recuperar Senha</h1>
          <p className="text-sm text-muted-foreground">
            Digite seu e-mail para receber um link de redefinição de senha
          </p>
        </div>

        {success ? (
          <div className="space-y-4">
            <div className="p-4 text-sm text-emerald-700 bg-emerald-50 rounded-md border border-emerald-200">
              Enviamos um link de recuperação para <strong>{email}</strong>. Verifique sua caixa de entrada.
            </div>
            <Button className="w-full" onClick={() => navigate("/login")}>
              Voltar para o Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enviar Link
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
