// frontend/js/dashboard.js
import { showSpinner, hideSpinner, showToast } from "./uiHelpers.js";

const API_BASE = "https://studyhub-backend.onrender.com/api";

const token = localStorage.getItem("token");
const uploadForm = document.getElementById("uploadForm");
const notesContainer = document.getElementById("notesContainer");
const searchInput = document.getElementById("searchInput");
const clearFormBtn = document.getElementById("clearForm");

let allNotes = [];

// ✅ Require login
if (!token) {
  window.location.href = "login.html";
}

// ✅ Fetch Notes for Logged-In User
async function fetchNotes() {
  showSpinner();
  try {
    const res = await fetch(`${API_BASE}/mine`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401 || res.status === 403) {
      hideSpinner();
      showToast("Session expired. Please log in again.", "warning");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setTimeout(() => (window.location.href = "login.html"), 800);
      return;
    }

    const data = await res.json();
    if (!res.ok) {
      console.error("Fetch notes failed:", data);
      showToast(data.message || "Error fetching notes", "danger");
      hideSpinner();
      return;
    }

    allNotes = Array.isArray(data) ? data : data.notes || [];
    renderNotes(allNotes);
  } catch (err) {
    console.error("Fetch notes error:", err);
    showToast("Error fetching notes. Check server connection.", "danger");
  } finally {
    hideSpinner();
  }
}

// ✅ Render Note Cards (Modern UI)
function renderNotes(notes = []) {
  notesContainer.innerHTML = "";
  if (!notes.length) {
    notesContainer.innerHTML = `
      <div class="col-12 text-center text-muted mt-4">
        No notes yet — upload your first note 📘
      </div>`;
    return;
  }

  notes.forEach((note) => {
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-md-4 col-lg-3";

    col.innerHTML = `
      <div class="note-card card shadow-sm h-100" data-aos="fade-up">
        <div class="card-body d-flex flex-column">
          <h5 class="mb-1 text-primary fw-semibold">${escapeHtml(note.title)}</h5>
          <p class="mb-1"><strong>Subject:</strong> ${escapeHtml(note.subject)}</p>
          <p class="note-meta small text-muted mb-2">
            Tags: ${Array.isArray(note.tags) ? note.tags.join(", ") : (note.tags || "—")}
          </p>
          <div class="mt-auto d-flex gap-2">
            <a class="btn btn-outline-primary btn-sm flex-fill"
               href="https://studyhub-backend.onrender.com/${note.filePath.replace(/\\/g, '/')}"
               target="_blank">📥 Download</a>
            <button class="btn btn-outline-danger btn-sm flex-fill"
                    data-id="${note._id}">🗑 Delete</button>
          </div>
        </div>
      </div>
    `;

    col.querySelector("button[data-id]")?.addEventListener("click", () => deleteNote(note._id));
    notesContainer.appendChild(col);
  });
}

// ✅ Upload Note
uploadForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  showSpinner();

  const title = document.getElementById("noteTitle").value.trim();
  const subject = document.getElementById("noteSubject").value.trim();
  const tags = document.getElementById("noteTags").value.trim();
  const file = document.getElementById("noteFile").files[0];

  if (!file) {
    hideSpinner();
    showToast("Please select a file to upload.", "warning");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subject", subject);
    formData.append("tags", tags);
    formData.append("file", file);

    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Upload failed:", data);
      showToast(data.message || "Upload failed", "danger");
      hideSpinner();
      return;
    }

    showToast("✅ Note uploaded successfully!", "success");
    uploadForm.reset();
    fetchNotes();
  } catch (err) {
    console.error("Upload error:", err);
    showToast("Server error during upload", "danger");
  } finally {
    hideSpinner();
  }
});

// ✅ Delete Note
async function deleteNote(id) {
  if (!confirm("Delete this note?")) return;
  showSpinner();
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("Delete failed:", data);
      showToast(data.message || "Delete failed", "danger");
      hideSpinner();
      return;
    }
    showToast("🗑 Note deleted", "info");
    fetchNotes();
  } catch (err) {
    console.error("Delete error:", err);
    showToast("Error deleting note", "danger");
  } finally {
    hideSpinner();
  }
}

// ✅ Search & Filter Notes
searchInput?.addEventListener("input", () => {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) return renderNotes(allNotes);
  const filtered = allNotes.filter((n) =>
    (n.title || "").toLowerCase().includes(q) ||
    (n.subject || "").toLowerCase().includes(q) ||
    (Array.isArray(n.tags) ? n.tags.join(" ").toLowerCase() : (n.tags || "")).includes(q)
  );
  renderNotes(filtered);
});

// ✅ Clear Form
clearFormBtn?.addEventListener("click", () => uploadForm.reset());

// ✅ Escape HTML helper
function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// ✅ Load Notes Initially
fetchNotes();
