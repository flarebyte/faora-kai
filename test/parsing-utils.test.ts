import {test} from 'node:test';
import assert from 'node:assert';
import {z} from 'zod';
import {stringFields} from '../src/primitive-fields.js';
import {isParsingSuccessful, safeParse} from '../src/parsing-utils.js';

const schema = z.object({
  name: stringFields.string1To10,
  tags: z.array(stringFields.string1To20).min(1),
});

type TestSchema = z.infer<typeof schema>;

test('safeParse should parse correct data', () => {
  const content = {
    name: 'some-name',
    tags: ['tag1'],
  };
  const result = safeParse<TestSchema>(content, {
    schema,
    formatting: 'standard',
  });
  assert.ok(Boolean(isParsingSuccessful(result)), '');
  assert.deepStrictEqual(result.status === 'success' && result.value, content);
});
