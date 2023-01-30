import { NextFunction, Request, Response, Router } from 'express';
import { validationResult } from 'express-validator';
import { updateUserValidator, UsersDataAccess } from '../../data';
import { AppError, AppErrorCode, Authenticate, BadRequest, Ok, validationErrorFormatter } from '../../shared';

/**
 * The auth router that holds all module routes.
 */
export const userRouter = Router();

/**
 * The relative route for the users.
 *
 * No leading or trailing slashes required.
 */
export const userRelativeRoute = 'users';

/* Register user route */
userRouter.patch('/:id', updateUserValidator, Authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validationErrors = validationResult(req).formatWith(validationErrorFormatter).array({ onlyFirstError: true });

    if (validationErrors.length) {
      return BadRequest(res, { errors: validationErrors });
    }

    const userResult = await UsersDataAccess.update(req.params.id, req.body);
    if (userResult.error) {
      next(userResult.error);
    } else if (userResult.isNotFound) {
      BadRequest(res, {
        errors: [
          {
            code: AppErrorCode.RelatedEntityNotFound,
            source: 'id',
            title: AppError.RelatedEntityNotFound,
            detail: 'USER.NOT_FOUND'
          }
        ]
      });
    } else if (userResult.validationErrors?.length) {
      BadRequest(res, { errors: userResult.validationErrors });
    } else {
      Ok(res);
    }
  } catch (error) {
    next(error);
  }
});
