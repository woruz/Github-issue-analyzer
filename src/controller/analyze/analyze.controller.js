import { db } from "../../platform/db.js";
import analyzeHelper from "./analyze.helper.js";

const analyzeIssues = async (req, res) => {
  try {
    const { repo, prompt } = req.body;
    if (!repo || typeof repo !== "string") {
      return res.status(400).json({
        error: "Invalid request. 'repo' must be a non-empty string.",
      });
    }

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        error: "Invalid request. 'prompt' must be a non-empty string.",
      });
    }

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.write("🔍 Fetching issues...\n");
    const issues = await db.all(`SELECT * FROM issues WHERE repo = ? ORDER BY created_at DESC LIMIT 4`, repo);

    if (!Array.isArray(issues) || issues.length === 0) {
      res.write("❌ No issues found\n");
      return res.end();
    }

    res.write(`✅ ${issues.length} issues loaded\n\n`);

    const analysis = await analyzeHelper.analyzeIssuesStream(prompt, issues, res);
    // if (!analysis || typeof analysis !== "string") {
    //   return res.status(502).json({
    //     error: "LLM failed to generate a valid analysis.",
    //   });
    // }
    res.write("\n✅ Analysis complete\n");
    res.end();
  } catch (error) {
    const statusCode = error?.status || 500;

    return res.status(statusCode).json({
      error: error?.message || "Internal server error",
    });
  }
};

const analyzeIssuesById = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { prompt } = req.body;
    if (!issueId || isNaN(issueId)) {
      return res.status(400).json({
        error: "Invalid request. 'issueId' must be a valid number.",
      });
    }
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        error: "Invalid request. 'prompt' must be a non-empty string.",
      });
    }

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.write(`🔍 Fetching issue ${issueId}...\n`);
    const issue = await db.get(`SELECT * FROM issues WHERE id = ?`, issueId);

    if (!issue) {
      res.write("❌ Issue not found\n");
      return res.end();
    }

    res.write("✅ Issue loaded\n\n");
    await analyzeHelper.analyzeIssuesStream(prompt, [issue], res);
    
    res.write("\n✅ Analysis complete\n");
    res.end();
  } catch (error) {
    const statusCode = error?.status || 500;

    return res.status(statusCode).json({
      error: error?.message || "Internal server error",
    });
  }
};

const analyzeController = {
  analyzeIssues,
  analyzeIssuesById
};

export default analyzeController;
