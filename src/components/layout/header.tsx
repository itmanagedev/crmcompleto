import * as React from "react"
import { Menu, Search, Bell, Moon, Sun } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { useTheme } from "@/src/hooks/use-theme"
import { Badge } from "@/src/components/ui/badge"

interface HeaderProps {
  isCollapsed: boolean
  setIsMobileOpen: (value: boolean) => void
}

export function Header({ isCollapsed, setIsMobileOpen }: HeaderProps) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <Button
        variant="ghost"
        size="icon"
        className="-m-2.5 p-2.5 text-muted-foreground md:hidden"
        onClick={() => setIsMobileOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-5 w-5" aria-hidden="true" />
      </Button>

      {/* Separator */}
      <div className="h-6 w-px bg-border md:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Buscar
          </label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-foreground placeholder:text-muted-foreground focus:ring-0 sm:text-sm bg-transparent outline-none"
            placeholder="Buscar clientes, propostas, atividades..."
            type="search"
            name="search"
          />
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <Button
            variant="ghost"
            size="icon"
            className="-m-2.5 p-2.5 text-muted-foreground hover:text-foreground"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <span className="sr-only">Toggle theme</span>
            {theme === "dark" ? (
              <Sun className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Moon className="h-5 w-5" aria-hidden="true" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="relative -m-2.5 p-2.5 text-muted-foreground hover:text-foreground"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
            </span>
          </Button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" aria-hidden="true" />

          {/* Profile dropdown */}
          <div className="hidden lg:flex lg:items-center lg:gap-x-4">
            <span className="text-sm font-semibold leading-6 text-foreground" aria-hidden="true">
              João Silva
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
