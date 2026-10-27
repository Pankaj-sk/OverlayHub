# OverlayHub

A small browser extension for Chromium browsers (Chrome, Edge, Brave). It
activates on GitHub repository pages. It reads the current `owner/repo` from the
tab URL. It then gives you one-click links to overlay tools that reuse that same
path on their own domain.

## The domain-swap idea

A GitHub repo has a stable address: `github.com/<owner>/<repo>`. Several tools
reuse that path on their own domain. You just change the domain and keep the
path. For example:

```
github.com/sherlock-project/sherlock      (the repo)
gitdiagram.com/sherlock-project/sherlock  (a diagram of it)
```

OverlayHub does this swap for you. No pasting.

## Tools in v1

| Tool | Domain | What it does |
|------|--------|--------------|
| GitDiagram | gitdiagram.com | Architecture diagram of the repo |
| GitIngest | gitingest.com | Repo packed into one text file for LLMs |
| DeepWiki | deepwiki.com | Generated wiki and Q&A |
| uithub | uithub.com | Repo-to-text view for prompts |
| GitHub.dev editor | github.dev | Open the repo in the web editor |

## Install (load unpacked)

1. Open `chrome://extensions` (or `edge://extensions`).
2. Turn on "Developer mode" (top right).
3. Click "Load unpacked".
4. Select the `OverlayHub` folder.

The OverlayHub icon appears in your toolbar.

## Use

**Toolbar popup**: open any GitHub repo page, then click the OverlayHub icon.
The popup lists each tool with its live swapped URL. Click a tool to open it in
a new tab.

**On-page button**: on a repo page, an "Overlays" button appears near the repo
header. Click it for the same menu. You can turn this off with the
`ENABLE_ON_PAGE_BUTTON` flag at the top of `content.js`.

When you are not on a repo page, the popup shows a short message instead.

## Privacy

OverlayHub is client-only. It has no backend. It reads only the active tab URL
to build the links. It sends nothing to any server. It opens new tabs. That is
all.

Permissions requested:

- `activeTab`: to read the current tab URL when you open the popup.
- host access to `https://github.com/*`: to show the on-page button.

## Project layout

```
OverlayHub/
  manifest.json   Manifest V3 config
  tools.js        shared logic: TOOLS, parseRepo, buildUrl
  popup.html      toolbar popup UI
  popup.js        popup logic
  content.js      optional on-page "Overlays" button
  icons/          16, 48, 128 px icons
  README.md
```

## Notes

- v1 targets Chromium browsers. A Firefox build is later work.
- The spec for this extension lives under `.kiro/specs/overlayhub-extension/`.
