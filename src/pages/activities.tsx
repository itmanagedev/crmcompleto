import * as React from "react"
import { Search, Plus, Filter, MoreHorizontal, Calendar, Phone, Mail, CheckSquare, Clock, CheckCircle2, Edit2, Trash2 } from "lucide-react"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu"

interface Activity {
  id: string
  title: string
  type: 'call' | 'email' | 'meeting' | 'task'
  relatedTo: string
  dueDate: string
  status: 'pending' | 'completed'
}

const MOCK_ACTIVITIES: Activity[] = [
  { id: 'ACT-001', title: 'Ligar para confirmar reunião', type: 'call', relatedTo: 'TechCorp Solutions', dueDate: '2026-03-20T10:00', status: 'pending' },
  { id: 'ACT-002', title: 'Enviar apresentação institucional', type: 'email', relatedTo: 'Ana Silva', dueDate: '2026-03-19T14:30', status: 'completed' },
  { id: 'ACT-003', title: 'Reunião de Alinhamento', type: 'meeting', relatedTo: 'Global Industries', dueDate: '2026-03-22T15:00', status: 'pending' },
  { id: 'ACT-004', title: 'Revisar contrato', type: 'task', relatedTo: 'Alpha Finance', dueDate: '2026-03-21T18:00', status: 'pending' },
  { id: 'ACT-005', title: 'Follow-up da proposta', type: 'call', relatedTo: 'Beta Corp', dueDate: '2026-03-18T09:00', status: 'completed' },
]

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'call': return <Phone className="h-4 w-4 text-blue-500" />
    case 'email': return <Mail className="h-4 w-4 text-amber-500" />
    case 'meeting': return <Calendar className="h-4 w-4 text-purple-500" />
    case 'task': return <CheckSquare className="h-4 w-4 text-emerald-500" />
  }
}

const getActivityTypeLabel = (type: Activity['type']) => {
  switch (type) {
    case 'call': return 'Ligação'
    case 'email': return 'E-mail'
    case 'meeting': return 'Reunião'
    case 'task': return 'Tarefa'
  }
}

export function Activities() {
  const [activities, setActivities] = React.useState<Activity[]>(MOCK_ACTIVITIES)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isNewActivityOpen, setIsNewActivityOpen] = React.useState(false)
  const [editingActivity, setEditingActivity] = React.useState<Activity | null>(null)
  const [formData, setFormData] = React.useState<Partial<Activity>>({})

  const filteredActivities = React.useMemo(() => {
    return activities.filter(activity => 
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.relatedTo.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [activities, searchQuery])

  const handleOpenNew = () => {
    setEditingActivity(null)
    setFormData({ type: 'call', status: 'pending' })
    setIsNewActivityOpen(true)
  }

  const handleOpenEdit = (activity: Activity) => {
    setEditingActivity(activity)
    setFormData({ ...activity })
    setIsNewActivityOpen(true)
  }

  const handleSave = () => {
    if (editingActivity) {
      setActivities(prev => prev.map(a => a.id === editingActivity.id ? { ...a, ...formData } as Activity : a))
    } else {
      const newActivity: Activity = {
        id: `ACT-00${activities.length + 1}`,
        title: formData.title || 'Nova Atividade',
        type: (formData.type as Activity['type']) || 'task',
        relatedTo: formData.relatedTo || 'Sem relacionamento',
        dueDate: formData.dueDate || new Date().toISOString().slice(0, 16),
        status: 'pending'
      }
      setActivities([newActivity, ...activities])
    }
    setIsNewActivityOpen(false)
  }

  const handleDelete = (id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id))
  }

  const toggleStatus = (id: string) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'pending' ? 'completed' : 'pending' } : a))
  }

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Atividades</h1>
          <p className="text-muted-foreground">Acompanhe suas tarefas, reuniões e ligações.</p>
        </div>
        <Button onClick={handleOpenNew}><Plus className="h-4 w-4 mr-2" /> Nova Atividade</Button>
        <Dialog open={isNewActivityOpen} onOpenChange={setIsNewActivityOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingActivity ? 'Editar Atividade' : 'Agendar Nova Atividade'}</DialogTitle>
              <DialogDescription>
                {editingActivity ? 'Atualize os dados da atividade.' : 'Crie um novo lembrete, tarefa ou evento na sua agenda.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input 
                  id="title" 
                  placeholder="Ex: Ligar para o cliente" 
                  value={formData.title || ''}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={formData.type || 'call'} onValueChange={(v) => setFormData({...formData, type: v as any})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="call">Ligação</SelectItem>
                      <SelectItem value="email">E-mail</SelectItem>
                      <SelectItem value="meeting">Reunião</SelectItem>
                      <SelectItem value="task">Tarefa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Data e Hora</Label>
                  <Input 
                    id="dueDate" 
                    type="datetime-local" 
                    value={formData.dueDate || ''}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="relatedTo">Relacionado a (Contato/Empresa/Deal)</Label>
                <Input 
                  id="relatedTo" 
                  placeholder="Ex: TechCorp Solutions" 
                  value={formData.relatedTo || ''}
                  onChange={(e) => setFormData({...formData, relatedTo: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSave}>Salvar Atividade</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por título ou relacionamento..." 
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
                <th className="px-6 py-3 font-medium">Tipo</th>
                <th className="px-6 py-3 font-medium">Título</th>
                <th className="px-6 py-3 font-medium">Relacionado a</th>
                <th className="px-6 py-3 font-medium">Data/Hora</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    Nenhuma atividade encontrada.
                  </td>
                </tr>
              ) : (
                filteredActivities.map((activity) => (
                  <tr key={activity.id} className="bg-card hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-muted p-2 rounded-full">
                          {getActivityIcon(activity.type)}
                        </div>
                        <span className="text-muted-foreground text-xs font-medium">{getActivityTypeLabel(activity.type)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-foreground">{activity.title}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-muted-foreground">{activity.relatedTo}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(activity.dueDate))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {activity.status === 'completed' ? (
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 cursor-pointer" onClick={() => toggleStatus(activity.id)}>
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Concluída
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-200 cursor-pointer" onClick={() => toggleStatus(activity.id)}>
                          <Clock className="w-3 h-3 mr-1" /> Pendente
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {activity.status === 'pending' && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" title="Marcar como concluída" onClick={() => toggleStatus(activity.id)}>
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenEdit(activity)}>
                              <Edit2 className="h-4 w-4 mr-2" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(activity.id)}>
                              <Trash2 className="h-4 w-4 mr-2" /> Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
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
