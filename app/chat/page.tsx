import { Button } from "@/components/ui/button";
import { GoArrowLeft } from "react-icons/go";

export default function ChatPage() {
  return (
    <div className="flex items-center justify-center w-full flex-col gap-4 h-full">
      <h1 className="text-4xl font-bold">Please select a community</h1>
      <p>Select a community to chat with</p>
      <Button>
        <GoArrowLeft />
        Return
      </Button>
    </div>
  );
}
