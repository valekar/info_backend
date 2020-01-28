import { IFollow, Follow } from "@models";
import { ResourceNotFoundError, DatabaseError } from "@errors";

export interface IFollowDao {
  getFollowings: (userId: String) => Promise<IFollow[] | null>;
  getFollowers: (userId: String) => Promise<IFollow[] | null>;
  addFollow: (followId: String, leaderId: String) => Promise<IFollow | null>;
}

export class FollowDao implements IFollowDao {
  public async addFollow(
    followId: String,
    leaderId: String
  ): Promise<IFollow | null> {
    try {
      const existingFollow = await Follow.findOne({
        followId: followId,
        leaderId: leaderId
      });

      if (!existingFollow) {
        const follow = new Follow({
          followId: followId,
          leaderId: leaderId
        });
        const result = await follow.save();
        return result;
      }
      return existingFollow;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
  public async getFollowings(userId: String): Promise<IFollow[] | null> {
    try {
      const followings = await Follow.find({ followId: userId }).populate(
        "leaderId",
        "email firstName lastName" // need only these fields
      );
      return followings;
    } catch (err) {
      throw new ResourceNotFoundError(err);
    }
  }
  public async getFollowers(userId: String): Promise<IFollow[] | null> {
    try {
      const followers = await Follow.find({ leaderId: userId }).populate(
        "followId",
        "email firstName lastName" // need only these fields
      );
      return followers;
    } catch (err) {
      throw new ResourceNotFoundError(err);
    }
  }
}
