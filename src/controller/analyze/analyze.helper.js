import axios from "axios";

const OLLAMA_URL = process.env.OLLAMA_API_URL;
const MODEL = process.env.MODEL;

const analyzeIssues = async (prompt, issues) => {
  if (!prompt || typeof prompt !== "string") {
    const err = new Error("Prompt must be a non-empty string");
    err.status = 400;
    throw err;
  }

  if (!Array.isArray(issues) || issues.length === 0) {
    const err = new Error("No issues provided for analysis");
    err.status = 400;
    throw err;
  }

  if (!OLLAMA_URL || !MODEL) {
    const err = new Error("Ollama configuration missing");
    err.status = 500;
    throw err;
  }
  const issueChunks = chunkArray(issues, 2);
  let combinedAnalysis = "";

  for (let i = 0; i < issueChunks.length; i++) {
    const chunk = issueChunks[i];

    const issueText = chunk
      .map(
        (issue, idx) =>
          `Issue ${idx + 1}:\nTitle: ${issue.title}\nBody: ${sanitizeText(
            issue.body
          )}`
      )
      .join("\n\n");

    const fullPrompt = `
            Task:
            ${prompt}
            Issues:
            ${issueText}
            Respond concisely.
            `;

    try {
      const response = await axios.post(OLLAMA_URL, {
        model: MODEL,
        prompt: fullPrompt,
        stream: false,
        options: {
          num_predict: 250,
        },
      });

      combinedAnalysis += `\n\n--- Analysis Part ${i + 1} ---\n`;
      combinedAnalysis += response.data.response;
    } catch (err) {
      console.error("Ollama chunk failed:", err.response?.data || err.message);
      throw new Error("Local LLM failed due to context size");
    }
  }

  return combinedAnalysis.trim();
};

const analyzeIssuesStream = async (prompt, issues, res) => {
  const issueChunks = chunkArray(issues, 2);

  for (let i = 0; i < issueChunks.length; i++) {
    const chunk = issueChunks[i];

    const issueText = chunk
      .map(
        (issue, idx) =>
          `Issue ${idx + 1}:\nTitle: ${issue.title}\nBody: ${sanitizeText(
            issue.body
          )}`
      )
      .join("\n\n");

    const fullPrompt = `
Task:
${prompt}

Issues:
${issueText}

Respond concisely.
`;

    res.write(`\n--- Analyzing chunk ${i + 1}/${issueChunks.length} ---\n`);

    try {
      const response = await axios.post(process.env.OLLAMA_API_URL, {
        model: process.env.MODEL,
        prompt: fullPrompt,
        stream: false,
        options: {
          num_predict: 350,
        },
      });

      // 🔥 Stream Ollama response
      res.write(response.data.response + "\n");
    } catch (err) {
      res.write("\n❌ Ollama failed for this chunk\n");
      throw err;
    }
  }
};

const sanitizeText = (text, maxLength = 800) => {
  if (!text || typeof text !== "string") return "";
  return text
    .replace(/```[\s\S]*?```/g, "[code omitted]")
    .replace(/\n{3,}/g, "\n\n")
    .slice(0, maxLength);
};

const chunkArray = (arr, size) => {
  if (!Array.isArray(arr) || size <= 0) return [];
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

const analyzeHelper = {
  analyzeIssues,
  analyzeIssuesStream,
};

export default analyzeHelper;
