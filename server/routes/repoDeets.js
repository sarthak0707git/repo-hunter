import express from "express";
import { Octokit } from "@octokit/core";
const router = express.Router();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

router.get("/:owner/:repo", async (req, res) => {
  const { owner, repo } = req.params;
  try {
    const [detailsRes, languagesRes] = await Promise.all([
      octokit.request("GET /repos/{owner}/{repo}/", {
        owner: owner,
        repo: repo,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }),
      octokit.request("GET /repos/{owner}/{repo}/languages", {
        owner: owner,
        repo: repo,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }),
    ]);
    const details = detailsRes.data;
    const languages = languagesRes.data;
    res.json({
      details: {
        description: details.description,
        starCount: details.stargazers_count,
        forkCount: details.forks_count,
        updatedAt: details.updated_at,
      },
      languages: Object.keys(languages),
    });
  } catch (error) {
    console.error(`Failed to fetch repo details for ${owner}/${repo}:`, error);
    res.status(500).json({ error: "Failed to fetch repo details" });
  }
});

export default router;

