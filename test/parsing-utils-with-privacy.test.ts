/* eslint-disable @typescript-eslint/no-floating-promises */
import {test} from 'node:test';
import {safeParse} from '../src/parsing-utils.js';
import {assertSuccessfulResult, assertFailedResult} from './assert-utils.js';
import {
  schema,
  validContent,
  type TestSchema,
  assertOpts,
  largeString,
} from './fixture-content.js';

test('safeParse should parse correct data', () => {
  const content = {
    ...validContent,
  };
  const result = safeParse<TestSchema>(content, {
    schema,
    formatting: 'privacy-first',
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
    formatting: 'privacy-first',
  });
  assertFailedResult(
    result,
    [
      {
        path: 'name',
        message: 'The value for the field is too small; Type is string',
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
    formatting: 'privacy-first',
  });
  assertFailedResult(
    result,
    [
      {
        path: 'name',
        message: 'The value for the field is too big; Type is string',
      },
    ],
    assertOpts
  );
});

test('safeParse should reject string with custom single line test', () => {
  const content = {
    ...validContent,
    oneLine: 'never\ntwo lines',
  };
  const result = safeParse<TestSchema>(content, {
    schema,
    formatting: 'privacy-first',
  });
  assertFailedResult(
    result,
    [
      {
        path: 'oneLine',
        message: 'The custom validation function did not pass',
      },
    ],
    assertOpts
  );
});

test('safeParse should reject string with custom single line test', () => {
  const content = {
    ...validContent,
    someDate: new Date('not-a-date'),
  };
  const result = safeParse<TestSchema>(content, {
    schema,
    formatting: 'privacy-first',
  });
  assertFailedResult(
    result,
    [
      {
        path: 'someDate',
        message: 'The date is invalid',
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
    formatting: 'privacy-first',
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
    formatting: 'privacy-first',
  });
  assertFailedResult(
    result,
    [
      {
        path: 'color',
        message: 'The enum for the field is invalid',
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
    formatting: 'privacy-first',
  });
  assertFailedResult(
    result,
    [
      {
        path: 'website',
        message: 'The string for the field is invalid; It should be a url',
      },
      {
        path: 'website',
        message:
          'The string for the field is invalid; It should have startsWith',
      },
    ],
    assertOpts
  );
});

test('safeParse should reject number under the minimum', () => {
  const content = {
    ...validContent,
    rank: 1,
  };
  const result = safeParse<TestSchema>(content, {
    schema,
    formatting: 'privacy-first',
  });
  assertFailedResult(
    result,
    [
      {
        path: 'rank',
        message: 'The value for the field is too small; Type is number',
      },
      {
        path: 'rank',
        message: 'The number is not the right multiple of',
      },
    ],
    assertOpts
  );
});

test('safeParse should reject number that are not finite', () => {
  const content = {
    ...validContent,
    rank: Number.POSITIVE_INFINITY,
  };
  const result = safeParse<TestSchema>(content, {
    schema,
    formatting: 'privacy-first',
  });
  assertFailedResult(
    result,
    [
      {
        path: 'rank',
        message:
          'The type for the field is invalid; I would expect integer instead of float',
      },
      {
        path: 'rank',
        message: 'The number is not the right multiple of',
      },
      {
        path: 'rank',
        message: 'The number is not finite',
      },
    ],
    assertOpts
  );
});

test('safeParse should reject number that beyond safe integer', () => {
  const content = {
    ...validContent,
    negRank: Number.MIN_SAFE_INTEGER - 1,
  };
  const result = safeParse<TestSchema>(content, {
    schema,
    formatting: 'privacy-first',
  });
  assertFailedResult(
    result,
    [
      {
        path: 'negRank',
        message: 'The value for the field is too small; Type is number',
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
    formatting: 'privacy-first',
  });
  assertFailedResult(
    result,
    [
      {
        path: 'kind',
        message: 'The literal for the field is invalid',
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
    formatting: 'privacy-first',
  });
  assertFailedResult(
    result,
    [
      {
        path: 'day.kind',
        message: 'The union discriminator for the object is invalid',
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
    formatting: 'privacy-first',
  });
  assertFailedResult(
    result,
    [
      {
        path: 'jour',
        message: 'The union for the field is invalid',
      },
    ],
    assertOpts
  );
});

test('safeParse should reject invalid keys', () => {
  const content = {
    ...validContent,
    activities: {
      longlonglonglongKey: {
        title: 'Such a long key',
      },
    },
  };
  const result = safeParse<TestSchema>(content, {
    schema,
    formatting: 'privacy-first',
  });
  assertFailedResult(
    result,
    [
      {
        path: 'activities.longlonglonglongKey',
        message: 'The value for the field is too big; Type is string',
      },
    ],
    assertOpts
  );
});
