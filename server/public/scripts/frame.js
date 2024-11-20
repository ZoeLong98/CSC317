function createNav() {
  return `
    <div class="logo" role="img" aria-label="Company Logo">E</div>
    <nav class="nav-container">
    <div class="nav-links">
        <a href="/" class="nav-link nav-active">Home</a>
        <a href="/events" class="nav-link">Events</a>
        <a href="#" class="nav-link">My Event</a>
        <a href="#" class="nav-link">Notification</a>
    </div>
    </nav>
    <hr class="divider" />
      `;
}

function createFooter() {
  return `
        <hr class="divider" />
      `;
}

document.addEventListener("DOMContentLoaded", function () {
  const nav = document.querySelector("nav");
  const footer = document.querySelector("footer");
  const mainContent = document.querySelector("mainContent");
  nav.innerHTML = createNav();
  mainContent.classList.add("content-wrapper");
  footer.innerHTML = createFooter();
});
