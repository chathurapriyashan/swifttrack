import {  Home, History, ListOrdered } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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
]

export default function AppSidebar({user}) {

  const onSignOut = ()=>{
    localStorage.clear();
    window.location.reload();
  }





  return (
    <Sidebar>
      <SidebarContent>
        <Avatar className="m-4 w-10 h-10">
          <AvatarImage src={user.image} />
          <p>user.email</p>
          <AvatarFallback>user.name</AvatarFallback>
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


        <SidebarGroup>
          <SidebarGroupContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" >Signout</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onSignOut}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
              
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
    </Sidebar>
  )
}