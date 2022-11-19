import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { users, user, posts, post, comments, comment } from "./queries.js";
import {
  register,
  login,
  createPost,
  updatePost,
  deletePost,
  addComment,
  updateComment,
  deleteComment,
} from "./mutations.js";

const QueryType = new GraphQLObjectType({
  name: "QueryType",
  description: "The root query type",
  fields: {
    users,
    user,
    posts,
    post,
    comments,
    comment,
  },
});

const MutationType = new GraphQLObjectType({
  name: "MutationType",
  description: "The root mutation type",
  fields: {
    register,
    login,
    createPost,
    updatePost,
    deletePost,
    addComment,
    updateComment,
    deleteComment,
  },
});

export default new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});
