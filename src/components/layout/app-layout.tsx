import * as React from "react"
import { Outlet } from "react-router-dom"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { cn } from "@/src/lib/utils"
import { useTheme } from "@/src/hooks/use-theme"
import { NewActivityModal } from "@/src/components/activities/new-activity-modal"

export function AppLayout() {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)
  
  // Initialize theme
  useTheme()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NewActivityModal />
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        isMobileOpen={isMobileOpen} 
        setIsMobileOpen={setIsMobileOpen} 
      />
      
      <div className={cn(
        "flex flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "md:pl-[64px]" : "md:pl-[260px]"
      )}>
        <Header 
          isCollapsed={isCollapsed} 
          setIsMobileOpen={setIsMobileOpen} 
        />
        
        <main className="flex-1 overflow-y-auto bg-muted/20">
          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
