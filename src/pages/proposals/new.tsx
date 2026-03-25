import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Check, ChevronRight, Save, FileText, Send, Plus, Trash2, GripVertical, Download, Mail } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/src/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter as DialogFooterUI } from "@/src/components/ui/dialog"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer'

// --- Types ---
interface ProposalItem {
  id: string
  description: string
  quantity: number
  unit: string
  unitPrice: number
  discount: number
  subItems?: ProposalItem[]
}

// --- PDF Styles ---
const pdfStyles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 10, color: '#333' },
  headerContainer: { backgroundColor: '#4b4f58', padding: 30, paddingBottom: 20, flexDirection: 'row', justifyContent: 'space-between', color: '#fff' },
  headerRight: { textAlign: 'right', fontSize: 9, lineHeight: 1.5 },
  subHeader: { backgroundColor: '#4f5b93', padding: 10, paddingHorizontal: 30, flexDirection: 'row', justifyContent: 'space-between', color: '#fff', fontSize: 10, fontWeight: 'bold' },
  content: { padding: 30 },
  mainTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5, textTransform: 'uppercase' },
  metaText: { fontSize: 9, color: '#666', marginBottom: 20 },
  clientBox: { borderLeft: '3px solid #4f5b93', paddingLeft: 10, marginBottom: 30 },
  clientLabel: { fontSize: 8, fontWeight: 'bold', color: '#4f5b93', textTransform: 'uppercase', marginBottom: 5 },
  clientName: { fontSize: 12, fontWeight: 'bold', marginBottom: 3 },
  clientDetails: { fontSize: 9, color: '#666', lineHeight: 1.4 },
  sectionTitle: { fontSize: 8, fontWeight: 'bold', color: '#4f5b93', textTransform: 'uppercase', marginBottom: 10 },
  table: { width: '100%', marginBottom: 20 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#5a5e65', color: '#fff', padding: 8, fontSize: 9, fontWeight: 'bold' },
  tableRow: { flexDirection: 'row', borderBottom: '1px solid #eee', padding: 8, fontSize: 9, alignItems: 'center' },
  tableRowSub: { flexDirection: 'row', borderBottom: '1px solid #f5f5f5', padding: 8, paddingLeft: 20, fontSize: 8, color: '#666', alignItems: 'center' },
  colDesc: { flex: 1 },
  colQtd: { width: 50, textAlign: 'center' },
  colPrice: { width: 80, textAlign: 'right' },
  colDisc: { width: 60, textAlign: 'center' },
  colTotal: { width: 80, textAlign: 'right', fontWeight: 'bold' },
  totalBox: { alignSelf: 'flex-end', backgroundColor: '#5a5e65', color: '#fff', padding: 10, width: 250, flexDirection: 'row', justifyContent: 'space-between', fontWeight: 'bold', borderRadius: 4 },
  conditionsBox: { backgroundColor: '#f9fafb', padding: 15, borderRadius: 4, marginTop: 20, fontSize: 9, lineHeight: 1.5 },
  signatures: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 60, paddingHorizontal: 20 },
  signatureLine: { borderTop: '1px solid #ccc', width: 200, paddingTop: 5, textAlign: 'center', fontSize: 8, color: '#666' },
  footer: { position: 'absolute', bottom: 20, left: 30, right: 30, textAlign: 'center', color: '#999', fontSize: 8, borderTop: '1px solid #eee', paddingTop: 10 }
})

// --- PDF Document Component ---
const ProposalPDF = ({ basicData, visualData, items, subtotal, total, selectedCompany, selectedContact }: any) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <View style={pdfStyles.headerContainer}>
        <View>
          {/* Logo placeholder */}
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>NEXOCORP</Text>
        </View>
        <View style={pdfStyles.headerRight}>
          <Text>60.490.491/0001-28</Text>
          <Text>Avenida Oliveira Paiva, 1206 - Térreo - Fortaleza - CE</Text>
          <Text>financeiro@nexocorp.com.br</Text>
          <Text>www.nexocorp.com.br</Text>
        </View>
      </View>

      <View style={{ ...pdfStyles.subHeader, backgroundColor: visualData.primaryColor }}>
        <Text>PROPOSTA COMERCIAL #PROP-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</Text>
        <Text>Válida até {basicData.validUntil ? new Date(basicData.validUntil).toLocaleDateString('pt-BR') : '15/03/2026'}</Text>
      </View>

      <View style={pdfStyles.content}>
        <Text style={pdfStyles.mainTitle}>{visualData.title}</Text>
        <Text style={pdfStyles.metaText}>Emitida em: {new Date().toLocaleDateString('pt-BR')}</Text>

        <View style={{ ...pdfStyles.clientBox, borderLeftColor: visualData.primaryColor }}>
          <Text style={{ ...pdfStyles.clientLabel, color: visualData.primaryColor }}>CLIENTE</Text>
          <Text style={pdfStyles.clientName}>{basicData.company || 'Cliente não informado'}</Text>
          <Text style={pdfStyles.clientDetails}>{basicData.contact || 'Contato não informado'}</Text>
          {selectedCompany?.cnpj && <Text style={pdfStyles.clientDetails}>CNPJ: {selectedCompany.cnpj}</Text>}
          {selectedContact?.email && <Text style={pdfStyles.clientDetails}>Email: {selectedContact.email}</Text>}
          {selectedContact?.phone && <Text style={pdfStyles.clientDetails}>Telefone: {selectedContact.phone}</Text>}
        </View>

        <Text style={{ ...pdfStyles.sectionTitle, color: visualData.primaryColor }}>ITENS DA PROPOSTA</Text>
        
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableHeader}>
            <Text style={pdfStyles.colDesc}>Descrição</Text>
            <Text style={pdfStyles.colQtd}>Qtd</Text>
            <Text style={pdfStyles.colPrice}>Preço Unit.</Text>
            <Text style={pdfStyles.colDisc}>Desc%</Text>
            <Text style={pdfStyles.colTotal}>Subtotal</Text>
          </View>
          
          {items.map((item: any) => (
            <React.Fragment key={item.id}>
              <View style={pdfStyles.tableRow}>
                <Text style={pdfStyles.colDesc}>⊝ {item.description || 'Serviço'}</Text>
                <Text style={pdfStyles.colQtd}>{item.quantity}</Text>
                <Text style={pdfStyles.colPrice}>R$ {item.unitPrice.toFixed(2)}</Text>
                <Text style={pdfStyles.colDisc}>{item.discount > 0 ? `${item.discount}%` : '-'}</Text>
                <Text style={pdfStyles.colTotal}>R$ {((item.quantity * item.unitPrice) * (1 - item.discount / 100)).toFixed(2)}</Text>
              </View>
              {item.subItems && item.subItems.map((sub: any) => (
                <View style={pdfStyles.tableRowSub} key={sub.id}>
                  <Text style={pdfStyles.colDesc}>   └ {sub.description || 'Equipamento'}</Text>
                  <Text style={pdfStyles.colQtd}>{sub.quantity}</Text>
                  <Text style={pdfStyles.colPrice}>R$ {sub.unitPrice.toFixed(2)}</Text>
                  <Text style={pdfStyles.colDisc}>{sub.discount > 0 ? `${sub.discount}%` : '-'}</Text>
                  <Text style={pdfStyles.colTotal}>R$ {((sub.quantity * sub.unitPrice) * (1 - sub.discount / 100)).toFixed(2)}</Text>
                </View>
              ))}
            </React.Fragment>
          ))}
        </View>

        <View style={pdfStyles.totalBox}>
          <Text>TOTAL</Text>
          <Text>R$ {total.toFixed(2)}</Text>
        </View>

        <Text style={{ ...pdfStyles.sectionTitle, color: visualData.primaryColor, marginTop: 30 }}>CONDIÇÕES COMERCIAIS</Text>
        <View style={pdfStyles.conditionsBox}>
          <Text>OBS: {basicData.observations || 'Nenhuma observação adicional.'}</Text>
          <Text style={{ marginTop: 5 }}>Pagamento: {visualData.paymentTerms}</Text>
          <Text>Entrega: {visualData.deliveryTerms}</Text>
        </View>

        <View style={pdfStyles.signatures}>
          <View>
            <Text style={pdfStyles.signatureLine}>NEXOCORP LTDA - ME</Text>
            <Text style={{ textAlign: 'center', fontSize: 7, color: '#999' }}>Fornecedor</Text>
          </View>
          <View>
            <Text style={pdfStyles.signatureLine}>{basicData.company || 'Cliente'}</Text>
            <Text style={{ textAlign: 'center', fontSize: 7, color: '#999' }}>Cliente</Text>
          </View>
        </View>
      </View>

      <Text style={pdfStyles.footer} render={({ pageNumber, totalPages }) => (
        `Proposta Comercial gerada pelo CRM Pro - Página ${pageNumber} de ${totalPages}`
      )} fixed />
    </Page>
  </Document>
)

// --- Sortable Item Component ---
function SortableItem({ item, onUpdate, onRemove, onAddSubItem, onUpdateSubItem, onRemoveSubItem }: { item: ProposalItem, onUpdate: (id: string, field: keyof ProposalItem, value: any) => void, onRemove: (id: string) => void, onAddSubItem: (parentId: string) => void, onUpdateSubItem: (parentId: string, subId: string, field: keyof ProposalItem, value: any) => void, onRemoveSubItem: (parentId: string, subId: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }

  const subtotal = item.quantity * item.unitPrice
  const discountAmount = subtotal * (item.discount / 100)
  const itemTotal = subtotal - discountAmount
  
  const subItemsTotal = (item.subItems || []).reduce((acc, sub) => {
    const subSubtotal = sub.quantity * sub.unitPrice
    const subDiscount = subSubtotal * (sub.discount / 100)
    return acc + (subSubtotal - subDiscount)
  }, 0)

  const total = itemTotal + subItemsTotal

  return (
    <div ref={setNodeRef} style={style} className="flex flex-col gap-2 p-4 bg-card border rounded-lg shadow-sm group">
      <div className="flex items-center gap-4">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
          <GripVertical className="h-5 w-5" />
        </div>
        <div className="grid grid-cols-12 gap-4 flex-1 items-center">
          <div className="col-span-3">
            <Input value={item.description} onChange={(e) => onUpdate(item.id, 'description', e.target.value)} placeholder="Descrição do serviço" className="font-semibold" />
          </div>
          <div className="col-span-2">
            <Input type="number" value={item.quantity} onChange={(e) => onUpdate(item.id, 'quantity', Number(e.target.value))} min={1} />
          </div>
          <div className="col-span-2">
            <Select value={item.unit} onValueChange={(val) => onUpdate(item.id, 'unit', val)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="un">Un</SelectItem>
                <SelectItem value="h">Horas</SelectItem>
                <SelectItem value="mes">Mês</SelectItem>
                <SelectItem value="lic">Licença</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Input type="number" value={item.unitPrice} onChange={(e) => onUpdate(item.id, 'unitPrice', Number(e.target.value))} min={0} step="0.01" />
          </div>
          <div className="col-span-1">
            <Input type="number" value={item.discount} onChange={(e) => onUpdate(item.id, 'discount', Number(e.target.value))} min={0} max={100} placeholder="Desc %" />
          </div>
          <div className="col-span-2 text-right font-medium">
            R$ {total.toFixed(2)}
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => onAddSubItem(item.id)} className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity" title="Adicionar Equipamento/Item">
          <Plus className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onRemove(item.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {item.subItems && item.subItems.length > 0 && (
        <div className="pl-12 space-y-2 mt-2">
          {item.subItems.map(subItem => {
            const subSubtotal = subItem.quantity * subItem.unitPrice
            const subDiscountAmount = subSubtotal * (subItem.discount / 100)
            const subTotal = subSubtotal - subDiscountAmount
            return (
              <div key={subItem.id} className="flex items-center gap-4 p-2 bg-muted/30 border rounded-md group/sub">
                <div className="text-muted-foreground">└</div>
                <div className="grid grid-cols-12 gap-4 flex-1 items-center">
                  <div className="col-span-3">
                    <Input value={subItem.description} onChange={(e) => onUpdateSubItem(item.id, subItem.id, 'description', e.target.value)} placeholder="Equipamento/Item" className="h-8 text-sm" />
                  </div>
                  <div className="col-span-2">
                    <Input type="number" value={subItem.quantity} onChange={(e) => onUpdateSubItem(item.id, subItem.id, 'quantity', Number(e.target.value))} min={1} className="h-8 text-sm" />
                  </div>
                  <div className="col-span-2">
                    <Select value={subItem.unit} onValueChange={(val) => onUpdateSubItem(item.id, subItem.id, 'unit', val)}>
                      <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="un">Un</SelectItem>
                        <SelectItem value="h">Horas</SelectItem>
                        <SelectItem value="mes">Mês</SelectItem>
                        <SelectItem value="lic">Licença</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Input type="number" value={subItem.unitPrice} onChange={(e) => onUpdateSubItem(item.id, subItem.id, 'unitPrice', Number(e.target.value))} min={0} step="0.01" className="h-8 text-sm" />
                  </div>
                  <div className="col-span-1">
                    <Input type="number" value={subItem.discount} onChange={(e) => onUpdateSubItem(item.id, subItem.id, 'discount', Number(e.target.value))} min={0} max={100} placeholder="Desc %" className="h-8 text-sm" />
                  </div>
                  <div className="col-span-2 text-right font-medium text-sm text-muted-foreground">
                    R$ {subTotal.toFixed(2)}
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => onRemoveSubItem(item.id, subItem.id)} className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function NewProposal() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = React.useState(1)
  
  // Form State
  const [basicData, setBasicData] = React.useState({
    company: '', contact: '', dealId: '', validUntil: '', currency: 'BRL', globalDiscount: 0, message: '', observations: ''
  })
  
  const [items, setItems] = React.useState<ProposalItem[]>([
    { id: 'item-1', description: 'Licença Enterprise Anual', quantity: 1, unit: 'lic', unitPrice: 120000, discount: 0 }
  ])

  const [visualData, setVisualData] = React.useState({
    template: 'modern', primaryColor: '#3b82f6', title: 'Proposta Comercial', paymentTerms: '30 dias líquidos', deliveryTerms: 'Imediato após assinatura'
  })

  const [emailData, setEmailData] = React.useState({
    to: '', cc: '', subject: '', message: ''
  })

  const [templates, setTemplates] = React.useState<any[]>([])
  const [companies, setCompanies] = React.useState<any[]>([])
  const [contacts, setContacts] = React.useState<any[]>([])
  const [deals, setDeals] = React.useState<any[]>([])

  React.useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch('/api/templates')
        if (res.ok) {
          const data = await res.json()
          setTemplates(data)
          if (data.length > 0) {
            setVisualData(prev => ({
              ...prev,
              template: data[0].id,
              primaryColor: data[0].primaryColor,
              title: data[0].name
            }))
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
    const fetchCompanies = async () => {
      try {
        const res = await fetch('/api/companies')
        if (res.ok) {
          const data = await res.json()
          setCompanies(data)
        }
      } catch (e) {
        console.error(e)
      }
    }
    const fetchContacts = async () => {
      try {
        const res = await fetch('/api/contacts')
        if (res.ok) {
          const data = await res.json()
          setContacts(data)
        }
      } catch (e) {
        console.error(e)
      }
    }
    const fetchDeals = async () => {
      try {
        const res = await fetch('/api/deals')
        if (res.ok) {
          const data = await res.json()
          setDeals(data)
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchTemplates()
    fetchCompanies()
    fetchContacts()
    fetchDeals()
  }, [])

  // Dnd Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id)
        const newIndex = items.findIndex(i => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const addItem = () => {
    setItems([...items, { id: `item-${Date.now()}`, description: '', quantity: 1, unit: 'un', unitPrice: 0, discount: 0 }])
  }

  const updateItem = (id: string, field: keyof ProposalItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const addSubItem = (parentId: string) => {
    setItems(items.map(item => {
      if (item.id === parentId) {
        const newSubItems = [...(item.subItems || []), { id: `sub-${Date.now()}`, description: '', quantity: 1, unit: 'un', unitPrice: 0, discount: 0 }]
        return { ...item, subItems: newSubItems }
      }
      return item
    }))
  }

  const updateSubItem = (parentId: string, subItemId: string, field: keyof ProposalItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === parentId && item.subItems) {
        const newSubItems = item.subItems.map(subItem => 
          subItem.id === subItemId ? { ...subItem, [field]: value } : subItem
        )
        return { ...item, subItems: newSubItems }
      }
      return item
    }))
  }

  const removeSubItem = (parentId: string, subItemId: string) => {
    setItems(items.map(item => {
      if (item.id === parentId && item.subItems) {
        const newSubItems = item.subItems.filter(subItem => subItem.id !== subItemId)
        return { ...item, subItems: newSubItems }
      }
      return item
    }))
  }

  // Calculations
  const subtotal = items.reduce((acc, item) => {
    const itemSubtotal = item.quantity * item.unitPrice
    const subItemsSubtotal = (item.subItems || []).reduce((subAcc, subItem) => subAcc + (subItem.quantity * subItem.unitPrice), 0)
    return acc + itemSubtotal + subItemsSubtotal
  }, 0)
  
  const itemDiscounts = items.reduce((acc, item) => {
    const itemDiscount = (item.quantity * item.unitPrice) * (item.discount / 100)
    const subItemsDiscount = (item.subItems || []).reduce((subAcc, subItem) => subAcc + ((subItem.quantity * subItem.unitPrice) * (subItem.discount / 100)), 0)
    return acc + itemDiscount + subItemsDiscount
  }, 0)
  
  const globalDiscountAmount = (subtotal - itemDiscounts) * (basicData.globalDiscount / 100)
  const total = subtotal - itemDiscounts - globalDiscountAmount

  const steps = [
    { id: 1, title: 'Dados Básicos' },
    { id: 2, title: 'Produtos e Serviços' },
    { id: 3, title: 'Personalização' },
    { id: 4, title: 'Revisão e Envio' }
  ]

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Empresa Cliente</Label>
                <Input 
                  list="companies-list" 
                  value={basicData.company} 
                  onChange={(e) => setBasicData({...basicData, company: e.target.value})} 
                  placeholder="Digite ou selecione a empresa" 
                />
                <datalist id="companies-list">
                  {companies.map(company => (
                    <option key={company.id} value={company.name} />
                  ))}
                </datalist>
              </div>
              <div className="space-y-2">
                <Label>Contato</Label>
                <Input 
                  list="contacts-list" 
                  value={basicData.contact} 
                  onChange={(e) => setBasicData({...basicData, contact: e.target.value})} 
                  placeholder="Digite ou selecione o contato" 
                />
                <datalist id="contacts-list">
                  {contacts.map(contact => (
                    <option key={contact.id} value={contact.name} />
                  ))}
                </datalist>
              </div>
              <div className="space-y-2">
                <Label>Vincular a um Deal (Opcional)</Label>
                <Select value={basicData.dealId} onValueChange={(v) => setBasicData({...basicData, dealId: v})}>
                  <SelectTrigger><SelectValue placeholder="Selecione o deal" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    {deals.map(deal => (
                      <SelectItem key={deal.id} value={deal.id}>{deal.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Data de Validade</Label>
                <Input type="date" value={basicData.validUntil} onChange={(e) => setBasicData({...basicData, validUntil: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Moeda</Label>
                <Select value={basicData.currency} onValueChange={(v) => setBasicData({...basicData, currency: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRL">BRL (R$)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Desconto Global (%)</Label>
                <Input type="number" min="0" max="100" value={basicData.globalDiscount} onChange={(e) => setBasicData({...basicData, globalDiscount: Number(e.target.value)})} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Mensagem de Abertura</Label>
              <textarea 
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Prezado cliente, segue nossa proposta comercial..."
                value={basicData.message}
                onChange={(e) => setBasicData({...basicData, message: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Observações da Proposta</Label>
              <textarea 
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Observações adicionais..."
                value={basicData.observations}
                onChange={(e) => setBasicData({...basicData, observations: e.target.value})}
              />
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Itens da Proposta</h3>
              <Button onClick={addItem} size="sm" variant="outline"><Plus className="h-4 w-4 mr-2" /> Adicionar Item</Button>
            </div>
            
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground bg-muted/50 rounded-t-lg border-b">
              <div className="col-span-3 pl-8">Descrição</div>
              <div className="col-span-2">Qtd</div>
              <div className="col-span-2">Unidade</div>
              <div className="col-span-2">Preço Unit.</div>
              <div className="col-span-1">Desc %</div>
              <div className="col-span-2 text-right pr-8">Subtotal</div>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {items.map(item => (
                    <SortableItem 
                      key={item.id} 
                      item={item} 
                      onUpdate={updateItem} 
                      onRemove={removeItem} 
                      onAddSubItem={addSubItem}
                      onUpdateSubItem={updateSubItem}
                      onRemoveSubItem={removeSubItem}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <div className="flex justify-end pt-6 border-t">
              <div className="w-full max-w-sm space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                {itemDiscounts > 0 && (
                  <div className="flex justify-between text-sm text-red-500">
                    <span>Descontos por item:</span>
                    <span>- R$ {itemDiscounts.toFixed(2)}</span>
                  </div>
                )}
                {globalDiscountAmount > 0 && (
                  <div className="flex justify-between text-sm text-red-500">
                    <span>Desconto Global ({basicData.globalDiscount}%):</span>
                    <span>- R$ {globalDiscountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-3 border-t">
                  <span>Total Final:</span>
                  <span className="text-primary">R$ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Template Visual</Label>
                  <Select 
                    value={visualData.template} 
                    onValueChange={(v) => {
                      const selected = templates.find(t => t.id === v)
                      if (selected) {
                        setVisualData({
                          ...visualData, 
                          template: v,
                          primaryColor: selected.primaryColor,
                          title: selected.name
                        })
                      } else {
                        setVisualData({...visualData, template: v})
                      }
                    }}
                  >
                    <SelectTrigger><SelectValue placeholder="Selecione um template" /></SelectTrigger>
                    <SelectContent>
                      {templates.length > 0 ? (
                        templates.map(t => (
                          <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                        ))
                      ) : (
                        <>
                          <SelectItem value="classic">Clássico (Serif, Formal)</SelectItem>
                          <SelectItem value="modern">Moderno (Sans-serif, Clean)</SelectItem>
                          <SelectItem value="minimal">Minimalista (Foco nos dados)</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Cor Primária</Label>
                  <div className="flex gap-2 items-center">
                    <Input type="color" className="w-12 h-12 p-1 cursor-pointer" value={visualData.primaryColor} onChange={(e) => setVisualData({...visualData, primaryColor: e.target.value})} />
                    <Input type="text" value={visualData.primaryColor} onChange={(e) => setVisualData({...visualData, primaryColor: e.target.value})} className="flex-1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Título do Documento</Label>
                  <Input value={visualData.title} onChange={(e) => setVisualData({...visualData, title: e.target.value})} />
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Condições de Pagamento</Label>
                  <Input value={visualData.paymentTerms} onChange={(e) => setVisualData({...visualData, paymentTerms: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Prazo de Entrega/Execução</Label>
                  <Input value={visualData.deliveryTerms} onChange={(e) => setVisualData({...visualData, deliveryTerms: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Logo da Empresa (URL)</Label>
                  <Input placeholder="https://..." />
                </div>
              </div>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 border rounded-lg bg-muted/20 p-8 min-h-[600px] flex flex-col items-center justify-center relative overflow-hidden">
                {/* Mock PDF Preview */}
                <div className="w-full max-w-[600px] bg-white shadow-xl rounded-sm p-10 aspect-[1/1.4] scale-[0.85] origin-top">
                  <div className="flex justify-between items-start mb-12 border-b pb-6" style={{ borderColor: visualData.primaryColor }}>
                    <div>
                      <h1 className="text-3xl font-bold" style={{ color: visualData.primaryColor }}>{visualData.title}</h1>
                      <p className="text-sm text-gray-500 mt-2 font-semibold">Para: {basicData.company || 'Empresa Cliente'}</p>
                      <p className="text-sm text-gray-500">{basicData.contact || 'Contato não informado'}</p>
                      {companies.find(c => c.name === basicData.company)?.cnpj && <p className="text-sm text-gray-500">CNPJ: {companies.find(c => c.name === basicData.company)?.cnpj}</p>}
                      {contacts.find(c => c.name === basicData.contact)?.email && <p className="text-sm text-gray-500">Email: {contacts.find(c => c.name === basicData.contact)?.email}</p>}
                      {contacts.find(c => c.name === basicData.contact)?.phone && <p className="text-sm text-gray-500">Telefone: {contacts.find(c => c.name === basicData.contact)?.phone}</p>}
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>Data: {new Date().toLocaleDateString('pt-BR')}</p>
                      <p>Validade: {basicData.validUntil ? new Date(basicData.validUntil).toLocaleDateString('pt-BR') : '-'}</p>
                    </div>
                  </div>
                  <div className="mb-8 text-sm text-gray-700 leading-relaxed">
                    {basicData.message || 'Apresentamos nossa proposta comercial para os serviços solicitados.'}
                  </div>
                  <table className="w-full text-sm mb-8">
                    <thead className="text-left border-b-2" style={{ borderColor: visualData.primaryColor }}>
                      <tr>
                        <th className="py-2">Item</th>
                        <th className="py-2 text-center">Qtd</th>
                        <th className="py-2 text-right">Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(item => (
                        <React.Fragment key={item.id}>
                          <tr className="border-b border-gray-100">
                            <td className="py-3 font-medium">{item.description || 'Item sem descrição'}</td>
                            <td className="py-3 text-center">{item.quantity} {item.unit}</td>
                            <td className="py-3 text-right">R$ {((item.quantity * item.unitPrice) * (1 - item.discount / 100)).toFixed(2)}</td>
                          </tr>
                          {item.subItems && item.subItems.map(sub => (
                            <tr key={sub.id} className="border-b border-gray-50 text-gray-500 text-xs">
                              <td className="py-2 pl-4">└ {sub.description || 'Equipamento'}</td>
                              <td className="py-2 text-center">{sub.quantity} {sub.unit}</td>
                              <td className="py-2 text-right">R$ {((sub.quantity * sub.unitPrice) * (1 - sub.discount / 100)).toFixed(2)}</td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex justify-end">
                    <div className="w-64 space-y-2 text-sm">
                      <div className="flex justify-between"><span>Subtotal:</span><span>R$ {subtotal.toFixed(2)}</span></div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t" style={{ color: visualData.primaryColor }}>
                        <span>Total:</span><span>R$ {total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  {basicData.observations && (
                    <div className="mt-8 text-sm text-gray-700 leading-relaxed">
                      <h4 className="font-bold mb-2">Observações:</h4>
                      <p>{basicData.observations}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Ações Finais</CardTitle>
                    <CardDescription>Revise o documento e escolha como deseja prosseguir.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <PDFDownloadLink 
                      document={<ProposalPDF basicData={basicData} visualData={visualData} items={items} subtotal={subtotal} total={total} selectedCompany={companies.find(c => c.name === basicData.company)} selectedContact={contacts.find(c => c.name === basicData.contact)} />} 
                      fileName={`Proposta-${Date.now().toString().slice(-4)}-${basicData.company || 'Cliente'}.pdf`}
                      className="w-full"
                    >
                      {({ loading }) => (
                        <Button className="w-full gap-2" variant="outline" disabled={loading}>
                          <Download className="h-4 w-4" /> {loading ? 'Gerando PDF...' : 'Exportar PDF'}
                        </Button>
                      )}
                    </PDFDownloadLink>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => {
                          setEmailData({
                            ...emailData,
                            to: contacts.find(c => c.name === basicData.contact)?.email || '',
                            subject: `Proposta Comercial - ${basicData.company || 'Cliente'} - ${new Date().toLocaleDateString('pt-BR')}`,
                            message: `Olá ${basicData.contact ? basicData.contact.split(' ')[0] : 'Cliente'},\n\nSegue em anexo nossa proposta comercial no valor de R$ ${total.toFixed(2)}.\n\nFico à disposição para dúvidas.\n\nAtenciosamente,\nEquipe de Vendas`
                          });
                        }}>
                          <Mail className="h-4 w-4" /> Enviar por E-mail
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[550px]">
                        <DialogHeader>
                          <DialogTitle>Enviar Proposta por E-mail</DialogTitle>
                          <DialogDescription>O e-mail será enviado via Nodemailer com tracking de abertura.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>Para</Label>
                            <Input 
                              value={emailData.to || ''} 
                              onChange={(e) => setEmailData({...emailData, to: e.target.value})} 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>CC (Opcional)</Label>
                            <Input 
                              placeholder="copia@empresa.com" 
                              value={emailData.cc || ''} 
                              onChange={(e) => setEmailData({...emailData, cc: e.target.value})} 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Assunto</Label>
                            <Input 
                              value={emailData.subject || ''} 
                              onChange={(e) => setEmailData({...emailData, subject: e.target.value})} 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Mensagem</Label>
                            <textarea 
                              className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              value={emailData.message || ''}
                              onChange={(e) => setEmailData({...emailData, message: e.target.value})}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="attach" defaultChecked className="rounded border-gray-300 text-primary focus:ring-primary" />
                            <Label htmlFor="attach" className="text-sm font-normal">Anexar PDF automaticamente</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="tracking" defaultChecked className="rounded border-gray-300 text-primary focus:ring-primary" />
                            <Label htmlFor="tracking" className="text-sm font-normal">Habilitar tracking de abertura (Pixel 1x1)</Label>
                          </div>
                        </div>
                        <DialogFooterUI>
                          <Button variant="outline">Agendar Envio</Button>
                          <Button onClick={async () => {
                            try {
                              const res = await fetch('/api/proposals', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  title: visualData.title,
                                  templateId: visualData.template === 'modern' ? null : visualData.template,
                                  dealId: basicData.dealId && basicData.dealId !== 'none' ? basicData.dealId : null,
                                  companyName: basicData.company,
                                  contactName: basicData.contact,
                                  validUntil: basicData.validUntil,
                                  message: basicData.message,
                                  totalValue: total,
                                  observations: basicData.observations,
                                  services: items,
                                  status: 'SENT'
                                })
                              })
                              if (res.ok) {
                                const proposal = await res.json()
                                
                                // Send Email
                                const emailRes = await fetch(`/api/propostas/${proposal.id}/email`, {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    to: emailData.to || 'cliente@exemplo.com',
                                    subject: emailData.subject,
                                    message: emailData.message
                                  })
                                })
                                
                                if (emailRes.ok) {
                                  alert('Proposta salva e e-mail enviado com sucesso!')
                                } else {
                                  alert('Proposta salva, mas houve um erro ao enviar o e-mail.')
                                }
                                navigate('/proposals')
                              } else {
                                alert('Erro ao salvar proposta')
                              }
                            } catch (e) {
                              console.error(e)
                              alert('Erro ao salvar proposta')
                            }
                          }}>Enviar Agora</Button>
                        </DialogFooterUI>
                      </DialogContent>
                    </Dialog>
                    
                    <div className="pt-4 border-t flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={async () => {
                        try {
                          const res = await fetch('/api/proposals', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              title: visualData.title,
                              templateId: visualData.template === 'modern' ? null : visualData.template,
                              dealId: basicData.dealId && basicData.dealId !== 'none' ? basicData.dealId : null,
                              companyName: basicData.company,
                              contactName: basicData.contact,
                              validUntil: basicData.validUntil,
                              message: basicData.message,
                              totalValue: total,
                              observations: basicData.observations,
                              services: items,
                              status: 'DRAFT'
                            })
                          })
                          if (res.ok) {
                            alert('Proposta salva como rascunho!')
                            navigate('/proposals')
                          } else {
                            alert('Erro ao salvar rascunho')
                          }
                        } catch (e) {
                          console.error(e)
                          alert('Erro ao salvar rascunho')
                        }
                      }}>
                        Salvar Rascunho
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col h-full space-y-6 max-w-6xl mx-auto w-full pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nova Proposta</h1>
          <p className="text-muted-foreground">Crie uma proposta comercial profissional em 4 passos.</p>
        </div>
        <Button variant="ghost" onClick={() => navigate('/proposals')}>Cancelar</Button>
      </div>

      {/* Stepper */}
      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2 z-0 hidden sm:block"></div>
        <div className="relative z-10 flex justify-between">
          {steps.map((step) => {
            const isActive = step.id === currentStep
            const isCompleted = step.id < currentStep
            return (
              <div key={step.id} className="flex flex-col items-center gap-2 bg-background px-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  isActive ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' : 
                  isCompleted ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {isCompleted ? <Check className="w-5 h-5" /> : step.id}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step.title}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Content Area */}
      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="p-0 pt-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-6 border-t mt-auto">
        <Button 
          variant="outline" 
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
        >
          Voltar
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" className="hidden sm:flex" onClick={async () => {
            try {
              const res = await fetch('/api/proposals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  title: visualData.title,
                  templateId: visualData.template === 'modern' ? null : visualData.template,
                  dealId: basicData.dealId && basicData.dealId !== 'none' ? basicData.dealId : null,
                  companyName: basicData.company,
                  contactName: basicData.contact,
                  validUntil: basicData.validUntil,
                  message: basicData.message,
                  totalValue: total,
                  observations: basicData.observations,
                  services: items,
                  status: 'DRAFT'
                })
              })
              if (res.ok) {
                alert('Proposta salva como rascunho!')
                navigate('/proposals')
              } else {
                alert('Erro ao salvar rascunho')
              }
            } catch (e) {
              console.error(e)
              alert('Erro ao salvar rascunho')
            }
          }}>
            <Save className="w-4 h-4 mr-2" /> Salvar Rascunho
          </Button>
          {currentStep < 4 ? (
            <Button onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))}>
              Próximo Passo <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
