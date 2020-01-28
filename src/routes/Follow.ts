import { Request, Response, Router } from "express";
import { BAD_REQUEST, CREATED, OK } from "http-status-codes";
import { ParamsDictionary } from "express-serve-static-core";
import { FollowDao } from "@daos";
import { paramMissingError, logger, adminMW } from "@shared";

const router = Router();
const followDao = new FollowDao();

/******************************************************************************
 *                      Get followings - "GET /api/following/:userId"
 ******************************************************************************/

router.get(
  "/following/:userId",
  adminMW,
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params as ParamsDictionary;
      if (!userId) {
        return res.status(BAD_REQUEST).json({
          error: paramMissingError
        });
      }
      const followings = await followDao.getFollowings(userId);
      return res.status(OK).json({ followings });
    } catch (err) {
      logger.error(err.message, err);
      return res.status(BAD_REQUEST).json({
        error: err.message
      });
    }
  }
);

/******************************************************************************
 *                      Get followers - "GET /api/follower/:userId"
 ******************************************************************************/

router.get(
  "/follower/:userId",
  adminMW,
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params as ParamsDictionary;
      if (!userId) {
        return res.status(BAD_REQUEST).json({
          error: paramMissingError
        });
      }
      const followers = await followDao.getFollowers(userId);
      return res.status(OK).json({ followers });
    } catch (err) {
      logger.error(err.message, err);
      return res.status(BAD_REQUEST).json({
        error: err.message
      });
    }
  }
);

/******************************************************************************
 *                      Get followers - "GET /api/follower/:userId"
 ******************************************************************************/

router.post("/", adminMW, async (req: Request, res: Response) => {
  try {
    const { follow } = req.body;
    if (!follow) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    const result = await followDao.addFollow(follow.followId, follow.leaderId);
    return res.status(OK).json({ result });
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});
export default router;
