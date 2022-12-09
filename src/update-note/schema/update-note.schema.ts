import * as Joi from 'joi';

export const updateNoteJoiSchema = (): Joi.Schema => (Joi.object({
  sk: Joi.string().required(),
  note: Joi.string(),
  topic: Joi.string()
}).or('note', 'topic'));
