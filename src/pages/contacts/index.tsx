import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Search, Plus, Filter, MoreHorizontal, Grid, List, Download, Tag, UserPlus, Mail, Phone, Calendar, Upload } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/src/components/ui/dialog"
import { ContactFormDialog, Contact } from "./components/ContactFormDialog"

const MOCK_CONTACTS: Contact[] = [
  { id: '1', name: 'Ana Silva', company: 'TechCorp Solutions', role: 'Diretora de TI', email: 'ana@techcorp.com', phone: '(11) 98765-4321', lastContact: '2026-03-18', status: 'active', tags: ['VIP', 'Decisor'], owner: 'João Silva' },
  { id: '2', name: 'Carlos Mendes', company: 'Global Industries', role: 'Gerente de Compras', email: 'carlos@global.com', phone: '(11) 91234-5678', lastContact: '2026-03-15', status: 'lead', tags: ['Novo', 'B2B'], owner: 'Maria Souza' },
  { id: '3', name: 'Mariana Costa', company: 'Inova Sistemas', role: 'CEO', email: 'mariana@inova.com', phone: '(21) 99876-5432', lastContact: '2026-03-10', status: 'active', tags: ['Parceiro'], owner: 'João Silva' },
  { id: '4', name: 'Roberto Alves', company: 'Alpha Finance', role: 'CFO', email: 'roberto@alpha.com', phone: '(31) 98765-1234', lastContact: '2026-02-28', status: 'inactive', tags: ['Churn Risk'], owner: 'Pedro Santos' },
  { id: '5', name: 'Fernanda Lima', company: 'Beta Corp', role: 'Analista de Marketing', email: 'fernanda@beta.com', phone: '(41) 91234-8765', lastContact: '2026-03-19', status: 'lead', tags: ['Inbound'], owner: 'Maria Souza' },
]

export function ContactsList() {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = React.useState<'table' | 'grid'>('table')
  const [searchQuery, setSearchQuery] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const [selectedContacts, setSelectedContacts] = React.useState<Set<string>>(new Set())
  const [contacts, setContacts] = React.useState<Contact[]>(MOCK_CONTACTS)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingContact, setEditingContact] = React.useState<Contact | null>(null)

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const filteredContacts = React.useMemo(() => {
    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      contact.company.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      contact.email.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
  }, [debouncedSearch, contacts])

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedContacts)
    if (newSelection.has(id)) newSelection.delete(id)
    else newSelection.add(id)
    setSelectedContacts(newSelection)
  }

  const toggleAll = () => {
    if (selectedContacts.size === filteredContacts.length) setSelectedContacts(new Set())
    else setSelectedContacts(new Set(filteredContacts.map(c => c.id)))
  }

  const handleOpenNew = () => {
    setEditingContact(null)
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (contact: Contact) => {
    setEditingContact(contact)
    setIsDialogOpen(true)
  }

  const handleSaveContact = (contactData: Partial<Contact>) => {
    if (editingContact) {
      setContacts(contacts.map(c => c.id === editingContact.id ? { ...c, ...contactData } as Contact : c))
    } else {
      const newContact: Contact = {
        ...contactData as Contact,
        id: Math.random().toString(36).substr(2, 9),
        lastContact: new Date().toISOString(),
        tags: [],
        owner: 'Usuário Atual'
      }
      setContacts([newContact, ...contacts])
    }
  }

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id))
    const newSelection = new Set(selectedContacts)
    newSelection.delete(id)
    setSelectedContacts(newSelection)
  }

  return (
    <div className="flex flex-col h-full space-y-6">
      <ContactFormDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        contact={editingContact} 
        onSave={handleSaveContact} 
      />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contatos</h1>
          <p className="text-muted-foreground">Gerencie sua base de clientes e leads.</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline"><Upload className="h-4 w-4 mr-2" /> Importar CSV</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Importar Contatos</DialogTitle>
                <DialogDescription>Faça o upload de um arquivo CSV para importar múltiplos contatos.</DialogDescription>
              </DialogHeader>
              <div className="border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 mb-4" />
                <p>Arraste e solte seu arquivo aqui ou clique para selecionar</p>
                <p className="text-xs mt-2">Suporta apenas .csv (Max 5MB)</p>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancelar</Button>
                <Button disabled>Importar Dados</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={handleOpenNew}><Plus className="h-4 w-4 mr-2" /> Novo Contato</Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="flex items-center gap-4 w-full sm:w-auto flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar contatos..." 
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

      {selectedContacts.size > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <span className="text-sm font-medium text-primary">{selectedContacts.size} contatos selecionados</span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-8 bg-background"><Download className="h-3 w-3 mr-2" /> Exportar</Button>
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
                      checked={selectedContacts.size === filteredContacts.length && filteredContacts.length > 0}
                      onChange={toggleAll}
                    />
                  </th>
                  <th className="px-6 py-3 font-medium cursor-pointer hover:bg-muted/80">Nome</th>
                  <th className="px-6 py-3 font-medium cursor-pointer hover:bg-muted/80">Empresa / Cargo</th>
                  <th className="px-6 py-3 font-medium">Contato</th>
                  <th className="px-6 py-3 font-medium cursor-pointer hover:bg-muted/80">Última Atividade</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className={`bg-card hover:bg-muted/50 transition-colors ${selectedContacts.has(contact.id) ? 'bg-primary/5' : ''}`}>
                    <td className="px-4 py-4">
                      <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" 
                        checked={selectedContacts.has(contact.id)}
                        onChange={() => toggleSelection(contact.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/contacts/${contact.id}`)}>
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback>{contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground hover:underline">{contact.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium">{contact.company}</span>
                        <span className="text-muted-foreground text-xs">{contact.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1 text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground"><Mail className="h-3 w-3" /> {contact.email}</span>
                        <span className="flex items-center gap-1 text-muted-foreground"><Phone className="h-3 w-3" /> {contact.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-muted-foreground text-xs">
                        <Calendar className="h-3 w-3" /> {new Date(contact.lastContact).toLocaleDateString('pt-BR')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {contact.status === 'active' && <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">Ativo</Badge>}
                      {contact.status === 'lead' && <Badge variant="secondary" className="bg-blue-100 text-blue-700">Lead</Badge>}
                      {contact.status === 'inactive' && <Badge variant="secondary" className="bg-slate-100 text-slate-700">Inativo</Badge>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/contacts/${contact.id}`)}>Ver Perfil</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenEdit(contact)}>Editar</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteContact(contact.id)}>Excluir</DropdownMenuItem>
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
          {filteredContacts.map(contact => (
            <div key={contact.id} className="bg-card border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow relative group">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate(`/contacts/${contact.id}`)}>Ver Perfil</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleOpenEdit(contact)}>Editar</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteContact(contact.id)}>Excluir</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-col items-center text-center space-y-3 cursor-pointer" onClick={() => navigate(`/contacts/${contact.id}`)}>
                <Avatar className="h-16 w-16">
                  <AvatarImage src={contact.avatar} />
                  <AvatarFallback className="text-lg">{contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg hover:underline">{contact.name}</h3>
                  <p className="text-sm text-muted-foreground">{contact.role} em <span className="font-medium text-foreground">{contact.company}</span></p>
                </div>
                <div className="flex flex-wrap justify-center gap-1 mt-2">
                  {contact.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">{tag}</Badge>
                  ))}
                </div>
                <div className="w-full pt-4 mt-2 border-t flex justify-around text-muted-foreground">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:text-primary hover:bg-primary/10"><Mail className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:text-primary hover:bg-primary/10"><Phone className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:text-primary hover:bg-primary/10"><Calendar className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
