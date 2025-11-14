import express from "express";
import { Octokit } from "@octokit/core";
const router = express.Router();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

router.get("/:repo", async (req, res) => {
  const { repo } = req.params;
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
    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/stats/commit_activity",
      {
        owner: repo.owner.login,
        repo: repo.name,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch commit data" });
  }
});

export default router;