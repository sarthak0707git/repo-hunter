import React from "react";
import DomainSelector from "../components/DomainSelector";

// This is the exact HomePage component from App.jsx
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
}) {
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

export default HomePage;