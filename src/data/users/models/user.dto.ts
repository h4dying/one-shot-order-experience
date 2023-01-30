/**
 * The User data transfer object(DTO).
 * @see for more information about DTO https://www.codeproject.com/Articles/1050468/Data-Transfer-Object-Design-Pattern-in-Csharp
 */
export interface UserDTO {
  /**
   * Gets or sets the id of the user.
   */
  id: string;

  /**
   * Gets or sets the firstName of the user.
   * @optional
   */
  firstName: string | null;

  /**
   * Gets or sets the lastName of the user.
   * @optional
   */
  lastName: string | null;

  /**
   * Gets or sets the email of the user.
   */
  email: string;
}
