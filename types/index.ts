export type CreatePost = {
  content?: string;
  files?: FileList;
  communityId: string | null;
};
