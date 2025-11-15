import express from "express";
import { Octokit } from "@octokit/core";
const router = express.Router();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

router.post("/", async (req, res) => {
  const { repo } = req.body;
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
    const response = await octokit.request("GET /search/issues", {
      q: `repo:${repo.owner.login}/${repo.name} state:open (label:"good first issue" OR label:"help wanted" OR label:"Good first Issue") `,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    res.json(response.data.total_count);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch issues data" });
  }
});
export default router;
