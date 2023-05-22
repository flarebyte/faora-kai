/* eslint-disable @typescript-eslint/consistent-type-definitions */
import {type z} from 'zod';

export type PrimitiveFieldValidator<K extends string | number | symbol> =
  Record<K, z.ZodString>;

export interface Success<A> {
  status: 'success';
  value: A;
}
interface Failure<E> {
  status: 'failure';
  error: E;
}

export type ValidationError = {
  message: string;
  path: string;
};

export type Result<A, E> = Success<A> | Failure<E>;

export type ModelValidation<M extends Record<string, unknown>> = Result<
  M,
  ValidationError[]
>;

export type FormatZodMessage = (issue: z.ZodIssue) => ValidationError;
