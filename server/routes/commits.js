import express from "express";
import { Octokit } from "@octokit/core";
const router = express.Router();

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
    let attempts = 0;
    const maxAttempts = 3;
    let data = null;
    // Retry logic for GitHub stats API
    while (attempts < maxAttempts) {
      const response = await octokit.request(
        "GET /repos/{owner}/{repo}/stats/commit_activity",
        {
          owner: owner,
          repo: repo,
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        },
      );
      console.log(`Attempt ${attempts + 1} for ${owner}/${repo}`);
      console.log("Response status:", response.status);
      console.log("Response data type:", typeof response.data);
      console.log("Is array?", Array.isArray(response.data));
      // Check if data is ready (should be an array with 52 weeks)
      if (Array.isArray(response.data) && response.data.length > 0) {
        data = response.data;
        console.log(
          `✓ Stats ready for ${owner}/${repo} after ${attempts + 1} attempts`,
        );
        break;
      }

      // If status is 202, stats are being computed
      if (response.status === 202) {
        console.log(`Stats being computed for ${owner}/${repo}, waiting...`);
      }

      // If response is empty object or empty array, wait and retry
      console.log(
        `⏳ Attempt ${attempts + 1}: Stats not ready, retrying in 2s...`,
      );
      attempts++;
      if (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 15000)); // Wait 2 seconds
      }
    }
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch commit data" });
  }
});

export default router;
