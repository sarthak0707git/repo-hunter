export default function LanguageFilter({ languages = [], selectedLanguages = [], toggleLanguage }) {
    if (!languages || languages.length === 0) return null;

    return (
        <div className="w-full mt-4 rounded-md border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-4 text-left shadow-inner shadow-[var(--shadow)]/60">
            <div className="mb-3 flex items-center justify-between">
                <h4 className="text-md font-medium text-[var(--text-strong)]">Filter by language</h4>
                <span className="text-sm text-[var(--text-tertiary)]">{selectedLanguages.length} selected</span>
            </div>

            <div className="flex flex-wrap gap-2">
                {languages.map((lang, idx) => {
                    const isSelected = selectedLanguages.includes(lang);
                    return (
                        <button
                            key={idx}
                            onClick={() => toggleLanguage(lang)}
                            className={`cursor-pointer select-none rounded-full border px-3 py-1 text-sm transition-all ${isSelected
                                ? "bg-[var(--button-primary-bg)] text-white border-transparent"
                                : "border-[var(--border-muted)] bg-[var(--bg-fourth)] text-[var(--text-tertiary)]"
                                }`}
                        >
                            {lang}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
