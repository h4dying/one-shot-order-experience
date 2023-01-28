import { NextFunction, Request, Response, Router } from 'express';
import { validationResult } from 'express-validator';
import { createUserValidator, loginUserValidator, UsersDataAccess } from '../../data';
import { AppError, AppErrorCode, BadRequest, Created, JWT, Ok, validationErrorFormatter } from '../../shared';

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

/* Login user route */
authRouter.post('/login', loginUserValidator, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validationErrors = validationResult(req).formatWith(validationErrorFormatter).array({ onlyFirstError: true });

    if (validationErrors.length) {
      return BadRequest(res, { errors: validationErrors });
    }

    const userResult = await UsersDataAccess.findByCredentials(req.body);
    if (userResult.error) {
      return next(userResult.error);
    } else if (userResult.isNotFound) {
      return BadRequest(res, {
        errors: [
          {
            code: AppErrorCode.Forbidden,
            source: 'email or password',
            title: AppError.Forbidden,
            detail: 'USER.INVALID_CREDENTIALS'
          }
        ]
      });
    }
    const jwtToken = await JWT.sign(
      { userId: userResult.data?.id.toString() as string },
      process.env.JWT_TOKEN as string,
      {
        expiresIn: process.env.JWT_EXPIRES_IN as string
      }
    );
    // set-cookie header samesite=Lax, httpOnly
    res.setHeader('set-cookie', `JWT_TOKEN=${jwtToken}; samesite=lax; httpOnly}`);
    Ok(res, {
      data: {
        access_token: jwtToken
      }
    });
  } catch (error) {
    next(error);
  }
});

/* Logout user route */
authRouter.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.cookie('JWT_TOKEN', '', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true, sameSite: 'lax' });
    Ok(res);
  } catch (error) {
    next(error);
  }
});
