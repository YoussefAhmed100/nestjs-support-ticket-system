import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production').required(),

  PORT: Joi.number().required(),

  MONGO_URI: Joi.string().required(),






});