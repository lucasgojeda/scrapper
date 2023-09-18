export const handleError = (res, msg, errorRaw, status = 400) => {
  console.log(errorRaw);
  res.status(status).json({
    errors: [{ msg }],
  });
};
