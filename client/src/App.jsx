import { useState, useEffect } from "react";
import { Routes, Route, useParams } from "react-router-dom";

import "./App.css";
import Topbar from "./components/Topbar";
import Footer from "./components/Footer";
import DomainSelector from "./components/DomainSelector";

function HomePage({
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
}){
  return (
    <main className="mx-auto max-w-5xl flex w-full flex-col gap-10 px-4 py-12 ">
      <DomainSelector
        domains={domains}
        selectedDomains={selectedDomains}
        topics={topics}
        handleDomainClick={handleDomainClick}
        selectedTopics={selectedTopics}
        repos={repos}
        loading={loading}
        error={error}
        toggleTopic={toggleTopic}
        fetchRepos={fetchRepos}
      />
    </main>
  );
}

function Insights() {

  const { owner, repo } = useParams();

  return (
    <main className="mx-auto max-w-5xl flex w-full flex-col gap-10 px-4 py-12 ">
      <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-strong)] sm:text-3xl">
        Insights for: {owner}/{repo}
      </h1>
      {/* Add commit chart n other stuff  */}
    </main>
  );
}

function App() {
  const [domains, setDomains] = useState([]);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [topics, setTopics] = useState([]);

  const [selectedTopics, setSelectedTopics] = useState([]);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch domains only once when the App loads
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/domain", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) setDomains(await response.json());
        else console.error("Failed to fetch domains");
      } catch (error) {
        console.error("Error fetching domains:", error);
      }
    };
    fetchDomains();
  }, []);

  const handleDomainClick = async (domain) => {
    // Unselecting
    if (selectedDomains.includes(domain)) {
      setSelectedDomains((prev) => prev.filter((d) => d !== domain));
      // Removing topics if unselected
      try {
        const response = await fetch(
          `http://localhost:5000/api/domain/${domain}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
        );
        if (response.ok) {
          const data = await response.json(); // its topics
          setTopics((prev) => prev.filter((t) => !data.includes(t)));
        }
      } catch (error) {
        console.error("Error removing topics for unselected domain:", error);
      }
      return;
    }

    // Selecting
    try {
      const response = await fetch(
        `http://localhost:5000/api/domain/${domain}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response.ok) {
        const data = await response.json(); // Array of topics
        setSelectedDomains((prev) => [...prev, domain]);
        setTopics((prev) => [...prev, ...data]); // Update global topics
      } else {
        console.error(`Failed to fetch topics for ${domain}`);
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

// Topic/Repo Functions (Moved from TopicBox) 
  const toggleTopic = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    );
  };

  const fetchRepos = async () => {
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
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
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
    <div className="flex min-h-screen flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased">
      <Topbar />

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              domains={domains}
              selectedDomains={selectedDomains}
              topics={topics}
              handleDomainClick={handleDomainClick}
              selectedTopics={selectedTopics}
              repos={repos}
              loading={loading}
              error={error}
              toggleTopic={toggleTopic}
              fetchRepos={fetchRepos}
            />
          }
        />
        <Route path="/repo/:owner/:repo" element={<Insights />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;