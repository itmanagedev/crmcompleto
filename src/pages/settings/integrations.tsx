import * as React from "react"
import { Mail, Calendar, MessageSquare, BarChart, Link as LinkIcon, Zap, CheckCircle2, XCircle, Settings2 } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"

const INTEGRATIONS = [
  {
    id: 'gmail',
    name: 'Gmail / Outlook',
    description: 'Sincronize seus e-mails enviados e recebidos diretamente no histórico de contatos e negócios.',
    icon: Mail,
    status: 'connected',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
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
                    <Button variant="outline" size="sm" className="text-muted-foreground">
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
    </div>
  )
}
