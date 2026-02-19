const catchAsync = (fn) => {
  return (req, res, next) => {
    // ✅ Catch async errors and pass to error handler
    fn(req, res, next).catch(next);
  };
};

export { catchAsync };