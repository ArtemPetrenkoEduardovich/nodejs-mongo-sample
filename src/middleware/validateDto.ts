import { validate, ValidationError } from 'class-validator';
import { ValidationException } from '../exceptions/ValidationException';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { plainToInstance } from 'class-transformer';

const extractErrors = (errors: ValidationError[]): string[] => {
  let messages: string[] = [];

  errors.forEach((error) => {
    if (error.children && error.children.length > 0) {
      messages = messages.concat(extractErrors(error.children));
    }
    if (error.constraints) {
      messages = messages.concat(Object.values(error.constraints));
    }
  });

  return messages;
};

export default (dtoClass: new () => object): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(dtoClass, req.body);
    const errors: ValidationError[] = await validate(dto);

    if (errors.length > 0) {
      const messages = extractErrors(errors);
      return next(new ValidationException(messages));
    }

    next();
  };
};
