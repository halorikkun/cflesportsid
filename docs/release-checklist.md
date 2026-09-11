# Step 15 — Final testing, performance, SEO and production cleanup

Status: local testing, SEO foundations and repository cleanup completed on 11 September 2026. Measured performance audit and post-deployment verification remain pending.

## Verified

- 30 automated tests pass (statistics, historical team attribution, content validation, bracket rules, veto configuration and session switching).
- Data checker: 122 valid records, no errors or warnings.
- Production build: 131 HTML pages.
- `npm run build:check`: all built pages checked for missing internal links/assets, duplicate IDs, page descriptions and canonical tags; no issues.
- All 12 page types checked for page-level overflow at 320px and 768px using the production preview; no overflow. The same page types were checked at 390px in development.
- Desktop tournament header visually reviewed at 1366px.
- Browser checks: team/player searches, upcoming-match empty state, map sorting in both directions, map history tab, mobile menu toggle and Escape, scrim start and first ban, player comparison selection.
- No console errors observed in the final tablet page sweep. This is a smoke test, not exhaustive coverage of every interaction or device.

## Changes

- Shared descriptions, canonical URLs, Open Graph and Twitter metadata; corrected favicon declaration.
- Dynamic sitemap and robots.txt; legacy tournament alias points to the canonical tournament URL.
- Custom noindex 404 page.
- Skip-to-content link, reduced-motion support, accessible names for filters, hidden mobile navigation excluded from keyboard focus, Escape closes menu.
- ANV and TVJ Ghoib explicitly use the existing default logo, avoiding missing-file requests.
- README updated to current data-entry workflow.
- Added `.gitignore`; removed `node_modules`, `dist` and `.astro` from Git tracking while preserving local files. These removals are staged; source edits still need to be included in the user's eventual commit.
- Added `npm run build:check` to inspect generated output after building.

## Still pending

1. Measured performance audit with Chrome DevTools: the required tool is unavailable in this session, so no Lighthouse score, LCP, CLS, INP or claimed speed improvement is reported. Images already use WebP; no speculative asset rewrite was made.
2. Push/deploy by the user, then verify the deployed site, sitemap, robots.txt, 404 status, metadata and cache behavior. Nothing has been pushed by the agent.
3. Submit the sitemap in the owner's Google Search Console, if not already submitted. Requires access to that account.

The web-perf skill requires a Chrome DevTools MCP connection for measurement. Suggested MCP configuration from that skill:

```json
{
  "chrome-devtools": {
    "type": "local",
    "command": ["npx", "-y", "chrome-devtools-mcp@latest"]
  }
}
```

## Intentionally deferred

- Multiple regions: Indonesia only.
- Qualification priority changes for tournament winners outside the top four, as previously requested.

## Repeat before release

```sh
npm run data:check
npm test
npm run build
npm run build:check
npm run preview
```
