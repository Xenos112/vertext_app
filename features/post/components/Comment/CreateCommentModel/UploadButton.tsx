import { use, useRef } from "react";
import { NewCommentContext } from ".";
import { FaUpload } from "react-icons/fa6";
import { useUpload } from "@/hooks/useUpload";

export default function UploadButton() {
  const { comment, setComment } = use(NewCommentContext);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const { upload } = useUpload();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedMedias: string[] = [];
    if (!e.target.files) return;
    for (let i = 0; i < e.target.files!.length!; i++) {
      const newUrl = await upload(e.target.files![i]);
      uploadedMedias.push(newUrl);
    }
    setComment({ ...comment, medias: uploadedMedias });
  };

  return (
    <div className="mr-auto">
      <FaUpload
        onClick={() => uploadInputRef.current?.click()}
        title="upload images or videos"
      />
      <input
        ref={uploadInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />
    </div>
  );
}
