import * as React from "react"
import { Search, Plus, Filter, MoreHorizontal, Mail, Phone, Building2 } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"

interface Contact {
  id: string
  name: string
  email: string
  phone: string
  company: string
  role: string
  status: 'active' | 'inactive'
  avatar?: string
}

const MOCK_CONTACTS: Contact[] = [
  { id: '1', name: 'Ana Silva', email: 'ana.silva@techcorp.com', phone: '(11) 98765-4321', company: 'TechCorp Solutions', role: 'CTO', status: 'active', avatar: 'https://i.pravatar.cc/150?u=ana' },
  { id: '2', name: 'Carlos Mendes', email: 'carlos@globalind.com', phone: '(11) 91234-5678', company: 'Global Industries', role: 'Diretor de Compras', status: 'active', avatar: 'https://i.pravatar.cc/150?u=carlos' },
  { id: '3', name: 'Mariana Costa', email: 'mariana@inova.com.br', phone: '(21) 99876-5432', company: 'Inova Sistemas', role: 'Gerente de TI', status: 'inactive', avatar: 'https://i.pravatar.cc/150?u=mariana' },
  { id: '4', name: 'Roberto Alves', email: 'roberto.alves@alphafin.com', phone: '(31) 98888-7777', company: 'Alpha Finance', role: 'CFO', status: 'active', avatar: 'https://i.pravatar.cc/150?u=roberto' },
  { id: '5', name: 'Fernanda Lima', email: 'fernanda@betacorp.com', phone: '(41) 97777-6666', company: 'Beta Corp', role: 'CEO', status: 'active' },
]

export function Contacts() {
  const [contacts, setContacts] = React.useState<Contact[]>(MOCK_CONTACTS)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isNewContactOpen, setIsNewContactOpen] = React.useState(false)

  const filteredContacts = React.useMemo(() => {
    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [contacts, searchQuery])

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contatos</h1>
          <p className="text-muted-foreground">Gerencie sua lista de contatos e clientes.</p>
        </div>
        <Dialog open={isNewContactOpen} onOpenChange={setIsNewContactOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Novo Contato</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Contato</DialogTitle>
              <DialogDescription>
                Preencha os dados do novo contato. Clique em salvar quando terminar.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" placeholder="Ex: João da Silva" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" placeholder="joao@empresa.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" placeholder="(00) 00000-0000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Input id="company" placeholder="Nome da empresa" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Cargo</Label>
                  <Input id="role" placeholder="Ex: Diretor" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={() => setIsNewContactOpen(false)}>Salvar Contato</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nome, e-mail ou empresa..." 
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
                <th className="px-6 py-3 font-medium">Contato</th>
                <th className="px-6 py-3 font-medium">Empresa & Cargo</th>
                <th className="px-6 py-3 font-medium">Contato</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Nenhum contato encontrado.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr key={contact.id} className="bg-card hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {contact.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-foreground">{contact.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium flex items-center gap-1">
                          <Building2 className="h-3 w-3 text-muted-foreground" />
                          {contact.company}
                        </span>
                        <span className="text-muted-foreground text-xs">{contact.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {contact.email}
                        </span>
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {contact.phone}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={contact.status === 'active' ? 'default' : 'secondary'} className={contact.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : ''}>
                        {contact.status === 'active' ? 'Ativo' : 'Inativo'}
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
