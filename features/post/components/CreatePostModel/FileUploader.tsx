import { Upload } from "lucide-react";
import { use, useRef, useState } from "react";
import { CreatePostContext } from ".";

interface FileStatus {
  name: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
}

export default function FileUploader() {
  const ref = useRef<HTMLInputElement>(null);
  const [, setPost] = use(CreatePostContext);
  const [fileStatus, setFileStatus] = useState<FileStatus[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const newFiles = Array.from(event.target.files);

    // Update state with new files
    setFileStatus((prevStatuses) => [
      ...prevStatuses,
      ...newFiles.map((file) => ({
        name: file.name,
        progress: 0,
        status: "pending" as const,
      })),
    ]);

    uploadFiles(newFiles);
  };

  const uploadFiles = (files: File[]) => {
    setIsUploading(true);

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file)); // Append all files

    const xhr = new XMLHttpRequest();
    xhr.open("post", "http://localhost:8080/uploads", true);

    xhr.upload.onprogress = (event) => {
      if (event.total) {
        const percent = Math.round((event.loaded * 100) / event.total);
        setFileStatus((prevStatuses) =>
          prevStatuses.map((fileStatus) =>
            files.some((f) => f.name === fileStatus.name)
              ? { ...fileStatus, progress: percent, status: "uploading" }
              : fileStatus,
          ),
        );
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        const uploadedUrls: string[] = response.map(
          (entry: { url: string }) => entry.url,
        );
        setPost((prevPost) => ({
          ...prevPost,
          urls: [...(prevPost.urls || []), ...uploadedUrls],
        }));
        setFileStatus((prevStatuses) =>
          prevStatuses.map((fileStatus) =>
            files.some((f) => f.name === fileStatus.name)
              ? { ...fileStatus, progress: 100, status: "completed" }
              : fileStatus,
          ),
        );
      } else {
        setFileStatus((prevStatuses) =>
          prevStatuses.map((fileStatus) =>
            files.some((f) => f.name === fileStatus.name)
              ? { ...fileStatus, status: "error" }
              : fileStatus,
          ),
        );
      }
      setIsUploading(false);
    };

    xhr.onerror = () => {
      setFileStatus((prevStatuses) =>
        prevStatuses.map((fileStatus) =>
          files.some((f) => f.name === fileStatus.name)
            ? { ...fileStatus, status: "error" }
            : fileStatus,
        ),
      );
      setIsUploading(false);
    };

    xhr.send(formData);
  };

  return (
    <div>
      <button onClick={() => ref.current?.click()} disabled={isUploading}>
        <Upload size={20} />
      </button>
      <input
        ref={ref}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {fileStatus.length > 0 && (
        <div className="mt-4">
          {fileStatus.map(({ name, progress, status }) => (
            <div key={name} className="mb-2">
              <p>
                {name} - {status}
              </p>
              <progress value={progress} max="100" className="w-full" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
