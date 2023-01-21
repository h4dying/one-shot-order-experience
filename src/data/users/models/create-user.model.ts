/**
 * The user create request data-model.
 */
export interface CreateUserInput {
  /**
   * Gets or sets the firstName of the user.
   * @optional
   */
  firstName?: string;

  /**
   * Gets or sets the lastName of the user.
   * @optional
   */
  lastName?: string;

  /**
   * Gets or sets the email of the user.
   */
  email: string;

  /**
   * Gets or sets the plain password of the user.
   */
  password: string;
}
