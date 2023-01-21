import { Transaction } from 'sequelize';
import { AppError, AppErrorCode, DataResult, Hash } from '../../../shared';
import { Database } from '../../database';
import { CreateUserInput, UserDTO } from '../models';

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
    /**
     * The transaction that will be used to commit or rollback the whole process.
     */
    let transaction: Transaction | undefined = undefined;
    try {
      //#region validate data-model

      /** Check if the email is already exists in the database  */
      const emailExists = await Database.Users.findOne({
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

      /**
       * Start the transaction.
       */
      transaction = await Database.sequelize.transaction();

      /** Hash the password before insert it in the database */
      const hashedPassword = await Hash.hash(data.password);

      const user = await Database.Users.create(
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: hashedPassword
        },
        { transaction }
      );

      /**
       * If the execution reaches this line, no errors were thrown.
       * We commit the transaction.
       */
      await transaction.commit();
      result.data = (await this.findById(user.id))?.data;
    } catch (error) {
      /**
       * If the execution reaches this line, an error was thrown.
       * We rollback the transaction.
       */
      if (transaction) {
        await transaction.rollback();
      }
      result.error = error as Error;
    }
    return result;
  }

  /**
   * Finds the user with the given id.
   * @param userId The id of the user.
   */
  public static async findById(userId: number): Promise<DataResult<UserDTO>> {
    const result: DataResult<UserDTO> = {};
    try {
      result.data = await Database.Users.findByPk(userId, {
        attributes: ['id', 'firstName', 'lastName', 'email'],
        nest: true
      });
      result.isNotFound = !result.data;
    } catch (error) {
      result.error = error as Error;
    }
    return result;
  }
}
