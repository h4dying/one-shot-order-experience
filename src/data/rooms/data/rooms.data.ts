import { AppError, AppErrorCode, DataResult } from '../../../shared';
import { Database } from '../../database';
import { CreateRoomInput, RoomDTO, UpdateRoomInput } from '../models';

/**
 * The rooms data-access service that includes the functionalities to create, read, update, and delete rooms.
 */
export class RoomsDataAccess {
  /**
   * Creates a new room based on the provided data-model.
   * @param data The data-model to create the new room.
   */
  public static async create(data: CreateRoomInput): Promise<DataResult<RoomDTO>> {
    const result: DataResult<RoomDTO> = {};
    try {
      const generatedRoomCode =
        Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const [dbRoomOwner, dbRoomCode, dbRoomTitle] = await Promise.all([
        Database.Users.findUnique({
          where: { id: data.ownerId }
        }),
        Database.Rooms.findFirst({
          where: {
            code: generatedRoomCode
          }
        }),
        Database.Rooms.findFirst({
          where: {
            title: data.title
          }
        })
      ]);

      if (!dbRoomOwner) {
        result.validationErrors = [
          {
            code: AppErrorCode.RelatedEntityNotFound,
            source: 'ownerId',
            title: AppError.RelatedEntityNotFound,
            detail: 'ROOM.OWNER_NOT_FOUND'
          }
        ];
        return result;
      }
      if (dbRoomCode) {
        result.validationErrors = [
          {
            code: AppErrorCode.ValueExists,
            title: AppError.ValueExists,
            source: 'code',
            detail: 'ROOM.CODE_IS_EXIST'
          }
        ];
        return result;
      }

      if (dbRoomTitle) {
        result.validationErrors = [
          {
            code: AppErrorCode.ValueExists,
            title: AppError.ValueExists,
            source: 'title',
            detail: 'ROOM.TITLE_IS_EXISTS'
          }
        ];
        return result;
      }

      const newRoom = await Database.Rooms.create({
        data: {
          title: data.title,
          description: data.description,
          capacity: data.capacity,
          code: generatedRoomCode,
          users: {
            create: {
              userId: data.ownerId,
              role: 'ADMIN'
            }
          }
        },
        include: {
          users: true
        }
      });
      result.data = (await this.findById(newRoom.id))?.data;
    } catch (error) {
      result.error = error as Error;
    }
    return result;
  }

  /**
   * Finds the room with the given id.
   * @param userId The id of the room.
   */
  public static async findById(roomId: string): Promise<DataResult<RoomDTO>> {
    const result: DataResult<RoomDTO> = {};
    try {
      result.data = await Database.Rooms.findUnique({
        where: { id: roomId },
        select: {
          id: true,
          title: true,
          code: true,
          createdAt: true,
          users: {
            select: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true
                }
              },
              role: true
            }
          }
        }
      });
      result.isNotFound = !result.data;
    } catch (error) {
      result.error = error as Error;
    }
    return result;
  }

  /**
   * Update an existing room based on the provided data-model.
   * @param data The data-model to create the new room.
   * @param roomId The id of the room.
   */
  public static async update(roomId: string, data: UpdateRoomInput): Promise<DataResult<boolean>> {
    const result: DataResult<boolean> = {};
    try {
      const dbRoom = await this.findById(roomId);
      if (!dbRoom) {
        result.isNotFound = true;
        return result;
      }
      const dbRoomTitle = await Database.Rooms.findFirst({
        where: {
          title: data.title
        }
      });
      if (dbRoomTitle) {
        result.validationErrors = [
          {
            code: AppErrorCode.ValueExists,
            title: AppError.ValueExists,
            source: 'title',
            detail: 'ROOM.TITLE_IS_EXISTS'
          }
        ];
        return result;
      }
      await Database.Rooms.update({
        where: {
          id: roomId
        },
        data: {
          title: data.title,
          description: data.description,
          capacity: data.capacity
        }
      });
    } catch (error) {
      result.error = error as Error;
    }
    return result;
  }

  /**
   * Delete an existing room based on the provided data-model.
   * @param roomId The id of the room.
   */
  public static async delete(roomId: string): Promise<DataResult<boolean>> {
    const result: DataResult<boolean> = {};
    try {
      const dbRoom = await Database.Rooms.findUnique({
        where: {
          id: roomId
        },
        select: {
          users: {
            select: {
              user: {
                select: {
                  id: true
                }
              }
            }
          }
        }
      });
      if (!dbRoom) {
        result.isNotFound = true;
        return result;
      }
      await Database.Enrollments.delete({
        where: {
          userId_roomId_role: {
            roomId: roomId,
            role: 'ADMIN',
            userId: dbRoom.users[0].user.id
          }
        }
      });
    } catch (error) {
      result.error = error as Error;
    }
    return result;
  }
}
