const form = document.querySelector("#profile-form");
const input = document.querySelector("#username");
const profile = document.querySelector("#profile");
const status = document.querySelector("#status");
const welcome = document.querySelector("#welcome");

const badges = [
  ["Users", "users", p => p.followers, "Followers"],
  ["GitFork", "git-fork", p => p.public_repos, "Public repositories"],
  ["Star", "star", p => p.stars, "Repository stars"],
  ["GitPullRequest", "git-pull-request", p => p.prs, "Pull requests"],
  ["CircleDot", "circle-dot", p => p.issues, "Issues opened"],
  ["CalendarDays", "calendar-days", p => new Date(p.created_at).getFullYear(), "Joined GitHub"]
];

function number(value) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function cleanUsername(value) {
  return value.trim().replace(/^#/, "").split(/[/?#]/)[0];
}

function setStatus(message) {
  status.textContent = message;
  status.hidden = !message;
}

function render(profileData) {
  const badgeHtml = badges.map(([icon, iconName, get, label]) => `
    <article class="badge">
      <span class="badge-icon"><i data-lucide="${iconName}"></i></span>
      <span>
        <div class="badge-label">${label}</div>
        <div class="badge-value">${number(get(profileData))}</div>
      </span>
    </article>
  `).join("");

  profile.innerHTML = `
    <div class="profile-head">
      <img class="avatar" src="${profileData.avatar_url}" alt="">
      <div class="identity">
        <h2>${profileData.name || profileData.login}</h2>
        <a href="${profileData.html_url}" target="_blank" rel="noreferrer">@${profileData.login}</a>
      </div>
    </div>
    <div class="badges">${badgeHtml}</div>
  `;

  lucide.createIcons();
  profile.hidden = false;
  welcome.hidden = true;
}

async function load(username) {
  username = cleanUsername(username);
  if (!username) {
    profile.hidden = true;
    welcome.hidden = false;
    setStatus("");
    return;
  }

  input.value = username;
  setStatus("");
  profile.hidden = true;
  welcome.hidden = true;

  try {
    const userResponse = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);
    if (!userResponse.ok) throw new Error(userResponse.status === 404 ? "GitHub user not found." : "GitHub API request failed.");
    const user = await userResponse.json();

    const reposResponse = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`);
    const repos = reposResponse.ok ? await reposResponse.json() : [];
    user.stars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    user.prs = 0;
    user.issues = 0;

    render(user);
    document.title = `#${user.login} — Flunival`;
  } catch (error) {
    setStatus(error.message || "Could not load this GitHub profile.");
    welcome.hidden = false;
    document.title = "Flunival";
  }
}

function route() {
  load(location.hash);
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const username = cleanUsername(input.value);
  if (username) location.hash = username;
});

window.addEventListener("hashchange", route);
lucide.createIcons();
route();