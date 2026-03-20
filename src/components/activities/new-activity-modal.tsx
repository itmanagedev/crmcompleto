import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Phone, Mail, Calendar, CheckSquare, MessageCircle, FileText, Clock, AlertCircle, Users, Building2, Briefcase } from "lucide-react"
import { useActivitiesStore, ActivityType, ActivityPriority } from "@/src/store/activities"
import { cn } from "@/src/lib/utils"

const ACTIVITY_TYPES: { id: ActivityType, label: string, icon: React.ElementType, color: string }[] = [
  { id: 'call', label: 'Ligação', icon: Phone, color: 'text-blue-500 bg-blue-50 border-blue-200' },
  { id: 'email', label: 'E-mail', icon: Mail, color: 'text-emerald-500 bg-emerald-50 border-emerald-200' },
  { id: 'meeting', label: 'Reunião', icon: Calendar, color: 'text-purple-500 bg-purple-50 border-purple-200' },
  { id: 'task', label: 'Tarefa', icon: CheckSquare, color: 'text-amber-500 bg-amber-50 border-amber-200' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: 'text-green-500 bg-green-50 border-green-200' },
  { id: 'note', label: 'Nota', icon: FileText, color: 'text-slate-500 bg-slate-50 border-slate-200' },
]

export function NewActivityModal() {
  const { isModalOpen, closeModal, addActivity, updateActivity, editingActivity } = useActivitiesStore()
  
  const [type, setType] = React.useState<ActivityType>('task')
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [date, setDate] = React.useState('')
  const [time, setTime] = React.useState('')
  const [duration, setDuration] = React.useState('30')
  const [priority, setPriority] = React.useState<ActivityPriority>('medium')
  const [contact, setContact] = React.useState('')
  const [company, setCompany] = React.useState('')
  const [deal, setDeal] = React.useState('')
  const [reminder, setReminder] = React.useState('15m')
  const [recurrence, setRecurrence] = React.useState('none')

  React.useEffect(() => {
    if (editingActivity) {
      setType(editingActivity.type)
      setTitle(editingActivity.title)
      setDescription(editingActivity.description || '')
      
      const d = new Date(editingActivity.date)
      setDate(d.toISOString().split('T')[0])
      setTime(d.toTimeString().substring(0, 5))
      
      setDuration(editingActivity.duration?.toString() || '30')
      setPriority(editingActivity.priority)
      setContact(editingActivity.contactName || '')
      setCompany(editingActivity.companyName || '')
      setDeal(editingActivity.dealTitle || '')
      setReminder(editingActivity.reminder || '15m')
      setRecurrence(editingActivity.recurrence || 'none')
    } else {
      // Reset
      setType('task')
      setTitle('')
      setDescription('')
      setDate(new Date().toISOString().split('T')[0])
      setTime('09:00')
      setDuration('30')
      setPriority('medium')
      setContact('')
      setCompany('')
      setDeal('')
      setReminder('15m')
      setRecurrence('none')
    }
  }, [editingActivity, isModalOpen])

  const handleSave = () => {
    if (!title) return

    const activityDate = new Date(`${date}T${time}:00`)
    
    const activityData = {
      title,
      description,
      type,
      status: editingActivity ? editingActivity.status : 'todo' as const,
      priority,
      date: activityDate.toISOString(),
      duration: parseInt(duration),
      contactName: contact,
      companyName: company,
      dealTitle: deal,
      owner: 'João Silva', // Mock current user
      reminder,
      recurrence
    }

    if (editingActivity) {
      updateActivity(editingActivity.id, activityData)
    } else {
      addActivity(activityData)
    }
    
    closeModal()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingActivity ? 'Editar Atividade' : 'Nova Atividade'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Type Selection */}
          <div className="space-y-3">
            <Label>Tipo de Atividade</Label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {ACTIVITY_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-3 rounded-lg border transition-all",
                    type === t.id ? t.color : "border-border hover:bg-muted/50 text-muted-foreground"
                  )}
                >
                  <t.icon className="h-5 w-5" />
                  <span className="text-[10px] font-medium uppercase tracking-wider">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Ligar para confirmar proposta..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Descrição</Label>
              <Textarea id="desc" value={description} onChange={e => setDescription(e.target.value)} placeholder="Detalhes da atividade..." className="resize-none" rows={3} />
            </div>
          </div>

          {/* Relations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Users className="h-3 w-3" /> Contato</Label>
              <Input value={contact} onChange={e => setContact(e.target.value)} placeholder="Buscar contato..." />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Building2 className="h-3 w-3" /> Empresa</Label>
              <Input value={company} onChange={e => setCompany(e.target.value)} placeholder="Buscar empresa..." />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label className="flex items-center gap-2"><Briefcase className="h-3 w-3" /> Negócio (Deal) Opcional</Label>
              <Input value={deal} onChange={e => setDeal(e.target.value)} placeholder="Vincular a um negócio..." />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-2 col-span-2">
              <Label className="flex items-center gap-2"><Calendar className="h-3 w-3" /> Data</Label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Clock className="h-3 w-3" /> Hora</Label>
              <Input type="time" value={time} onChange={e => setTime(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Duração</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 min</SelectItem>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="45">45 min</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                  <SelectItem value="120">2 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><AlertCircle className="h-3 w-3" /> Prioridade</Label>
              <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Lembrete</Label>
              <Select value={reminder} onValueChange={setReminder}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  <SelectItem value="15m">15 min antes</SelectItem>
                  <SelectItem value="1h">1 hora antes</SelectItem>
                  <SelectItem value="1d">1 dia antes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Recorrência</Label>
              <Select value={recurrence} onValueChange={setRecurrence}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Não repete</SelectItem>
                  <SelectItem value="daily">Diariamente</SelectItem>
                  <SelectItem value="weekly">Semanalmente</SelectItem>
                  <SelectItem value="monthly">Mensalmente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={closeModal}>Cancelar</Button>
          <Button onClick={handleSave} disabled={!title}>Salvar Atividade</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
