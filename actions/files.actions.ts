import fs from 'node:fs'
import { v4 as uuid } from 'uuid';

export async function upload(files: FileList) {
  try {
    const urls: string[] = [];
    if (files) {
      for (const file of files) {
        const fileExt = file.name.slice(file.name.lastIndexOf('.'))
        const fileName = uuid() + fileExt
        const filePath = `./public/uploads/${fileName}`;
        const fileBytes = await file.arrayBuffer();
        fs.writeFileSync(filePath, Buffer.from(fileBytes));
        const url = `http://localhost:3000/uploads/${fileName}`;
        urls.push(url);
      }
    }
    return urls
  } catch (error) {
    return { error }
  }
}
