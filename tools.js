/*
 * OverlayHub shared logic.
 * This file defines a single global: window.OverlayHubTools.
 * Both popup.js and content.js reuse it, so the logic lives in one place.
 *
 * It must run in three contexts:
 *   - the popup page (window exists)
 *   - a GitHub content script (window exists)
 *   - a Node.js test (no window; we fall back to globalThis)
 */
(function (root) {
  "use strict";

  // The v1 overlay tool set. Each tool reuses the /owner/repo path.
  var TOOLS = [
    {
      id: "gitdiagram",
      name: "GitDiagram",
      domain: "gitdiagram.com",
      desc: "Architecture diagram of the repo",
      needsRepo: true
    },
    {
      id: "gitingest",
      name: "GitIngest",
      domain: "gitingest.com",
      desc: "Repo packed into one text file for LLMs",
      needsRepo: true
    },
    {
      id: "deepwiki",
      name: "DeepWiki",
      domain: "deepwiki.com",
      desc: "Generated wiki and Q&A",
      needsRepo: true
    },
    {
      id: "uithub",
      name: "uithub",
      domain: "uithub.com",
      desc: "Repo-to-text view for prompts",
      needsRepo: true
    },
    {
      id: "githubdev",
      name: "GitHub.dev editor",
      domain: "github.dev",
      desc: "Open the repo in the web editor",
      needsRepo: true
    }
  ];

  // GitHub path segments that are not repo owners.
  var RESERVED = {
    settings: true,
    marketplace: true,
    notifications: true,
    explore: true,
    topics: true,
    sponsors: true,
    orgs: true,
    apps: true,
    about: true,
    features: true,
    pricing: true,
    login: true,
    join: true,
    search: true,
    new: true,
    dashboard: true,
    codespaces: true,
    pulls: true,
    issues: true
  };

  /*
   * parseRepo(urlString) -> { owner, repo } or null.
   * Accepts a github.com repo URL and its sub-pages.
   */
  function parseRepo(urlString) {
    if (!urlString) {
      return null;
    }
    var url;
    try {
      url = new URL(urlString);
    } catch (e) {
      return null;
    }
    if (url.hostname !== "github.com" && url.hostname !== "www.github.com") {
      return null;
    }
    var segments = url.pathname.split("/").filter(function (s) {
      return s.length > 0;
    });
    // Need at least owner and repo.
    if (segments.length < 2) {
      return null;
    }
    var owner = segments[0];
    var repo = segments[1];
    // Reject reserved first segments.
    if (RESERVED[owner.toLowerCase()]) {
      return null;
    }
    // Strip a trailing .git from the repo name.
    if (repo.length > 4 && repo.slice(-4) === ".git") {
      repo = repo.slice(0, -4);
    }
    if (repo.length === 0) {
      return null;
    }
    return { owner: owner, repo: repo };
  }

  /*
   * buildUrl(tool, repo) -> swapped URL string.
   * Default: https://<domain>/<owner>/<repo>.
   * github.dev is the same shape; kept explicit for clarity.
   */
  function buildUrl(tool, repo) {
    if (!tool || !repo || !repo.owner || !repo.repo) {
      return null;
    }
    if (tool.id === "githubdev") {
      return "https://github.dev/" + repo.owner + "/" + repo.repo;
    }
    return "https://" + tool.domain + "/" + repo.owner + "/" + repo.repo;
  }

  var api = { TOOLS: TOOLS, parseRepo: parseRepo, buildUrl: buildUrl };

  // Expose as a global so popup and content script share one copy.
  root.OverlayHubTools = api;

  // Support Node.js require() for the test script.
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
