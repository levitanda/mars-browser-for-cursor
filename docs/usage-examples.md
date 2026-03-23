# Usage examples

## Manual QA flow
1. Start demo app:
   ```bash
   pnpm --filter @mars/demo-app dev
   ```
2. Open `http://localhost:3000`
3. In your MCP client ask:
   - "Open localhost:3000 and verify signup flow"
   - "Click Save and report console errors"
   - "Generate a QA report in markdown"

## Debugging UI regressions
- "Select the checkout modal and verify it becomes visible after clicking Open modal"
- "Capture a screenshot and list failed network requests"

## Structured extraction
- "Extract table rows into JSON from the current page"
- "Extract all links and image metadata from current tab"

## Safe read-only session
- Enable **Read-only mode** in popup
- Ask:
  - "Get current URL, title, and first 500 chars of page text"
  - "Check whether selector #signup is visible"
