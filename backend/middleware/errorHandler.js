const errorHandler = (err, _req, res, _next) => {
  console.error("Unhandled error:", err.stack || err.message);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
};

module.exports = errorHandler;
