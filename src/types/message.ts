export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  conversationId: string;
  createdAt: Date;
  read: boolean;
}
