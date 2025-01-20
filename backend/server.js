const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
let accessToken = null;

// haal een access token van Spotify
const getAccessToken = async () => {
  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({
      grant_type: "client_credentials",
    }),
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  accessToken = response.data.access_token;
};

// endpoint voor "Now Playing"
app.get("/now-playing", async (req, res) => {
  if (!accessToken) {
    await getAccessToken();
  }

  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.data) {
      res.json({
        song: response.data.item.name,
        artist: response.data.item.artists.map((artist) => artist.name).join(", "),
        albumImage: response.data.item.album.images[0].url,
      });
    } else {
      res.json({ message: "het is stil in Jintra's airpods..." });
    }
  } catch (error) {
    console.error("fout bij verbinden met Jintra's airpdods:", error);
    res.status(500).json({ error: "Jintra's airpods zijn buiten bereik..." });
  }
});

app.listen(3000, () => console.log("Backend running on http://localhost:3000"));
