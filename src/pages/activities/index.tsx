import * as React from "react"
import { format, isPast, isToday, isTomorrow, addDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { 
  Calendar as CalendarIcon, 
  CheckSquare, 
  Clock, 
  Filter, 
  LayoutGrid, 
  List, 
  MoreHorizontal, 
  Phone, 
  Plus, 
  Search, 
  Mail, 
  MessageCircle, 
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  CalendarDays,
  Users
} from "lucide-react"
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar"
import "react-big-calendar/lib/css/react-big-calendar.css"

import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import { useActivitiesStore, Activity, ActivityType, ActivityStatus, ActivityPriority } from "@/src/store/activities"
import { cn } from "@/src/lib/utils"

const locales = {
  'pt-BR': ptBR,
}

const localizer = dateFnsLocalizer({
  format,
  parse: (dateString: string, formatString: string, locale: any) => {
    return new Date(dateString)
  },
  startOfWeek: () => 0,
  getDay: (date: Date) => date.getDay(),
  locales,
})

const TYPE_CONFIG: Record<ActivityType, { icon: React.ElementType, color: string, label: string }> = {
  call: { icon: Phone, color: 'text-blue-500 bg-blue-50', label: 'Ligação' },
  email: { icon: Mail, color: 'text-emerald-500 bg-emerald-50', label: 'E-mail' },
  meeting: { icon: CalendarIcon, color: 'text-purple-500 bg-purple-50', label: 'Reunião' },
  task: { icon: CheckSquare, color: 'text-amber-500 bg-amber-50', label: 'Tarefa' },
  whatsapp: { icon: MessageCircle, color: 'text-green-500 bg-green-50', label: 'WhatsApp' },
  note: { icon: FileText, color: 'text-slate-500 bg-slate-50', label: 'Nota' },
}

const STATUS_CONFIG: Record<ActivityStatus, { label: string, color: string }> = {
  todo: { label: 'A Fazer', color: 'bg-slate-100 text-slate-700' },
  in_progress: { label: 'Em Andamento', color: 'bg-blue-100 text-blue-700' },
  waiting: { label: 'Aguardando', color: 'bg-amber-100 text-amber-700' },
  done: { label: 'Concluído', color: 'bg-emerald-100 text-emerald-700' },
}

const PRIORITY_CONFIG: Record<ActivityPriority, { label: string, color: string, icon: React.ElementType }> = {
  high: { label: 'Alta', color: 'text-red-500', icon: AlertCircle },
  medium: { label: 'Média', color: 'text-amber-500', icon: Clock },
  low: { label: 'Baixa', color: 'text-slate-500', icon: CheckCircle2 },
}

export function Activities() {
  const { activities, openModal, updateActivity, deleteActivity } = useActivitiesStore()
  const [view, setView] = React.useState<'list' | 'calendar' | 'kanban'>('list')
  const [search, setSearch] = React.useState('')

  const filteredActivities = activities.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.contactName?.toLowerCase().includes(search.toLowerCase()) ||
    a.companyName?.toLowerCase().includes(search.toLowerCase())
  )

  const handleStatusChange = (id: string, status: ActivityStatus) => {
    updateActivity(id, { status })
  }

  const renderList = () => {
    // Group by date
    const grouped = filteredActivities.reduce((acc, activity) => {
      const date = new Date(activity.date)
      let key = 'Futuro'
      if (isPast(date) && !isToday(date)) key = 'Atrasadas'
      else if (isToday(date)) key = 'Hoje'
      else if (isTomorrow(date)) key = 'Amanhã'
      else key = format(date, "EEEE, d 'de' MMMM", { locale: ptBR })
      
      if (!acc[key]) acc[key] = []
      acc[key].push(activity)
      return acc
    }, {} as Record<string, Activity[]>)

    // Sort keys: Atrasadas, Hoje, Amanhã, then others
    const sortedKeys = Object.keys(grouped).sort((a, b) => {
      if (a === 'Atrasadas') return -1
      if (b === 'Atrasadas') return 1
      if (a === 'Hoje') return -1
      if (b === 'Hoje') return 1
      if (a === 'Amanhã') return -1
      if (b === 'Amanhã') return 1
      return 0
    })

    return (
      <div className="space-y-8">
        {sortedKeys.map(group => (
          <div key={group} className="space-y-4">
            <h3 className={cn(
              "text-sm font-semibold uppercase tracking-wider",
              group === 'Atrasadas' ? "text-destructive" : "text-muted-foreground"
            )}>
              {group} ({grouped[group].length})
            </h3>
            <div className="space-y-2">
              {grouped[group].map(activity => {
                const TypeIcon = TYPE_CONFIG[activity.type].icon
                const PriorityIcon = PRIORITY_CONFIG[activity.priority].icon
                
                return (
                  <div 
                    key={activity.id} 
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-lg border bg-card transition-all hover:shadow-sm",
                      activity.status === 'done' && "opacity-60"
                    )}
                  >
                    <div className={cn("p-2 rounded-full", TYPE_CONFIG[activity.type].color)}>
                      <TypeIcon className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          "font-medium truncate",
                          activity.status === 'done' && "line-through text-muted-foreground"
                        )}>
                          {activity.title}
                        </span>
                        {activity.priority === 'high' && (
                          <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">Alta</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(activity.date), "HH:mm")}
                        </span>
                        {activity.contactName && (
                          <span className="flex items-center gap-1 truncate">
                            • {activity.contactName}
                          </span>
                        )}
                        {activity.companyName && (
                          <span className="flex items-center gap-1 truncate">
                            • {activity.companyName}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={cn("hidden sm:inline-flex", STATUS_CONFIG[activity.status].color)}>
                        {STATUS_CONFIG[activity.status].label}
                      </Badge>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          {activity.status !== 'done' && (
                            <DropdownMenuItem onClick={() => handleStatusChange(activity.id, 'done')}>
                              <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500" /> Marcar como Concluído
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => openModal(activity)}>
                            <CalendarIcon className="h-4 w-4 mr-2" /> Editar / Reagendar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => deleteActivity(activity.id)}>
                            <XCircle className="h-4 w-4 mr-2" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
        {sortedKeys.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Nenhuma atividade encontrada.
          </div>
        )}
      </div>
    )
  }

  const renderCalendar = () => {
    const events = filteredActivities.map(a => ({
      id: a.id,
      title: a.title,
      start: new Date(a.date),
      end: new Date(new Date(a.date).getTime() + (a.duration || 30) * 60000),
      resource: a
    }))

    return (
      <div className="h-[600px] bg-card border rounded-lg p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          culture="pt-BR"
          messages={{
            next: "Próximo",
            previous: "Anterior",
            today: "Hoje",
            month: "Mês",
            week: "Semana",
            day: "Dia",
            agenda: "Agenda",
            date: "Data",
            time: "Hora",
            event: "Evento",
            noEventsInRange: "Nenhum evento neste período.",
          }}
          onSelectEvent={(event) => openModal(event.resource)}
          onSelectSlot={(slotInfo) => {
            // Pre-fill date in modal? For now just open
            openModal()
          }}
          selectable
          eventPropGetter={(event) => {
            const type = event.resource.type as ActivityType
            let bgColor = '#3b82f6' // blue
            if (type === 'meeting') bgColor = '#a855f7' // purple
            if (type === 'task') bgColor = '#f59e0b' // amber
            if (type === 'email') bgColor = '#10b981' // emerald
            if (type === 'whatsapp') bgColor = '#22c55e' // green
            
            return {
              style: {
                backgroundColor: bgColor,
                borderColor: bgColor,
                opacity: event.resource.status === 'done' ? 0.6 : 1
              }
            }
          }}
        />
      </div>
    )
  }

  const renderKanban = () => {
    const columns: { id: ActivityStatus, label: string }[] = [
      { id: 'todo', label: 'A Fazer' },
      { id: 'in_progress', label: 'Em Andamento' },
      { id: 'done', label: 'Concluído' },
    ]

    return (
      <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-220px)]">
        {columns.map(col => {
          const colActivities = filteredActivities.filter(a => a.status === col.id)
          
          return (
            <div key={col.id} className="flex-shrink-0 w-80 flex flex-col bg-muted/50 rounded-lg border">
              <div className="p-3 border-b flex items-center justify-between bg-card rounded-t-lg">
                <h3 className="font-medium text-sm">{col.label}</h3>
                <Badge variant="secondary">{colActivities.length}</Badge>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {colActivities.map(activity => {
                  const TypeIcon = TYPE_CONFIG[activity.type].icon
                  
                  return (
                    <div 
                      key={activity.id}
                      className="bg-card p-3 rounded-md border shadow-sm cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => openModal(activity)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className={cn("p-1.5 rounded-md", TYPE_CONFIG[activity.type].color)}>
                          <TypeIcon className="h-3.5 w-3.5" />
                        </div>
                        {activity.priority === 'high' && (
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                      <h4 className="font-medium text-sm mb-1">{activity.title}</h4>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          {format(new Date(activity.date), "dd/MM 'às' HH:mm")}
                        </div>
                        {activity.contactName && (
                          <div className="flex items-center gap-1 truncate">
                            <Users className="h-3 w-3" />
                            {activity.contactName}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Atividades</h1>
          <p className="text-muted-foreground">Gerencie suas tarefas, reuniões e ligações.</p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Atividade
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar atividades..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Tabs value={view} onValueChange={(v: any) => setView(v)} className="w-full sm:w-auto">
          <TabsList className="grid w-full grid-cols-3 sm:w-[300px]">
            <TabsTrigger value="list"><List className="h-4 w-4 mr-2 hidden sm:inline-block" /> Lista</TabsTrigger>
            <TabsTrigger value="calendar"><CalendarDays className="h-4 w-4 mr-2 hidden sm:inline-block" /> Calendário</TabsTrigger>
            <TabsTrigger value="kanban"><LayoutGrid className="h-4 w-4 mr-2 hidden sm:inline-block" /> Kanban</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {view === 'list' && renderList()}
      {view === 'calendar' && renderCalendar()}
      {view === 'kanban' && renderKanban()}
    </div>
  )
}
