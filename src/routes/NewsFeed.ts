import { Request, Response, Router } from "express";
import { BAD_REQUEST, CREATED, OK } from "http-status-codes";
import { ParamsDictionary } from "express-serve-static-core";
import { NewsFeedDao } from "@daos";
import { paramMissingError, logger, adminMW } from "@shared";

const router = Router();
const newsFeedDao = new NewsFeedDao();

/******************************************************************************
 *                      Get a news feeds - "GET /api/feeds/:userId"
 ******************************************************************************/

router.get("/:userId", adminMW, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params as ParamsDictionary;
    if (!userId) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    const group = await newsFeedDao.getNewsFeedByUserId(userId);
    return res.status(OK).json({ group });
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      Add a news feed - "POST /api/feeds/"
 ******************************************************************************/
router.post("/", async (req: Request, res: Response) => {
  const { newsFeed } = req.body;
  try {
    if (!newsFeed) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    const newsFeedResult = await newsFeedDao.addNewsFeed(newsFeed);
    res.status(CREATED).json(newsFeedResult);
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      update a news feed - "PUT /api/feeds/:newsFeedId"
 ******************************************************************************/
router.put("/:newsFeedId", async (req: Request, res: Response) => {
  try {
    const { newsFeedId } = req.params as ParamsDictionary;
    const { newsFeed } = req.body;
    if (!newsFeed || !newsFeedId) {
      return res.status(BAD_REQUEST).json({ error: paramMissingError });
    }

    const editedFeed = await newsFeedDao.editNewsFeed(newsFeed, newsFeedId);
    res.status(CREATED).json(editedFeed);
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      delete a feed - "DELETE /api/feeds/:id"
 ******************************************************************************/
router.delete("/:id", adminMW, async (req: Request, res: Response) => {
  try {
    const { id } = req.params as ParamsDictionary;
    await newsFeedDao.deleteNewsFeed(id);
    return res.status(OK).end();
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

export default router;
