import { type } from "arktype";

const CreateCommentValidator = type({
  "content?": "string.trim",
  "medias?": "string.url[]",
}).narrow((data, ctx) => {
  console.log(data);
  if (data.content || (data.medias && data.medias.length > 0)) return true;
  return ctx.reject({
    message: "Comment Must have content or at least one media",
    expected: "content or medias",
  });
});

type CreateCommentValidatorType = typeof CreateCommentValidator.infer;

export { CreateCommentValidator, type CreateCommentValidatorType };
