import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

import AppSidebar from "./components/AppSidebar"
import ClientDashboardHome from "./ClientDashboardHome"



export default function ClientDashboard({ children , user }: { children: React.ReactNode }){
    return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <main className="flex flex-col w-full">
        <ClientDashboardHome />
        {children}
      </main>
    </SidebarProvider>
  )
}