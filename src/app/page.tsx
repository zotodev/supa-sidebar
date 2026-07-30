import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppHeader } from "../components/app-header";
import { AppSidebar } from "../components/app-sidebar";

// Customize the expanded sidebar width via the `--sidebar-width` CSS variable.
const SIDEBAR_PROVIDER_STYLE = {
  "--sidebar-width": "14rem",
} as React.CSSProperties;

export default function Page() {
  return (
    <SidebarProvider
      defaultOpen={false}
      className="min-h-0 flex-1"
      style={SIDEBAR_PROVIDER_STYLE}
    >
      <div className="flex min-h-svh w-full flex-col">
        <AppHeader />

        <div className="flex min-h-0 flex-1">
          <AppSidebar />

          <SidebarInset className="bg-sidebar">
            {/* This area acts as a placeholder canvas for the page content preview. */}
            <div className="flex flex-1 flex-col p-4">
              <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min" />
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
