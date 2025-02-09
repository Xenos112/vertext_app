const parsePostContent = (text: string | undefined) => {
  if (!text) return null;
  const userTagRegex = /@\w+/g;
  const urlRegex = /(?:https?:\/\/)?(?:www\.)?([\w-]+\.[a-z]{2,6}\S*)/gi;
  const tags = text.match(userTagRegex);
  if (!tags) return text;
  const replacedText = text.replace(userTagRegex, (tag) => {
    const username = tag.replace("@", "");
    return `<a style="color:blue;text-decoration:underline" href="/user/${username}">${tag}</a>`;
  });
  const urls = text.match(urlRegex);
  if (!urls) return replacedText;
  const replacedUrls = replacedText.replace(urlRegex, (url) => {
    return `<a style="color:blue;text-decoration:underline" href="${url}">${url}</a>`;
  });
  return replacedUrls;
};

export default parsePostContent;
