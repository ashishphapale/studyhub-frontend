// js/uiHelpers.js

// Show/Hide Loading Spinner
export function showSpinner() {
  document.getElementById("loadingSpinner").classList.remove("d-none");
}
export function hideSpinner() {
  document.getElementById("loadingSpinner").classList.add("d-none");
}

// Show Bootstrap Toast
export function showToast(message, type = "success") {
  const toastBox = document.getElementById("toastBox");
  const toastId = `toast-${Date.now()}`;

  const toast = document.createElement("div");
  toast.className = `toast align-items-center text-white bg-${type} border-0 show mb-2`;
  toast.id = toastId;
  toast.role = "alert";
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto"
        data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  toastBox.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}
