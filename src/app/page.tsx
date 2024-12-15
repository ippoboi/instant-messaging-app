import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { Avatar } from "@/components/ui/avatar";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";
import { Messages } from "@/components/messages";
import { ChatInput } from "@/components/chat-input";
import { prisma } from "@/lib/prisma";

interface HomeProps {
  searchParams: Promise<{ conversation?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const session = await auth();

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-4 font-[family-name:var(--font-geist-sans)] bg-[#f5f5f5]">
        <span>Not authenticated</span>
        <Link href="/signin">
          <Button>Sign in</Button>
        </Link>
      </div>
    );
  }

  let activeConversation = null;
  if (params.conversation) {
    activeConversation = await prisma.conversation.findFirst({
      where: {
        id: params.conversation,
        participants: {
          some: { id: session.user.id },
        },
      },
      include: {
        participants: {
          where: {
            NOT: { id: session.user.id },
          },
        },
      },
    });
  }

  const otherUser = activeConversation?.participants[0];

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar activeConversationId={params.conversation} />
      <SidebarInset>
        {activeConversation ? (
          <>
            <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
              <Breadcrumb className="flex items-center gap-4">
                <Avatar className="rounded-md flex items-center justify-center bg-muted">
                  <AvatarImage
                    src={otherUser?.image || ""}
                    alt={otherUser?.name || "User"}
                  />
                  <AvatarFallback>{otherUser?.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div>{otherUser?.name}</div>
                  <div className="text-muted-foreground text-sm">
                    {otherUser?.email}
                  </div>
                </div>
              </Breadcrumb>
            </header>
            <div className="flex w-full flex-1 flex-col gap-4 p-4 bg-[#f5f5f5]">
              <Messages conversationId={activeConversation.id} />
            </div>
            <ChatInput
              conversationId={activeConversation.id}
              receiverId={otherUser?.id || ""}
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a conversation or start a new one
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
