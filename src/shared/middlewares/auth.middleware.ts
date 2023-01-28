import { NextFunction, Request, Response } from 'express';
import { InternalServerError, JWT, UnAuthenticated } from '../utils';

/**
 * Authenticates the coming request by validating the jwt against validity and expiration.
 * @param req The express request.
 * @param res The express response.
 * @param next The next function in the pipeline.
 */
export async function Authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    // get the token from the authorization header or the cookie if it exists
    let token: string | undefined;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.JWT_TOKEN) {
      token = req.cookies.JWT_TOKEN as string;
    }
    if (!token) {
      return UnAuthenticated(res);
    }
    const jwtData = await JWT.verify(token, process.env.JWT_TOKEN as string);
    if (jwtData) {
      req.user = {
        userId: jwtData.userId
      };
      next();
    } else {
      UnAuthenticated(res);
    }
  } catch (error) {
    InternalServerError(res, error as Error);
  }
}
