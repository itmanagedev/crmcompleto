import * as React from "react"
import { Search, Plus, Filter, MoreHorizontal, FileText, Calendar, CheckCircle2, XCircle, Clock, Eye, Copy, Send, Check } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom"
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'

interface Proposal {
  id: string
  title: string
  client: string
  value: number
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired'
  date: string
  validUntil: string
  owner: string
}

const MOCK_PROPOSALS: Proposal[] = [
  { id: 'PROP-001', title: 'Licenciamento Anual Enterprise', client: 'TechCorp Solutions', value: 125000, status: 'sent', date: '2026-03-15', validUntil: '2026-04-15', owner: 'Ana Silva' },
  { id: 'PROP-002', title: 'Consultoria de Implantação', client: 'Global Industries', value: 85000, status: 'accepted', date: '2026-03-10', validUntil: '2026-04-10', owner: 'Carlos Mendes' },
  { id: 'PROP-003', title: 'Upgrade de Servidores', client: 'Inova Sistemas', value: 45000, status: 'draft', date: '2026-03-18', validUntil: '2026-04-18', owner: 'Mariana Costa' },
  { id: 'PROP-004', title: 'Auditoria de Segurança', client: 'Alpha Finance', value: 210000, status: 'rejected', date: '2026-02-28', validUntil: '2026-03-28', owner: 'Roberto Alves' },
  { id: 'PROP-005', title: 'Treinamento de Equipe', client: 'Beta Corp', value: 35000, status: 'viewed', date: '2026-03-16', validUntil: '2026-04-16', owner: 'Ana Silva' },
  { id: 'PROP-006', title: 'Suporte Técnico 24/7', client: 'Gama Logistics', value: 15000, status: 'expired', date: '2026-01-15', validUntil: '2026-02-15', owner: 'Carlos Mendes' },
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
      return <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200"><Send className="w-3 h-3 mr-1" /> Enviada</Badge>
    case 'viewed':
      return <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-200"><Eye className="w-3 h-3 mr-1" /> Visualizada</Badge>
    case 'accepted':
      return <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Aceita</Badge>
    case 'rejected':
      return <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-200"><XCircle className="w-3 h-3 mr-1" /> Recusada</Badge>
    case 'expired':
      return <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-200"><Clock className="w-3 h-3 mr-1" /> Expirada</Badge>
  }
}

// --- PDF Styles ---
const pdfStyles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, color: '#333' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40, borderBottom: '2px solid #3b82f6', paddingBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#3b82f6' },
  subtitle: { fontSize: 12, color: '#666', marginTop: 4 },
  section: { marginBottom: 20 },
  table: { width: '100%', borderStyle: 'solid', borderWidth: 1, borderColor: '#eee', borderRightWidth: 0, borderBottomWidth: 0 },
  tableRow: { flexDirection: 'row' },
  tableColHeader: { width: '75%', borderStyle: 'solid', borderWidth: 1, borderColor: '#eee', borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#f9fafb', padding: 5, fontWeight: 'bold' },
  tableColHeaderValue: { width: '25%', borderStyle: 'solid', borderWidth: 1, borderColor: '#eee', borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#f9fafb', padding: 5, fontWeight: 'bold' },
  tableCol: { width: '75%', borderStyle: 'solid', borderWidth: 1, borderColor: '#eee', borderLeftWidth: 0, borderTopWidth: 0, padding: 5 },
  tableColValue: { width: '25%', borderStyle: 'solid', borderWidth: 1, borderColor: '#eee', borderLeftWidth: 0, borderTopWidth: 0, padding: 5 },
  totals: { marginTop: 20, alignItems: 'flex-end' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', width: 200, marginBottom: 5 },
  totalLabel: { fontWeight: 'bold' },
  totalValue: { textAlign: 'right' },
  finalTotal: { fontSize: 14, fontWeight: 'bold', color: '#3b82f6', marginTop: 5, borderTop: '1px solid #eee', paddingTop: 5 },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', color: '#999', fontSize: 8, borderTop: '1px solid #eee', paddingTop: 10 }
})

const SimpleProposalPDF = ({ proposal }: { proposal: Proposal }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <View style={pdfStyles.header}>
        <View>
          <Text style={pdfStyles.title}>{proposal.title}</Text>
          <Text style={pdfStyles.subtitle}>Para: {proposal.client}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text>Data: {new Date(proposal.date).toLocaleDateString('pt-BR')}</Text>
          <Text>Validade: {new Date(proposal.validUntil).toLocaleDateString('pt-BR')}</Text>
        </View>
      </View>

      <View style={pdfStyles.section}>
        <Text>Apresentamos nossa proposta comercial para os serviços solicitados.</Text>
      </View>

      <View style={pdfStyles.table}>
        <View style={pdfStyles.tableRow}>
          <View style={pdfStyles.tableColHeader}><Text>Descrição</Text></View>
          <View style={pdfStyles.tableColHeaderValue}><Text>Valor Total</Text></View>
        </View>
        <View style={pdfStyles.tableRow}>
          <View style={pdfStyles.tableCol}><Text>{proposal.title}</Text></View>
          <View style={pdfStyles.tableColValue}><Text>R$ {proposal.value.toFixed(2)}</Text></View>
        </View>
      </View>

      <View style={pdfStyles.totals}>
        <View style={pdfStyles.totalRow}>
          <Text style={pdfStyles.totalLabel}>Total Final:</Text>
          <Text style={{ ...pdfStyles.totalValue, ...pdfStyles.finalTotal }}>R$ {proposal.value.toFixed(2)}</Text>
        </View>
      </View>

      <Text style={pdfStyles.footer} render={({ pageNumber, totalPages }) => (
        `Proposta Comercial gerada pelo CRM Pro - Página ${pageNumber} de ${totalPages}`
      )} fixed />
    </Page>
  </Document>
)

export function ProposalsList() {
  const navigate = useNavigate()
  const [proposals, setProposals] = React.useState<Proposal[]>(MOCK_PROPOSALS)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")

  const filteredProposals = React.useMemo(() => {
    return proposals.filter(proposal => {
      const matchesSearch = proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            proposal.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            proposal.id.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || proposal.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [proposals, searchQuery, statusFilter])

  const handleAction = async (id: string, action: string) => {
    if (action === 'view') {
      const proposal = proposals.find(p => p.id === id)
      if (proposal) {
        const blob = await pdf(<SimpleProposalPDF proposal={proposal} />).toBlob()
        const url = URL.createObjectURL(blob)
        window.open(url, '_blank')
      }
    } else if (action === 'accept') {
      setProposals(prev => prev.map(p => p.id === id ? { ...p, status: 'accepted' } : p))
    } else if (action === 'duplicate') {
      const propToDuplicate = proposals.find(p => p.id === id)
      if (propToDuplicate) {
        const newProp = { ...propToDuplicate, id: `PROP-00${proposals.length + 1}`, status: 'draft' as const, date: new Date().toISOString().split('T')[0] }
        setProposals([newProp, ...proposals])
      }
    }
  }

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Propostas Comerciais</h1>
          <p className="text-muted-foreground">Gerencie orçamentos e propostas comerciais.</p>
        </div>
        <Button onClick={() => navigate('/proposals/new')}><Plus className="h-4 w-4 mr-2" /> Nova Proposta</Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por empresa ou nº da proposta..." 
            className="pl-9 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="draft">Rascunho</SelectItem>
              <SelectItem value="sent">Enviada</SelectItem>
              <SelectItem value="viewed">Visualizada</SelectItem>
              <SelectItem value="accepted">Aceita</SelectItem>
              <SelectItem value="rejected">Recusada</SelectItem>
              <SelectItem value="expired">Expirada</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Mais Filtros</span>
          </Button>
        </div>
      </div>

      <div className="bg-card border rounded-lg shadow-sm overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-3 font-medium">Nº / Título</th>
                <th className="px-6 py-3 font-medium">Empresa</th>
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
                          Envio: {new Intl.DateTimeFormat('pt-BR').format(new Date(proposal.date))}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          Válida: {new Intl.DateTimeFormat('pt-BR').format(new Date(proposal.validUntil))}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleAction(proposal.id, 'view')}>
                            <FileText className="h-4 w-4 mr-2" /> Visualizar PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleAction(proposal.id, 'duplicate')}>
                            <Copy className="h-4 w-4 mr-2" /> Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleAction(proposal.id, 'resend')}>
                            <Send className="h-4 w-4 mr-2" /> Reenviar
                          </DropdownMenuItem>
                          {proposal.status !== 'accepted' && (
                            <DropdownMenuItem className="cursor-pointer text-emerald-600" onClick={() => handleAction(proposal.id, 'accept')}>
                              <Check className="h-4 w-4 mr-2" /> Marcar como Aceita
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
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
