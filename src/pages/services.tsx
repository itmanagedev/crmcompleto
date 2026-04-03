import * as React from "react"
import { Plus, Search, Edit2, Trash2, ChevronDown, ChevronRight, Package, Layers } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"

interface Product {
  id: string
  name: string
  description: string
}

interface Service {
  id: string
  name: string
  description: string
  price: number
  products: Product[]
}

const INITIAL_SERVICES: Service[] = [
  {
    id: '1',
    name: 'Licenciamento Enterprise',
    description: 'Licença anual para uso completo da plataforma com suporte 24/7.',
    price: 125000,
    products: [
      { id: 'p1', name: 'Módulo CRM Base', description: 'Gestão de contatos e pipeline' },
      { id: 'p2', name: 'Módulo Relatórios Avançados', description: 'Dashboards customizados' },
      { id: 'p3', name: 'Suporte Dedicado', description: 'SLA de 4 horas' }
    ]
  },
  {
    id: '2',
    name: 'Consultoria de Implantação',
    description: 'Serviço de configuração e treinamento inicial.',
    price: 45000,
    products: [
      { id: 'p4', name: 'Mapeamento de Processos', description: 'Análise do fluxo atual' },
      { id: 'p5', name: 'Treinamento de Equipe', description: 'Sessões online de 4h' }
    ]
  }
]

export function ServicesCatalog() {
  const [services, setServices] = React.useState<Service[]>(() => {
    const saved = localStorage.getItem('crm_services')
    return saved ? JSON.parse(saved) : INITIAL_SERVICES
  })
  const [searchQuery, setSearchQuery] = React.useState('')
  const [expandedServices, setExpandedServices] = React.useState<Set<string>>(new Set())
  
  // Dialog state
  const [isServiceDialogOpen, setIsServiceDialogOpen] = React.useState(false)
  const [isProductDialogOpen, setIsProductDialogOpen] = React.useState(false)
  const [editingService, setEditingService] = React.useState<Service | null>(null)
  const [editingProduct, setEditingProduct] = React.useState<{serviceId: string, product: Product | null} | null>(null)

  // Form state
  const [serviceForm, setServiceForm] = React.useState({ name: '', description: '', price: 0 })
  const [productForm, setProductForm] = React.useState({ name: '', description: '' })

  React.useEffect(() => {
    localStorage.setItem('crm_services', JSON.stringify(services))
  }, [services])

  const toggleExpand = (id: string) => {
    const next = new Set(expandedServices)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setExpandedServices(next)
  }

  const handleSaveService = () => {
    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? { ...s, ...serviceForm } : s))
    } else {
      setServices([...services, { 
        id: Math.random().toString(36).substr(2, 9), 
        ...serviceForm, 
        products: [] 
      }])
    }
    setIsServiceDialogOpen(false)
  }

  const handleDeleteService = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      setServices(services.filter(s => s.id !== id))
    }
  }

  const handleSaveProduct = () => {
    if (!editingProduct) return

    setServices(services.map(s => {
      if (s.id === editingProduct.serviceId) {
        if (editingProduct.product) {
          // Edit
          return {
            ...s,
            products: s.products.map(p => p.id === editingProduct.product!.id ? { ...p, ...productForm } : p)
          }
        } else {
          // Add
          return {
            ...s,
            products: [...s.products, { id: Math.random().toString(36).substr(2, 9), ...productForm }]
          }
        }
      }
      return s
    }))
    setIsProductDialogOpen(false)
  }

  const handleDeleteProduct = (serviceId: string, productId: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      setServices(services.map(s => {
        if (s.id === serviceId) {
          return { ...s, products: s.products.filter(p => p.id !== productId) }
        }
        return s
      }))
    }
  }

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Catálogo de Serviços</h2>
          <p className="text-muted-foreground">
            Gerencie seus serviços e os produtos vinculados a cada um.
          </p>
        </div>
        <Button onClick={() => {
          setEditingService(null)
          setServiceForm({ name: '', description: '', price: 0 })
          setIsServiceDialogOpen(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Serviço
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar serviços..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredServices.map(service => (
          <Card key={service.id} className="overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => toggleExpand(service.id)}>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  {expandedServices.has(service.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Layers className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{service.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{service.description}</p>
                </div>
                <div className="text-right px-6">
                  <div className="text-sm text-muted-foreground">Valor do Serviço</div>
                  <div className="font-bold text-lg text-primary">{formatCurrency(service.price)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="sm" onClick={() => {
                  setEditingProduct({ serviceId: service.id, product: null })
                  setProductForm({ name: '', description: '' })
                  setIsProductDialogOpen(true)
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Produto
                </Button>
                <Button variant="ghost" size="icon" onClick={() => {
                  setEditingService(service)
                  setServiceForm({ name: service.name, description: service.description, price: service.price })
                  setIsServiceDialogOpen(true)
                }}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteService(service.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {expandedServices.has(service.id) && (
              <div className="border-t bg-card p-4 pl-20">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Produtos Inclusos ({service.products.length})
                </h4>
                {service.products.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">Nenhum produto vinculado a este serviço.</p>
                ) : (
                  <div className="grid gap-3">
                    {service.products.map(product => (
                      <div key={product.id} className="flex items-center justify-between p-3 border rounded-md bg-background group">
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">{product.description}</div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                            setEditingProduct({ serviceId: service.id, product })
                            setProductForm({ name: product.name, description: product.description })
                            setIsProductDialogOpen(true)
                          }}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteProduct(service.id, product.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
        {filteredServices.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Nenhum serviço encontrado.
          </div>
        )}
      </div>

      {/* Service Dialog */}
      <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingService ? 'Editar Serviço' : 'Novo Serviço'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome do Serviço</Label>
              <Input value={serviceForm.name} onChange={e => setServiceForm({...serviceForm, name: e.target.value})} placeholder="Ex: Consultoria Premium" />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Input value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} placeholder="Descrição detalhada do serviço" />
            </div>
            <div className="space-y-2">
              <Label>Valor (R$)</Label>
              <Input type="number" value={serviceForm.price} onChange={e => setServiceForm({...serviceForm, price: Number(e.target.value)})} min={0} step="0.01" />
              <p className="text-xs text-muted-foreground">O valor é definido no serviço. Os produtos vinculados não possuem valor individual.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsServiceDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveService}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProduct?.product ? 'Editar Produto' : 'Adicionar Produto'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome do Produto/Item</Label>
              <Input value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} placeholder="Ex: Módulo Financeiro" />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Input value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} placeholder="Detalhes do item" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveProduct}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
