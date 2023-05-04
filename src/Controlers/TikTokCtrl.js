const tiktokService = require("../service/tiktokService");
// const TikTok = require("tiktok-search");


async function index(req, res, next) {
  let url = "#";
  url = req.body.url || url;
  return res.json([{
    ...await tiktokService.getInfo(url)
  }]);
}

const getInfo = async (req, res, next) => {
  const url = req.body.url || 'https://www.tiktok.com/@newjeans_official/video/7221008161719815426';
  const data = await TikTok.getInfo(url);
  return res.json(data);
}

const getUser = async (req, res, next) => {
  const username = req.body.userName || 'trantt0705';
  const data = await TikTok.getUser(username);
  return res.json(data);
}

const getEmbed = async (req, res, next) => {
  const url = req.body.url || 'https://www.tiktok.com/@scout2015/video/6718335390845095173';
  const data = await TikTok.getInfo(url);
  return res.json(data);
}

const validateURL = async (req, res, next) => {
  const url = req.body.url || 'https://www.tiktok.com/@scout2015/video/6718335390845095173';
  const data = await TikTok.getInfo(url);
  return res.json(data);
}

const test = async () => {
  const data = await TikTok.getUser('newjeans_official')
    .then(res => res.data);
  console.log(data);
}

// test();

module.exports = {
  index,
  getInfo,
  getUser,
  getEmbed,
  validateURL
}