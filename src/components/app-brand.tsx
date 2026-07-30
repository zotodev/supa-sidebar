import { Command } from "lucide-react"

type AppBrandProps = {
    href?: string
}

export function AppBrand({ href = "#" }: AppBrandProps) {
    return (
        // Centralize the brand UI so header and sidebar stay visually consistent.
        <a href={href} className="flex items-center gap-2 font-medium">
            <Command className="size-5" />
            <span>Acme Inc.</span>
        </a>
    )
}
