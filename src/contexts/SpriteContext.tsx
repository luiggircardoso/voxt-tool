import React, { createContext, useContext, useState, ReactNode } from 'react';

export type SpriteData = {
  path: string;
  state: 'Default' | 'Talking';
};

type SpriteContextType = {
  sprites: SpriteData[];
  setSprites: React.Dispatch<React.SetStateAction<SpriteData[]>>;
  updateSpriteState: (index: number, newState: 'Default' | 'Talking') => void;
  getDefaultSprite: () => SpriteData | null;
  getTalkingSprite: () => SpriteData | null;
  getAllSprites: () => SpriteData[];
  addSprites: (newSprites: SpriteData[]) => void;
  removeSprite: (index: number) => void;
};

const SpriteContext = createContext<SpriteContextType | undefined>(undefined);

export const SpriteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sprites, setSprites] = useState<SpriteData[]>([]);
  
  const updateSpriteState = (index: number, newState: 'Default' | 'Talking') => {
    setSprites(prevSprites => {
      // First, find if there's already a sprite with the target state
      const existingIndex = prevSprites.findIndex(s => s.state === newState);
      
      // Create a new array with all sprites
      let updatedSprites = [...prevSprites];
      
      // If there's already a sprite with the target state, change it to the opposite state
      if (existingIndex !== -1 && existingIndex !== index) {
        const oppositeState = newState === 'Default' ? 'Talking' : 'Default';
        updatedSprites[existingIndex] = { 
          ...updatedSprites[existingIndex], 
          state: oppositeState 
        };
      }
      
      // Now set the selected sprite to the new state
      updatedSprites[index] = { 
        ...updatedSprites[index], 
        state: newState 
      };
      
      return updatedSprites;
    });
  };

  const getDefaultSprite = () => sprites.find(s => s.state === 'Default') || null;
  const getTalkingSprite = () => sprites.find(s => s.state === 'Talking') || null;
  const getAllSprites = () => sprites;

  const addSprites = (newSprites: SpriteData[]) => {
    setSprites(prevSprites => [...prevSprites, ...newSprites]);
  };

  const removeSprite = (index: number) => {
    setSprites(prevSprites => prevSprites.filter((_, i) => i !== index));
  };
  
  return (
    <SpriteContext.Provider value={{
      sprites,
      setSprites,
      updateSpriteState,
      getDefaultSprite,
      getTalkingSprite,
      getAllSprites,
      addSprites,
      removeSprite
    }}>
      {children}
    </SpriteContext.Provider>
  );
};

export const useSprites = () => {
  const context = useContext(SpriteContext);
  if (!context) {
    throw new Error('useSprites must be used within a SpriteProvider');
  }
  return context;
};