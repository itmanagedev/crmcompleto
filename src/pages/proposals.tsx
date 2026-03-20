import * as React from "react"
import { Search, Plus, Filter, MoreHorizontal, FileText, Calendar, CheckCircle2, XCircle, Clock } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"

interface Proposal {
  id: string
  title: string
  client: string
  value: number
  status: 'draft' | 'sent' | 'accepted' | 'rejected'
  date: string
  validUntil: string
}

const MOCK_PROPOSALS: Proposal[] = [
  { id: 'PROP-001', title: 'Licenciamento Anual Enterprise', client: 'TechCorp Solutions', value: 125000, status: 'sent', date: '2026-03-15', validUntil: '2026-04-15' },
  { id: 'PROP-002', title: 'Consultoria de Implantação', client: 'Global Industries', value: 85000, status: 'accepted', date: '2026-03-10', validUntil: '2026-04-10' },
  { id: 'PROP-003', title: 'Upgrade de Servidores', client: 'Inova Sistemas', value: 45000, status: 'draft', date: '2026-03-18', validUntil: '2026-04-18' },
  { id: 'PROP-004', title: 'Auditoria de Segurança', client: 'Alpha Finance', value: 210000, status: 'rejected', date: '2026-02-28', validUntil: '2026-03-28' },
  { id: 'PROP-005', title: 'Treinamento de Equipe', client: 'Beta Corp', value: 35000, status: 'sent', date: '2026-03-16', validUntil: '2026-04-16' },
]

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const getStatusBadge = (status: Proposal['status']) => {
  switch (status) {
    case 'draft':
      return <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200"><Clock className="w-3 h-3 mr-1" /> Rascunho</Badge>
    case 'sent':
      return <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200"><FileText className="w-3 h-3 mr-1" /> Enviada</Badge>
    case 'accepted':
      return <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Aceita</Badge>
    case 'rejected':
      return <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-200"><XCircle className="w-3 h-3 mr-1" /> Recusada</Badge>
  }
}

export function Proposals() {
  const [proposals, setProposals] = React.useState<Proposal[]>(MOCK_PROPOSALS)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isNewProposalOpen, setIsNewProposalOpen] = React.useState(false)

  const filteredProposals = React.useMemo(() => {
    return proposals.filter(proposal => 
      proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [proposals, searchQuery])

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Propostas</h1>
          <p className="text-muted-foreground">Gerencie orçamentos e propostas comerciais.</p>
        </div>
        <Dialog open={isNewProposalOpen} onOpenChange={setIsNewProposalOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Nova Proposta</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Criar Nova Proposta</DialogTitle>
              <DialogDescription>
                Preencha os dados básicos da proposta. Você poderá adicionar itens depois.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="title">Título da Proposta</Label>
                  <Input id="title" placeholder="Ex: Proposta de Serviços" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="client">Cliente</Label>
                  <Input id="client" placeholder="Nome do cliente ou empresa" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">Valor Total (R$)</Label>
                  <Input id="value" type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validUntil">Validade</Label>
                  <Input id="validUntil" type="date" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={() => setIsNewProposalOpen(false)}>Criar Rascunho</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por título, cliente ou ID..." 
            className="pl-9 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filtros</span>
        </Button>
      </div>

      <div className="bg-card border rounded-lg shadow-sm overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-3 font-medium">ID / Título</th>
                <th className="px-6 py-3 font-medium">Cliente</th>
                <th className="px-6 py-3 font-medium">Valor</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Datas</th>
                <th className="px-6 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProposals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    Nenhuma proposta encontrada.
                  </td>
                </tr>
              ) : (
                filteredProposals.map((proposal) => (
                  <tr key={proposal.id} className="bg-card hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{proposal.title}</span>
                        <span className="text-muted-foreground text-xs">{proposal.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-muted-foreground">{proposal.client}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium">{formatCurrency(proposal.value)}</span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(proposal.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1 text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          Criada: {new Intl.DateTimeFormat('pt-BR').format(new Date(proposal.date))}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          Válida: {new Intl.DateTimeFormat('pt-BR').format(new Date(proposal.validUntil))}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
