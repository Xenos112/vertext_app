const parsePostContent = (text: string | undefined) => {
  if (!text) return null;
  const userTagRegex = /@\w+/g;
  const urlRegex = /(https|http)+:\/\/\S+/g;
  const tags = text.match(userTagRegex);
  if (!tags) return text;
  const replacedText = text.replace(userTagRegex, (tag) => {
    const username = tag.replace("@", "");
    return `<a style="text-decoration:underline" class='text-blue-500' href="/user/${username}">${tag}</a>`;
  });
  const urls = text.match(urlRegex);
  if (!urls) return replacedText;
  const replacedUrls = replacedText.replace(urlRegex, (url) => {
    return `<a style="text-decoration:underline" class='text-blue-500' href="${url}">${url}</a>`;
  });
  return replacedUrls;
};

export default parsePostContent;
