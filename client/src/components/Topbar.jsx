import ThemeToggle from "./ThemeToggle";

function Topbar() {
    return <div className="bg-gradient-to-b from-bg-tert to-bg-sec sticky w-full top-0 left-0 z-[1000] text-text flex items-center justify-end px-[50px] h-[75px]  shadow shadow-text mb-[20px]">
        <ThemeToggle />
    </div>
}

export default Topbar;