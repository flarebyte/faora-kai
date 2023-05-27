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
        message: 'The string for the field is too small',
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
        message: 'The string for the field is too big',
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
    formatting: 'privacy-aware',
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
    formatting: 'privacy-aware',
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
    formatting: 'privacy-aware',
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
