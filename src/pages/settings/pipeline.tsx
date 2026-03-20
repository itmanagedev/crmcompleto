import * as React from "react"
import { Plus, GripVertical, Trash2, Edit2, Loader2, Save } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/src/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Stage {
  id: string
  name: string
  color: string
  probability: number
}

const INITIAL_STAGES: Stage[] = [
  { id: '1', name: 'Prospecção', color: '#94a3b8', probability: 10 },
  { id: '2', name: 'Qualificação', color: '#60a5fa', probability: 30 },
  { id: '3', name: 'Proposta', color: '#f59e0b', probability: 60 },
  { id: '4', name: 'Negociação', color: '#c084fc', probability: 80 },
  { id: '5', name: 'Fechado Ganho', color: '#22c55e', probability: 100 },
  { id: '6', name: 'Fechado Perdido', color: '#ef4444', probability: 0 },
]

function SortableStageItem({ stage, onRemove }: { stage: Stage, onRemove: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stage.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 bg-white border rounded-lg shadow-sm ${
        isDragging ? 'opacity-50 ring-2 ring-primary' : ''
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-100 rounded text-slate-400"
      >
        <GripVertical className="h-5 w-5" />
      </div>

      <div className="flex-1 grid grid-cols-12 gap-4 items-center">
        <div className="col-span-5 flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-full shrink-0"
            style={{ backgroundColor: stage.color }}
          />
          <Input defaultValue={stage.name} className="h-8" />
        </div>
        
        <div className="col-span-3 flex items-center gap-2">
          <Input type="color" defaultValue={stage.color} className="h-8 w-12 p-1" />
        </div>
        
        <div className="col-span-3 flex items-center gap-2">
          <Input type="number" defaultValue={stage.probability} className="h-8 w-20" min="0" max="100" />
          <span className="text-sm text-muted-foreground">%</span>
        </div>

        <div className="col-span-1 flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:bg-destructive/10"
            onClick={() => onRemove(stage.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export function PipelineSettings() {
  const [stages, setStages] = React.useState<Stage[]>(INITIAL_STAGES)
  const [isLoading, setIsLoading] = React.useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setStages((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleAddStage = () => {
    const newStage: Stage = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Novo Estágio',
      color: '#cbd5e1',
      probability: 0,
    }
    setStages([...stages, newStage])
  }

  const handleRemoveStage = (id: string) => {
    setStages(stages.filter((s) => s.id !== id))
  }

  const handleSave = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Pipeline de Vendas</h3>
          <p className="text-sm text-muted-foreground">
            Configure os estágios do seu funil e a probabilidade de fechamento.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="vendas">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Selecione o Pipeline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vendas">Vendas B2B</SelectItem>
              <SelectItem value="renovacao">Renovações</SelectItem>
              <SelectItem value="parcerias">Parcerias</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Estágios do Pipeline</CardTitle>
              <CardDescription>Arraste para reordenar os estágios. A ordem define o fluxo do Kanban.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleAddStage}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Estágio
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-12 gap-4 px-12 pb-2 text-sm font-medium text-muted-foreground">
            <div className="col-span-5">Nome do Estágio</div>
            <div className="col-span-3">Cor</div>
            <div className="col-span-3">Probabilidade</div>
            <div className="col-span-1 text-right">Ações</div>
          </div>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={stages.map(s => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {stages.map((stage) => (
                  <SortableStageItem
                    key={stage.id}
                    stage={stage}
                    onRemove={handleRemoveStage}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </CardContent>
        <CardFooter className="border-t px-6 py-4 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Total de {stages.length} estágios configurados.
          </p>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Salvar Pipeline
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
