import "./App.css";

import { Menu } from "lucide-react";
import { useEffect, useState } from "react";

function App() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [bgGreen, setBgGreen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.code === "Space") {
        setSidebarVisible((v) => !v);
        setBgGreen((g) => !g);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main className={`flex min-h-screen transition-colors duration-300 ${bgGreen ? "bg-lime-400" : "bg-black"}`}>
      {sidebarVisible && <Sidebar />}
      {/* Main content placeholder */}
      <div className="flex-1" />
    </main>
  );
}

function Sidebar() {
  return (
    <aside className="bg-[#181818] w-1/5 max-w-[415px] min-w-[220px] min-h-screen flex flex-col relative p-4 sm:p-6 gap-4 box-border z-10">
      <div className="absolute left-[17px] top-[18px] text-white text-[22px] sm:text-[29px] font-normal leading-[150%] font-sans select-none">PixelPal</div>
      <button
        className="absolute right-7 top-[18px] w-11 h-11 bg-[#1D1D1D] rounded-[9px] border border-[#313131] flex items-center justify-center text-white hover:bg-[#232323] transition-colors"
        aria-label="Sidebar Action"
      >
        <Menu />  
      </button>
    </aside>
  );
}

export default App;
