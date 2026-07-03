// Central error handler. Any error passed via next(err) or thrown in an
// async route (caught by asyncHandler) lands here.
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Server Error';

  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Task not found';
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export const notFound = (req, res, next) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
};

// Wraps async route handlers so rejected promises are forwarded to errorHandler
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
