const SPOTIFY_BASE_URL = "https://api.spotify.com/v1";

async function getNowPlaying(accessToken) {
  try {
    const response = await fetch(`${SPOTIFY_BASE_URL}/me/player/currently-playing`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      return {
        song: data.item.name,
        artist: data.item.artists.map((artist) => artist.name).join(", "),
        albumImage: data.item.album.images[0].url,
      };
    } else {
      return { message: "het is stil in Jintra's airpods..." };
    }
  } catch (error) {
    console.error("fout bij verbinden met Jintra's airpdods:", error);
    return { error: "Jintra's airpods zijn buiten bereik..." };
  }
}

export { getNowPlaying };
