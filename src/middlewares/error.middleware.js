const errorHandler = (err, req, res, next) => {
    console.error(err);

    return res.status(err.statusCode).json({
        message: err.message,
        statusCode: err.statusCode,
        errors: err.errors
    });
}

export { errorHandler };