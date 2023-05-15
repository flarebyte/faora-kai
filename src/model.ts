import { z } from 'zod';

export type PrimitiveFieldValidator<K> = Record<K, z.ZodString>;
