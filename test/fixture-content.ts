import {z} from 'zod';
import {stringFields} from '../src/primitive-fields.js';

const dayUnionField = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('monday'),
    monday: stringFields.string1To10,
  }),
  z.object({
    kind: z.literal('tuesday'),
    tuesday: stringFields.string1To10,
  }),
]);
const jourUnionField = z.union([
  z.object({
    lundi: stringFields.string1To10,
  }),
  z.object({
    mardi: stringFields.string1To10,
  }),
]);
export const schema = z.object({
  kind: z.literal('test'),
  name: stringFields.string1To10,
  tags: z.array(stringFields.string1To20).min(1),
  website: stringFields.string1To50.url().startsWith('https://'),
  color: z.enum(['blue', 'orange', 'red']).optional(),
  day: dayUnionField,
  jour: jourUnionField,
});
export type TestSchema = z.infer<typeof schema>;
export const largeString = (count: number) => 'a'.repeat(count);
export const assertOpts = {
  stringify: true,
};
export const validContent: TestSchema = {
  kind: 'test',
  name: 'some-tag',
  tags: ['tag1'],
  website: 'https://website.com',
  day: {
    kind: 'monday',
    monday: 'lundi',
  },
  jour: {
    lundi: 'monday',
  },
};
