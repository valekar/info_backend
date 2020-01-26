import { ICourse, Course, IComment, IPhoto, IUser } from "@models";
import {
  ResourceNotFoundError,
  DatabaseError,
  ResourceAlreadyExistsError
} from "@errors";

export interface ICourseComment {
  courseId: String;
  commentId: String;
  comment: IComment | null;
}

export interface ICourseFaculty {
  courseId: String;
  facultyId: String;
  faculty: IUser | null;
}

export interface ICoursePhoto {
  courseId: String;
  photo: IPhoto | null;
  photoId: String;
}

export interface ICommentData {
  _id?: String;
  comment: IComment | null;
}

export interface IPhotoData {
  _id?: String;
  photo: IPhoto | null;
}

export interface IFacultyData {
  _id?: String;
  faculty: IUser | null;
}

export interface ICourseDao {
  getOne: (value: string) => Promise<ICourse | null>;
  getAll: () => Promise<ICourse[]>;
  add: (course: ICourse) => Promise<ICourse>;
  update: (course: ICourse, id: string) => Promise<void>;
  delete: (id: string) => Promise<void>;
  // comments
  updateComment: (courseComment: ICourseComment) => Promise<void>;
  addComment: (courseComment: ICourseComment) => Promise<ICommentData | null>;
  deleteComment: (courseComment: ICourseComment) => Promise<void>;
  // photos
  addPhoto: (coursePhoto: ICoursePhoto) => Promise<IPhotoData | null>;
  deletePhoto: (coursePhoto: ICoursePhoto) => Promise<void>;
  // faculties
  addFaculty: (courseFaculty: ICourseFaculty) => Promise<IFacultyData | null>;
  updateFaculty: (courseFaculty: ICourseFaculty) => Promise<void>;
  deleteFaculty: (courseFaculty: ICourseFaculty) => Promise<void>;
}

export class CourseDao implements ICourseDao {
  // add faculty
  public async addFaculty(
    courseFaculty: ICourseFaculty
  ): Promise<IFacultyData | null> {
    try {
      const course = await Course.findById(courseFaculty.courseId);
      if (course != null) {
        course.faculties.push({ faculty: courseFaculty.faculty });
        const result = await course.save();
        const faculty = result.faculties[course.faculties.length - 1];
        return faculty;
      }
      throw new ResourceNotFoundError("Could not find Course");
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        throw new ResourceNotFoundError(err.message);
      }
      throw new DatabaseError(err);
    }
  }

  // update Faculty
  public async updateFaculty(courseFaculty: ICourseFaculty): Promise<void> {
    try {
      const course = await Course.update(
        { "faculties._id": courseFaculty.facultyId },
        { $set: { "faculties.$.faculty": courseFaculty.faculty } },
        { upsert: true }
      );
      if (course != null) {
        return course;
      }
      throw new ResourceNotFoundError("Could not find Course");
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        throw new ResourceNotFoundError(err.message);
      }
      throw new DatabaseError(err);
    }
  }

  // delete Faculty
  public async deleteFaculty(courseFaculty: ICourseFaculty): Promise<void> {
    try {
      const faculty = await Course.update(
        {
          _id: courseFaculty.courseId
        },
        { $pull: { faculties: { _id: courseFaculty.facultyId } } }
      );
      if (faculty.n == 0) {
        throw new ResourceNotFoundError("Could not find Course");
      }
      if (faculty.nModified == 0) {
        throw new ResourceNotFoundError("Could not find faculty");
      }
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        throw new ResourceNotFoundError(err.message);
      }
      throw new DatabaseError(err);
    }
  }

  // Update Comment
  public async updateComment(courseComment: ICourseComment): Promise<void> {
    try {
      const course = await Course.update(
        { "comments._id": courseComment.commentId },
        { $set: { "comments.$.comment": courseComment.comment } },
        { upsert: true }
      );
      if (course != null) {
        return course;
      }
      throw new ResourceNotFoundError("Could not find Course");
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        throw new ResourceNotFoundError(err.message);
      }
      throw new DatabaseError(err);
    }
  }

  // Add Comment
  public async addComment(
    courseComment: ICourseComment
  ): Promise<ICommentData | null> {
    try {
      const course = await Course.findById(courseComment.courseId);
      if (course != null) {
        course.comments.push({ comment: courseComment.comment });
        const result = await course.save();
        const comment = result.comments[course.comments.length - 1];
        return comment;
      }
      throw new ResourceNotFoundError("Could not find Course");
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        throw new ResourceNotFoundError(err.message);
      }
      throw new DatabaseError(err);
    }
  }

  //Delete Comment
  public async deleteComment(courseComment: ICourseComment): Promise<void> {
    try {
      const comment = await Course.update(
        {
          _id: courseComment.courseId
        },
        { $pull: { comments: { _id: courseComment.commentId } } }
      );
      if (comment.n == 0) {
        throw new ResourceNotFoundError("Could not find Course");
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
  public async addPhoto(coursePhoto: ICoursePhoto): Promise<IPhotoData | null> {
    try {
      const course = await Course.findById(coursePhoto.courseId);
      if (course != null) {
        course.photos.push({ photo: coursePhoto.photo });
        const result = await course.save();
        const photo = result.photos[course.photos.length - 1];
        return photo;
      }
      throw new ResourceNotFoundError("Could not find Course");
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        throw new ResourceNotFoundError(err.message);
      }
      throw new DatabaseError(err);
    }
  }

  //delete Photo
  public async deletePhoto(coursePhoto: ICoursePhoto): Promise<void> {
    try {
      const photo = await Course.update(
        {
          _id: coursePhoto.courseId
        },
        { $pull: { photos: { _id: coursePhoto.photoId } } }
      );
      if (photo.n == 0) {
        throw new ResourceNotFoundError("Could not find Course");
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
  public async getOne(value: string): Promise<ICourse | null> {
    try {
      const course = await Course.findOne({ _id: value });
      return course;
    } catch (err) {
      throw new ResourceNotFoundError(err);
    }
  }
  public async getAll(): Promise<ICourse[]> {
    try {
      const courses = await Course.find();
      return courses;
    } catch (err) {
      throw new ResourceNotFoundError(err);
    }
  }
  public async add(course: ICourse): Promise<ICourse> {
    try {
      const newCourse = new Course({
        title: course.title,
        description: course.description,
        abuse: course.abuse,
        active: course.active,
        userId: course.userId,
        categoryId: course.categoryId,
        photos: course.photos,
        comments: course.comments,
        faculties: course.faculties
      });
      const result = await newCourse.save();
      return result;
    } catch (err) {
      if (err instanceof ResourceAlreadyExistsError) {
        throw new ResourceAlreadyExistsError(err.message);
      }
      throw new DatabaseError(err);
    }
  }
  public async update(course: ICourse, id: string): Promise<void> {
    try {
      let updateCourse = await Course.findById(id);

      if (updateCourse) {
        if (course.title) {
          updateCourse.title = course.title;
        }
        if (course.description) {
          updateCourse.description = course.description;
        }
        if (course.abuse) {
          updateCourse.abuse = course.abuse;
        }
        if (course.categoryId) {
          updateCourse.categoryId = course.categoryId;
        }
        if (course.active) {
          updateCourse.active = course.active;
        }
        await updateCourse.save();
      } else {
        throw new ResourceNotFoundError("Course not found");
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
      let deleteCourse = await Course.findByIdAndDelete(id);
      if (!deleteCourse) {
        throw new ResourceNotFoundError(
          "Could not delete Course, Course not found"
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
