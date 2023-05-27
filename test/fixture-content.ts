import {z} from 'zod';
import {stringFields} from '../src/primitive-fields.js';
import {isSingleLine} from '../src/field-utils.js';

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

const activity = z.object({
  title: stringFields.string1To30,
});

export const schema = z.object({
  kind: z.literal('test'),
  name: stringFields.string1To10,
  tags: z.array(stringFields.string1To20).min(1),
  website: stringFields.string1To50.url().startsWith('https://'),
  color: z.enum(['blue', 'orange', 'red']).optional(),
  day: dayUnionField,
  jour: jourUnionField,
  rank: z.number().int().gt(100).multipleOf(3).finite(),
  negRank: z.number().negative().safe(),
  oneLine: z
    .string()
    .refine(isSingleLine, {message: 'oneLine should be a single line'}),
  someDate: z.date(),
  activities: z.record(stringFields.string1To10, activity),
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
  rank: 333,
  negRank: -1,
  oneLine: 'always looking for a cunning plan',
  someDate: new Date('1900-01-01'),
  activities: {
    fencing: {
      title: 'Sabre fencing',
    },
  },
};
