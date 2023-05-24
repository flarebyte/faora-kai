/* eslint-disable @typescript-eslint/no-floating-promises */
import {test} from 'node:test';
import {z} from 'zod';
import {stringFields} from '../src/primitive-fields.js';
import {safeParse} from '../src/parsing-utils.js';
import {assertSuccessfulResult, assertFailedResult} from './assert-utils.js';

const schema = z.object({
  name: stringFields.string1To10,
  tags: z.array(stringFields.string1To20).min(1),
  website: stringFields.string1To50.url(),
  color: z.enum(['blue', 'orange', 'red']).optional(),
});

type TestSchema = z.infer<typeof schema>;

const largeString = (count: number) => 'a'.repeat(count);

const assertOpts = {
  stringify: true,
};

const validContent = {
  name: 'some-tag',
  tags: ['tag1'],
  website: 'https://website.com',
};
test('safeParse should parse correct data', () => {
  const content = {
    ...validContent,
  };
  const result = safeParse<TestSchema>(content, {
    schema,
    formatting: 'standard',
  });
  assertSuccessfulResult(result, content, assertOpts);
});

test(
  'safeParse should reject string too small',
  () => {
    const content = {
      ...validContent,
      name: '',
    };
    const result = safeParse<TestSchema>(content, {
      schema,
      formatting: 'standard',
    });
    assertFailedResult(result, [
      {
        path: 'name',
        message:
          'The string for the field is too small; I would expect the minimum to be 1',
      },
    ]);
  },
  assertOpts
);

test('safeParse should reject string too big', () => {
  const content = {
    ...validContent,
    name: largeString(100),
  };
  const result = safeParse<TestSchema>(content, {
    schema,
    formatting: 'standard',
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
    formatting: 'standard',
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
    formatting: 'standard',
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
    formatting: 'standard',
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
