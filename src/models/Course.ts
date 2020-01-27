import mongoose, { Document } from "mongoose";
import { IBase } from "./Base";
import { IComment } from "./Comment";
import { ObjectId } from "mongodb";
import { IPhoto } from "./Photo";
import { IUser } from "@models";
const Schema = mongoose.Schema;

export interface ICourse extends Document, IBase {
  title: string;
  description: string;
  categoryId: string;
  faculties: [
    {
      _id?: string;
      faculty: IUser | null;
    }
  ];
  comments: [
    {
      _id?: String;
      comment: IComment | null;
    }
  ];
  photos: [
    {
      _id?: String;
      photo: IPhoto | null;
    }
  ];
  userId: String;
}

const courseSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  categoryId: ObjectId,
  comments: [
    {
      comment: {
        type: Object
      }
    }
  ],
  faculties: [
    {
      faculty: {
        type: Object
      }
    }
  ],
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

export const Course = mongoose.model<ICourse>("Course", courseSchema);
