import { INewsFeed, NewsFeed } from "@models";
import { DatabaseError, ResourceNotFoundError } from "@errors";

export interface INewsFeedData {
  userId: String;
  postId?: String;
  queryId?: String;
  active?: Boolean;
  abuse?: Number;
}

export interface INewsFeedDao {
  addNewsFeed: (newsFeedData: INewsFeedData) => Promise<void>;
  editNewsFeed: (
    newsFeedData: INewsFeedData,
    newsFeedId: String
  ) => Promise<INewsFeed | null>;
  deleteNewsFeed: (id: String) => Promise<void>;
  getNewsFeedByUserId: (userId: String) => Promise<INewsFeed[] | null>;
}

export class NewsFeedDao implements INewsFeedDao {
  public async getNewsFeedByUserId(
    userId: String
  ): Promise<INewsFeed[] | null> {
    try {
      const feeds = await NewsFeed.find({ userId: userId });
      return feeds;
    } catch (err) {
      throw new DatabaseError("Could not fetch news feeds");
    }
  }

  public async addNewsFeed(newsFeedData: INewsFeedData): Promise<void> {
    try {
      const newsFeed = new NewsFeed({
        userId: newsFeedData.userId,
        postId: newsFeedData.postId,
        queryId: newsFeedData.queryId,
        abuse: newsFeedData.abuse,
        active: newsFeedData.active
      });
      await newsFeed.save();
    } catch (err) {
      throw new DatabaseError(err.message());
    }
  }

  public async editNewsFeed(
    newsFeedData: INewsFeedData,
    newsFeedId: String
  ): Promise<INewsFeed | null> {
    try {
      const existingFeed = await NewsFeed.findById(newsFeedId);
      if (existingFeed) {
        if (newsFeedData.userId) {
          existingFeed.userId = newsFeedData.userId;
        }
        if (newsFeedData.postId) {
          existingFeed.postId = newsFeedData.postId;
        }
        if (newsFeedData.queryId) {
          existingFeed.queryId = newsFeedData.queryId;
        }
        if (newsFeedData.abuse) {
          existingFeed.abuse = newsFeedData.abuse;
        }
        if (newsFeedData.active) {
          existingFeed.active = newsFeedData.active;
        }

        const result = await existingFeed.save();
        return result;
      } else {
        throw new ResourceNotFoundError("could not find News Feed");
      }
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        throw new ResourceNotFoundError(err.message);
      }
      throw new DatabaseError(err.message);
    }
  }

  public async deleteNewsFeed(id: String): Promise<void> {
    try {
      const deleteFeed = await NewsFeed.findByIdAndDelete(id);
      if (!deleteFeed) {
        throw new ResourceNotFoundError(
          "Could not delete News Feed, News Feed not found"
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
