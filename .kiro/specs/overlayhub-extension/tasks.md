# Tasks — OverlayHub Browser Extension

Each task maps to a requirement. Check items off as they complete.

- [x] 1. Scaffold the project
  - Create the `OverlayHub/` folder and the file layout from the design.
  - Write `manifest.json` (Manifest V3) with `action`, `activeTab`,
    `host_permissions` for `github.com`, `content_scripts`, and icons.
  - _Requirements: 5.1_

- [x] 2. Build shared logic (`tools.js`)
  - Define the `TOOLS` array with the v1 default set.
  - Implement `parseRepo(url)` with the reserved-word and bare-profile rules.
  - Implement `buildUrl(tool, repo)` with the `github.dev` special case.
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 3. Build the toolbar popup
  - Write `popup.html` with a simple, accessible layout.
  - Write `popup.js`: read the active tab URL, call `parseRepo`, render rows.
  - Show the live swapped URL per tool.
  - Show the inactive / "open a repo" message when no repo is detected.
  - Wire a row click to open the swapped URL in a new tab.
  - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2_

- [x] 4. Build the optional on-page button (`content.js`)
  - Parse the repo from `location.href`; skip if none.
  - Inject an "Overlays" button near the repo header, with a fallback selector.
  - Build a dropdown from `TOOLS`; each item opens the swapped URL.
  - Guard against double-injection. Put the feature behind a flag.
  - _Requirements: 4.1, 4.2, 4.3_

- [x] 5. Add icons and README
  - Add 16/48/128 icons (simple placeholder art is fine for v1).
  - Write `README.md`: what it does, how to load unpacked, how to use.
  - _Requirements: 5.1, 5.2, 5.3_

- [x] 6. Verify
  - Confirm `parseRepo` and `buildUrl` behave for: valid repo, sub-page,
    reserved word, bare profile, non-GitHub URL.
  - Load unpacked in Chrome/Edge and confirm the popup and the on-page button.
  - Optional: Playwright check of the popup rendering and swapped URLs.
  - _Requirements: all_

- [x] 7. Ship to GitHub
  - Create a fresh public repo `OverlayHub` under Pankaj-sk.
  - Push the extension plus the spec (`.kiro/specs/overlayhub-extension/`).
  - _Requirements: n/a (delivery)_
