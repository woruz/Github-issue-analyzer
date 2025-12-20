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
    const issues = await db.all(`SELECT * FROM issues WHERE repo = ? ORDER BY created_at DESC LIMIT 5`, repo);

    if (!Array.isArray(issues) || issues.length === 0) {
      return res.status(404).json({
        error: "Repository not scanned or no cached issues available.",
      });
    }

    const analysis = await analyzeHelper.analyzeIssues(prompt, issues);
    if (!analysis || typeof analysis !== "string") {
      return res.status(502).json({
        error: "LLM failed to generate a valid analysis.",
      });
    }
    return res.status(200).json({ analysis });
  } catch (error) {
    const statusCode = error?.status || 500;

    return res.status(statusCode).json({
      error: error?.message || "Internal server error",
    });
  }
};

const analyzeController = {
  analyzeIssues
};

export default analyzeController;
