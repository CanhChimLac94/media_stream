const path = require('path');
const fs = require('fs');

module.exports = {
  index,
  video,

}

function root_path(pathName) {
  return path.join(__dirname + `/../${pathName}`);
}

function datas_path(pathName) {
  return root_path('datas/') + pathName;
}

async function index(req, res, next) {
  const filePath = root_path('views/index.html');
  return res.sendFile(filePath);
}

async function video(req, res) {
  const fileName = req.params.file || 'Nhạc thiền nhẹ nhàng thư giãn (Cổ Cầm).mp3';
  // return fileName;
  const range = req.headers.range;
  if (!range) {
    // res.status(400).send("Requires Range header");
    return res.send('');
  }
  try {
    // const videoPath = path.join('D:/02.DOWLOADS/Kiều (2021) Full HD - TVHAY.mp4');
    const videoPath = path.join(datas_path(fileName));

    const videoSize = fs.statSync(videoPath).size;
    const CHUNK_SIZE = 10 ** 5; // 0.5MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
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