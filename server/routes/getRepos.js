import express from "express";
import { Octokit } from "@octokit/core";
import { paginateRest } from "@octokit/plugin-paginate-rest";
const router = express.Router();

const MyOctokit = Octokit.plugin(paginateRest);
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
      const query = `${topicPart} in:readme,topics,description,name archived:false mirror:false template:false stars:>500 `;
      const response = await octokit.request("GET /search/repositories", {
        q: query,
        order: "desc",
        per_page: 100,
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        // Extract items from each page
      });
      console.log(`Found ${response.length} repos for query: ${query}`);
      allrepos.push(...response.data.items);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    const filteredRepos = allrepos.filter((repo) => {
      return repo.open_issues_count && repo.open_issues_count > 9;
    });

    const repos = filteredRepos.map((repo) => ({
      name: repo.name,
      fullname: repo.full_name,
      forks: repo.forks_count,
      stars: repo.stargazers_count,
      url: repo.html_url,
      language: repo.language,
      score: repo.score,
      open_issues: repo.open_issues_count,
      owner: repo.owner,
    }));

    console.log("Final repos :", repos);
    return res.json(repos);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "GitHub search failed" });
  }
});

export default router;
