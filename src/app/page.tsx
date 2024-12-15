import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { Avatar } from "@/components/ui/avatar";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  if (!session)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-4 font-[family-name:var(--font-geist-sans)] bg-[#f5f5f5]">
        <span>Not authenticated</span>
        <Link href="/signin">
          <Button>Sign in</Button>
        </Link>
      </div>
    );

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
          <Breadcrumb className="flex items-center gap-4">
            <Avatar className="rounded-md flex items-center justify-center bg-muted">
              <AvatarImage src={""} alt={"User"} />
              <AvatarFallback>US</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div>Dimitar Dimitrov</div>
              <div className="text-muted-foreground text-sm">
                last seen 30m ago
              </div>
            </div>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 bg-[#f5f5f5]">test</div>
        <footer className="sticky bottom-0 flex shrink-0 items-center gap-2 border-t bg-background p-4">
          <input className="flex-1" placeholder="Type a message..." />
          <Button>
            <MessageSquare />
          </Button>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
