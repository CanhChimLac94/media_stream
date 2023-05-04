const path = require('path');
const fs = require('fs');
const MPlaylist = require('../Models/Playlist');
const MMedia = require('../Models/Media');
const ggService = require('../service/googleService.js');

// const youtobeData = require('../datas/youtube_data.json');
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
  const resData = await MPlaylist.find();
  return res.json(resData);
}

async function playlistItems(req, res) {
  const data = req.body;
  const { playlistId } = data;
  const resYItems = await MMedia.find({
    playlistId
  });
  return res.json(resYItems);
}

async function savePlaylistInfo(req, res){
  const playlistId = req.body.id;
  const p = await ggService.getPlaylistInfo(playlistId);
  if(!p){
    return res.json({
      status: 'fail',
      msg: "playlist is not exist!"
    });
  }
  const mp = new MPlaylist(p);
  mp.save();
  return res.json({
    status: 'success',
    msg: 'created playlist',
    data: {
      ...p
    }
  })
}

async function updatePlaylist(req, res){
  const PlaylistId = req.body.id;
  const p = await ggService.getPlaylistInfo(playlistId);
  if(!p){
    return res.json({
      status: 'fail',
      msg: "playlist is not exist!"
    });
  }
  const pOld = MPlaylist.findOneAndUpdate({id: playlistId}, p);
  
  return res.json({
    status: "success",
    msg: "update success"
  });
}

async function test(req, res) {
  const fileName = 'tesst';
  return res.json({ fileName });
}

function insertPlaylist(){
  MPlaylist.deleteMany({}, () => {});
  youtobeData.playlists.forEach(yv => {
    const p = new MPlaylist({
      id: yv.id,
      name: yv.title,
      thumb: yv.thumbnail,
      total: yv.total_videos,
    });
    p.save();
  });
}

function insertMedia(){
  MMedia.deleteMany({}, () => {});
  youtobeData.playlists.forEach(p => {
    p.videos.forEach(yv => {
      const m = new MMedia({
        id: yv.id,
        source: `/media/video/${yv.title}.mp3`,
        name: yv.title,
        thumb: yv.thumbnail,
        artist: '',
        youtubeSource: `https://www.youtube.com/watch?v=${yv.id}`,
        playlistId: p.id
      });
      m.save();
    });
  });
}

// insertMedia();
// insertPlaylist();
// getPlaylistInfo();

module.exports = {
  index,
  video,
  playlist,
  playlistItems,
  savePlaylistInfo,
  updatePlaylist,
  
  test,
}