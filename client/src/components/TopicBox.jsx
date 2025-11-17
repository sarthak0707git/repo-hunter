import React from "react";
import Card from "./card.jsx";

function TopicBox({
    topics,
    selectedTopics,
    repos,
    loading,
    error,
    toggleTopic,
    fetchRepos,
}) {

    if (!topics || topics.length === 0) return null;

    return (
        <>
            <div className="panel-animate w-full rounded-md border border-[var(--border-muted)] bg-[var(--bg-tertiary)] p-5 text-left shadow-inner shadow-[var(--shadow)]/60 sm:p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-[var(--text-strong)] sm:text-xl">
                        Topics from selected domains
                    </h3>

                    <div className="flex items-center gap-3">
                        <span className="rounded-full border border-[var(--border-muted)] bg-[var(--bg-fourth)] px-3 py-1 text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
                            {selectedTopics.length} selected
                        </span>

                        <button
                            onClick={fetchRepos}
                            className="rounded-md bg-[var(--button-primary-bg)] px-4 py-1.5 text-sm font-medium text-white shadow-sm shadow-[var(--button-primary-bg)]/30 hover:bg-[var(--button-primary-hover)] transition-all"
                        >
                            {loading ? "Searching..." : "Search"}
                        </button>
                    </div>
                </div>

                {/*Topic boxes*/}
                <div className="flex flex-wrap gap-2">
                    {topics.map((topic, idx) => {
                        const isSelected = selectedTopics.includes(topic);
                        return (
                            <span
                                key={idx}
                                onClick={() => toggleTopic(topic)}
                                className={`cursor-pointer select-none rounded-full border px-3 py-1 text-sm transition-all ${isSelected
                                    ? "bg-[var(--button-primary-bg)] text-white border-transparent"
                                    : "border-[var(--border-muted)] bg-[var(--bg-fourth)] text-[var(--text-tertiary)]"
                                    }`}
                            >
                                {topic}
                            </span>
                        );
                    })}
                </div>

                {error && (
                    <div className="mt-3 text-sm text-red-500">{error}</div>
                )}
            </div>
        </>
    );
}

export default TopicBox;
