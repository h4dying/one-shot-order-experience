/**
 * The room update request data-model.
 */
export interface UpdateRoomInput {
  /**
   * Gets or sets the title of the room.
   */
  title: string;
  /**
   * Gets or sets the description of the room.
   */
  description: string;

  /**
   * Gets or sets the capacity of the room.
   */
  capacity: number;
}
