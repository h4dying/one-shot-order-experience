import { AppError, AppErrorCode, DataResult, Hash } from '../../../shared';
import { Database } from '../../database';
import { CreateUserInput, LoginUserInput, UpdateUserInput, UserDTO } from '../models';

/**
 * The users data-access service that includes the functionalities to create, read, update, and delete users.
 */
export class UsersDataAccess {
  /**
   * Creates a new user based on the provided data-model.
   * @param data The data-model to create the new user.
   */
  public static async create(data: CreateUserInput): Promise<DataResult<UserDTO>> {
    const result: DataResult<UserDTO> = {};
    try {
      //#region validate data-model

      /** Check if the email is already exists in the database  */
      const emailExists = await Database.Users.findUnique({
        where: { email: data.email }
      });

      if (emailExists) {
        result.validationErrors = [
          {
            code: AppErrorCode.ValueExists,
            source: 'email',
            title: AppError.ValueExists,
            detail: 'USER.EMAIL_EXISTS'
          }
        ];
        return result;
      }

      /** Hash the password before insert it in the database */
      const hashedPassword = await Hash.hash(data.password);

      const user = await Database.Users.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: hashedPassword
        }
      });
      result.data = (await this.findById(user.id))?.data;
    } catch (error) {
      result.error = error as Error;
    }
    return result;
  }

  /**
   * Finds the user with the given id.
   * @param userId The id of the user.
   */
  public static async findById(userId: string): Promise<DataResult<UserDTO>> {
    const result: DataResult<UserDTO> = {};
    try {
      result.data = await Database.Users.findUnique({
        where: { id: userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      });
      result.isNotFound = !result.data;
    } catch (error) {
      result.error = error as Error;
    }
    return result;
  }

  /**
   * find an existing user based on the provided data-model.
   * @param data The data-model to create the new user.
   */
  public static async findByCredentials(data: LoginUserInput): Promise<DataResult<UserDTO>> {
    const result: DataResult<UserDTO> = {};
    try {
      const user = await Database.Users.findUnique({
        where: {
          email: data.email
        }
      });
      if (!user || !(await Hash.compare(data.password, user.password))) {
        result.isNotFound = true;
        return result;
      }
      result.data = (await this.findById(user.id))?.data;
    } catch (error) {
      result.error = error as Error;
    }
    return result;
  }

  /**
   * Update the user with the given id.
   * @param userId The id of the user.
   * @param data The data-model to update the user.
   */
  public static async update(userId: string, data: UpdateUserInput): Promise<DataResult<boolean>> {
    const result: DataResult<boolean> = {};
    try {
      const user = await this.findById(userId);
      if (user.isNotFound) {
        result.isNotFound = true;
        return result;
      }
      /** check if email exists for another user in the database  */
      if (data.email) {
        const emailExists = await Database.Users.findUnique({
          where: {
            email: data.email
          },
          select: {
            id: true,
            email: true
          }
        });

        if (emailExists && emailExists.id !== userId) {
          result.validationErrors = [
            {
              code: AppErrorCode.ValueExists,
              source: 'email',
              title: AppError.ValueExists,
              detail: 'USER.EMAIL_EXISTS'
            }
          ];
          return result;
        }
      }

      await Database.Users.update({
        where: { id: userId },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password
        }
      });
      result.data = true;
    } catch (error) {
      result.error = error as Error;
    }
    return result;
  }

  /**
   * Delete the user with the given id.
   * @param userId The id of the user.
   */
  public static async delete(userId: string): Promise<DataResult<boolean>> {
    const result: DataResult<boolean> = {};
    try {
      const user = await this.findById(userId);
      if (user.isNotFound) {
        result.isNotFound = true;
        return result;
      }
      await Database.Users.delete({
        where: { id: userId }
      });
      result.data = true;
    } catch (error) {
      result.error = error as Error;
    }
    return result;
  }
}
