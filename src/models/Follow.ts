import mongoose, { Document } from "mongoose";
import { IBase } from "./Base";
const Schema = mongoose.Schema;

export interface IFollow extends Document, IBase {
  followId: String;
  leaderId: String;
}

const followSchema = new Schema({
  followId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  leaderId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
});

export const Follow = mongoose.model<IFollow>("Follow", followSchema);
