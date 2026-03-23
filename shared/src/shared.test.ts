import { describe, expect, it } from 'vitest';
import { mcpRequestSchema, toolNames } from './index.js';

describe('shared schemas', () => {
  it('validates request', () => {
    const parsed = mcpRequestSchema.parse({
      id: '1', tool: toolNames[0], args: {},
      safety: { sessionId: 's1', readOnly: true, approvalRequired: false, allowDomains: [], maxActions: 1, maxPages: 1 },
      client: { name: 't', version: '1', clientId: 'c' }
    });
    expect(parsed.id).toBe('1');
  });
});
