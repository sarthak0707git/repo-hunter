import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CommitChart from "../components/graph.jsx";

function Insights() {
    const { owner, repo } = useParams();
    const [commitData, setCommitData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchCommitData = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(
                    `http://localhost:5000/api/commits/${owner}/${repo}`
                );
                if (!res.ok) {
                    const errData = await res.json().catch(() => ({}));
                    throw new Error(errData.error || "Failed to fetch commit data");
                }

                const weeklyData = await res.json(); // 52 Weeks

                if (!Array.isArray(weeklyData) || weeklyData.length === 0) {
                    throw new Error(
                        "Commit data is not available or is still being computed. Try again in a moment."
                    );
                }

                // Last 24 weeks
                const weeksPerMonth = 4;
                const monthsToShow = 6;
                const recentWeeks = weeklyData.slice(-weeksPerMonth * monthsToShow);
                const monthlyData = [];

                for (let i = 0; i < recentWeeks.length; i += weeksPerMonth) {
                    const monthSlice = recentWeeks.slice(i, i + weeksPerMonth);
                    const totalCommits = monthSlice.reduce(
                        (sum, week) => sum + week.total,
                        0
                    );
                    monthlyData.push(totalCommits);
                }

                // Ensure 6 data points
                while (monthlyData.length < monthsToShow) monthlyData.unshift(0);
                
                setCommitData(monthlyData);
            } catch (err) {
                setError(err.message);
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

            <div className="h-64 w-full rounded-lg border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-6 shadow-sm shadow-[var(--shadow)]">
                {loading && (
                    <p className="text-[var(--text-secondary)]">Loading commit data...</p>
                )}

                {error && <p className="text-red-500">{error}</p>}

                {commitData && (
                    <CommitChart commitData={commitData} />
                )}
            </div>
        </main>
    );
}


export default Insights;