import {  Home, History, ListOrdered } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "../../components/ui/button"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/users",
    icon: Home,
  },
  {
    title: "Orders",
    url: "#",
    icon: ListOrdered
  },
  {
    title: "History",
    url: "/history",
    icon: History,
  },


]

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <Avatar className="m-4 w-10 h-10">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>Avatar</AvatarFallback>
        </Avatar>

        <SidebarGroup>
          {/* <SidebarGroupLabel>Order Management</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              <a href="/users/orders/new">
                <Button variant="default" className="m-3">Create new Order +</Button>
              </a>

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>



              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}