import mongoose, { Document } from "mongoose";
import { IBase } from "./Base";

const Schema = mongoose.Schema;

export interface INewsFeed extends Document, IBase {
  userId: String;
  postId: String;
  queryId: String;
}

const newsFeedSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    refer: "User",
    required: true
  },

  postId: {
    type: Schema.Types.ObjectId,
    refer: "Post"
  },

  queryId: {
    type: Schema.Types.ObjectId,
    refer: "Query"
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  },
  abuse: {
    type: Number
  },
  active: {
    type: Boolean,
    required: true,
    default: true
  }
});

export const NewsFeed = mongoose.model<INewsFeed>("NewsFeed", newsFeedSchema);
