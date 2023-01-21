import { Sequelize, ConnectionError, ConnectionTimedOutError, TimeoutError } from 'sequelize';
import { User } from '../models';

/**
 * A singleton instance of sequelize that will be used across the application.
 *
 * @summary It's important to not use any other instances of sequelize other than this instance unless you have more than one database.
 */
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  minifyAliases: true,
  dialectOptions: {
    ssl: {
      require: process.env.DB_REQUIRES_SSL,
      rejectUnauthorized: false
    },
    useUTC: true /* for reading date-time with time zone from database. */
  },
  logging: process.env.ENV === 'production' ? false : console.log /* Stop logging sql queries for production only. */,
  retry: {
    match: [ConnectionError, ConnectionTimedOutError, TimeoutError, /Deadlock/i],
    max: 3
  },
  pool: {
    max: process.env.DB_MAX_POOL_SIZE
  }
});

/**
 * The Database helper that includes all functionalities related to the database and all of it's models.
 * @notes All of this class members are static.
 * @notes All database models should be registered in this class.
 * @notes All database models should be accessed only through this class as central point of database functionality.
 */
export class Database {
  /**
   * A singleton instance of sequelize that will be used across the application.
   *
   * @summary It's important to not use any other instances of sequelize other than this instance unless you have more than one database.
   */
  public static readonly sequelize: Sequelize = sequelize;

  /**
   * Tests the connection to the database using the provided credentials.
   */
  public static testDatabaseConnection(): Promise<void> {
    return sequelize.authenticate();
  }
  /**
   * Sync all defined models to the DB.
   * @param force If force is true, each DAO will do DROP TABLE IF EXISTS ..., before it tries to create its own table
   */
  public static syncDatabase(force?: boolean): Promise<Sequelize> {
    return sequelize.sync({ force: force });
  }

  /**
   * The User model that maps the `users table` in the database.
   * The model name will be `users` also.
   */
  public static get Users(): typeof User {
    return User;
  }
}
