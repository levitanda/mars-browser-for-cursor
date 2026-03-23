import { describe, expect, it } from 'vitest';
import { __test_makeResponse } from './background/service-worker.js';

describe('service worker helper', () => {
  it('returns trace response', () => {
    const r = __test_makeResponse('1');
    expect(r.ok).toBe(true);
    expect(r.id).toBe('1');
  });
});
