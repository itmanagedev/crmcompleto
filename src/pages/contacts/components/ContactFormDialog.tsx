import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"

export interface Contact {
  id: string
  name: string
  company: string
  role: string
  email: string
  phone: string
  lastContact: string
  status: 'active' | 'inactive' | 'lead'
  tags: string[]
  avatar?: string
  owner: string
}

interface ContactFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contact?: Contact | null
  onSave: (contact: Partial<Contact>) => void
}

export function ContactFormDialog({ open, onOpenChange, contact, onSave }: ContactFormDialogProps) {
  const [formData, setFormData] = React.useState<Partial<Contact>>({
    name: '',
    company: '',
    role: '',
    email: '',
    phone: '',
    status: 'lead',
  })
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (contact) {
      setFormData(contact)
    } else {
      setFormData({
        name: '',
        company: '',
        role: '',
        email: '',
        phone: '',
        status: 'lead',
      })
    }
    setError(null)
  }, [contact, open])

  const handleChange = (field: keyof Contact, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || formData.name.trim() === '') {
      setError('O nome do contato é obrigatório.')
      return
    }
    setError(null)
    onSave(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{contact ? 'Editar Contato' : 'Novo Contato'}</DialogTitle>
          <DialogDescription>
            {contact ? 'Atualize as informações do contato.' : 'Preencha os dados para criar um novo contato.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input 
                id="name" 
                value={formData.name || ''} 
                onChange={e => handleChange('name', e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input 
                id="company" 
                value={formData.company || ''} 
                onChange={e => handleChange('company', e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Cargo</Label>
              <Input 
                id="role" 
                value={formData.role || ''} 
                onChange={e => handleChange('role', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input 
                id="email" 
                type="email"
                value={formData.email || ''} 
                onChange={e => handleChange('email', e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input 
                id="phone" 
                value={formData.phone || ''} 
                onChange={e => handleChange('phone', e.target.value)} 
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status || 'lead'} 
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
