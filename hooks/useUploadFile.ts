import { useState } from "react";
import ky from "ky";

export default function useUploadFile() {
  const [url, setUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      const response = await ky.post<{ url: string }>(
        "http://localhost:8080/upload",
        {
          body: formData,
        },
      );

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setUrl(data.url);
      document.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            title: "Upload Successful",
            description: "File uploaded successfully",
          },
        }),
      );
      return data.url;
    } catch (error) {
      console.error(error);
      document.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            variant: "destructive",
            title: "Upload Error",
            description: "Failed to upload file",
          },
        }),
      );
    } finally {
      setIsUploading(false);
    }
  };

  return { url, uploadFile, isUploading };
}
