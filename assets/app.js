(function () {
  function $(sel, root = document) { return root.querySelector(sel); }
  function $all(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

  // ====== Shared (recipes page only) ======
  function initRecipesPage() {
    const sideNav = $("nav.side-nav");
    const menuBtn = $("#menuToggle");
    const mainContent = $("#main-content");

    if (!sideNav || !mainContent) return; // 不在 recipes.html 就跳過

    // Mobile drawer toggle
    if (menuBtn) {
      menuBtn.addEventListener("click", () => sideNav.classList.toggle("open"));
    }

    // Close drawer when clicking content
    mainContent.addEventListener("click", () => sideNav.classList.remove("open"));

    // Bind nav items
    const navItems = $all(".nav-item");
    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        const target = item.dataset.target;
        if (!target) return;
        switchRecipe(target, item);
      });
    });

    function setActiveNav(activeItem) {
      navItems.forEach(n => n.classList.remove("active"));
      if (activeItem) activeItem.classList.add("active");
    }

    function switchRecipe(id, navEl) {
      // close drawer
      sideNav.classList.remove("open");

      // scroll to top
      mainContent.scrollTop = 0;

      // pages
      $all(".recipe-page").forEach(p => p.classList.remove("active"));
      const target = document.getElementById(id);
      if (target) target.classList.add("active");

      setActiveNav(navEl || $(`.nav-item[data-target="${id}"]`));

      // update URL hash (讓每道菜可分享/可返回)
      if (location.hash !== "#" + id) {
        history.pushState(null, "", "#" + id);
      }
    }

    function openFromHash() {
      const id = location.hash.replace("#", "") || "beef-curry";
      const navEl = $(`.nav-item[data-target="${id}"]`) || $(".nav-item");
      switchRecipe(id, navEl);
    }

    window.addEventListener("hashchange", openFromHash);
    openFromHash();
  }

  // ====== Cover page only ======
  function initCoverPage() {
    const enterBtn = $("#coverEnter");
    if (!enterBtn) return; // 不在 cover.html 就跳過

    enterBtn.addEventListener("click", () => {
      // 想記錄也可以：localStorage.setItem("enzoCook_seenCover", "1");
      location.href = "recipes.html#beef-curry";
    });
  }

  window.addEventListener("load", () => {
    initCoverPage();
    initRecipesPage();
  });
})();
