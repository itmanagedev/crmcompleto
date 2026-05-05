import * as React from "react"
import { Search, Plus, Filter, MoreHorizontal, FileText, Calendar, CheckCircle2, XCircle, Clock, Eye, Send, Check } from "lucide-react"
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
  dealId?: string
  templateId?: string
  companyName?: string
  contactName?: string
  validUntil?: string
  message?: string
  status: string
  linkHash: string
  observations?: string
  services?: any
  totalValue: number
  createdAt: string
  updatedAt: string
  deal?: any
  template?: any
}



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
  page: { padding: 0, fontFamily: 'Helvetica', backgroundColor: '#ffffff' },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '20 40', backgroundColor: '#475569' },
  headerLogoText: { fontSize: 24, fontWeight: 'bold', color: '#ffffff' },
  headerRight: { textAlign: 'right', fontSize: 8, color: '#e2e8f0', lineHeight: 1.4 },
  
  subHeader: { padding: '8 40', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#6366f1' },
  subHeaderText: { color: '#ffffff', fontSize: 10, fontWeight: 'bold' },
  
  content: { padding: '30 40' },
  mainTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 4, textTransform: 'uppercase' },
  metaText: { fontSize: 9, color: '#64748b', marginBottom: 25 },
  
  twoCols: { flexDirection: 'row', gap: 20, marginBottom: 25 },
  boxCol: { flex: 1, backgroundColor: '#f8fafc', padding: 15, borderLeft: '2px solid #cbd5e1' },
  boxColTitle: { fontSize: 8, color: '#64748b', fontWeight: 'bold', marginBottom: 10, textTransform: 'uppercase' },
  boxColHighlight: { fontSize: 12, fontWeight: 'bold', color: '#0f172a', marginBottom: 4, textTransform: 'uppercase' },
  boxColText: { fontSize: 9, color: '#475569', marginBottom: 2 },
  
  sectionTitle: { fontSize: 10, fontWeight: 'bold', color: '#6366f1', marginBottom: 10, textTransform: 'uppercase' },
  
  table: { width: '100%', marginBottom: 20 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#475569', padding: '8 10', alignItems: 'center' },
  tableHeaderItem: { color: '#ffffff', fontSize: 9, fontWeight: 'bold' },
  tableRow: { flexDirection: 'row', borderBottom: '1px solid #f1f5f9', padding: '8 10', alignItems: 'center' },
  tableRowSub: { flexDirection: 'row', padding: '4 10', paddingLeft: 20, alignItems: 'center' },
  
  colDesc: { flex: 4, fontSize: 9, color: '#334155', fontWeight: 'bold' },
  colDescSub: { flex: 4, fontSize: 8, color: '#64748b' },
  colQtd: { flex: 1, fontSize: 9, textAlign: 'center', color: '#475569' },
  colPrice: { flex: 1.5, fontSize: 9, textAlign: 'right', color: '#475569' },
  colDisc: { flex: 1, fontSize: 9, textAlign: 'right', color: '#475569' },
  colTotal: { flex: 1.5, fontSize: 9, textAlign: 'right', color: '#334155' },
  
  totalsContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 5 },
  totalBox: { backgroundColor: '#475569', padding: '10 20', borderRadius: 2, flexDirection: 'row', gap: 30, alignItems: 'center' },
  totalBoxLabel: { color: '#ffffff', fontSize: 10, fontWeight: 'bold' },
  totalBoxValue: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
  
  conditionsBox: { backgroundColor: '#f8fafc', padding: 15, borderRadius: 2, fontSize: 9, color: '#475569', lineHeight: 1.5 },
  
  signatures: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 50, paddingHorizontal: 30 },
  signatureBlock: { alignItems: 'center', width: 200 },
  signatureLine: { borderTop: '1px solid #94a3b8', width: '100%', paddingTop: 8, textAlign: 'center', fontSize: 9, color: '#0f172a', textTransform: 'uppercase' },
  signatureRole: { textAlign: 'center', fontSize: 8, color: '#64748b', marginTop: 2 },
  
  footer: { position: 'absolute', bottom: 20, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: 10 },
  footerText: { color: '#94a3b8', fontSize: 7 }
})

const SimpleProposalPDF = ({ proposal }: { proposal: Proposal }) => {
  const primaryColor = '#6366f1';
  let services: any[] = [];
  try {
    services = proposal.services ? (typeof proposal.services === 'string' ? JSON.parse(proposal.services) : proposal.services) : [];
  } catch(e) {
    console.error(e);
  }

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.headerContainer}>
          <Text style={pdfStyles.headerLogoText}>NEXOCORP</Text>
          <View style={pdfStyles.headerRight}>
            <Text>60.490.491/0001-28</Text>
            <Text>Av. Oliveira Paiva, 1206 - Térreo - Cidade dos Funcionários - Fortaleza - CE</Text>
            <Text>financeiro@nexocorp.com.br</Text>
            <Text>www.nexocorp.com.br</Text>
          </View>
        </View>

        <View style={{ ...pdfStyles.subHeader, backgroundColor: primaryColor }}>
          <Text style={pdfStyles.subHeaderText}>PROPOSTA COMERCIAL #{proposal.id.substring(0, 8).toUpperCase()}</Text>
          <Text style={pdfStyles.subHeaderText}>Válida até {proposal.validUntil ? new Date(proposal.validUntil).toLocaleDateString('pt-BR') : '-'}</Text>
        </View>

        <View style={pdfStyles.content}>
          <Text style={pdfStyles.mainTitle}>{proposal.title || 'PROPOSTA COMERCIAL'}</Text>
          <Text style={pdfStyles.metaText}>Emitida em: {new Date(proposal.createdAt).toLocaleDateString('pt-BR')} • Vendedor: {proposal.contactName || 'Consultor'}</Text>

          <View style={pdfStyles.twoCols}>
            <View style={{ ...pdfStyles.boxCol, borderLeftColor: primaryColor }}>
              <Text style={pdfStyles.boxColTitle}>CLIENTE</Text>
              <Text style={pdfStyles.boxColHighlight}>{proposal.companyName || 'Cliente não informado'}</Text>
              <Text style={pdfStyles.boxColText}>A/C: {proposal.contactName || 'Não informado'}</Text>
            </View>
            <View style={{ ...pdfStyles.boxCol, borderLeftColor: primaryColor }}>
              <Text style={pdfStyles.boxColTitle}>PAGAMENTO</Text>
              <Text style={pdfStyles.boxColText}>Forma: PIX</Text>
              <Text style={pdfStyles.boxColText}>TBD Conforme Proposta</Text>
            </View>
          </View>

          <Text style={{ ...pdfStyles.sectionTitle, color: primaryColor }}>ITENS DA PROPOSTA</Text>

          <View style={pdfStyles.table}>
            <View style={pdfStyles.tableHeader}>
              <Text style={{ ...pdfStyles.colDesc, color: '#ffffff' }}>Descrição</Text>
              <Text style={{ ...pdfStyles.colQtd, color: '#ffffff' }}>Qtd</Text>
              <Text style={{ ...pdfStyles.colPrice, color: '#ffffff' }}>Preço Unit.</Text>
              <Text style={{ ...pdfStyles.colDisc, color: '#ffffff' }}>Desc%</Text>
              <Text style={{ ...pdfStyles.colTotal, color: '#ffffff' }}>Subtotal</Text>
            </View>
            
            {services && services.length > 0 ? services.map((item: any, index: number) => (
              <React.Fragment key={item.id || index}>
                <View style={{ ...pdfStyles.tableRow, backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                  <Text style={pdfStyles.colDesc}>{item.description || 'Serviço'}</Text>
                  <Text style={pdfStyles.colQtd}>{item.quantity}</Text>
                  <Text style={pdfStyles.colPrice}>R$ {parseFloat(item.unitPrice || 0).toFixed(2)}</Text>
                  <Text style={pdfStyles.colDisc}>{item.discount > 0 ? `${item.discount}%` : '-'}</Text>
                  <Text style={pdfStyles.colTotal}>R$ {((item.quantity * (item.unitPrice || 0)) * (1 - (item.discount || 0) / 100)).toFixed(2)}</Text>
                </View>
                {item.subItems && item.subItems.map((sub: any, subIndex: number) => (
                  <View style={pdfStyles.tableRowSub} key={sub.id || subIndex}>
                    <Text style={pdfStyles.colDescSub}>└ {sub.description || 'Equipamento'}</Text>
                    <Text style={pdfStyles.colQtd}>{sub.quantity}</Text>
                    <Text style={pdfStyles.colPrice}>R$ 0,00</Text>
                    <Text style={pdfStyles.colDisc}>-</Text>
                    <Text style={pdfStyles.colTotal}>R$ 0,00</Text>
                  </View>
                ))}
              </React.Fragment>
            )) : (
              <View style={pdfStyles.tableRow}>
                <Text style={pdfStyles.colDesc}>{proposal.title || 'Serviço'}</Text>
                <Text style={pdfStyles.colQtd}>1</Text>
                <Text style={pdfStyles.colPrice}>R$ {(proposal.totalValue || 0).toFixed(2)}</Text>
                <Text style={pdfStyles.colDisc}>-</Text>
                <Text style={pdfStyles.colTotal}>R$ {(proposal.totalValue || 0).toFixed(2)}</Text>
              </View>
            )}
          </View>

          <View style={pdfStyles.totalsContainer}>
            <View style={pdfStyles.totalBox}>
              <Text style={pdfStyles.totalBoxLabel}>TOTAL</Text>
              <Text style={pdfStyles.totalBoxValue}>R$ {parseFloat((proposal.totalValue || 0).toString()).toFixed(2)}</Text>
            </View>
          </View>

          <Text style={{ ...pdfStyles.sectionTitle, color: primaryColor, marginTop: 30 }}>CONDIÇÕES COMERCIAIS</Text>
          <View style={pdfStyles.conditionsBox}>
            <Text>{proposal.observations || 'EM CASO DE ACEITE, PRECISO ENVIAR O CONTRATO PARA ASSINATURA E, APÓS, SEGUIR COM AS INSTALAÇÕES DO CIRCUITO.'}</Text>
          </View>

          <View style={pdfStyles.signatures}>
            <View style={pdfStyles.signatureBlock}>
              <Text style={pdfStyles.signatureLine}>NEXOCORP LTDA - ME</Text>
              <Text style={pdfStyles.signatureRole}>Fornecedor</Text>
            </View>
            <View style={pdfStyles.signatureBlock}>
              <Text style={pdfStyles.signatureLine}>{proposal.companyName || 'Cliente'}</Text>
              <Text style={pdfStyles.signatureRole}>Cliente</Text>
            </View>
          </View>
        </View>

        <View style={pdfStyles.footer} fixed>
          <Text style={pdfStyles.footerText}>Proposta gerada automaticamente. Válida conforme data indicada.</Text>
          <Text style={pdfStyles.footerText}>#{proposal.id.substring(0, 8).toUpperCase()}</Text>
        </View>
      </Page>
    </Document>
  );
}

export function ProposalsList() {
  const navigate = useNavigate()
  const [proposals, setProposals] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")

  React.useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await fetch('/api/proposals')
        if (res.ok) {
          const data = await res.json()
          setProposals(data)
        }
      } catch (error) {
        console.error("Error fetching proposals:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProposals()
  }, [])

  const filteredProposals = React.useMemo(() => {
    return proposals.filter(proposal => {
      const title = proposal.title || 'Proposta sem título'
      const client = proposal.companyName || 'Cliente não informado'
      const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            proposal.id.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || proposal.status.toLowerCase() === statusFilter.toLowerCase()
      return matchesSearch && matchesStatus
    })
  }, [proposals, searchQuery, statusFilter])

  const handleAction = async (id: string, action: string) => {
    const proposal = proposals.find(p => p.id === id)
    
    if (action === 'view') {
      if (proposal && proposal.linkHash) {
        window.open(`/p/${proposal.linkHash}`, '_blank')
      }
    } else if (action === 'copy_link') {
      if (proposal && proposal.linkHash) {
        const url = `${window.location.origin}/p/${proposal.linkHash}`
        navigator.clipboard.writeText(url)
        alert("Link copiado para a área de transferência!")
      }
    } else if (action === 'edit') {
      navigate(`/proposals/new?id=${id}`)
    } else if (action === 'send') {
      if (proposal) {
        const hash = proposal.linkHash || proposal.id
        const url = `${window.location.origin}/p/${hash}`
        
        try {
          const res = await fetch(`/api/proposals/${id}`, { 
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'SENT' })
          })
          if (res.ok) {
            setProposals(prev => prev.map(p => p.id === id ? { ...p, status: 'SENT' } : p))
            try {
              if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(url)
                alert(`Link de autorização gerado e copiado para a área de transferência!\n\n${url}`)
              } else {
                alert(`Link de autorização gerado!\n\nCopie o link abaixo:\n${url}`)
              }
            } catch (clipboardError) {
              alert(`Link de autorização gerado!\n\nCopie o link abaixo:\n${url}`)
            }
          } else {
            alert("Erro ao atualizar status da proposta.")
          }
        } catch (error) {
          console.error("Error updating status:", error)
          alert("Erro ao gerar link.")
        }
      }
    } else if (action === 'delete') {
      if (confirm("Tem certeza que deseja excluir esta proposta?")) {
        try {
          const res = await fetch(`/api/proposals/${id}`, { method: 'DELETE' })
          if (res.ok) {
            setProposals(prev => prev.filter(p => p.id !== id))
          } else {
            alert("Erro ao excluir proposta.")
          }
        } catch (error) {
          console.error("Error deleting proposal:", error)
          alert("Erro ao excluir proposta.")
        }
      }
    } else if (action === 'accept') {
      try {
        const res = await fetch(`/api/proposals/${id}/accept`, { method: 'POST' })
        if (res.ok) {
          setProposals(prev => prev.map(p => p.id === id ? { ...p, status: 'ACCEPTED' } : p))
        }
      } catch (error) {
        console.error("Error accepting proposal:", error)
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
                        <span className="font-medium text-foreground">{proposal.title || 'Proposta sem título'}</span>
                        <span className="text-muted-foreground text-xs">{proposal.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-muted-foreground">{proposal.companyName || 'Cliente não informado'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium">{formatCurrency(proposal.totalValue)}</span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(proposal.status.toLowerCase())}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1 text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          Envio: {new Intl.DateTimeFormat('pt-BR').format(new Date(proposal.createdAt))}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          Válida: {proposal.validUntil ? new Intl.DateTimeFormat('pt-BR').format(new Date(proposal.validUntil)) : new Intl.DateTimeFormat('pt-BR').format(new Date(new Date(proposal.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000))}
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
                            <FileText className="h-4 w-4 mr-2" /> Visualizar Proposta
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleAction(proposal.id, 'edit')}>
                            <FileText className="h-4 w-4 mr-2" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleAction(proposal.id, 'send')}>
                            <Send className="h-4 w-4 mr-2" /> Enviar (Gerar link de autorização)
                          </DropdownMenuItem>
                          {proposal.status !== 'ACCEPTED' && (
                            <DropdownMenuItem className="cursor-pointer text-emerald-600" onClick={() => handleAction(proposal.id, 'accept')}>
                              <Check className="h-4 w-4 mr-2" /> Marcar como Aceita
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="cursor-pointer text-red-600" onClick={() => handleAction(proposal.id, 'delete')}>
                            <XCircle className="h-4 w-4 mr-2" /> Excluir
                          </DropdownMenuItem>
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
