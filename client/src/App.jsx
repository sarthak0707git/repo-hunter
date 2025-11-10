import { useState } from "react";

import ThemeToggle from "./components/ThemeToggle";

import "./App.css";
import Topbar from "./components/Topbar";


function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center h-full w-full">
      <Topbar />
      <h1 className="mb-[20px] text-3xl font-bold underline">Repo Hunter</h1>
      <h2>Your place for hunting GitHub Repos</h2>
      
    </div>
  );
}

export default App;
