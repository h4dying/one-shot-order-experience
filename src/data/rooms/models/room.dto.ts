/**
 * The Room data transfer object(DTO).
 * @see for more information about DTO https://www.codeproject.com/Articles/1050468/Data-Transfer-Object-Design-Pattern-in-Csharp
 */

/**
 * { code: string; title: string | null; id: string; createdAt: Date;
 */
export interface RoomDTO {
  /**
   * Gets or sets the id of the room.
   */
  id: string;

  /**
   * Gets or sets the title of the room.
   */
  title: string | null;

  /**
   * Gets or sets the description of the room.
   * @optional
   */
  // description?: string;

  /**
   * Gets or sets the capacity of the room.
   * @optional
   * @default 10
   */
  capacity?: number;

  /**
   * Gets or sets the room's code.
   */
  code: string;

  /**
   * Gets or sets the room's owner.
   */
  // owner: UserDTO;

  /**
   * Gets or sets the room's owner's id.
   */
  // owner: ;

  /**
   * Gets or sets the room's created date.
   */
  createdAt: Date;

  /**
   * Gets or sets the room's messages.
   * @optional
   * @todo
   */
}
