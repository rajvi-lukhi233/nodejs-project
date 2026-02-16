export const validation = (schema) => {
  return (req, res, next) => {
    try {
      const { error } = schema.validate({
        ...req.body,
        ...req.params,
        ...req.query,
      });
      if (error) {
        return res.fail(400, error.details[0].message);
      }
      next();
    } catch (error) {
      console.log('Validation Error:', error);
      return res.fail(500, 'Internal server error during validation');
    }
  };
};
