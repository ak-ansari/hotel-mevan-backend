export class ApiError extends Error {
  public data: unknown;
  public success: boolean;

  constructor(
    public statusCode: number,
    public message: string = "Something went wrong",
    public errors: unknown[] = [],
    public stack?: string
  ) {
    super(message);
    this.data = null;
    this.success = false;

    // Ensure message is properly inherited from Error
    Object.setPrototypeOf(this, new.target.prototype);

    if (!stack) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message, // ✅ Ensure `message` is included
      errors: this.errors,
      data: this.data,
      stack: process.env.NODE_ENV === "development" ? this.stack : undefined, // Hide stack in production
    };
  }
}
