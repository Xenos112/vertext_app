export type UploadFileMetadata = {
  id: string;
  name: string;
  file: File;
  type: "image" | "video" | "unknown";
  uploaded: boolean;
};

export type CDNReturnData = {
  fileName: string;
  url: string;
};

export type SendOptions = {
  callback?: (data: CDNReturnData[]) => void;
  onError?: (error: Error) => void;
  uploadDistination?: string;
  timeout?: number;
};

export type SendOneOptions = SendOptions & {
  callback?: (data: CDNReturnData) => void;
};

export type UploaderOptions = {
  onError?: (error: Error) => void;
  onSuccess?: (data: CDNReturnData[]) => void;
};
