import { type } from "arktype";

// FIX: narrow is not working as expected
const CREATE_POST_VALIDATOR = type({
  "content?": "string.trim",
  "medias?": "string.url[]",
}).narrow((data, ctx) => {
  if (
    (data.content && data.content.length > 0) ||
    (data.medias && data.medias.length > 0)
  )
    return true;
  return ctx.reject({
    message: "Post must have content or at least one url",
    expected: "content",
    path: ["medias"],
    actual: "",
    // expected: "urls",
  });
});

type PostCreateData = type.infer<typeof CREATE_POST_VALIDATOR>;

const PostValidators = {
  CREATE_POST_VALIDATOR,
};

export default PostValidators;

export type { PostCreateData };
