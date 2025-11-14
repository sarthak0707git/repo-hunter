import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CommitChart from "../components/graph.jsx";


function Insights() {
  const { owner, repo } = useParams();
  const [commitData, setCommitData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  return (
    <main className="mx-auto max-w-5xl flex w-full flex-col gap-10 px-4 py-12 ">
      <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-strong)] sm:text-3xl">
        Insights for: {owner}/{repo}
      </h1>
    </main>
  );
}

export default Insights;