import * as React from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area, ComposedChart } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Badge } from "@/src/components/ui/badge"
import { Download, Filter, FileText, BarChart3, TrendingUp, Activity, FileCheck, PieChart as PieChartIcon, Calendar as CalendarIcon, Printer, Mail } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { cn } from "@/src/lib/utils"
import * as XLSX from 'xlsx'

// --- Mock Data ---
const FUNNEL_DATA = [
  { stage: 'Prospecção', count: 1200, value: 1200000 },
  { stage: 'Qualificação', count: 850, value: 850000 },
  { stage: 'Proposta', count: 450, value: 450000 },
  { stage: 'Negociação', count: 250, value: 250000 },
  { stage: 'Fechamento', count: 150, value: 150000 },
]

const REP_PERFORMANCE = [
  { name: 'Ana Silva', open: 45, won: 12, lost: 3, winRate: 80, avgTicket: 12500, revenue: 150000, target: 120000 },
  { name: 'Carlos Mendes', open: 32, won: 8, lost: 5, winRate: 61, avgTicket: 11875, revenue: 95000, target: 100000 },
  { name: 'Mariana Costa', open: 58, won: 15, lost: 2, winRate: 88, avgTicket: 14000, revenue: 210000, target: 180000 },
  { name: 'Roberto Alves', open: 21, won: 5, lost: 8, winRate: 38, avgTicket: 9000, revenue: 45000, target: 80000 },
]

const FORECAST_DATA = [
  { month: 'Jan', pessimist: 30000, realist: 45000, optimist: 60000, actual: 48000 },
  { month: 'Fev', pessimist: 35000, realist: 50000, optimist: 65000, actual: 52000 },
  { month: 'Mar', pessimist: 40000, realist: 55000, optimist: 70000, actual: 58000 },
  { month: 'Abr', pessimist: 45000, realist: 60000, optimist: 80000, actual: null },
  { month: 'Mai', pessimist: 50000, realist: 65000, optimist: 85000, actual: null },
  { month: 'Jun', pessimist: 55000, realist: 70000, optimist: 90000, actual: null },
]

const ACTIVITY_DATA = [
  { name: 'Seg', call: 40, email: 85, meeting: 12, task: 25 },
  { name: 'Ter', call: 45, email: 90, meeting: 15, task: 30 },
  { name: 'Qua', call: 55, email: 110, meeting: 18, task: 35 },
  { name: 'Qui', call: 50, email: 95, meeting: 14, task: 28 },
  { name: 'Sex', call: 35, email: 70, meeting: 8, task: 20 },
]

const LEAD_SOURCE_DATA = [
  { name: 'Busca Orgânica', value: 400, color: '#3b82f6' },
  { name: 'Indicação', value: 300, color: '#10b981' },
  { name: 'Eventos', value: 200, color: '#f59e0b' },
  { name: 'Outbound', value: 150, color: '#8b5cf6' },
  { name: 'Redes Sociais', value: 100, color: '#ec4899' },
]

const PROPOSALS_DATA = [
  { name: 'Enviadas', value: 120, color: '#3b82f6' },
  { name: 'Aceitas', value: 45, color: '#10b981' },
  { name: 'Recusadas', value: 30, color: '#ef4444' },
  { name: 'Expiradas', value: 45, color: '#f59e0b' },
]

const TOP_PRODUCTS = [
  { name: 'Licenciamento Enterprise', count: 45, revenue: 450000 },
  { name: 'Consultoria de Implantação', count: 38, revenue: 190000 },
  { name: 'Treinamento de Equipe', count: 25, revenue: 50000 },
  { name: 'Suporte Premium 24/7', count: 20, revenue: 120000 },
]

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value)
}

export function Reports() {
  const [activeReport, setActiveReport] = React.useState('funnel')
  const [period, setPeriod] = React.useState('this_year')
  const [salesRep, setSalesRep] = React.useState('all')

  const handleExportExcel = (data: any[], filename: string) => {
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Relatório")
    XLSX.writeFile(wb, `${filename}.xlsx`)
  }

  const handlePrint = () => {
    window.print()
  }

  const renderReportContent = () => {
    switch (activeReport) {
      case 'funnel':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Funil de Conversão</h2>
                <p className="text-muted-foreground">Análise de conversão entre estágios do pipeline.</p>
              </div>
              <Button variant="outline" onClick={() => handleExportExcel(FUNNEL_DATA, 'funil_conversao')}><Download className="h-4 w-4 mr-2" /> Exportar Excel</Button>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={FUNNEL_DATA} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                      <YAxis dataKey="stage" type="category" axisLine={false} tickLine={false} tick={{ fill: '#374151', fontSize: 12, fontWeight: 500 }} />
                      <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="count" name="Quantidade de Deals" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={40}>
                        {FUNNEL_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(221, 83%, ${50 + index * 10}%)`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detalhamento do Funil</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                    <tr>
                      <th className="px-4 py-3 font-medium">Estágio</th>
                      <th className="px-4 py-3 font-medium text-center">Quantidade</th>
                      <th className="px-4 py-3 font-medium text-right">Valor Potencial</th>
                      <th className="px-4 py-3 font-medium text-center">Conversão (do topo)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {FUNNEL_DATA.map((stage, i) => {
                      const conversion = Math.round((stage.count / FUNNEL_DATA[0].count) * 100)
                      return (
                        <tr key={i} className="hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-3 font-medium text-foreground">{stage.stage}</td>
                          <td className="px-4 py-3 text-center">{stage.count}</td>
                          <td className="px-4 py-3 text-right font-medium">{formatCurrency(stage.value)}</td>
                          <td className="px-4 py-3 text-center">
                            <Badge variant="secondary" className={conversion >= 50 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}>
                              {conversion}%
                            </Badge>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )
      
      case 'performance':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Performance de Vendedores</h2>
                <p className="text-muted-foreground">Ranking e métricas individuais da equipe comercial.</p>
              </div>
              <Button variant="outline" onClick={() => handleExportExcel(REP_PERFORMANCE, 'performance_vendedores')}><Download className="h-4 w-4 mr-2" /> Exportar Excel</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-emerald-50 border-emerald-100">
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-emerald-800 uppercase tracking-wider">Melhor do Mês</p>
                  <h3 className="text-2xl font-bold text-emerald-900 mt-2">Mariana Costa</h3>
                  <p className="text-sm text-emerald-700 mt-1">{formatCurrency(210000)} em receita</p>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-100">
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-blue-800 uppercase tracking-wider">Maior Ticket Médio</p>
                  <h3 className="text-2xl font-bold text-blue-900 mt-2">Mariana Costa</h3>
                  <p className="text-sm text-blue-700 mt-1">{formatCurrency(14000)} / deal</p>
                </CardContent>
              </Card>
              <Card className="bg-purple-50 border-purple-100">
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-purple-800 uppercase tracking-wider">Maior Win Rate</p>
                  <h3 className="text-2xl font-bold text-purple-900 mt-2">Mariana Costa</h3>
                  <p className="text-sm text-purple-700 mt-1">88% de conversão</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={REP_PERFORMANCE} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                      <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(val) => `R$${val/1000}k`} />
                      <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(val) => `${val}%`} />
                      <Tooltip formatter={(value: number, name: string) => name === 'Win Rate' ? `${value}%` : formatCurrency(value)} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="revenue" name="Receita Gerada" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="left" dataKey="target" name="Meta" fill="#9ca3af" radius={[4, 4, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="winRate" name="Win Rate" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                      <tr>
                        <th className="px-6 py-4 font-medium">Vendedor</th>
                        <th className="px-6 py-4 font-medium text-center">Abertos</th>
                        <th className="px-6 py-4 font-medium text-center">Ganhos</th>
                        <th className="px-6 py-4 font-medium text-center">Perdidos</th>
                        <th className="px-6 py-4 font-medium text-center">Win Rate</th>
                        <th className="px-6 py-4 font-medium text-right">Ticket Médio</th>
                        <th className="px-6 py-4 font-medium text-right">Receita</th>
                        <th className="px-6 py-4 font-medium text-center">% Meta</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {REP_PERFORMANCE.map((rep, i) => {
                        const metaPercent = Math.round((rep.revenue / rep.target) * 100)
                        return (
                          <tr key={i} className="hover:bg-muted/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-foreground">{rep.name}</td>
                            <td className="px-6 py-4 text-center">{rep.open}</td>
                            <td className="px-6 py-4 text-center text-emerald-600 font-medium">{rep.won}</td>
                            <td className="px-6 py-4 text-center text-red-600 font-medium">{rep.lost}</td>
                            <td className="px-6 py-4 text-center">
                              <Badge variant="secondary" className={rep.winRate >= 50 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                                {rep.winRate}%
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-right">{formatCurrency(rep.avgTicket)}</td>
                            <td className="px-6 py-4 text-right font-bold text-primary">{formatCurrency(rep.revenue)}</td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center gap-2 justify-center">
                                <span className={metaPercent >= 100 ? 'text-emerald-600 font-bold' : 'text-amber-600'}>{metaPercent}%</span>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'forecast':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Forecast de Receita</h2>
                <p className="text-muted-foreground">Previsão de faturamento baseada no pipeline atual.</p>
              </div>
              <Button variant="outline" onClick={() => handleExportExcel(FORECAST_DATA, 'forecast_receita')}><Download className="h-4 w-4 mr-2" /> Exportar Excel</Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Projeção de Cenários</CardTitle>
                <CardDescription>Comparativo entre cenários pessimista, realista e otimista.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={FORECAST_DATA} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(val) => `R$${val/1000}k`} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                      <Area type="monotone" dataKey="optimist" name="Cenário Otimista" fill="#dbeafe" stroke="none" />
                      <Area type="monotone" dataKey="realist" name="Cenário Realista" fill="#bfdbfe" stroke="none" />
                      <Area type="monotone" dataKey="pessimist" name="Cenário Pessimista" fill="#93c5fd" stroke="none" />
                      <Line type="monotone" dataKey="actual" name="Receita Realizada" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'activities':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Análise de Atividades</h2>
                <p className="text-muted-foreground">Volume e tipos de interações com clientes.</p>
              </div>
              <Button variant="outline" onClick={() => handleExportExcel(ACTIVITY_DATA, 'analise_atividades')}><Download className="h-4 w-4 mr-2" /> Exportar Excel</Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Volume por Tipo de Atividade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ACTIVITY_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                      <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend />
                      <Bar dataKey="call" name="Ligações" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                      <Bar dataKey="email" name="E-mails" stackId="a" fill="#10b981" />
                      <Bar dataKey="meeting" name="Reuniões" stackId="a" fill="#f59e0b" />
                      <Bar dataKey="task" name="Tarefas" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'proposals':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Análise de Propostas</h2>
                <p className="text-muted-foreground">Conversão, ticket médio e produtos mais vendidos.</p>
              </div>
              <Button variant="outline" onClick={() => handleExportExcel(PROPOSALS_DATA, 'analise_propostas')}><Download className="h-4 w-4 mr-2" /> Exportar Excel</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-blue-50 border-blue-100">
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-blue-800 uppercase tracking-wider">Taxa de Aceite</p>
                  <h3 className="text-2xl font-bold text-blue-900 mt-2">37.5%</h3>
                  <p className="text-sm text-blue-700 mt-1">45 de 120 enviadas</p>
                </CardContent>
              </Card>
              <Card className="bg-emerald-50 border-emerald-100">
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-emerald-800 uppercase tracking-wider">Valor Médio Aceito</p>
                  <h3 className="text-2xl font-bold text-emerald-900 mt-2">{formatCurrency(18500)}</h3>
                  <p className="text-sm text-emerald-700 mt-1">+12% vs mês anterior</p>
                </CardContent>
              </Card>
              <Card className="bg-amber-50 border-amber-100">
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-amber-800 uppercase tracking-wider">Tempo de Decisão</p>
                  <h3 className="text-2xl font-bold text-amber-900 mt-2">4.2 dias</h3>
                  <p className="text-sm text-amber-700 mt-1">Média entre envio e aceite</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Status das Propostas</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center items-center">
                  <div className="h-[300px] w-full max-w-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={PROPOSALS_DATA}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {PROPOSALS_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Produtos/Serviços Mais Propostos</CardTitle>
                </CardHeader>
                <CardContent>
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                      <tr>
                        <th className="px-4 py-3 font-medium">Produto/Serviço</th>
                        <th className="px-4 py-3 font-medium text-center">Qtd</th>
                        <th className="px-4 py-3 font-medium text-right">Receita Potencial</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {TOP_PRODUCTS.map((product, i) => (
                        <tr key={i} className="hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-3 font-medium">{product.name}</td>
                          <td className="px-4 py-3 text-center">{product.count}</td>
                          <td className="px-4 py-3 text-right font-medium text-primary">{formatCurrency(product.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 'sources':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Origem dos Leads</h2>
                <p className="text-muted-foreground">Canais de aquisição e ROI estimado.</p>
              </div>
              <Button variant="outline" onClick={() => handleExportExcel(LEAD_SOURCE_DATA, 'origem_leads')}><Download className="h-4 w-4 mr-2" /> Exportar Excel</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Canal</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center items-center">
                  <div className="h-[350px] w-full max-w-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={LEAD_SOURCE_DATA}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {LEAD_SOURCE_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Métricas por Canal</CardTitle>
                </CardHeader>
                <CardContent>
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                      <tr>
                        <th className="px-4 py-3 font-medium">Canal</th>
                        <th className="px-4 py-3 font-medium text-center">Leads</th>
                        <th className="px-4 py-3 font-medium text-center">Conversão</th>
                        <th className="px-4 py-3 font-medium text-right">ROI Est.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {LEAD_SOURCE_DATA.map((source, i) => {
                        const conversion = Math.floor(Math.random() * 20) + 5 // Mock conversion
                        const roi = source.value * conversion * 100 // Mock ROI
                        return (
                          <tr key={i} className="hover:bg-muted/50 transition-colors">
                            <td className="px-4 py-3 font-medium flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }}></div>
                              {source.name}
                            </td>
                            <td className="px-4 py-3 text-center">{source.value}</td>
                            <td className="px-4 py-3 text-center">{conversion}%</td>
                            <td className="px-4 py-3 text-right font-medium text-emerald-600">{formatCurrency(roi)}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      
      default:
        return <div>Selecione um relatório</div>
    }
  }

  return (
    <div className="flex flex-col h-full space-y-6 max-w-[1600px] mx-auto w-full pb-10">
      {/* Global Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-4 rounded-lg border shadow-sm print:hidden">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics & Relatórios</h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-md border">
            <CalendarIcon className="h-4 w-4 text-muted-foreground ml-2" />
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px] border-none bg-transparent shadow-none focus:ring-0">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this_month">Este Mês</SelectItem>
                <SelectItem value="last_month">Mês Passado</SelectItem>
                <SelectItem value="this_quarter">Este Trimestre</SelectItem>
                <SelectItem value="this_year">Este Ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-md border">
            <Select value={salesRep} onValueChange={setSalesRep}>
              <SelectTrigger className="w-[180px] border-none bg-transparent shadow-none focus:ring-0">
                <SelectValue placeholder="Vendedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Vendedores</SelectItem>
                <SelectItem value="ana">Ana Silva</SelectItem>
                <SelectItem value="carlos">Carlos Mendes</SelectItem>
                <SelectItem value="mariana">Mariana Costa</SelectItem>
                <SelectItem value="roberto">Roberto Alves</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="gap-2" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Imprimir / PDF</span>
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => alert('Agendamento configurado para enviar toda segunda-feira às 08:00.')}>
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Agendar</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-1 print:hidden">
          <div className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3 px-3">Vendas</div>
          <Button variant={activeReport === 'funnel' ? 'secondary' : 'ghost'} className="w-full justify-start font-medium" onClick={() => setActiveReport('funnel')}>
            <BarChart3 className="mr-2 h-4 w-4" /> Funil de Conversão
          </Button>
          <Button variant={activeReport === 'performance' ? 'secondary' : 'ghost'} className="w-full justify-start font-medium" onClick={() => setActiveReport('performance')}>
            <TrendingUp className="mr-2 h-4 w-4" /> Performance de Vendedores
          </Button>
          <Button variant={activeReport === 'forecast' ? 'secondary' : 'ghost'} className="w-full justify-start font-medium" onClick={() => setActiveReport('forecast')}>
            <Activity className="mr-2 h-4 w-4" /> Forecast de Receita
          </Button>
          
          <div className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3 px-3 mt-6">Marketing & CRM</div>
          <Button variant={activeReport === 'proposals' ? 'secondary' : 'ghost'} className="w-full justify-start font-medium" onClick={() => setActiveReport('proposals')}>
            <FileText className="mr-2 h-4 w-4" /> Análise de Propostas
          </Button>
          <Button variant={activeReport === 'activities' ? 'secondary' : 'ghost'} className="w-full justify-start font-medium" onClick={() => setActiveReport('activities')}>
            <FileCheck className="mr-2 h-4 w-4" /> Análise de Atividades
          </Button>
          <Button variant={activeReport === 'sources' ? 'secondary' : 'ghost'} className="w-full justify-start font-medium" onClick={() => setActiveReport('sources')}>
            <PieChartIcon className="mr-2 h-4 w-4" /> Origem dos Leads
          </Button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-4 print:col-span-5">
          {renderReportContent()}
        </div>
      </div>
    </div>
  )
}

