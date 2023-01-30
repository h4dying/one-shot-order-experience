/**
 * The JWT data transfer object(DTO).
 * @see for more information about DTO https://www.codeproject.com/Articles/1050468/Data-Transfer-Object-Design-Pattern-in-Csharp
 */
export interface JwtDTO {
  /**
   * Gets or the sets the token of the access token.
   */
  token: string;

  /**
   * Gets or sets the id of the user that the access token belongs to.
   */
  userId: string;

  /**
   * Gets or the sets the numeric UTC date/time represents in `seconds`, in which the access token was issued.
   */
  iat: number;

  /**
   * Gets or the sets the numeric UTC date/time represents in `seconds`, in which the access token will expire.
   */
  exp: number;
}
