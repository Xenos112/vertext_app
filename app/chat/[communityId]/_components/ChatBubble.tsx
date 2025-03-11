import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils"; // Assuming you have utility classNames helper
import { formatUserNameForImage } from "@/utils/format-user_name-for-image";

type ChatBubbleProps = {
  senderId: string;
  message: string;
  createdAt: Date;
  isMe: boolean;
  userName: string;
};

export default function ChatBubble({
  createdAt,
  message,
  senderId,
  isMe = false,
  userName,
}: ChatBubbleProps) {
  return (
    <div
      className={cn("flex w-full mt-4", isMe ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "flex items-start gap-3 max-w-[80%]",
          isMe ? "flex-row-reverse" : "flex-row",
        )}
      >
        <Avatar>
          <AvatarImage src={formatUserNameForImage(senderId)} />
          <AvatarFallback>{formatUserNameForImage(userName)}</AvatarFallback>
        </Avatar>
        <div
          className={cn(
            "flex flex-col space-y-1",
            isMe ? "items-end" : "items-start",
          )}
        >
          <div
            className={cn(
              "p-3 rounded-2xl text-sm",
              isMe
                ? "bg-blue-500 text-white rounded-br-none"
                : "bg-gray-100 text-gray-900 rounded-bl-none",
            )}
          >
            <p className="break-words">{message}</p>
          </div>

          <span className="text-xs text-gray-500">
            {new Date(createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
