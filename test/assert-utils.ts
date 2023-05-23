import {AssertionError} from 'node:assert/strict';
import {type Result} from '../src/model.js';

export function assertSuccessfulResult<A, E>(
  actual: Result<A, E>,
  expected: A
) {
  if (actual.status !== 'success') {
    throw new AssertionError({
      actual: actual.status,
      expected: 'success',
      message: `Expected result to be a success. Got ${JSON.stringify(
        actual.error
      )}`,
    });
  }

  const jsonActual = JSON.stringify(actual.value);
  const jsonExpected = JSON.stringify(expected);
  if (jsonExpected !== jsonActual) {
    throw new AssertionError({
      actual: jsonActual,
      expected: jsonExpected,
      message: `Expected equality. Got ${jsonActual}`,
    });
  }
}

export function assertFailedResult<A, E>(actual: Result<A, E>, expected: E) {
  if (actual.status !== 'failure') {
    throw new Error('Expected result to be a failure but was successful');
  }

  const jsonActual = JSON.stringify(actual.error);
  const jsonExpected = JSON.stringify(expected);
  if (jsonExpected !== jsonActual) {
    throw new AssertionError({
      actual: jsonActual,
      expected: jsonExpected,
      message: `Expected error equality. Got ${jsonActual}`,
    });
  }
}
