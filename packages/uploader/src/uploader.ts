import ky from "ky";
import { imageRegex, videoRegex } from "./constants";
import type {
  CDNReturnData,
  SendOneOptions,
  SendOptions,
  UploadFileMetadata,
} from "./types";
import { v4 as uuid } from "uuid";

// FIX: there is a bug that if i put the cdn variable in a entry it will resolve it as undefined
class Uploader {
  private files = new Map<string, UploadFileMetadata>();

  async uploadToClient(file: File) {
    const id = uuid();

    const localUrl = URL.createObjectURL(file);
    const isImage = imageRegex.test(file.name);
    const isVideo = videoRegex.test(file.name);

    const type = isImage ? "image" : isVideo ? "video" : "unknown";

    const metadata: UploadFileMetadata = {
      id,
      name: localUrl,
      type,
      file,
      uploaded: false,
    };

    this.files.set(id, metadata);
    console.log(this.files);

    return this.files.get(id);
  }

  async sendOne(id: string, opts?: SendOneOptions) {
    const file = this.files.get(id);
    console.log(this.files);
    let error = "";
    const formData = new FormData();

    if (!file?.file) {
      error = "File not found";
      if (opts?.onError) opts.onError(new Error(error));
      return;
    }

    formData.append("file", file.file);
    const response = await ky.post<CDNReturnData>(
      `${process.env.NEXT_PUBLIC_CDN_BASE_URL}/upload`,
      {
        body: formData,
        timeout: 10000, // 10 seconds
      },
    );

    if (response.status !== 200) {
      error = "Failed to Upload File";
      if (opts?.onError) opts.onError(new Error(error));
      return;
    }

    const data = await response.json();
    this.files.set(id, {
      ...file,
      uploaded: true,
    });

    if (opts?.callback) {
      opts.callback(data);
    }
    return { data, error };
  }

  async send(opts?: SendOptions) {
    const filesFormData = new FormData();
    for (const [, file] of this.files) {
      if (file.uploaded) continue;
      if (!file) continue;
      filesFormData.append("files", file.file);
    }

    const response = await ky.post<CDNReturnData[]>(
      `${process.env.NEXT_PUBLIC_CDN_BASE_URL}/uploads`,
      {
        body: filesFormData,
        timeout: opts?.timeout || 10000,
      },
    );

    if (response.status !== 200) {
      if (opts?.onError) opts.onError(new Error("CDN returned an error"));
      return;
    }

    const data = await response.json();

    this.files.clear();

    if (opts?.callback) {
      opts.callback(data);
    }

    return data;
  }

  remove(id: string) {
    this.files.delete(id);
  }

  get(id: string) {
    return this.files.get(id);
  }
}

export { Uploader };
