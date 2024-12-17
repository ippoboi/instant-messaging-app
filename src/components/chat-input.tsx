"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquare } from "lucide-react";
import { useRef } from "react";
import { Button } from "./ui/button";
import { getSession } from "next-auth/react";

interface ChatInputProps {
  conversationId: string;
  receiverId: string;
}

async function postMessage({
  content,
  receiverId,
  conversationId,
}: {
  content: string;
  receiverId: string;
  conversationId: string;
}) {
  const response = await fetch("/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, receiverId, conversationId }),
  });

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}

export function ChatInput({ conversationId, receiverId }: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: postMessage,
    onMutate: async (newMessage) => {
      await queryClient.cancelQueries({
        queryKey: ["messages", conversationId],
      });
      const previousMessages = queryClient.getQueryData([
        "messages",
        conversationId,
      ]);

      // Get current user session
      const session = await getSession();
      if (!session?.user) throw new Error("No session");

      const optimisticMessage = {
        id: Date.now().toString(),
        content: newMessage.content,
        createdAt: new Date().toISOString(),
        senderId: session.user.id,
        receiverId: receiverId,
        conversationId: conversationId,
        sender: {
          id: session.user.id,
          name: session.user.name,
          image: session.user.image,
        },
      };

      queryClient.setQueryData(["messages", conversationId], (old: any) => [
        ...(old || []),
        optimisticMessage,
      ]);

      return { previousMessages };
    },
    onError: (err, newMessage, context) => {
      // If the mutation fails, use the context we saved to roll back
      queryClient.setQueryData(
        ["messages", conversationId],
        context?.previousMessages
      );
    },
    onSuccess: (newMessage) => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputRef.current?.value.trim()) return;

    mutate({
      content: inputRef.current.value,
      receiverId,
      conversationId,
    });
    inputRef.current.value = "";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky bottom-0 flex shrink-0 items-center gap-2 border-t bg-background p-4"
    >
      <input
        ref={inputRef}
        className="flex-1 rounded-md border border-input px-3 py-2"
        placeholder="Type a message..."
      />
      <Button type="submit">
        <MessageSquare />
      </Button>
    </form>
  );
}
