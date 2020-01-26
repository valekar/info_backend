import mongoose, { Document } from "mongoose";
import { IBase } from "./Base";
import { ObjectId } from "mongodb";
import { IPhoto } from "./Photo";
const Schema = mongoose.Schema;

export interface IUniversity extends Document, IBase {
  title: string;
  description: number;
  categoryId: string;
  photos: [
    {
      _id?: String;
      photo: IPhoto | null;
    }
  ];
  userId: String;
}

const universitySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: Number,
    required: true
  },
  categoryId: ObjectId,
  photos: [
    {
      photo: {
        type: Object
      }
    }
  ],
  userId: ObjectId,

  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
});

export const University = mongoose.model<IUniversity>(
  "University",
  universitySchema
);
