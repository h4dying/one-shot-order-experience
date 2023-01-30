import { NextFunction, Request, Response } from 'express';
import { AppError, AppErrorCode } from '../models';
import { InternalServerError, JWT, UnAuthenticated } from '../utils';

/**
 * Authenticates the coming request by validating the jwt against validity and expiration.
 * @param req The express request.
 * @param res The express response.
 * @param next The next function in the pipeline.
 */
export async function Authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split(' ')[1] ?? '';
    if (!token) {
      return UnAuthenticated(res, {
        errors: [
          {
            code: AppErrorCode.UnAuthenticated,
            source: 'Authorization',
            title: AppError.UnAuthenticated,
            detail: 'AUTH.UNAUTHENTICATED'
          }
        ]
      });
    }
    const jwtData = await JWT.verify(token, process.env.JWT_TOKEN as string);
    if (jwtData) {
      req.user = {
        userId: jwtData.userId
      };
      next();
    } else {
      UnAuthenticated(res, {
        errors: [
          {
            code: AppErrorCode.UnAuthenticated,
            source: 'Authorization',
            title: AppError.UnAuthenticated,
            detail: 'AUTH.UNAUTHENTICATED'
          }
        ]
      });
    }
  } catch (error) {
    // catch the jwt malformed error
    if (error instanceof Error && (error.message === 'jwt malformed' || error.message === 'jwt expired')) {
      return UnAuthenticated(res, {
        errors: [
          {
            code: AppErrorCode.InvalidType,
            title: AppError.InvalidType,
            detail: 'The token is not syntactically valid or expired.'
          }
        ]
      });
    }
    InternalServerError(res, error as Error);
  }
}
