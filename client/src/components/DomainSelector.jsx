import { useEffect, useState } from "react";
import TopicBox from "./TopicBox";


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
}) {
    return (
        <div className="flex w-full flex-col items-center gap-8 rounded-lg border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-8 text-center shadow-sm shadow-[var(--shadow)] ">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-strong)] sm:text-3xl">
                Select Domains
            </h2>
            <p className="max-w-3xl text-sm text-[var(--text-secondary)] sm:text-base">
                Choose one or more focus areas to explore GitHub topics curated for that domain.
            </p>

            <div className="flex w-full flex-wrap justify-center gap-3 rounded-md border border-[var(--border-muted)] bg-[var(--bg-tertiary)] p-4 sm:gap-4 sm:p-8">
                {domains.map((domain) => (
                    <button
                        key={domain}
                        onClick={() => handleDomainClick(domain)} // Use the prop handler
                        className={`rounded-md px-4 py-2 text-sm font-medium transition-all duration-150 sm:px-5 sm:py-2.5 
              ${selectedDomains.includes(domain)
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
        </div>
    );
}

export default DomainSelector;