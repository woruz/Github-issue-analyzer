import { db } from "../../platform/db.js";
import githubHelper from "./github.helper.js";

const getRepoIssues = async (req, res) => {
  try {
    const { repo } = req.body;
    if(!repo || typeof repo !== 'string'){
      return res.status(400).json({
        error: "Invalid request. 'repo' must be a non-empty string (owner/repo).",
      });
    }
    const issues = await githubHelper.fetchIssues(repo);

    if (!Array.isArray(issues) || issues.length === 0) {
      return res.status(404).json({
        error: "No open issues found or repository does not exist.",
      });
    }

    await db.exec('BEGIN TRANSACTION');

    const insertQuery = `
      INSERT OR REPLACE INTO issues 
      (id, repo, title, body, url, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    for (const issue of issues) {
      await db.run(
        insertQuery,
        issue.id,
        repo,
        issue.title ?? '',
        issue.body ?? '',
        issue.html_url,
        issue.created_at
      );
    }

    await db.exec('COMMIT');


    res.json({
      repo,
      issues_fetched: issues.length,
      cached_successfully: true,
    });
  } catch (error) {
    try {
      await db.exec('ROLLBACK');
    } catch (_) {}

    const statusCode = error?.status || 500;

    return res.status(statusCode).json({
      error: error?.message || 'Internal server error',
    });
  }
};

const githubController = {
  getRepoIssues
};

export default githubController;
