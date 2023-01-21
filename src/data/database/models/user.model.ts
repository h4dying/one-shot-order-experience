import { Model, DataTypes } from 'sequelize';
import { Database } from '../helpers';

/**
 * The User model that maps the `users table` in the database.
 * The model name will be `users` also.
 */
export class User extends Model {
  /**
   * Any property or method will be declared in this class should has
   * the `non-null assertion` `!` is required in strict mode.
   */

  /**
   * Gets or the sets the id of the user.
   */
  public id!: number;

  /**
   * Gets or the sets the email of the user.
   * the email should be unique.
   */
  public email!: string;

  /**
   * Gets or the sets the password of the user.
   * the password should be hashed.
   */
  public password!: string;

  /**
   * Gets or the sets the first name of the user.
   */
  public firstName!: string;

  /**
   * Gets or the sets the last name of the user.
   */
  public lastName!: string;
}

/**
 * Define the model structure here.
 */
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: 'users',
    sequelize: Database.sequelize,
    timestamps: false,
    indexes: [
      {
        fields: ['id'],
        unique: true
      },
      {
        fields: ['email'],
        unique: true
      }
    ]
  }
);
