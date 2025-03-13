"use client";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import queryMessages from "@/features/chat/api/queryMessages";
import useUserStore from "@/store/user";
import { useRouter } from "next/navigation";
import ChatBubble from "./_components/ChatBubble";
import { Input } from "@/components/ui/input";
import { Send, Upload } from "lucide-react";
import type { Message } from "@prisma/client";

export default function ChatCommunityPage() {
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const { communityId } = useParams();
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [messagesState, setMessagesState] = useState<Message[]>([]);

  const { data } = useQuery({
    queryKey: ["messages", communityId],
    queryFn: () => queryMessages(communityId as string),
  });

  useEffect(() => {
    if (data) setMessagesState(data);
  }, [data]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    // TODO: make it in /chat and
    socketRef.current = io("http://localhost:3001");

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Connected to chat server");
      socket.emit("joinRoom", communityId);
    });

    socket.on("receiveMessage", (newMessage: Message) => {
      setMessagesState((prev) => [...prev, newMessage]);
    });

    // FIX: the socket sometimes stays connected
    return () => {
      socket.disconnect();
    };
  }, [communityId, router, user]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !user || !socketRef.current) return;

    // FIX: make the user sends photos
    socketRef.current.emit("sendMessage", {
      room: communityId,
      sender: user.id,
      content: messageInput,
    });

    setMessageInput("");
  };

  if (!user) return null;

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="p-4 border-b">
        <div>TODO: FOR COMMUNITY DETAILS</div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messagesState?.map((message) => (
          <ChatBubble
            senderId={message.senderId}
            message={message.content}
            createdAt={message.createdAt}
            key={message.id}
            isMe={message.senderId === user.id}
            userName={user.user_name}
          />
        ))}
      </div>

      {/* Input Area */}
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
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 py-5 rounded-xl border-2 focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Type your message here..."
          />

          <button
            onClick={handleSendMessage}
            className="p-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors text-white"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
