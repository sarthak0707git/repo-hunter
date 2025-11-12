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
    <div className="flex flex-col items-center h-full w-full">
      <Topbar />
      <h1 className="mb-[20px] text-3xl font-bold underline">Repo Hunter</h1>
      <h2>Your place for hunting GitHub Repos</h2>
      <DomainSelector setTopics={setTopics} />
      {/*<Footer />*/}
    </div>
  );
}

export default App;
