const path = require('path');
const fs = require('fs');

// import youtobeData from '../datas/youtube_data.json';
const youtobeData = require('../datas/youtube_data.json');
const domain = 'https://trandung.ddns.net';

function root_path(pathName) {
  return path.join(__dirname + `/../${pathName}`);
}

function datas_path(pathName) {
  return root_path('datas/') + pathName;
}

const _playlist = (name, id, thumb) => ({ name, id, thumb });
const _objAudio = (source, name, artist, thumb) => ({ source, name, artist, thumb });

const _playlistDefault = [
  _playlist('Sử ta chuyện xưa kể lại', '1', null),
  _playlist('Tiểu Thuyết Bố Già - The Godfather', '2', null),
  _playlist('Truyện cổ tích - Truyện cổ Grimm', '3', null),
  _playlist('Người tù khổ sai - Papillon - Audio Sách', '4', null),
];

const _playlistItems = {
  '1': [
    _objAudio('suTaChuyenXuaKeLai/gioi thieu.mp3', 'Giới thiệu', '', null),
  ],
  '2': [],
  '3': [],
  '4': [],
};

async function index(req, res, next) {
  const filePath = root_path('views/index.html');
  return res.sendFile(filePath);
}

async function video(req, res) {
  const fileName = req.params.f || '';
  // return res.json({fileName});
  const videoPath = path.join(datas_path(fileName));

  // return path.join(datas_path(fileName));
  const range = req.headers.range;
  if (!range) {
    return res.send('');
  }
  try {
    // const videoPath = path.join(datas_path(fileName));

    const videoSize = fs.statSync(videoPath).size;
    const CHUNK_SIZE = 10 ** 5; // 0.5MB
    let start = Number(range.replace(/\D/g, ""));
    let end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    let options = {};

    const bytesPrefix = "bytes=";
    if (range.startsWith(bytesPrefix)) {
      const bytesRange = range.substring(bytesPrefix.length);
      const parts = bytesRange.split("-");
      if (parts.length === 2) {
        const rangeStart = parts[0] && parts[0].trim();
        if (rangeStart && rangeStart.length > 0) {
          options.start = start = parseInt(rangeStart);
        }
        const rangeEnd = parts[1] && parts[1].trim();
        if (rangeEnd && rangeEnd.length > 0) {
          options.end = end = parseInt(rangeEnd);
        }
      }
    }

    const contentLength = end - start + 1;
    const headers = {
      "Connection": 'Keep-Alive',
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Type": "video/mp4",
      "Content-Length": contentLength,
    };
    res.writeHead(206, headers);
    // create video read stream for this particular chunk
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res); // Stream the video chunk to the client

  } catch (error) {
    console.log('ERROR: \n', { error }, '\n');
    throw error;
  }
}

async function playlist(req, res) {
  const resData = [];
  youtobeData.playlists.forEach((pl) => {
    resData.push({
      id: pl.id,
      name: pl.title,
      thumb: pl.thumbnail,
      total: pl.total_videos
    })
  })
  // return res.json({ p: youtobeData.playlists });
  return res.json(resData);
}

async function playlistItems(req, res) {
  const data = req.body;
  const { playlistId } = data;
  const resYItems = [];
  let rawYItems = [];

  youtobeData.playlists.forEach((pl) => {
    if (pl.id === playlistId) {
      rawYItems = pl.videos;
    }
  });
  rawYItems = rawYItems || [];
  rawYItems.sort((f, r) => {
    return f.position - r.position;
  });
  rawYItems.forEach((yv) => {
    yv.title = yv.title.replace('|', '-');
    resYItems.push({
      id: yv.id,
      source: `${domain}/media/video/${yv.title}.mp3`,
      name: yv.title,
      thumb: yv.thumbnail,
      artist: ''
    });
  });
  return res.json(resYItems);
}

async function test(req, res) {
  const fileName = 'tesst';
  return res.json({ fileName });
}


module.exports = {
  index,
  video,
  playlist,
  playlistItems,

  test,
}