import { Message } from "@/types/message";
import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";

export function useChat(receiverId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const socketRef = useRef<Socket>();

  useEffect(() => {
    const socket = io({
      path: "/api/socket",
      addTrailingSlash: false,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socket.on("new-message", (message: Message) => {
      if (
        message.senderId === receiverId ||
        message.receiverId === receiverId
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    // Load existing messages
    const loadMessages = async () => {
      if (!conversationId) return;

      const response = await fetch(
        `/api/messages?conversationId=${conversationId}`
      );
      const data = await response.json();
      setMessages(data);
    };

    if (conversationId) {
      loadMessages();
    }

    return () => {
      socket.disconnect();
    };
  }, [receiverId, conversationId]);

  const sendMessage = async (content: string) => {
    if (!socketRef.current) return;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          receiverId,
        }),
      });

      const message = await response.json();
      socketRef.current.emit("send-message", message);
      setConversationId(message.conversationId);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return {
    messages,
    sendMessage,
    isConnected,
  };
}
