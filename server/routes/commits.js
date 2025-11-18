import "dotenv/config"; // Add this line
import express from "express";
import { Octokit } from "@octokit/core";
const router = express.Router();
// In commits.js - Add this at the top to debug
console.log(
  "this is commit.js and GitHub Token:",
  process.env.GITHUB_TOKEN ? "✅ Found" : "❌ Missing",
);
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});
router.post("/", async (req, res) => {
  const { owner, repo } = req.body;
  /*
  const repo = {
    owner: {
      login: "dtrupenn",
      id: 872147,
    },
    name: "Tetris",
    full_name: "dtrupenn/Tetris",
  };
  */
  try {
    let retries = 0;
    const maxRetries = 4;
    let response;

    // Retry logic for GitHub stats API
    while (retries < maxRetries) {
      response = await octokit.request(
        "GET /repos/{owner}/{repo}/stats/commit_activity",
        {
          owner: owner,
          repo: repo,
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        },
      );
      if (Array.isArray(response.data) && response.data.length > 0) {
        console.log(
          `✓ Stats ready for ${owner}/${repo} after ${retries + 1} attempts`,
        );
        break;
      }
      // Check if data is ready (not 202 and not empty array)
      if (
        response.status === 200 &&
        response.data &&
        response.data.length > 0
      ) {
        break;
      }
      if (response.status === 202) {
        console.log(`Stats being computed for ${owner}/${repo}, waiting...`);
      }

      // Wait before retrying (exponential backoff)
      retries++;
      if (retries < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 20000));
      }
    }
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch commit data" });
  }
});

export default router;
