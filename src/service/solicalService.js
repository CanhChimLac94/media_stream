const axios = require("axios");
const ytdl = require("ytdl-core");

const headers = {
  'accept': 'application/json, text/javascript, */*; q=0.01',
  'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
  'sec-ch-ua': '"Chromium";v="104", "Not A;Brand";v="99", "Google Chrome";v="104"',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
  // 'cookie': 'current_language=en; _ga=GA1.1.115940210.1660795490; _gcl_au=1.1.669324151.1660795490; _ga_5370HT04Z3=GS1.1.1660795489.1.1.1660795513.0.0.0',
};

const DOMAIN_TIKTOK_API = 'https://www.tikwm.com';
const DOMAIN_API = 'https://api.com.net.ai';
// const DOMAIN_YTB_API = 'https://ssyoutube.com/api/convert';
// const DOMAIN_API = 'https://api.com.net.ai/wp-json/aio-dl/video-data';


const ssyoutube = async (url) => {
  const info = await ytdl.getInfo(url);
  const { title } = info.videoDetails;
  const datas = info.formats
    .filter(item =>
      (
        item.hasVideo === true
        && item.hasAudio === true
      )
      || item.hasAudio === true
    )
    .sort((a, b) => {
      return a.mimeType < b.mimeType;
    })
    .map(item => {
      return {
        ...item,
        title,
        // quality: item.quality,
        titleDetail: `${title} (${item.qualityLabel || 'audio'}).${item.container}`
      }
    });
  // console.log("DEBUG SVC:", datas);
  return {
    title,
    links: datas
  };

  /**
   * remove soulution
    headers.Origin = 'https://ssyoutube.com';
    headers.Referer = 'https://ssyoutube.com';
    headers['Content-Type'] = 'application/json';
    const time = Date.now();
    const date = new Date(1703169814467);
    const dateEnd = new Date(1703156924268);
    console.log('TIME ts: ', date.toUTCString());
    console.log('TIME _ts: ', dateEnd.toUTCString());

    return axios.post(DOMAIN_YTB_API, {
      url: url,
      "ts": 0,
      "_ts": 0,
      "_tsc": 1,
      "_s": "1"
      // "ts": 0,
      // "_ts": 1,
      // "_tsc": 0,
      // "_s": 1
    }, {
      headers
    })
      .then(res => res.data)
      .catch(err => {
        console.log("ERROR: ", err);
        return {}
      });
   */
};

const sstiktok = async (url) => {
  const res = await axios.post(`${DOMAIN_TIKTOK_API}/api`, {}, {
    headers,
    params: {
      url: url,
      count: 12,
      cursor: 0,
      web: 1,
      hd: 1
    }
  });
  const { data, msg, code } = res.data;
  // console.log("Res data: ", res.data);
  if(-1 === code || !data){
    return {
      title: msg,
      msg,
      links: [],
    }
  }
  const { title, wmplay, hdplay, play, size, wm_size, hd_size } = data || {};
  const MB = (_size) => {
    const bit = 10472.14;
    return Math.ceil(_size / bit) / 100;
  }
  const nmSize = MB(size);
  const hdSize = MB(hd_size);
  const wmSize = MB(wm_size);

  // const [hdVideo] = await Promise.all([
  //   fetch(`${DOMAIN_TIKTOK_API}/${hdplay}`)
  // ])
  // console.log({hdVideo});
  // return {};

  return {
    domain: DOMAIN_TIKTOK_API,
    title,
    links: [
      {
        titleDetail: `No Watermark .mp4 (${nmSize}MB)`,
        url: `${DOMAIN_TIKTOK_API}/${play}`,
        size: nmSize
      },
      {
        titleDetail: `No Watermark(HD) .mp4 (${hdSize}MB)`,
        url: `${DOMAIN_TIKTOK_API}/${hdplay}`,
        size: hdSize
      },
      {
        titleDetail: `Watermark .mp4 (${wmSize}MB)`,
        url: `${DOMAIN_TIKTOK_API}/${wmplay}`,
        size: wmSize
      },
    ],
    // data,
    // res
  };
}

const ssVideo = async (url) => {
  if (!url) return null;
  const domain = (new URL(url)).hostname
    .replace('www.', '')
    .replace('vt.', '');
  switch (domain) {
    case 'youtube.com':
    case 'youtu.be':
      return ssyoutube(url);
    case 'tiktok.com':
    case 'vt.tiktok.com':
      // if ('/' === url[url.length - 1]) {
      //   // url[url.length - 1] = '';
      // }
      return sstiktok(url);
  }
  return [];
}

// ssVideo('https://vt.tiktok.com/ZSNpX87w7/').then(console.log)
// ssVideo('https://www.youtube.com/watch?v=Rb0UmrCXxVA').then(console.log)

module.exports = {
  ssyoutube,
  sstiktok,
  ssVideo,
}
