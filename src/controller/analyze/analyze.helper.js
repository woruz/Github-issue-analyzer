import axios from "axios";

const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL = "phi3";

const analyzeIssues = async (prompt, issues) => {
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

const sanitizeText = (text, maxLength = 800) => {
  if (!text) return "";
  return text
    .replace(/```[\s\S]*?```/g, "[code omitted]")
    .replace(/\n{3,}/g, "\n\n")
    .slice(0, maxLength);
};

const chunkArray = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

const analyzeHelper = {
  analyzeIssues,
};

export default analyzeHelper;
