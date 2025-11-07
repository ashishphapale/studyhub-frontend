// frontend/js/dashboard.js
import { showSpinner, hideSpinner, showToast } from "./uiHelpers.js";

// ✅ Use your deployed backend URL
const API_BASE = "https://studyhub-backend.onrender.com/api";

// ✅ Retrieve token and user safely
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "{}");

// ✅ DOM Elements
const uploadForm = document.getElementById("uploadForm");
const notesContainer = document.getElementById("notesContainer");
const searchInput = document.getElementById("searchInput");
const clearFormBtn = document.getElementById("clearForm");

let allNotes = [];

// ✅ Auth Guard — Run only after DOM loads
window.addEventListener("DOMContentLoaded", () => {
  if (!token || !user?.email) {
    showToast("Please login first!", "warning");
    setTimeout(() => (window.location.href = "login.html"), 1000);
    return;
  }
  fetchNotes(); // ✅ Fetch after confirming token
});

// ===============================
// Fetch Notes for Logged-in User
// ===============================
async function fetchNotes() {
  showSpinner();
  try {
    const res = await fetch(`${API_BASE}/notes/mine`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401 || res.status === 403) {
      hideSpinner();
      showToast("Session expired. Please login again.", "warning");
      localStorage.clear();
      setTimeout(() => (window.location.href = "login.html"), 1200);
      return;
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch notes.");

    allNotes = Array.isArray(data) ? data : [];
    renderNotes(allNotes);
  } catch (err) {
    console.error("Fetch Notes Error:", err);
    showToast("Error fetching notes", "danger");
  } finally {
    hideSpinner();
  }
}

// ===============================
// Render Note Cards
// ===============================
function renderNotes(notes = []) {
  notesContainer.innerHTML = "";
  if (!notes.length) {
    notesContainer.innerHTML = `<div class="col-12 text-center text-muted mt-3">📄 No notes found. Upload your first one!</div>`;
    return;
  }

  notes.forEach((note) => {
    const card = document.createElement("div");
    card.className = "col-md-4 col-sm-6 mb-4";
    card.innerHTML = `
      <div class="card note-card shadow-sm h-100" data-aos="fade-up">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${escapeHtml(note.title)}</h5>
          <p class="card-text mb-1"><strong>Subject:</strong> ${escapeHtml(note.subject)}</p>
          <p class="text-muted small">Tags: ${note.tags?.join(", ") || "—"}</p>
          <div class="mt-auto d-flex gap-2">
            <a href="${API_BASE}/notes/download/${note._id}" target="_blank" class="btn btn-outline-primary btn-sm flex-fill">📥 Download</a>
            <button class="btn btn-outline-danger btn-sm flex-fill" data-id="${note._id}">🗑 Delete</button>
          </div>
        </div>
      </div>
    `;
    card.querySelector("button[data-id]").addEventListener("click", () => deleteNote(note._id));
    notesContainer.appendChild(card);
  });
}

// ===============================
// Upload New Note
// ===============================
uploadForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  showSpinner();

  const title = document.getElementById("noteTitle").value.trim();
  const subject = document.getElementById("noteSubject").value.trim();
  const tags = document.getElementById("noteTags").value.trim();
  const file = document.getElementById("noteFile").files[0];

  if (!file) {
    hideSpinner();
    return showToast("Please select a file to upload.", "warning");
  }

  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subject", subject);
    formData.append("tags", tags);
    formData.append("file", file);

    const res = await fetch(`${API_BASE}/notes`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    showToast("Note uploaded successfully!", "success");
    uploadForm.reset();
    fetchNotes();
  } catch (err) {
    console.error("Upload Error:", err);
    showToast("Error uploading note", "danger");
  } finally {
    hideSpinner();
  }
});

// ===============================
// Delete Note
// ===============================
async function deleteNote(id) {
  if (!confirm("Delete this note permanently?")) return;
  showSpinner();
  try {
    const res = await fetch(`${API_BASE}/notes/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    showToast("Note deleted", "info");
    fetchNotes();
  } catch (err) {
    console.error("Delete Error:", err);
    showToast("Failed to delete note", "danger");
  } finally {
    hideSpinner();
  }
}

// ===============================
// Search / Filter
// ===============================
searchInput?.addEventListener("input", () => {
  const q = searchInput.value.trim().toLowerCase();
  const filtered = allNotes.filter(
    (n) =>
      n.title?.toLowerCase().includes(q) ||
      n.subject?.toLowerCase().includes(q) ||
      n.tags?.join(",").toLowerCase().includes(q)
  );
  renderNotes(filtered);
});

// ===============================
// Helper: Escape HTML
// ===============================
function escapeHtml(str = "") {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
