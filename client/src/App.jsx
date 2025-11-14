import { useState } from "react";

import { Routes, Route, useParams } from "react-router-dom";

import "./App.css";
import Topbar from "./components/Topbar";
import Footer from "./components/Footer";
import DomainSelector from "./components/DomainSelector";

function HomePage({ topics, setTopics }) {
  return (
    <main className="mx-auto max-w-5xl flex w-full flex-col gap-10 px-4 py-12 ">
      <DomainSelector setTopics={setTopics} />
      {/*Gotta add Card Components here*/}
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
  const [topics, setTopics] = useState([]);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased">
      <Topbar />

      <Routes>
        <Route
          path="/"
          element={<HomePage topics={topics} setTopics={setTopics} />}
        />

        <Route path="/repo/:owner/:repo" element={<Insights />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;