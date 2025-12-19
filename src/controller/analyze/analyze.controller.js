import { db } from "../../platform/db.js";
import analyzeHelper from "./analyze.helper.js";

const analyzeIssues = async (req, res) => {
  try {
    const { repo, prompt } = req.body;
    if (!repo || !prompt) {
      return res.status(400).json({ error: "Missing repo or prompt" });
    }
    const issues = await db.all(`SELECT * FROM issues WHERE repo = ? ORDER BY created_at DESC LIMIT 5`, repo);

    if (!issues.length) {
      return res
        .status(400)
        .json({ error: "Repo not scanned or no issues cached" });
    }

    const analysis = await analyzeHelper.analyzeIssues(prompt, issues);
    if(!analysis) {
      return res.status(500).json({ error: "Analysis failed" });
    }
    return res.json({ analysis });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const analyzeController = {
  analyzeIssues,
};

export default analyzeController;
