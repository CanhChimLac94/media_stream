const ytdl = require("ytdl-core");

async function index(req, res, next) {
  let url = req.body.url || "";

  try {
    const info = await ytdl.getInfo(url);

    return res.json({
      ...info.formats
        .filter(item =>
          (item.container === 'mp4'
            && item.hasVideo === true
            && item.audioBitrate === null)
          || (item.hasAudio === true && item.container === 'webm')
        )
        .sort((a, b) => {
          return a.mimeType < b.mimeType;
        }),
    });
  } catch (err) {
    return res.json({
      msg: 'error',
      err
    })
  }
}

async function getAudioSource(req, res, next){
  let url = req.body.urlVideo || "";
  try {
    const info = await ytdl.getInfo(url);
    const item = info.formats.find(item =>
          item.hasAudio === true && item.container === 'webm'
        );
    return res.json({
      ...item,
      audioPath: item.url
    });
  } catch (err) {
    return res.json({
      msg: 'error',
      err
    })
  }
}

module.exports = {
  index, getAudioSource
}