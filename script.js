const projectList = document.getElementById("project-list");
const contactForm = document.getElementById("contact-form");
const year = document.getElementById("year");

// Load projects
async function loadProjects() {
  try {
    projectList.innerHTML = "<p>Loading projects...</p>";

    const response = await fetch("/api/projects");

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const projects = await response.json();

    console.log("Projects loaded:", projects);

    if (!projects.length) {
      projectList.innerHTML = "<p>No projects available.</p>";
      return;
    }

    projectList.innerHTML = projects
      .map((project) => {
        const tech = Array.isArray(project.tech)
          ? project.tech
              .map((item) => `<span class="tech">${escapeHtml(item)}</span>`)
              .join("")
          : "";

        const repoButton = project.repoUrl
          ? `<a href="${safeUrl(project.repoUrl)}" target="_blank" rel="noopener noreferrer" class="project-link">View on GitHub →</a>`
          : "";

        const liveButton = project.liveUrl
          ? `<a href="${safeUrl(project.liveUrl)}" target="_blank" rel="noopener noreferrer" class="project-link">Live Demo →</a>`
          : "";

        return `
          <article class="project-card">
            ${project.featured ? '<span class="featured">Featured</span>' : ""}

            <h3>${escapeHtml(project.title)}</h3>

            <p>${escapeHtml(project.description)}</p>

            <div class="project-tech">
              ${tech}
            </div>

            <div class="project-links">
              ${repoButton}
              ${liveButton}
            </div>
          </article>
        `;
      })
      .join("");
  } catch (error) {
    console.error("Error loading projects:", error);

    projectList.innerHTML = `
      <p>
        Unable to load projects right now.
      </p>
    `;
  }
}

// Escape HTML
function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Allow only HTTP/HTTPS URLs
function safeUrl(url) {
  try {
    const parsed = new URL(url);

    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.href;
    }

    return "#";
  } catch {
    return "#";
  }
}

// Contact form
if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      body: formData.get("body"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      alert("Message sent successfully!");

      contactForm.reset();
    } catch (error) {
      console.error("Contact form error:", error);
      alert("Unable to send message. Please try again.");
    }
  });
}

// Current year
if (year) {
  year.textContent = new Date().getFullYear();
}

// Start loading projects
loadProjects();
