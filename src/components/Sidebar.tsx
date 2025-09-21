import { PlayIcon, PlusIcon, SettingsIcon, X } from "lucide-react"
import { open } from '@tauri-apps/plugin-dialog';
import { useEffect, useState } from "react";

type SidebarProps = {
  isVisible: boolean;
  onToggle: () => void;
  setDefaultState?: React.Dispatch<React.SetStateAction<string>>;
  setTalkingState?: React.Dispatch<React.SetStateAction<string>>;
  setImage?: React.Dispatch<React.SetStateAction<string>>;
};

export default function Sidebar({ isVisible, onToggle }: SidebarProps) {
  const [paths, setPaths] = useState<string[]>([]);

  return (
    <aside className={`bg-[#181818] w-1/5 max-w-[415px] min-w-[220px] min-h-screen flex flex-col relative p-4 sm:p-6 gap-4 box-border border-r-gray-500 border-1 z-10
  transition-all duration-300 ease-in-out
  ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'}`}>
      <div className="flex items-center justify-between w-full mb-4">
        <span className="text-white text-[22px] sm:text-[29px] font-normal leading-[150%] select-none">
          Voxt
        </span>

        <div className="flex items-center gap-2 ml-2">
          <div className="relative group">
            <button
              className="flex items-center justify-center border-1 border-gray-500 bg-gray-800 text-white rounded transition-colors hover:bg-gray-700"
              style={{ width: "2.25rem", height: "2.25rem" }}
              aria-label="Settings"
            >
              <SettingsIcon size={24} />
            </button>

            <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-2 py-1 rounded bg-gray-700 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
              Settings
            </span>
          </div>

          <div className="relative group">
            <button
              onClick={onToggle}
              className="flex items-center justify-center border-1 border-gray-500 bg-gray-800 text-white rounded transition-colors"
              style={{ width: "2.25rem", height: "2.25rem" }}
              aria-label="Toggle Sidebar"
            >
              <PlayIcon size={24} />
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-2 py-1 rounded bg-gray-700 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
              Show Mode <span className="bg-gray-950 rounded font-mono px-1 py-0.5">CTRL</span> + <span className="bg-gray-950 rounded font-mono px-1 py-0.5">SPACE</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <button onClick={() => addSprite(setPaths)} className="w-full text-white rounded flex items-center justify-center h-10 border-1 border-gray-500 transition-colors center hover:bg-gray-700 bg-gray-800">
          <PlusIcon /> <span className="ml-2">Add Sprite</span>
        </button>
        
        {paths.length > 0 && (
          <div className="mt-4">
            <h3 className="text-white text-sm font-medium mb-2">Sprites:</h3>
            <div className="space-y-1">
              {paths.map((path, index) => (
                <div key={index} className="flex items-center justify-between text-gray-300 text-xs bg-gray-700/50 px-2 py-1 rounded group">
                  <span className="truncate flex-1 mr-2">
                    {path.split(/[/\\]/).pop()}
                  </span>
                  <button
                    onClick={() => removeSprite(index, setPaths)}
                    className="flex-shrink-0 p-1 hover:bg-red-500/20 rounded transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Remove sprite"
                  >
                    <X size={12} className="text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

  </aside>
);

async function addSprite(setPaths: React.Dispatch<React.SetStateAction<string[]>>) {
  const files = await open({
    multiple: true,
    filters: [
      { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif'] },
    ],
  });

  console.log('Selected files:', files);

  if (files) {
    const selectedFiles = Array.isArray(files) ? files : [files];
    setPaths((prevPaths) => [...prevPaths, ...selectedFiles]);
  }
}

function removeSprite(index: number, setPaths: React.Dispatch<React.SetStateAction<string[]>>) {
  setPaths(prevPaths => prevPaths.filter((_, i) => i !== index));
}}
