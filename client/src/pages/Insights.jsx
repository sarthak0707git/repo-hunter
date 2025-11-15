import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CommitChart from "../components/graph.jsx";
function Insights() {
  const { owner, repo } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
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

  return (
    <main className="mx-auto max-w-5xl flex w-full flex-col gap-10 px-4 py-12 ">
      <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-strong)] sm:text-3xl">
        Insights for: {owner}/{repo}
      </h1>
      <div className="flex flex-row">
        {loading && <p>Loading commit data...</p>}

        {error && <p className="text-red-500">Error: {error}</p>}

        {!loading && !error && monthlyData.length > 0 && (
          <CommitChart commitData={monthlyData} />
        )}

        {!loading && !error && monthlyData.length === 0 && (
          <p>No commit data available</p>
        )}
        <div className="w-1/2">
          <p>Display repo details in this box</p>
        </div>
      </div>
    </main>
  );
}

export default Insights;

