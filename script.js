const esc = (value) => {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const characters = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return characters[character];
  });
};

const safeUrl = (url) => {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
      return esc(parsedUrl.href);
    }

    return "";
  } catch {
    return "";
  }
};

/* =========================
   LOAD PROJECTS
========================= */

async function loadProjects() {
  const projectList = document.getElementById("project-list");

  try {
    const response = await fetch("/api/projects");

    if (!response.ok) {
      throw new Error("Could not load projects");
    }

    const projects = await response.json();

    if (!projects.length) {
      projectList.innerHTML = `
        <p class="muted">
          No projects found. Run
          <code>npm run seed</code>
          to add your projects.
        </p>
      `;

      return;
    }

    projectList.innerHTML = projects
      .map((project) => {
        const liveUrl = safeUrl(project.liveUrl);
        const repoUrl = safeUrl(project.repoUrl);

        const technologies = (project.tech || [])
          .map((technology) => {
            return `<li>${esc(technology)}</li>`;
          })
          .join("");

        const liveButton = liveUrl
          ? `
            <a
              href="${liveUrl}"
              target="_blank"
              rel="noopener noreferrer"
            >
              Live Demo ↗
            </a>
          `
          : "";

        const githubButton = repoUrl
          ? `
            <a
              href="${repoUrl}"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub ↗
            </a>
          `
          : "";

        return `
          <article class="card ${project.featured ? "featured" : ""}">

            <h3>
              ${esc(project.title)}
            </h3>

            <p>
              ${esc(project.description)}
            </p>

            <ul class="tags">
              ${technologies}
            </ul>

            <div class="links">
              ${liveButton}
              ${githubButton}
            </div>

          </article>
        `;
      })
      .join("");
  } catch (error) {
    console.error("Projects error:", error);

    projectList.innerHTML = `
      <p class="muted">
        Projects failed to load.
        Please make sure the server is running.
      </p>
    `;
  }
}

/* =========================
   CONTACT FORM
========================= */

const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const status = document.getElementById("form-status");

    status.textContent = "Sending...";

    try {
      const formData = new FormData(contactForm);

      const data = Object.fromEntries(formData);

      const response = await fetch("/api/contact", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Message could not be sent");
      }

      contactForm.reset();

      status.textContent =
        "Message sent successfully! Thanks for reaching out.";
    } catch (error) {
      console.error("Contact error:", error);

      status.textContent = "Message could not be sent. Please try again.";
    }
  });
}

/* =========================
   CURRENT YEAR
========================= */

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

/* =========================
   START
========================= */

loadProjects();
