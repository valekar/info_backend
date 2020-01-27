import { IQuery, Query, IComment, IPhoto, IAnswer } from "@models";
import {
  ResourceNotFoundError,
  DatabaseError,
  ResourceAlreadyExistsError
} from "@errors";
import { ICommentData, IPhotoData } from "@daos";

export interface IQueryComment {
  queryId: String;
  commentId: String;
  comment: IComment | null;
}

export interface IQueryAnswer {
  queryId: String;
  answerId: String;
  answer: IAnswer | null;
}

export interface IQueryPhoto {
  queryId: String;
  photo: IPhoto | null;
  photoId: String;
}

export interface IAnswerData {
  _id?: String;
  answer: IAnswer | null;
}

export interface IQueryDao {
  getOne: (value: string) => Promise<IQuery | null>;
  getAll: () => Promise<IQuery[]>;
  add: (query: IQuery) => Promise<IQuery>;
  update: (query: IQuery, id: string) => Promise<void>;
  delete: (id: string) => Promise<void>;
  // comments
  updateComment: (queryComment: IQueryComment) => Promise<void>;
  addComment: (queryComment: IQueryComment) => Promise<ICommentData | null>;
  deleteComment: (queryComment: IQueryComment) => Promise<void>;
  // photos
  addPhoto: (queryPhoto: IQueryPhoto) => Promise<IPhotoData | null>;
  deletePhoto: (queryPhoto: IQueryPhoto) => Promise<void>;
  // answers
  addAnswer: (queryAnswer: IQueryAnswer) => Promise<IAnswerData | null>;
  updateAnswer: (queryAnswer: IQueryAnswer) => Promise<void>;
  deleteAnswer: (queryAnswer: IQueryAnswer) => Promise<void>;
}

export class QueryDao implements IQueryDao {
  // add Answer
  public async addAnswer(
    queryAnswer: IQueryAnswer
  ): Promise<IAnswerData | null> {
    try {
      const query = await Query.findById(queryAnswer.queryId);
      if (query != null) {
        query.answers.push({ answer: queryAnswer.answer });
        const result = await query.save();
        const answer = result.answers[query.answers.length - 1];
        return answer;
      }
      throw new ResourceNotFoundError("Could not find Query");
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        throw new ResourceNotFoundError(err.message);
      }
      throw new DatabaseError(err);
    }
  }

  // update Answer
  public async updateAnswer(queryAnswer: IQueryAnswer): Promise<void> {
    try {
      const query = await Query.update(
        { "answers._id": queryAnswer.answerId },
        { $set: { "answers.$.answer": queryAnswer.answer } },
        { upsert: true }
      );
      if (query != null) {
        return query;
      }
      throw new ResourceNotFoundError("Could not find Query");
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        throw new ResourceNotFoundError(err.message);
      }
      throw new DatabaseError(err);
    }
  }

  // delete Answer
  public async deleteAnswer(queryAnswer: IQueryAnswer): Promise<void> {
    try {
      const answer = await Query.update(
        {
          _id: queryAnswer.queryId
        },
        { $pull: { answers: { _id: queryAnswer.answerId } } }
      );
      if (answer.n == 0) {
        throw new ResourceNotFoundError("Could not find Query");
      }
      if (answer.nModified == 0) {
        throw new ResourceNotFoundError("Could not find Answer");
      }
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        throw new ResourceNotFoundError(err.message);
      }
      throw new DatabaseError(err);
    }
  }

  // Update Comment
  public async updateComment(queryComment: IQueryComment): Promise<void> {
    try {
      const query = await Query.update(
        { "comments._id": queryComment.commentId },
        { $set: { "comments.$.comment": queryComment.comment } },
        { upsert: true }
      );
      if (query != null) {
        return query;
      }
      throw new ResourceNotFoundError("Could not find Query");
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        throw new ResourceNotFoundError(err.message);
      }
      throw new DatabaseError(err);
    }
  }

  // Add Comment
  public async addComment(
    queryComment: IQueryComment
  ): Promise<ICommentData | null> {
    try {
      const query = await Query.findById(queryComment.queryId);
      if (query != null) {
        query.comments.push({ comment: queryComment.comment });
        const result = await query.save();
        const comment = result.comments[query.comments.length - 1];
        return comment;
      }
      throw new ResourceNotFoundError("Could not find Query");
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        throw new ResourceNotFoundError(err.message);
      }
      throw new DatabaseError(err);
    }
  }

  //Delete Comment
  public async deleteComment(queryComment: IQueryComment): Promise<void> {
    try {
      const comment = await Query.update(
        {
          _id: queryComment.queryId
        },
        { $pull: { comments: { _id: queryComment.commentId } } }
      );
      if (comment.n == 0) {
        throw new ResourceNotFoundError("Could not find Query");
      }
      if (comment.nModified == 0) {
        throw new ResourceNotFoundError("Could not find comment");
      }
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        throw new ResourceNotFoundError(err.message);
      }
      throw new DatabaseError(err);
    }
  }

  //Add Photo
  public async addPhoto(queryPhoto: IQueryPhoto): Promise<IPhotoData | null> {
    try {
      const query = await Query.findById(queryPhoto.queryId);
      if (query != null) {
        query.photos.push({ photo: queryPhoto.photo });
        const result = await query.save();
        const photo = result.photos[query.photos.length - 1];
        return photo;
      }
      throw new ResourceNotFoundError("Could not find Query");
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        throw new ResourceNotFoundError(err.message);
      }
      throw new DatabaseError(err);
    }
  }

  //delete Photo
  public async deletePhoto(queryPhoto: IQueryPhoto): Promise<void> {
    try {
      const photo = await Query.update(
        {
          _id: queryPhoto.queryId
        },
        { $pull: { photos: { _id: queryPhoto.photoId } } }
      );
      if (photo.n == 0) {
        throw new ResourceNotFoundError("Could not find Query");
      }
      if (photo.nModified == 0) {
        throw new ResourceNotFoundError("Could not find photo");
      }
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        throw new ResourceNotFoundError(err.message);
      }
      throw new DatabaseError(err);
    }
  }

  //
  public async getOne(value: string): Promise<IQuery | null> {
    try {
      const query = await Query.findOne({ _id: value });
      return query;
    } catch (err) {
      throw new ResourceNotFoundError(err);
    }
  }
  public async getAll(): Promise<IQuery[]> {
    try {
      const Querys = await Query.find();
      return Querys;
    } catch (err) {
      throw new ResourceNotFoundError(err);
    }
  }
  public async add(query: IQuery): Promise<IQuery> {
    try {
      const newQuery = new Query({
        question: query.question,
        answers: query.answers,
        abuse: query.abuse,
        active: query.active,
        questionerId: query.questionerId,
        categoryId: query.categoryId,
        photos: query.photos,
        comments: query.comments
      });
      const result = await newQuery.save();
      return result;
    } catch (err) {
      if (err instanceof ResourceAlreadyExistsError) {
        throw new ResourceAlreadyExistsError(err.message);
      }
      throw new DatabaseError(err);
    }
  }
  public async update(query: IQuery, id: string): Promise<void> {
    try {
      let updateQuery = await Query.findById(id);

      if (updateQuery) {
        if (query.question) {
          updateQuery.question = query.question;
        }
        if (query.questionerId) {
          updateQuery.questionerId = query.questionerId;
        }
        if (query.abuse) {
          updateQuery.abuse = query.abuse;
        }
        if (query.categoryId) {
          updateQuery.categoryId = query.categoryId;
        }
        if (query.active) {
          updateQuery.active = query.active;
        }
        await updateQuery.save();
      } else {
        throw new ResourceNotFoundError("Query not found");
      }
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        throw new ResourceNotFoundError(err.message);
      }
      throw new DatabaseError(err);
    }
  }
  public async delete(id: string): Promise<void> {
    try {
      let deleteQuery = await Query.findByIdAndDelete(id);
      if (!deleteQuery) {
        throw new ResourceNotFoundError(
          "Could not delete Query, Query not found"
        );
      }
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        throw new ResourceNotFoundError(err.message);
      }
      throw new DatabaseError(err);
    }
  }
}
