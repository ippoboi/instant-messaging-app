export interface Message {
  id: string;
  content: string;
  createdAt: Date;
  senderId: string;
  receiverId: string;
  conversationId: string;
  sender: {
    id: string;
    name: string | null;
    image: string | null;
  };
}
