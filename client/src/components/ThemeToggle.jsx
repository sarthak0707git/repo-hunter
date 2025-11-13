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
      className="flex h-9 w-16 cursor-pointer items-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-toggle)] px-1 transition-colors duration-200 hover:bg-[var(--bg-hover)]"
    >
      <div
        id="switch"
        className={`h-6 w-6 rounded-full bg-[var(--text-primary)] transition-transform duration-300 ${isLight ? "translate-x-7" : "translate-x-0"
          }`}
      ></div>
    </div>
  );

}

export default ThemeToggle;
