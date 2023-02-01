/**
 * The room create request data-model.
 */
export interface CreateRoomInput {
  /**
   * Gets or sets the title of the room.
   */
  title: string;

  /**
   * Gets or sets the description of the room.
   * @optional
   */
  description?: string;

  /**
   * Gets or sets the capacity of the room.
   * @optional
   * @default 10
   */
  capacity?: number;

  /**
   * Gets or sets the room's owner's id.
   */
  ownerId: string;
}
