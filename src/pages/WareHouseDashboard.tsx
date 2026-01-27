import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

import ClientDashboardHome from "./ClientDashboardHome"
import WareHouseDashboardHome from "./WareHouseDashboardHome"
import WareHouseSidebar from "./components/WareHouseSideBar"



export default function WareHouseDashboard({ children }: { children: React.ReactNode }){
    return (
    <SidebarProvider>
      <WareHouseSidebar />
      <main className="flex flex-col w-full">
        <WareHouseDashboardHome />
        {children}
      </main>
    </SidebarProvider>
  )
}