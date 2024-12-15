"use client";

import { MessageCircleIcon, MessageSquare } from "lucide-react";
import { usePathname } from "next/navigation";
import * as React from "react";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import { Button } from "./ui/button";

// This is sample data
const data = {
  navMain: [
    {
      title: "Messages",
      url: "/",
      icon: MessageCircleIcon,
    },
  ],
  messages: [
    {
      avatar: "/avatars/shadcn.jpg",
      name: "William Smith",
      date: "30m",
      teaser:
        "Hi team, just a reminder about our meeting tomorrow at 10 AM.\nPlease come prepared with your project updates.",
    },
    {
      avatar: "/avatars/shadcn.jpg",
      name: "Alice Smith",
      date: "1d",
      teaser:
        "Thanks for the update. The progress looks great so far.\nLet's schedule a call to discuss the next steps.",
    },
    {
      avatar: "/avatars/shadcn.jpg",
      name: "Bob Johnson",
      date: "2d",
      teaser:
        "Hey everyone! I'm thinking of organizing a team outing this weekend.\nWould you be interested in a hiking trip or a beach day?",
    },
    {
      avatar: "/avatars/shadcn.jpg",
      name: "Emily Davis",
      date: "2d",
      teaser:
        "I've reviewed the budget numbers you sent over.\nCan we set up a quick call to discuss some potential adjustments?",
    },
    {
      avatar: "/avatars/shadcn.jpg",
      name: "Michael Wilson",
      date: "1w",
      teaser:
        "Please join us for an all-hands meeting this Friday at 3 PM.\nWe have some exciting news to share about the company's future.",
    },
    {
      avatar: "/avatars/shadcn.jpg",
      name: "Sarah Brown",
      date: "1w",
      teaser:
        "Thank you for sending over the proposal. I've reviewed it and have some thoughts.\nCould we schedule a meeting to discuss my feedback in detail?",
    },
    {
      avatar: "/avatars/shadcn.jpg",
      name: "David Lee",
      date: "1w",
      teaser:
        "I've been brainstorming and came up with an interesting project concept.\nDo you have time this week to discuss its potential impact and feasibility?",
    },
    {
      avatar: "/avatars/shadcn.jpg",
      name: "Olivia Wilson",
      date: "1w",
      teaser:
        "Just a heads up that I'll be taking a two-week vacation next month.\nI'll make sure all my projects are up to date before I leave.",
    },
    {
      avatar: "/avatars/shadcn.jpg",
      name: "James Martin",
      date: "1w",
      teaser:
        "I've completed the registration for the upcoming tech conference.\nLet me know if you need any additional information from my end.",
    },
    {
      avatar: "/avatars/shadcn.jpg",
      name: "Sophia White",
      date: "1w",
      teaser:
        "To celebrate our recent project success, I'd like to organize a team dinner.\nAre you available next Friday evening? Please let me know your preferences.",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
      {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
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
                {data.navMain.map((item) => (
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
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>

      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex bg-white">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-base font-medium text-foreground">
              {data.navMain.find((item) => item.url === pathname)?.title ||
                "Messages"}
            </div>
            <Button variant="outline" size="icon">
              <MessageSquare />
            </Button>
          </div>
          <SidebarInput placeholder="Type to search..." />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-2">
            <SidebarGroupContent className="space-y-2">
              {data.messages.map((message) => (
                <a
                  href="#"
                  key={message.name}
                  className="flex items-start p-3 rounded-lg gap-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <div className="flex gap-2">
                    <Avatar className="w-8 h-8 min-w-8 min-h-8 flex items-center justify-center bg-zinc-200 rounded-lg">
                      <AvatarImage src={message.avatar} alt={message.name} />
                      <AvatarFallback>{message.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                      <span>{message.name}</span>
                      <span className="line-clamp-2 text-xs max-w-[200px] text-muted-foreground">
                        {message.teaser}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {message.date}
                  </span>
                </a>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
}
