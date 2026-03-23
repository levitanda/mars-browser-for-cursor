import { describe, expect, it } from 'vitest';
import { runTool } from './mcp/tools.js';

describe('policy', () => {
  it('blocks destructive actions in read only', () => {
    const response = runTool({
      id: 'x',
      tool: 'page.click',
      args: {},
      safety: { sessionId: 's1', readOnly: true, approvalRequired: true, allowDomains: [], maxActions: 10, maxPages: 2 },
      client: { name: 'test', version: '1', clientId: 'c' }
    }, { emergencyStop: false, logs: [], version: '0.1.0' });
    expect(response.ok).toBe(false);
  });
});
