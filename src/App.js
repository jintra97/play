import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [nowPlaying, setNowPlaying] = useState(null);

  // haal de 'now playing'-informatie op
  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const response = await fetch("https://play-api-nine.vercel.app/api/now-playing");
        const data = await response.json();
        console.log("API data:", data);
        setNowPlaying(data);
      } catch (error) {
        console.error("fout bij ophalen now playing:", error);
      }
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 15000); // elke 15s updaten
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>what jintra is playing</h1>
        {nowPlaying ? (
          <div>
            <p>
              <strong>{nowPlaying.song}</strong> by {nowPlaying.artist}
            </p>
            <img
              src={nowPlaying.albumImage}
              alt="Album cover"
              style={{ width: "300px", borderRadius: "10px" }}
            />
          </div>
        ) : (
          <p>het is stil in jintra's airpods...</p>
        )}
      </header>
    </div>
  );
}

export default App;