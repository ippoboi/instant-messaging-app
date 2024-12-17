import { Message } from "@/types/message";
import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";

export function useChat(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket>();

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch(
          `/api/messages?conversationId=${conversationId}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };

    loadMessages();

    if (!socketRef.current) {
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
    }

    if (socketRef.current) {
      socketRef.current.emit("join-chat", conversationId);
    }

    const handleNewMessage = (message: Message) => {
      console.log("New message received:", message);
      if (message.conversationId === conversationId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    if (socketRef.current) {
      socketRef.current.on("new-message", handleNewMessage);
      socketRef.current.on("message-sent", handleNewMessage);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("new-message", handleNewMessage);
        socketRef.current.off("message-sent", handleNewMessage);
        socketRef.current.emit("leave-chat", conversationId);
      }
    };
  }, [conversationId]);

  const sendMessage = async (content: string, receiverId: string) => {
    if (!socketRef.current) return;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, receiverId, conversationId }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const message = await response.json();

      setMessages((prev) => [...prev, message]);

      socketRef.current.emit("send-message", message);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return { messages, sendMessage, isConnected };
}
