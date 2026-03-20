import * as React from "react"
import { Save, User, Building, Bell, Link as LinkIcon, Shield } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"

export function Settings() {
  return (
    <div className="flex flex-col h-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">Gerencie as preferências da sua conta e do sistema.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:grid-cols-5 h-auto">
          <TabsTrigger value="profile" className="flex gap-2 py-2"><User className="h-4 w-4" /> <span className="hidden sm:inline">Perfil</span></TabsTrigger>
          <TabsTrigger value="account" className="flex gap-2 py-2"><Building className="h-4 w-4" /> <span className="hidden sm:inline">Conta</span></TabsTrigger>
          <TabsTrigger value="notifications" className="flex gap-2 py-2"><Bell className="h-4 w-4" /> <span className="hidden sm:inline">Notificações</span></TabsTrigger>
          <TabsTrigger value="integrations" className="flex gap-2 py-2"><LinkIcon className="h-4 w-4" /> <span className="hidden sm:inline">Integrações</span></TabsTrigger>
          <TabsTrigger value="security" className="flex gap-2 py-2"><Shield className="h-4 w-4" /> <span className="hidden sm:inline">Segurança</span></TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Perfil Público</CardTitle>
              <CardDescription>
                Estas informações serão exibidas publicamente para outros usuários do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="https://i.pravatar.cc/150?u=admin" />
                  <AvatarFallback className="text-2xl">AD</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline">Alterar Foto</Button>
                  <p className="text-xs text-muted-foreground">JPG, GIF ou PNG. Máximo de 2MB.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nome</Label>
                  <Input id="firstName" defaultValue="Admin" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Sobrenome</Label>
                  <Input id="lastName" defaultValue="Usuário" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" defaultValue="admin@crmpro.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" defaultValue="(11) 99999-9999" />
                </div>
                <div className="space-y-2 col-span-1 md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input id="bio" defaultValue="Administrador do sistema." />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button className="gap-2"><Save className="h-4 w-4" /> Salvar Alterações</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Empresa</CardTitle>
              <CardDescription>
                Informações da sua empresa para faturamento e relatórios.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da Empresa</Label>
                <Input id="companyName" defaultValue="CRM Pro Inc." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input id="cnpj" defaultValue="00.000.000/0001-00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input id="address" defaultValue="Av. Paulista, 1000 - São Paulo, SP" />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button className="gap-2"><Save className="h-4 w-4" /> Salvar Alterações</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>
                Escolha como você deseja ser notificado sobre atividades no CRM.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base">Novos Deals</Label>
                  <p className="text-sm text-muted-foreground">Receber notificação quando um novo deal for criado.</p>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base">Atividades Atrasadas</Label>
                  <p className="text-sm text-muted-foreground">Receber alerta diário sobre atividades vencidas.</p>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base">Resumo Semanal</Label>
                  <p className="text-sm text-muted-foreground">Receber e-mail com o resumo de vendas da semana.</p>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Integrações</CardTitle>
              <CardDescription>
                Conecte o CRM com outras ferramentas que você usa.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 font-bold">G</div>
                  <div>
                    <Label className="text-base">Google Workspace</Label>
                    <p className="text-sm text-muted-foreground">Sincronize e-mails e calendário.</p>
                  </div>
                </div>
                <Button variant="outline">Conectar</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-md flex items-center justify-center text-green-600 font-bold">W</div>
                  <div>
                    <Label className="text-base">WhatsApp API</Label>
                    <p className="text-sm text-muted-foreground">Envie mensagens diretamente do CRM.</p>
                  </div>
                </div>
                <Button variant="outline">Conectar</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>
                Gerencie sua senha e configurações de segurança.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input id="confirmPassword" type="password" />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button className="gap-2"><Save className="h-4 w-4" /> Atualizar Senha</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
