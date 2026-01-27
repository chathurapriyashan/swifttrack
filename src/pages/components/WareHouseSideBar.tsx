import {  Home, History, ListOrdered, Car, Package } from "lucide-react"

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

// Menu items.
const items = [
  {
    title: "Home",
    url: "/warehouse",
    icon: Home,
  },
  {
    title: "Drivers",
    url: "/drivers",
    icon: Car
  },
  {
    title: "Packages",
    url: "/packages",
    icon: Package,
  }, 
]

export default function WareHouseSidebar() {
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