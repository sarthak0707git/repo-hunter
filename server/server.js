import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

// --- Routes --- //

import getRepos from "./routes/getRepos.js";
import domain from "./routes/domain.js";
import commits from "./routes/commits.js";
import issues from "./routes/issues.js";
import repoDeets from "./routes/repoDeets.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
console.log("GITHUB_TOKEN exists:", !!process.env.GITHUB_TOKEN);

app.get("/", (req, res) => {
  res.send("Hello world!!");
});
app.use("/api/repos", getRepos);
app.use("/api/domain", domain);
app.use("/api/commits", commits);
app.use("/api/issues", issues);
app.use("/api/repo", repoDeets);
app.listen(5000, () => {
  console.log("Connected to PORT 5000");
});
