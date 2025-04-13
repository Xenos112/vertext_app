import { useState } from "react";
import ky from "ky";
import sendToastEvent from "@/utils/sendToastEvent";

export function useUpload() {
  const [url, setUrl] = useState("");
  const mediaSchema =
    /.*\.(mp4|webm|ogg|mp3|wav|flac|aac|jpg|jpeg|png|gif|webp|avif|svg)$/i;

  async function upload(file: File) {
    const isMedia = mediaSchema.test(file.name);
    if (!isMedia) {
      sendToastEvent({
        title: "Error",
        description: "Only media files are allowed",
        variant: "destructive",
      });
    }
    const formData = new FormData();
    formData.append("file", file);
    const response = await ky.post<{ url: string }>(
      "http://localhost:8080/upload",
      {
        body: formData,
        throwHttpErrors: false,
      },
    );

    sendToastEvent({
      title: "Uploading...",
      description: "Uploading file...",
    });

    const data = await response.json();
    if (!data || !data.url) {
      sendToastEvent({
        variant: "destructive",
        title: "Upload Error",
        description: "Failed to upload file",
      });
    } else {
      sendToastEvent({
        title: "Upload Success",
        description: "File uploaded successfully",
      });
      setUrl(data.url);
    }
    return url;
  }

  return { url, upload, setUrl };
}
