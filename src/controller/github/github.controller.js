import { db } from "../../platform/db.js";
import githubHelper from "./github.helper.js";

const getRepoIssues = async (req, res) => {
  try {
    const { repo } = req.body;
    const issues = await githubHelper.fetchIssues(repo);

    if (!issues.length) {
      return res.status(400).json({ error: "No open issues found or repo invalid" });
    }

    for (const issue of issues) {
      await db.run(
        `INSERT OR REPLACE INTO issues VALUES (?, ?, ?, ?, ?, ?)`,
        issue.id,
        repo,
        issue.title,
        issue.body,
        issue.html_url,
        issue.created_at
      );
    }

    res.json({
      repo,
      issues_fetched: issues.length,
      cached_successfully: true,
    });
  } catch (error) {
    return res.status(error.status).json({ error: error.message });
  }
};

const githubController = {
  getRepoIssues,
};

export default githubController;
