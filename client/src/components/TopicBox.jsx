import { useState } from "react";
import Card from "./card.jsx";

function TopicBox({ topics }) {
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!topics || topics.length === 0) return null;

    const toggleTopic = (topic) => {
        setSelectedTopics((prev) =>
            prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
        );
    };

    const fetchRepos = async () => {
        // don't call if nothing selected
        if (selectedTopics.length === 0) {
            setError("Select at least one topic before searching.");
            return;
        }

        setError(null);
        setLoading(true);
        try {
            const res = await fetch("http://localhost:5000/api/repos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topics: selectedTopics }),
            });

            //error
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body?.message || `Server returned ${res.status}`);
            }

            //got repos
            const data = await res.json();
            setRepos(data || []);
        } catch (err) {
            console.error("Repo search failed:", err);
            setError("Repo search failed. See console for details.");
            setRepos([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="panel-animate w-full rounded-md border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-5 text-left shadow-inner shadow-[var(--shadow)]/60 sm:p-6">
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

                {/*error*/}
                {error && (
                    <div className="mt-3 text-sm text-red-500">{error}</div>
                )}
            </div>

            {/*repo results*/}
            {repos.length > 0 && (
                <div className="mt-6 w-full rounded-md border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-5 shadow-sm shadow-[var(--shadow)]/50">
                    <h3 className="mb-4 text-lg font-semibold text-[var(--text-strong)]">
                        Search Results ({repos.length})
                    </h3>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {repos.map((repo, idx) => (
                            <Card key={idx} repo={repo} />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default TopicBox;
