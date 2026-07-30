import { type LucideIcon } from "lucide-react"
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

export type NavMainItem = {
    title: string
    url: string
    isActive?: boolean
    icon?: LucideIcon
    emoji?: string
}

type NavMainProps = {
    items: NavMainItem[]
}

export function NavMain({ items }: NavMainProps) {
    return (
        <SidebarGroup className="p-0">
            <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton isActive={item.isActive} tooltip={item.title}>
                                {/* Support both icons and emoji so the same nav renderer can be reused for different demos. */}
                                <a className="flex items-center gap-2" href={item.url}>
                                    {item.icon ? <item.icon className="size-4" /> : null}
                                    {item.emoji ? (
                                        <span aria-hidden="true" className="text-[14px] leading-none">
                                            {item.emoji}
                                        </span>
                                    ) : null}
                                    <span>{item.title}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
