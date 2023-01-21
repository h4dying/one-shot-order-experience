/**
 * The application-specific http status codes.
 */
export enum HttpStatusCode {
  /** Ok code. */
  Ok = 200,

  /** Ok code. */
  Created = 201,

  /* Bad Request code */
  BadRequest = 400,

  /* Unauthenticated code */
  UnAuthenticated = 401,

  /* Forbidden code */
  Forbidden = 403,

  /* Not Found code */
  NotFound = 404,

  /* Internal Server Error code */
  InternalServerError = 500,

  /* No Content code */
  NoContent = 204
}
