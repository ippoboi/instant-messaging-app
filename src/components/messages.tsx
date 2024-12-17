"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { Message } from "./message";

interface MessagesProps {
  conversationId: string;
}

async function getMessagesByConversation(conversationId: string) {
  const response = await fetch(
    `/api/messages?conversationId=${conversationId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }
  return response.json();
}

export function Messages({ conversationId }: MessagesProps) {
  const { data: session } = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    data: messages,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => getMessagesByConversation(conversationId),
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  if (!messages || messages.length === 0) {
    return (
      <div className="text-center text-muted-foreground">No messages yet</div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-180px)] overflow-y-auto">
      {messages.map((message: any) => (
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
