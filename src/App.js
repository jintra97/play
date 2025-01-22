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
      <div className="templateContainer">
        <header>
          <a href="https://jintra.nl">
            <img
              className="logo"
              src="https://i.imgur.com/Goa2Ydw.png"
              alt="Jintra logo"
            />
          </a>
          <h1>wat jintra speelt</h1>
        </header>
        <main>
          {nowPlaying ? (
            <div className="nowPlayingContainer">
              <img
                className="albumCover"
                src={nowPlaying.albumImage}
                alt="Album cover"
              />
              <div className="trackInfo">
                <p className="songTitle">{nowPlaying.song}</p>
                <p className="artistName">{nowPlaying.artist}</p>
              </div>
            </div>
          ) : (
            <p className="noMusic">het is stil in jintra's airpods...</p>
          )}
        </main>
        <footer>
          <p>© 2025 Jintra — alle rechten voorbehouden.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
