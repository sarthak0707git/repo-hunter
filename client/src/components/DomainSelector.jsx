import { useEffect, useState } from "react";

function DomainSelector({ setTopics }) {
    const [domains, setDomains] = useState([]);
    const [selectedDomains, setSelectedDomains] = useState([]);
    const [topics, setLocalTopics] = useState([]);

    useEffect(() => {
        const fetchDomains = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/domain", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                if (response.ok) {
                    const data = await response.json();
                    setDomains(data);
                } else {
                    console.error("Failed to fetch domains");
                }
            } catch (error) {
                console.error("Error fetching domains:", error);
            }
        };
        fetchDomains();
    }, []);

    //when we click a domain
    const handleDomainClick = async (domain) => {
        //unselecting
        if (selectedDomains.includes(domain)) {
            setSelectedDomains((prev) => prev.filter((d) => d !== domain));

            //removing topics if unselected
            try {
                const response = await fetch(`http://localhost:5000/api/domain/${domain}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                if (response.ok) {
                    const data = await response.json(); // its topics
                    setLocalTopics((prev) => prev.filter((t) => !data.includes(t)));
                    setTopics((prev) => prev.filter((t) => !data.includes(t)));
                }
            } catch (error) {
                console.error("Error removing topics for unselected domain:", error);
            }
            return;
        }

        //if selected, fetches topics
        try {
            const response = await fetch(`http://localhost:5000/api/domain/${domain}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                const data = await response.json(); // array of topics
                setSelectedDomains((prev) => [...prev, domain]);
                setLocalTopics((prev) => [...prev, ...data]);
                setTopics((prev) => [...prev, ...data]); // update global topics
            } else {
                console.error(`Failed to fetch topics for ${domain}`);
            }
        } catch (error) {
            console.error("Error fetching topics:", error);
        }
    };

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
                        onClick={() => handleDomainClick(domain)}
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

            {topics.length > 0 && (
                <div className="panel-animate w-full rounded-md border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-5 text-left shadow-inner shadow-[var(--shadow)]/60 sm:p-6">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <h3 className="text-lg font-semibold text-[var(--text-strong)] sm:text-xl">
                            Topics from selected domains
                        </h3>
                        <span className="rounded-full border border-[var(--border-muted)] bg-[var(--bg-fourth)] px-3 py-1 text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
                            {topics.length} {topics.length === 1 ? "topic" : "topics"}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {topics.map((topic, idx) => (
                            <span
                                key={idx}
                                className="topic-animate rounded-full border border-[var(--border-muted)] bg-[var(--bg-fourth)] px-3 py-1 text-sm text-[var(--text-tertiary)]"
                            >
                                {topic}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default DomainSelector;