import React from "react";

export default function Card({ repo }) {
  const handleClick = () => {
    console.log("Card clicked:", repo.fullname);
    //FUNCTIONALITY JAGGU/PRASHU
  };

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
        ⭐ {repo.stars} • 🍴 {repo.forks}
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
          console.log("Save clicked:", repo.fullname);
        }}
      >
        Save
      </button>
    </div>
  );
}
