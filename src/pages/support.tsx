import * as React from "react"
import { HelpCircle, MessageCircle, FileText, ExternalLink, Mail } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"

export function Support() {
  return (
    <div className="flex flex-col h-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Suporte</h1>
        <p className="text-muted-foreground">Precisa de ajuda? Encontre respostas ou entre em contato conosco.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Perguntas Frequentes (FAQ)</CardTitle>
            <CardDescription>Respostas para as dúvidas mais comuns dos nossos usuários.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2"><HelpCircle className="h-4 w-4 text-primary" /> Como importar contatos?</h3>
              <p className="text-sm text-muted-foreground">
                Vá até a página de Contatos, clique em "Importar" no canto superior direito e faça o upload de um arquivo CSV seguindo o nosso template padrão.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2"><HelpCircle className="h-4 w-4 text-primary" /> Posso personalizar os estágios do pipeline?</h3>
              <p className="text-sm text-muted-foreground">
                Sim. Acesse Configurações &gt; Conta &gt; Pipeline para adicionar, remover ou renomear os estágios do seu funil de vendas.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2"><HelpCircle className="h-4 w-4 text-primary" /> Como funciona a integração com o WhatsApp?</h3>
              <p className="text-sm text-muted-foreground">
                A integração permite enviar mensagens diretamente do CRM. É necessário ter uma conta na API Oficial do WhatsApp Business. Acesse Configurações &gt; Integrações para configurar.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2"><HelpCircle className="h-4 w-4 text-primary" /> Onde encontro meus relatórios exportados?</h3>
              <p className="text-sm text-muted-foreground">
                Os relatórios exportados são baixados automaticamente para o seu dispositivo. Uma cópia também fica salva na aba "Arquivos" do respectivo Deal ou Empresa.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fale Conosco</CardTitle>
              <CardDescription>Envie uma mensagem para nossa equipe de suporte.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Assunto</Label>
                <Input id="subject" placeholder="Ex: Dúvida sobre faturamento" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <textarea 
                  id="message" 
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Descreva seu problema ou dúvida..."
                />
              </div>
              <Button className="w-full gap-2"><Mail className="h-4 w-4" /> Enviar Mensagem</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recursos Úteis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <FileText className="h-4 w-4" /> Documentação da API
                <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <MessageCircle className="h-4 w-4" /> Fórum da Comunidade
                <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
