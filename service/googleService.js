const $ = require('axios');

// const client_id = '870265892476-hgnogvpolnojl3fpar7k0rff89q6it3e.apps.googleusercontent.com';
// const client_secret = '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';
const API_KEY = "AIzaSyCX58E_d_ZtxDyKaHPcA6-o14qI-ehNONI";

async function getPlaylistInfo(playlistId){
  const url = `https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&id=${playlistId}&key=${API_KEY}`;
  const responce = await $.get(url).then(res => res.data.items);
  if(responce.length <= 0 ){
    return null;
  }
  const p = responce[0];
  console.log("responce:", responce);
  
  return {
    id: p.id,
    name: p.snippet.title,
    thumb: p.snippet.thumbnails.default.url,
    total: p.contentDetails.itemCount
  }
}

async function getPlaylistItems(playlistId){
  const url = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${API_KEY}`;
  const responce = await $.get(url).then(res => res.data.items);
  if(responce.length <= 0 ){
    return [];
  }
  return responce.map(v => {
    return {
      id: v.id,
      source: `https://www.youtube.com/watch?v=${v.id}`,
      name: v.snippet.title,
      thumb: v.snippet.thumbnails.default.url,
      youtubeSource: `https://www.youtube.com/watch?v=${v.id}`,
      playlistId,
      artist: '',
    }
  });
}

// getPlaylistInfo('PL8upTLGKy41ynu9dMa2cyvAKNORr75hr4')

module.exports = {
  getPlaylistInfo,
  getPlaylistItems
}