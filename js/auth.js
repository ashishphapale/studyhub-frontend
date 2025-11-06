// js/auth.js (updated)
import { showSpinner, hideSpinner, showToast } from "./uiHelpers.js";

const API_BASE = "https://studyhub-backend.onrender.com/api";


// REGISTER
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    showSpinner();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      hideSpinner();

      if (res.ok) {
        // backend returns token and user object
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user || {}));
        showToast("Registration successful! Redirecting...", "success");
        setTimeout(() => (window.location.href = "dashboard.html"), 1000);
      } else {
        showToast(data.message || "Error registering", "danger");
      }
    } catch (err) {
      hideSpinner();
      showToast("Server error during registration!", "danger");
      console.error("Register error:", err);
    }
  });
}

// LOGIN
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    showSpinner();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      hideSpinner();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        // if backend returned a user object include it (some implementations do)
        if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
        showToast("Login successful! Redirecting...", "success");
        setTimeout(() => (window.location.href = "dashboard.html"), 900);
      } else {
        showToast(data.message || "Invalid login credentials", "danger");
      }
    } catch (err) {
      hideSpinner();
      showToast("Server error during login!", "danger");
      console.error("Login error:", err);
    }
  });
}
