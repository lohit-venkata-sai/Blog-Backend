class ApiError extends Error {
    constructor(errors = [], message = 'something went wrong', statusCode = 500, stack) {
        super(message);
        this.errors = errors;
        this.statusCode = statusCode;

        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export { ApiError };