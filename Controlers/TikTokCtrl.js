const tiktokService = require("../service/tiktokService");

async function index(req, res, next) {
  let url = "#";
  url = req.body.url || url;
  return res.json([{
    ...await tiktokService.getInfo(url)
  }]);
}

module.exports = {
  index
}