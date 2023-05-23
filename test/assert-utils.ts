import assert from 'node:assert/strict';
import {type Result} from '../src/model.js';

export function assertSuccessfulResult<A, E>(
  actual: Result<A, E>,
  expected: A
) {
  if (actual.status !== 'success') {
    assert.strictEqual(actual.status, 'success');
    return;
  }

  const jsonActual = JSON.stringify(actual.value);
  const jsonExpected = JSON.stringify(expected);
  if (jsonExpected !== jsonActual) {
    assert.strictEqual(jsonActual, jsonExpected);
  }
}

export function assertFailedResult<A, E>(actual: Result<A, E>, expected: E) {
  if (actual.status !== 'failure') {
    assert.strictEqual(actual.status, 'failure');
    return;
  }

  const jsonActual = JSON.stringify(actual.error);
  const jsonExpected = JSON.stringify(expected);
  if (jsonExpected !== jsonActual) {
    assert.strictEqual(jsonActual, jsonExpected);
  }
}
