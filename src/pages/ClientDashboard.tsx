import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

import AppSidebar from "./components/AppSidebar"
import ClientDashboardHome from "./ClientDashboardHome"

const ws = new WebSocket('ws://localhost:3008');
ws.onopen = () => {
  console.log('WebSocket connection established');
  ws.send(JSON.stringify({ 
    type: 'register', 
    clientType: 'client', 
    userId: localStorage.getItem('id') 
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