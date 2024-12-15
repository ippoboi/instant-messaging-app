"use client";

import { useChat } from "@/hooks/use-chat";
import { Button } from "./ui/button";
import { MessageSquare } from "lucide-react";
import { useRef } from "react";

interface ChatInputProps {
  conversationId: string;
  receiverId: string;
}

export function ChatInput({ conversationId, receiverId }: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { sendMessage } = useChat(conversationId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputRef.current?.value.trim()) return;

    sendMessage(inputRef.current.value, receiverId);
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
