import { Request, Response, Router } from "express";
import { BAD_REQUEST, CREATED, OK } from "http-status-codes";
import { ParamsDictionary } from "express-serve-static-core";
import { QueryDao, IQueryComment, IQueryPhoto, IQueryAnswer } from "@daos";
import { paramMissingError, logger, adminMW } from "@shared";

const router = Router();
const queryDao = new QueryDao();

/******************************************************************************
 *                      Get All queries - "GET /api/queries/"
 ******************************************************************************/

router.get("/", adminMW, async (req: Request, res: Response) => {
  try {
    const queries = await queryDao.getAll();
    return res.status(OK).json({ queries });
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      Get a query - "GET /api/queries/:id"
 ******************************************************************************/

router.get("/:id", adminMW, async (req: Request, res: Response) => {
  try {
    const { id } = req.params as ParamsDictionary;
    if (!id) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    const query = await queryDao.getOne(id);
    return res.status(OK).json({ query });
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      Add a query - "POST /api/queries/"
 ******************************************************************************/
router.post("/", adminMW, async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    const result = await queryDao.add(query);
    return res.status(CREATED).json(result);
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      update a query - "PUT /api/queries/:id"
 ******************************************************************************/
router.put("/:id", adminMW, async (req: Request, res: Response) => {
  try {
    const { id } = req.params as ParamsDictionary;
    const { query } = req.body;
    if (!query || !id) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    await queryDao.update(query, id);
    return res.status(CREATED).end();
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      delete a query - "DELETE /api/queries/:id"
 ******************************************************************************/
router.delete("/:id", adminMW, async (req: Request, res: Response) => {
  try {
    const { id } = req.params as ParamsDictionary;
    await queryDao.delete(id);
    return res.status(OK).end();
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/**************************************************************************************************************
 *                     ADDITIONAL ROUTES
 **************************************************************************************************************/

/******************************************************************************
 *                      Add a comment to query - "POST /api/queries/:id/comments/"
 ******************************************************************************/
router.post("/:id/comments/", adminMW, async (req: Request, res: Response) => {
  try {
    const { id } = req.params as ParamsDictionary;
    const { queryComment } = req.body;

    const queryIComment: IQueryComment = {
      queryId: id,
      comment: queryComment.comment,
      commentId: ""
    };
    if (!queryIComment) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    const query = await queryDao.addComment(queryIComment);
    return res.status(CREATED).json(query);
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      Edit a comment to query - "PUT /api/queries/:id/comments/:id"
 ******************************************************************************/
router.put(
  "/:id/comments/:commentId",
  adminMW,
  async (req: Request, res: Response) => {
    try {
      const { id, commentId } = req.params as ParamsDictionary;
      const { queryComment } = req.body;

      const queryIComment: IQueryComment = {
        queryId: id,
        comment: queryComment.comment,
        commentId: commentId
      };
      if (!queryIComment) {
        return res.status(BAD_REQUEST).json({
          error: paramMissingError
        });
      }
      await queryDao.updateComment(queryIComment);
      return res.status(CREATED).end();
    } catch (err) {
      logger.error(err.message, err);
      return res.status(BAD_REQUEST).json({
        error: err.message
      });
    }
  }
);

/******************************************************************************
 *                      DELETE a comment to query - "DELETE /api/queries/:id/comments/:id"
 ******************************************************************************/
router.delete(
  "/:id/comments/:commentId",
  adminMW,
  async (req: Request, res: Response) => {
    try {
      const { id, commentId } = req.params as ParamsDictionary;

      const queryIComment: IQueryComment = {
        queryId: id,
        comment: null,
        commentId: commentId
      };
      await queryDao.deleteComment(queryIComment);
      return res.status(CREATED).end();
    } catch (err) {
      logger.error(err.message, err);
      return res.status(BAD_REQUEST).json({
        error: err.message
      });
    }
  }
);

/******************************************************************************
 *                      Add a photo to query - "query /api/queries/:id/photos/"
 ******************************************************************************/
router.post("/:id/photos/", adminMW, async (req: Request, res: Response) => {
  try {
    const { id } = req.params as ParamsDictionary;
    const { queryPhoto } = req.body;

    const queryIPhoto: IQueryPhoto = {
      queryId: id,
      photo: queryPhoto.photo,
      photoId: ""
    };
    if (!queryIPhoto) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    const query = await queryDao.addPhoto(queryIPhoto);
    return res.status(CREATED).json(query);
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      DELETE a photo to query - "DELETE /api/queries/:id/photos/:id"
 ******************************************************************************/
router.delete(
  "/:id/photos/:photoId",
  adminMW,
  async (req: Request, res: Response) => {
    try {
      const { id, photoId } = req.params as ParamsDictionary;

      const queryIPhoto: IQueryPhoto = {
        queryId: id,
        photo: null,
        photoId: photoId
      };
      await queryDao.deletePhoto(queryIPhoto);
      return res.status(CREATED).end();
    } catch (err) {
      logger.error(err.message, err);
      return res.status(BAD_REQUEST).json({
        error: err.message
      });
    }
  }
);

/******************************************************************************
 *                      Add a answer to query - "POST /api/queries/:id/answers/"
 ******************************************************************************/
router.post("/:id/answers/", adminMW, async (req: Request, res: Response) => {
  try {
    const { id } = req.params as ParamsDictionary;
    const { queryAnswer } = req.body;

    const queryIAnswer: IQueryAnswer = {
      queryId: id,
      answer: queryAnswer.answer,
      answerId: ""
    };
    if (!queryIAnswer) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    const query = await queryDao.addAnswer(queryIAnswer);
    return res.status(CREATED).json(query);
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      Edit a answer to query - "PUT /api/queries/:id/answers/:id"
 ******************************************************************************/
router.put(
  "/:id/answers/:answerId",
  adminMW,
  async (req: Request, res: Response) => {
    try {
      const { id, answerId } = req.params as ParamsDictionary;
      const { queryAnswer } = req.body;

      const queryIAnswer: IQueryAnswer = {
        queryId: id,
        answer: queryAnswer.answer,
        answerId: answerId
      };
      if (!queryIAnswer) {
        return res.status(BAD_REQUEST).json({
          error: paramMissingError
        });
      }
      await queryDao.updateAnswer(queryIAnswer);
      return res.status(CREATED).end();
    } catch (err) {
      logger.error(err.message, err);
      return res.status(BAD_REQUEST).json({
        error: err.message
      });
    }
  }
);

/******************************************************************************
 *                      DELETE a answer to query - "DELETE /api/queries/:id/answers/:id"
 ******************************************************************************/
router.delete(
  "/:id/answers/:answerId",
  adminMW,
  async (req: Request, res: Response) => {
    try {
      const { id, answerId } = req.params as ParamsDictionary;

      const queryIAnswer: IQueryAnswer = {
        queryId: id,
        answer: null,
        answerId: answerId
      };
      await queryDao.deleteAnswer(queryIAnswer);
      return res.status(CREATED).end();
    } catch (err) {
      logger.error(err.message, err);
      return res.status(BAD_REQUEST).json({
        error: err.message
      });
    }
  }
);

export default router;
