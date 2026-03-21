import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog"

const dealFormSchema = z.object({
  title: z.string().min(3, "Título deve ter no mínimo 3 caracteres"),
  company: z.string().min(2, "Empresa obrigatória"),
  value: z.number().min(0, "Valor deve ser maior ou igual a zero"),
  stageId: z.string(),
  probability: z.number().min(0).max(100),
  expectedCloseDate: z.string(),
  description: z.string().optional(),
})

export type DealFormValues = z.infer<typeof dealFormSchema>

interface DealFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deal?: any // Using any for simplicity, or we can import Deal type
  onSave: (data: DealFormValues) => void
  stages: { id: string; title: string }[]
}

export function DealFormDialog({ open, onOpenChange, deal, onSave, stages }: DealFormDialogProps) {
  const form = useForm<DealFormValues>({
    resolver: zodResolver(dealFormSchema),
    defaultValues: {
      title: "",
      company: "",
      value: 0,
      stageId: "prospeccao",
      probability: 20,
      expectedCloseDate: new Date().toISOString().split('T')[0],
      description: "",
    },
  })

  React.useEffect(() => {
    if (open) {
      if (deal) {
        form.reset({
          title: deal.title,
          company: deal.company,
          value: deal.value,
          stageId: deal.stageId,
          probability: deal.probability,
          expectedCloseDate: deal.expectedCloseDate,
          description: deal.description || "",
        })
      } else {
        form.reset({
          title: "",
          company: "",
          value: 0,
          stageId: "prospeccao",
          probability: 20,
          expectedCloseDate: new Date().toISOString().split('T')[0],
          description: "",
        })
      }
    }
  }, [open, deal, form])

  const onSubmit = (values: DealFormValues) => {
    onSave(values)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{deal ? "Editar Oportunidade" : "Criar Nova Oportunidade"}</DialogTitle>
          <DialogDescription>
            {deal
              ? "Atualize os dados da oportunidade abaixo."
              : "Preencha os dados básicos para adicionar um novo deal ao pipeline."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="title">Título do Deal</Label>
              <Input id="title" {...form.register("title")} placeholder="Ex: Licenciamento Anual" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input id="company" {...form.register("company")} placeholder="Ex: Acme Corp" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Valor (R$)</Label>
              <Input id="value" type="number" {...form.register("value", { valueAsNumber: true })} placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stageId">Estágio</Label>
              <Select onValueChange={(val) => form.setValue("stageId", val)} value={form.watch("stageId")}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map(stage => (
                    <SelectItem key={stage.id} value={stage.id}>{stage.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="probability">Probabilidade (%)</Label>
              <Input id="probability" type="number" {...form.register("probability", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="expectedCloseDate">Previsão de Fechamento</Label>
              <Input id="expectedCloseDate" type="date" {...form.register("expectedCloseDate")} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{deal ? "Salvar Alterações" : "Salvar Deal"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
