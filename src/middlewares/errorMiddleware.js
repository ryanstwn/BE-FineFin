const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  let status = err.statusCode || 500;

  res.status(status).json({
    success: false,
    message: err.message,
  });
};

export default errorMiddleware;