import { GraphQLID, GraphQLString } from "graphql";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

import { createJWTToken } from "../util/auth.js";
import { CommentType, PostType } from "./types.js";

export const register = {
  type: GraphQLString,
  description: "Register a new user and returns a token",
  args: {
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    displayName: { type: GraphQLString },
  },
  async resolve(_, args) {
    const { username, email, password, displayName } = args;

    const user = new User({
      username,
      email,
      password,
      displayName,
    });

    user.save();

    const token = createJWTToken({
      _id: user._id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
    });

    console.log(token);

    return token;
  },
};

export const login = {
  type: GraphQLString,
  description: "Login a user and retruns a token",
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve(_, args) {
    const user = await User.findOne({ email: args.email }).select("+password");

    if (!user || args.password !== user.password)
      throw new Error("Invalid credentials");

    const token = createJWTToken({
      _id: user._id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
    });

    return token;
  },
};

export const createPost = {
  type: PostType,
  description: "Create a new post",
  args: {
    title: { type: GraphQLString },
    body: { type: GraphQLString },
  },
  async resolve(_, args, { verifiedUser }) {
    console.log(verifiedUser);
    const { title, body } = args;

    const newPost = new Post({
      title,
      body,
      authorId: verifiedUser._id,
    });

    await newPost.save();

    return newPost;
  },
};

export const updatePost = {
  type: PostType,
  description: "Update a post",
  args: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
  },
  resolve: async (_, { id, title, body }, { verifiedUser }) => {
    if (!verifiedUser) throw new Error("Unauthorized");

    const updatedPost = await Post.findOneAndUpdate(
      { _id: id, authorId: verifiedUser._id },
      {
        title,
        body,
      },
      { new: true, runValidators: true }
    );

    return updatedPost;
  },
};

export const deletePost = {
  type: GraphQLString,
  description: "Delete a post",
  args: {
    postId: { type: GraphQLID },
  },
  resolve: async (_, { postId }, { verifiedUser }) => {
    if (!verifiedUser) throw new Error("Unauthorized");

    const postDeleted = await Post.findOneAndDelete({
      _id: postId,
      authorId: verifiedUser._id,
    });
    if (!postDeleted) throw new Error("Post not found");

    return "Post deleted";
  },
};

export const addComment = {
  type: CommentType,
  description: "Add a comment to a post",
  args: {
    comment: { type: GraphQLString },
    postId: { type: GraphQLID },
  },
  resolve: async (_, { comment, postId }, { verifiedUser }) => {
    const newComment = new Comment({
      comment,
      postId,
      userId: verifiedUser._id,
    });
    await newComment.save();
    console.log(newComment);
    return newComment;
  },
};

export const updateComment = {
  type: CommentType,
  description: "Update a comment",
  args: {
    id: { type: GraphQLID },
    comment: { type: GraphQLString },
  },
  resolve: async (_, { id, comment }, { verifiedUser }) => {
    if (!verifiedUser) throw new Error("Unauthorized");

    const commentUpdated = await Comment.findOneAndUpdate(
      {
        _id: id,
        userId: verifiedUser._id,
      },
      {
        comment,
      },
      { new: true, runValidators: true }
    );
    if (!commentUpdated) throw new Error("Comment not found");
    return commentUpdated;
  },
};

export const deleteComment = {
  type: GraphQLString,
  description: "Delete a comment",
  args: {
    commentId: { type: GraphQLID },
  },
  resolve: async (_, { commentId }, { verifiedUser }) => {
    if (!verifiedUser) throw new Error("Unauthorized");

    const commentDeleted = await Comment.findOneAndDelete({
      _id: commentId,
      userId: verifiedUser._id,
    });
    if (!commentDeleted) throw new Error("Comment not found");

    return "Comment deleted";
}}
