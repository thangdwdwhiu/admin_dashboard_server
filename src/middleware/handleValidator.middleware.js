import { validationResult } from 'express-validator';

const handleValidator = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(e => ({
      field: e.param,
      message: e.msg
    }));

    return res.status(400).json({
      success: false,
      error: formattedErrors[0].message,  
      errors: formattedErrors
    });
  }

  next();
};

export default handleValidator
