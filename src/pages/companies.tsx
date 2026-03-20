import * as React from "react"
import { Search, Plus, Filter, MoreHorizontal, Globe, Phone, Users } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
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

interface Company {
  id: string
  name: string
  industry: string
  website: string
  phone: string
  employees: string
  status: 'active' | 'inactive'
  logo?: string
}

const MOCK_COMPANIES: Company[] = [
  { id: '1', name: 'TechCorp Solutions', industry: 'Tecnologia', website: 'techcorp.com', phone: '(11) 3000-1234', employees: '500-1000', status: 'active', logo: 'https://logo.clearbit.com/techcorp.com' },
  { id: '2', name: 'Global Industries', industry: 'Manufatura', website: 'globalind.com', phone: '(11) 3100-5678', employees: '1000-5000', status: 'active', logo: 'https://logo.clearbit.com/globalind.com' },
  { id: '3', name: 'Inova Sistemas', industry: 'Software', website: 'inova.com.br', phone: '(21) 3200-9012', employees: '50-200', status: 'inactive', logo: 'https://logo.clearbit.com/inova.com.br' },
  { id: '4', name: 'Alpha Finance', industry: 'Finanças', website: 'alphafin.com', phone: '(31) 3300-3456', employees: '200-500', status: 'active', logo: 'https://logo.clearbit.com/alphafin.com' },
  { id: '5', name: 'Beta Corp', industry: 'Varejo', website: 'betacorp.com', phone: '(41) 3400-7890', employees: '10000+', status: 'active', logo: 'https://logo.clearbit.com/betacorp.com' },
]

export function Companies() {
  const [companies, setCompanies] = React.useState<Company[]>(MOCK_COMPANIES)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isNewCompanyOpen, setIsNewCompanyOpen] = React.useState(false)

  const filteredCompanies = React.useMemo(() => {
    return companies.filter(company => 
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [companies, searchQuery])

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
          <p className="text-muted-foreground">Gerencie as empresas e contas do seu CRM.</p>
        </div>
        <Dialog open={isNewCompanyOpen} onOpenChange={setIsNewCompanyOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Nova Empresa</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Empresa</DialogTitle>
              <DialogDescription>
                Preencha os dados da nova empresa. Clique em salvar quando terminar.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="name">Nome da Empresa</Label>
                  <Input id="name" placeholder="Ex: Acme Corp" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Setor</Label>
                  <Input id="industry" placeholder="Ex: Tecnologia" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" placeholder="www.empresa.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone Principal</Label>
                  <Input id="phone" placeholder="(00) 0000-0000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employees">Nº de Funcionários</Label>
                  <Input id="employees" placeholder="Ex: 50-200" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={() => setIsNewCompanyOpen(false)}>Salvar Empresa</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nome ou setor..." 
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
                <th className="px-6 py-3 font-medium">Empresa</th>
                <th className="px-6 py-3 font-medium">Setor</th>
                <th className="px-6 py-3 font-medium">Contato</th>
                <th className="px-6 py-3 font-medium">Tamanho</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    Nenhuma empresa encontrada.
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((company) => (
                  <tr key={company.id} className="bg-card hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 rounded-md">
                          <AvatarImage src={company.logo} />
                          <AvatarFallback className="bg-primary/10 text-primary rounded-md">
                            {company.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-foreground">{company.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-muted-foreground">{company.industry}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <Globe className="h-3 w-3" />
                          {company.website}
                        </span>
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {company.phone}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {company.employees}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={company.status === 'active' ? 'default' : 'secondary'} className={company.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : ''}>
                        {company.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
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
