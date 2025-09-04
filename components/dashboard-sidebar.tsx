"use client"

import { BarChart3, MessageSquare, Settings, Users, Home, TrendingUp } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Pesquisas",
    href: "/dashboard/surveys",
    icon: MessageSquare,
  },
  {
    name: "Respostas",
    href: "/dashboard/responses",
    icon: Users,
  },
  {
    name: "Análises",
    href: "/dashboard/analytics",
    icon: TrendingUp,
  },
  {
    name: "Relatórios",
    href: "/dashboard/reports",
    icon: BarChart3,
  },
  {
    name: "Configurações",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-6">
          <h2 className="text-lg font-semibold">Sistema NPS</h2>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
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
