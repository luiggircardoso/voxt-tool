import { useState, useEffect } from "react";

function MicSelection() {
  const [mics, setMics] = useState<MediaDeviceInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getMicrophones() {
      try {
        setLoading(true);
        setError(null);

        let devices = await navigator.mediaDevices.enumerateDevices();
        let microphones = devices.filter(
          (device) => device.kind === "audioinput",
        );

        if (microphones.length === 0 || !microphones[0].label) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              audio: true,
            });

            stream.getTracks().forEach((track) => track.stop());

            devices = await navigator.mediaDevices.enumerateDevices();
            microphones = devices.filter(
              (device) => device.kind === "audioinput",
            );
          } catch (permissionError) {
            console.warn("Microphone permission denied:", permissionError);
            setError(
              "You know you need mic access to make this work... right? its the purpose",
            );
            setLoading(false);
            return;
          }
        }

        if (microphones.length === 0) {
          setError("Maybe, idk... CONNECT IT FIRST");
          setLoading(false);
          return;
        }

        const uniqueMics = microphones.filter((mic, index, self) => {
          const baseName = mic.label?.split(" (")[0] || mic.deviceId;

          return (
            index ===
            self.findIndex((m) => {
              const otherBaseName = m.label?.split(" (")[0] || m.deviceId;
              return otherBaseName === baseName;
            })
          );
        });

        setMics(uniqueMics);
        setLoading(false);
      } catch (error) {
        console.error("Error getting microphones:", error);
        setError(
          "Failed to access microphones. Please check your browser permissions.",
        );
        setLoading(false);
      }
    }

    getMicrophones();

    navigator.mediaDevices.addEventListener("devicechange", getMicrophones);

    return () => {
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        getMicrophones,
      );
    };
  }, []);

  if (loading) {
    return (
      <div className="text-white">
        <h3 className="text-white text-sm font-medium mb-2 mt-4">
          Microphones:
        </h3>
        <div className="text-gray-400 text-sm">Loading microphones...</div>
      </div>
    );
  }

  // My mic keeps disconnecting... now i know it works lmao
  if (error) {
    return (
      <div className="text-white">
        <h3 className="text-white text-sm font-medium mb-2 mt-4">
          Microphones:
        </h3>
        <div className="text-red-400 text-sm">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (mics.length === 0) {
    return (
      <div className="text-white">
        <h3 className="text-white text-sm font-medium mb-2 mt-4">
          Microphones:
        </h3>
        <div className="text-gray-400 text-sm">No microphones found</div>
      </div>
    );
  }

  return (
    <>
      <h3 className="text-white text-sm font-medium mb-2 mt-4">Microphones:</h3>
      <select
        id="micSelect"
        className="w-full bg-gray-800 text-white rounded h-10 border-1 border-gray-500 p-2"
      >
        <option value="">Select a microphone...</option>
        {mics.map((mic) => (
          <option key={mic.deviceId} value={mic.deviceId}>
            {mic.label || "Microphone " + mic.deviceId.slice(0, 8)}
          </option>
        ))}
      </select>
    </>
  );
}

export default MicSelection;
