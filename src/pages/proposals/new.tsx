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
  tableColHeader: { width: '25%', borderStyle: 'solid', borderWidth: 1, borderColor: '#eee', borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#f9fafb', padding: 5, fontWeight: 'bold' },
  tableColHeaderDesc: { width: '50%', borderStyle: 'solid', borderWidth: 1, borderColor: '#eee', borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#f9fafb', padding: 5, fontWeight: 'bold' },
  tableCol: { width: '25%', borderStyle: 'solid', borderWidth: 1, borderColor: '#eee', borderLeftWidth: 0, borderTopWidth: 0, padding: 5 },
  tableColDesc: { width: '50%', borderStyle: 'solid', borderWidth: 1, borderColor: '#eee', borderLeftWidth: 0, borderTopWidth: 0, padding: 5 },
  totals: { marginTop: 20, alignItems: 'flex-end' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', width: 200, marginBottom: 5 },
  totalLabel: { fontWeight: 'bold' },
  totalValue: { textAlign: 'right' },
  finalTotal: { fontSize: 14, fontWeight: 'bold', color: '#3b82f6', marginTop: 5, borderTop: '1px solid #eee', paddingTop: 5 },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', color: '#999', fontSize: 8, borderTop: '1px solid #eee', paddingTop: 10 }
})

// --- PDF Document Component ---
const ProposalPDF = ({ basicData, visualData, items, subtotal, total }: any) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <View style={{ ...pdfStyles.header, borderBottomColor: visualData.primaryColor }}>
        <View>
          <Text style={{ ...pdfStyles.title, color: visualData.primaryColor }}>{visualData.title}</Text>
          <Text style={pdfStyles.subtitle}>Para: {basicData.company || 'Empresa Cliente'}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text>Data: {new Date().toLocaleDateString('pt-BR')}</Text>
          <Text>Validade: {basicData.validUntil ? new Date(basicData.validUntil).toLocaleDateString('pt-BR') : '-'}</Text>
        </View>
      </View>

      <View style={pdfStyles.section}>
        <Text>{basicData.message || 'Apresentamos nossa proposta comercial para os serviços solicitados.'}</Text>
      </View>

      <View style={pdfStyles.table}>
        <View style={pdfStyles.tableRow}>
          <View style={pdfStyles.tableColHeaderDesc}><Text>Descrição</Text></View>
          <View style={pdfStyles.tableColHeader}><Text>Qtd</Text></View>
          <View style={pdfStyles.tableColHeader}><Text>Valor Total</Text></View>
        </View>
        {items.map((item: any) => (
          <View style={pdfStyles.tableRow} key={item.id}>
            <View style={pdfStyles.tableColDesc}><Text>{item.description || 'Item sem descrição'}</Text></View>
            <View style={pdfStyles.tableCol}><Text>{item.quantity} {item.unit}</Text></View>
            <View style={pdfStyles.tableCol}><Text>R$ {(item.quantity * item.unitPrice).toFixed(2)}</Text></View>
          </View>
        ))}
      </View>

      <View style={pdfStyles.totals}>
        <View style={pdfStyles.totalRow}>
          <Text style={pdfStyles.totalLabel}>Subtotal:</Text>
          <Text style={pdfStyles.totalValue}>R$ {subtotal.toFixed(2)}</Text>
        </View>
        <View style={pdfStyles.totalRow}>
          <Text style={pdfStyles.totalLabel}>Total Final:</Text>
          <Text style={{ ...pdfStyles.totalValue, ...pdfStyles.finalTotal, color: visualData.primaryColor }}>R$ {total.toFixed(2)}</Text>
        </View>
      </View>

      <View style={pdfStyles.section}>
        <Text style={{ fontWeight: 'bold', marginTop: 20, marginBottom: 5 }}>Condições de Pagamento:</Text>
        <Text>{visualData.paymentTerms}</Text>
        <Text style={{ fontWeight: 'bold', marginTop: 10, marginBottom: 5 }}>Prazo de Entrega:</Text>
        <Text>{visualData.deliveryTerms}</Text>
      </View>

      <Text style={pdfStyles.footer} render={({ pageNumber, totalPages }) => (
        `Proposta Comercial gerada pelo CRM Pro - Página ${pageNumber} de ${totalPages}`
      )} fixed />
    </Page>
  </Document>
)

// --- Sortable Item Component ---
function SortableItem({ item, onUpdate, onRemove }: { item: ProposalItem, onUpdate: (id: string, field: keyof ProposalItem, value: any) => void, onRemove: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }

  const subtotal = item.quantity * item.unitPrice
  const discountAmount = subtotal * (item.discount / 100)
  const total = subtotal - discountAmount

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-4 p-4 bg-card border rounded-lg shadow-sm group">
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
        <GripVertical className="h-5 w-5" />
      </div>
      <div className="grid grid-cols-12 gap-4 flex-1 items-center">
        <div className="col-span-4">
          <Input value={item.description} onChange={(e) => onUpdate(item.id, 'description', e.target.value)} placeholder="Descrição do item" />
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
        <div className="col-span-2 text-right font-medium">
          R$ {total.toFixed(2)}
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={() => onRemove(item.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function NewProposal() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = React.useState(1)
  
  // Form State
  const [basicData, setBasicData] = React.useState({
    company: '', contact: '', dealId: '', validUntil: '', currency: 'BRL', globalDiscount: 0, message: ''
  })
  
  const [items, setItems] = React.useState<ProposalItem[]>([
    { id: 'item-1', description: 'Licença Enterprise Anual', quantity: 1, unit: 'lic', unitPrice: 120000, discount: 0 }
  ])

  const [visualData, setVisualData] = React.useState({
    template: 'modern', primaryColor: '#3b82f6', title: 'Proposta Comercial', paymentTerms: '30 dias líquidos', deliveryTerms: 'Imediato após assinatura'
  })

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

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0)
  const itemDiscounts = items.reduce((acc, item) => acc + ((item.quantity * item.unitPrice) * (item.discount / 100)), 0)
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
                <Select value={basicData.company} onValueChange={(v) => setBasicData({...basicData, company: v})}>
                  <SelectTrigger><SelectValue placeholder="Selecione a empresa" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="techcorp">TechCorp Solutions</SelectItem>
                    <SelectItem value="global">Global Industries</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Contato</Label>
                <Select value={basicData.contact} onValueChange={(v) => setBasicData({...basicData, contact: v})}>
                  <SelectTrigger><SelectValue placeholder="Selecione o contato" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ana">Ana Silva (ana@techcorp.com)</SelectItem>
                    <SelectItem value="carlos">Carlos Mendes (carlos@global.com)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Vincular a um Deal (Opcional)</Label>
                <Select value={basicData.dealId} onValueChange={(v) => setBasicData({...basicData, dealId: v})}>
                  <SelectTrigger><SelectValue placeholder="Selecione o deal" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deal1">Licenciamento Enterprise</SelectItem>
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
              <div className="col-span-4 pl-8">Descrição</div>
              <div className="col-span-2">Qtd</div>
              <div className="col-span-2">Unidade</div>
              <div className="col-span-2">Preço Unit.</div>
              <div className="col-span-2 text-right pr-8">Subtotal</div>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {items.map(item => (
                    <SortableItem key={item.id} item={item} onUpdate={updateItem} onRemove={removeItem} />
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
                  <Select value={visualData.template} onValueChange={(v) => setVisualData({...visualData, template: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classic">Clássico (Serif, Formal)</SelectItem>
                      <SelectItem value="modern">Moderno (Sans-serif, Clean)</SelectItem>
                      <SelectItem value="minimal">Minimalista (Foco nos dados)</SelectItem>
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
                      <p className="text-sm text-gray-500 mt-2">Para: {basicData.company || 'Empresa Cliente'}</p>
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
                        <tr key={item.id} className="border-b border-gray-100">
                          <td className="py-3">{item.description || 'Item sem descrição'}</td>
                          <td className="py-3 text-center">{item.quantity} {item.unit}</td>
                          <td className="py-3 text-right">R$ {(item.quantity * item.unitPrice).toFixed(2)}</td>
                        </tr>
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
                      document={<ProposalPDF basicData={basicData} visualData={visualData} items={items} subtotal={subtotal} total={total} />} 
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
                        <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white">
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
                            <Input defaultValue="ana@techcorp.com" />
                          </div>
                          <div className="space-y-2">
                            <Label>CC (Opcional)</Label>
                            <Input placeholder="copia@empresa.com" />
                          </div>
                          <div className="space-y-2">
                            <Label>Assunto</Label>
                            <Input defaultValue={`Proposta Comercial - ${basicData.company || 'Cliente'} - ${new Date().toLocaleDateString('pt-BR')}`} />
                          </div>
                          <div className="space-y-2">
                            <Label>Mensagem</Label>
                            <textarea 
                              className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              defaultValue={`Olá Ana,\n\nSegue em anexo nossa proposta comercial no valor de R$ ${total.toFixed(2)}.\n\nFico à disposição para dúvidas.\n\nAtenciosamente,\nEquipe de Vendas`}
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
                          <Button onClick={() => {
                            alert('E-mail enviado via API POST /api/propostas/:id/email')
                            navigate('/proposals')
                          }}>Enviar Agora</Button>
                        </DialogFooterUI>
                      </DialogContent>
                    </Dialog>
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
          <Button variant="ghost" className="hidden sm:flex"><Save className="w-4 h-4 mr-2" /> Salvar Rascunho</Button>
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
