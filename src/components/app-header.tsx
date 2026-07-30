import { Search, Settings } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeader() {
  return (
    <header className="flex h-12 w-full shrink-0 items-center gap-3 border-b border-sidebar-border bg-sidebar px-2 md:px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <Badge variant="secondary">Development</Badge>
      </div>

      <button
        type="button"
        className="mx-auto flex h-8 w-full max-w-md flex-1 items-center gap-2 rounded-lg border border-input bg-background px-2.5 text-sm text-muted-foreground"
      >
        <Search className="size-4 shrink-0" />
        <span className="flex-1 text-left">Search…</span>
        <kbd className="pointer-events-none hidden h-5 items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium sm:inline-flex">
          ⌘K
        </kbd>
      </button>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Settings">
            <Settings />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>To be implemented</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </header>
  );
}
