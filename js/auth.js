// frontend/js/auth.js

import { showToast, showSpinner, hideSpinner } from "./uiHelpers.js";

// ✅ Deployed backend base URL
const API_BASE = "https://studyhub-backend.onrender.com/api/auth";

// ============================
// REGISTER FUNCTIONALITY
// ============================
const registerForm = document.getElementById("registerForm");

registerForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  showSpinner();

  const username = document.getElementById("regUsername").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value.trim();

  if (!username || !email || !password) {
    hideSpinner();
    showToast("Please fill all fields.", "warning");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      hideSpinner();
      showToast(data.message || "Registration failed.", "danger");
      console.error("Register Error:", data);
      return;
    }

    // ✅ Save token & user
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    hideSpinner();
    showToast("Registration successful!", "success");
    setTimeout(() => (window.location.href = "dashboard.html"), 800);
  } catch (err) {
    console.error("Register Exception:", err);
    hideSpinner();
    showToast("Server error during registration.", "danger");
  }
});

// ============================
// LOGIN FUNCTIONALITY
// ============================
const loginForm = document.getElementById("loginForm");

loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  showSpinner();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    hideSpinner();
    showToast("Please enter both email and password.", "warning");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      hideSpinner();
      showToast(data.message || "Invalid credentials.", "danger");
      console.error("Login Error:", data);
      return;
    }

    // ✅ Save token & user
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    hideSpinner();
    showToast("Login successful!", "success");
    setTimeout(() => (window.location.href = "dashboard.html"), 800);
  } catch (err) {
    console.error("Login Exception:", err);
    hideSpinner();
    showToast("Server error during login.", "danger");
  }
});
