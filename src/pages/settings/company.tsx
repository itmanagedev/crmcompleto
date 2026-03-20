import * as React from "react"
import { Building2, Save, Loader2, Mail, TestTube } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/src/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"

export function CompanySettings() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [isTestingEmail, setIsTestingEmail] = React.useState(false)

  const handleSave = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  const handleTestEmail = () => {
    setIsTestingEmail(true)
    setTimeout(() => setIsTestingEmail(false), 1500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Empresa</h3>
        <p className="text-sm text-muted-foreground">
          Gerencie os dados da sua organização e configurações globais.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados da Empresa</CardTitle>
            <CardDescription>Informações públicas e de faturamento.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 rounded-lg">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                  <Building2 className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button variant="outline" size="sm">
                  Alterar Logo
                </Button>
                <p className="text-xs text-muted-foreground">
                  Formato quadrado recomendado. Máximo de 2MB.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company-name">Razão Social</Label>
                <Input id="company-name" defaultValue="CRM Pro Tecnologia Ltda" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input id="cnpj" defaultValue="12.345.678/0001-90" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Endereço Completo</Label>
                <Input id="address" defaultValue="Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Site</Label>
                <Input id="website" type="url" defaultValue="https://crmpro.com.br" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-email">E-mail de Suporte</Label>
                <Input id="support-email" type="email" defaultValue="suporte@crmpro.com.br" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Dados
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configurações de E-mail (SMTP)</CardTitle>
            <CardDescription>Configure o servidor de saída para envio de propostas e notificações.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="smtp-host">Servidor SMTP (Host)</Label>
                <Input id="smtp-host" defaultValue="smtp.sendgrid.net" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-port">Porta</Label>
                <Input id="smtp-port" defaultValue="587" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-user">Usuário</Label>
                <Input id="smtp-user" defaultValue="apikey" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-pass">Senha / API Key</Label>
                <Input id="smtp-pass" type="password" defaultValue="••••••••••••••••" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="smtp-from">E-mail de Remetente Padrão (From)</Label>
                <Input id="smtp-from" defaultValue="vendas@crmpro.com.br" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-signature">Assinatura de E-mail Padrão (HTML)</Label>
              <Textarea 
                id="email-signature" 
                className="font-mono text-sm h-32" 
                defaultValue={`<p>Atenciosamente,</p>\n<p><strong>Equipe de Vendas</strong><br/>CRM Pro Tecnologia</p>`}
              />
              <p className="text-xs text-muted-foreground">
                Esta assinatura será anexada ao final de todos os e-mails enviados pelo sistema.
              </p>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4 flex justify-between">
            <Button variant="outline" onClick={handleTestEmail} disabled={isTestingEmail}>
              {isTestingEmail ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TestTube className="mr-2 h-4 w-4" />}
              Testar Conexão
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Configurações
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
