# Requirements — OverlayHub Browser Extension

## Overview

OverlayHub is a browser extension for Chromium browsers (Chrome, Edge, Brave).
It activates on GitHub repository pages. It reads the current `owner/repo` path.
It then offers one-click links to overlay tools that reuse that same path on
their own domain. This is the "domain-swap" pattern. The user does not paste
any URL.

Source capture (Stage 1): Notion page "OverlayHub — GitHub Overlay Extension".

## Glossary

- **Overlay tool**: a third-party website that takes a GitHub `owner/repo` path
  and builds a new view (diagram, text dump, wiki).
- **Domain swap**: replacing `github.com` in a URL with an overlay tool's
  domain, keeping the `/owner/repo` path.
- **Repo page**: a GitHub URL of the form `github.com/<owner>/<repo>` and its
  sub-pages (tree, blob, issues, and so on).

## User stories and acceptance criteria

### Story 1 — Detect a GitHub repo page

As a user, I want the extension to know when I am on a GitHub repo page, so the
tools apply to the right repository.

Acceptance criteria:

1. WHEN the active tab URL matches `https://github.com/<owner>/<repo>` THEN the
   extension SHALL treat the page as a repo page.
2. WHEN the URL is a sub-page such as `/tree`, `/blob`, `/issues`, or `/pulls`
   THEN the extension SHALL still extract the base `owner/repo`.
3. WHEN the URL is a non-repo GitHub page such as `github.com/settings` or a
   bare user profile `github.com/<user>` THEN the extension SHALL NOT treat it
   as a repo page.
4. WHEN the URL is not on `github.com` THEN the extension SHALL show an inactive
   state in the popup.

### Story 2 — List overlay tools in a popup

As a user, I want a toolbar popup that lists overlay tools with the swapped URL,
so I can see where each link goes before I click.

Acceptance criteria:

1. WHEN the user opens the popup on a repo page THEN the popup SHALL list each
   configured overlay tool with its name and one-line description.
2. WHEN the popup lists a tool THEN it SHALL show the live swapped URL built from
   the current `owner/repo`.
3. WHEN no repo is detected THEN the popup SHALL show a short message that the
   user must open a GitHub repo page.

### Story 3 — Open a tool

As a user, I want to open a tool in one click, so I reach the overlay fast.

Acceptance criteria:

1. WHEN the user clicks a tool entry THEN the extension SHALL open the swapped
   URL in a new browser tab.
2. WHEN the user clicks a tool entry THEN the current GitHub tab SHALL stay open.

### Story 4 — Optional on-page button

As a user, I want an "Overlays" button on the GitHub repo page, so I can reach
the tools without opening the toolbar popup.

Acceptance criteria:

1. WHEN the user is on a repo page AND the on-page button feature is enabled
   THEN the extension SHALL inject an "Overlays" button near the repo header.
2. WHEN the user clicks the injected button THEN the extension SHALL show the
   same tool list as the popup.
3. WHEN the page is not a repo page THEN the extension SHALL NOT inject a button.

### Story 5 — Privacy and permissions

As a user, I want the extension to stay minimal, so it is safe to install.

Acceptance criteria:

1. The extension SHALL request only the permissions it needs (`activeTab`, and
   host access to `github.com`).
2. The extension SHALL NOT send any page data to any server.
3. The extension SHALL read only the active tab URL to build links.

## Out of scope (v1)

- Firefox build (Manifest V3 for Firefox differs; handle later).
- A backend or marketplace with user accounts.
- A submit-a-tool form.
- Private-repo auth for the target tools (each tool handles its own auth).

## Open questions

- Final list of overlay tools to ship in v1. Default set: GitDiagram, GitIngest,
  DeepWiki, uithub, github.dev.
- Whether the on-page button ships in v1 or is deferred. Default: include it but
  keep it behind a simple flag so the popup works on its own.
