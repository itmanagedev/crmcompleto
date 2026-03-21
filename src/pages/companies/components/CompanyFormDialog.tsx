import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"

export interface Company {
  id: string
  name: string
  industry: string
  size: string
  revenue: string
  city: string
  state: string
  website: string
  contactsCount: number
  dealsCount: number
  status: 'active' | 'inactive' | 'prospect'
  tags: string[]
  logo?: string
  owner: string
}

interface CompanyFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  company?: Company | null
  onSave: (company: Partial<Company>) => void
}

export function CompanyFormDialog({ open, onOpenChange, company, onSave }: CompanyFormDialogProps) {
  const [formData, setFormData] = React.useState<Partial<Company>>({})

  React.useEffect(() => {
    if (company) {
      setFormData(company)
    } else {
      setFormData({
        status: 'prospect',
        contactsCount: 0,
        dealsCount: 0,
        tags: []
      })
    }
  }, [company, open])

  const handleSave = () => {
    onSave(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{company ? 'Editar Empresa' : 'Nova Empresa'}</DialogTitle>
          <DialogDescription>
            {company ? 'Atualize os dados da empresa.' : 'Adicione uma nova empresa ao CRM.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Empresa</Label>
              <Input 
                id="name" 
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Segmento</Label>
              <Input 
                id="industry" 
                value={formData.industry || ''}
                onChange={(e) => setFormData({...formData, industry: e.target.value})}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input 
                id="website" 
                value={formData.website || ''}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status || 'prospect'} onValueChange={(v) => setFormData({...formData, status: v as any})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativa</SelectItem>
                  <SelectItem value="prospect">Prospect</SelectItem>
                  <SelectItem value="inactive">Inativa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input 
                id="city" 
                value={formData.city || ''}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input 
                id="state" 
                value={formData.state || ''}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
