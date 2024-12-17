"use client";

import { useChat } from "@/hooks/use-chat";
import { Message } from "./message";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

interface MessagesProps {
  conversationId: string;
}

export function Messages({ conversationId }: MessagesProps) {
  const { data: session } = useSession();
  const { messages } = useChat(conversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div className="text-center text-muted-foreground">No messages yet</div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-180px)] overflow-y-auto">
      {messages.map((message) => (
        <Message
          key={message.id}
          content={message.content}
          timestamp={new Date(message.createdAt).toLocaleTimeString()}
          sender={{
            id: message.senderId,
            name: message.sender.name || "",
            image: message.sender.image,
          }}
          isCurrentUser={message.senderId === session?.user?.id}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
