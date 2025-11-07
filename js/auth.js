// frontend/js/auth.js
import { showToast, showSpinner, hideSpinner } from "./uiHelpers.js";

// ✅ Your Render backend base URL (only change this if you rename the service)
const API_BASE = "https://studyhub-backend.onrender.com/api/auth";

// ============================
// REGISTER FUNCTIONALITY
// ============================
const registerForm = document.getElementById("registerForm");

registerForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  showSpinner();

  const username = document.getElementById("regUsername")?.value.trim();
  const email = document.getElementById("regEmail")?.value.trim();
  const password = document.getElementById("regPassword")?.value.trim();

  if (!username || !email || !password) {
    hideSpinner();
    return showToast("⚠️ Please fill all fields.", "warning");
  }

  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      hideSpinner();
      console.error("Register Error:", data);
      return showToast(data.message || "Registration failed.", "danger");
    }

    // ✅ Save user + token securely
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    hideSpinner();
    showToast("🎉 Registration successful!", "success");

    // ✅ Redirect after short delay
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 800);
  } catch (err) {
    console.error("Register Exception:", err);
    hideSpinner();
    showToast("❌ Server error during registration.", "danger");
  }
});

// ============================
// LOGIN FUNCTIONALITY
// ============================
const loginForm = document.getElementById("loginForm");

loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  showSpinner();

  const email = document.getElementById("loginEmail")?.value.trim();
  const password = document.getElementById("loginPassword")?.value.trim();

  if (!email || !password) {
    hideSpinner();
    return showToast("⚠️ Please enter both email and password.", "warning");
  }

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      hideSpinner();
      console.error("Login Error:", data);
      return showToast(data.message || "Invalid credentials.", "danger");
    }

    // ✅ Save login data safely
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    hideSpinner();
    showToast("✅ Login successful!", "success");

    // ✅ Redirect after delay
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 800);
  } catch (err) {
    console.error("Login Exception:", err);
    hideSpinner();
    showToast("❌ Server error during login.", "danger");
  }
});

// ============================
// COMMON HELPERS (optional but recommended)
// ============================

// Ensures localStorage data is not corrupted
window.addEventListener("DOMContentLoaded", () => {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (token && user?.email) {
      console.log("🔐 Authenticated user:", user.email);
    }
  } catch (err) {
    console.warn("Clearing corrupted localStorage data.");
    localStorage.clear();
  }
});
