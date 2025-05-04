import { QUALITY } from "../constants";

self.onmessage = async (event: MessageEvent) => {
  const { id, file } = event.data;

  try {
    const bitmap = await createImageBitmap(file);

    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get canvas context");

    ctx.drawImage(bitmap, 0, 0);

    const blob = await canvas.convertToBlob({
      type: "image/webp",
      quality: QUALITY,
    });

    const webpFile = new File([blob], file.name.replace(/\.\w+$/, ".webp"), {
      type: "image/webp",
      lastModified: Date.now(),
    });

    self.postMessage({ id, file: webpFile });
  } catch (error) {
    self.postMessage({ id, error: (error as Error).message });
  }
};
