import { AppErrorCode } from './app-error-codes.model';
import { AppError } from './app-errors.model';

/**
 * Represents an app http error that should be sent within a failed request's response.
 *
 * @summary All error members are optional but the more details the server sends back to the client the more easy it becomes to fix the error.
 */
export interface AppHttpResponseError {
  /**
   * Gets or sets the application-specific code for this error.
   */
  code?: AppErrorCode;

  /**
   * Gets or sets the name of the source that causes this error.
   *
   * Usually it's the name of the property that causes the error.
   *
   * The property maybe a nested property,
   * in this case use e.g. if we are validating a `Person` object use `address.postalCode` instead of `postalCode`.
   */
  source?: string;

  /**
   * Gets or sets a generic title of the problem.
   */
  title?: AppError;

  /**
   * Gets or sets a more descriptive details for the problem, unlike the generic @field title.
   */
  detail?: string;
}
