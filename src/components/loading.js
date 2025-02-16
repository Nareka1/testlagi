export function loadingIndicator(parentElement) {
  const loadingElement = document.createElement("div");
  loadingElement.id = "loadingIndicator";
  loadingElement.classList.add("loading");
  loadingElement.innerHTML = `
        <div class="spinner-border text-primary" role="status">
            <span class=" visually-hidden">Loading...</span>
        </div>
    `;

  parentElement.appendChild(loadingElement);
}

export function hideLoading() {
  const loadingIndicator = document.getElementById("loadingIndicator");
  if (loadingIndicator) {
    loadingIndicator.remove();
  }
}
