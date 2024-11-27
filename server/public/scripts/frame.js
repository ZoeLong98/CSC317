function createNav() {
  const currentPath = window.location.pathname;

  return `
    <div class="logo" role="img" aria-label="Company Logo">E</div>
    <nav class="nav-container">
      <div class="nav-links">
        <a href="/" class="nav-link ${
          currentPath === "/" ? "nav-active" : ""
        }">Home</a>
        <a href="/events" class="nav-link ${
          currentPath === "/events" ? "nav-active" : ""
        }">Events</a>
        <a href="/myEvent" class="nav-link ${
          currentPath === "/myEvent" ? "nav-active" : ""
        }">My Event</a>
        <a href="/notification" class="nav-link ${
          currentPath === "/notification" ? "nav-active" : ""
        }">Notification</a>
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
