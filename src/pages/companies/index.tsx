import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Search, Plus, Filter, MoreHorizontal, Grid, List, Download, Tag, UserPlus, Building2, MapPin, Globe, Phone, Mail, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu"
import { CompanyFormDialog, Company } from "./components/CompanyFormDialog"

const MOCK_COMPANIES: Company[] = [
  { id: '1', name: 'TechCorp Solutions', industry: 'Tecnologia da Informação', size: '500-1000', revenue: 'R$ 50M - 100M', city: 'São Paulo', state: 'SP', website: 'techcorp.com', contactsCount: 5, dealsCount: 2, status: 'active', tags: ['Enterprise', 'Key Account'], owner: 'João Silva' },
  { id: '2', name: 'Global Industries', industry: 'Manufatura', size: '1000-5000', revenue: 'R$ 100M+', city: 'Campinas', state: 'SP', website: 'global.com', contactsCount: 12, dealsCount: 1, status: 'prospect', tags: ['B2B', 'Indústria'], owner: 'Maria Souza' },
  { id: '3', name: 'Inova Sistemas', industry: 'Software', size: '50-200', revenue: 'R$ 10M - 50M', city: 'Belo Horizonte', state: 'MG', website: 'inova.com', contactsCount: 3, dealsCount: 0, status: 'active', tags: ['Parceiro', 'SaaS'], owner: 'João Silva' },
  { id: '4', name: 'Alpha Finance', industry: 'Serviços Financeiros', size: '200-500', revenue: 'R$ 50M - 100M', city: 'Rio de Janeiro', state: 'RJ', website: 'alpha.com', contactsCount: 8, dealsCount: 3, status: 'inactive', tags: ['Churn Risk'], owner: 'Pedro Santos' },
  { id: '5', name: 'Beta Corp', industry: 'Varejo', size: '1000-5000', revenue: 'R$ 100M+', city: 'Curitiba', state: 'PR', website: 'beta.com', contactsCount: 15, dealsCount: 5, status: 'prospect', tags: ['Inbound', 'Expansão'], owner: 'Maria Souza' },
]

export function CompaniesList() {
  const navigate = useNavigate()
  const [companies, setCompanies] = React.useState<Company[]>([])
  const [viewMode, setViewMode] = React.useState<'table' | 'grid'>('table')
  const [searchQuery, setSearchQuery] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const [selectedCompanies, setSelectedCompanies] = React.useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = React.useState(true)
  
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingCompany, setEditingCompany] = React.useState<Company | null>(null)

  React.useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/companies')
      if (res.ok) {
        const data = await res.json()
        setCompanies(data.map((c: any) => ({
          ...c,
          contactsCount: c._count?.contacts || 0,
          dealsCount: c._count?.deals || 0
        })))
      }
    } catch (error) {
      console.error('Failed to fetch companies:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const filteredCompanies = React.useMemo(() => {
    return companies.filter(company => 
      company.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      company.industry?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      company.city?.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
  }, [companies, debouncedSearch])

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedCompanies)
    if (newSelection.has(id)) newSelection.delete(id)
    else newSelection.add(id)
    setSelectedCompanies(newSelection)
  }

  const toggleAll = () => {
    if (selectedCompanies.size === filteredCompanies.length) setSelectedCompanies(new Set())
    else setSelectedCompanies(new Set(filteredCompanies.map(c => c.id)))
  }

  const handleOpenNew = () => {
    setEditingCompany(null)
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (company: Company) => {
    setEditingCompany(company)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta empresa?')) return
    
    try {
      const res = await fetch(`/api/companies/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setCompanies(prev => prev.filter(c => c.id !== id))
      } else {
        alert('Erro ao excluir empresa')
      }
    } catch (error) {
      console.error('Failed to delete company:', error)
      alert('Erro ao excluir empresa')
    }
  }

  const handleSave = async (companyData: Partial<Company>) => {
    try {
      if (editingCompany) {
        const res = await fetch(`/api/companies/${editingCompany.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(companyData)
        })
        if (res.ok) {
          const updated = await res.json()
          setCompanies(prev => prev.map(c => c.id === editingCompany.id ? { ...c, ...updated, contactsCount: c.contactsCount, dealsCount: c.dealsCount } : c))
        } else {
          alert('Erro ao atualizar empresa')
        }
      } else {
        const res = await fetch('/api/companies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(companyData)
        })
        if (res.ok) {
          const created = await res.json()
          setCompanies([{ ...created, contactsCount: 0, dealsCount: 0 }, ...companies])
        } else {
          alert('Erro ao criar empresa')
        }
      }
    } catch (error) {
      console.error('Failed to save company:', error)
      alert('Erro ao salvar empresa')
    }
  }

  return (
    <div className="flex flex-col h-full space-y-6">
      <CompanyFormDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        company={editingCompany} 
        onSave={handleSave} 
      />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
          <p className="text-muted-foreground">Gerencie as contas e organizações dos seus clientes.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Exportar</Button>
          <Button onClick={handleOpenNew}><Plus className="h-4 w-4 mr-2" /> Nova Empresa</Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="flex items-center gap-4 w-full sm:w-auto flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar empresas, segmento ou cidade..." 
              className="pl-9 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filtros Avançados</span>
          </Button>
        </div>
        
        <div className="flex items-center gap-2 bg-muted p-1 rounded-md">
          <Button variant={viewMode === 'table' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('table')} className="h-8 px-2">
            <List className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('grid')} className="h-8 px-2">
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {selectedCompanies.size > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <span className="text-sm font-medium text-primary">{selectedCompanies.size} empresas selecionadas</span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-8 bg-background"><Tag className="h-3 w-3 mr-2" /> Adicionar Tag</Button>
            <Button size="sm" variant="outline" className="h-8 bg-background"><UserPlus className="h-3 w-3 mr-2" /> Atribuir</Button>
          </div>
        </div>
      )}

      {viewMode === 'table' ? (
        <div className="bg-card border rounded-lg shadow-sm overflow-hidden flex-1">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" 
                      checked={selectedCompanies.size === filteredCompanies.length && filteredCompanies.length > 0}
                      onChange={toggleAll}
                    />
                  </th>
                  <th className="px-6 py-3 font-medium cursor-pointer hover:bg-muted/80">Empresa</th>
                  <th className="px-6 py-3 font-medium cursor-pointer hover:bg-muted/80">Segmento</th>
                  <th className="px-6 py-3 font-medium">Localização</th>
                  <th className="px-6 py-3 font-medium cursor-pointer hover:bg-muted/80 text-center">Contatos</th>
                  <th className="px-6 py-3 font-medium cursor-pointer hover:bg-muted/80 text-center">Deals</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredCompanies.map((company) => (
                  <tr key={company.id} className={`bg-card hover:bg-muted/50 transition-colors ${selectedCompanies.has(company.id) ? 'bg-primary/5' : ''}`}>
                    <td className="px-4 py-4">
                      <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" 
                        checked={selectedCompanies.has(company.id)}
                        onChange={() => toggleSelection(company.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/companies/${company.id}`)}>
                        <div className="h-9 w-9 rounded bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                          {company.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground hover:underline">{company.name}</span>
                          <a href={`https://${company.website}`} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <Globe className="h-3 w-3" /> {company.website}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-muted-foreground">{company.industry}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-muted-foreground text-xs">
                        <MapPin className="h-3 w-3" /> {company.city}, {company.state}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="outline" className="font-normal">{company.contactsCount}</Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="outline" className="font-normal">{company.dealsCount}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      {company.status === 'active' && <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">Ativa</Badge>}
                      {company.status === 'prospect' && <Badge variant="secondary" className="bg-blue-100 text-blue-700">Prospect</Badge>}
                      {company.status === 'inactive' && <Badge variant="secondary" className="bg-slate-100 text-slate-700">Inativa</Badge>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/companies/${company.id}`)}>Ver Perfil</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenEdit(company)}>Editar</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(company.id)}>Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCompanies.map(company => (
            <div key={company.id} className="bg-card border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow relative group">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate(`/companies/${company.id}`)}>Ver Perfil</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleOpenEdit(company)}>Editar</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(company.id)}>Excluir</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-col items-center text-center space-y-3 cursor-pointer" onClick={() => navigate(`/companies/${company.id}`)}>
                <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
                  {company.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-lg hover:underline">{company.name}</h3>
                  <p className="text-sm text-muted-foreground">{company.industry}</p>
                </div>
                <div className="flex flex-wrap justify-center gap-1 mt-2">
                  {company.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">{tag}</Badge>
                  ))}
                </div>
                <div className="w-full pt-4 mt-2 border-t flex justify-around text-muted-foreground text-xs">
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-foreground">{company.contactsCount}</span>
                    <span>Contatos</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-foreground">{company.dealsCount}</span>
                    <span>Deals</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
