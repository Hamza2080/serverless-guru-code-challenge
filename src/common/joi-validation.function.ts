import * as Joi from 'joi';
import { BadRequestError } from './error';

export const joiValidatePayload = (payload: unknown, schema: Joi.Schema<any>): void => {
  try {
    const result = schema.validate(payload);
    if (result.error) {
      throw new Error(result.error.details[0].message);
    }
  } catch (e) {
    throw new BadRequestError(e.message);
  }
};
