import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils"; // Assuming you have utility classNames helper
import { formatUserNameForImage } from "@/utils/format-user_name-for-image";
import { isImage } from "@/constants";
import Video from "@/components/shared/Video";

type ChatBubbleProps = {
  senderId: string;
  message: string;
  createdAt: Date;
  isMe: boolean;
  userName: string;
  media: string[] | null;
};

export default function ChatBubble({
  createdAt,
  message,
  senderId,
  isMe = false,
  userName,
  media,
}: ChatBubbleProps) {
  const className =
    media?.length === 1
      ? "grid-cols-1 grid-rows-1"
      : media?.length === 2
        ? "grid-cols-2 grid-rows-1"
        : media?.length === 3
          ? "grid-cols-1 grid-rows-3"
          : media?.length === 4
            ? "grid-cols-2 grid-rows-2"
            : "grid-cols-3 grid-rows-2";
  return (
    <div
      className={cn("flex w-full mt-4", isMe ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "flex flex-col items-start gap-3 max-w-[80%]",
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
          {message && (
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
          )}
          {media?.length ? (
            <div
              className={`${className} grid max-w-[80%] rounded-xl overflow-hidden items-center justify-center`}
            >
              {media.map((m) => (
                <div key={m}>
                  {isImage.test(m) ? (
                    <img src={m || undefined} />
                  ) : (
                    <>
                      {/* @ts-expect-error idk why */}
                      <Video src={m} type="mp4" autoPlay controls />
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : null}
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
