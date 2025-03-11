"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import queryMessages from "@/features/chat/api/queryMessages";
import useUserStore from "@/store/user";
import { useRouter } from "next/navigation";
import ChatBubble from "./_components/ChatBubble";
import { Input } from "@/components/ui/input";
import { Send, Upload } from "lucide-react";

export default function ChatCommunityPage() {
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  if (!user) router.push("/login");

  const { communityId } = useParams();
  const { data: messages } = useQuery({
    queryKey: ["messages", communityId],
    queryFn: () => queryMessages(communityId as string),
  });

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="p-4 border-b">
        <div>TODO: FOR COMMUNITY DETAILS</div>
      </div>

      {/* Messages Area - This will scroll */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages?.map((message) => (
          <ChatBubble
            senderId={message.senderId}
            message={message.content}
            createdAt={message.createdAt}
            key={message.id}
            isMe={message.senderId === user!.id}
            userName={user!.user_name}
          />
        ))}
      </div>

      {/* Input Area - Stays at bottom naturally */}
      <div className="p-4 border-t bg-background/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex gap-2 items-center">
          <button className="p-3 rounded-xl border hover:bg-accent transition-colors text-primary/60 hover:text-primary/80">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={(e) => console.log(e.target.files)}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="h-5 w-5" />
            </label>
          </button>

          <Input
            className="flex-1 py-5 rounded-xl border-2 focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Type your message here..."
          />

          <button className="p-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors text-white">
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
