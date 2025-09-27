import createHttpError from 'http-errors';

export function validateBody(schema) {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (err) {
      const error = err.details.map((detail) => detail.message);

      next(new createHttpError.BadRequest(error));
    }
  };
}
