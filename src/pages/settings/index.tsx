import * as React from "react"
import { NavLink, Outlet, useLocation } from "react-router-dom"
import { User, Building2, KanbanSquare, TextCursorInput, Users, Link as LinkIcon, FileText } from "lucide-react"
import { cn } from "@/src/lib/utils"

const SETTINGS_NAV = [
  { name: "Perfil do Usuário", href: "/settings/profile", icon: User },
  { name: "Empresa", href: "/settings/company", icon: Building2 },
  { name: "Pipeline", href: "/settings/pipeline", icon: KanbanSquare },
  { name: "Modelos de Proposta", href: "/settings/proposals", icon: FileText },
  { name: "Campos Personalizados", href: "/settings/custom-fields", icon: TextCursorInput },
  { name: "Usuários e Permissões", href: "/settings/users", icon: Users },
  { name: "Integrações", href: "/settings/integrations", icon: LinkIcon },
]

export function SettingsLayout() {
  const location = useLocation()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">Gerencie as configurações da sua conta e do sistema.</p>
      </div>
      
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 overflow-x-auto px-4 lg:px-0 pb-2 lg:pb-0">
            {SETTINGS_NAV.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.name}
                </NavLink>
              )
            })}
          </nav>
        </aside>
        <div className="flex-1 lg:max-w-4xl">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
