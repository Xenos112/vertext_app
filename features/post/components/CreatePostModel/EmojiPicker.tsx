import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { CreatePostContext } from ".";
import { use, useState } from "react";
import { Laugh } from "lucide-react";

export default function EmojiPicker() {
  const [, setPost] = use(CreatePostContext);
  const [isPickerShown, setIsPickerShown] = useState(false);

  const addEmoji = (emoji: { native: string }) => {
    setPost((prev) => ({
      ...prev,
      content: (prev.content || "") + emoji.native,
    }));
    setIsPickerShown(false);
  };

  return (
    <div>
      <Laugh size={20} onClick={() => setIsPickerShown(!isPickerShown)} />
      {isPickerShown && <Picker data={data} onEmojiSelect={addEmoji} />}
    </div>
  );
}
