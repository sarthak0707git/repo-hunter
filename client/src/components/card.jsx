import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as clusterStorage from "../utils/clusterStorage";

export default function Card({ repo, clusterName, onRemove }) {
  const navigate = useNavigate();
  const [monthlyData, setMonthlyData] = useState([]);
  const [helpfulIssues, setHelpfulIssues] = useState([]);
<<<<<<< HEAD
  const [showMenu, setShowMenu] = useState(false);
  const [allClusters, setAllClusters] = useState([]);
  const [repoClusters, setRepoClusters] = useState([]);
  const menuRef = useRef(null);
  // Saving Repos
  const [isSaved, setIsSaved] = useState(false);
  useEffect(() => {
    setIsSaved(clusterStorage.IsRepoSavedInAnyCluster(repo.fullname));
=======
  const [isSaved, setIsSaved] = useState(false);
  useEffect(() => {
    setIsSaved(repoStorage.isRepoSaved(repo.fullname));
>>>>>>> e12cbd9 (modified graph,insights page)
  }, [repo.fullname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target))
        setShowMenu(false);
    }
    if (showMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);
  const handleClick = async () => {
    console.log("Card clicked:", repo.fullname);

<<<<<<< HEAD
    navigate(`/repo/${repo.owner_login}/${repo.name}`);
    try {
      const res = await fetch("http://localhost:5000/commits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo: repo }),
      });
      const commitData = await res.json();
      console.log("commitData is " + commitData);
      const weeksPerMonth = 4; // rough average
      let months = [];
      for (let i = 0; i < commitData.length; i += weeksPerMonth) {
        const monthSlice = commitData.slice(i, i + weeksPerMonth);

        const totalCommits = monthSlice.reduce(
          (sum, week) => sum + week.total,

          0
        );

        months.push(totalCommits);
      }
      //      if (months.length === 0) months = Array(13).fill(0);

      setMonthlyData(months);
      console.log("Monthly:", months);

=======
    // Saving Repos
    navigate(`/repo/${repo.owner.login}/${repo.name}`);
    try {
>>>>>>> e12cbd9 (modified graph,insights page)
      const response = await fetch(`http://localhost:5000/api/issues`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo: repo }),
      });
      if (response.ok) {
        const issues = await response.json();
        setHelpfulIssues(issues);
        console.log("issues", issues);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const refreshMenuData = () => {
    setAllClusters(clusterStorage.GetClusters());
    setRepoClusters(clusterStorage.GetClustersForRepo(repo.fullname));
  };

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    if (!showMenu) refreshMenuData();
    setShowMenu(!showMenu);
  };

  const handleCreateCluster = (e) => {
    e.stopPropagation();
    const newName = prompt("Enter new cluster name:");
    if (newName) {
      clusterStorage.CreateCluster(newName);
      refreshMenuData();
    }
  };

  const handleAddToCluster = (e, clusterName) => {
    e.stopPropagation();
    clusterStorage.SaveRepoToCluster(clusterName, repo);
    refreshMenuData();
    setIsSaved(true);
  };

  const handleRemoveFromCluster = (e, clusterName) => {
    e.stopPropagation();
    clusterStorage.RemoveRepoFromCluster(clusterName, repo.fullname);
    refreshMenuData();
    setIsSaved(clusterStorage.IsRepoSavedInAnyCluster(repo.fullname));
  };

  const isRemoving = clusterName && onRemove;

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    onRemove(repo.fullname);
  };

  const inClusters = repoClusters;
  const availableClusters = allClusters.filter(
    (c) => !repoClusters.includes(c)
  );

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer rounded-lg border border-[var(--border-muted)] bg-[var(--bg-fourth)] p-4 transition-all hover:border-[var(--text-tertiary)] hover:bg-[var(--bg-hover)]"
    >
      <h3 className="text-lg font-semibold text-[var(--text-strong)]">
        {repo.name}
      </h3>

      <p className="text-sm text-[var(--text-secondary)]">{repo.fullname}</p>

      <p className="mt-1 text-sm text-[var(--text-tertiary)]">
        ☆ {repo.stars} • ⑂ {repo.forks}
      </p>

      {repo.language && (
        <span className="mt-2 inline-block rounded-full border border-[var(--border-muted)] bg-[var(--bg-secondary)] px-2 py-1 text-xs text-[var(--text-tertiary)]">
          {repo.language}
        </span>
      )}

      {/* OPEN ISSUES idk what to do*/}
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Issues: {repo.open_issues}
      </p>

      {/* SAVE BUTTON to add functionality*/}
      <button
        className="mt-3 rounded-md bg-[var(--button-primary-bg)] px-3 py-1 text-sm text-white hover:bg-[var(--button-primary-hover)]"
        onClick={(e) => {
          e.stopPropagation();
          if (isSaved) {
            repoStorage.removeRepo(repo.fullname);
            setIsSaved(false);
          } else {
            repoStorage.saveRepo(repo);
            setIsSaved(true);
          }
        }}
      >
        {isSaved ? "Saved" : "Save"}
      </button>
    </div>
  );
}
