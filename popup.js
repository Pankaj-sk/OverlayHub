/* OverlayHub popup logic. Reads the active tab, renders the tool list. */
(function () {
  "use strict";

  var T = window.OverlayHubTools;

  function openUrl(url) {
    chrome.tabs.create({ url: url });
  }

  function renderTools(repo) {
    var list = document.getElementById("tool-list");
    var empty = document.getElementById("empty");
    var subtitle = document.getElementById("subtitle");

    list.innerHTML = "";

    if (!repo) {
      empty.hidden = false;
      list.hidden = true;
      subtitle.textContent = "No repository detected";
      return;
    }

    empty.hidden = true;
    list.hidden = false;
    subtitle.textContent = repo.owner + "/" + repo.repo;

    T.TOOLS.forEach(function (tool) {
      var url = T.buildUrl(tool, repo);

      var li = document.createElement("li");
      var a = document.createElement("a");
      a.className = "tool";
      a.href = url;
      a.setAttribute("role", "button");
      a.setAttribute("aria-label", "Open " + tool.name + " for " + repo.owner + "/" + repo.repo);

      var name = document.createElement("div");
      name.className = "tool-name";
      name.textContent = tool.name;

      var desc = document.createElement("div");
      desc.className = "tool-desc";
      desc.textContent = tool.desc;

      var urlEl = document.createElement("div");
      urlEl.className = "tool-url";
      urlEl.textContent = url.replace(/^https:\/\//, "");

      a.appendChild(name);
      a.appendChild(desc);
      a.appendChild(urlEl);

      a.addEventListener("click", function (e) {
        e.preventDefault();
        openUrl(url);
      });

      li.appendChild(a);
      list.appendChild(li);
    });
  }

  function init() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var tabUrl = tabs && tabs[0] ? tabs[0].url : null;
      var repo = T.parseRepo(tabUrl);
      renderTools(repo);
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
