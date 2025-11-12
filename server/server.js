import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import getRepos from "./routes/getRepos.js";
import domain from "./routes/domain.js";

const app = express();
dotenv.config();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send("Hello world!!");
});
app.use("/api/repos", getRepos);
app.use("/api/domain", domain);
app.listen(5000, () => {
  console.log("Connected to PORT 5000");
});
