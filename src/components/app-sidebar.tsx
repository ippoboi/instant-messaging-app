"use client";

import { MessageCircleIcon, MessageSquare } from "lucide-react";
import { usePathname } from "next/navigation";
import * as React from "react";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import { Button } from "./ui/button";
import { UserSearch } from "@/components/user-search";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  lastMessageAt: Date;
  participants: Array<{
    id: string;
    name: string;
    image: string | null;
  }>;
  messages: Array<{
    content: string;
    createdAt: Date;
  }>;
}

interface AppSidebarProps {
  activeConversationId?: string;
}

export function AppSidebar({ activeConversationId }: AppSidebarProps) {
  const pathname = usePathname();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const response = await fetch("/api/conversations");
        if (!response.ok) throw new Error("Failed to load conversations");
        const data = await response.json();
        setConversations(data);
      } catch (error) {
        console.error("Failed to load conversations:", error);
      }
    };

    loadConversations();
  }, []);

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
      data-active-conversation={activeConversationId}
    >
      {/* First sidebar */}
      <Sidebar
        collapsible="none"
        className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r bg-[#F5F5F6]"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="#">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Image
                      src="/icons/logo.svg"
                      alt="Logo"
                      width={40}
                      height={40}
                      className="bg-blue-500 p-2 rounded-md"
                    />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Fluent</span>
                    <span className="truncate text-xs">Messaging</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {[{ title: "Messages", url: "/", icon: MessageCircleIcon }].map(
                  (item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        tooltip={{
                          children: item.title,
                          hidden: false,
                        }}
                        isActive={pathname === item.url}
                        className={`px-2.5 md:px-2 ${
                          pathname === item.url ? "bg-white" : ""
                        }`}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>

      {/* Second sidebar */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex bg-white">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-base font-medium text-foreground">
              Messages
            </div>
            <Button variant="outline" size="icon">
              <MessageSquare />
            </Button>
          </div>
          <UserSearch />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-2">
            <SidebarGroupContent className="space-y-2">
              {conversations.map((conversation) => {
                const otherUser = conversation.participants[0];
                const lastMessage = conversation.messages[0];

                return (
                  <Link
                    key={conversation.id}
                    href={`/?conversation=${conversation.id}`}
                    className={cn(
                      "flex items-start p-3 rounded-lg gap-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      activeConversationId === conversation.id &&
                        "bg-sidebar-accent"
                    )}
                  >
                    <div className="flex gap-2">
                      <Avatar className="w-8 h-8 min-w-8 min-h-8 flex items-center justify-center bg-zinc-200 rounded-lg">
                        <AvatarImage
                          src={otherUser?.image || ""}
                          alt={otherUser?.name}
                        />
                        <AvatarFallback>
                          {otherUser?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-1">
                        <span>{otherUser?.name}</span>
                        {lastMessage && (
                          <span className="line-clamp-2 text-xs max-w-[200px] text-muted-foreground">
                            {lastMessage.content}
                          </span>
                        )}
                      </div>
                    </div>
                    {lastMessage && (
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(lastMessage.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    )}
                  </Link>
                );
              })}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
}
