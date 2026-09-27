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
  ["git-fork", "Forklift", "Has a repository that was forked 5+ times.", p => p.topRepoForks >= 5],
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
  ["folder-git-2", "Monorepo Mind", "Made a public push containing 20+ commits.", p => p.bigPush],
  ["users", "Crowd Favorite", "Has at least 500 followers.", p => p.followers >= 500],
  ["badge-check", "Established", "Has at least 50 public repositories.", p => p.public_repos >= 50],
  ["git-fork", "Tourist", "Forked a repository with 100+ stars.", p => p.forkedPopular],
  ["landmark", "Big League", "Had a pull request merged in a repository with 100+ stars.", p => p.mergedExternalPopularPr],
  ["send", "Outside Help", "Had a pull request merged in someone else's repository.", p => p.mergedExternalPr],
  ["rocket", "Launch Sequence", "Created a public repository and pushed to it in the same activity window.", p => p.createdAndPushed],
  ["shuffle", "Repo Tourist", "Publicly contributed to a repository you do not own.", p => p.externalActivity],
  ["git-commit-horizontal", "Commit Machine", "Made a public push containing 20+ commits.", p => p.bigPush],
  ["copy", "Ctrl+C Energy", "Forked at least 5 public repositories.", p => p.forksCreated >= 5],
  ["dice-5", "Chaos Agent", "Had public activity across 5+ different repositories recently.", p => p.activeRepos >= 5],
  ["orbit", "Everywhere At Once", "Had public activity across 10+ different repositories recently.", p => p.activeRepos >= 10],
  ["ghost", "Sneaky Contributor", "Had a merged PR in a repository you do not own.", p => p.mergedExternalPr],
  ["scan-search", "Archaeologist", "Contributed to a repository created before your GitHub account.", p => p.olderRepoContribution],
  ["party-popper", "Plot Twist", "Had a public event type you probably forgot existed.", p => p.weirdEvent],
  ["badge", "Badge Goblin", "Unlocked at least 20 custom Flunival badges.", p => p.unlockedCount >= 20],
  ["infinity", "Never Offline", "Had public activity on 3 different days in the recent activity window.", p => p.activeDays >= 3],
  ["coffee", "One More Commit", "Made public activity after 10 PM.", p => p.lateNight]
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

    user.topRepoForks = Math.max(0, ...repos.map(repo => repo.forks_count));
    user.forksCreated = events.filter(event => event.type === "ForkEvent").length;
    user.activeRepos = new Set(events.map(event => event.repo?.name).filter(Boolean)).size;
    user.externalActivity = events.some(event => {
      const owner = event.repo?.name?.split("/")[0];
      return owner && owner.toLowerCase() !== user.login.toLowerCase();
    });
    user.mergedExternalPr = events.some(event => {
      const owner = event.repo?.name?.split("/")[0];
      return event.type === "PullRequestEvent" && event.payload?.pull_request?.merged && owner && owner.toLowerCase() !== user.login.toLowerCase();
    });
    user.activeDays = new Set(events.map(event => event.created_at?.slice(0, 10)).filter(Boolean)).size;
    user.lateNight = events.some(event => {
      const hour = new Date(event.created_at).getHours();
      return hour >= 22 || hour < 1;
    });
    user.weirdEvent = events.some(event => ["PublicEvent", "MemberEvent", "GollumEvent", "ReleaseEvent"].includes(event.type));
    user.createdAndPushed = events.some(event => event.type === "CreateEvent") && events.some(event => event.type === "PushEvent");
    user.olderRepoContribution = events.some(event => {
      const repo = repos.find(repo => repo.full_name === event.repo?.name);
      return repo && new Date(repo.created_at) < new Date(user.created_at);
    });
    user.forkedPopular = events.some(event =>
      event.type === "ForkEvent" && event.payload?.forkee?.parent?.stargazers_count >= 100
    );
    user.unlockedCount = badges.filter(([, , , check]) => check(user)).length;

    const externalPrRepos = [...new Set(events.filter(event =>
      event.type === "PullRequestEvent" &&
      event.payload?.pull_request?.merged &&
      event.repo?.name?.split("/")[0]?.toLowerCase() !== user.login.toLowerCase()
    ).map(event => event.repo.name))];

    if (externalPrRepos.length) {
      const repoResults = await Promise.all(externalPrRepos.slice(0, 10).map(name =>
        fetch(api + "/repos/" + name).then(response => response.ok ? response.json() : null).catch(() => null)
      ));
      user.mergedExternalPopularPr = repoResults.some(repo => repo?.stargazers_count >= 100);
    }

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