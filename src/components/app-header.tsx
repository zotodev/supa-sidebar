import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { AppBrand } from "./app-brand"

export function AppHeader() {
    return (
        <header className="flex h-12 w-full shrink-0 items-center gap-3 border-b border-sidebar-border bg-sidebar px-2 md:px-4">
            <SidebarTrigger className="md:hidden" />
            <AppBrand />

            <div className="ml-auto flex items-center gap-1">
                <Avatar className="size-7">
                    <AvatarImage src="https://avatars.githubusercontent.com/u/114809507" alt="User avatar" />
                    <AvatarFallback>R</AvatarFallback>
                </Avatar>
            </div>
        </header>
    )
}
