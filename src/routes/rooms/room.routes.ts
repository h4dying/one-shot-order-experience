import { NextFunction, Request, Response, Router } from 'express';
import { RoomsDataAccess } from '../../data';
import { AppError, AppErrorCode, BadRequest, Ok } from '../../shared';

/**
 * The room router that holds all module routes.
 */
export const roomRouter = Router();

/**
 * The relative route for the rooms.
 *
 * No leading or trailing slashes required.
 */
export const roomRelativeRoute = 'rooms';

/* Create room route */
roomRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roomResult = await RoomsDataAccess.create(req.body);
    if (roomResult.error) {
      next(roomResult.error);
    } else if (roomResult.validationErrors?.length) {
      BadRequest(res, { errors: roomResult.validationErrors });
    } else {
      Ok(res, {
        data: roomResult.data
      });
    }
  } catch (error) {
    next(error);
  }
});

/* Update room route */
roomRouter.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roomId = req.params.id as string;
    const roomResult = await RoomsDataAccess.update(roomId, req.body);
    if (roomResult.error) {
      next(roomResult.error);
    } else if (roomResult.validationErrors?.length) {
      BadRequest(res, { errors: roomResult.validationErrors });
    } else if (roomResult.isNotFound) {
      BadRequest(res, {
        errors: [
          {
            code: AppErrorCode.RelatedEntityNotFound,
            source: 'roomId',
            title: AppError.RelatedEntityNotFound,
            detail: 'ROOM.ROOM.NOT_FOUND'
          }
        ]
      });
    } else {
      Ok(res);
    }
  } catch (error) {
    next(error);
  }
});

/* Delete room route */
roomRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roomId = req.params.id as string;
    const roomResult = await RoomsDataAccess.delete(roomId);
    if (roomResult.error) {
      next(roomResult.error);
    } else if (roomResult.isNotFound) {
      BadRequest(res, {
        errors: [
          {
            code: AppErrorCode.RelatedEntityNotFound,
            source: 'roomId',
            title: AppError.RelatedEntityNotFound,
            detail: 'ROOM.ROOM.NOT_FOUND'
          }
        ]
      });
    } else {
      Ok(res);
    }
  } catch (error) {
    next(error);
  }
});
