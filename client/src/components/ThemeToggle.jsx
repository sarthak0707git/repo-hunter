import { useState, useEffect } from "react";

function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isLight ? "light" : "dark",
    );
  }, [isLight]);

  return (
    <div
      id="theme-toggle"
      onClick={() => setIsLight(!isLight)}
      className="text-text border border-text rounded-full w-16 h-8 bg-bg-sec flex items-center transition-colors hover:bg-bg-tert cursor-pointer"
    >
      <div
        id="switch"
        className={`bg-text w-6 h-6 rounded-full ml-1 transition-transform duration-300 ${isLight ? "translate-x-8" : "translate-x-0"
          }`}
      ></div>
    </div>
  );

}

export default ThemeToggle;
