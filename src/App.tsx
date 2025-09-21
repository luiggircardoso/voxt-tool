import "./App.css";
import Sidebar from "./components/Sidebar";
import Sprite from "./components/Sprite";
import { useEffect, useState } from "react";

import {
  sendNotification
} from '@tauri-apps/plugin-notification';

function App() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [bgGreen, setBgGreen] = useState(false);

  const toggleSidebarAndBg = () => {
    setSidebarVisible((v) => !v);
    setBgGreen((g) => !g);
  };

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.ctrlKey && e.code === "Space") {
        e.preventDefault();
        toggleSidebarAndBg();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
    
  useEffect(() => {
    if (!sidebarVisible) {
        sendNotification({ title: 'Sidebar Hidden', body: 'Click CTRL + Space to make it visible again.' });
    }
  }, [sidebarVisible]);

  return (
    <main
      className={`flex min-h-screen transition-colors duration-300 ${
        bgGreen ? "bg-lime-400" : "bg-[#111111]"
      }`}
    >
      <Sidebar isVisible={sidebarVisible} onToggle={toggleSidebarAndBg} />
      <Sprite sidebarVisible={sidebarVisible} />
    </main>
  );
}

export default App;