import * as React from "react"
import { Plus, Mail, Shield, Check, X, MoreHorizontal, UserPlus } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Badge } from "@/src/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog"

const PERMISSIONS = [
  { module: 'Contatos', admin: ['view', 'create', 'edit', 'delete'], manager: ['view', 'create', 'edit', 'delete'], sales: ['view', 'create', 'edit'], viewer: ['view'] },
  { module: 'Empresas', admin: ['view', 'create', 'edit', 'delete'], manager: ['view', 'create', 'edit', 'delete'], sales: ['view', 'create', 'edit'], viewer: ['view'] },
  { module: 'Negócios (Deals)', admin: ['view', 'create', 'edit', 'delete'], manager: ['view', 'create', 'edit', 'delete'], sales: ['view', 'create', 'edit'], viewer: ['view'] },
  { module: 'Relatórios', admin: ['view', 'create', 'edit', 'delete'], manager: ['view', 'create'], sales: ['view'], viewer: [] },
  { module: 'Configurações', admin: ['view', 'create', 'edit', 'delete'], manager: ['view'], sales: [], viewer: [] },
]

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  manager: 'Gerente',
  sales: 'Vendedor',
  viewer: 'Visualizador',
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-slate-100 text-slate-700',
  pending: 'bg-amber-100 text-amber-700',
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
  pending: 'Pendente',
}

export function UsersSettings() {
  const [isInviteOpen, setIsInviteOpen] = React.useState(false)
  const [users, setUsers] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [newUser, setNewUser] = React.useState({ name: '', email: '', role: 'sales' })

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchUsers()
  }, [])

  const handleInvite = async () => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      })
      if (res.ok) {
        alert('Convite enviado com sucesso!')
        setIsInviteOpen(false)
        setNewUser({ name: '', email: '', role: 'sales' })
        fetchUsers()
      } else {
        alert('Erro ao enviar convite.')
      }
    } catch (error) {
      console.error("Error inviting user:", error)
      alert('Erro ao enviar convite.')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este usuário?')) {
      try {
        const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })
        if (res.ok) {
          fetchUsers()
        } else {
          alert('Erro ao remover usuário.')
        }
      } catch (error) {
        console.error("Error deleting user:", error)
        alert('Erro ao remover usuário.')
      }
    }
  }

  const handleStatusChange = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        fetchUsers()
      } else {
        alert('Erro ao atualizar status do usuário.')
      }
    } catch (error) {
      console.error("Error updating user status:", error)
      alert('Erro ao atualizar status do usuário.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Usuários e Permissões</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie o acesso da sua equipe ao CRM. Aqui você pode cadastrar novos vendedores.
          </p>
        </div>
        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Convidar Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Convidar Novo Usuário</DialogTitle>
              <DialogDescription>
                Enviaremos um e-mail com as instruções de acesso.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="invite-name">Nome</Label>
                <Input 
                  id="invite-name" 
                  placeholder="Nome do usuário" 
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="invite-email">E-mail</Label>
                <Input 
                  id="invite-email" 
                  type="email" 
                  placeholder="nome@empresa.com" 
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="invite-role">Papel de Acesso</Label>
                <Select value={newUser.role} onValueChange={(val) => setNewUser({...newUser, role: val})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="manager">Gerente</SelectItem>
                    <SelectItem value="sales">Vendedor</SelectItem>
                    <SelectItem value="viewer">Visualizador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInviteOpen(false)}>Cancelar</Button>
              <Button onClick={handleInvite}>Enviar Convite</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuários Ativos</CardTitle>
          <CardDescription>Lista de todos os usuários cadastrados na sua organização.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Papel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Último Acesso</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">Carregando...</TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">Nenhum usuário encontrado.</TableCell>
                </TableRow>
              ) : users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image} />
                        <AvatarFallback>{(user.name || 'U').substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {ROLE_LABELS[user.role || 'sales'] || user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={STATUS_COLORS[user.status || 'active'] || STATUS_COLORS.active}>
                      {STATUS_LABELS[user.status || 'active'] || user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('pt-BR') : 'Nunca'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem>Editar Papel</DropdownMenuItem>
                        {user.status === 'pending' && <DropdownMenuItem>Reenviar Convite</DropdownMenuItem>}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(user.id, user.status)}
                        >
                          {user.status === 'active' ? 'Desativar Usuário' : 'Ativar Usuário'}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(user.id)}>
                          Remover Usuário
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Matriz de Permissões</CardTitle>
          <CardDescription>Visão geral do que cada papel pode fazer no sistema.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Módulo</TableHead>
                <TableHead className="text-center">Administrador</TableHead>
                <TableHead className="text-center">Gerente</TableHead>
                <TableHead className="text-center">Vendedor</TableHead>
                <TableHead className="text-center">Visualizador</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PERMISSIONS.map((perm) => (
                <TableRow key={perm.module}>
                  <TableCell className="font-medium">{perm.module}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-1">
                      {['view', 'create', 'edit', 'delete'].map(action => (
                        <div key={action} className={`h-2 w-2 rounded-full ${perm.admin.includes(action) ? 'bg-primary' : 'bg-slate-200'}`} title={action} />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-1">
                      {['view', 'create', 'edit', 'delete'].map(action => (
                        <div key={action} className={`h-2 w-2 rounded-full ${perm.manager.includes(action) ? 'bg-primary' : 'bg-slate-200'}`} title={action} />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-1">
                      {['view', 'create', 'edit', 'delete'].map(action => (
                        <div key={action} className={`h-2 w-2 rounded-full ${perm.sales.includes(action) ? 'bg-primary' : 'bg-slate-200'}`} title={action} />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-1">
                      {['view', 'create', 'edit', 'delete'].map(action => (
                        <div key={action} className={`h-2 w-2 rounded-full ${perm.viewer.includes(action) ? 'bg-primary' : 'bg-slate-200'}`} title={action} />
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-primary" /> Visualizar</div>
            <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-primary" /> Criar</div>
            <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-primary" /> Editar</div>
            <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-primary" /> Excluir</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
