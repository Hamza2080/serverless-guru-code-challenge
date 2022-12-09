import * as Joi from 'joi';

export const addNoteJoiSchema = (): Joi.Schema => (Joi.object({
  note: Joi.string().required(),
  createdBy: Joi.string().required(), // username
  topic: Joi.string().required()
}));
