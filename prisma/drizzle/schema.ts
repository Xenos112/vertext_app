import { relations, sql } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const Role = pgEnum("Role", ["ADMIN", "MODERATOR", "USER"]);

export const NotificationType = pgEnum("NotificationType", [
  "PostLiked",
  "Followed",
  "Commented",
]);

export const User = pgTable("User", {
  id: text("id")
    .notNull()
    .primaryKey()
    .default(sql`uuid(4)`),
  user_name: text("user_name").notNull(),
  tag: text("tag")
    .notNull()
    .unique()
    .default(sql`cuid(1)`),
  email: text("email").unique(),
  password: text("password"),
  github_id: text("github_id").unique(),
  discord_id: text("discord_id").unique(),
  google_id: text("google_id").unique(),
  image_url: text("image_url"),
  banner_url: text("banner_url"),
  bio: text("bio"),
  premium: boolean("premium").notNull(),
  SubscriptionEndDate: timestamp("SubscriptionEndDate", { precision: 3 }),
  created_at: timestamp("created_at", { precision: 3 }).notNull().defaultNow(),
});

export const Post = pgTable(
  "Post",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .default(sql`uuid(4)`),
    content: text("content"),
    medias: text("medias").array().notNull(),
    likes_number: integer("likes_number").notNull(),
    saves_number: integer("saves_number").notNull(),
    share_number: integer("share_number").notNull(),
    comments_number: integer("comments_number").notNull(),
    userId: text("userId").notNull(),
    communityId: text("communityId"),
    created_at: timestamp("created_at", { precision: 3 })
      .notNull()
      .defaultNow(),
  },
  (Post) => ({
    Post_Author_fkey: foreignKey({
      name: "Post_Author_fkey",
      columns: [Post.userId],
      foreignColumns: [User.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
    Post_Community_fkey: foreignKey({
      name: "Post_Community_fkey",
      columns: [Post.communityId],
      foreignColumns: [Community.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  }),
);

export const Comment = pgTable(
  "Comment",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .default(sql`uuid(4)`),
    content: text("content"),
    userId: text("userId").notNull(),
    postId: text("postId").notNull(),
    medias: text("medias").array().notNull(),
    created_at: timestamp("created_at", { precision: 3 })
      .notNull()
      .defaultNow(),
  },
  (Comment) => ({
    Comment_Author_fkey: foreignKey({
      name: "Comment_Author_fkey",
      columns: [Comment.userId],
      foreignColumns: [User.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
    Comment_Post_fkey: foreignKey({
      name: "Comment_Post_fkey",
      columns: [Comment.postId],
      foreignColumns: [Post.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  }),
);

export const Like = pgTable(
  "Like",
  {
    postId: text("postId").notNull(),
    userId: text("userId").notNull(),
  },
  (Like) => ({
    Like_Post_fkey: foreignKey({
      name: "Like_Post_fkey",
      columns: [Like.postId],
      foreignColumns: [Post.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
    Like_User_fkey: foreignKey({
      name: "Like_User_fkey",
      columns: [Like.userId],
      foreignColumns: [User.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
    Like_cpk: primaryKey({
      name: "Like_cpk",
      columns: [Like.postId, Like.userId],
    }),
  }),
);

export const Save = pgTable(
  "Save",
  {
    postId: text("postId").notNull(),
    userId: text("userId").notNull(),
  },
  (Save) => ({
    Save_Post_fkey: foreignKey({
      name: "Save_Post_fkey",
      columns: [Save.postId],
      foreignColumns: [Post.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
    Save_User_fkey: foreignKey({
      name: "Save_User_fkey",
      columns: [Save.userId],
      foreignColumns: [User.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
    Save_cpk: primaryKey({
      name: "Save_cpk",
      columns: [Save.postId, Save.userId],
    }),
  }),
);

export const Community = pgTable("Community", {
  id: text("id")
    .notNull()
    .primaryKey()
    .default(sql`uuid(4)`),
  name: text("name").notNull(),
  image: text("image"),
  banner: text("banner"),
  bio: text("bio"),
  created_at: timestamp("created_at", { precision: 3 }).notNull().defaultNow(),
});

export const Membership = pgTable(
  "Membership",
  {
    role: Role("role").notNull().default("USER"),
    userId: text("userId").notNull(),
    communityId: text("communityId").notNull(),
  },
  (Membership) => ({
    Membership_User_fkey: foreignKey({
      name: "Membership_User_fkey",
      columns: [Membership.userId],
      foreignColumns: [User.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
    Membership_Community_fkey: foreignKey({
      name: "Membership_Community_fkey",
      columns: [Membership.communityId],
      foreignColumns: [Community.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
    Membership_cpk: primaryKey({
      name: "Membership_cpk",
      columns: [Membership.userId, Membership.communityId],
    }),
  }),
);

export const Follow = pgTable(
  "Follow",
  {
    followerId: text("followerId").notNull(),
    followingId: text("followingId").notNull(),
    createdAt: timestamp("createdAt", { precision: 3 }).notNull().defaultNow(),
  },
  (Follow) => ({
    Follow_follower_fkey: foreignKey({
      name: "Follow_follower_fkey",
      columns: [Follow.followerId],
      foreignColumns: [User.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
    Follow_following_fkey: foreignKey({
      name: "Follow_following_fkey",
      columns: [Follow.followingId],
      foreignColumns: [User.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
    Follow_cpk: primaryKey({
      name: "Follow_cpk",
      columns: [Follow.followerId, Follow.followingId],
    }),
  }),
);

export const Message = pgTable(
  "Message",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .default(sql`uuid(4)`),
    content: text("content").notNull(),
    senderId: text("senderId").notNull(),
    communityId: text("communityId").notNull(),
  },
  (Message) => ({
    Message_Sender_fkey: foreignKey({
      name: "Message_Sender_fkey",
      columns: [Message.senderId],
      foreignColumns: [User.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
    Message_Community_fkey: foreignKey({
      name: "Message_Community_fkey",
      columns: [Message.communityId],
      foreignColumns: [Community.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  }),
);

export const Notification = pgTable(
  "Notification",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .default(sql`uuid(4)`),
    content: text("content").notNull(),
    type: NotificationType("type").notNull(),
    senderId: text("senderId").notNull(),
    reciverId: text("reciverId").notNull(),
  },
  (Notification) => ({
    Notification_sender_fkey: foreignKey({
      name: "Notification_sender_fkey",
      columns: [Notification.senderId],
      foreignColumns: [User.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
    Notification_reciver_fkey: foreignKey({
      name: "Notification_reciver_fkey",
      columns: [Notification.reciverId],
      foreignColumns: [User.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  }),
);

export const ResetPassword = pgTable(
  "ResetPassword",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .default(sql`uuid(4)`),
    expires_at: timestamp("expires_at", { precision: 3 })
      .notNull()
      .defaultNow(),
    created_at: timestamp("created_at", { precision: 3 })
      .notNull()
      .defaultNow(),
    userId: text("userId").notNull(),
  },
  (ResetPassword) => ({
    ResetPassword_User_fkey: foreignKey({
      name: "ResetPassword_User_fkey",
      columns: [ResetPassword.userId],
      foreignColumns: [User.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  }),
);

export const UserRelations = relations(User, ({ many }) => ({
  Post: many(Post, {
    relationName: "PostToUser",
  }),
  Comment: many(Comment, {
    relationName: "CommentToUser",
  }),
  Like: many(Like, {
    relationName: "LikeToUser",
  }),
  Save: many(Save, {
    relationName: "SaveToUser",
  }),
  Membership: many(Membership, {
    relationName: "MembershipToUser",
  }),
  followers: many(Follow, {
    relationName: "following",
  }),
  following: many(Follow, {
    relationName: "follower",
  }),
  Message: many(Message, {
    relationName: "MessageToUser",
  }),
  NotificationSent: many(Notification, {
    relationName: "sent",
  }),
  NotificationRecieved: many(Notification, {
    relationName: "recived",
  }),
  ResetPassword: many(ResetPassword, {
    relationName: "ResetPasswordToUser",
  }),
}));

export const PostRelations = relations(Post, ({ one, many }) => ({
  Author: one(User, {
    relationName: "PostToUser",
    fields: [Post.userId],
    references: [User.id],
  }),
  Comment: many(Comment, {
    relationName: "CommentToPost",
  }),
  Community: one(Community, {
    relationName: "CommunityToPost",
    fields: [Post.communityId],
    references: [Community.id],
  }),
  Like: many(Like, {
    relationName: "LikeToPost",
  }),
  Save: many(Save, {
    relationName: "PostToSave",
  }),
}));

export const CommentRelations = relations(Comment, ({ one }) => ({
  Author: one(User, {
    relationName: "CommentToUser",
    fields: [Comment.userId],
    references: [User.id],
  }),
  Post: one(Post, {
    relationName: "CommentToPost",
    fields: [Comment.postId],
    references: [Post.id],
  }),
}));

export const LikeRelations = relations(Like, ({ one }) => ({
  Post: one(Post, {
    relationName: "LikeToPost",
    fields: [Like.postId],
    references: [Post.id],
  }),
  User: one(User, {
    relationName: "LikeToUser",
    fields: [Like.userId],
    references: [User.id],
  }),
}));

export const SaveRelations = relations(Save, ({ one }) => ({
  Post: one(Post, {
    relationName: "PostToSave",
    fields: [Save.postId],
    references: [Post.id],
  }),
  User: one(User, {
    relationName: "SaveToUser",
    fields: [Save.userId],
    references: [User.id],
  }),
}));

export const CommunityRelations = relations(Community, ({ many }) => ({
  Post: many(Post, {
    relationName: "CommunityToPost",
  }),
  Membership: many(Membership, {
    relationName: "CommunityToMembership",
  }),
  Message: many(Message, {
    relationName: "CommunityToMessage",
  }),
}));

export const MembershipRelations = relations(Membership, ({ one }) => ({
  User: one(User, {
    relationName: "MembershipToUser",
    fields: [Membership.userId],
    references: [User.id],
  }),
  Community: one(Community, {
    relationName: "CommunityToMembership",
    fields: [Membership.communityId],
    references: [Community.id],
  }),
}));

export const FollowRelations = relations(Follow, ({ one }) => ({
  follower: one(User, {
    relationName: "follower",
    fields: [Follow.followerId],
    references: [User.id],
  }),
  following: one(User, {
    relationName: "following",
    fields: [Follow.followingId],
    references: [User.id],
  }),
}));

export const MessageRelations = relations(Message, ({ one }) => ({
  Sender: one(User, {
    relationName: "MessageToUser",
    fields: [Message.senderId],
    references: [User.id],
  }),
  Community: one(Community, {
    relationName: "CommunityToMessage",
    fields: [Message.communityId],
    references: [Community.id],
  }),
}));

export const NotificationRelations = relations(Notification, ({ one }) => ({
  sender: one(User, {
    relationName: "sent",
    fields: [Notification.senderId],
    references: [User.id],
  }),
  reciver: one(User, {
    relationName: "recived",
    fields: [Notification.reciverId],
    references: [User.id],
  }),
}));

export const ResetPasswordRelations = relations(ResetPassword, ({ one }) => ({
  User: one(User, {
    relationName: "ResetPasswordToUser",
    fields: [ResetPassword.userId],
    references: [User.id],
  }),
}));

