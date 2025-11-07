import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain, ValidationError } from 'express-validator';

type FieldValidationError = {
  type: 'field';
  value: any;
  msg: any;
  path: string;
  location: any;
};

const isFieldError = (error: ValidationError): error is FieldValidationError => {
  return 'path' in error && typeof (error as any).path === 'string';
};

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: isFieldError(err) ? err.path : 'general',
        message: err.msg,
      })),
    });
  }
  
  next();
};

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: isFieldError(err) ? err.path : 'general',
        message: err.msg,
      })),
    });
  };
};
