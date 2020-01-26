import { IUniversity, University, IPhoto } from "@models";
import {
  ResourceNotFoundError,
  DatabaseError,
  ResourceAlreadyExistsError
} from "@errors";

export interface IUniversityPhoto {
  UniversityId: String;
  photo: IPhoto | null;
  photoId: String;
}

export interface IPhotoData {
  _id?: String;
  photo: IPhoto | null;
}

export interface IUniversityDao {
  getOne: (value: string) => Promise<IUniversity | null>;
  getAll: () => Promise<IUniversity[]>;
  add: (University: IUniversity) => Promise<IUniversity>;
  update: (University: IUniversity, id: string) => Promise<void>;
  delete: (id: string) => Promise<void>;
  // photos
  addPhoto: (UniversityPhoto: IUniversityPhoto) => Promise<IPhotoData | null>;
  deletePhoto: (UniversityPhoto: IUniversityPhoto) => Promise<void>;
}

export class UniversityDao implements IUniversityDao {
  //Add Photo
  public async addPhoto(
    universityPhoto: IUniversityPhoto
  ): Promise<IPhotoData | null> {
    try {
      const university = await University.findById(
        universityPhoto.UniversityId
      );
      if (university != null) {
        university.photos.push({ photo: universityPhoto.photo });
        const result = await university.save();
        const photo = result.photos[university.photos.length - 1];
        return photo;
      }
      throw new ResourceNotFoundError("Could not find University");
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        throw new ResourceNotFoundError(err.message);
      }
      throw new DatabaseError(err);
    }
  }

  //delete Photo
  public async deletePhoto(universityPhoto: IUniversityPhoto): Promise<void> {
    try {
      const photo = await University.update(
        {
          _id: universityPhoto.UniversityId
        },
        { $pull: { photos: { _id: universityPhoto.photoId } } }
      );
      if (photo.n == 0) {
        throw new ResourceNotFoundError("Could not find University");
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
  public async getOne(value: string): Promise<IUniversity | null> {
    try {
      const university = await University.findOne({ _id: value });
      return university;
    } catch (err) {
      throw new ResourceNotFoundError(err);
    }
  }
  public async getAll(): Promise<IUniversity[]> {
    try {
      const universities = await University.find();
      return universities;
    } catch (err) {
      throw new ResourceNotFoundError(err);
    }
  }
  public async add(university: IUniversity): Promise<IUniversity> {
    try {
      const newUniversity = new University({
        title: university.title,
        description: university.description,
        abuse: university.abuse,
        active: university.active,
        userId: university.userId,
        categoryId: university.categoryId,
        photos: university.photos
      });
      const result = await newUniversity.save();
      return result;
    } catch (err) {
      if (err instanceof ResourceAlreadyExistsError) {
        throw new ResourceAlreadyExistsError(err.message);
      }
      throw new DatabaseError(err);
    }
  }
  public async update(university: IUniversity, id: string): Promise<void> {
    try {
      let updateUniversity = await University.findById(id);

      if (updateUniversity) {
        if (university.title) {
          updateUniversity.title = university.title;
        }
        if (university.description) {
          updateUniversity.description = university.description;
        }
        if (university.abuse) {
          updateUniversity.abuse = university.abuse;
        }
        if (university.categoryId) {
          updateUniversity.categoryId = university.categoryId;
        }
        if (university.active) {
          updateUniversity.active = university.active;
        }
        await updateUniversity.save();
      } else {
        throw new ResourceNotFoundError("University not found");
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
      let deleteUniversity = await University.findByIdAndDelete(id);
      if (!deleteUniversity) {
        throw new ResourceNotFoundError(
          "Could not delete University, University not found"
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
