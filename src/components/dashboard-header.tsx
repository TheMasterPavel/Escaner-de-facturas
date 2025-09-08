import {
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function DashboardHeader({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <SidebarTrigger className="flex md:hidden" />
      <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
    </header>
  );
}
