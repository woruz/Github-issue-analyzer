import axios from "axios";

const fetchIssues = async (repo) => {
  try {
    const [owner, name] = repo.split("/");
    if (!owner || !name) {
      throw new Error("Invalid repo format. Use 'owner/repo'.");
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

    if(!res || !res.status) {
      throw new Error(res?.data?.message || "No response from GitHub API");
    }

    if(!Array.isArray(res.data)) {
      throw new Error("Unexpected response format from GitHub API");
    }
    return res.data.filter((issue) => !issue.pull_request);
  } catch (error) {
    throw error;
  }
};

const githubHelper = {
  fetchIssues,
};

export default githubHelper;
