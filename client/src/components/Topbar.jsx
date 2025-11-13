import ThemeToggle from "./ThemeToggle";

function Topbar() {
    return (
        <header className="sticky top-0 z-40 w-full border-b border-[var(--border-strong)] bg-[var(--bg-primary)] backdrop-blur">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <span className="text-base font-semibold tracking-tight text-[var(--text-primary)] sm:text-lg">
                    REPO HUNTER
                </span>
                <ThemeToggle />
            </div>
        </header>
    );
}

export default Topbar;