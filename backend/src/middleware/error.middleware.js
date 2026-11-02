const errorMiddleware = (
    err,
    req,
    res,
    next
) => {
    console.error(err);

    const statusCode =
        err.statusCode || 500;

    res.status(statusCode).json({
        success: false,

        message:
            err.message ||
            "Internal server error",

        errors:
            err.errors || [],

        ...(process.env.NODE_ENV === "development" && {
            stack: err.stack
        })
    });
};

export default errorMiddleware;