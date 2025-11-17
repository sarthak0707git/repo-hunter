import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as clusterStorage from "../utils/clusterStorage";

export default function Card({ repo, clusterName, onRemove }) {
  const navigate = useNavigate();
  const [monthlyData, setMonthlyData] = useState([]);
  const [helpfulIssues, setHelpfulIssues] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [allClusters, setAllClusters] = useState([]);
  const [repoClusters, setRepoClusters] = useState([]);
  const menuRef = useRef(null);
  useEffect(() => {
    setIsSaved(clusterStorage.IsRepoSavedInAnyCluster(repo.fullname));
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
    navigate(`/repo/${repo.owner.login}/${repo.name}`);
    try {
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
  // Saving Repos
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
    const confirmed = window.confirm(`Remove ${repo.fullname} from "${clusterName}"?`);
    if (!confirmed) return;
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

      <div className="relative mt-3" ref={menuRef}>
        {isRemoving ? (
          // "Remove" button (on SavedPage)
          <button
            className="rounded-md bg-[var(--bg-tertiary)] px-3 py-1 text-sm text-red-500 border border-transparent hover:border-[var(--border-strong)]"
            onClick={handleRemoveClick}
          >
            Remove
          </button>
        ) : (
          // "Add to Cluster" button (on Search Page)
          <button
            className={`rounded-md px-3 py-1 text-sm text-white ${isSaved
              ? "bg-[var(--text-tertiary)] hover:bg-[var(--text-secondary)]"
              : "bg-[var(--button-primary-bg)] hover:bg-[var(--button-primary-hover)]"
              }`}
            onClick={handleMenuToggle}
          >
            {isSaved ? "Saved" : "Save"}
          </button>
        )}

        {/* --- The Pop-up Menu --- */}
        {showMenu && (
          <div className="absolute top-full z-10 mt-2 min-w-48 rounded-md border border-[var(--border-strong)] bg-[var(--bg-secondary)] py-2 shadow-lg">
            {/* 1. Create New */}
            <button
              onClick={handleCreateCluster}
              className="block w-full px-4 py-2 text-left text-sm text-[var(--accent-primary)] hover:bg-[var(--bg-hover)]"
            >
              + Create New Cluster
            </button>
            <hr className="my-1 border-[var(--border-muted)]" />
            {/* 2. In Clusters (Remove) */}
            {inClusters.map((cluster) => (
              <button
                key={cluster}
                onClick={(e) => handleRemoveFromCluster(e, cluster)}
                className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
              >
                <span>{cluster}</span>
                <span className="text-xs text-red-500">Remove</span>
              </button>
            ))}
            {/* 3. Available Clusters (Add) */}
            {availableClusters.map((cluster) => (
              <button
                key={cluster}
                onClick={(e) => handleAddToCluster(e, cluster)}
                className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
              >
                <span>{cluster}</span>
                <span className="text-xs text-green-600">Add</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
