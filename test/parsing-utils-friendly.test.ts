/* eslint-disable @typescript-eslint/no-floating-promises */
import {test} from 'node:test';
import {safeParse} from '../src/parsing-utils.js';
import {assertSuccessfulResult, assertFailedResult} from './assert-utils.js';
import {
  validContent,
  type TestSchema,
  assertOpts,
  largeString,
  schema,
} from './fixture-content.js';

test('safeParse should parse correct data', () => {
  const content = {
    ...validContent,
  };
  const result = safeParse<TestSchema>(content, {
    schema,
    formatting: 'human-friendly',
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
    formatting: 'human-friendly',
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
    formatting: 'human-friendly',
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

test('safeParse should reject string with custom single line test', () => {
  const content = {
    ...validContent,
    oneLine: 'never\ntwo lines',
  };
  const result = safeParse<TestSchema>(content, {
    schema,
    formatting: 'human-friendly',
  });
  assertFailedResult(
    result,
    [
      {
        path: 'oneLine',
        message:
          'The custom validation function did not pass; oneLine should be a single line',
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
    formatting: 'human-friendly',
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
    formatting: 'human-friendly',
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
    formatting: 'human-friendly',
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
    formatting: 'human-friendly',
  });
  assertFailedResult(
    result,
    [
      {
        path: 'website',
        message: 'The string for the field is invalid; Invalid url',
      },
      {
        path: 'website',
        message:
          'The string for the field is invalid; Invalid input: must start with "https://"',
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
    formatting: 'human-friendly',
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

test('safeParse should reject number under the minimum', () => {
  const content = {
    ...validContent,
    rank: 1,
  };
  const result = safeParse<TestSchema>(content, {
    schema,
    formatting: 'human-friendly',
  });
  assertFailedResult(
    result,
    [
      {
        path: 'rank',
        message:
          'The number for the field is too small; I would expect the minimum to be 100',
      },
      {
        path: 'rank',
        message:
          'The number is not the right multiple of; Number must be a multiple of 3',
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
    formatting: 'human-friendly',
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
        message:
          'The number is not the right multiple of; Number must be a multiple of 3',
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
    formatting: 'human-friendly',
  });
  assertFailedResult(
    result,
    [
      {
        path: 'negRank',
        message:
          'The number for the field is too small; I would expect the minimum to be -9007199254740991',
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
    formatting: 'human-friendly',
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
    formatting: 'human-friendly',
  });
  assertFailedResult(
    result,
    [
      {
        path: 'jour',
        message:
          'The union for the field is invalid; I would review jour,lundi or jour,mardi',
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
    formatting: 'human-friendly',
  });
  assertFailedResult(
    result,
    [
      {
        path: 'activities.longlonglonglongKey',
        message:
          'The string for the field is too big; I would expect the maximum to be 10',
      },
    ],
    assertOpts
  );
});
