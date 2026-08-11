// Placeholder - not wired into any route yet.
// Request validation logic will be implemented alongside the
// validators/ folder in future phases.
const validate = (schema) => (req, res, next) => {
  if (!schema || typeof schema.validate !== 'function') {
    return next();
  }

  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      message: 'Validation failed',
      details: error.details.map((detail) => detail.message),
    });
  }

  req.body = value;
  return next();
};

module.exports = validate;