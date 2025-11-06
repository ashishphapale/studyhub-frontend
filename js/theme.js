// js/theme.js
(function() {
  const THEME_KEY = "studyhub_theme";
  const body = document.body;

  // initialize from storage
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "dark") {
    body.classList.add("dark-mode");
  }

  // expose toggle function for buttons
  window.toggleTheme = function(toggleBtn) {
    const isDark = body.classList.toggle("dark-mode");
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
    if (toggleBtn) {
      toggleBtn.textContent = isDark ? "☀️ Light" : "🌙 Dark";
    }
  };

  // update any theme buttons on load
  window.updateThemeButtons = function() {
    const btns = document.querySelectorAll("[data-theme-toggle]");
    btns.forEach(b => {
      b.textContent = body.classList.contains("dark-mode") ? "☀️ Light" : "🌙 Dark";
    });
  };

  // run at load
  document.addEventListener("DOMContentLoaded", updateThemeButtons);
})();
