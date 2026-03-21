import * as React from "react"
import { Mail, Calendar, MessageSquare, BarChart, Link as LinkIcon, Zap, CheckCircle2, XCircle, Settings2 } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"

const INTEGRATIONS = [
  {
    id: 'gmail',
    name: 'Gmail / Outlook',
    description: 'Sincronize seus e-mails enviados e recebidos diretamente no histórico de contatos e negócios.',
    icon: Mail,
    status: 'connected',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    settings: [
      { id: 'email', label: 'E-mail Conectado', type: 'email', value: 'contato@empresa.com' },
      { id: 'sync_frequency', label: 'Frequência de Sincronização', type: 'text', value: 'A cada 15 minutos' }
    ]
  },
  {
    id: 'gcal',
    name: 'Google Calendar',
    description: 'Sincronize suas reuniões e eventos agendados no CRM com sua agenda pessoal.',
    icon: Calendar,
    status: 'disconnected',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business API',
    description: 'Envie mensagens e crie automações de WhatsApp diretamente pelo CRM.',
    icon: MessageSquare,
    status: 'connected',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    settings: [
      { id: 'api_key', label: 'API Key', type: 'password', value: '************************' },
      { id: 'phone_number', label: 'Número Conectado', type: 'text', value: '+55 11 99999-9999' }
    ]
  },
  {
    id: 'analytics',
    name: 'Google Analytics',
    description: 'Acompanhe a origem dos seus leads e a conversão das suas campanhas de marketing.',
    icon: BarChart,
    status: 'disconnected',
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
  },
  {
    id: 'webhook',
    name: 'Webhooks Customizados',
    description: 'Envie dados para sistemas externos sempre que um negócio for ganho ou um contato criado.',
    icon: LinkIcon,
    status: 'connected',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
    settings: [
      { id: 'webhook_url', label: 'URL do Webhook', type: 'url', value: 'https://api.meusistema.com/webhook' },
      { id: 'secret', label: 'Secret Key', type: 'password', value: '************************' }
    ]
  },
  {
    id: 'zapier',
    name: 'Zapier / Make',
    description: 'Conecte o CRM a mais de 5.000 aplicativos através de plataformas de automação.',
    icon: Zap,
    status: 'disconnected',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
  },
]

export function IntegrationsSettings() {
  const [selectedIntegration, setSelectedIntegration] = React.useState<any>(null)
  const [isConfigOpen, setIsConfigOpen] = React.useState(false)

  const handleConfigure = (integration: any) => {
    setSelectedIntegration(integration)
    setIsConfigOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Integrações</h3>
        <p className="text-sm text-muted-foreground">
          Conecte o CRM com suas ferramentas favoritas para automatizar seu fluxo de trabalho.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {INTEGRATIONS.map((integration) => {
          const Icon = integration.icon
          const isConnected = integration.status === 'connected'

          return (
            <Card key={integration.id} className="flex flex-col">
              <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
                <div className={`p-3 rounded-xl ${integration.bgColor}`}>
                  <Icon className={`h-6 w-6 ${integration.color}`} />
                </div>
                <div className="flex-1 space-y-1">
                  <CardTitle className="text-base flex items-center justify-between">
                    {integration.name}
                    {isConnected ? (
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                        <CheckCircle2 className="mr-1 h-3 w-3" /> Conectado
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Desconectado
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-sm line-clamp-2">
                    {integration.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardFooter className="mt-auto pt-4 border-t flex justify-between">
                {isConnected ? (
                  <>
                    <Button variant="outline" size="sm" className="text-muted-foreground" onClick={() => handleConfigure(integration)}>
                      <Settings2 className="mr-2 h-4 w-4" />
                      Configurar
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      Desconectar
                    </Button>
                  </>
                ) : (
                  <Button className="w-full" variant="secondary">
                    Conectar
                  </Button>
                )}
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Configurar {selectedIntegration?.name}</DialogTitle>
            <DialogDescription>
              Ajuste as configurações da integração.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedIntegration?.settings?.map((setting: any) => (
              <div key={setting.id} className="grid gap-2">
                <Label htmlFor={setting.id}>{setting.label}</Label>
                <Input
                  id={setting.id}
                  type={setting.type}
                  defaultValue={setting.value}
                />
              </div>
            ))}
            {!selectedIntegration?.settings && (
              <p className="text-sm text-muted-foreground">Nenhuma configuração adicional disponível para esta integração.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfigOpen(false)}>Cancelar</Button>
            <Button onClick={() => setIsConfigOpen(false)}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
