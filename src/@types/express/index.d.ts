declare namespace Express {
  export interface Request {
    /**
     * Gets or sets the user that owns the current http request.
     */
    user: {
      /**
       * Gets or sets the id of the user.
       */
      userId: number;
    };
  }
}
