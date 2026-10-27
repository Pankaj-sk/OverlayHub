# Design — OverlayHub Browser Extension

## Architecture

OverlayHub is a client-only Manifest V3 extension. It has no backend. It runs in
the browser and opens new tabs. Three parts do the work.

```
+---------------------+       reads URL        +--------------------+
|  Toolbar popup      | <--------------------- |  Active GitHub tab  |
|  (popup.html/.js)   |                        +--------------------+
|  - parse owner/repo |
|  - render tool list |  click -> chrome.tabs.create(swappedUrl)
+---------------------+
          ^
          | shares logic
          v
+---------------------+       injects button   +--------------------+
|  tools.js (shared)  | ---------------------> |  content.js on page |
|  - TOOLS config     |                        |  - "Overlays" button|
|  - parseRepo(url)   |                        |  - dropdown menu     |
|  - buildUrl(tool)   |                        +--------------------+
+---------------------+
```

## Components

### manifest.json (Manifest V3)

- `manifest_version`: 3
- `action`: declares the toolbar popup (`popup.html`).
- `permissions`: `["activeTab"]`.
- `host_permissions`: `["https://github.com/*"]`.
- `content_scripts`: runs `content.js` on `https://github.com/*` for the
  optional on-page button.
- `icons`: 16, 48, 128.

No `background` service worker is needed for v1. The popup and content script
cover all behavior. Keep it out unless a later feature needs it.

### tools.js (shared logic, no DOM)

Single source of truth, imported by both popup and content script.

- `TOOLS`: an array of tool definitions. Each entry:
  - `id`: short key (e.g. `gitdiagram`).
  - `name`: display name.
  - `domain`: the swap target (e.g. `gitdiagram.com`).
  - `desc`: one-line description.
  - `needsRepo`: boolean. True if the tool needs `owner/repo`; most do.
- `parseRepo(urlString)`: returns `{ owner, repo }` or `null`.
  - Accept `https://github.com/<owner>/<repo>` and sub-paths.
  - Reject reserved first segments: `settings`, `marketplace`, `notifications`,
    `explore`, `topics`, `sponsors`, `orgs`, `apps`, `about`, and similar.
  - Reject a bare profile (only one path segment).
- `buildUrl(tool, repo)`: returns the swapped URL string.
  - Default: `https://<tool.domain>/<owner>/<repo>`.
  - `github.dev` special case: `https://github.dev/<owner>/<repo>`.

### popup.html + popup.js

- On open, query the active tab URL with `chrome.tabs.query`.
- Call `parseRepo`. If null, show the inactive message (Story 2, AC3).
- If a repo is found, render one row per tool: name, description, and the live
  swapped URL (Story 2, AC1 and AC2).
- A row click calls `chrome.tabs.create({ url: swappedUrl })` (Story 3).

### content.js (optional on-page button)

- Run at `document_idle` on `github.com`.
- Call `parseRepo(location.href)`. If null, do nothing (Story 4, AC3).
- Inject an "Overlays" button near the repo header (the area by the Code
  button). Use a stable, defensive selector with a fallback, because GitHub
  markup changes.
- On click, show a small dropdown built from the same `TOOLS` list. Each item
  opens the swapped URL in a new tab via `window.open(url, '_blank')`.
- Guard against double-injection with a sentinel check.

## Default tool set (v1)

| id | name | domain | needs repo |
|----|------|--------|------------|
| gitdiagram | GitDiagram | gitdiagram.com | yes |
| gitingest | GitIngest | gitingest.com | yes |
| deepwiki | DeepWiki | deepwiki.com | yes |
| uithub | uithub | uithub.com | yes |
| githubdev | GitHub.dev editor | github.dev | yes |

## URL parsing rules

- Input: any `github.com` URL.
- Split the path into segments.
- Require at least two non-empty segments: `owner`, `repo`.
- Reject when the first segment is a GitHub reserved word (see list above).
- Strip a trailing `.git` from `repo` if present.
- Return `{ owner, repo }`.

## Error and edge handling

- Non-GitHub tab: popup shows inactive state.
- GitHub non-repo page: popup shows "open a repo" message.
- Missing repo header element: content script skips button injection, popup
  still works.
- Repo names with dots or dashes: allowed; only a trailing `.git` is stripped.

## Testing strategy

- Manual load: `chrome://extensions` -> Developer mode -> Load unpacked.
- Unit-level: `parseRepo` and `buildUrl` are pure functions. Cover with simple
  test cases (valid repo, sub-page, reserved word, bare profile, non-GitHub).
- UI check with Playwright: load the popup page, inject a fake tab URL, confirm
  the rendered rows and the swapped URLs. Confirm the inactive state message
  when no repo is present.

## File layout

```
OverlayHub/
  manifest.json
  popup.html
  popup.js
  tools.js
  content.js
  icons/
    icon16.png
    icon48.png
    icon128.png
  README.md
```

## Decisions carried from requirements

- Ship the on-page button in v1, behind a simple constant flag in `content.js`
  so the popup works even if the button is turned off.
- v1 targets Chromium only. Firefox is later work.
