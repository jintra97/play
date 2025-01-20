import { getNowPlaying } from "./spotify";
import React, { useEffect, useState } from "react";

function App() {
  const [nowPlaying, setNowPlaying] = useState(null);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      const accessToken = "JE_ACCESS_TOKEN_HIER"; // Gebruik jouw Spotify-access token
      const data = await getNowPlaying(accessToken);
      setNowPlaying(data);
    };

    fetchNowPlaying();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>play.jintra.nl</h1>
      {nowPlaying ? (
        nowPlaying.error ? (
          <p>{nowPlaying.error}</p>
        ) : (
          <div>
            <img
              src={nowPlaying.albumImage}
              alt="Album cover"
              style={{ width: "300px", borderRadius: "10px" }}
            />
            <h2>{nowPlaying.song}</h2>
            <p>{nowPlaying.artist}</p>
          </div>
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
