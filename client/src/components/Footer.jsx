function Footer() {
    return (
        <div className="bg-[var(--bg-secondary)]  w-full text-text flex items-center justify-center h-[60px] shadow shadow-text fixed bottom-0 left-0 z-[1000]">
            <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline transition-colors"
            >
                <img
                    className="w-[24px] h-[24px]"
                    src="https://pngimg.com/uploads/github/github_PNG40.png"
                    alt="GitHub logo"
                />
                <span>GitHub</span>
            </a>
        </div>
    );
}

export default Footer;
