import { useState, useEffect } from 'react';
import { useSprites } from '../contexts/SpriteContext';
import { convertFileSrc } from '@tauri-apps/api/core';

import '../App.css'

type Props = {
  sidebarVisible: boolean;
};

function Sprite({ sidebarVisible }: Props) {
  const { getDefaultSprite, getTalkingSprite } = useSprites();
  const defaultSprite = getDefaultSprite();
  const talkingSprite = getTalkingSprite();

  const [currentSprite, setCurrentSprite] = useState(defaultSprite);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let animationFrameId: number;

    async function setupAudio() {
      try {
        // Get the audio stream once and for all
        stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        source.connect(analyser);
        analyser.fftSize = 256;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateSprite = () => {
          if (!analyser) return;

          // Get the continuous audio data from the analyser
          analyser.getByteFrequencyData(dataArray);

          // Calculate if someone is speaking
          const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
          const isSpeaking = average > 10; // Threshold for voice detection

          // Switch sprites based on the audio level
          setCurrentSprite(isSpeaking ? talkingSprite : defaultSprite);

          // Continue the loop using requestAnimationFrame
          animationFrameId = requestAnimationFrame(updateSprite);
        };

        updateSprite(); // Start the animation loop

      } catch (err) {
        console.error("Error setting up audio:", err);
        // Fallback to default sprite if there's an error
        setCurrentSprite(defaultSprite);
      }
    }

    if (talkingSprite) {
      setupAudio();
    }

    // This is the clean-up function that runs when the component unmounts
    // or when the dependencies change.
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (stream) {
        // Stop all tracks in the audio stream
        stream.getTracks().forEach(track => track.stop());
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [talkingSprite, defaultSprite]);

  return (
    <div
      className={`
        content flex flex-1 items-center justify-center 
        transition-all duration-500 ease-in-out
        ${sidebarVisible ? 'relative' : 'absolute inset-0 no-dots'}
      `}
    >
      <img
        src={currentSprite ? convertFileSrc(currentSprite.path) : "/No_Image_Available.jpg"}
        className={`
          select-none transition-all duration-500 ease-in-out object-contain
          ${sidebarVisible ? 'max-w-[50%] max-h-[50%]' : 'max-w-[60%] max-h-[60%]'}
          ${currentSprite && currentSprite === talkingSprite ? 'animate-shake' : ''}
          `}
        alt={defaultSprite ? "Default sprite" : "No Image Available"}
      />
    </div>
  );
}

export default Sprite;