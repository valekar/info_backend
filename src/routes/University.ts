import { Request, Response, Router } from "express";
import { BAD_REQUEST, CREATED, OK } from "http-status-codes";
import { ParamsDictionary } from "express-serve-static-core";
import { UniversityDao, IUniversityPhoto } from "@daos";
import { paramMissingError, logger, adminMW } from "@shared";

const router = Router();
const universityDao = new UniversityDao();

/******************************************************************************
 *                      Get All universitys - "GET /api/universities/"
 ******************************************************************************/

router.get("/", adminMW, async (req: Request, res: Response) => {
  try {
    const universities = await universityDao.getAll();
    return res.status(OK).json({ universities });
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      Get a university - "GET /api/universities/:id"
 ******************************************************************************/

router.get("/:id", adminMW, async (req: Request, res: Response) => {
  try {
    const { id } = req.params as ParamsDictionary;
    if (!id) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    const university = await universityDao.getOne(id);
    return res.status(OK).json({ university });
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      Add a university - "POST /api/universities/"
 ******************************************************************************/
router.post("/", adminMW, async (req: Request, res: Response) => {
  try {
    const { university } = req.body;
    if (!university) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    const result = await universityDao.add(university);
    return res.status(CREATED).json(result);
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      update a university - "PUT /api/universities/:id"
 ******************************************************************************/
router.put("/:id", adminMW, async (req: Request, res: Response) => {
  try {
    const { id } = req.params as ParamsDictionary;
    const { university } = req.body;
    if (!university || !id) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    await universityDao.update(university, id);
    return res.status(CREATED).end();
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      delete a university - "DELETE /api/universities/:id"
 ******************************************************************************/
router.delete("/:id", adminMW, async (req: Request, res: Response) => {
  try {
    const { id } = req.params as ParamsDictionary;
    await universityDao.delete(id);
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
 *                      Add a photo to university - "university /api/universities/:id/photos/"
 ******************************************************************************/
router.post("/:id/photos/", adminMW, async (req: Request, res: Response) => {
  try {
    const { id } = req.params as ParamsDictionary;
    const { universityPhoto } = req.body;

    const universityIPhoto: IUniversityPhoto = {
      universityId: id,
      photo: universityPhoto.photo,
      photoId: ""
    };
    if (!universityIPhoto) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    const university = await universityDao.addPhoto(universityIPhoto);
    return res.status(CREATED).json(university);
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      DELETE a photo to university - "DELETE /api/universities/:id/photos/:id"
 ******************************************************************************/
router.delete(
  "/:id/photos/:photoId",
  adminMW,
  async (req: Request, res: Response) => {
    try {
      const { id, photoId } = req.params as ParamsDictionary;

      const universityIPhoto: IUniversityPhoto = {
        universityId: id,
        photo: null,
        photoId: photoId
      };
      await universityDao.deletePhoto(universityIPhoto);
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
