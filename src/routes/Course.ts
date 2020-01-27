import { Request, Response, Router } from "express";
import { BAD_REQUEST, CREATED, OK } from "http-status-codes";
import { ParamsDictionary } from "express-serve-static-core";
import { CourseDao, ICourseComment, ICoursePhoto, ICourseFaculty } from "@daos";
import { paramMissingError, logger, adminMW } from "@shared";

const router = Router();
const courseDao = new CourseDao();

/******************************************************************************
 *                      Get All Courses - "GET /api/courses/"
 ******************************************************************************/

router.get("/", adminMW, async (req: Request, res: Response) => {
  try {
    const courses = await courseDao.getAll();
    return res.status(OK).json({ courses });
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      Get a Course - "GET /api/courses/:id"
 ******************************************************************************/

router.get("/:id", adminMW, async (req: Request, res: Response) => {
  try {
    const { id } = req.params as ParamsDictionary;
    if (!id) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    const course = await courseDao.getOne(id);
    return res.status(OK).json({ course });
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      Add a Course - "POST /api/courses/"
 ******************************************************************************/
router.post("/", adminMW, async (req: Request, res: Response) => {
  try {
    const { course } = req.body;
    if (!course) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    const result = await courseDao.add(course);
    return res.status(CREATED).json(result);
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      update a Course - "PUT /api/courses/:id"
 ******************************************************************************/
router.put("/:id", adminMW, async (req: Request, res: Response) => {
  try {
    const { id } = req.params as ParamsDictionary;
    const { course } = req.body;
    if (!course || !id) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    await courseDao.update(course, id);
    return res.status(CREATED).end();
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      delete a Course - "DELETE /api/courses/:id"
 ******************************************************************************/
router.delete("/:id", adminMW, async (req: Request, res: Response) => {
  try {
    const { id } = req.params as ParamsDictionary;
    await courseDao.delete(id);
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
 *                      Add a comment to Course - "POST /api/courses/:id/comments/"
 ******************************************************************************/
router.post("/:id/comments/", adminMW, async (req: Request, res: Response) => {
  try {
    const { id } = req.params as ParamsDictionary;
    const { courseComment } = req.body;

    const courseIComment: ICourseComment = {
      courseId: id,
      comment: courseComment.comment,
      commentId: ""
    };
    if (!courseIComment) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    const course = await courseDao.addComment(courseIComment);
    return res.status(CREATED).json(course);
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      Edit a comment to Course - "PUT /api/courses/:id/comments/:id"
 ******************************************************************************/
router.put(
  "/:id/comments/:commentId",
  adminMW,
  async (req: Request, res: Response) => {
    try {
      const { id, commentId } = req.params as ParamsDictionary;
      const { courseComment } = req.body;

      const courseIComment: ICourseComment = {
        courseId: id,
        comment: courseComment.comment,
        commentId: commentId
      };
      if (!courseIComment) {
        return res.status(BAD_REQUEST).json({
          error: paramMissingError
        });
      }
      await courseDao.updateComment(courseIComment);
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
 *                      DELETE a comment to Course - "DELETE /api/courses/:id/comments/:id"
 ******************************************************************************/
router.delete(
  "/:id/comments/:commentId",
  adminMW,
  async (req: Request, res: Response) => {
    try {
      const { id, commentId } = req.params as ParamsDictionary;

      const courseIComment: ICourseComment = {
        courseId: id,
        comment: null,
        commentId: commentId
      };
      await courseDao.deleteComment(courseIComment);
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
 *                      Add a photo to Course - "Course /api/courses/:id/photos/"
 ******************************************************************************/
router.post("/:id/photos/", adminMW, async (req: Request, res: Response) => {
  try {
    const { id } = req.params as ParamsDictionary;
    const { coursePhoto } = req.body;

    const courseIPhoto: ICoursePhoto = {
      courseId: id,
      photo: coursePhoto.photo,
      photoId: ""
    };
    if (!courseIPhoto) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    const course = await courseDao.addPhoto(courseIPhoto);
    return res.status(CREATED).json(course);
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      DELETE a photo to Course - "DELETE /api/courses/:id/photos/:id"
 ******************************************************************************/
router.delete(
  "/:id/photos/:photoId",
  adminMW,
  async (req: Request, res: Response) => {
    try {
      const { id, photoId } = req.params as ParamsDictionary;

      const courseIPhoto: ICoursePhoto = {
        courseId: id,
        photo: null,
        photoId: photoId
      };
      await courseDao.deletePhoto(courseIPhoto);
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
 *                      Add a faculty to Course - "POST /api/courses/:id/faculties/"
 ******************************************************************************/
router.post("/:id/faculties/", adminMW, async (req: Request, res: Response) => {
  try {
    const { id } = req.params as ParamsDictionary;
    const { courseFaculty } = req.body;

    const courseIFaculty: ICourseFaculty = {
      courseId: id,
      faculty: courseFaculty.faculty,
      facultyId: ""
    };
    if (!courseIFaculty) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    const course = await courseDao.addFaculty(courseIFaculty);
    return res.status(CREATED).json(course);
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      Edit a faculty to Course - "PUT /api/courses/:id/faculties/:id"
 ******************************************************************************/
router.put(
  "/:id/faculties/:facultyId",
  adminMW,
  async (req: Request, res: Response) => {
    try {
      const { id, facultyId } = req.params as ParamsDictionary;
      const { courseFaculty } = req.body;

      const courseIFaculty: ICourseFaculty = {
        courseId: id,
        faculty: courseFaculty.faculty,
        facultyId: facultyId
      };
      if (!courseIFaculty) {
        return res.status(BAD_REQUEST).json({
          error: paramMissingError
        });
      }
      await courseDao.updateFaculty(courseIFaculty);
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
 *                      DELETE a faculty to Course - "DELETE /api/courses/:id/faculties/:id"
 ******************************************************************************/
router.delete(
  "/:id/faculties/:facultyId",
  adminMW,
  async (req: Request, res: Response) => {
    try {
      const { id, facultyId } = req.params as ParamsDictionary;

      const courseIFaculty: ICourseFaculty = {
        courseId: id,
        faculty: null,
        facultyId: facultyId
      };
      await courseDao.deleteFaculty(courseIFaculty);
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
