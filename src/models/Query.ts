import mongoose, { Document } from "mongoose";
import { IBase } from "./Base";
import { ObjectId } from "mongodb";
import { IComment } from "./Comment";
import { IPhoto } from "./Photo";

const Schema = mongoose.Schema;

export interface IAnswer {
  answer: String;
  answererId: String;
  comments: [
    {
      _id?: string;
      comment: IComment | null;
    }
  ];
}

export interface IQuery extends Document, IBase {
  question: string;
  answers: [
    {
      _id?: string;
      answer: IAnswer | null;
    }
  ];
  questionerId: String;
  comments: [
    {
      _id?: string;
      comment: IComment | null;
    }
  ];
  photos: [
    {
      _id?: string;
      photo: IPhoto | null;
    }
  ];
  categoryId: String;
}

const querySchema = new Schema({
  question: {
    type: String,
    required: true
  },
  answers: [
    {
      answer: {
        type: Object
      }
    }
  ],
  questionerId: {
    type: ObjectId,
    required: true
  },
  comments: [
    {
      comment: {
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
  categoryId: ObjectId,

  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
});

export const Query = mongoose.model<IQuery>("Query", querySchema);
