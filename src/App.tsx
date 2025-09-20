import "./App.css";
import Sidebar from "./components/Sidebar"
import Sprite from "./components/Sprite";
import { useEffect, useState } from "react";

function App() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [bgGreen, setBgGreen] = useState(false);

  const [defaultState, setDefaultState] = useState("");
  const [talkingState, setTalkingState] = useState("");
  const [image, setImage] = useState("");

  const toggleSidebarAndBg = () => {
    setSidebarVisible((v) => !v);
    setBgGreen((g) => !g);
  };

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.code === "Space") {
        e.preventDefault(); // Good practice to prevent default space behavior
        toggleSidebarAndBg();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main
      className={`flex min-h-screen transition-colors duration-300 ${bgGreen ? "bg-lime-400" : "bg-[#111111]"}`}
    >
      <Sidebar 
        isVisible={sidebarVisible} 
        onToggle={toggleSidebarAndBg}
        setDefaultState={setDefaultState}
        setTalkingState={setTalkingState} 
        setImage={setImage}
      />
      <Sprite sidebarVisible={sidebarVisible} />
    </main>
  );
}

export default App;