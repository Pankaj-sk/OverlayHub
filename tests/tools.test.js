/* Simple assertion test for OverlayHub shared logic. Run: node tests/tools.test.js */
var assert = require("assert");
var path = require("path");

// tools.js assigns to window / globalThis and also sets module.exports.
var T = require(path.join(__dirname, "..", "tools.js"));

function eq(actual, expected, label) {
  assert.deepStrictEqual(actual, expected, label);
  console.log("  ok:", label);
}

console.log("parseRepo:");
eq(T.parseRepo("https://github.com/sherlock-project/sherlock"),
   { owner: "sherlock-project", repo: "sherlock" }, "valid repo");
eq(T.parseRepo("https://github.com/sherlock-project/sherlock/tree/master"),
   { owner: "sherlock-project", repo: "sherlock" }, "sub-page /tree");
eq(T.parseRepo("https://github.com/sherlock-project/sherlock/blob/master/a.py"),
   { owner: "sherlock-project", repo: "sherlock" }, "sub-page /blob");
eq(T.parseRepo("https://github.com/settings"), null, "reserved word settings");
eq(T.parseRepo("https://github.com/Pankaj-sk"), null, "bare profile");
eq(T.parseRepo("https://example.com/a/b"), null, "non-github host");
eq(T.parseRepo("https://github.com/owner/repo.git"),
   { owner: "owner", repo: "repo" }, "trailing .git stripped");
eq(T.parseRepo(""), null, "empty string");
eq(T.parseRepo(null), null, "null input");

console.log("buildUrl:");
var repo = { owner: "sherlock-project", repo: "sherlock" };
var gitdiagram = T.TOOLS.find(function (t) { return t.id === "gitdiagram"; });
var githubdev = T.TOOLS.find(function (t) { return t.id === "githubdev"; });
eq(T.buildUrl(gitdiagram, repo),
   "https://gitdiagram.com/sherlock-project/sherlock", "gitdiagram swap");
eq(T.buildUrl(githubdev, repo),
   "https://github.dev/sherlock-project/sherlock", "github.dev swap");

console.log("TOOLS count:", T.TOOLS.length);
assert.strictEqual(T.TOOLS.length, 5, "expected 5 tools");
console.log("  ok: 5 tools present");

console.log("\nALL ASSERTIONS PASSED");
