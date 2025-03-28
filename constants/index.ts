export const ERRORS = {
  NOT_AUTHENTICATED: "you must be logged in",
  POST_NOT_FOUND: "Post Not Found",
};

export const isImage = /\.*(.png|.jpg|.jpeg|.webp)/i;

export const STATUS_CODES = {
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  CREATED: 201,
  SUCCESS: 200,
  SERVER_ISSUE: 500,
} as const;

export const IMAGE_PLACEHOLDER =
  "https://signfix.com.au/wp-content/uploads/2017/09/placeholder-600x400.png";
