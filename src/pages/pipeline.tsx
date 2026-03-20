import * as React from "react"
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects
} from "@dnd-kit/core"
import { 
  SortableContext, 
  arrayMove, 
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable"
import { useDroppable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Calendar as CalendarIcon, 
  Phone, 
  Mail, 
  CheckSquare,
  Clock
} from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Progress } from "@/src/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/src/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { cn } from "@/src/lib/utils"

// --- Types & Mock Data ---

type StageId = 'prospeccao' | 'qualificacao' | 'proposta' | 'negociacao' | 'fechamento' | 'ganho' | 'perdido'

interface Deal {
  id: string
  title: string
  company: string
  companyAvatar: string
  value: number
  probability: number
  owner: { name: string; avatar: string }
  expectedCloseDate: string
  daysInStage: number
  stageId: StageId
  activities: ('call' | 'email' | 'meeting' | 'task')[]
}

interface Stage {
  id: StageId
  title: string
  color: string
}

const STAGES: Stage[] = [
  { id: 'prospeccao', title: 'Prospecção', color: 'bg-slate-500' },
  { id: 'qualificacao', title: 'Qualificação', color: 'bg-blue-500' },
  { id: 'proposta', title: 'Proposta Enviada', color: 'bg-indigo-500' },
  { id: 'negociacao', title: 'Negociação', color: 'bg-amber-500' },
  { id: 'fechamento', title: 'Fechamento', color: 'bg-orange-500' },
  { id: 'ganho', title: 'Ganho ✓', color: 'bg-emerald-500' },
  { id: 'perdido', title: 'Perdido ✗', color: 'bg-red-500' },
]

const INITIAL_DEALS: Deal[] = [
  {
    id: 'deal-1',
    title: 'Licenciamento Enterprise',
    company: 'TechCorp Solutions',
    companyAvatar: 'TC',
    value: 125000,
    probability: 20,
    owner: { name: 'Ana Silva', avatar: 'https://i.pravatar.cc/150?u=ana' },
    expectedCloseDate: '2026-04-15',
    daysInStage: 3,
    stageId: 'prospeccao',
    activities: ['call', 'email'],
  },
  {
    id: 'deal-2',
    title: 'Consultoria de Implantação',
    company: 'Global Industries',
    companyAvatar: 'GI',
    value: 85000,
    probability: 40,
    owner: { name: 'Carlos Mendes', avatar: 'https://i.pravatar.cc/150?u=carlos' },
    expectedCloseDate: '2026-04-20',
    daysInStage: 8,
    stageId: 'qualificacao',
    activities: ['meeting'],
  },
  {
    id: 'deal-3',
    title: 'Upgrade de Servidores',
    company: 'Inova Sistemas',
    companyAvatar: 'IS',
    value: 45000,
    probability: 60,
    owner: { name: 'Mariana Costa', avatar: 'https://i.pravatar.cc/150?u=mariana' },
    expectedCloseDate: '2026-03-30',
    daysInStage: 2,
    stageId: 'proposta',
    activities: ['email', 'task'],
  },
  {
    id: 'deal-4',
    title: 'Auditoria de Segurança',
    company: 'Alpha Finance',
    companyAvatar: 'AF',
    value: 210000,
    probability: 80,
    owner: { name: 'Roberto Alves', avatar: 'https://i.pravatar.cc/150?u=roberto' },
    expectedCloseDate: '2026-03-25',
    daysInStage: 12,
    stageId: 'negociacao',
    activities: ['call', 'meeting'],
  },
  {
    id: 'deal-5',
    title: 'Treinamento de Equipe',
    company: 'Beta Corp',
    companyAvatar: 'BC',
    value: 35000,
    probability: 90,
    owner: { name: 'Ana Silva', avatar: 'https://i.pravatar.cc/150?u=ana' },
    expectedCloseDate: '2026-03-22',
    daysInStage: 1,
    stageId: 'fechamento',
    activities: ['task'],
  },
]

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'call': return <Phone className="h-3 w-3 text-blue-500" />
    case 'email': return <Mail className="h-3 w-3 text-amber-500" />
    case 'meeting': return <CalendarIcon className="h-3 w-3 text-purple-500" />
    case 'task': return <CheckSquare className="h-3 w-3 text-emerald-500" />
    default: return null
  }
}

// --- Components ---

// Sortable Deal Card
function SortableDealCard({ deal, onClick }: { deal: Deal; onClick: (deal: Deal) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: deal.id, data: { type: 'Deal', deal } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(deal)}
      className="bg-card text-card-foreground rounded-lg border shadow-sm p-3 cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">{deal.companyAvatar}</AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-muted-foreground truncate max-w-[120px]">{deal.company}</span>
        </div>
        <Avatar className="h-5 w-5">
          <AvatarImage src={deal.owner.avatar} />
          <AvatarFallback className="text-[8px]">{deal.owner.name.substring(0,2)}</AvatarFallback>
        </Avatar>
      </div>
      
      <h4 className="text-sm font-semibold leading-tight mb-1">{deal.title}</h4>
      <div className="text-sm font-bold text-primary mb-3">{formatCurrency(deal.value)}</div>
      
      <div className="space-y-1 mb-3">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Probabilidade</span>
          <span>{deal.probability}%</span>
        </div>
        <Progress value={deal.probability} className="h-1.5" />
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
        <div className="flex items-center gap-1">
          {deal.activities.map((act, i) => (
            <div key={i} className="bg-muted rounded-full p-1" title={act}>
              {getActivityIcon(act)}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {deal.daysInStage > 7 && (
            <Badge variant="warning" className="text-[9px] px-1 py-0 h-4 flex items-center gap-1">
              <Clock className="h-2.5 w-2.5" />
              {deal.daysInStage}d
            </Badge>
          )}
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <CalendarIcon className="h-3 w-3" />
            {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(new Date(deal.expectedCloseDate))}
          </span>
        </div>
      </div>
    </div>
  )
}

// Deal Card for Drag Overlay
function DealCardOverlay({ deal }: { deal: Deal }) {
  return (
    <div className="bg-card text-card-foreground rounded-lg border shadow-lg p-3 cursor-grabbing rotate-2 scale-105">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">{deal.companyAvatar}</AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-muted-foreground truncate max-w-[120px]">{deal.company}</span>
        </div>
      </div>
      <h4 className="text-sm font-semibold leading-tight mb-1">{deal.title}</h4>
      <div className="text-sm font-bold text-primary mb-3">{formatCurrency(deal.value)}</div>
      <Progress value={deal.probability} className="h-1.5 mb-3" />
    </div>
  )
}

// Droppable Column
function DroppableColumn({ stage, deals, children }: { stage: Stage; deals: Deal[]; children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({
    id: stage.id,
    data: {
      type: 'Column',
      stage
    }
  })

  return (
    <div 
      ref={setNodeRef}
      className="flex-1 bg-muted/30 rounded-xl p-2 overflow-y-auto border border-transparent transition-colors"
    >
      <SortableContext 
        id={stage.id}
        items={deals.map(d => d.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3 min-h-[150px]">
          {children}
        </div>
      </SortableContext>
    </div>
  )
}

// Form Schema
const dealFormSchema = z.object({
  title: z.string().min(3, "Título deve ter no mínimo 3 caracteres"),
  company: z.string().min(2, "Empresa obrigatória"),
  value: z.number().min(1, "Valor deve ser maior que zero"),
  stageId: z.string(),
  probability: z.number().min(0).max(100),
  expectedCloseDate: z.string(),
  description: z.string().optional(),
})

type DealFormValues = z.infer<typeof dealFormSchema>

export function Pipeline() {
  const [deals, setDeals] = React.useState<Deal[]>(INITIAL_DEALS)
  const [activeDeal, setActiveDeal] = React.useState<Deal | null>(null)
  const [selectedDeal, setSelectedDeal] = React.useState<Deal | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false)
  const [isNewDealOpen, setIsNewDealOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [activeMobileStage, setActiveMobileStage] = React.useState<StageId>('prospeccao')

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const form = useForm<z.infer<typeof dealFormSchema>>({
    resolver: zodResolver(dealFormSchema),
    defaultValues: {
      title: "",
      company: "",
      value: 0,
      stageId: "prospeccao",
      probability: 20,
      expectedCloseDate: new Date().toISOString().split('T')[0],
      description: "",
    },
  })

  // Filtered Deals
  const filteredDeals = React.useMemo(() => {
    return deals.filter(deal => 
      deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.company.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [deals, searchQuery])

  // Stats
  const stats = React.useMemo(() => {
    const activeDeals = deals.filter(d => d.stageId !== 'ganho' && d.stageId !== 'perdido')
    const totalValue = activeDeals.reduce((acc, deal) => acc + deal.value, 0)
    const weightedValue = activeDeals.reduce((acc, deal) => acc + (deal.value * (deal.probability / 100)), 0)
    
    return {
      count: activeDeals.length,
      totalValue,
      weightedValue
    }
  }, [deals])

  // Drag Handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const deal = deals.find(d => d.id === active.id)
    if (deal) setActiveDeal(deal)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveDeal = active.data.current?.type === 'Deal'
    const isOverDeal = over.data.current?.type === 'Deal'
    const isOverColumn = over.data.current?.type === 'Column'

    if (!isActiveDeal) return

    // Dropping a deal over another deal
    if (isActiveDeal && isOverDeal) {
      setDeals((deals) => {
        const activeIndex = deals.findIndex((t) => t.id === activeId)
        const overIndex = deals.findIndex((t) => t.id === overId)

        if (deals[activeIndex].stageId !== deals[overIndex].stageId) {
          const newDeals = [...deals]
          newDeals[activeIndex].stageId = deals[overIndex].stageId
          newDeals[activeIndex].daysInStage = 0 // Reset days when moving stage
          return arrayMove(newDeals, activeIndex, overIndex)
        }

        return arrayMove(deals, activeIndex, overIndex)
      })
    }

    // Dropping a deal over a column
    if (isActiveDeal && isOverColumn) {
      setDeals((deals) => {
        const activeIndex = deals.findIndex((t) => t.id === activeId)
        const newDeals = [...deals]
        newDeals[activeIndex].stageId = overId as StageId
        newDeals[activeIndex].daysInStage = 0
        return arrayMove(newDeals, activeIndex, activeIndex)
      })
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDeal(null)
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    setDeals((deals) => {
      const activeIndex = deals.findIndex((t) => t.id === activeId)
      const overIndex = deals.findIndex((t) => t.id === overId)
      
      if (overIndex !== -1) {
        return arrayMove(deals, activeIndex, overIndex)
      }
      return deals
    })
  }

  const handleDealClick = (deal: Deal) => {
    setSelectedDeal(deal)
    setIsDetailsOpen(true)
  }

  const handleMoveDeal = (dealId: string, newStageId: StageId) => {
    setDeals(currentDeals => currentDeals.map(d => d.id === dealId ? { ...d, stageId: newStageId } : d))
    if (selectedDeal?.id === dealId) {
      setSelectedDeal(prev => prev ? { ...prev, stageId: newStageId } : null)
    }
  }

  const onSubmitNewDeal = (values: DealFormValues) => {
    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      title: values.title,
      company: values.company,
      companyAvatar: values.company.substring(0, 2).toUpperCase(),
      value: values.value,
      probability: values.probability,
      owner: { name: 'Usuário Atual', avatar: 'https://i.pravatar.cc/150?u=current' },
      expectedCloseDate: values.expectedCloseDate,
      daysInStage: 0,
      stageId: values.stageId as StageId,
      activities: [],
    }
    setDeals([...deals, newDeal])
    setIsNewDealOpen(false)
    form.reset()
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] space-y-4 overflow-hidden">
      {/* Header & Stats */}
      <div className="flex flex-col gap-4 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display tracking-tight">Pipeline</h1>
            <p className="text-muted-foreground">Gerencie suas oportunidades de vendas</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isNewDealOpen} onOpenChange={setIsNewDealOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" /> Novo Deal</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Criar Nova Oportunidade</DialogTitle>
                  <DialogDescription>
                    Preencha os dados básicos para adicionar um novo deal ao pipeline.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmitNewDeal)} className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="title">Título do Deal</Label>
                      <Input id="title" {...form.register("title")} placeholder="Ex: Licenciamento Anual" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Empresa</Label>
                      <Input id="company" {...form.register("company")} placeholder="Ex: Acme Corp" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="value">Valor (R$)</Label>
                      <Input id="value" type="number" {...form.register("value", { valueAsNumber: true })} placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stageId">Estágio Inicial</Label>
                      <Select onValueChange={(val) => form.setValue("stageId", val)} defaultValue={form.getValues("stageId")}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {STAGES.map(stage => (
                            <SelectItem key={stage.id} value={stage.id}>{stage.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="probability">Probabilidade (%)</Label>
                      <Input id="probability" type="number" {...form.register("probability", { valueAsNumber: true })} />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="expectedCloseDate">Previsão de Fechamento</Label>
                      <Input id="expectedCloseDate" type="date" {...form.register("expectedCloseDate")} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Salvar Deal</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats & Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-card p-3 rounded-lg border shadow-sm">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Deals Ativos</p>
              <p className="text-xl font-bold">{stats.count}</p>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Valor Total</p>
              <p className="text-xl font-bold text-primary">{formatCurrency(stats.totalValue)}</p>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Receita Ponderada</p>
              <p className="text-xl font-bold text-emerald-500">{formatCurrency(stats.weightedValue)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar deals..." 
                className="pl-9 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="md:hidden mb-4">
        <Select value={activeMobileStage} onValueChange={(val) => setActiveMobileStage(val as StageId)}>
          <SelectTrigger className="w-full bg-card">
            <SelectValue placeholder="Selecione o estágio" />
          </SelectTrigger>
          <SelectContent>
            {STAGES.map(stage => (
              <SelectItem key={stage.id} value={stage.id}>
                <div className="flex items-center gap-2">
                  <div className={cn("w-3 h-3 rounded-full", stage.color)} />
                  {stage.title}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex h-full gap-4 min-w-max px-1 md:min-w-max">
            {STAGES.map((stage) => {
              const stageDeals = filteredDeals.filter(d => d.stageId === stage.id)
              const stageValue = stageDeals.reduce((acc, d) => acc + d.value, 0)
              
              const isMobileHidden = stage.id !== activeMobileStage

              return (
                <div key={stage.id} className={cn("flex-col w-[320px] shrink-0 h-full", isMobileHidden ? "hidden md:flex" : "flex")}>
                  {/* Column Header */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-3 h-3 rounded-full", stage.color)} />
                        <h3 className="font-semibold text-sm">{stage.title}</h3>
                        <Badge variant="secondary" className="px-1.5 py-0 text-xs font-normal">
                          {stageDeals.length}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-xs font-medium text-muted-foreground">
                      {formatCurrency(stageValue)}
                    </div>
                  </div>

                  {/* Column Body (Droppable) */}
                  <DroppableColumn stage={stage} deals={stageDeals}>
                    {stageDeals.map(deal => (
                      <SortableDealCard key={deal.id} deal={deal} onClick={handleDealClick} />
                    ))}
                  </DroppableColumn>
                </div>
              )
            })}
          </div>

          <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }) }}>
            {activeDeal ? <DealCardOverlay deal={activeDeal} /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Deal Details Slide-over */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md md:max-w-lg overflow-y-auto p-0">
          {selectedDeal && (
            <div className="flex flex-col h-full">
              <div className="p-6 border-b">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                      {selectedDeal.companyAvatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">{selectedDeal.title}</h2>
                    <p className="text-muted-foreground">{selectedDeal.company}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Valor</p>
                    <p className="text-lg font-bold text-primary">{formatCurrency(selectedDeal.value)}</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Fechamento Previsto</p>
                    <p className="text-sm font-semibold flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      {new Intl.DateTimeFormat('pt-BR').format(new Date(selectedDeal.expectedCloseDate))}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Probabilidade</span>
                    <span className="font-medium">{selectedDeal.probability}%</span>
                  </div>
                  <Progress value={selectedDeal.probability} className="h-2" />
                </div>
              </div>

              <div className="flex-1 p-6">
                <Tabs defaultValue="activities" className="w-full">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="activities">Atividades</TabsTrigger>
                    <TabsTrigger value="details">Detalhes</TabsTrigger>
                  </TabsList>
                  <TabsContent value="activities" className="mt-4 space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold">Timeline</h3>
                      <Button size="sm" variant="outline"><Plus className="h-3 w-3 mr-1" /> Nova</Button>
                    </div>
                    
                    {/* Mock Timeline */}
                    <div className="relative border-l border-muted ml-3 space-y-6 pb-4">
                      <div className="relative pl-6">
                        <span className="absolute -left-3 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 ring-4 ring-background">
                          <Phone className="h-3 w-3 text-blue-600" />
                        </span>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">Ligação de Qualificação</span>
                          <span className="text-xs text-muted-foreground">Hoje, 10:30</span>
                          <p className="text-sm mt-2 bg-muted/50 p-2 rounded-md">Cliente demonstrou interesse na versão Enterprise. Agendada demo para próxima semana.</p>
                        </div>
                      </div>
                      <div className="relative pl-6">
                        <span className="absolute -left-3 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 ring-4 ring-background">
                          <Mail className="h-3 w-3 text-amber-600" />
                        </span>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">E-mail de Apresentação</span>
                          <span className="text-xs text-muted-foreground">Há 2 dias</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="details" className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-muted-foreground text-xs">Responsável</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={selectedDeal.owner.avatar} />
                            <AvatarFallback>{selectedDeal.owner.name.substring(0,2)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{selectedDeal.owner.name}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">Estágio Atual</Label>
                        <p className="text-sm font-medium mt-1">
                          {STAGES.find(s => s.id === selectedDeal.stageId)?.title} ({selectedDeal.daysInStage} dias)
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="p-4 border-t bg-muted/20 flex flex-col gap-2">
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" 
                    onClick={() => handleMoveDeal(selectedDeal.id, 'ganho')}
                    disabled={selectedDeal.stageId === 'ganho'}
                  >
                    Ganho ✓
                  </Button>
                  <Button 
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white" 
                    onClick={() => handleMoveDeal(selectedDeal.id, 'perdido')}
                    disabled={selectedDeal.stageId === 'perdido'}
                  >
                    Perdido ✗
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1" variant="default">Enviar Proposta</Button>
                  <Button className="flex-1" variant="outline">Editar Deal</Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
