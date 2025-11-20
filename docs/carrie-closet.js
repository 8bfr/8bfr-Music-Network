// Logic for carrie-closet.html
(function () {
  const gridEl   = document.getElementById("closetGrid");
  const countEl  = document.getElementById("closetItemCount");
  const filterEls = document.querySelectorAll("[data-filter]");
  const sortEl   = document.getElementById("closetSort");
  const searchEl = document.getElementById("closetSearch");

  // Pull catalog from global
  const ALL_ITEMS = Array.isArray(window.CARRIE_CLOSET_ALL)
    ? window.CARRIE_CLOSET_ALL.slice()
    : [];

  function renderGrid(items) {
    if (!gridEl) return;
    gridEl.innerHTML = "";

    // Count text
    if (countEl) {
      const total = ALL_ITEMS.length;
      const shown = items.length;

      if (!total) {
        countEl.textContent = "No closet items loaded.";
      } else if (shown === total) {
        countEl.textContent = shown + " items";
      } else {
        countEl.textContent = shown + " of " + total + " items";
      }
    }

    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "text-xs text-purple-200/80 col-span-full";
      empty.textContent = "No items match those filters yet.";
      gridEl.appendChild(empty);
      return;
    }

    items.forEach((item) => {
      const card = document.createElement("article");
      card.className =
        "rounded-xl border border-purple-600/40 bg-slate-950/70 p-2 flex flex-col gap-1 text-xs";

      const tagsHtml = (item.tags || [])
        .map(
          (tag) =>
            `<span class="px-1.5 py-0.5 rounded-full border border-slate-600/70 bg-slate-900/80 text-[9px] uppercase tracking-wide">${tag}</span>`
        )
        .join("");

      card.innerHTML = `
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-1.5">
            <span class="inline-flex items-center justify-center rounded-full bg-slate-900/80 border border-purple-500/60 text-[10px] px-2 py-0.5">
              ${item.categoryEmoji || "👗"} ${item.categoryLabel || ""}
            </span>
            <span class="text-[11px] font-semibold text-purple-50">${item.name}</span>
          </div>
          <span class="text-[11px] font-semibold text-amber-300">${item.cost} coins</span>
        </div>
        <p class="text-[10px] text-purple-200/80">
          ${item.desc}
        </p>
        <div class="flex items-center justify-between gap-2 mt-1">
          <div class="flex flex-wrap gap-1">
            ${tagsHtml}
          </div>
          <button
            type="button"
            class="inline-flex items-center rounded-full border border-emerald-400/70 bg-emerald-700/30 hover:bg-emerald-500/50 text-[10px] px-2 py-0.5"
          >
            Preview
          </button>
        </div>
      `;

      gridEl.appendChild(card);
    });
  }

  function applyFiltersAndSort() {
    let items = ALL_ITEMS.slice();

    // Category / tone filters
    let activeFilterBtn = Array.from(filterEls).find((btn) =>
      btn.classList.contains("active")
    );
    const filterVal = activeFilterBtn
      ? activeFilterBtn.getAttribute("data-filter")
      : "all";

    if (filterVal && filterVal !== "all") {
      // category-based filters
      if (
        filterVal === "outfit" ||
        filterVal === "top" ||
        filterVal === "bottom" ||
        filterVal === "swim" ||
        filterVal === "accessory" ||
        filterVal === "cosmetic"
      ) {
        items = items.filter((item) => item.category === filterVal);
      } else if (filterVal === "conservative" || filterVal === "sexy") {
        items = items.filter((item) => item.tone === filterVal);
      }
    }

    // Search
    const q = searchEl ? searchEl.value.trim().toLowerCase() : "";
    if (q) {
      items = items.filter((item) => {
        const inName = item.name.toLowerCase().includes(q);
        const inDesc = (item.desc || "").toLowerCase().includes(q);
        const inTags = (item.tags || []).some((t) =>
          t.toLowerCase().includes(q)
        );
        return inName || inDesc || inTags;
      });
    }

    // Sort
    if (sortEl) {
      const sortVal = sortEl.value;
      if (sortVal === "cost_low") {
        items.sort((a, b) => a.cost - b.cost);
      } else if (sortVal === "cost_high") {
        items.sort((a, b) => b.cost - a.cost);
      } else if (sortVal === "newest") {
        // higher order = newer
        items.sort((a, b) => (b.order || 0) - (a.order || 0));
      }
    }

    renderGrid(items);
  }

  // Filter button clicks
  filterEls.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterEls.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      applyFiltersAndSort();
    });
  });

  if (sortEl) {
    sortEl.addEventListener("change", applyFiltersAndSort);
  }

  if (searchEl) {
    searchEl.addEventListener("input", () => {
      applyFiltersAndSort();
    });
  }

  // Kick it off after DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyFiltersAndSort);
  } else {
    applyFiltersAndSort();
  }
})();
