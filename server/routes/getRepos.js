import express from "express";
import { Octokit } from "@octokit/core";
const router = express.Router();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});
router.post("/", async (req, res) => {
  try {
    const { topics = [] } = req.body;
    if (!topics.length) {
      return res.status(400).json({ message: "No topics provided" });
    }
    const modifiedTopics = [];
    /*
    const topics = [
      "operating-systems",
      "low-level",
      "networking",
      "systems-programming",
      "security",
      "embedded",
    ];

    
     const topics = [
      "blockchain",
      "cryptocurrency",
      "ethereum",
      "cryptography",
      "smart-contracts",
      "web3",
    ];
    */
    for (let i = 0; i < topics.length; i += 6) {
      modifiedTopics.push(topics.slice(i, i + 6));
    }
    /*
     TRY THIS IF YOU ARE NOT GETTING RESULTS 
     const topics = ["docker", "kubernetes", "api"]; // 10 topics
     const topicPart=topics.join(" OR ");
     const query = `${topicPart} in:name,topics,readme,description  stars:>100`
     ;
     OR try this simplest query
     const query=`topic:kubernetes language:go stars:>100`;
     */
    const allrepos = [];
    for (const chunk of modifiedTopics) {
      const topicPart = chunk.join(" OR ");
      const query = `${topicPart} in:readme,topics,description,name archived:false mirror:false template:false good-first-issues:>4 help-wanted-issues:>4 `;
      const response = await octokit.request("GET /search/repositories", {
        q: query,
        order: "desc",
        per_page: 100,
        page: 1,
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });
      allrepos.push(...response.data.items);
    }
    const repos = allrepos.map((repo) => ({
      name: repo.name,
      fullname: repo.full_name,
      forks: repo.forks_count,
      stars: repo.stargazers_count,
      url: repo.html_url,
      language: repo.language,
      score: repo.score,
    }));
    console.log("Final repos :", repos);
    return res.json(repos);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "GitHub search failed" });
  }
});

export default router;
