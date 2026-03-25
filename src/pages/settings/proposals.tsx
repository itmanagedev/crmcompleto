import * as React from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Trash2, FileText, Image as ImageIcon } from "lucide-react"

import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/src/components/ui/card"
import { Separator } from "@/src/components/ui/separator"

const templateSchema = z.object({
  templates: z.array(z.object({
    id: z.string(),
    name: z.string().min(2, "Nome é obrigatório"),
    logo: z.string().url("URL inválida").optional().or(z.literal("")),
    primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Cor inválida"),
    companyName: z.string().min(2, "Nome da empresa é obrigatório"),
    companyInfo: z.string().optional(),
  }))
})

type TemplateFormValues = z.infer<typeof templateSchema>

export function ProposalSettings() {
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      templates: []
    }
  })

  React.useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch('/api/templates')
        if (res.ok) {
          const data = await res.json()
          if (data.length > 0) {
            reset({ templates: data })
          } else {
            reset({
              templates: [{
                id: "1",
                name: "Padrão",
                logo: "",
                primaryColor: "#000000",
                companyName: "Minha Empresa",
                companyInfo: "",
              }]
            })
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchTemplates()
  }, [reset])

  const { fields, append, remove } = useFieldArray({
    control,
    name: "templates"
  })

  const onSubmit = async (data: TemplateFormValues) => {
    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (res.ok) {
        alert("Modelos salvos com sucesso!")
      } else {
        alert("Erro ao salvar modelos")
      }
    } catch (e) {
      console.error(e)
      alert("Erro ao salvar modelos")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Modelos de Proposta</h3>
        <p className="text-sm text-muted-foreground">
          Configure os modelos de proposta com identidade visual personalizada para diferentes empresas.
        </p>
      </div>
      <Separator />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Modelo {index + 1}
                </CardTitle>
              </div>
              {fields.length > 1 && (
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome do Modelo</Label>
                  <Input {...register(`templates.${index}.name`)} placeholder="Ex: Empresa A - Padrão" />
                  {errors.templates?.[index]?.name && (
                    <p className="text-xs text-destructive">{errors.templates[index]?.name?.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Nome da Empresa</Label>
                  <Input {...register(`templates.${index}.companyName`)} placeholder="Ex: Empresa A" />
                </div>
                <div className="space-y-2">
                  <Label>URL da Logo</Label>
                  <div className="flex gap-2">
                    <Input {...register(`templates.${index}.logo`)} placeholder="https://..." />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Cor Primária</Label>
                  <div className="flex gap-2">
                    <Input type="color" {...register(`templates.${index}.primaryColor`)} className="w-12 p-1 h-10" />
                    <Input {...register(`templates.${index}.primaryColor`)} placeholder="#000000" className="flex-1" />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Informações da Empresa (Rodapé/Cabeçalho)</Label>
                  <Textarea {...register(`templates.${index}.companyInfo`)} placeholder="Endereço, CNPJ, Telefone..." rows={3} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ id: Date.now().toString(), name: "", logo: "", primaryColor: "#000000", companyName: "", companyInfo: "" })}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Modelo
          </Button>
          <Button type="submit">Salvar Modelos</Button>
        </div>
      </form>
    </div>
  )
}
