import { useState } from "react";
import ky from "ky";

export function useUpload() {
  const [url, setUrl] = useState("");

  async function upload(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await ky.post<{ url: string }>(
      "http://localhost:8080/upload",
      {
        body: formData,
        throwHttpErrors: false,
      },
    );

    document.dispatchEvent(
      new CustomEvent("toast", {
        detail: {
          title: "Uploading...",
          description: "Uploading file...",
        },
      }),
    );

    const data = await response.json();
    if (!data || !data.url) {
      document.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            variant: "destructive",
            title: "Upload Error",
            description: "Failed to upload file",
          },
        }),
      );
    } else {
      document.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            title: "Upload Success",
            description: "File uploaded successfully",
          },
        }),
      );
      console.log(data);
      setUrl(data.url);
    }
    return url;
  }

  return { url, upload, setUrl };
}
