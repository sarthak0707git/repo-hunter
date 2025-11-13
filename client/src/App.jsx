import { useState } from "react";

import ThemeToggle from "./components/ThemeToggle";

import "./App.css";
import Topbar from "./components/Topbar";
import Footer from "./components/Footer";
import DomainSelector from "./components/DomainSelector"; 

function App() {
  const [count, setCount] = useState(0);
  const [topics, setTopics] = useState([]);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased">
      <Topbar />
      <main className="mx-auto max-w-5xl flex w-full flex flex-col gap-10 px-4 py-12 ">
        
        <DomainSelector setTopics={setTopics} />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default App;
