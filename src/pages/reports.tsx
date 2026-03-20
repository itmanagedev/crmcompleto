import * as React from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Badge } from "@/src/components/ui/badge"
import { Download, Filter } from "lucide-react"
import { Button } from "@/src/components/ui/button"

const REVENUE_DATA = [
  { month: 'Jan', revenue: 45000, target: 50000 },
  { month: 'Fev', revenue: 52000, target: 50000 },
  { month: 'Mar', revenue: 38000, target: 50000 },
  { month: 'Abr', revenue: 65000, target: 50000 },
  { month: 'Mai', revenue: 48000, target: 50000 },
  { month: 'Jun', revenue: 72000, target: 50000 },
]

const STAGE_CONVERSION_DATA = [
  { stage: 'Prospecção', count: 120 },
  { stage: 'Qualificação', count: 85 },
  { stage: 'Proposta', count: 45 },
  { stage: 'Negociação', count: 25 },
  { stage: 'Fechamento', count: 15 },
]

const WIN_LOSS_DATA = [
  { name: 'Ganho', value: 65, color: '#10b981' },
  { name: 'Perdido', value: 35, color: '#ef4444' },
]

const REP_PERFORMANCE = [
  { name: 'Ana Silva', won: 12, lost: 3, revenue: 150000 },
  { name: 'Carlos Mendes', won: 8, lost: 5, revenue: 95000 },
  { name: 'Mariana Costa', won: 15, lost: 2, revenue: 210000 },
  { name: 'Roberto Alves', won: 5, lost: 8, revenue: 45000 },
]

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

export function Reports() {
  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">Analise o desempenho de vendas e a saúde do pipeline.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="this_year">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this_month">Este Mês</SelectItem>
              <SelectItem value="last_month">Mês Passado</SelectItem>
              <SelectItem value="this_quarter">Este Trimestre</SelectItem>
              <SelectItem value="this_year">Este Ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Exportar PDF</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Receita vs Meta</CardTitle>
            <CardDescription>Evolução da receita gerada em comparação com a meta mensal.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={REVENUE_DATA} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    tickFormatter={(val) => `R$${val/1000}k`}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" name="Receita Realizada" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="target" name="Meta" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Funnel Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Funil de Vendas</CardTitle>
            <CardDescription>Quantidade de deals por estágio do pipeline.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={STAGE_CONVERSION_DATA} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis 
                    dataKey="stage" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#374151', fontSize: 12, fontWeight: 500 }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f3f4f6' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" name="Quantidade" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Win/Loss Ratio */}
        <Card>
          <CardHeader>
            <CardTitle>Taxa de Conversão (Ganho vs Perdido)</CardTitle>
            <CardDescription>Proporção de negócios fechados com sucesso.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <div className="h-[300px] w-full max-w-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={WIN_LOSS_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {WIN_LOSS_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `${value}%`}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Rep Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Desempenho por Vendedor</CardTitle>
            <CardDescription>Receita gerada e deals ganhos por representante.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-3 font-medium">Vendedor</th>
                    <th className="px-4 py-3 font-medium text-center">Ganhos</th>
                    <th className="px-4 py-3 font-medium text-center">Perdidos</th>
                    <th className="px-4 py-3 font-medium text-center">Win Rate</th>
                    <th className="px-4 py-3 font-medium text-right">Receita</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {REP_PERFORMANCE.map((rep, i) => {
                    const total = rep.won + rep.lost
                    const winRate = total > 0 ? Math.round((rep.won / total) * 100) : 0
                    return (
                      <tr key={i} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-foreground">{rep.name}</td>
                        <td className="px-4 py-3 text-center text-emerald-600 font-medium">{rep.won}</td>
                        <td className="px-4 py-3 text-center text-red-600 font-medium">{rep.lost}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant="secondary" className={winRate >= 50 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                            {winRate}%
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-primary">{formatCurrency(rep.revenue)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
