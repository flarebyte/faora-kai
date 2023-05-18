import {z} from 'zod';
import {type PrimitiveFieldValidator} from './model.js';

/** String sizes [ 10, 20, 30, 50, 80, 140, 200, 400, 600, 1000, 1600, 2600, 5000] */
type StringFieldKey =
  | 'string1To10'
  | 'string1To20'
  | 'string1To30'
  | 'string1To50'
  | 'string1To80'
  | 'string1To140'
  | 'string1To200'
  | 'string1To400'
  | 'string1To600'
  | 'string1To1000'
  | 'string1To1600'
  | 'string1To2600'
  | 'string1To5000';

export const stringFields: PrimitiveFieldValidator<StringFieldKey> = {
  string1To10: z.string().min(1).max(10),
  string1To20: z.string().min(1).max(20),
  string1To30: z.string().min(1).max(30),
  string1To50: z.string().min(1).max(50),
  string1To80: z.string().min(1).max(80),
  string1To140: z.string().min(1).max(140),
  string1To200: z.string().min(1).max(200),
  string1To400: z.string().min(1).max(400),
  string1To600: z.string().min(1).max(600),
  string1To1000: z.string().min(1).max(1000),
  string1To1600: z.string().min(1).max(1600),
  string1To2600: z.string().min(1).max(2600),
  string1To5000: z.string().min(1).max(5000),
};
