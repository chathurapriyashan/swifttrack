import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

import ClientDashboardHome from "./ClientDashboardHome"
import WareHouseDashboardHome from "./WareHouseDashboardHome"
import WareHouseSidebar from "./components/WareHouseSideBar"




const ws = new WebSocket('ws://localhost:3008/register');
ws.onopen = () => {
  console.log('WebSocket connection established');
  ws.send(JSON.stringify({
    type: 'register',
    clientType: 'client',
    userId: localStorage.getItem('id') || 1,
  }));

}


import Swal from "sweetalert2"

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  Swal.fire({
    title: 'New Notification',
    text: message.data.message,
    icon: 'info',
    confirmButtonText: 'OK'
  });
  console.log('Received WebSocket message:', message);
}


export default function WareHouseDashboard({ children }: {
  children: React.ReactNode
}) {






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