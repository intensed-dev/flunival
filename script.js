const form = document.querySelector("#profile-form");
const input = document.querySelector("#username");
const profile = document.querySelector("#profile");
const status = document.querySelector("#status");
const welcome = document.querySelector("#welcome");

const badges = [
  ["rocket", "First Flight", "Made your first public repository.", p => p.public_repos >= 1],
  ["git-pull-request", "Pull Shark", "Opened at least 10 pull requests.", p => p.prs >= 10],
  ["git-merge", "Merge Master", "Had a pull request merged.", p => p.mergedPrs >= 1],
  ["star", "Starstruck", "Collected at least 25 repository stars.", p => p.stars >= 25],
  ["git-fork", "Forklift", "Created a repository that has been forked 5+ times.", p => p.forks >= 5],
  ["book-open", "Repo Hoarder", "Published at least 10 public repositories.", p => p.public_repos >= 10],
  ["languages", "Polyglot", "Used at least 5 different programming languages.", p => p.languages >= 5],
  ["circle-dot", "Issue Hunter", "Opened at least 10 issues.", p => p.issues >= 10],
  ["package-check", "Ship It", "Has a public repository with a release.", p => p.hasRelease],
  ["zap", "Night Owl", "Made a public GitHub event between midnight and 5 AM.", p => p.nightOwl],
  ["sunrise", "Early Bird", "Made a public GitHub event between 5 AM and 8 AM.", p => p.earlyBird],
  ["archive", "Archivist", "Owns at least 3 archived repositories.", p => p.archived >= 3],
  ["trophy", "Top Shelf", "Has a repository with 100+ stars.", p => p.topRepoStars >= 100],
  ["users-round", "Community", "Has at least 25 followers.", p => p.followers >= 25],
  ["calendar-check", "Veteran", "Has been on GitHub for at least 5 years.", p => p.accountAge >= 5],

  ["sparkles", "Fresh Start", "Created a repository in the last 30 days.", p => p.recentRepo],
  ["flame", "On Fire", "Made at least 10 public events in the recent activity window.", p => p.events >= 10],
  ["code-2", "Code Smith", "Has at least 25 public repositories.", p => p.public_repos >= 25],
  ["star-half", "Rising Star", "Has at least 5 repository stars.", p => p.stars >= 5],
  ["git-branch", "Branch Manager", "Made at least 10 public push events.", p => p.pushes >= 10],
  ["terminal", "Command Line", "Made at least 10 public push events.", p => p.pushes >= 10],
  ["workflow", "Automator", "Triggered a public GitHub Actions workflow.", p => p.hasWorkflow],
  ["tag", "Release Ready", "Created at least 3 public releases.", p => p.releases >= 3],
  ["circle-check", "Issue Resolver", "Closed at least 10 public issues.", p => p.closedIssues >= 10],
  ["message-square", "Open Source Voice", "Commented on at least 10 public issues or pull requests.", p => p.comments >= 10],
  ["eye", "Watched", "Has at least one public repository with watchers.", p => p.watchers > 0],
  ["heart", "Well Known", "Has at least 100 followers.", p => p.followers >= 100],
  ["layers-3", "Collection", "Owns at least 3 public repositories with 25+ stars.", p => p.popularRepos >= 3],
  ["crown", "Headliner", "Has a repository with 500+ stars.", p => p.topRepoStars >= 500],
  ["gem", "Hidden Gem", "Has a repository with 10+ stars but fewer than 5 forks.", p => p.hiddenGem],
  ["clock-3", "Weekend Coder", "Made a public GitHub event on a weekend.", p => p.weekend],
  ["moon", "Midnight Committer", "Made a public GitHub event between 11 PM and midnight.", p => p.midnight],
  ["history", "Time Traveler", "Has been on GitHub for at least 10 years.", p => p.accountAge >= 10],
  ["book-marked", "Curator", "Has at least 5 archived repositories.", p => p.archived >= 5],
  ["folder-git-2", "Monorepo Mind", "Has a repository with more than 20,000 lines changed in a public event.", p => p.bigPush],
  ["users", "Crowd Favorite", "Has at least 500 followers.", p => p.followers >= 500],
  ["badge-check", "Established", "Has at least 50 public repositories.", p => p.public_repos >= 50]
];

const stats = [
  ["users", p => p.followers, "Followers"],
  ["git-fork", p => p.public_repos, "Public repositories"],
  ["star", p => p.stars, "Repository stars"],
  ["git-pull-request", p => p.prs, "Pull requests"],
  ["circle-dot", p => p.issues, "Issues opened"],
  ["calendar-days", p => new Date(p.created_at).getFullYear(), "Joined GitHub"]
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

function renderStatCards(profileData) {
  return stats.map(([icon, get, label]) => `
    <article class="badge">
      <span class="badge-icon"><i data-lucide="${icon}"></i></span>
      <span>
        <div class="badge-label">${label}</div>
        <div class="badge-value">${number(get(profileData))}</div>
      </span>
    </article>
  `).join("");
}

function renderAchievements(profileData) {
  const earned = badges.filter(([, , , check]) => check(profileData));

  return `
    <section class="achievement-section">
      <div class="section-heading">
        <div>
          <div class="section-kicker">Achievements</div>
          <h3>Custom badges</h3>
        </div>
        <span class="achievement-count">${earned.length} / ${badges.length} unlocked</span>
      </div>
      <div class="achievement-grid">
        ${badges.map(([icon, name, description, check]) => {
          const unlocked = check(profileData);
          return `
            <article class="achievement ${unlocked ? "unlocked" : "locked"}">
              <span class="achievement-icon"><i data-lucide="${icon}"></i></span>
              <span class="achievement-copy">
                <strong>${name}</strong>
                <small>${description}</small>
              </span>
              <span class="achievement-state">
                <i data-lucide="${unlocked ? "check" : "lock"}"></i>
              </span>
            </article>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function render(profileData) {
  profile.innerHTML = `
    <div class="profile-head">
      <img class="avatar" src="${profileData.avatar_url}" alt="">
      <div class="identity">
        <h2>${profileData.name || profileData.login}</h2>
        <a href="${profileData.html_url}" target="_blank" rel="noreferrer">@${profileData.login}</a>
      </div>
    </div>
    <div class="badges stats">${renderStatCards(profileData)}</div>
    ${renderAchievements(profileData)}
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
  welcome.hidden = false;

  try {
    const api = "https://api.github.com";
    const encoded = encodeURIComponent(username);

    const [userResponse, reposResponse, eventsResponse] = await Promise.all([
      fetch(`${api}/users/${encoded}`),
      fetch(`${api}/users/${encoded}/repos?per_page=100&sort=updated`),
      fetch(`${api}/users/${encoded}/events/public?per_page=100`)
    ]);

    if (!userResponse.ok) {
      throw new Error(userResponse.status === 404 ? "GitHub user not found." : "GitHub API request failed.");
    }

    const user = await userResponse.json();
    const repos = reposResponse.ok ? await reposResponse.json() : [];
    const events = eventsResponse.ok ? await eventsResponse.json() : [];

    user.stars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    user.forks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
    user.topRepoStars = Math.max(0, ...repos.map(repo => repo.stargazers_count));
    user.archived = repos.filter(repo => repo.archived).length;
    user.languages = new Set(repos.map(repo => repo.language).filter(Boolean)).size;
    user.prs = events.filter(event => event.type === "PullRequestEvent").length;
    user.mergedPrs = events.filter(event =>
      event.type === "PullRequestEvent" && event.payload?.pull_request?.merged
    ).length;
    user.issues = events.filter(event => event.type === "IssuesEvent").length;
    user.closedIssues = events.filter(event =>
      event.type === "IssuesEvent" && event.payload?.action === "closed"
    ).length;
    user.comments = events.filter(event =>
      event.type === "IssueCommentEvent" || event.type === "PullRequestReviewCommentEvent"
    ).length;
    user.pushes = events.filter(event => event.type === "PushEvent").length;
    user.events = events.length;
    user.hasRelease = events.some(event => event.type === "ReleaseEvent");
    user.releases = events.filter(event => event.type === "ReleaseEvent").length;
    user.hasWorkflow = events.some(event => event.type === "WorkflowRunEvent");
    user.nightOwl = events.some(event => {
      const hour = new Date(event.created_at).getHours();
      return hour >= 0 && hour < 5;
    });
    user.earlyBird = events.some(event => {
      const hour = new Date(event.created_at).getHours();
      return hour >= 5 && hour < 8;
    });
    user.midnight = events.some(event => {
      const hour = new Date(event.created_at).getHours();
      return hour >= 23 || hour === 0;
    });
    user.weekend = events.some(event => {
      const day = new Date(event.created_at).getDay();
      return day === 0 || day === 6;
    });
    user.recentRepo = repos.some(repo =>
      (Date.now() - new Date(repo.created_at).getTime()) < 30 * 24 * 60 * 60 * 1000
    );
    user.popularRepos = repos.filter(repo => repo.stargazers_count >= 25).length;
    user.hiddenGem = repos.some(repo =>
      repo.stargazers_count >= 10 && repo.forks_count < 5
    );
    user.watchers = repos.reduce((sum, repo) => sum + repo.watchers_count, 0);
    user.bigPush = events.some(event =>
      event.type === "PushEvent" &&
      event.payload?.distinct_size >= 20
    );
    user.accountAge = Math.floor(
      (Date.now() - new Date(user.created_at).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    );

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