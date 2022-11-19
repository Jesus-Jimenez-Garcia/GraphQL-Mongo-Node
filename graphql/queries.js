import { GraphQLID, GraphQLList } from "graphql";
import { CommentType, PostType, UserType } from "./types.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

export const users = {
  type: new GraphQLList(UserType),

  resolve: async () => {
    return await User.find();
  },
};

export const user = {
  type: UserType,
  description: "Get a user by id",
  args: {
    id: { type: GraphQLID },
  },
  resolve: async (_, args) => {
    return await User.findById(args.id);
  },
};

export const posts = {
  type: new GraphQLList(PostType),
  description: "Get all posts",
  resolve: () => Post.find(),
};

export const post = {
  type: PostType,
  description: "Get a post by id",
  args: {
    id: { type: GraphQLID },
  },
  resolve: (_, { id }) => Post.findById(id),
};

export const comments = {
  type: new GraphQLList(CommentType),
  description: "Get all comments",
  resolve: () => Comment.find(),
};

export const comment = {
  type: CommentType,
  description: "Get a comment by id",
  args: {
    id: {type: GraphQLID}
  },
  resolve: (_, args) => Comment.findById(args.id),
};
