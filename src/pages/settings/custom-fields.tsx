import * as React from "react"
import { Plus, GripVertical, Trash2, Edit2, Loader2, Save, Type, Hash, Calendar, List, CheckSquare, Link as LinkIcon } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/src/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Switch } from "@/src/components/ui/switch"
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

type FieldType = 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'url'

interface CustomField {
  id: string
  name: string
  type: FieldType
  required: boolean
  options?: string[] // For select fields
}

const INITIAL_FIELDS: CustomField[] = [
  { id: '1', name: 'Setor de Atuação', type: 'select', required: true, options: ['Tecnologia', 'Saúde', 'Finanças', 'Varejo'] },
  { id: '2', name: 'Número de Funcionários', type: 'number', required: false },
  { id: '3', name: 'Data de Fundação', type: 'date', required: false },
  { id: '4', name: 'LinkedIn da Empresa', type: 'url', required: false },
  { id: '5', name: 'Cliente VIP', type: 'checkbox', required: false },
]

const FIELD_ICONS: Record<FieldType, React.ElementType> = {
  text: Type,
  number: Hash,
  date: Calendar,
  select: List,
  checkbox: CheckSquare,
  url: LinkIcon,
}

function SortableFieldItem({ field, onRemove }: { field: CustomField, onRemove: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  }

  const Icon = FIELD_ICONS[field.type]

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
        <div className="col-span-4 flex items-center gap-3">
          <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
          <Input defaultValue={field.name} className="h-8 font-medium" />
        </div>
        
        <div className="col-span-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Select defaultValue={field.type}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Texto Curto</SelectItem>
              <SelectItem value="number">Número</SelectItem>
              <SelectItem value="date">Data</SelectItem>
              <SelectItem value="select">Lista (Select)</SelectItem>
              <SelectItem value="checkbox">Checkbox</SelectItem>
              <SelectItem value="url">URL</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="col-span-4 flex items-center justify-center gap-2">
          <div className="flex items-center space-x-2">
            <Switch id={`required-${field.id}`} defaultChecked={field.required} />
            <Label htmlFor={`required-${field.id}`} className="text-xs">Obrigatório</Label>
          </div>
        </div>

        <div className="col-span-1 flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:bg-destructive/10"
            onClick={() => onRemove(field.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export function CustomFieldsSettings() {
  const [fields, setFields] = React.useState<CustomField[]>(INITIAL_FIELDS)
  const [isLoading, setIsLoading] = React.useState(false)
  const [activeModule, setActiveModule] = React.useState('companies')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleAddField = () => {
    const newField: CustomField = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Novo Campo',
      type: 'text',
      required: false,
    }
    setFields([...fields, newField])
  }

  const handleRemoveField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id))
  }

  const handleSave = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Campos Personalizados</h3>
          <p className="text-sm text-muted-foreground">
            Adicione campos extras aos formulários padrão do CRM.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={activeModule} onValueChange={setActiveModule}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Selecione o Módulo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="contacts">Contatos</SelectItem>
              <SelectItem value="companies">Empresas</SelectItem>
              <SelectItem value="deals">Negócios (Deals)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Campos em {activeModule === 'companies' ? 'Empresas' : activeModule === 'contacts' ? 'Contatos' : 'Negócios'}</CardTitle>
              <CardDescription>Arraste para reordenar a exibição nos formulários.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleAddField}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Campo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-12 gap-4 px-12 pb-2 text-sm font-medium text-muted-foreground">
            <div className="col-span-4">Nome do Campo</div>
            <div className="col-span-3">Tipo</div>
            <div className="col-span-4 text-center">Validação</div>
            <div className="col-span-1 text-right">Ações</div>
          </div>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={fields.map(f => f.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {fields.map((field) => (
                  <SortableFieldItem
                    key={field.id}
                    field={field}
                    onRemove={handleRemoveField}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </CardContent>
        <CardFooter className="border-t px-6 py-4 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Total de {fields.length} campos personalizados.
          </p>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Salvar Campos
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
