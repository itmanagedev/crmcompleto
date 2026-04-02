import * as React from "react"
import { 
  Users, 
  Building2, 
  FileText, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Briefcase,
  Target,
  CalendarCheck,
  Phone,
  Mail,
  Calendar,
  CheckSquare,
  MessageCircle,
  AlertCircle
} from "lucide-react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts"
import { format } from "date-fns"
import { useNavigate } from "react-router-dom"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Skeleton } from "@/src/components/ui/skeleton"
import { Progress } from "@/src/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"

import { cn } from "@/src/lib/utils"
import { useActivitiesStore, ActivityType } from "@/src/store/activities"

export function Dashboard() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = React.useState(true)
  const [period, setPeriod] = React.useState("30d")
  const { getTodayActivities, updateActivity, openModal } = useActivitiesStore()

  const [dashboardData, setDashboardData] = React.useState<any>({
    kpiData: {
      openDeals: { value: 0, trend: 0, history: [] },
      expectedRevenue: { value: 0, trend: 0, history: [] },
      conversionRate: { value: 0, trend: 0, history: [] },
      pendingActivities: { value: 0, trend: 0, history: [] }
    },
    pipelineData: [],
    dealsAtRisk: [],
    latestProposals: [],
    topReps: [],
    revenueData: []
  });

  const todayActivities = getTodayActivities()

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/dashboard')
        if (response.ok) {
          const data = await response.json()
          setDashboardData(data)
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [period])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'call': return <Phone className="h-4 w-4 text-blue-500" />
      case 'email': return <Mail className="h-4 w-4 text-emerald-500" />
      case 'meeting': return <Calendar className="h-4 w-4 text-purple-500" />
      case 'task': return <CheckSquare className="h-4 w-4 text-amber-500" />
      case 'whatsapp': return <MessageCircle className="h-4 w-4 text-green-500" />
      case 'note': return <FileText className="h-4 w-4 text-slate-500" />
      default: return <CalendarCheck className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'sent': return <Badge variant="info">Enviada</Badge>
      case 'accepted': return <Badge variant="success">Aceita</Badge>
      case 'rejected': return <Badge variant="destructive">Recusada</Badge>
      case 'draft': return <Badge variant="secondary">Rascunho</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  const { kpiData, pipelineData, revenueData, dealsAtRisk, topReps, latestProposals } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold font-display tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => navigate('/proposals/new')}>Nova Proposta</Button>
        </div>
      </div>

      {/* Section 1: KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Open Deals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Deals Abertos</CardTitle>
            <Briefcase className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{kpiData.openDeals.value}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  {kpiData.openDeals.trend > 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-success mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-destructive mr-1" />
                  )}
                  <span className={kpiData.openDeals.trend > 0 ? "text-success font-medium" : "text-destructive font-medium"}>
                    {kpiData.openDeals.trend > 0 ? '+' : ''}{kpiData.openDeals.trend}%
                  </span>
                  <span className="ml-1">vs mês anterior</span>
                </p>
                <div className="h-8 mt-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={kpiData.openDeals.history.map((val, i) => ({ val, i }))}>
                      <Line type="monotone" dataKey="val" stroke="#2563eb" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* KPI 2: Expected Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Prevista</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-32" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{formatCurrency(kpiData.expectedRevenue.value)}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  {kpiData.expectedRevenue.trend > 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-success mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-destructive mr-1" />
                  )}
                  <span className={kpiData.expectedRevenue.trend > 0 ? "text-success font-medium" : "text-destructive font-medium"}>
                    {kpiData.expectedRevenue.trend > 0 ? '+' : ''}{kpiData.expectedRevenue.trend}%
                  </span>
                  <span className="ml-1">vs mês anterior</span>
                </p>
                <div className="h-8 mt-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={kpiData.expectedRevenue.history.map((val, i) => ({ val, i }))}>
                      <Line type="monotone" dataKey="val" stroke="#10b981" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* KPI 3: Conversion Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <Target className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{kpiData.conversionRate.value}%</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  {kpiData.conversionRate.trend > 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-success mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-destructive mr-1" />
                  )}
                  <span className={kpiData.conversionRate.trend > 0 ? "text-success font-medium" : "text-destructive font-medium"}>
                    {kpiData.conversionRate.trend > 0 ? '+' : ''}{kpiData.conversionRate.trend}%
                  </span>
                  <span className="ml-1">vs mês anterior</span>
                </p>
                <div className="h-8 mt-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={kpiData.conversionRate.history.map((val, i) => ({ val, i }))}>
                      <Line type="monotone" dataKey="val" stroke="#f59e0b" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* KPI 4: Pending Activities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atividades Pendentes</CardTitle>
            <CalendarCheck className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{kpiData.pendingActivities.value}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  {kpiData.pendingActivities.trend > 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-destructive mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-success mr-1" />
                  )}
                  <span className={kpiData.pendingActivities.trend > 0 ? "text-destructive font-medium" : "text-success font-medium"}>
                    {kpiData.pendingActivities.trend > 0 ? '+' : ''}{kpiData.pendingActivities.trend}%
                  </span>
                  <span className="ml-1">vs mês anterior</span>
                </p>
                <div className="h-8 mt-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={kpiData.pendingActivities.history.map((val, i) => ({ val, i }))}>
                      <Line type="monotone" dataKey="val" stroke="#a855f7" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Section 2: Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Deals por Estágio do Pipeline</CardTitle>
            <CardDescription>Quantidade e valor por etapa</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pipelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="stage" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis yAxisId="left" orientation="left" stroke="#2563eb" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#10b981" axisLine={false} tickLine={false} tickFormatter={(val) => `R$${val/1000}k`} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number, name: string) => {
                        if (name === 'value') return [formatCurrency(value), 'Valor (R$)']
                        return [value, 'Qtd Deals']
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar yAxisId="left" dataKey="deals" name="Qtd Deals" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar yAxisId="right" dataKey="value" name="Valor (R$)" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evolução de Receita</CardTitle>
            <CardDescription>Últimos 6 meses (Realizado vs Meta)</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `R$${val/1000}k`} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => [formatCurrency(value), '']}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Line type="monotone" dataKey="revenue" name="Realizado" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="target" name="Meta" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Section 3: Lists */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Deals em Risco</CardTitle>
            <CardDescription>Sem atividade há mais de 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {dealsAtRisk.map((deal) => (
                  <div key={deal.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-destructive/10 text-destructive font-semibold">
                          {deal.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">{deal.dealName}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {deal.company} • {deal.owner}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatCurrency(deal.value)}</p>
                      <Badge variant="destructive" className="mt-1 text-[10px] px-1.5 py-0">
                        {deal.daysIdle} dias parado
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Meu Dia</CardTitle>
              <CardDescription>Sua agenda para hoje</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => openModal()}>
              Nova Atividade
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-8 w-12" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {todayActivities.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarCheck className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>Nenhuma atividade para hoje.</p>
                  </div>
                ) : (
                  todayActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4">
                      <div className="w-12 text-sm font-medium text-muted-foreground text-right">
                        {format(new Date(activity.date), "HH:mm")}
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm font-medium truncate",
                          activity.status === 'done' && "line-through text-muted-foreground"
                        )}>
                          {activity.title}
                        </p>
                        {(activity.contactName || activity.companyName) && (
                          <p className="text-xs text-muted-foreground truncate">
                            {activity.contactName} {activity.contactName && activity.companyName && '•'} {activity.companyName}
                          </p>
                        )}
                      </div>
                      <div>
                        {activity.status === 'done' ? (
                          <Badge variant="secondary" className="text-[10px]">Concluído</Badge>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 text-xs"
                            onClick={() => updateActivity(activity.id, { status: 'done' })}
                          >
                            Concluir
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Section 4: Ranking & Proposals */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Top Vendedores</CardTitle>
            <CardDescription>Ranking do mês atual</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {topReps.map((rep, index) => (
                  <div key={rep.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="font-mono text-sm text-muted-foreground w-4">{index + 1}.</div>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={rep.avatar} />
                          <AvatarFallback>{rep.name.substring(0,2)}</AvatarFallback>
                        </Avatar>
                        <div className="text-sm font-medium">{rep.name}</div>
                      </div>
                      <div className="text-sm font-semibold">{formatCurrency(rep.revenue)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={rep.progress} className="h-1.5" />
                      <span className="text-[10px] text-muted-foreground w-12 text-right">{rep.deals} deals</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Últimas Propostas</CardTitle>
            <CardDescription>Status das propostas enviadas recentemente</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-md">Empresa</th>
                      <th className="px-4 py-3">Valor</th>
                      <th className="px-4 py-3">Data</th>
                      <th className="px-4 py-3 rounded-tr-md text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latestProposals.map((proposal) => (
                      <tr key={proposal.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3 font-medium">{proposal.company}</td>
                        <td className="px-4 py-3">{formatCurrency(proposal.value)}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Intl.DateTimeFormat('pt-BR').format(new Date(proposal.date))}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {getStatusBadge(proposal.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

