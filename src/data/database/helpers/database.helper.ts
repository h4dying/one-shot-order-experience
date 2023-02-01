import { PrismaClient } from '@prisma/client';

/**
 * The Database helper that includes all functionalities related to the database and all of it's models.
 * @notes All of this class members are static.
 * @notes All database models should be registered in this class.
 * @notes All database models should be accessed only through this class as central point of database functionality.
 */
export class Database {
  /**
   * A singleton instance of prisma that will be used across the application.
   *
   * @summary It's important to not use any other instances of prisma other than this instance unless you have more than one database.
   */
  public static readonly prisma: PrismaClient = new PrismaClient();
  /**
   * The User model that maps the `users table` in the database.
   * The model name will be `users` also.
   */
  public static get Users(): typeof Database.prisma.user {
    return Database.prisma.user;
  }

  /**
   * The Rooms model that maps the `rooms table` in the database.
   * The model name will be `rooms` also.
   */
  public static get Rooms(): typeof Database.prisma.room {
    return Database.prisma.room;
  }

  /**
   * The Enrollment model that maps the `enrollments table` in the database.
   * The model name will be `enrollments` also.
   */
  public static get Enrollments(): typeof Database.prisma.enrollment {
    return Database.prisma.enrollment;
  }
}
