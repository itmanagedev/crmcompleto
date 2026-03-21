import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Mail, Phone, MessageSquare, Linkedin, Globe, Calendar, Clock, Edit2, Plus, FileText, CheckCircle2, XCircle, Tag, Building2, User, MapPin, DollarSign, Users } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Badge } from "@/src/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { CompanyFormDialog, Company } from "./components/CompanyFormDialog"

// Mock Data
const INITIAL_COMPANY: Company = {
  id: '1', name: 'TechCorp Solutions', industry: 'Tecnologia da Informação', size: '500-1000 funcionários', 
  revenue: 'R$ 50M - 100M', city: 'São Paulo', state: 'SP',
  email: 'contato@techcorp.com', phone: '+55 11 3000-4321',
  linkedin: 'linkedin.com/company/techcorp', website: 'techcorp.com',
  address: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100',
  createdAt: '2025-10-15', lastActivity: '2026-03-18T14:30:00Z',
  status: 'active', tags: ['Enterprise', 'Key Account', 'SaaS'], owner: 'João Silva',
  contactsCount: 5, dealsCount: 2, cnpj: '12.345.678/0001-90'
} as any

const CONTACTS = [
  { id: '1', name: 'Ana Silva', role: 'Diretora de TI', email: 'ana@techcorp.com', phone: '(11) 98765-4321', avatar: 'https://i.pravatar.cc/150?u=ana' },
  { id: '2', name: 'Pedro Gomes', role: 'Gerente de Infra', email: 'pedro@techcorp.com', phone: '(11) 91234-5678', avatar: 'https://i.pravatar.cc/150?u=pedro' },
]

const DEALS = [
  { id: 'D-101', title: 'Licenciamento Enterprise', value: 125000, stage: 'Proposta Enviada', status: 'open', date: '2026-03-15' },
  { id: 'D-085', title: 'Consultoria Inicial', value: 15000, stage: 'Fechado Ganho', status: 'won', date: '2025-11-20' },
  { id: 'D-042', title: 'Treinamento de Equipe', value: 8000, stage: 'Fechado Perdido', status: 'lost', date: '2025-08-10' },
]

export function CompanyProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = React.useState('overview')
  const [company, setCompany] = React.useState<Company>(INITIAL_COMPANY)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)

  const handleSaveCompany = (updatedData: Partial<Company>) => {
    setCompany({ ...company, ...updatedData } as Company)
  }

  return (
    <div className="flex flex-col h-full space-y-6 max-w-7xl mx-auto w-full pb-10">
      <CompanyFormDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
        company={company} 
        onSave={handleSaveCompany} 
      />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/companies')} className="h-8 w-8 rounded-full">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            {company.name}
            {company.status === 'active' && <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 ml-2">Ativa</Badge>}
            {company.status === 'prospect' && <Badge variant="secondary" className="bg-blue-100 text-blue-700 ml-2">Prospect</Badge>}
            {company.status === 'inactive' && <Badge variant="secondary" className="bg-slate-100 text-slate-700 ml-2">Inativa</Badge>}
          </h1>
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            <Globe className="h-3 w-3" /> <a href={`https://${company.website}`} target="_blank" rel="noreferrer" className="hover:underline">{company.website}</a>
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}><Edit2 className="h-4 w-4 mr-2" /> Editar</Button>
          <Button size="sm"><Plus className="h-4 w-4 mr-2" /> Novo Deal</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN - Company Card */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-slate-800 to-slate-600"></div>
            <CardContent className="pt-0 relative px-6 pb-6">
              <div className="flex justify-center -mt-12 mb-4">
                <div className="h-24 w-24 rounded-lg border-4 border-background bg-white shadow-sm flex items-center justify-center text-3xl font-bold text-slate-800">
                  {company.name.substring(0, 2).toUpperCase()}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-3 text-sm pt-2">
                  <div className="flex items-start gap-3">
                    <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-xs">Segmento</span>
                      <span className="font-medium">{company.industry}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-xs">Porte</span>
                      <span className="font-medium">{company.size}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-xs">Faturamento Estimado</span>
                      <span className="font-medium">{company.revenue}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-xs">CNPJ</span>
                      <span className="font-medium">{(company as any).cnpj || 'Não informado'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Tags</span>
                    <Button variant="ghost" size="icon" className="h-5 w-5"><Plus className="h-3 w-3" /></Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {company.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 bg-muted/50 hover:bg-muted cursor-pointer flex items-center gap-1">
                        <Tag className="h-2.5 w-2.5" /> {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Responsável</span>
                    <span className="font-medium flex items-center gap-1"><User className="h-3 w-3" /> {company.owner}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Criada em</span>
                    <span className="font-medium">{new Date((company as any).createdAt || new Date()).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CENTER COLUMN - Main Content */}
        <div className="lg:col-span-6 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="contacts">Contatos ({CONTACTS.length})</TabsTrigger>
              <TabsTrigger value="deals">Deals ({DEALS.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Endereço</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{(company as any).address || `${company.city}, ${company.state}`}</span>
                  </div>
                  <div className="w-full h-[250px] bg-muted rounded-md overflow-hidden border relative">
                    {/* Mock Google Maps iframe */}
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                      <div className="text-center text-muted-foreground">
                        <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Mapa do Endereço</p>
                        <p className="text-xs mt-1">{company.city}, {company.state}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-muted-foreground text-xs">Telefone Principal</span>
                      <p className="font-medium">{(company as any).phone || 'Não informado'}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground text-xs">E-mail Geral</span>
                      <p className="font-medium">{(company as any).email || 'Não informado'}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground text-xs">LinkedIn</span>
                      <p className="font-medium text-primary hover:underline cursor-pointer">{(company as any).linkedin || 'Não informado'}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground text-xs">Website</span>
                      <p className="font-medium text-primary hover:underline cursor-pointer">{company.website}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contacts" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Contatos Vinculados</CardTitle>
                    <CardDescription>Pessoas que trabalham nesta empresa.</CardDescription>
                  </div>
                  <Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-2" /> Adicionar</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {CONTACTS.map(contact => (
                      <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate(`/contacts/${contact.id}`)}>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={contact.avatar} />
                            <AvatarFallback>{contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm hover:underline">{contact.name}</span>
                            <span className="text-xs text-muted-foreground">{contact.role}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"><Mail className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"><Phone className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deals" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Histórico de Deals</CardTitle>
                    <CardDescription>Oportunidades de negócio com esta empresa.</CardDescription>
                  </div>
                  <Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-2" /> Novo Deal</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {DEALS.map(deal => (
                      <div key={deal.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate('/pipeline')}>
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-sm">{deal.title}</span>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Criado em {new Date(deal.date).toLocaleDateString('pt-BR')}</span>
                            <span>•</span>
                            <span className="font-semibold text-foreground">R$ {(deal.value).toLocaleString('pt-BR')}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {deal.status === 'won' && <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Ganho</Badge>}
                          {deal.status === 'lost' && <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200"><XCircle className="w-3 h-3 mr-1" /> Perdido</Badge>}
                          {deal.status === 'open' && <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200"><Clock className="w-3 h-3 mr-1" /> Em Andamento</Badge>}
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{deal.stage}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* RIGHT COLUMN - Info Panels */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                Resumo Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-900">
                <span className="text-xs font-medium uppercase tracking-wider opacity-80">Total Ganho</span>
                <p className="text-2xl font-bold mt-1">R$ 15.000</p>
                <span className="text-xs opacity-80">1 deal fechado</span>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-900">
                <span className="text-xs font-medium uppercase tracking-wider opacity-80">Pipeline Atual</span>
                <p className="text-2xl font-bold mt-1">R$ 125.000</p>
                <span className="text-xs opacity-80">1 deal em andamento</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                Campos Personalizados
                <Button variant="ghost" size="icon" className="h-6 w-6"><Edit2 className="h-3 w-3" /></Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Regime Tributário</span>
                <span className="font-medium">Lucro Real</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">SLA de Atendimento</span>
                <span className="font-medium text-amber-600">Premium (4h)</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Sistema ERP Atual</span>
                <span className="font-medium">SAP Business One</span>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
