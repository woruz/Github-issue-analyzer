# 🚀 GitHub Issue Analyzer  
### _Local Caching + LLM Processing_

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![SQLite](https://img.shields.io/badge/SQLite-Local%20Storage-blue)
![LLM](https://img.shields.io/badge/LLM-Ollama-orange)
![Backend](https://img.shields.io/badge/Type-Backend%20Only-lightgrey)

---

## 📌 Overview

**GitHub Issue Analyzer** is a backend service built with **Node.js** that enables intelligent analysis of GitHub issues using **Large Language Models (LLMs)**.

The service is designed to:

- 🔍 **Fetch and locally cache open GitHub issues** from any repository  
- 🧠 **Analyze cached issues using a natural-language prompt** and an LLM  
- ⚡ Provide fast, reusable insights without repeatedly hitting the GitHub API  

This project is **backend-only** and exposes two REST APIs:  
**`/scan`** and **`/analyze`**

---

## 🎯 Key Focus Areas

- Clean and intuitive **REST API design**
- **Local persistence** of GitHub issues
- **LLM-based reasoning** over real-world data
- Scalable, production-like **backend architecture**

> No UI is included — this project strictly focuses on backend engineering and intelligent data processing.

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js** – REST API server
- **Axios** – GitHub API integration
- **SQLite** – Local persistent storage
- **Ollama API** – LLM-powered analysis
- **dotenv** – Environment variable management

---

## 📂 Project Structure
```
github-issue-analyzer/
├── src/
│ ├── controller/
│ │ ├── analyze/
│ │ │ ├── analyze.controller.js # Analyze API controller
│ │ │ └── analyze.helper.js # LLM (Ollama) helper logic
│ │ └── github/
│ │ ├── github.controller.js # GitHub scan controller
│ │ └── github.helper.js # GitHub API helper logic
│ │
│ ├── platform/
│ │ └── db.js # SQLite database setup
│ │
│ ├── routes/
│ │ └── routes.js # API route definitions
│ │
│ └── index.js # Application entry point
│
├── data/
│ └── issues.db # SQLite database (generated at runtime)
│
├── .env # Environment variables (not committed)
├── .env.sample # Sample environment configuration
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

### 📌 Notes on Structure
```bash
- Controllers handle **request/response logic**
- Helpers encapsulate **GitHub API and LLM (Ollama) logic**
- `platform/db.js` is responsible for **database initialization**
- `issues.db` is generated at runtime and excluded from version control
```
---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/woruz/Github-issue-analyzer.git
cd Github-issue-analyzer
```

2️⃣ Install dependencies
```bash
npm install
```

3️⃣ Configure environment variables
```bash
Create a .env file in the root directory:

PORT=3000
GITHUB_TOKEN=your_github_personal_access_token
OLLAMA_API_URL=http://localhost:11434/api/generate
MODEL=your_model_name
```

▶️ Running the Server
```bash
node src/index.js
```

🔌 API Endpoints

🔍 POST /scan

Purpose:-
Fetch and locally cache all open GitHub issues for a given repository.

```json
Request Body
{
  "repo": "owner/repository-name"
}

Example:
{
  "repo": "facebook/react"
}


What Happens
Calls the GitHub REST API
Filters out pull requests
Extracts relevant issue data
Stores issues in local SQLite database

Response
{
  "repo": "facebook/react",
  "issues_fetched": 42,
  "cached_successfully": true
}
```



🧠 POST /analyze
Purpose:-
Analyze cached GitHub issues using a natural-language prompt and an LLM.

```json
Request Body
{
  "repo": "facebook/react",
  "prompt": "Find common themes and recommend what should be fixed first"
}


What Happens
Retrieves cached issues for the repository
Combines issues with user prompt
Sends context to an LLM
Returns a natural-language analysis

Response
{
  "analysis": "Most issues relate to crashes and memory leaks. Maintainers should prioritize fixing startup crashes and lifecycle-related bugs..."
}
```

💾 Storage Choice & Reasoning
✅ Chosen Storage: SQLite

### Why SQLite?

```bash
Persistent storage across server restarts
No external database required
Easy to inspect and query
Scales better than in-memory or JSON storage
Closely mirrors real-world backend systems
This makes SQLite the best balance between simplicity and production realism for this assignment.

```

### ⚠️ Edge Case Handling

```bash
The service gracefully handles:
Repository not yet scanned
No cached issues available
GitHub API errors or rate limits
LLM API failures
Empty or invalid input
```

### 🧪 Example Usage (cURL)

```bash
Scan a Repository
curl -X POST http://localhost:3000/scan \
  -H "Content-Type: application/json" \
  -d '{"repo":"facebook/react"}'

Analyze Issues
curl -X POST http://localhost:3000/analyze \
  -H "Content-Type: application/json" \
  -d '{"repo":"facebook/react","prompt":"Summarize major issue themes"}'
```

## 🤖 Prompts used

During development, the following LLM-related queries and investigations were performed.

### Queries Regarding OpenAI Credentials

- “How do I create OpenAI API credentials for using the Chat Completion API?”
- “How to generate and configure an OpenAI API key for a Node.js backend?”

---

### Queries Regarding OpenAI API Issues

- “Why is the OpenAI API returning authentication or quota errors?”
- “Why is the OpenAI API not working despite a valid API key?”

These queries helped identify issues related to:
- API quota limitations
- Billing requirements

---

### Queries Exploring LLM Alternatives

- “What are good alternatives to OpenAI for LLM-based text analysis?”
- “How to use local LLMs instead of cloud-based APIs?”
- “How to integrate Ollama with a Node.js backend?”
- “How to run LLama or Mistral or phi3 locally using Ollama?”
- “Why is Mistral or LLama model not working in my system?”
- “Give me a model that utilizes less RAM?”
- “Difference between CPU and GPU?”

---

### Final Decision

Based on these investigations, the project uses **Ollama** for local LLM inference.  
This approach removes external API dependencies, avoids rate limits and billing issues, and allows reliable natural-language analysis directly on the developer’s machine.


### 👤 Author
```bash
Sabil Danish
```
