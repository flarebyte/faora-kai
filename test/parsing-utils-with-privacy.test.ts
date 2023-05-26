/* eslint-disable @typescript-eslint/no-floating-promises */
import {test} from 'node:test';
import {z} from 'zod';
import {stringFields} from '../src/primitive-fields.js';
import {safeParse} from '../src/parsing-utils.js';
import {assertSuccessfulResult, assertFailedResult} from './assert-utils.js';

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

const schema = z.object({
  kind: z.literal('test'),
  name: stringFields.string1To10,
  tags: z.array(stringFields.string1To20).min(1),
  website: stringFields.string1To50.url(),
  color: z.enum(['blue', 'orange', 'red']).optional(),
  day: dayUnionField,
  jour: jourUnionField,
});

type TestSchema = z.infer<typeof schema>;

const largeString = (count: number) => 'a'.repeat(count);

const assertOpts = {
  stringify: true,
};

const validContent: TestSchema = {
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
test('safeParse should parse correct data', () => {
  const content = {
    ...validContent,
  };
  const result = safeParse<TestSchema>(content, {
    schema,
    formatting: 'privacy-aware',
  });
  assertSuccessfulResult(result, content, assertOpts);
});

test('safeParse should reject string too small', () => {
  const content = {
    ...validContent,
    name: '',
  };
  const result = safeParse<TestSchema>(content, {
    schema,
    formatting: 'privacy-aware',
  });
  assertFailedResult(
    result,
    [
      {
        path: 'name',
        message:
          'The string for the field is too small; I would expect the minimum to be 1',
      },
    ],
    assertOpts
  );
});

test('safeParse should reject string too big', () => {
  const content = {
    ...validContent,
    name: largeString(100),
  };
  const result = safeParse<TestSchema>(content, {
    schema,
    formatting: 'privacy-aware',
  });
  assertFailedResult(
    result,
    [
      {
        path: 'name',
        message:
          'The string for the field is too big; I would expect the maximum to be 10',
      },
    ],
    assertOpts
  );
});

test('safeParse should reject incorrect type', () => {
  const content = {
    ...validContent,
    name: 18,
  };
  const result = safeParse<TestSchema>(content, {
    schema,
    formatting: 'privacy-aware',
  });
  assertFailedResult(
    result,
    [
      {
        path: 'name',
        message:
          'The type for the field is invalid; I would expect string instead of number',
      },
    ],
    assertOpts
  );
});

test('safeParse should reject invalid enum', () => {
  const content = {
    ...validContent,
    color: 'purple',
  };
  const result = safeParse<TestSchema>(content, {
    schema,
    formatting: 'privacy-aware',
  });
  assertFailedResult(
    result,
    [
      {
        path: 'color',
        message:
          'The enum for the field is invalid; I would expect any of blue,orange,red instead of purple',
      },
    ],
    assertOpts
  );
});

test('safeParse should reject invalid url', () => {
  const content = {
    ...validContent,
    website: 'not-a-website.com',
  };
  const result = safeParse<TestSchema>(content, {
    schema,
    formatting: 'privacy-aware',
  });
  assertFailedResult(
    result,
    [
      {
        path: 'website',
        message: 'The string for the field is invalid; Invalid url and url',
      },
    ],
    assertOpts
  );
});

test('safeParse should reject invalid literal', () => {
  const content = {
    ...validContent,
    kind: 'not-supported',
  };
  const result = safeParse<TestSchema>(content, {
    schema,
    formatting: 'privacy-aware',
  });
  assertFailedResult(
    result,
    [
      {
        path: 'kind',
        message: 'The literal for the field is invalid; I would expect test',
      },
    ],
    assertOpts
  );
});

test('safeParse should reject invalid discriminatedUnion', () => {
  const content = {
    ...validContent,
    day: {
      kind: 'sunday',
      sunday: 'dimanche',
    },
  };
  const result = safeParse<TestSchema>(content, {
    schema,
    formatting: 'privacy-aware',
  });
  assertFailedResult(
    result,
    [
      {
        path: 'day.kind',
        message:
          'The union discriminator for the object is invalid; I would expect any of monday,tuesday',
      },
    ],
    assertOpts
  );
});

test('safeParse should reject invalid union', () => {
  const content = {
    ...validContent,
    jour: {
      jeudi: 'thursday',
    },
  };
  const result = safeParse<TestSchema>(content, {
    schema,
    formatting: 'privacy-aware',
  });
  assertFailedResult(
    result,
    [
      {
        path: 'jour',
        message:
          'The union for the field is invalid; I would check Required,Required',
      },
    ],
    assertOpts
  );
});
