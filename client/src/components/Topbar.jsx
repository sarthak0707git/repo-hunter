import { useNavigate } from "react-router-dom";

import ThemeToggle from "./ThemeToggle";

function Topbar() {
    const navigate = useNavigate();
    return (
        <header className="sticky top-0 z-40 w-full border-b border-[var(--border-strong)] bg-[var(--bg-primary)] backdrop-blur">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8 ">
                <div className="flex items-center gap-6">

                    <span className="text-base font-semibold tracking-tight text-[var(--text-primary)] sm:text-lg hover:cursor-pointer" onClick={() => {
                        navigate(`/`);
                    }}
                    >
                        REPO HUNTER
                    </span>
                    <button
                        onClick={() => navigate('/clusters')}
                        className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        Clusters
                    </button>
                </div>

                <ThemeToggle />
            </div>
        </header>
    );
}

export default Topbar;