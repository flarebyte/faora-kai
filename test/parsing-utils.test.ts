/* eslint-disable @typescript-eslint/no-floating-promises */
import {describe, test} from 'node:test';
import {z} from 'zod';
import {stringFields} from '../src/primitive-fields.js';
import {safeParse} from '../src/parsing-utils.js';
import {assertSuccessfulResult, assertFailedResult} from './assert-utils.js';

const schema = z.object({
  name: stringFields.string1To10,
  tags: z.array(stringFields.string1To20).min(1),
});

type TestSchema = z.infer<typeof schema>;

describe('safeParse', () => {
  test('safeParse should parse correct data', () => {
    const content = {
      name: 'some-name',
      tags: ['tag1'],
    };
    const result = safeParse<TestSchema>(content, {
      schema,
      formatting: 'standard',
    });
    assertSuccessfulResult(result, content);
  });

  test('safeParse should reject invalid data', () => {
    const content = {
      name: '',
      tags: ['tag1'],
    };
    const result = safeParse<TestSchema>(content, {
      schema,
      formatting: 'standard',
    });
    assertFailedResult(result, []);
  });
});
