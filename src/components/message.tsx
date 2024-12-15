import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

interface MessageProps {
  content: string;
  timestamp: string;
  sender: {
    id: string;
    name: string;
    image?: string | null;
  };
  isCurrentUser: boolean;
}

export function Message({
  content,
  timestamp,
  sender,
  isCurrentUser,
}: MessageProps) {
  return (
    <div
      className={cn(
        "flex w-full gap-4",
        isCurrentUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className="h-8 w-8 min-w-8 min-h-8 flex items-center justify-center rounded-lg bg-zinc-200">
        <AvatarImage src={sender.image || ""} alt={sender.name} />
        <AvatarFallback>{sender.name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "flex flex-col gap-2",
          isCurrentUser ? "items-end" : "items-start"
        )}
      >
        <div className="text-sm text-muted-foreground">
          {sender.name} • {timestamp}
        </div>
        <div
          className={cn(
            "rounded-lg px-4 py-3 max-w-[80%]",
            isCurrentUser
              ? "bg-blue-500 text-white ml-auto"
              : "bg-[#E6F0FF] text-foreground"
          )}
        >
          {content}
        </div>
      </div>
    </div>
  );
}
