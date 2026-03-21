import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Mail, Phone, MessageSquare, Linkedin, Globe, Calendar, Clock, Edit2, Plus, FileText, CheckCircle2, XCircle, Tag, Building2, User } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Badge } from "@/src/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { ContactFormDialog, Contact } from "./components/ContactFormDialog"

// Mock Data
const INITIAL_CONTACT: Contact = {
  id: '1', name: 'Ana Silva', company: 'TechCorp Solutions', role: 'Diretora de TI', 
  email: 'ana@techcorp.com', phone: '+55 11 98765-4321',
  lastContact: '2026-03-18T14:30:00Z',
  status: 'active', tags: ['VIP', 'Decisor', 'Tech'], owner: 'João Silva',
  avatar: 'https://i.pravatar.cc/150?u=ana'
}

const TIMELINE = [
  { id: 1, type: 'note', title: 'Nota Adicionada', desc: 'Cliente demonstrou interesse no plano Enterprise. Agendar demo na próxima semana.', date: '2026-03-18T14:30:00Z', user: 'João Silva' },
  { id: 2, type: 'email', title: 'E-mail Enviado', desc: 'Apresentação institucional enviada com sucesso.', date: '2026-03-15T09:15:00Z', user: 'João Silva' },
  { id: 3, type: 'meeting', title: 'Reunião Realizada', desc: 'Call de alinhamento técnico com a equipe de infra.', date: '2026-03-10T10:00:00Z', user: 'Maria Souza' },
  { id: 4, type: 'call', title: 'Ligação Recebida', desc: 'Dúvidas sobre integração com ERP legado.', date: '2026-03-05T16:45:00Z', user: 'João Silva' },
]

const DEALS = [
  { id: 'D-101', title: 'Licenciamento Enterprise', value: 125000, stage: 'Proposta Enviada', status: 'open' },
  { id: 'D-085', title: 'Consultoria Inicial', value: 15000, stage: 'Fechado Ganho', status: 'won' },
]

export function ContactProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = React.useState('timeline')
  const [contact, setContact] = React.useState<Contact>(INITIAL_CONTACT)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'note': return <FileText className="h-4 w-4 text-amber-500" />
      case 'email': return <Mail className="h-4 w-4 text-blue-500" />
      case 'meeting': return <Calendar className="h-4 w-4 text-emerald-500" />
      case 'call': return <Phone className="h-4 w-4 text-purple-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const handleSaveContact = (updatedData: Partial<Contact>) => {
    setContact({ ...contact, ...updatedData } as Contact)
  }

  return (
    <div className="flex flex-col h-full space-y-6 max-w-7xl mx-auto w-full pb-10">
      <ContactFormDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
        contact={contact} 
        onSave={handleSaveContact} 
      />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/contacts')} className="h-8 w-8 rounded-full">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            {contact.name}
            {contact.status === 'active' && <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 ml-2">Ativo</Badge>}
            {contact.status === 'lead' && <Badge variant="secondary" className="bg-blue-100 text-blue-700 ml-2">Lead</Badge>}
            {contact.status === 'inactive' && <Badge variant="secondary" className="bg-slate-100 text-slate-700 ml-2">Inativo</Badge>}
          </h1>
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            <Building2 className="h-3 w-3" /> {contact.role} em <span className="font-medium hover:underline cursor-pointer" onClick={() => navigate('/companies/1')}>{contact.company}</span>
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}><Edit2 className="h-4 w-4 mr-2" /> Editar</Button>
          <Button size="sm"><Plus className="h-4 w-4 mr-2" /> Nova Ação</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN - Contact Card */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <CardContent className="pt-0 relative px-6 pb-6">
              <div className="flex justify-center -mt-12 mb-4">
                <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
                  <AvatarImage src={contact.avatar} />
                  <AvatarFallback className="text-2xl">{contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-center gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"><Mail className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-200"><MessageSquare className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100 border-purple-200"><Phone className="h-4 w-4" /></Button>
                </div>

                <div className="space-y-3 text-sm pt-4 border-t">
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-xs">E-mail</span>
                      <a href={`mailto:${contact.email}`} className="font-medium hover:underline text-primary">{contact.email}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-xs">Telefone</span>
                      <a href={`tel:${contact.phone}`} className="font-medium hover:underline text-primary">{contact.phone}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Linkedin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-xs">LinkedIn</span>
                      <a href={`https://${(contact as any).linkedin || 'linkedin.com/in/' + contact.name.toLowerCase().replace(' ', '')}`} target="_blank" rel="noreferrer" className="font-medium hover:underline text-primary">{(contact as any).linkedin || 'Não informado'}</a>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Tags</span>
                    <Button variant="ghost" size="icon" className="h-5 w-5"><Plus className="h-3 w-3" /></Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {contact.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 bg-muted/50 hover:bg-muted cursor-pointer flex items-center gap-1">
                        <Tag className="h-2.5 w-2.5" /> {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Responsável</span>
                    <span className="font-medium flex items-center gap-1"><User className="h-3 w-3" /> {contact.owner}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Criado em</span>
                    <span className="font-medium">{new Date((contact as any).createdAt || new Date()).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CENTER COLUMN - Timeline */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg">Atividades</CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-6">
              
              {/* Quick Note Input */}
              <div className="bg-card border rounded-lg p-4 shadow-sm focus-within:ring-1 focus-within:ring-primary transition-all">
                <textarea 
                  className="w-full bg-transparent border-none resize-none focus:outline-none text-sm min-h-[60px] placeholder:text-muted-foreground"
                  placeholder="Adicione uma nota, registre uma ligação ou mencione alguém usando @..."
                />
                <div className="flex justify-between items-center mt-2 pt-2 border-t">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"><FileText className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"><Phone className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"><Calendar className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"><Mail className="h-4 w-4" /></Button>
                  </div>
                  <Button size="sm" className="h-8">Salvar</Button>
                </div>
              </div>

              {/* Timeline Feed */}
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                {TIMELINE.map((item, index) => (
                  <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-muted text-muted-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      {getActivityIcon(item.type)}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card p-4 rounded-lg border shadow-sm group-hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-sm">{item.title}</h4>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{item.desc}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                        <span className="flex items-center gap-1"><Avatar className="h-4 w-4"><AvatarFallback className="text-[8px]">{item.user[0]}</AvatarFallback></Avatar> {item.user}</span>
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] uppercase tracking-wider">Detalhes</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN - Info Panels */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                Deals Relacionados
                <Button variant="ghost" size="icon" className="h-6 w-6"><Plus className="h-3 w-3" /></Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {DEALS.map(deal => (
                <div key={deal.id} className="flex flex-col p-3 border rounded-md bg-muted/20 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate('/pipeline')}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm truncate pr-2">{deal.title}</span>
                    <span className="text-xs font-bold whitespace-nowrap">R$ {(deal.value/1000).toFixed(0)}k</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal">{deal.stage}</Badge>
                    {deal.status === 'won' ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <Clock className="h-3 w-3 text-amber-500" />}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                Empresa
                <Button variant="ghost" size="icon" className="h-6 w-6"><Edit2 className="h-3 w-3" /></Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-3 border rounded-md bg-muted/20 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate('/companies/1')}>
                <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {contact.company.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="font-medium text-sm truncate">{contact.company}</span>
                  <span className="text-xs text-muted-foreground truncate">Tecnologia da Informação</span>
                </div>
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
                <span className="text-xs text-muted-foreground">Origem do Lead</span>
                <span className="font-medium">Indicação (Referral)</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">NPS Score</span>
                <span className="font-medium text-emerald-600">9 (Promotor)</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Aniversário</span>
                <span className="font-medium">12 de Agosto</span>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
