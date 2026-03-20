import * as React from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { 
  Home, 
  Users, 
  Building2, 
  KanbanSquare, 
  FileText, 
  Calendar, 
  BarChart3, 
  Settings, 
  LifeBuoy,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { cn } from "@/src/lib/utils"
import { Button } from "@/src/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/src/components/ui/tooltip"
import { Badge } from "@/src/components/ui/badge"
import { useActivitiesStore } from "@/src/store/activities"
import { useAuthStore } from "@/src/store/auth"

interface SidebarProps {
  isCollapsed: boolean
  setIsCollapsed: (value: boolean) => void
  isMobileOpen: boolean
  setIsMobileOpen: (value: boolean) => void
}

const navItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Users, label: "Contatos", href: "/contacts" },
  { icon: Building2, label: "Empresas", href: "/companies" },
  { icon: KanbanSquare, label: "Pipeline", href: "/pipeline", badge: "3" },
  { icon: FileText, label: "Propostas", href: "/proposals" },
  { icon: Calendar, label: "Atividades", href: "/activities", id: "activities" },
  { icon: BarChart3, label: "Relatórios", href: "/reports" },
  { icon: Settings, label: "Configurações", href: "/settings" },
]

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  manager: 'Gerente',
  sales: 'Vendedor',
  viewer: 'Visualizador',
}

export function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const { getOverdueCount } = useActivitiesStore()
  const overdueCount = getOverdueCount()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-card transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[64px]" : "w-[260px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo Area */}
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <span className="text-lg font-bold font-display whitespace-nowrap">
                CRM Pro
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex h-8 w-8 shrink-0"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="grid gap-1 px-2">
            <TooltipProvider delayDuration={0}>
              {navItems.map((item, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <NavLink
                      to={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={({ isActive }) => cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                        isCollapsed ? "justify-center px-0" : "justify-start"
                      )}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && (
                        <span className="flex-1 truncate">{item.label}</span>
                      )}
                      {!isCollapsed && item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                      {!isCollapsed && item.id === 'activities' && overdueCount > 0 && (
                        <Badge variant="destructive" className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px]">
                          {overdueCount}
                        </Badge>
                      )}
                    </NavLink>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right" className="flex items-center gap-4">
                      {item.label}
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                      {item.id === 'activities' && overdueCount > 0 && (
                        <Badge variant="destructive" className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px]">
                          {overdueCount}
                        </Badge>
                      )}
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </TooltipProvider>

            <div className="my-4 border-t" />

            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <NavLink
                    to="/support"
                    onClick={() => setIsMobileOpen(false)}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                      isCollapsed ? "justify-center px-0" : "justify-start"
                    )}
                  >
                    <LifeBuoy className="h-5 w-5 shrink-0" />
                    {!isCollapsed && <span className="truncate">Suporte</span>}
                  </NavLink>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">Suporte</TooltipContent>}
              </Tooltip>
            </TooltipProvider>
          </nav>
        </div>

        {/* User Profile */}
        <div className="border-t p-4">
          <div className={cn(
            "flex items-center gap-3",
            isCollapsed ? "justify-center" : "justify-between"
          )}>
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarImage src={user?.avatar || "https://github.com/shadcn.png"} alt={user?.name} />
              <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex flex-1 flex-col overflow-hidden">
                <span className="truncate text-sm font-medium">{user?.name || "Usuário"}</span>
                <span className="truncate text-xs text-muted-foreground">{user?.role ? ROLE_LABELS[user.role] : "Admin"}</span>
              </div>
            )}
            {!isCollapsed && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
