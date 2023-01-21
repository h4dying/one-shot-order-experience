import { NextFunction, Request, Response, Router } from 'express';
import { validationResult } from 'express-validator';
import { BadRequest, Created, validationErrorFormatter } from '../../../shared';
import { createUserValidator, UsersDataAccess } from '../../users';

/**
 * The auth router that holds all module routes.
 */
export const authRouter = Router();

/**
 * The relative route for the auth.
 *
 * No leading or trailing slashes required.
 */
export const authRelativeRoute = 'auth';

/* Register user route */
authRouter.post('/register', createUserValidator, async (req: Request, res: Response, next: NextFunction) => {
  try {
    /** The validation errors that may result from validating request ['body'] */
    const validationErrors = validationResult(req).formatWith(validationErrorFormatter).array({ onlyFirstError: true });
    if (validationErrors.length) {
      return BadRequest(res, { errors: validationErrors });
    }
    const userResult = await UsersDataAccess.create(req.body);
    if (userResult.error) {
      next(userResult.error);
    } else if (userResult.validationErrors?.length) {
      BadRequest(res, { errors: userResult.validationErrors });
    } else {
      Created(res, { data: userResult.data });
    }
  } catch (error) {
    next(error);
  }
});
