import "./App.css";

import { useEffect, useState } from "react";
import { PlayIcon } from "lucide-react";

function App() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [bgGreen, setBgGreen] = useState(false);

  // Define a single function to handle the toggle logic
  const toggleSidebarAndBg = () => {
    setSidebarVisible((v) => !v);
    setBgGreen((g) => !g);
  };

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.code === "Space") {
        toggleSidebarAndBg(); // Call the shared function
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main className={`flex min-h-screen transition-colors duration-300 ${bgGreen ? "bg-lime-400" : "bg-[#111111]"}`}>
      {/* Pass the toggle function as a prop to Sidebar */}
      {sidebarVisible && <Sidebar onToggle={toggleSidebarAndBg} />} 
      {/* Main content placeholder */}
      <div className={`content flex-1 flex items-center justify-center ${bgGreen ? "no-dots" : ""}`}>
        <img src="/vite.svg" className="w-1/2 h-1/2 select-none" />
      </div>
    </main>
  );
}

// Sidebar now accepts the onToggle prop
type SidebarProps = {
  onToggle: () => void;
};

function Sidebar({ onToggle }: SidebarProps) { 
  return (
    <aside className="bg-[#181818] w-1/5 max-w-[415px] min-w-[220px] min-h-screen flex flex-col relative p-4 sm:p-6 gap-4 box-border border-r-gray-500 border-1 z-10">
      <div className="flex items-center justify-between w-full mb-4">
        <span className="text-white text-[22px] sm:text-[29px] font-normal leading-[150%] font-sans select-none libre-caslon italic">PixelPal</span>
        <div className="relative group ml-2">
          <button
            onClick={onToggle}
            className="flex items-center justify-center border-1 border-gray-500 bg-gray-800 text-white rounded transition-colors"
            style={{ width: '2.25rem', height: '2.25rem' }}
            aria-label="Toggle Sidebar"
          >
            <PlayIcon size={24} />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-2 py-1 rounded bg-gray-700 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
            Toggle Sidebar (Ctrl + Space)
          </span>
        </div>
      </div>
      <div className="flex-1" />
    </aside>
  );
}

export default App;
