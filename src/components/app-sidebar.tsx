"use client"

import * as React from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import {
    ChartArea,
    FolderKanban,
    House,
    Inbox,
    PanelLeft,
    ReceiptText,
    Users,
} from "lucide-react"
import { AppBrand } from "./app-brand"
import { NavMain, type NavMainItem } from "./nav-main"

type SidebarMode = "expanded" | "collapsed" | "hover"

type SidebarModeOption = {
    value: SidebarMode
    label: string
}

const SIDEBAR_MODE_OPTIONS = [
    { value: "expanded", label: "Expanded" },
    { value: "collapsed", label: "Collapsed" },
    { value: "hover", label: "Expand on hover" },
] as const satisfies SidebarModeOption[]

const NAV_ITEMS = [
    { title: "Overview", url: "#", icon: House, isActive: true },
    { title: "Inbox", url: "#", icon: Inbox },
    { title: "Projects", url: "#", icon: FolderKanban },
    { title: "Team", url: "#", icon: Users },
    { title: "Billing", url: "#", icon: ReceiptText },
    { title: "Analytics", url: "#", icon: ChartArea },
] satisfies NavMainItem[]

// In hover mode, a negative right margin lets the expanded panel overlap adjacent content
// instead of pushing it, so the surrounding layout doesn't shift on hover.
function getSidebarShellClassName(mode: SidebarMode, isExpandedInHoverMode: boolean) {
    if (mode !== "hover") {
        return "w-full"
    }

    return isExpandedInHoverMode
        ? "md:w-(--sidebar-width) md:-mr-[calc(var(--sidebar-width)-var(--sidebar-width-icon))]"
        : "w-full"
}

export function AppSidebar() {
    const { open, setOpen } = useSidebar()
    const [mode, setMode] = React.useState<SidebarMode>("hover")
    const [isHovering, setIsHovering] = React.useState(false)
    const [isModeMenuOpen, setIsModeMenuOpen] = React.useState(false)

    // Keep the current label in sync with the selected mode for accessibility.
    const activeMode =
        SIDEBAR_MODE_OPTIONS.find((option) => option.value === mode) ?? SIDEBAR_MODE_OPTIONS[2]

    const isHoverMode = mode === "hover"
    const isExpandedInHoverMode = isHoverMode && (open || isModeMenuOpen)

    // In hover mode, the shell temporarily grows so the expanded panel can overlap content cleanly.
    const sidebarShellClassName = getSidebarShellClassName(mode, isExpandedInHoverMode)

    // Synchronize the shared sidebar state whenever the interaction mode changes.
    React.useEffect(() => {
        if (mode === "expanded") {
            setOpen(true)
            return
        }

        if (mode === "collapsed") {
            setOpen(false)
            return
        }

        setOpen(isHovering || isModeMenuOpen)
    }, [isHovering, isModeMenuOpen, mode, setOpen])

    const handleMouseEnter = () => {
        setIsHovering(true)

        if (isHoverMode) {
            setOpen(true)
        }
    }

    // Do not close the sidebar while the mode dropdown is still open.
    const handleMouseLeave = () => {
        setIsHovering(false)

        if (isHoverMode && !isModeMenuOpen) {
            setOpen(false)
        }
    }

    const handleModeMenuOpenChange = (nextOpen: boolean) => {
        setIsModeMenuOpen(nextOpen)

        if (isHoverMode) {
            setOpen(nextOpen || isHovering)
        }
    }

    return (
        <div
            className={cn(
                // Reserve horizontal space based on the desktop sidebar mode.
                "w-0 shrink-0",
                mode === "expanded" ? "md:w-(--sidebar-width)" : "md:w-(--sidebar-width-icon)"
            )}
        >
            <div
                className={cn("relative", sidebarShellClassName)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Sidebar
                    collapsible="icon"
                    className={cn("top-12 h-[calc(100svh-3rem)] border-r", isHoverMode && "z-20")}
                >
                    {/* Mobile shows the brand inside the drawer because the desktop header is hidden there. */}
                    <SidebarHeader className="px-3.5 pt-4 font-medium md:hidden">
                        <AppBrand />
                    </SidebarHeader>

                    <SidebarContent className="px-2 pt-2">
                        <NavMain items={NAV_ITEMS} />
                    </SidebarContent>

                    <SidebarFooter className="hidden border-t border-sidebar-border md:block">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <DropdownMenu onOpenChange={handleModeMenuOpenChange}>
                                    <DropdownMenuTrigger asChild>
                                        <SidebarMenuButton
                                            className="text-muted-foreground"
                                            aria-label={`Sidebar Control: ${activeMode.label}`}
                                        >
                                            <PanelLeft className="size-4" />
                                            <span>Toggle Sidebar</span>
                                        </SidebarMenuButton>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent side="top" align="end" className="w-48">
                                        <DropdownMenuGroup>
                                            <DropdownMenuLabel>Sidebar Control</DropdownMenuLabel>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuRadioGroup
                                            value={mode}
                                            onValueChange={(value) => setMode(value as SidebarMode)}
                                        >
                                            {SIDEBAR_MODE_OPTIONS.map((option) => (
                                                <DropdownMenuRadioItem key={option.value} value={option.value}>
                                                    <span className="text-xs">{option.label}</span>
                                                </DropdownMenuRadioItem>
                                            ))}
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarFooter>
                </Sidebar>
            </div>
        </div>
    )
}
