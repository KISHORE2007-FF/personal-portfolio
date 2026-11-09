const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

const roleText = document.getElementById("roleText");
const roles = ["Computer Science Student", "Aspiring Full-Stack Developer", "Technology Enthusiast"];
let roleIndex = 0;
setInterval(() => {
  roleIndex = (roleIndex + 1) % roles.length;
  roleText.textContent = roles[roleIndex];
}, 2800);

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

function projectCard(project, index) {
  const initials = project.title.split(/\s+/).slice(0, 2).map(word => word[0]).join("").toUpperCase();
  const tech = (project.technologies || "").split(",").map(item => item.trim()).filter(Boolean);
  const links = [];
  if (project.project_url) links.push(`<a href="${escapeHTML(project.project_url)}" target="_blank" rel="noreferrer">Live demo ↗</a>`);
  if (project.github_url) links.push(`<a href="${escapeHTML(project.github_url)}" target="_blank" rel="noreferrer">Source code ↗</a>`);
  return `<article class="project-card">
    <div class="project-visual">${escapeHTML(initials || `0${index + 1}`)}</div>
    <div class="project-body">
      <h3>${escapeHTML(project.title)}</h3>
      <p>${escapeHTML(project.description)}</p>
      <div class="tags">${tech.map(item => `<span>${escapeHTML(item)}</span>`).join("")}</div>
      <div class="project-links">${links.length ? links.join("") : "<span>Project details</span>"}</div>
    </div>
  </article>`;
}

async function loadProjects() {
  const grid = document.getElementById("projectsGrid");
  const status = document.getElementById("projectStatus");
  try {
    const response = await fetch("/api/projects");
    if (!response.ok) throw new Error("Project API returned an error.");
    const projects = await response.json();
    document.getElementById("projectCount").textContent = `${String(projects.length).padStart(2, "0")} PROJECTS`;
    if (!projects.length) {
      grid.innerHTML = '<div class="loading-card">No projects have been added yet.</div>';
      return;
    }
    grid.innerHTML = projects.map(projectCard).join("");
  } catch (error) {
    grid.innerHTML = '<div class="loading-card">Projects could not be loaded. Check that the server and database are running.</div>';
    status.textContent = error.message;
  }
}

document.getElementById("contactForm").addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector("button[type='submit']");
  const status = document.getElementById("formStatus");
  const payload = Object.fromEntries(new FormData(form).entries());
  button.disabled = true;
  button.textContent = "Sending…";
  status.textContent = "";
  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Message could not be sent.");
    status.textContent = result.message;
    form.reset();
  } catch (error) {
    status.textContent = error.message;
  } finally {
    button.disabled = false;
    button.innerHTML = 'Send message <span>↗</span>';
  }
});

loadProjects();
