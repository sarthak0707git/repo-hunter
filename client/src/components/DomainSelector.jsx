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
        <div className="w-full flex flex-col items-center gap-4 mt-8">
            <h2 className="text-2xl font-semibold mb-2 text-[var(--text-primary)]">
                Select Domains
            </h2>

            <div className="flex flex-wrap justify-center gap-3 max-w-3xl">
                {domains.map((domain) => (
                    <button
                        key={domain}
                        onClick={() => handleDomainClick(domain)}
                        className={`px-4 py-2 rounded-lg border transition-all duration-200 
              ${selectedDomains.includes(domain)
                                ? "bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]"
                                : "bg-[var(--bg-secondary)] text-[var(--text-primary)] border-[var(--text-secondary)] hover:border-[var(--accent-secondary)]"
                            }`}
                    >
                        {domain}
                    </button>
                ))}
            </div>

            {topics.length > 0 && (
                <div className="w-full max-w-3xl mt-8 bg-[var(--bg-secondary)] p-4 rounded-lg shadow-md border border-[var(--text-secondary)]/20">
                    <h3 className="text-xl font-medium mb-3 text-[var(--accent-primary)]">
                        Topics from selected domains:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {topics.map((topic, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1 rounded-full text-sm bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--text-secondary)]/30"
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