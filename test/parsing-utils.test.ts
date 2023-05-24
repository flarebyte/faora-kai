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
});

type TestSchema = z.infer<typeof schema>;

const largeString = (count: number) => 'a'.repeat(count);

test('safeParse should parse correct data', () => {
  const content = {
    name: 'some-tag',
    tags: ['tag1'],
    website: 'https://website.com',
  };
  const result = safeParse<TestSchema>(content, {
    schema,
    formatting: 'standard',
  });
  assertSuccessfulResult(result, content);
});

test('safeParse should reject string too small', () => {
  const content = {
    name: '',
    tags: ['tag1'],
    website: 'https://website.com',
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
});

test('safeParse should reject string too big', () => {
  const content = {
    name: largeString(100),
    tags: ['tag1'],
    website: 'https://website.com',
  };
  const result = safeParse<TestSchema>(content, {
    schema,
    formatting: 'standard',
  });
  assertFailedResult(result, [
    {
      path: 'name',
      message:
        'The string for the field is too big; I would expect the maximum to be 10',
    },
  ]);
});
