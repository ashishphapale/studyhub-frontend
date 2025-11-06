// frontend/js/profile.js

import { showToast, showSpinner, hideSpinner } from "./uiHelpers.js";

// Load user data from localStorage
const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

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
    window.location.href = "login.html";
    return;
  }

  nameEl.textContent = user.username || "Unknown";
  emailEl.textContent = user.email || "No Email";
  joinedEl.textContent = formatJoinDate(user.createdAt);
});

// ✅ Handle avatar preview
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

// ✅ Handle Save Avatar button (demo simulation)
saveBtn.addEventListener("click", async () => {
  const file = uploadInput.files[0];
  if (!file) {
    showToast("Please choose a photo before saving.", "warning");
    return;
  }

  showSpinner();

  // Simulate upload delay
  setTimeout(() => {
    hideSpinner();
    showToast("Avatar updated successfully!", "success");
  }, 1500);
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
