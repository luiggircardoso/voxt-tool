import { PlayIcon, PlusIcon, X, ChevronDown } from "lucide-react"
import { open } from '@tauri-apps/plugin-dialog';
import { convertFileSrc } from '@tauri-apps/api/core';
import { useState } from "react";
import MicSelection from "../components/Sidebar/MicSelection";  
import { useSprites, SpriteData } from '../contexts/SpriteContext';

type SidebarProps = {
  isVisible: boolean;
  onToggle: () => void;
  setDefaultState?: React.Dispatch<React.SetStateAction<string>>;
  setTalkingState?: React.Dispatch<React.SetStateAction<string>>;
  setImage?: React.Dispatch<React.SetStateAction<string>>;
  setState?: React.Dispatch<React.SetStateAction<string>>;
};

export default function Sidebar({ isVisible, onToggle }: SidebarProps) {
  const { sprites, updateSpriteState, addSprites, removeSprite } = useSprites();
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const handleAddSprite = async () => {
    const files = await open({
      multiple: true, 
      filters: [
        { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif'] },
      ],
    });

    console.log('Selected files:', files);

    if (files) {
      const selectedFiles = Array.isArray(files) ? files : [files];
      const newSprites: SpriteData[] = selectedFiles.map(path => ({
        path,
        state: 'Default'
      }));
      addSprites(newSprites);
    }
  };

  return (
    <aside className={`bg-[#181818] w-1/5 max-w-[415px] min-w-[220px] min-h-screen flex flex-col relative p-4 sm:p-6 gap-4 box-border border-r-gray-500 border-1 z-10
                        transition-all duration-300 ease-in-out
                        ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'}`}>
      <div className="flex items-center justify-between w-full mb-4">
        <span className="text-white text-[22px] sm:text-[29px] font-normal title leading-[150%] select-none">
          Voxt
        </span>

        <div className="flex items-center gap-2 ml-2">
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
        <button onClick={handleAddSprite} className="w-full text-white rounded flex items-center justify-center h-10 border-1 border-gray-500 transition-colors center hover:bg-gray-700 bg-gray-800">
          <PlusIcon /> <span className="ml-2">Add Sprite</span>
        </button>
        
        {sprites.length > 0 && (
          <div className="mt-4">
            <h3 className="text-white text-sm font-medium mb-2">Sprites:</h3>
            <div className="grid grid-cols-2 gap-2">
              {sprites.map((sprite, index) => {
                const convertedSrc = convertFileSrc(sprite.path);
                console.log('Original path:', sprite.path);
                console.log('Converted src:', convertedSrc);
                
                return (
                  <div key={index} className="bg-gray-700/50 border-1 border-gray-500 rounded p-2 group aspect-square flex flex-col relative">
                    <button
                      onClick={() => removeSprite(index)}
                      className="absolute -top-1 -right-1 p-1 hover:bg-red-500 rounded-full transition-colors opacity-0 group-hover:opacity-100 z-10 bg-red-800 shadow-lg"
                      aria-label="Remove sprite"
                    >
                      <X size={14} className="text-white" />
                    </button>

                    <div className="flex-[0.7] mb-2 relative">
                      <img 
                        src={convertedSrc}
                        alt={`Sprite ${index + 1}`} 
                        className="w-full h-full object-cover rounded border-1 border-gray-500 bg-gray-600" 
                        onError={(e) => {
                          console.error('Image failed to load:', convertedSrc);
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                    
                    <div className="flex-[0.3] flex flex-col justify-between text-xs">
                      {/* Name line */}
                      <div className="text-gray-300 truncate mb-1 bg-gray-800/30 px-2 py-1 rounded">
                        {sprite.path.split(/[/\\]/).pop()}
                      </div>
                      
                      <div className="relative w-full">
                        <button 
                          className="flex items-center justify-between text-gray-400 hover:text-gray-200 transition-colors bg-gray-600/50 rounded px-2 py-1 w-full peer"
                          onMouseEnter={() => setOpenDropdown(index)}
                          onMouseLeave={() => setOpenDropdown(null)}
                        >
                          <span className="text-xs">{sprite.state}</span>
                          <ChevronDown size={10} />
                        </button>
                        <div 
                          className={`absolute bottom-full left-0 right-0 mb-1 bg-gray-800 border border-gray-600 rounded shadow-lg py-1 z-40 transition-all duration-200 ${
                            openDropdown === index ? 'opacity-100 visible' : 'opacity-0 invisible'
                          }`}
                          onMouseEnter={() => setOpenDropdown(index)}
                          onMouseLeave={() => setOpenDropdown(null)}
                        >
                          <button 
                            onClick={() => {
                              updateSpriteState(index, 'Default');
                              setOpenDropdown(null);
                            }}
                            className={`block w-full text-left px-3 py-1 text-xs whitespace-nowrap ${
                              sprite.state === 'Default' 
                                ? 'text-blue-400 bg-blue-900/20' 
                                : 'text-gray-300 hover:bg-gray-700'
                            }`}
                          >
                            Default
                          </button>
                          <button 
                            onClick={() => {
                              updateSpriteState(index, 'Talking');
                              setOpenDropdown(null);
                            }}
                            className={`block w-full text-left px-3 py-1 text-xs whitespace-nowrap ${
                              sprite.state === 'Talking' 
                                ? 'text-blue-400 bg-blue-900/20' 
                                : 'text-gray-300 hover:bg-gray-700'
                            }`}
                          >
                            Talking
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <MicSelection />
      </div>

    </aside>
  );
}
