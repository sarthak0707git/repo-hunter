import React from "react";
import DomainSelector from "../components/DomainSelector";

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
  languages,
  selectedLanguages,
  toggleLanguage,
}) {
  return (
    <main className="mx-auto max-w-5xl flex w-full flex-col gap-10 px-4 py-12">
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
        languages={languages}
        selectedLanguages={selectedLanguages}
        toggleLanguage={toggleLanguage}
      />
    </main>
  );
}

export default HomePage;

