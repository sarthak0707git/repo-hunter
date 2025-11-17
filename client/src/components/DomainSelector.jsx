import { useEffect, useState } from "react";
import TopicBox from "./TopicBox";
import LanguageFilter from "./LanguageFilter";
import Card from "./card.jsx";

function DomainSelector({
  domains,
  selectedDomains,
  topics,
  handleDomainClick,
  selectedTopics,
  repos,
  loading,
  error,
  toggleTopic,
  fetchRepos,
  languages,
  selectedLanguages,
  toggleLanguage,
  srepo,
}) {
  return (
    <div className="flex w-full flex-col items-center gap-8 rounded-lg border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-8 text-center shadow-sm shadow-[var(--shadow)] ">
      <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-strong)] sm:text-3xl">
        Select Domains
      </h2>
      <p className="max-w-3xl text-sm text-[var(--text-secondary)] sm:text-base">
        Choose one or more focus areas to explore GitHub topics curated for that
        domain.
      </p>

      <div className="flex w-full flex-wrap justify-center gap-3 rounded-md border border-[var(--border-muted)] bg-[var(--bg-tertiary)] p-4 sm:gap-4 sm:p-8">
        {domains.map((domain) => (
          <button
            key={domain}
            onClick={() => handleDomainClick(domain)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-all duration-150 sm:px-5 sm:py-2.5 
              ${
                selectedDomains.includes(domain)
                  ? "bg-[var(--button-primary-bg)] text-white shadow-sm shadow-[var(--button-primary-bg)]/30 hover:bg-[var(--button-primary-hover)]"
                  : "border border-[var(--border-muted)] bg-[var(--bg-fourth)] text-[var(--text-strong)] hover:border-[var(--text-tertiary)] hover:bg-[var(--bg-hover)]"
              }`}
          >
            {domain}
          </button>
        ))}
      </div>
      <TopicBox
        topics={topics}
        selectedTopics={selectedTopics}
        repos={repos}
        loading={loading}
        error={error}
        toggleTopic={toggleTopic}
        fetchRepos={fetchRepos}
      />

      <LanguageFilter
        languages={languages}
        selectedLanguages={selectedLanguages}
        toggleLanguage={toggleLanguage}
      />

      {repos.length > 0 && (
        <div className="mt-6 w-full rounded-md border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-5 shadow-sm shadow-[var(--shadow)]/50">
          <h3 className="mb-4 text-lg font-semibold text-[var(--text-strong)]">
            Search Results ({repos.length})
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {repos.map((repo, idx) => (
              <Card key={idx} repo={repo} selectedrepo={srepo} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DomainSelector;
