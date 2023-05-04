const solicalDownload = require('../service/solicalService')

module.exports = {
  async getVideoInfo(req, res, next) {
    // const url = req.body.url || "https://www.youtube.com/watch?v=Rb0UmrCXxVA";
    const data = await solicalDownload.ssyoutube(
      req.body.url || "https://www.youtube.com/watch?v=Rb0UmrCXxVA"
    );
    return res.json(data);
  },
}