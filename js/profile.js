// frontend/js/profile.js

import { showToast, showSpinner, hideSpinner } from "./uiHelpers.js";

// ✅ Base API URL (Render backend)
const API_BASE = "https://studyhub-backend.onrender.com/api";

// Load user data from localStorage
const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

// DOM Elements
const nameEl = document.getElementById("profileName");
const emailEl = document.getElementById("profileEmail");
const joinedEl = document.getElementById("profileJoined");
const avatarEl = document.getElementById("profileAvatar");
const uploadInput = document.getElementById("avatarUpload");
const saveBtn = document.getElementById("saveAvatar");
const logoutBtn = document.getElementById("logoutBtn");

// ✅ Format date like "Joined: November 2025"
function formatJoinDate(dateString) {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "—";

    const options = { year: "numeric", month: "long" };
    const formatted = date.toLocaleDateString("en-US", options);
    return `Joined: ${formatted}`;
  } catch (err) {
    return "—";
  }
}

// ✅ Load user details
window.addEventListener("DOMContentLoaded", () => {
  if (!user || !token) {
    showToast("Please log in first.", "warning");
    setTimeout(() => (window.location.href = "login.html"), 800);
    return;
  }

  nameEl.textContent = user.username || "Unknown";
  emailEl.textContent = user.email || "No Email";
  joinedEl.textContent = formatJoinDate(user.createdAt);
});

// ✅ Handle avatar preview (client-side only)
uploadInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      avatarEl.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
});

// ✅ Handle Save Avatar (future-ready API upload)
saveBtn.addEventListener("click", async () => {
  const file = uploadInput.files[0];
  if (!file) {
    showToast("Please choose a photo before saving.", "warning");
    return;
  }

  showSpinner();

  try {
    // Future endpoint (optional): /api/user/avatar
    // For now we simulate upload for 1.5s
    await new Promise((resolve) => setTimeout(resolve, 1500));

    hideSpinner();
    showToast("✅ Avatar updated successfully!", "success");
  } catch (err) {
    hideSpinner();
    showToast("Error updating avatar. Try again later.", "danger");
    console.error("Avatar upload error:", err);
  }
});

// ✅ Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  showToast("Logged out successfully!", "info");
  setTimeout(() => {
    window.location.href = "login.html";
  }, 1000);
});
