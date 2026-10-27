/*
 * OverlayHub content script.
 * Injects an "Overlays" button on GitHub repo pages.
 * Reuses window.OverlayHubTools (loaded from tools.js before this file).
 */
(function () {
  "use strict";

  // Feature flag: set to false to disable the on-page button.
  var ENABLE_ON_PAGE_BUTTON = true;

  var SENTINEL_ID = "overlayhub-root";
  var T = window.OverlayHubTools;

  if (!ENABLE_ON_PAGE_BUTTON || !T) {
    return;
  }

  function buildMenu(repo) {
    var menu = document.createElement("div");
    menu.id = "overlayhub-menu";
    menu.style.cssText = [
      "position:absolute",
      "z-index:9999",
      "margin-top:4px",
      "min-width:240px",
      "background:var(--bgColor-default,#fff)",
      "border:1px solid var(--borderColor-default,#d1d9e0)",
      "border-radius:8px",
      "box-shadow:0 8px 24px rgba(0,0,0,0.2)",
      "padding:6px",
      "display:none"
    ].join(";");

    T.TOOLS.forEach(function (tool) {
      var url = T.buildUrl(tool, repo);
      var item = document.createElement("a");
      item.href = url;
      item.target = "_blank";
      item.rel = "noopener";
      item.textContent = tool.name + " \u2014 " + tool.desc;
      item.style.cssText = [
        "display:block",
        "padding:8px 10px",
        "border-radius:6px",
        "font-size:12px",
        "color:var(--fgColor-default,#1f2328)",
        "text-decoration:none"
      ].join(";");
      item.addEventListener("mouseenter", function () {
        item.style.background = "var(--bgColor-muted,#f6f8fa)";
      });
      item.addEventListener("mouseleave", function () {
        item.style.background = "transparent";
      });
      menu.appendChild(item);
    });

    return menu;
  }

  function buildButton() {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Overlays";
    btn.className = "btn btn-sm";
    btn.setAttribute("aria-haspopup", "true");
    btn.style.cssText = "margin-left:8px;";
    return btn;
  }

  function findAnchor() {
    // Defensive: try a few known locations for the repo header action area.
    var selectors = [
      "ul.pagehead-actions",
      ".pagehead-actions",
      "[data-testid='repository-container-header']",
      ".file-navigation"
    ];
    for (var i = 0; i < selectors.length; i++) {
      var el = document.querySelector(selectors[i]);
      if (el) {
        return el;
      }
    }
    return null;
  }

  function inject() {
    // Skip if already injected.
    if (document.getElementById(SENTINEL_ID)) {
      return;
    }
    var repo = T.parseRepo(location.href);
    if (!repo) {
      return;
    }
    var anchor = findAnchor();
    if (!anchor) {
      return;
    }

    var root = document.createElement("div");
    root.id = SENTINEL_ID;
    root.style.cssText = "position:relative;display:inline-block;";

    var btn = buildButton();
    var menu = buildMenu(repo);

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      menu.style.display = menu.style.display === "none" ? "block" : "none";
    });

    document.addEventListener("click", function (e) {
      if (!root.contains(e.target)) {
        menu.style.display = "none";
      }
    });

    root.appendChild(btn);
    root.appendChild(menu);

    // pagehead-actions is a <ul>; wrap in <li> if so.
    if (anchor.tagName === "UL") {
      var li = document.createElement("li");
      li.appendChild(root);
      anchor.insertBefore(li, anchor.firstChild);
    } else {
      anchor.appendChild(root);
    }
  }

  // GitHub uses client-side navigation (Turbo). Re-check on load and on nav.
  inject();
  document.addEventListener("turbo:load", inject);
  document.addEventListener("pjax:end", inject);
})();
