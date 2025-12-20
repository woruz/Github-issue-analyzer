import axios from "axios";

const fetchIssues = async (repo) => {
  try {
    if (!repo || typeof repo !== "string") {
      const err = new Error("Repository must be a non-empty string");
      err.status = 400;
      throw err;
    }
    const [owner, name] = repo.split("/");
    if (!owner || !name) {
      const err = new Error("Invalid repo format. Use 'owner/repo'.");
      err.status = 400;
      throw err;
    }
    const res = await axios.get(
      `https://api.github.com/repos/${owner}/${name}/issues`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
        params: { state: "open" },
      }
    );

    if (!res || res.status !== 200) {
      const err = new Error("Failed to fetch issues from GitHub");
      err.status = res?.status || 502;
      throw err;
    }

    if (!Array.isArray(res.data)) {
      const err = new Error("Unexpected response format from GitHub API");
      err.status = 502;
      throw err;
    }

    return res.data.filter((issue) => !issue.pull_request);
  } catch (error) {
    throw error;
  }
};

const githubHelper = {
  fetchIssues
};

export default githubHelper;
