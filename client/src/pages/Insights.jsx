import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CommitChart from "../components/graph.jsx";

function Insights() {
  const { owner, repo } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [monthlyData, setMonthlyData] = useState([]);

  const [loadingDetails, setLoadingDetails] = useState(true);
  const [goodFirstIssues, setGoodFirstIssues] = useState(null);
  const [repoDetails, setRepoDetails] = useState(null);
  const [repoLanguages, setRepoLanguages] = useState([]);

  useEffect(() => {
    const fetchCommitData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/commits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ owner: owner, repo: repo }),
        });
        if (res.ok) {
          const commitData = await res.json();
          const weeks = commitData;
          console.log("commitData is ", commitData);
          const weeksPerMonth = 4; // rough average
          let months = [];
          for (let i = 0; i < weeks.length; i += weeksPerMonth) {
            const monthSlice = weeks.slice(i, i + weeksPerMonth);

            const totalCommits = monthSlice.reduce(
              (sum, week) => sum + week.total,
              0,
            );

            months.push(totalCommits);
          }
          if (months.length === 0) months = Array(13).fill(0);

          setMonthlyData(months);
          console.log("Monthly:", months);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCommitData();
  }, [owner, repo]);

  useEffect(() => {
    const fetchIssuesData = async () => {
      setGoodFirstIssues(null);
      try {
        const res = await fetch("http://localhost:5000/api/issues", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            repo: { owner: { login: owner }, name: repo },
          }),
        });
        if (res.ok) {
          const count = await res.json();
          setGoodFirstIssues(count);
        } else {
          console.error("Failed to fetch issues count");
          setGoodFirstIssues(0);
        }
      } catch (error) {
        console.error("Error fetching issues:", error);
        setGoodFirstIssues(0);
      }
    };
    fetchIssuesData();
  }, [owner, repo]);

  useEffect(() => {
    const fetchRepoDetails = async () => {
      try {
        setLoadingDetails(true);
        const res = await fetch(
          `http://localhost:5000/api/repo/${owner}/${repo}`,
        );
        if (res.ok) {
          const data = await res.json();
          setRepoDetails(data.details);
          setRepoLanguages(data.languages);
        } else console.error("Failed to fetch repo details");
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingDetails(false);
      }
    };
    fetchRepoDetails();
  }, [owner, repo]);

  const isLoading = loadingDetails;

  return (
    <main className="mx-auto max-w-5xl flex w-full flex-col gap-10 px-4 py-12 ">
      <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-strong)] sm:text-3xl">
        Insights for: {owner}/{repo}
      </h1>

      <div className="flex flex-col lg:flex-row w-full">
        {loading && <p>Loading commit data...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {!loading && !error && monthlyData.length > 0 && (
          <CommitChart commitData={monthlyData} />
        )}

        {!loading && !error && monthlyData.length === 0 && (
          <p>No commit data available</p>
        )}

        {/* <div className="w-1/2">
            <p>Display repo details in this box</p>
          </div> */}
        <div className="w-full lg:w-1/2 lg:pl-8 mt-8 lg:mt-0">
          <h2 className="text-xl font-semibold mb-4 text-[var(--text-strong)]">
            Repo Details
          </h2>
          <div className="space-y-4 p-4 rounded-lg border border-[var(--border-muted)]">
            {loadingDetails && (
              <p className="text-[var(--text-secondary)]">Loading details...</p>
            )}

            {!loadingDetails && repoDetails && (
              <>
                <p className="text-base text-[var(--text-secondary)]">
                  {repoDetails.description || "No description provided."}
                </p>

                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-[var(--text-tertiary)] uppercase">
                      Stars
                    </span>
                    <span className="text-2xl font-bold text-[var(--text-strong)]">
                      {repoDetails.starCount.toLocaleString() ?? "..."}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-[var(--text-tertiary)] uppercase">
                      Forks
                    </span>
                    <span className="text-2xl font-bold text-[var(--text-strong)]">
                      {repoDetails.forkCount.toLocaleString() ?? "..."}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-[var(--text-tertiary)] uppercase">
                      Good First Issues
                    </span>
                    <span className="text-2xl font-bold text-[var(--text-strong)]">
                      {goodFirstIssues ?? "..."}
                    </span>
                  </div>
                </div>

                {repoLanguages && repoLanguages.length > 0 && (
                  <div>
                    <h3 className="text-md font-semibold text-[var(--text-strong)] mb-2">
                      Languages
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {repoLanguages.map((lang) => (
                        <span
                          key={lang}
                          className="inline-block rounded-full border border-[var(--border-muted)] bg-[var(--bg-tertiary)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <a
                    href={`https://github.com/${owner}/${repo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" w-full text-sm font-medium text-[var(--button-primary-bg)]  "
                  >
                    {`${owner}/${repo}`}
                    <br />
                    (opens in a new tab)
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Insights;
