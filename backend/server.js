const express = require("express");
const axios = require("axios");
require("dotenv").config();

console.log("client_id:", process.env.SPOTIFY_CLIENT_ID);
console.log("client_secret:", process.env.SPOTIFY_CLIENT_SECRET);
console.log("refresh_token:", process.env.SPOTIFY_REFRESH_TOKEN);

const app = express();
let accessToken = null;

// functie om een nieuw access token te krijgen met de refresh token
const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
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
    console.log("Nieuw access token opgehaald:", accessToken);
  } catch (err) {
    console.error("Fout bij het vernieuwen van access token:", err.response.data);
  }
};

// endpoint voor "Now Playing"
app.get("/now-playing", async (req, res) => {
  if (!accessToken) {
    await refreshAccessToken(); // token ophalen als er nog geen is
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

    if (response.data && response.data.item) {
      res.json({
        song: response.data.item.name,
        artist: response.data.item.artists
          .map((artist) => artist.name)
          .join(", "),
        albumImage: response.data.item.album.images[0].url,
      });
    } else {
      res.json({ message: "het is stil in jintra's airpods..." });
    }
  } catch (err) {
    if (err.response && err.response.status === 401) {
      console.log("Access token verlopen, vernieuwen...");
      await refreshAccessToken(); // token vernieuwen
      res.redirect("/now-playing"); // opnieuw proberen
    } else {
      console.error("Fout bij ophalen nummer:", err.response.data);
      res.status(500).json({ error: "kon niet ophalen wat je luistert." });
    }
  }
});

// server starten
app.listen(3000, () => {
  console.log("bi ba backend draait op http://localhost:3000");
  refreshAccessToken(); // haal direct een token bij opstarten
});
