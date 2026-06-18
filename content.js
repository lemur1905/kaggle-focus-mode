(function () {
  "use strict";

  let savedScrollTop = 0;
  let focusActive = false;

  function findPageContentWrapper() {
    // Kaggle pages (competitions, notebooks, datasets, etc.) share a common pattern:
    // Inside #site-content, a wrapper div contains:
    //   [spacer, banner, spacer, tab bar, spacer?, content]
    // where the last child is the main content area and is much taller than the rest.
    // We find this wrapper by checking .competition first, then falling back to a
    // generic search down from #site-content for a node matching this pattern.
    const comp = document.querySelector(".competition");
    if (comp && comp.firstElementChild) {
      const inner = comp.firstElementChild;
      if (inner.children.length >= 4) return inner;
    }

    // Generic fallback: walk down single-child paths from #site-content
    // until we find a node with 4+ children where the last is the tallest
    const siteContent = document.getElementById("site-content");
    if (!siteContent) return null;

    let el = siteContent;
    for (let depth = 0; depth < 6; depth++) {
      const children = el.children;
      if (children.length >= 4) {
        const last = children[children.length - 1];
        const lastHeight = last.getBoundingClientRect().height;
        const othersMaxHeight = Array.from(children).slice(0, -1)
          .reduce((max, c) => Math.max(max, c.getBoundingClientRect().height), 0);
        if (lastHeight > 200 && lastHeight > othersMaxHeight * 2) {
          return el;
        }
      }
      // Follow single-child (or near-single) path downward
      if (children.length === 1) {
        el = children[0];
      } else if (children.length === 2 && children[0].getBoundingClientRect().height < 5) {
        el = children[1];
      } else {
        break;
      }
    }
    return null;
  }

  function tryMarkGridSidebar(el) {
    if (getComputedStyle(el).display !== "grid") return false;

    // Check for named sidebar column/area (works even when grid collapses to 1 column)
    for (var child of el.children) {
      var col = getComputedStyle(child).gridColumn;
      var area = getComputedStyle(child).gridArea;
      if ((col && col.includes("sidebar")) || (area && area.includes("sidebar"))) {
        el.setAttribute("data-kaggle-focus", "grid");
        child.setAttribute("data-kaggle-focus", "sidebar");
        return true;
      }
    }

    // Fallback for grids without named areas: find a narrow right-side child (~230px)
    var cols = getComputedStyle(el).gridTemplateColumns.split(" ");
    if (cols.length >= 2) {
      var gridWidth = el.getBoundingClientRect().width;
      for (var child of el.children) {
        var childWidth = child.getBoundingClientRect().width;
        if (childWidth > 0 && childWidth < gridWidth * 0.4 && childWidth < 300) {
          el.setAttribute("data-kaggle-focus", "grid");
          child.setAttribute("data-kaggle-focus", "sidebar");
          return true;
        }
      }
    }
    return false;
  }

  function findSidebarInContent(contentEl) {
    // Check the content element itself first (overview tab has grid as the content child)
    if (tryMarkGridSidebar(contentEl)) return;

    // Then search descendants
    var walker = document.createTreeWalker(contentEl, NodeFilter.SHOW_ELEMENT);
    while (walker.nextNode()) {
      if (tryMarkGridSidebar(walker.currentNode)) return;
    }
  }

  function enableFocusMode() {
    const siteContent = document.getElementById("site-content");
    if (siteContent) {
      savedScrollTop = siteContent.scrollTop;
    }

    const inner = findPageContentWrapper();
    if (inner) {
      // Mark all children except the last (content area) as chrome
      const children = inner.children;
      const contentChild = children[children.length - 1];
      for (const child of children) {
        if (child === contentChild) break;
        child.setAttribute("data-kaggle-focus", "chrome");
      }
      // Look for sidebar grid within the content area
      findSidebarInContent(contentChild);
    }

    document.documentElement.classList.add("kaggle-focus-mode");
    focusActive = true;
  }

  function disableFocusMode() {
    document.documentElement.classList.remove("kaggle-focus-mode");

    // Remove all data-kaggle-focus attributes
    const marked = document.querySelectorAll("[data-kaggle-focus]");
    for (const el of marked) {
      el.removeAttribute("data-kaggle-focus");
    }

    // Restore scroll position
    const siteContent = document.getElementById("site-content");
    if (siteContent) {
      siteContent.scrollTop = savedScrollTop;
    }

    focusActive = false;
  }

  document.addEventListener("keydown", function (e) {
    // Cmd+; on Mac, Ctrl+; on other platforms
    if ((e.metaKey || e.ctrlKey) && e.key === ";") {
      e.preventDefault();
      if (focusActive) {
        disableFocusMode();
      } else {
        enableFocusMode();
      }
    }
  });
})();
